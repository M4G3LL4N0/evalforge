import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { callOpenRouter, getModelIds } from "@/lib/eval/openrouter";
import { evaluateCompliance } from "@/lib/eval/compliance";
import { buildEvaluatorPrompt, buildJudgePrompt, FINAL_RATIONALE_QUALITY_CHECKLIST, HUMAN_REVIEW_CHECKLIST } from "@/lib/eval/prompts";
import {
  clampConfidence,
  dedupeStrings,
  mergeHumanChecks,
  mergeScores,
  normalizeRecommendation,
  parseEvaluatorJson,
  parseJudgeJson,
} from "@/lib/eval/scoring";
import type {
  EvalForgeEvaluationResult,
  EvalResultPayload,
  EvalScores,
  EvaluateRequestBody,
  ModelVote,
  Recommendation,
  ResponseEvaluation,
  TaskCategory,
} from "@/lib/eval/types";
import { CATEGORIES } from "@/lib/eval/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validate(body: unknown): { ok: true; data: EvaluateRequestBody & { category: TaskCategory } } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid JSON body." };
  const input = body as Record<string, unknown>;
  const category = String(input.category ?? "").trim();
  if (!CATEGORIES.includes(category as TaskCategory)) {
    return { ok: false, error: `Invalid category. Use one of: ${CATEGORIES.join(", ")}.` };
  }

  const prompt = String(input.prompt ?? "").trim();
  const responseA = String(input.responseA ?? "").trim();
  const responseB = String(input.responseB ?? "").trim();
  const rubric = String(input.rubric ?? "").trim();
  if (!prompt || !responseA || !responseB || !rubric) {
    return { ok: false, error: "Prompt, Response A, Response B, and Rubric are required." };
  }

  return {
    ok: true,
    data: {
      category: category as TaskCategory,
      prompt,
      responseA,
      responseB,
      rubric,
      specialInstructions: String(input.specialInstructions ?? "").trim(),
      referenceNotes: String(input.referenceNotes ?? "").trim(),
      platformPolicy: String(input.platformPolicy ?? "").trim(),
      taskInstructions: String(input.taskInstructions ?? "").trim(),
      isQualificationTask: Boolean(input.isQualificationTask),
      saysNoAI: Boolean(input.saysNoAI),
      saysNoOutsideTools: Boolean(input.saysNoOutsideTools),
      requiresExtension: Boolean(input.requiresExtension),
      isProctored: Boolean(input.isProctored),
      managedDevice: Boolean(input.managedDevice),
      finalSubmissionWillBePasted: Boolean(input.finalSubmissionWillBePasted),
    },
  };
}

function fallbackRecommendation(votes: Recommendation[]): Recommendation {
  const counts = votes.reduce(
    (acc, vote) => ({ ...acc, [vote]: (acc[vote] ?? 0) + 1 }),
    {} as Record<Recommendation, number>,
  );
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]) as Array<[Recommendation, number]>;
  if (!ranked.length) return "Needs Human Review";
  if (ranked.length > 1 && ranked[0][1] === ranked[1][1]) return "Tie";
  return ranked[0][0];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object");
}

function compactRecommendation(parsed: unknown): Recommendation | null {
  if (!isRecord(parsed) || parsed.recommendation === undefined) return null;
  return normalizeRecommendation(parsed.recommendation);
}

function recommendationFromParsed(parsed: unknown): Recommendation {
  const compact = compactRecommendation(parsed);
  if (compact) return compact;
  if (!isRecord(parsed)) return "Needs Human Review";

  const comparative = isRecord(parsed.comparativeQuality) ? parsed.comparativeQuality : null;
  const winner = comparative?.winner;
  if (winner === "A") return "A";
  if (winner === "B") return "B";
  if (winner === "tie") return "Tie";

  return "Needs Human Review";
}

function confidenceFromParsed(parsed: unknown): number | null {
  if (!isRecord(parsed)) return null;
  if (parsed.confidence !== undefined) return clampConfidence(parsed.confidence);

  const comparative = isRecord(parsed.comparativeQuality) ? parsed.comparativeQuality : null;
  if (comparative?.confidence === "high") return 85;
  if (comparative?.confidence === "medium") return 65;
  if (comparative?.confidence === "low") return 40;
  return null;
}

function scoreValue(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.min(10, value)) : fallback;
}

function scoreFromRating(value: unknown, fallback: number): number {
  if (!isRecord(value)) return fallback;
  return scoreValue(value.score, fallback);
}

function responseScores(response: unknown): EvalScores {
  if (!isRecord(response)) {
    return {
      instructionFollowing: 5,
      truthfulness: 5,
      completeness: 5,
      helpfulness: 5,
      safety: 8,
      writingQuality: 5,
      codingCorrectness: null,
      overall: 5,
    };
  }

  return {
    instructionFollowing: scoreFromRating(response.instructionFollowing, 5),
    truthfulness: scoreFromRating(response.truthfulness, 5),
    completeness: scoreFromRating(response.contentCompleteness, 5),
    helpfulness: scoreValue(response.weightedScore, 5),
    safety: scoreFromRating(response.harmlessnessSafety, 8),
    writingQuality: scoreFromRating(response.writingStyleTone, 5),
    codingCorrectness: null,
    overall: scoreFromRating(response.overallQuality, scoreValue(response.weightedScore, 5)),
  };
}

function scorePairFromParsed(parsed: unknown): { responseA: EvalScores; responseB: EvalScores } {
  if (isRecord(parsed) && isRecord(parsed.scores) && isRecord(parsed.scores.responseA) && isRecord(parsed.scores.responseB)) {
    return {
      responseA: parsed.scores.responseA as unknown as EvalScores,
      responseB: parsed.scores.responseB as unknown as EvalScores,
    };
  }

  if (isRecord(parsed)) {
    return {
      responseA: responseScores(parsed.responseA),
      responseB: responseScores(parsed.responseB),
    };
  }

  return {
    responseA: responseScores(null),
    responseB: responseScores(null),
  };
}

function stringList(parsed: unknown, key: string): string[] {
  if (!isRecord(parsed)) return [];
  return dedupeStrings(parsed[key]);
}

function responseSummary(parsed: unknown, side: "responseA" | "responseB"): string[] {
  if (!isRecord(parsed) || !isRecord(parsed[side])) return [];
  const summary = parsed[side].summary;
  return typeof summary === "string" && summary.trim() ? [summary.trim()] : [];
}

function responseFlags(parsed: unknown, side: "responseA" | "responseB", key: keyof ResponseEvaluation): string[] {
  if (!isRecord(parsed) || !isRecord(parsed[side])) return [];
  return dedupeStrings(parsed[side][key]);
}

function reasonFromParsed(parsed: unknown): string {
  if (isRecord(parsed)) {
    if (typeof parsed.reason === "string" && parsed.reason.trim()) return parsed.reason.trim();
    if (typeof parsed.summary === "string" && parsed.summary.trim()) return parsed.summary.trim();
    const comparative = isRecord(parsed.comparativeQuality) ? parsed.comparativeQuality : null;
    if (typeof comparative?.comment === "string" && comparative.comment.trim()) return comparative.comment.trim();
  }
  return "No structured rationale returned.";
}

function risksFromParsed(parsed: unknown): string[] {
  if (!isRecord(parsed)) return [];
  return dedupeStrings([
    ...dedupeStrings(parsed.risks),
    ...dedupeStrings(parsed.riskFlags),
    ...dedupeStrings(parsed.humanReviewReasons),
    ...responseFlags(parsed, "responseA", "majorRedFlags"),
    ...responseFlags(parsed, "responseB", "majorRedFlags"),
  ]);
}

function finalDraftFromEvalForge(parsed: unknown): string | null {
  if (!isRecord(parsed)) return null;
  if (typeof parsed.finalDraft === "string" && parsed.finalDraft.trim()) return parsed.finalDraft.trim();

  const result = parsed as Partial<EvalForgeEvaluationResult>;
  if (!result.comparativeQuality || !result.responseA || !result.responseB) return null;

  return [
    `Recommendation: ${recommendationFromParsed(parsed)}.`,
    "",
    result.comparativeQuality.comment,
    "",
    `Response A: ${result.responseA.summary}`,
    `Response B: ${result.responseB.summary}`,
    "",
    "Manual human approval required before using this recommendation.",
  ]
    .filter(Boolean)
    .join("\n");
}

function polishRationaleText(value: string): string {
  return value
    .replace(/\btherefor\b/gi, "therefore")
    .replace(/\bchose\s+Response\b/g, "chose Response")
    .replace(/\bchoose\s+(Response [AB])\b/gi, "chose $1")
    .replace(/\bresponse a\b/g, "Response A")
    .replace(/\bresponse b\b/g, "Response B")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function rationaleQualityGuidance(category: TaskCategory): string[] {
  const subjectiveCategories: TaskCategory[] = ["creative_writing", "rewriting", "email_or_message"];
  const factualCategories: TaskCategory[] = [
    "general_qa",
    "coding",
    "math",
    "medical",
    "legal",
    "financial",
    "travel",
    "recipe",
    "recommendation",
    "classification",
    "list_generation",
  ];
  const formattingCategories: TaskCategory[] = ["summarization", "word_puzzle", "email_or_message", "list_generation"];

  return [
    ...FINAL_RATIONALE_QUALITY_CHECKLIST.slice(0, 4),
    "Name the winning response and the deciding dimension.",
    "Cite a specific strength of the winner and a specific weakness of the other response.",
    subjectiveCategories.includes(category) ? "For subjective judgments, include concrete wording, tone, style, or format examples." : "",
    factualCategories.includes(category) ? "For factual judgments, identify checked claims or claims that still need verification." : "",
    formattingCategories.includes(category) ? "For formatting judgments, mention the exact formatting constraint." : "",
    "Use polished grammar and avoid vague claims.",
  ].filter(Boolean);
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const valid = validate(body);
  if (!valid.ok) return NextResponse.json({ error: valid.error }, { status: 400 });
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "Missing OPENROUTER_API_KEY. Add it to .env.local and restart the server." },
      { status: 503 },
    );
  }

  const data = valid.data;
  const compliance = evaluateCompliance({
    platformPolicy: data.platformPolicy,
    taskInstructions: data.taskInstructions,
    isQualificationTask: data.isQualificationTask,
    saysNoAI: data.saysNoAI,
    saysNoOutsideTools: data.saysNoOutsideTools,
    requiresExtension: data.requiresExtension,
    isProctored: data.isProctored,
    managedDevice: data.managedDevice,
    finalSubmissionWillBePasted: data.finalSubmissionWillBePasted,
  });
  const models = getModelIds();
  const shared = {
    category: data.category,
    prompt: data.prompt,
    responseA: data.responseA,
    responseB: data.responseB,
    rubric: data.rubric,
    specialInstructions: data.specialInstructions,
    referenceNotes: data.referenceNotes,
    platformPolicy: data.platformPolicy,
    taskInstructions: data.taskInstructions,
    aiUseClassification: compliance.aiUseClassification,
    policyRisk: compliance.policyRisk,
    monitoringRisk: compliance.monitoringRisk,
  };

  const tasks = [
    { role: "fast" as const, model: models.fast, prompt: buildEvaluatorPrompt({ ...shared, role: "fast" }) },
    { role: "deep" as const, model: models.deep, prompt: buildEvaluatorPrompt({ ...shared, role: "deep" }) },
    { role: "skeptic" as const, model: models.skeptic, prompt: buildEvaluatorPrompt({ ...shared, role: "skeptic" }) },
  ];

  const settled = await Promise.allSettled(
    tasks.map(async (task) => {
      const response = await callOpenRouter({
        model: task.model,
        messages: [{ role: "user", content: task.prompt }],
        temperature: 0.2,
        maxTokens: 4096,
      });
      return { ...task, content: response.content, raw: response.raw, parsed: parseEvaluatorJson(response.content) };
    }),
  );

  const evaluatorRecords = settled.map((result, index) => {
    const task = tasks[index];
    if (result.status === "fulfilled") return result.value;
    const error = result.reason instanceof Error ? result.reason.message : String(result.reason);
    return { ...task, content: "", raw: {}, parsed: parseEvaluatorJson(""), error };
  });

  const successfulEvaluators = evaluatorRecords.filter((record) => !("error" in record));
  if (!successfulEvaluators.length) {
    return NextResponse.json(
      {
        error: "All evaluator models failed. Check your OpenRouter key, model access, and network connectivity.",
        details: evaluatorRecords.map((record) => ({ role: record.role, model: record.model, error: "error" in record ? record.error : undefined })),
      },
      { status: 502 },
    );
  }

  let judgeContent = "";
  let judgeRaw: Record<string, unknown> = {};
  let judgeParsed = parseJudgeJson("");
  let judgeError: string | undefined;
  try {
    const judgePrompt = buildJudgePrompt({
      ...shared,
      evaluatorOutputsJson: JSON.stringify(
        evaluatorRecords.map((record) => ({
          role: record.role,
          model: record.model,
          parsed: record.parsed,
          rawText: record.content.slice(0, 12000),
          error: "error" in record ? record.error : undefined,
        })),
        null,
        2,
      ),
    });
    const judge = await callOpenRouter({
      model: models.judge,
      messages: [{ role: "user", content: judgePrompt }],
      temperature: 0.15,
      maxTokens: 8192,
    });
    judgeContent = judge.content;
    judgeRaw = judge.raw;
    judgeParsed = parseJudgeJson(judgeContent);
  } catch (error) {
    judgeError = error instanceof Error ? error.message : String(error);
    judgeContent = judgeError;
  }

  const evaluatorVotes = evaluatorRecords.map((record) => recommendationFromParsed(record.parsed));
  const recommendation =
    compactRecommendation(judgeParsed) || recommendationFromParsed(judgeParsed) !== "Needs Human Review"
      ? recommendationFromParsed(judgeParsed)
      : fallbackRecommendation(evaluatorVotes);
  const judgeConfidence = confidenceFromParsed(judgeParsed);
  const confidence =
    judgeConfidence !== null
      ? judgeConfidence
      : Math.round(
          successfulEvaluators.reduce((sum, record) => sum + (confidenceFromParsed(record.parsed) ?? 50), 0) /
            Math.max(1, successfulEvaluators.length),
        );

  const scores = mergeScores(
    successfulEvaluators.map((record) => scorePairFromParsed(record.parsed)),
    scorePairFromParsed(judgeParsed),
    data.category,
  );

  const modelVotes: ModelVote[] = [
    ...evaluatorRecords.map((record) => ({
      model: record.model,
      role: record.role,
      recommendation: recommendationFromParsed(record.parsed),
      confidence: confidenceFromParsed(record.parsed) ?? 50,
      reason: "error" in record ? `Model failed: ${record.error}` : reasonFromParsed(record.parsed),
      risks: dedupeStrings(risksFromParsed(record.parsed), 8),
    })),
    {
      model: models.judge,
      role: "judge",
      recommendation: recommendationFromParsed(judgeParsed),
      confidence: confidenceFromParsed(judgeParsed) ?? 50,
      reason: judgeError ? `Judge failed: ${judgeError}` : reasonFromParsed(judgeParsed),
      risks: dedupeStrings(risksFromParsed(judgeParsed), 8),
    },
  ];

  const strengthsA = dedupeStrings([
    ...stringList(judgeParsed, "strengthsA"),
    ...responseSummary(judgeParsed, "responseA"),
    ...successfulEvaluators.flatMap((record) => [...stringList(record.parsed, "strengthsA"), ...responseSummary(record.parsed, "responseA")]),
  ]);
  const weaknessesA = dedupeStrings([
    ...stringList(judgeParsed, "weaknessesA"),
    ...responseFlags(judgeParsed, "responseA", "majorRedFlags"),
    ...responseFlags(judgeParsed, "responseA", "minorRedFlags"),
    ...successfulEvaluators.flatMap((record) => [
      ...stringList(record.parsed, "weaknessesA"),
      ...responseFlags(record.parsed, "responseA", "majorRedFlags"),
      ...responseFlags(record.parsed, "responseA", "minorRedFlags"),
    ]),
  ]);
  const strengthsB = dedupeStrings([
    ...stringList(judgeParsed, "strengthsB"),
    ...responseSummary(judgeParsed, "responseB"),
    ...successfulEvaluators.flatMap((record) => [...stringList(record.parsed, "strengthsB"), ...responseSummary(record.parsed, "responseB")]),
  ]);
  const weaknessesB = dedupeStrings([
    ...stringList(judgeParsed, "weaknessesB"),
    ...responseFlags(judgeParsed, "responseB", "majorRedFlags"),
    ...responseFlags(judgeParsed, "responseB", "minorRedFlags"),
    ...successfulEvaluators.flatMap((record) => [
      ...stringList(record.parsed, "weaknessesB"),
      ...responseFlags(record.parsed, "responseB", "majorRedFlags"),
      ...responseFlags(record.parsed, "responseB", "minorRedFlags"),
    ]),
  ]);
  const riskFlags = dedupeStrings(
    [
      ...risksFromParsed(judgeParsed),
      ...successfulEvaluators.flatMap((record) => risksFromParsed(record.parsed)),
      ...modelVotes.flatMap((vote) => vote.risks),
    ],
    18,
  );

  const summary =
    reasonFromParsed(judgeParsed) !== "No structured rationale returned."
      ? polishRationaleText(reasonFromParsed(judgeParsed))
      : `Recommendation: ${recommendation}. Based on ${successfulEvaluators.length}/3 available evaluator outputs. Manual human approval is required before use.`;
  const parsedFinalDraft = finalDraftFromEvalForge(judgeParsed);
  const directEvaluationDraft =
    parsedFinalDraft
      ? `${polishRationaleText(parsedFinalDraft)}\n\nAI prepares the analysis. You make the final judgment.`
      : [
          `Recommendation: ${recommendation} (${confidence}% confidence).`,
          "",
          "Final rationale:",
          summary,
          "",
          "Evidence review:",
          `- Response A strengths: ${strengthsA.join("; ") || "No clear strengths extracted."}`,
          `- Response A weaknesses: ${weaknessesA.join("; ") || "No clear weaknesses extracted."}`,
          `- Response B strengths: ${strengthsB.join("; ") || "No clear strengths extracted."}`,
          `- Response B weaknesses: ${weaknessesB.join("; ") || "No clear weaknesses extracted."}`,
          "",
          "Rationale quality checklist:",
          ...rationaleQualityGuidance(data.category).map((item) => `- ${item}`),
          "",
          "AI prepares the analysis. You make the final judgment.",
          "Manual human approval required before using this recommendation.",
        ].join("\n");
  const safe = compliance.safeAssistanceMode;
  const finalDraft = safe.enabled
    ? [
        "Safe Assistance Mode: learning and review only.",
        "",
        "AI prepares the analysis. You make the final judgment.",
        "Manual human approval required.",
        "This tool does not auto-submit or bypass platform rules.",
        "Use AI assistance only where allowed by the platform, client, employer, or task instructions.",
        "",
        "Concept explanation:",
        ...safe.conceptExplanation.map((item) => `- ${item}`),
        "",
        "Rubric breakdown:",
        ...safe.rubricBreakdown.map((item) => `- ${item}`),
        "",
        "Self-check questions:",
        ...safe.selfCheckQuestions.map((item) => `- ${item}`),
        "",
        "Human review checklist:",
        ...safe.humanReviewChecklist.map((item) => `- ${item}`),
        "",
        "Write this yourself guidance:",
        ...safe.writeThisYourselfGuidance.map((item) => `- ${item}`),
      ].join("\n")
    : polishRationaleText(directEvaluationDraft);

  const rawModelOutput = {
    evaluators: evaluatorRecords.map((record) => ({
      role: record.role,
      model: record.model,
      content: record.content,
      parsed: record.parsed,
      error: "error" in record ? record.error : undefined,
    })),
    judge: { model: models.judge, content: judgeContent, parsed: judgeParsed, raw: judgeRaw, error: judgeError },
  };

  const payload: EvalResultPayload = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    category: data.category,
    compliance,
    auditLog: {
      createdAt: new Date().toISOString(),
      category: data.category,
      policyRisk: compliance.policyRisk,
      monitoringRisk: compliance.monitoringRisk,
      aiUseClassification: compliance.aiUseClassification,
      humanReviewRequired: compliance.humanReviewRequired,
      humanChecklistCompleted: false,
      finalRecommendation: recommendation,
      finalDraft,
      rawModelOutput,
    },
    recommendation,
    confidence,
    summary,
    finalDraft,
    modelVotes,
    scores,
    strengthsA,
    weaknessesA,
    strengthsB,
    weaknessesB,
    riskFlags,
    humanChecks: mergeHumanChecks(compliance.checklist, HUMAN_REVIEW_CHECKLIST, judgeParsed.humanChecks, judgeParsed.humanReviewReasons),
    humanChecklistCompleted: false,
    raw: rawModelOutput,
  };

  return NextResponse.json(payload);
}
