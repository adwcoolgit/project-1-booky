# Implementation Plan: Project Foundation

**Branch**: `[not-detected]` | **Date**: 2026-07-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-project-foundation/spec.md`

**Note**: This plan translates the approved foundation specification into a
Next.js-based implementation design while preserving Booky's source-of-truth
and constitutional rules.

## Summary

Build a single Next.js App Router foundation that establishes Booky's
repository setup, source-of-truth integrity verification, localized public/
user/admin shell scaffolding, design-token baseline, provider stack, boundary
states, test harness, fixture/MSW baseline, and CI quality gates. The plan
explicitly avoids domain API adapters and business screens while preparing the
paths, modules, scripts, and guardrails that later features will extend.

## Required Source Review

The following sources were used in the required priority order:

1. `docs/source-of-truth/product/PRD_Library_App_Figma_Aligned_v1.3.md`
2. `docs/source-of-truth/api/Library_App_OpenAPI_3.0.3_v1.0.0.json`
3. `docs/source-of-truth/api/API_CONTRACT_INTEGRATION_SPEC_Library_App_v1.3.md`
4. `docs/source-of-truth/design/Library_App_Figma_Read_Ledger.md`
5. `docs/source-of-truth/design/design-tokens.json`
6. `docs/source-of-truth/i18n/I18N_IMPLEMENTATION_SPEC_Library_App_v1.3.md`
7. `docs/source-of-truth/engineering/ENGINEERING_INSTRUCTIONS_Library_App_v1.3.md`
8. `docs/source-of-truth/source-of-truth-manifest.json`
9. `scripts/verify-source-of-truth.mjs`
10. `docs/spec-kit-execution/roadmap/QUALITY_GATES.md`

Conflicts and gaps carried forward into the design:
- Runtime API behavior remains `RUNTIME-UNVERIFIED` and is not assumed by this
  foundation feature.
- Description-only responses remain `RESPONSE-SCHEMA-PARTIAL`, but no domain
  adapters are introduced in this phase.
- Auth/logout/refresh behavior remains deferred to the future session feature;
  the Axios foundation must not invent token handling now.
- Unsupported locale handling is fixed by clarification: render a controlled
  `not-found` result without redirect.

## Technical Context

**Framework**: Next.js App Router with Server Components by default and
isolated Client Components only for language switching, provider hydration, and
interactive shell affordances

**Language/Version**: TypeScript strict on Node.js 22 LTS with React 19
compatible App Router setup

**Primary Dependencies**: Next.js App Router, Tailwind CSS utility-first,
shadcn/ui rethemed to Booky tokens, next-intl, TanStack Query, Axios, Zod,
Zustand for approved UI-only state, Vitest, React Testing Library, MSW,
Playwright, axe-core/playwright

**Storage**: No domain persistence in this phase; cookies for locale
persistence only; optional in-memory fixture data and test snapshots

**Testing**: Vitest for unit/component, React Testing Library for providers and
shell components, MSW for deterministic request interception, Playwright for
E2E/visual/accessibility smoke, and the existing i18n parity script

**Target Platform**: Responsive web application for desktop 1440 px,
mobile 393 px, and controlled intermediate widths

**Project Type**: Single Next.js frontend application in the repository root
with documentation-first source packs and feature-scoped specs under `specs/`

**Performance Goals**: No page-level horizontal overflow; root shell renders
without mixed-language flashes; boundary states remain responsive; client
providers are minimized to small islands; initial CI completes lint,
typecheck, i18n check, tests, and build inside a single PR pipeline

**Constraints**: Use only saved Figma context and local assets; do not reread
completed Figma nodes; preserve `docs/source-of-truth` and verify checksums;
do not implement login/catalog/cart/loan/profile/review/admin workflows; do
not add auth assumptions beyond the future documented session boundary; keep
remote state out of Zustand; do not create domain API adapters yet

**Scale/Scope**: One foundation slice covering repository bootstrap, shared
architecture, shell scaffolding, provider/config/test infrastructure, and CI
quality gates only

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Source-of-truth review is listed in priority order.
- [x] Conflicts and undocumented behavior are tracked explicitly.
- [x] The feature does not add behavior absent from the approved specification.
- [x] Architecture obeys `app composition -> features -> entities -> shared`.
- [x] Server/Client Component boundaries are justified.
- [x] TanStack Query owns remote state, and any Zustand usage is limited and
      named.
- [x] OpenAPI paths, parameters, media types, statuses, and Bearer security are
      exact for the future foundation surface; no unsupported API behavior is
      invented now.
- [x] API DTOs, domain models, and presentation models are separated and
      boundary validation with Zod is defined for config/request surfaces.
- [x] Description-only responses remain marked `RESPONSE-SCHEMA-PARTIAL` and
      are not implemented as domain adapters in this phase.
- [x] Session and JWT handling are documented without insecure persistence.
- [x] `en` and `id` locale routing, formatting, metadata, and accessibility are
      covered.
- [x] 393 px and 1440 px fidelity, plus intermediate-width behavior, are
      covered.
- [x] Acceptance scenarios trace to required tests and to loading, empty,
      error, conflict, forbidden, and partial-success states as applicable to
      a shell-only foundation.
- [x] Validation commands are recorded, and command names align with the source
      pack and quality-gate docs.

## Project Structure

### Documentation (this feature)

```text
specs/001-project-foundation/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   |-- foundation-shell-contract.md
|   `-- tooling-quality-contract.md
`-- tasks.md
```

### Source Code (repository root)

```text
src/
|-- app/
|   |-- [locale]/
|   |   |-- (foundation)/
|   |   |   |-- foundation/
|   |   |   |   |-- public/page.tsx
|   |   |   |   |-- user/page.tsx
|   |   |   |   `-- admin/page.tsx
|   |   |-- layout.tsx
|   |   |-- loading.tsx
|   |   |-- not-found.tsx
|   |   `-- error.tsx
|   |-- global-error.tsx
|   `-- globals.css
|-- features/
|   `-- foundation-shell/
|       |-- components/
|       |-- config/
|       |-- routes/
|       `-- tests/
|-- entities/
|   |-- app-shell/
|   |-- boundary-state/
|   `-- locale-route/
`-- shared/
    |-- api/
    |-- config/
    |-- i18n/
    |-- lib/
    |-- providers/
    |-- styles/
    |-- test/
    `-- ui/

tests/
|-- unit/
|-- component/
|-- contract/
|-- e2e/
|-- accessibility/
|-- visual/
`-- fixtures/
    `-- foundation/
```

**Structure Decision**: Use one Next.js application rooted at `src/app` with
route groups for non-functional foundation routes, one feature module for shell
composition, narrow entities for shell/locale/boundary concepts, and a shared
layer for provider/config/style/test primitives. This keeps the dependency
flow explicit while avoiding domain-specific adapters in the foundation phase.

## Phase 0 Research Summary

Research resolves all technical unknowns needed for implementation:
- Repository bootstrap uses a single Next.js app with npm scripts aligned to
  constitutional quality gates.
- Locale handling uses always-prefixed routing with a controlled `not-found`
  outcome for unsupported locale segments.
- Shell surface includes three non-functional placeholder routes using two
  shell variants: public and user share the user-facing shell baseline, while
  admin uses the admin-facing shell baseline.
- Tailwind semantic tokens are sourced from CSS variables generated from the
  saved `design-tokens.json` snapshot.
- Query, Axios, MSW, and CI foundations are created without domain adapters or
  auth/session implementation.

## Post-Design Constitution Check

- [x] The designed structure still obeys `app composition -> features ->
      entities -> shared`.
- [x] Only locale switching, provider hydration, and minimal shell interactions
      require Client Components.
- [x] The plan keeps TanStack Query ready for future server state without
      duplicating it in Zustand.
- [x] Axios is centralized without premature auth assumptions.
- [x] i18n, accessibility, 393 px/1440 px fidelity, and source-of-truth
      integrity remain explicit design outputs.
- [x] No domain business screen or adapter enters this foundation plan.

## Complexity Tracking

No constitutional violations require justification for this plan.

## Saved Token References and Responsive Evidence

- Saved token authority remains:
  - `docs/source-of-truth/design/design-tokens.json`
  - `docs/source-of-truth/design/tokens.css`
  - `src/shared/styles/tokens.css`
- Mobile and desktop responsive evidence is enforced through `tests/visual/foundation-shell.spec.ts` at `393 px` and `1440 px`.
- Locale switching, unsupported-locale recovery, and production-build proof are enforced through `tests/e2e/foundation-shell.spec.ts`.
- Boundary accessibility evidence is enforced through `tests/accessibility/foundation-shell.spec.ts` and `tests/accessibility/foundation-boundaries.spec.ts`.
- Latest full validation record captured on **Monday, July 27, 2026**:
  - `npm run verify:source` PASS (`18/18` checksum matches)
  - `npm run lint` PASS
  - `npm run typecheck` PASS
  - `npm run i18n:check` PASS
  - `npm run test` PASS (`11` files, `23` tests)
  - `npm run build` PASS
  - `npm run test:e2e` PASS (`29` Playwright tests)
  - `npm run build:proof` PASS (`1` production-build proof test)