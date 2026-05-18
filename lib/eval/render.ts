import type { EvalForgeEvaluationResult } from "./types";

export function renderComparativeRating(rating: string): string {
  const labels: Record<string, string> = {
    response_a_is_much_better: "Response A is much better",
    response_a_is_better: "Response A is better",
    response_a_is_slightly_better: "Response A is slightly better",
    about_the_same: "About the same",
    response_b_is_slightly_better: "Response B is slightly better",
    response_b_is_better: "Response B is better",
    response_b_is_much_better: "Response B is much better",
  };

  return labels[rating] ?? rating;
}

export function renderShortHumanExplanation(result: EvalForgeEvaluationResult): string {
  const winner =
    result.comparativeQuality.winner === "tie"
      ? "Neither response clearly wins"
      : `Response ${result.comparativeQuality.winner} wins`;

  return `${winner}. ${result.comparativeQuality.comment}`;
}

export function renderFullHumanExplanation(result: EvalForgeEvaluationResult): string {
  return [
    "## Prompt Ratability",
    `**Is this prompt ratable?** ${result.promptRatability === "ratable" ? "Yes" : "No"}. ${result.promptRatabilityExplanation}`,
    "---",
    "# Response A Ratings",
    `## Instruction Following\n**${result.responseA.instructionFollowing.rating}**\n${result.responseA.instructionFollowing.explanation}`,
    `## Truthfulness\n**${result.responseA.truthfulness.rating}**\n${result.responseA.truthfulness.explanation}`,
    `## Harmlessness / Safety\n**${result.responseA.harmlessnessSafety.rating}**\n${result.responseA.harmlessnessSafety.explanation}`,
    `## Content Conciseness & Relevance\n**${result.responseA.contentConcisenessRelevance.rating}**\n${result.responseA.contentConcisenessRelevance.explanation}`,
    `## Content Completeness\n**${result.responseA.contentCompleteness.rating}**\n${result.responseA.contentCompleteness.explanation}`,
    `## Writing Style & Tone\n**${result.responseA.writingStyleTone.rating}**\n${result.responseA.writingStyleTone.explanation}`,
    `## Overall Quality\n**${result.responseA.overallQuality.rating}**\n${result.responseA.overallQuality.explanation}`,
    "---",
    "# Response B Ratings",
    `## Instruction Following\n**${result.responseB.instructionFollowing.rating}**\n${result.responseB.instructionFollowing.explanation}`,
    `## Truthfulness\n**${result.responseB.truthfulness.rating}**\n${result.responseB.truthfulness.explanation}`,
    `## Harmlessness / Safety\n**${result.responseB.harmlessnessSafety.rating}**\n${result.responseB.harmlessnessSafety.explanation}`,
    `## Content Conciseness & Relevance\n**${result.responseB.contentConcisenessRelevance.rating}**\n${result.responseB.contentConcisenessRelevance.explanation}`,
    `## Content Completeness\n**${result.responseB.contentCompleteness.rating}**\n${result.responseB.contentCompleteness.explanation}`,
    `## Writing Style & Tone\n**${result.responseB.writingStyleTone.rating}**\n${result.responseB.writingStyleTone.explanation}`,
    `## Overall Quality\n**${result.responseB.overallQuality.rating}**\n${result.responseB.overallQuality.explanation}`,
    "---",
    "# COMPARATIVE QUALITY",
    `**Rating:** **${renderComparativeRating(result.comparativeQuality.rating)}**`,
    result.comparativeQuality.comment,
  ].join("\n\n");
}
