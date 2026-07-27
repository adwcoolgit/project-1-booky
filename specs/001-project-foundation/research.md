# Research: Project Foundation

## Decision 1: Repository bootstrap uses a single root Next.js application
- Decision: Initialize one Next.js App Router application at repository root
  with npm-based scripts and a root-level `src/` directory.
- Rationale: The feature is a single frontend foundation, the constitutional
  structure already assumes one app, and the required commands are all npm
  based.
- Alternatives considered:
  - Monorepo/workspaces: rejected because the foundation feature has no second
    deployable surface yet.
  - App outside repo root: rejected because it complicates source-of-truth,
    specs, and CI paths without product value.

## Decision 2: Use route-grouped non-functional placeholder routes
- Decision: Expose representative placeholder routes at
  `/{locale}/foundation/public`, `/{locale}/foundation/user`, and
  `/{locale}/foundation/admin`.
- Rationale: The routes stay clearly non-business, satisfy the clarified scope,
  and let shell, locale, and boundary behavior be tested independently.
- Alternatives considered:
  - Reusing real business routes such as `/login` or `/admin/users`: rejected
    because that would blur scope and create early business-screen expectations.
  - Single demo route only: rejected because it does not prove public/user/admin
    coverage.

## Decision 3: Public and user placeholders share the user-facing shell variant
- Decision: Implement two shell variants, with public and user placeholders
  using the user-facing shell baseline and admin placeholders using the admin
  shell baseline.
- Rationale: The clarification requires two shell variants, not three. The PRD
  already distinguishes user-facing and admin-facing compositions.
- Alternatives considered:
  - Three separate shell variants: rejected because the spec only needs two.
  - Admin deferred entirely: rejected by clarification.

## Decision 4: Unsupported locales resolve to controlled `not-found`
- Decision: Validate locale segments at the route boundary and render a
  localized controlled `not-found` result without redirect when unsupported.
- Rationale: This was explicitly clarified and matches the i18n policy against
  mixed-language fallbacks.
- Alternatives considered:
  - Redirect to default locale: rejected by clarification.
  - Silent fallback inside the same page: rejected because it risks mixed-
    language rendering and ambiguous URLs.

## Decision 5: Server Components by default, minimal Client Components only
- Decision: Keep layouts, placeholder pages, metadata, and static shell
  composition as Server Components. Use Client Components only for language
  switcher interactions, Query provider hydration, and test-only helpers that
  require the client runtime.
- Rationale: This matches the constitution and minimizes client bundle cost.
- Alternatives considered:
  - Client-only root shell: rejected because it weakens SSR, metadata control,
    and performance.
  - Pure server-only setup: rejected because locale switching and provider
    hydration need client islands.

## Decision 6: Environment validation is Zod-based and split by boundary
- Decision: Create environment schemas for server and public runtime variables,
  with a small validated config surface: app URL, API base URL, default locale,
  and supported locales.
- Rationale: The engineering instructions require Zod at configuration
  boundaries, and the foundation needs a reliable base URL and locale config.
- Alternatives considered:
  - Raw `process.env` access throughout the app: rejected because it weakens
    safety and testability.
  - Overly broad env surface now: rejected because auth/session variables are
    not in scope yet.

## Decision 7: Design tokens map from CSS variables into semantic Tailwind names
- Decision: Generate root CSS variables from the saved design token snapshot and
  map them into semantic Tailwind tokens for typography, colors, radii,
  spacing, shadows, and shell geometry.
- Rationale: The source pack explicitly prioritizes design tokens over
  assumptions and asks for utility-first styling with semantic tokens.
- Alternatives considered:
  - Raw hex and arbitrary utility values everywhere: rejected because it causes
    drift and weakens maintainability.
  - Static Tailwind theme values only: rejected because CSS variables better
    preserve re-theme flexibility and shadcn/ui integration.

## Decision 8: Load Quicksand through the App Router root layout
- Decision: Load Quicksand once in the root layout and expose it through CSS
  variables that feed semantic typography utilities.
- Rationale: The design token source fixes Quicksand as display and body font,
  and one root-level load avoids fragmented font handling.
- Alternatives considered:
  - Manual stylesheet import: rejected because the App Router font pipeline is
    cleaner and easier to test for layout stability.
  - Per-route font loading: rejected because it risks duplication and flashes.

## Decision 9: Compose providers in a single `AppProviders` client boundary
- Decision: Introduce one thin `AppProviders` client component for TanStack
  Query, locale-aware client helpers, and test/dev-only provider hooks.
- Rationale: Provider composition stays explicit and keeps layouts mostly
  server-rendered.
- Alternatives considered:
  - Nested provider wrappers scattered by route: rejected because it obscures
    ownership and complicates testing.
  - Query provider omitted until domain data exists: rejected because the user
    explicitly asked for Query defaults and test utilities in the foundation.

## Decision 10: Centralize Axios without auth/session behavior
- Decision: Create an Axios factory in `shared/api` with base URL validation,
  JSON defaults, timeout/error normalization, and optional `Accept-Language`
  request decoration, but no token storage or auth interceptors.
- Rationale: The API integration spec permits `Accept-Language` as a preference
  and forbids inventing session behavior before the future session boundary is
  implemented.
- Alternatives considered:
  - Add auth interceptors now: rejected because the session feature is not in
    scope.
  - Defer Axios completely: rejected because the plan requires a centralized
    transport foundation.

## Decision 11: TanStack Query defaults should be conservative and testable
- Decision: Use a single QueryClient profile with deterministic defaults:
  `retry: 1`, `staleTime: 30000`, `gcTime: 600000`, no refetch on window focus,
  and test helpers that build isolated clients per test.
- Rationale: These defaults keep shell tests stable while still reflecting a
  production-ready posture for future read-heavy queries.
- Alternatives considered:
  - Aggressive retries/refetches: rejected because they create noisy tests and
    unnecessary shell churn.
  - No shared defaults: rejected because later features would diverge quickly.

## Decision 12: Use deterministic fixture packs and MSW foundation now
- Decision: Introduce fixture modules for locale catalogs, shell state,
  boundary-state content, and any request examples needed by MSW, with a small
  MSW server/browser setup shared by Vitest and Playwright.
- Rationale: The constitution requires deterministic fixtures for
  `RESPONSE-SCHEMA-PARTIAL` flows and predictable test behavior.
- Alternatives considered:
  - Inline test data per suite: rejected because it fragments the foundation.
  - Live backend calls in CI: rejected because runtime behavior is unverified.

## Decision 13: Enforce import boundaries through lint configuration
- Decision: Add import-boundary rules so `app` can depend on `features`,
  `entities`, and `shared`; `features` can depend on `entities` and `shared`;
  `entities` can depend only on `shared`; `shared` depends on nothing above it.
- Rationale: The constitution requires this direction and the user explicitly
  asked for import-boundary commands and enforcement.
- Alternatives considered:
  - Convention-only boundaries: rejected because they are too easy to break.
  - TypeScript path aliases without lint enforcement: rejected because aliases
    alone do not block invalid imports.

## Decision 14: CI gates mirror the constitutional command list plus source checks
- Decision: Define an initial CI pipeline that runs source-of-truth checksum
  verification, install, lint, typecheck, i18n parity, unit/component tests,
  build, and Playwright smoke checks for foundation routes.
- Rationale: The constitution and quality-gate docs already define the minimum
  release gate, and the foundation feature adds source-pack integrity as a
  first-class guard.
- Alternatives considered:
  - Build-only CI: rejected because it misses translation, accessibility, and
    architecture regressions.
  - Full visual snapshots on every job: rejected for the foundation phase;
    reserved for targeted visual runs once the shell exists.
