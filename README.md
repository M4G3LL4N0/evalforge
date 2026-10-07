# EvalForge

<p align="center">
  <picture>
    <source media="(prefers-reduced-motion: reduce)" srcset="assets/hero/hero-reduced.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/hero/hero-light.svg">
    <img src="assets/hero/hero-motion.svg" alt="EvalForge — animated project plate showing request &rarr; authenticate &rarr; authorise &rarr; record &rarr; reject. Motion depicts this project's real state transition." width="100%">
  </picture>
</p>

<p align="center">
  <picture>
    <source media="(prefers-reduced-motion: reduce)" srcset="assets/hero/computational-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/hero/computational-light.svg">
    <img src="assets/hero/computational-motion.svg" alt="State machine: request &rarr; authenticate &rarr; authorise &rarr; record &rarr; reject." width="100%">
  </picture>
</p>

EvalForge is a human-in-the-loop AI evaluation cockpit for comparing chatbot responses and coding answers with multiple OpenRouter models.

AI drafts analysis only. Manual human approval is required before using any recommendation.

## Setup

```bash
cd /Users/joshuadavis/startups/evalforge
pnpm install
cp .env.local.example .env.local
```

Add `OPENROUTER_API_KEY` to `.env.local`, then run:

```bash
pnpm dev
pnpm build
```

## OpenRouter

The API key is read only in `app/api/evaluate/route.ts` through server-side helpers. The browser posts task inputs to the local Next.js route and never receives the OpenRouter key.

Default model roles:

- `fast`: `OPENROUTER_MODEL_FAST || "openai/gpt-4o-mini"`
- `deep`: `OPENROUTER_MODEL_DEEP || "anthropic/claude-3.5-haiku"`
- `skeptic`: `OPENROUTER_MODEL_SKEPTIC || "deepseek/deepseek-chat"`
- `judge`: `OPENROUTER_MODEL_JUDGE || "google/gemini-flash-1.5"`

The fast, deep, and skeptic evaluators run in parallel. The judge runs after those complete and synthesizes the final draft. If one evaluator fails, EvalForge continues with available outputs. If every evaluator fails, the API returns a readable error.

## Modes

EvalForge supports `general_qa`, `creative_writing`, `coding`, `math`, `medical`, `legal`, `financial`, `travel`, `recipe`, `summarization`, `rewriting`, `recommendation`, `classification`, `word_puzzle`, `email_or_message`, `list_generation`, and `other` category modes. Each mode adjusts evaluator guidance and the human review checklist.

## EvalForge Quality Standard

- Be specific.
- Fact-check primary claims.
- Give concrete examples for subjective judgments.
- Compare both responses directly.
- Polish grammar before final use.

Strong rationales should name the winning response, identify the deciding dimension, cite specific evidence from both responses, and flag any factual claims that were not verified. EvalForge remains human-in-the-loop: AI prepares the analysis, and the reviewer makes the final judgment.

## Local History

Saved tasks are stored in browser `localStorage` only. Use **Export JSON** to download a result object for external recordkeeping.

<!-- TRILLIONX:presentation:begin -->

### Animated surfaces

Generated from this repository's own source tree: every count, route and module below was measured, not written by hand.

#### Identity

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/hero-reduced.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/hero-light.svg">
  <img alt="Identity diagram for evalforge" src="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/hero.svg">
</picture>

#### Entry points

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/terminal-reduced.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/terminal-light.svg">
  <img alt="Entry points diagram for evalforge" src="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/terminal.svg">
</picture>

#### Modules

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/architecture-reduced.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/architecture-light.svg">
  <img alt="Modules diagram for evalforge" src="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/architecture.svg">
</picture>

#### Routes

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/data_flow-reduced.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/data_flow-light.svg">
  <img alt="Routes diagram for evalforge" src="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/data_flow.svg">
</picture>

#### Primitives

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/state_machine-reduced.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/state_machine-light.svg">
  <img alt="Primitives diagram for evalforge" src="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/state_machine.svg">
</picture>

#### Composition

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/component_map-reduced.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/component_map-light.svg">
  <img alt="Composition diagram for evalforge" src="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/component_map.svg">
</picture>

#### Build and tests

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/build-reduced.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/build-light.svg">
  <img alt="Build and tests diagram for evalforge" src="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/build.svg">
</picture>

#### Workflow

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/workflow-reduced.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/workflow-light.svg">
  <img alt="Workflow diagram for evalforge" src="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/workflow.svg">
</picture>

#### Domain

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/domain-reduced.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/domain-light.svg">
  <img alt="Domain diagram for evalforge" src="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/domain.svg">
</picture>

#### Identity object

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/footer-reduced.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/footer-light.svg">
  <img alt="Identity object diagram for evalforge" src="https://raw.githubusercontent.com/M4G3LL4N0/evalforge/main/.github-art/surfaces/footer.svg">
</picture>

<!-- TRILLIONX:presentation:end -->

<!-- TRILLIONX:evidence:begin -->

## What is measurable here

Generated by `.github-art` from the source tree at publish time.

| Signal | Value |
| --- | --- |
| HTTP routes | 16 |
| Entry points | 1 |
| Module roots | 3 |
| Test files | 1 |
| CI workflows | 0 |
| Distinctive stack | scaffold only |
| Status | TESTED |
| Evidence confidence | E3 |
| Animated surfaces | 10 |

<!-- TRILLIONX:evidence:end -->
