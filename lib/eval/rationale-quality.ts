export function buildRationaleQualityPromptSection(mode: "evaluator" | "final_judge" = "evaluator"): string {
  const finalJudgeInstructions =
    mode === "final_judge"
      ? `
FINAL JUDGE POLISH REQUIREMENT:
- Use this section to polish comparativeQuality.comment before returning JSON.
- The final comparative rationale must be 3 to 5+ sentences, professional, confident, specific, evidence-based, and comparative.
- Structure it clearly: name the winner and deciding dimension, cite specific winner evidence, cite a specific loser weakness, and note factual uncertainty or subjective/formatting examples where relevant.
- Do not return a generic final rationale. If the rationale could apply to many unrelated tasks, rewrite it with concrete evidence from this task.
`.trim()
      : `
EVALUATOR RATIONALE REQUIREMENT:
- Use this section when writing dimension explanations, summaries, red flags, and comparative comments.
- Evaluator rationales should provide concrete evidence that the final judge can audit and synthesize.
`.trim();

  return `
RATIONALE QUALITY RULES:
- Show genuine engagement with the content. Discuss the actual prompt, exact constraints, and concrete choices made by each response.
- Do not write generic claims like "better words", "more creative", "more detailed", "stronger", or "better formatted" unless you immediately support them with specific examples.
- Identify specific errors rather than surface-level differences: incorrect dates, hallucinated entities or facts, wrong mechanics, unsupported claims, missed format, wrong count, wrong tone, omitted required items, unsafe advice, or irrelevant additions.
- When judging creativity, style, tone, or subjective quality, cite concrete evidence such as exact wording, lines, rhyme scheme, pacing, imagery, tone choices, structure, or how the response matches or misses the requested voice.
- When judging formatting, cite the exact formatting constraint and what each response did: bullets vs prose, requested count, headings, JSON/table format, word/character limits, line breaks, rhyme pattern, code block format, or ordering.
- When judging factual accuracy, identify the exact claim that is wrong, unsupported, checked, or needs verification. If a primary factual claim materially affects the winner, say which claim it is.
- Fact-check primary factual claims when the task requires factual accuracy and reputable evidence is available in the provided reference notes or model context. If external fact-checking would be needed but is unavailable, explicitly flag the uncertainty instead of declaring the claim true.
- When judging instruction following, identify the exact instruction that was followed or missed.
- When judging completeness, identify the exact requested item, detail, step, constraint, or edge case that is missing.
- When judging conciseness, explain whether the extra content is useful context or irrelevant padding.
- When comparing responses, explain both why the winner succeeds and why the loser falls short; do not only praise the winner.
- Use polished grammar, professional wording, and confident but appropriately scoped claims.
- Avoid vague statements, sentence fragments, repeated wording, and unsupported claims of factual accuracy.
- Use "therefore", not "therefor". Use "chose", not "choose", when referring to a past selection. Keep response names consistent as Response A and Response B.
- If the evidence is mixed, say so clearly and choose a proportional comparative label.

SUBJECTIVE-TASK SPECIFICITY:
- For creative writing, tone, style, rewriting, messages, summarization, and formatting-heavy tasks, include concrete examples rather than abstract praise.
- Mention exact words, lines, tone choices, rhyme/structure, formatting details, or missed constraints when those determine quality.

FACT-CHECKING AND UNCERTAINTY:
- Treat primary factual claims as claims to verify, not as automatically true.
- Use reference notes and the prompt as the first evidence source.
- If the task needs external verification and no reliable source is available to you, mark the claim as unclear, unsupported, or needing verification rather than overclaiming.

GRAMMAR POLISH CHECK:
- therefore, not therefor
- chose, not choose, when referring to a past selection
- consistent Response A and Response B names
- no sentence fragments in final rationale
- no repeated wording
- no vague phrases like "much better words" without evidence
- no unsupported claim of factual accuracy

FINAL RATIONALE QUALITY CHECKLIST:
- Does the rationale name the winning response?
- Does it explain the main deciding dimension?
- Does it cite at least one specific strength of the winner?
- Does it cite at least one specific weakness of the loser?
- For subjective tasks, does it include concrete examples?
- For factual tasks, does it identify claims checked or claims needing verification?
- For formatting tasks, does it mention exact formatting constraints?
- Is the rationale grammatically polished?
- Is the comparative label proportional to the issue severity?

${finalJudgeInstructions}
`.trim();
}
