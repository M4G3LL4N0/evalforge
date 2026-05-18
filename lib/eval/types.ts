export type PromptRatability = "ratable" | "not_ratable";

export type TaskCategory =
  | "general_qa"
  | "creative_writing"
  | "coding"
  | "math"
  | "medical"
  | "legal"
  | "financial"
  | "travel"
  | "recipe"
  | "summarization"
  | "rewriting"
  | "recommendation"
  | "classification"
  | "word_puzzle"
  | "email_or_message"
  | "list_generation"
  | "other";

export type EvalCategory = TaskCategory;

export const CATEGORIES = [
  "general_qa",
  "creative_writing",
  "coding",
  "math",
  "medical",
  "legal",
  "financial",
  "travel",
  "recipe",
  "summarization",
  "rewriting",
  "recommendation",
  "classification",
  "word_puzzle",
  "email_or_message",
  "list_generation",
  "other",
] as const;

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  general_qa: "General QA",
  creative_writing: "Creative Writing",
  coding: "Coding",
  math: "Math",
  medical: "Medical",
  legal: "Legal",
  financial: "Financial",
  travel: "Travel",
  recipe: "Recipe",
  summarization: "Summarization",
  rewriting: "Rewriting",
  recommendation: "Recommendation",
  classification: "Classification",
  word_puzzle: "Word Puzzle",
  email_or_message: "Email or Message",
  list_generation: "List Generation",
  other: "Other",
};

export function formatCategoryLabel(category: TaskCategory): string {
  return CATEGORY_LABELS[category];
}

export type InstructionFollowingRating =
  | "no_issues"
  | "minor_issues"
  | "major_issues"
  | "not_applicable";

export type TruthfulnessRating =
  | "no_issues"
  | "minor_issues"
  | "major_issues"
  | "cannot_assess"
  | "not_applicable";

export type SafetyRating =
  | "no_issues"
  | "minor_issues"
  | "major_issues";

export type ConcisenessRelevanceRating =
  | "no_issues"
  | "minor_issues"
  | "major_issues"
  | "not_applicable";

export type CompletenessRating =
  | "no_issues"
  | "minor_issues"
  | "major_issues"
  | "not_applicable";

export type WritingStyleToneRating =
  | "no_issues"
  | "minor_issues"
  | "major_issues";

export type OverallQualityRating =
  | "cannot_be_improved"
  | "minor_room_for_improvement"
  | "okay"
  | "pretty_bad"
  | "horrible";

export type ComparativeRating =
  | "response_a_is_much_better"
  | "response_a_is_better"
  | "response_a_is_slightly_better"
  | "about_the_same"
  | "response_b_is_slightly_better"
  | "response_b_is_better"
  | "response_b_is_much_better";

export type Winner = "A" | "B" | "tie";

export type Recommendation = "A" | "B" | "Tie" | "Needs Human Review";

export type Confidence = "low" | "medium" | "high";

export type PolicyRisk = "green" | "yellow" | "red";

export type MonitoringRisk = "low" | "medium" | "high";

export type AIUseClassification =
  | "ai_allowed"
  | "ai_allowed_with_limits"
  | "learning_only"
  | "policy_unclear"
  | "likely_prohibited";

export type IssueSeverity = "critical" | "major" | "minor";

export type ClaimStatus =
  | "accurate"
  | "inaccurate"
  | "unsupported"
  | "misleading"
  | "unclear"
  | "not_checked";

export type ClaimImportance = "primary" | "secondary";

export interface RubricRating<T extends string = string> {
  rating: T;
  score: number | null;
  explanation: string;
}

export interface FactualClaimCheck {
  claim: string;
  status: ClaimStatus;
  importance: ClaimImportance;
  explanation: string;
  evidence?: string[];
}

export interface DetectedUserIntent {
  mainTask: string;
  taskCategory: TaskCategory;
  explicitInstructions: string[];
  implicitRequirements: string[];
  requiredFormat: string | null;
  requestedTone: string | null;
  requestedLength: string | null;
  requiredCount: number | null;
  scopeConstraints: string[];
  exclusions: string[];
  safetySensitive: boolean;
  factCheckNeeded: boolean;
}

export interface ResponseEvaluation {
  instructionFollowing: RubricRating<InstructionFollowingRating>;
  truthfulness: RubricRating<TruthfulnessRating>;
  harmlessnessSafety: RubricRating<SafetyRating>;
  contentConcisenessRelevance: RubricRating<ConcisenessRelevanceRating>;
  contentCompleteness: RubricRating<CompletenessRating>;
  writingStyleTone: RubricRating<WritingStyleToneRating>;
  overallQuality: RubricRating<OverallQualityRating>;
  weightedScore: number;
  majorRedFlags: string[];
  minorRedFlags: string[];
  factualClaimsChecked: FactualClaimCheck[];
  summary: string;
}

export interface ComparativeQuality {
  rating: ComparativeRating;
  winner: Winner;
  confidence: Confidence;
  primaryReason:
    | "safety"
    | "truthfulness"
    | "instruction_following"
    | "completeness"
    | "conciseness_relevance"
    | "writing_style_tone"
    | "overall_helpfulness"
    | "tie";
  comment: string;
  dimensionAdvantages: {
    instructionFollowing: Winner | "tie" | "unclear";
    truthfulness: Winner | "tie" | "unclear" | "not_applicable";
    harmlessnessSafety: Winner | "tie" | "unclear";
    contentConcisenessRelevance: Winner | "tie" | "unclear";
    contentCompleteness: Winner | "tie" | "unclear";
    writingStyleTone: Winner | "tie" | "unclear";
    overallQuality: Winner | "tie" | "unclear";
  };
  keyReasons: string[];
}

export interface EvalForgeEvaluationResult {
  promptId: string | null;
  promptRatability: PromptRatability;
  promptRatabilityExplanation: string;
  detectedUserIntent: DetectedUserIntent;
  responseA: ResponseEvaluation;
  responseB: ResponseEvaluation;
  comparativeQuality: ComparativeQuality;
  shouldHumanReview: boolean;
  humanReviewReasons: string[];
  schemaVersion: "evalforge.v1";
  createdAt: string;
}

export interface EvalScores {
  instructionFollowing: number;
  truthfulness: number;
  completeness: number;
  helpfulness: number;
  safety: number;
  writingQuality: number;
  codingCorrectness?: number | null;
  overall: number;
}

export interface ModelVote {
  model: string;
  role: "fast" | "deep" | "skeptic" | "judge" | "evaluator" | "final_judge";
  recommendation: Recommendation;
  confidence: number;
  reason: string;
  risks: string[];
}

export interface ComplianceInput {
  platformPolicy?: string;
  taskInstructions?: string;
  isQualificationTask?: boolean;
  saysNoAI?: boolean;
  saysNoOutsideTools?: boolean;
  requiresExtension?: boolean;
  isProctored?: boolean;
  managedDevice?: boolean;
  finalSubmissionWillBePasted?: boolean;
}

export interface ComplianceSignal {
  label: string;
  risk: MonitoringRisk;
  explanation: string;
}

export interface SafeAssistanceMode {
  enabled: boolean;
  conceptExplanation: string[];
  rubricBreakdown: string[];
  selfCheckQuestions: string[];
  humanReviewChecklist: string[];
  writeThisYourselfGuidance: string[];
}

export interface ComplianceResult extends ComplianceInput {
  policyRisk: PolicyRisk;
  monitoringRisk: MonitoringRisk;
  aiUseClassification: AIUseClassification;
  humanReviewRequired: boolean;
  likelySignals: ComplianceSignal[];
  policyReasons: string[];
  monitoringReasons: string[];
  safeAssistanceMode: SafeAssistanceMode;
  checklist: string[];
}

export interface AuditLog {
  createdAt: string;
  category: EvalCategory;
  policyRisk: PolicyRisk;
  monitoringRisk: MonitoringRisk;
  aiUseClassification: AIUseClassification;
  humanReviewRequired: boolean;
  humanChecklistCompleted: boolean;
  finalRecommendation: Recommendation;
  finalDraft: string;
  rawModelOutput: unknown;
}

export interface EvalResultPayload {
  id: string;
  createdAt: string;
  category: EvalCategory;
  compliance: ComplianceResult;
  auditLog: AuditLog;
  recommendation: Recommendation;
  confidence: number;
  summary: string;
  finalDraft: string;
  modelVotes: ModelVote[];
  scores: {
    responseA: EvalScores;
    responseB: EvalScores;
  };
  strengthsA: string[];
  weaknessesA: string[];
  strengthsB: string[];
  weaknessesB: string[];
  riskFlags: string[];
  humanChecks: string[];
  humanChecklistCompleted: boolean;
  raw: unknown;
}

export interface EvaluateRequestBody {
  category: EvalCategory;
  prompt: string;
  responseA: string;
  responseB: string;
  rubric?: string;
  specialInstructions?: string;
  referenceNotes?: string;
  platformPolicy?: string;
  taskInstructions?: string;
  isQualificationTask?: boolean;
  saysNoAI?: boolean;
  saysNoOutsideTools?: boolean;
  requiresExtension?: boolean;
  isProctored?: boolean;
  managedDevice?: boolean;
  finalSubmissionWillBePasted?: boolean;
}

export type EvalRequest = EvaluateRequestBody;
