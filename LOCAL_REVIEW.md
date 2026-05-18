# Local review — evalforge

**Live:** https://evalforge.noaerth.com  
**Status:** DEMO — sample data; not production metrics.

## Quick start

```bash
cd /Users/joshuadavis/startups/evalforge
pnpm install   # if needed
pnpm dev
```

## Routes to inspect

| Route | What to verify |
|-------|----------------|
| `/` | Hero clarity, product promise, primary CTA, graphics stack |
| `/demo` or main product route | One real interaction changes state |
| Pricing / about (if present) | No unsupported claims; demo labels visible |

## Acceptance criteria

- [ ] Answers in 10s: what, who, pain, action, trust
- [ ] Mobile nav usable; no broken layout
- [ ] Demo/sample outputs clearly labeled
- [ ] No fake customer counts, revenue, or compliance claims
- [ ] `pnpm build` passes locally

## Proof loop (fastest validation)

1. Run the primary demo flow once end-to-end with sample data.
2. Capture one screenshot or export for review.
3. Note one hypothesis to test with a real user this week.

## Limitations

- Public metrics are illustrative unless marked PROVEN in `startupjourney.md`.
- High-stakes decisions require human professional review where applicable.
