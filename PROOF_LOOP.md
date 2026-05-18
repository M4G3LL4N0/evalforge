# Proof loop — evalforge

**Fastest validation test** (run in under 30 minutes)

## Hypothesis

One specific user can complete [primary workflow] with sample data and see a result worth showing.

## Test

1. `cd /Users/joshuadavis/startups/evalforge && pnpm dev`
2. Open `/` and the main product route (see LOCAL_REVIEW.md)
3. Complete one end-to-end flow with demo data
4. Capture one screenshot or export

## Success criteria

- [ ] User understands product in 10 seconds on homepage
- [ ] One interaction produces a labeled demo output
- [ ] No unsupported claims visible without DEMO label
- [ ] `pnpm build` passes locally

## If it fails

Record: where the user got stuck, what copy was unclear, what broke.

## Next proof (after pass)

One real user (not you) runs the same flow and gives one sentence of feedback.
