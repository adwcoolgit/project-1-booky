# Tooling and Quality Contract

## Purpose

Define the repository-level commands, verification surfaces, fixtures, and CI
quality gates established by the Booky foundation feature.

## Source-of-Truth Integrity Contract

- Approved artifacts remain under `docs/source-of-truth/`.
- `source-of-truth-manifest.json` is the checksum authority.
- `scripts/verify-source-of-truth.mjs` is the local and CI verification entry.
- Any missing file or hash mismatch is a blocking failure.

## Command Contract

| Command | Purpose | Blocking |
|--------|---------|----------|
| `npm run verify:source` | Verify source-of-truth checksums | Yes |
| `npm run lint` | Lint, import boundaries, and basic static checks | Yes |
| `npm run typecheck` | TypeScript strict validation | Yes |
| `npm run i18n:check` | Translation catalog parity validation | Yes |
| `npm run test` | Vitest unit/component/MSW foundation tests | Yes |
| `npm run test:e2e` | Playwright foundation shell smoke tests | Yes |
| `npm run build` | Production build validation | Yes |

## Fixture and MSW Contract

- Deterministic fixture data lives under `tests/fixtures/foundation/`.
- MSW defines only foundation-level request doubles and request examples.
- No live production backend calls are allowed in local validation or CI.
- Any future `RESPONSE-SCHEMA-PARTIAL` example used in tests must be sourced
  from deterministic fixtures, not speculative runtime data.

## CI Contract

Initial CI gates must run in this order:
1. Install dependencies.
2. Verify source-of-truth checksums.
3. Run lint/import-boundary checks.
4. Run typecheck.
5. Run i18n parity check.
6. Run Vitest suites.
7. Run build.
8. Run Playwright shell smoke checks.

## Logging and Failure Contract

- CI must fail on missing translations, boundary violations, type errors,
  checksum drift, or build failure.
- No secret or token values are required for this foundation CI.
- Logs must not claim runtime backend verification.
