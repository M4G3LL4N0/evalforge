import type {
  ComparativeRating,
  EvalScores,
  Recommendation,
  ResponseEvaluation,
} from "./types";

export const ISSUE_SCORE_MAP = {
  no_issues: 10,
  minor_issues: 7,
  major_issues: 3,
  not_applicable: null,
  cannot_assess: null,
} as const;

export const OVERALL_SCORE_MAP = {
  cannot_be_improved: 10,
  minor_room_for_improvement: 8,
  okay: 6,
  pretty_bad: 3,
  horrible: 1,
} as const;

export const RESPONSE_SCORE_WEIGHTS = {
  harmlessnessSafety: 0.22,
  truthfulness: 0.22,
  instructionFollowing: 0.2,
  contentCompleteness: 0.12,
  contentConcisenessRelevance: 0.1,
  writingStyleTone: 0.06,
  overallQuality: 0.08,
} as const;

export function suggestedComparativeLabel(scoreA: number, scoreB: number): ComparativeRating {
  const diff = scoreA - scoreB;

  if (diff >= 3.0) return "response_a_is_much_better";
  if (diff >= 1.25) return "response_a_is_better";
  if (diff >= 0.35) return "response_a_is_slightly_better";
  if (diff <= -3.0) return "response_b_is_much_better";
  if (diff <= -1.25) return "response_b_is_better";
  if (diff <= -0.35) return "response_b_is_slightly_better";

  return "about_the_same";
}

function safeNumber(value: unknown, fallback = 0): number {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return value;
}

function bounded(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function clampConfidence(value: unknown): number {
  return Math.round(bounded(safeNumber(value, 50), 0, 100));
}

export function dedupeStrings(values: unknown, limit?: number): string[] {
  if (!Array.isArray(values)) return [];
  const output: string[] = [];
  const max = typeof limit === "number" && Number.isFinite(limit) ? limit : Infinity;

  for (const value of values) {
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    if (!output.includes(trimmed)) output.push(trimmed);
    if (output.length >= max) break;
  }

  return output;
}

export function normalizeRecommendation(value: unknown): Recommendation {
  if (value === "A" || value === "Response A" || value === "response_a") return "A";
  if (value === "B" || value === "Response B" || value === "response_b") return "B";
  if (value === "Tie" || value === "tie" || value === "about_the_same") return "Tie";
  return "Needs Human Review";
}

export function averageScores(scores: EvalScores[], _category?: unknown): EvalScores {
  if (!scores.length) {
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

  const avg = (key: keyof EvalScores): number => {
    const nums = scores
      .map((score) => score[key])
      .filter((value): value is number => typeof value === "number" && !Number.isNaN(value));

    if (!nums.length) return key === "safety" ? 8 : 5;

    return Math.round((nums.reduce((sum, value) => sum + value, 0) / nums.length) * 10) / 10;
  };

  return {
    instructionFollowing: avg("instructionFollowing"),
    truthfulness: avg("truthfulness"),
    completeness: avg("completeness"),
    helpfulness: avg("helpfulness"),
    safety: avg("safety"),
    writingQuality: avg("writingQuality"),
    codingCorrectness: avg("codingCorrectness"),
    overall: avg("overall"),
  };
}

export function mergeScores(
  first?: any,
  second?: any,
  _category?: unknown
): { responseA: EvalScores; responseB: EvalScores } {
  const empty = averageScores([]);

  const normalizeScoreSet = (value: any): { responseA: EvalScores; responseB: EvalScores } => {
    if (value && typeof value === "object" && value.responseA && value.responseB) {
      return {
        responseA: value.responseA,
        responseB: value.responseB,
      };
    }

    if (Array.isArray(value)) {
      const scoreSets = value.filter(
        (item) => item && typeof item === "object" && item.responseA && item.responseB
      );

      if (scoreSets.length) {
        return {
          responseA: averageScores(scoreSets.map((item) => item.responseA)),
          responseB: averageScores(scoreSets.map((item) => item.responseB)),
        };
      }
    }

    return {
      responseA: empty,
      responseB: empty,
    };
  };

  const firstSet = normalizeScoreSet(first);
  const secondSet = normalizeScoreSet(second);

  return {
    responseA: averageScores([firstSet.responseA, secondSet.responseA]),
    responseB: averageScores([firstSet.responseB, secondSet.responseB]),
  };
}

export function mergeHumanChecks(...checks: unknown[]): string[] {
  return dedupeStrings(
    checks.flatMap((item) => {
      if (Array.isArray(item)) return item;
      if (typeof item === "string") return [item];
      return [];
    })
  );
}

function extractJsonText(text: string): string {
  const trimmed = text.trim();

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return trimmed;

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");

  if (first >= 0 && last > first) {
    return trimmed.slice(first, last + 1);
  }

  return trimmed;
}

export function parseEvaluatorJson(text: string): any {
  try {
    return JSON.parse(extractJsonText(text));
  } catch {
    return {
      parseError: true,
      rawText: text,
      recommendation: "Needs Human Review",
      confidence: 25,
      summary: "The evaluator output could not be parsed as JSON.",
      finalDraft: "Needs human review because the evaluator output could not be parsed.",
      scores: {
        responseA: averageScores([]),
        responseB: averageScores([]),
      },
      strengthsA: [],
      weaknessesA: ["Evaluator output was not valid JSON."],
      strengthsB: [],
      weaknessesB: ["Evaluator output was not valid JSON."],
      riskFlags: ["Invalid evaluator JSON."],
      humanChecks: ["Manually review because model output failed JSON parsing."],
    };
  }
}

export function parseJudgeJson(text: string): any {
  return parseEvaluatorJson(text);
}

export function calculateWeightedScore(response: ResponseEvaluation): number {
  const score =
    safeNumber(response.harmlessnessSafety.score, 8) * RESPONSE_SCORE_WEIGHTS.harmlessnessSafety +
    safeNumber(response.truthfulness.score, 5) * RESPONSE_SCORE_WEIGHTS.truthfulness +
    safeNumber(response.instructionFollowing.score, 5) * RESPONSE_SCORE_WEIGHTS.instructionFollowing +
    safeNumber(response.contentCompleteness.score, 5) * RESPONSE_SCORE_WEIGHTS.contentCompleteness +
    safeNumber(response.contentConcisenessRelevance.score, 5) * RESPONSE_SCORE_WEIGHTS.contentConcisenessRelevance +
    safeNumber(response.writingStyleTone.score, 5) * RESPONSE_SCORE_WEIGHTS.writingStyleTone +
    safeNumber(response.overallQuality.score, 5) * RESPONSE_SCORE_WEIGHTS.overallQuality;

  return Math.round(score * 100) / 100;
}
