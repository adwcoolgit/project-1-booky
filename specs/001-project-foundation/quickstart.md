# Quickstart: Project Foundation Validation

## Purpose

Validate the Booky project foundation end to end once implementation begins,
without relying on any domain business workflow.

## Prerequisites

- Node.js 22 LTS installed
- npm installed
- Repository checked out with the `docs/source-of-truth/` pack intact

## Setup

1. Verify the source-of-truth pack before installing app dependencies:

```bash
node ./scripts/verify-source-of-truth.mjs --root ./docs/source-of-truth
```

2. Install dependencies for the root Next.js application:

```bash
npm install
```

3. Prepare local environment values from the future example env file once the
   implementation task creates it.

## Validation Scenarios

### Scenario 1: Source pack integrity

```bash
npm run verify:source
```

Expected result:
- Every file listed in `docs/source-of-truth/source-of-truth-manifest.json`
  passes SHA-256 verification.

### Scenario 2: Static quality gates

```bash
npm run lint
npm run typecheck
npm run i18n:check
```

Expected result:
- Import boundaries hold.
- TypeScript strict passes.
- `en` and `id` catalogs remain in key parity.

### Scenario 3: Foundation shell tests

```bash
npm run test
```

Expected result:
- Unit/component/MSW tests pass for environment validation, provider wiring,
  shell variants, boundary states, and locale helpers.

### Scenario 4: Production build

```bash
npm run build
```

Expected result:
- The app builds with locale-prefixed routes, tokenized styles, and provider
  composition intact.
- No command output claims runtime backend verification.

### Scenario 4.1: Production build proof against placeholder shell pages

```bash
npm run build:proof
```

Expected result:
- Playwright starts from a production build and verifies that the placeholder
  shell pages remain routable.
- The proof stays within foundation-only routes and does not invoke business
  workflows.
- The proof does not claim live backend validation.

### Scenario 5: Playwright shell smoke

```bash
npm run test:e2e
```

Expected result:
- `/{locale}/foundation/public`, `/{locale}/foundation/user`, and
  `/{locale}/foundation/admin` render with the correct shell variant.
- Unsupported locale routes show controlled `not-found` results.
- Skip link, locale switching, and boundary states remain accessible.
- All shell smoke evidence remains fixture-backed and `RUNTIME-UNVERIFIED` for
  live backend behavior.

## Expected Evidence

- 393 px and 1440 px shell screenshots or Playwright assertions pass.
- No page-level horizontal overflow.
- No business workflow is reachable.
- No runtime backend verification is claimed.

## Latest Validation Record

Latest full validation run: **Monday, July 27, 2026**.

- `npm run verify:source`: PASS, `18/18` source artifacts matched the checksum manifest.
- `npm run lint`: PASS.
- `npm run typecheck`: PASS.
- `npm run i18n:check`: PASS.
- `npm run test`: PASS, `11` files and `23` tests.
- `npm run build`: PASS.
- `npm run test:e2e`: PASS, `29` Playwright tests across accessibility, E2E, and visual coverage.
- `npm run build:proof`: PASS, `1` production-build proof test.

## Saved Token and Responsive Evidence Notes

- Saved token authority remains `docs/source-of-truth/design/design-tokens.json` and `docs/source-of-truth/design/tokens.css`.
- Responsive evidence is covered by `tests/visual/foundation-shell.spec.ts` at `393px` and `1440px`.
- Locale and recovery evidence is covered by `tests/e2e/foundation-shell.spec.ts`.
- Accessibility evidence is covered by `tests/accessibility/foundation-shell.spec.ts` and `tests/accessibility/foundation-boundaries.spec.ts`.

## References

- [Plan](./plan.md)
- [Data Model](./data-model.md)
- [Foundation Shell Contract](./contracts/foundation-shell-contract.md)
- [Tooling and Quality Contract](./contracts/tooling-quality-contract.md)
