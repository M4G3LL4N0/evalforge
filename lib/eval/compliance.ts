import type {
  AIUseClassification,
  ComplianceInput,
  ComplianceResult,
  ComplianceSignal,
  MonitoringRisk,
  PolicyRisk,
  SafeAssistanceMode,
} from "./types";

const COMPLIANCE_CHECKLIST = [
  "I read the original prompt.",
  "I read both responses.",
  "I checked the platform rules.",
  "I checked every explicit instruction.",
  "I verified the recommended winner.",
  "I checked primary factual claims.",
  "I edited the explanation in my own judgment.",
  "I am making the final decision manually.",
  "I am not using this to bypass platform rules.",
];

const SIGNALS: ComplianceSignal[] = [
  {
    label: "paste events",
    risk: "medium",
    explanation: "A page can often observe paste activity inside its own fields.",
  },
  {
    label: "timing patterns",
    risk: "medium",
    explanation: "Platforms may compare typing, reading, and decision timing against expected reviewer behavior.",
  },
  {
    label: "tab focus loss",
    risk: "medium",
    explanation: "A page can usually detect when its own tab loses or regains focus.",
  },
  {
    label: "text similarity",
    risk: "medium",
    explanation: "Submitted explanations may be compared with generated or repeated text patterns.",
  },
  {
    label: "browser fingerprinting",
    risk: "medium",
    explanation: "Sites can see ordinary browser, device, and environment signals exposed to their page.",
  },
  {
    label: "interaction logging",
    risk: "medium",
    explanation: "Clicks, keystrokes, scrolls, field edits, and submission behavior may be logged by the platform.",
  },
  {
    label: "extension/proctoring risk",
    risk: "high",
    explanation: "Required extensions or proctoring tools may have broader visibility than a normal webpage.",
  },
  {
    label: "managed device risk",
    risk: "high",
    explanation: "Employer, school, or client-managed devices may include monitoring outside the browser page.",
  },
  {
    label: "network/device monitoring risk",
    risk: "high",
    explanation: "Managed networks, VPNs, endpoint tools, or device policies may record device or network activity.",
  },
];

function textIncludesAny(text: string, terms: string[]): boolean {
  const normalized = text.toLowerCase();
  return terms.some((term) => normalized.includes(term));
}

function asText(input: ComplianceInput): string {
  return `${input.platformPolicy ?? ""}\n${input.taskInstructions ?? ""}`;
}

export function classifyPolicyRisk(input: ComplianceInput): {
  policyRisk: PolicyRisk;
  aiUseClassification: AIUseClassification;
  reasons: string[];
} {
  const text = asText(input);
  const reasons: string[] = [];
  const explicitNoAi =
    Boolean(input.saysNoAI) ||
    textIncludesAny(text, ["no ai", "do not use ai", "without ai", "ai is not allowed", "ai prohibited", "no chatgpt", "no generative ai"]);
  const noOutsideTools =
    Boolean(input.saysNoOutsideTools) ||
    textIncludesAny(text, ["no outside tools", "external tools are not allowed", "without outside help", "no external assistance"]);
  const limitedAi = textIncludesAny(text, ["ai allowed for", "ai may be used for", "draft review", "quality control", "learning only", "assistive tools"]);
  const allowsAi = textIncludesAny(text, ["ai allowed", "ai assistance is allowed", "generative ai is allowed", "outside tools allowed"]);

  if (explicitNoAi || noOutsideTools) {
    if (explicitNoAi) reasons.push("The policy or task instructions appear to prohibit AI assistance.");
    if (noOutsideTools) reasons.push("The policy or task instructions appear to prohibit outside tools.");
    return {
      policyRisk: "red",
      aiUseClassification: explicitNoAi ? "likely_prohibited" : "learning_only",
      reasons,
    };
  }

  if (input.isQualificationTask && !allowsAi) {
    reasons.push("Qualification tasks often have stricter originality and tool-use expectations.");
    return {
      policyRisk: "yellow",
      aiUseClassification: limitedAi ? "learning_only" : "policy_unclear",
      reasons,
    };
  }

  if (limitedAi) {
    reasons.push("The policy appears to allow AI only for bounded support such as learning, review, or quality control.");
    return {
      policyRisk: "yellow",
      aiUseClassification: "ai_allowed_with_limits",
      reasons,
    };
  }

  if (allowsAi) {
    reasons.push("The provided policy appears to allow AI assistance.");
    return {
      policyRisk: input.finalSubmissionWillBePasted ? "yellow" : "green",
      aiUseClassification: input.finalSubmissionWillBePasted ? "ai_allowed_with_limits" : "ai_allowed",
      reasons: input.finalSubmissionWillBePasted
        ? [...reasons, "Pasting a final submission can create platform-visible signals, so human editing is still required."]
        : reasons,
    };
  }

  reasons.push("No clear AI-use permission was provided.");
  return {
    policyRisk: "yellow",
    aiUseClassification: "policy_unclear",
    reasons,
  };
}

export function classifyMonitoringRisk(input: ComplianceInput): {
  monitoringRisk: MonitoringRisk;
  reasons: string[];
} {
  const reasons: string[] = [];

  if (input.requiresExtension) reasons.push("A required extension can increase platform visibility.");
  if (input.isProctored) reasons.push("Proctored tasks can include stronger activity monitoring.");
  if (input.managedDevice) reasons.push("Managed devices may include device-level or network-level monitoring.");

  if (input.requiresExtension || input.isProctored || input.managedDevice) {
    return { monitoringRisk: "high", reasons };
  }

  if (input.finalSubmissionWillBePasted || input.isQualificationTask) {
    if (input.finalSubmissionWillBePasted) reasons.push("Paste behavior may be visible inside the platform page.");
    if (input.isQualificationTask) reasons.push("Qualification workflows may log more interaction data than ordinary tasks.");
    return { monitoringRisk: "medium", reasons };
  }

  reasons.push("No elevated monitoring signals were declared.");
  return { monitoringRisk: "low", reasons };
}

export function getComplianceChecklist(_input?: ComplianceInput): string[] {
  return COMPLIANCE_CHECKLIST;
}

export function getSafeAssistanceMode(input: ComplianceInput): SafeAssistanceMode {
  const policy = classifyPolicyRisk(input);
  const enabled = policy.policyRisk === "red" || policy.aiUseClassification === "learning_only" || policy.aiUseClassification === "likely_prohibited";

  return {
    enabled,
    conceptExplanation: [
      "Use the analysis to understand the evaluation dimensions, not as text for direct submission.",
      "Compare the responses against the original prompt, explicit instructions, factual reliability, safety, completeness, and usefulness.",
      "Treat the recommendation as a quality-control signal that you must verify independently.",
    ],
    rubricBreakdown: [
      "Instruction following: Check whether each response obeys the prompt and all task-specific constraints.",
      "Truthfulness: Verify primary factual claims before relying on them.",
      "Completeness: Confirm the better response answers the whole task without padding.",
      "Safety and policy fit: Reject content that violates safety, client, employer, or platform rules.",
      "Explanation quality: Write your final rationale in your own judgment and wording.",
    ],
    selfCheckQuestions: [
      "What exact rule or instruction makes one response better?",
      "Did either response make a primary factual claim that needs independent checking?",
      "Would your explanation still make sense if the AI analysis were unavailable?",
      "Are you allowed to use AI assistance for this task under the platform, client, employer, or task instructions?",
    ],
    humanReviewChecklist: COMPLIANCE_CHECKLIST,
    writeThisYourselfGuidance: [
      "Write the final explanation yourself after reading the prompt, both responses, and platform rules.",
      "Use short, concrete reasons tied to the rubric instead of copying generated phrasing.",
      "Manually make the final decision and submit only through the platform's normal workflow.",
      "This tool does not auto-submit or bypass platform rules.",
    ],
  };
}

export function evaluateCompliance(input: ComplianceInput): ComplianceResult {
  const policy = classifyPolicyRisk(input);
  const monitoring = classifyMonitoringRisk(input);

  return {
    ...input,
    policyRisk: policy.policyRisk,
    monitoringRisk: monitoring.monitoringRisk,
    aiUseClassification: policy.aiUseClassification,
    humanReviewRequired: true,
    likelySignals: SIGNALS,
    policyReasons: policy.reasons,
    monitoringReasons: monitoring.reasons,
    safeAssistanceMode: getSafeAssistanceMode(input),
    checklist: COMPLIANCE_CHECKLIST,
  };
}
