# Claim Register: Evalforge

## Public Claim Rules
- Public copy cannot exceed proof.
- Demo claims must be labeled as demo.
- Planned claims must be labeled as planned.
- Hypotheses must not be written as facts.
- Unknowns must not be hidden.
- Failed or partial work must not be presented as complete.
- Stale claims need current verification.
- Risky claims need safer public wording.
- Sensitive or private-only claims must not be published.
- Do-not-claim items must stay out of public copy.

## Claims

| Claim | Reality Label | Proof Ladder Level | Evidence | Risk | Safe Public Version | Proof Needed |
|---|---:|---:|---|---|---|---|
| Codebase is a deployable web product in this repo | KNOWN | 2 | package.json, app routes | low | Review routes locally before trusting public copy. | none |
| Local production build (PASS) | VERIFIED | 4 | .noaerth_full_build_status.tsv | low | Build passed in portfolio matrix (re-verify after edits). | none |
| Live site may exist at https://evalforge.noaerth.com | ASSUMPTION | 2 | portfolio subdomain pattern | medium | Verify DNS/HTTP before citing https://evalforge.noaerth.com. | curl or browser check |
| Revenue, paying customers, or funding traction | DO-NOT-CLAIM | 0 | not in repo | high | Do not publish traction without user-provided proof. | metrics from founder |
| Security, compliance, or regulatory certification | UNKNOWN | 0 | not proven in repo | high | Do not claim compliance or certification. | legal / audit review |

## Launch readiness (TitanAtlas v13)
- Build: **PASS**
- PUBLIC READY: **no**
- Next: local review + weaken any homepage overclaims
