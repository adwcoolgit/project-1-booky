# Tasks: Project Foundation

**Input**: Design documents from `/specs/001-project-foundation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Critical behavior MUST be test-first or test-accompanied. This feature requires unit, component, MSW, E2E, accessibility, visual, i18n parity, and production build proof tasks because the shell baseline, boundary states, and governance surface are part of the delivered product.

**Organization**: Tasks are grouped by setup, foundation, and user story so each story remains independently testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel when the task edits different files and does not depend on unfinished work
- **[Story]**: Maps work to `US1`, `US2`, or `US3`
- Every task names exact file paths
- Tasks touching `src/shared/providers/app-providers.tsx`, `src/shared/providers/index.ts`, or shared public barrels are intentionally not marked `[P]` because they are hotspot files

## Phase 1: Setup (Repository and Package Tooling)

**Purpose**: Bootstrap the repository so the planned architecture and quality commands can exist.

- [X] T001 Initialize the root Next.js App Router workspace and package manifests in `package.json`, `package-lock.json`, `next.config.ts`, `postcss.config.mjs`, and `components.json`
- [X] T002 Create the planned source, test, and workflow directory skeleton in `src/app/`, `src/features/foundation-shell/`, `src/entities/`, `src/shared/`, `tests/`, and `.github/workflows/`
- [X] T003 [P] Add repository toolchain metadata and contributor defaults in `.nvmrc`, `.gitignore`, `.editorconfig`, and `README.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish architecture, validation, styling, providers, and tooling that block all user stories.

**CRITICAL**: No user story work can begin until this phase is complete.

### Foundation A: Compiler, Boundaries, and Runtime Safety

- [X] T004 Configure TypeScript strict compilation and path aliases in `tsconfig.json` and `next-env.d.ts`
- [X] T005 [P] Configure ESLint, formatting, and dependency-boundary enforcement in `eslint.config.mjs`, `.prettierrc.json`, and `.prettierignore`
- [X] T006 Define validated environment and runtime configuration with Zod in `src/shared/config/env.ts`, `src/shared/config/runtime.ts`, and `src/shared/i18n/config.ts`
- [X] T007 [P] Create normalized error and shared Zod parsing utilities in `src/shared/lib/errors/normalized-error.ts`, `src/shared/lib/zod/error-map.ts`, and `src/shared/lib/zod/parse-safe.ts`
- [X] T008 [P] Create the centralized Axios client foundation without auth interceptors or global multipart `Content-Type` in `src/shared/api/http-client.ts` and `src/shared/api/http-errors.ts`
- [X] T009 Create TanStack Query runtime defaults and isolated test QueryClient helpers in `src/shared/providers/query-client.ts` and `src/shared/test/create-test-query-client.ts`
- [X] T010 Create the minimal Zustand shell-state foundation for justified client-only UI state in `src/shared/store/shell-store.ts`
- [X] T011 Configure locale-prefixed routing, locale validation, and request helpers in `src/shared/i18n/routing.ts`, `src/shared/i18n/request.ts`, and `src/proxy.ts`
- [X] T012 Create the root App Router composition scaffold in `src/app/[locale]/layout.tsx`, `src/app/[locale]/(foundation)/foundation/public/page.tsx`, `src/app/[locale]/(foundation)/foundation/user/page.tsx`, `src/app/[locale]/(foundation)/foundation/admin/page.tsx`, and `src/app/global-error.tsx`

### Foundation B: Design System, Providers, and Quality Tooling

- [X] T013 Import saved Booky tokens into reusable CSS variables in `src/shared/styles/booky-tokens.ts` and `src/shared/styles/tokens.css`
- [X] T014 Configure the Tailwind semantic theme and Booky-rethemed shadcn baseline in `tailwind.config.ts`, `components.json`, and `src/app/globals.css`
- [X] T015 Load Quicksand once through the App Router font pipeline in `src/shared/styles/fonts.ts` and `src/app/[locale]/layout.tsx`
- [X] T016 Create shared accessibility primitives and focus styling in `src/shared/ui/skip-link.tsx`, `src/shared/ui/focus-target.tsx`, and `src/shared/styles/a11y.css`
- [X] T017 Compose the shared provider hotspot for runtime and tests in `src/shared/providers/app-providers.tsx`, `src/shared/providers/index.ts`, and `src/shared/test/render-with-providers.tsx`
- [X] T018 Set up Vitest, React Testing Library, MSW, Playwright, and axe foundations in `vitest.config.ts`, `playwright.config.ts`, `tests/setup/vitest.setup.ts`, `tests/setup/msw/server.ts`, `tests/setup/msw/browser.ts`, and `tests/setup/msw/handlers.ts`
- [X] T019 Wire local quality commands and source verification entry points in `package.json`, `scripts/check-i18n-parity.mjs`, and `scripts/verify-source-of-truth.mjs`
- [X] T020 Create non-universal public API barrels for the planned ownership layers in `src/features/foundation-shell/index.ts`, `src/entities/app-shell/index.ts`, `src/entities/boundary-state/index.ts`, `src/entities/locale-route/index.ts`, `src/shared/providers/index.ts`, and `src/shared/ui/index.ts`

**Checkpoint**: Compiler, boundaries, design baseline, providers, and test tooling are ready for story implementation.

---

## Phase 3: User Story 1 - Use a Stable Localized Shell (Priority: P1) MVP

**Goal**: Deliver stable public, user, and admin placeholder shell routes in `en` and `id` without any business workflow.

**Independent Test**: Open `/{locale}/foundation/public`, `/{locale}/foundation/user`, and `/{locale}/foundation/admin` in both locales at 393 px and 1440 px, then verify correct shell variant, document language metadata, readable localized copy, preserved route context during locale switching, and no business behavior.

### Tests for User Story 1

- [X] T021 [P] [US1] Add unit and component coverage for locale routing, shell selection, and metadata behavior in `tests/unit/shared/i18n/routing.test.ts`, `tests/unit/entities/locale-route/model.test.ts`, and `tests/component/features/foundation-shell/foundation-shell.test.tsx`
- [X] T022 [P] [US1] Add Playwright shell smoke and responsive visual coverage for placeholder routes in `tests/e2e/foundation-shell.spec.ts` and `tests/visual/foundation-shell.spec.ts`
- [X] T023 [P] [US1] Add accessibility coverage for skip link, locale switcher, and visible focus behavior in `tests/accessibility/foundation-shell.spec.ts`

### Implementation for User Story 1

- [X] T024 [P] [US1] Create starter translation catalogs and namespace loading for shell copy in `src/shared/i18n/messages/en/foundation.json`, `src/shared/i18n/messages/id/foundation.json`, and `src/shared/i18n/get-messages.ts`
- [X] T025 [P] [US1] Implement shell-variant and locale-route entities for placeholder navigation in `src/entities/app-shell/model.ts`, `src/entities/locale-route/model.ts`, and `src/features/foundation-shell/config/foundation-routes.ts`
- [X] T026 [US1] Implement the user-facing shell, admin-facing shell, and locale switcher components in `src/features/foundation-shell/components/user-shell.tsx`, `src/features/foundation-shell/components/admin-shell.tsx`, and `src/features/foundation-shell/components/locale-switcher.tsx`
- [X] T027 [US1] Compose localized root layout, metadata, and placeholder pages in `src/app/[locale]/layout.tsx`, `src/app/[locale]/(foundation)/foundation/public/page.tsx`, `src/app/[locale]/(foundation)/foundation/user/page.tsx`, and `src/app/[locale]/(foundation)/foundation/admin/page.tsx`
- [X] T028 [US1] Reconcile shell composition with provider and public-API hotspots in `src/shared/providers/app-providers.tsx`, `src/shared/providers/index.ts`, `src/features/foundation-shell/index.ts`, `src/entities/app-shell/index.ts`, and `src/entities/locale-route/index.ts`

**Checkpoint**: User Story 1 should provide a localized, responsive, non-business shell baseline that is independently testable.

---

## Phase 4: User Story 2 - Receive Accessible Boundary States (Priority: P2)

**Goal**: Standardize localized loading, error, and not-found experiences that keep the shell understandable and accessible.

**Independent Test**: Trigger loading, error, and unsupported-locale not-found states on the foundation routes and verify localized copy, preserved shell hierarchy, keyboard access, focus recovery, and no redirect to another locale.

### Tests for User Story 2

- [X] T029 [P] [US2] Add unit and component coverage for loading, error, and not-found state models in `tests/unit/entities/boundary-state/model.test.ts`, `tests/component/entities/boundary-state/boundary-state-view.test.tsx`, and `tests/unit/app/unsupported-locale.test.ts`
- [X] T030 [P] [US2] Add Playwright and accessibility coverage for boundary-state flows in `tests/e2e/foundation-boundaries.spec.ts` and `tests/accessibility/foundation-boundaries.spec.ts`

### Implementation for User Story 2

- [X] T031 [P] [US2] Implement boundary-state entities and localized content models in `src/entities/boundary-state/model.ts` and `src/entities/boundary-state/copy.ts`
- [X] T032 [US2] Implement localized loading, error, not-found, and global-error boundaries in `src/app/[locale]/loading.tsx`, `src/app/[locale]/error.tsx`, `src/app/[locale]/not-found.tsx`, and `src/app/global-error.tsx`
- [X] T033 [US2] Connect shell-aware boundary rendering, recovery actions, and focus targets in `src/features/foundation-shell/components/boundary-state-view.tsx`, `src/shared/ui/skip-link.tsx`, and `src/shared/styles/a11y.css`
- [X] T034 [US2] Update boundary translations and align shell contract wording in `src/shared/i18n/messages/en/boundaries.json`, `src/shared/i18n/messages/id/boundaries.json`, and `specs/001-project-foundation/contracts/foundation-shell-contract.md`

**Checkpoint**: User Stories 1 and 2 should both work independently with localized and accessible boundary behavior.

---

## Phase 5: User Story 3 - Extend Future Features Predictably (Priority: P3)

**Goal**: Deliver deterministic tooling, fixtures, governance, and documentation so later features can reuse one approved repository foundation.

**Independent Test**: Review the repository outputs and run the documented commands to confirm source verification, translation parity, deterministic tests, and production build proof all work without implementing auth or domain workflows.

### Tests for User Story 3

- [X] T035 [P] [US3] Add unit coverage for env parsing, Query defaults, Axios normalization, and shell-store limits in `tests/unit/shared/config/env.test.ts`, `tests/unit/shared/providers/query-client.test.ts`, `tests/unit/shared/api/http-client.test.ts`, and `tests/unit/shared/store/shell-store.test.ts`
- [X] T036 [P] [US3] Add deterministic fixture and MSW contract coverage for foundation-only request surfaces in `tests/fixtures/foundation/shell-fixtures.ts`, `tests/fixtures/foundation/source-artifacts.ts`, and `tests/contract/foundation/msw-contract.test.ts`

### Implementation for User Story 3

- [X] T037 [P] [US3] Implement deterministic fixture packs and MSW handlers in `tests/fixtures/foundation/shell-fixtures.ts`, `tests/fixtures/foundation/source-artifacts.ts`, and `tests/setup/msw/handlers.ts`
- [X] T038 [US3] Implement translation-parity and local quality command wiring in `scripts/check-i18n-parity.mjs`, `scripts/run-foundation-quality.mjs`, and `package.json`
- [X] T039 [US3] Document source-of-truth checksum authority and the runtime-unverified API stance in `README.md` and `specs/001-project-foundation/quickstart.md`
- [X] T040 [US3] Implement the initial CI quality-gate pipeline in `.github/workflows/ci.yml`
- [X] T041 [US3] Prove the production build works with placeholder shell pages in `package.json`, `tests/e2e/foundation-shell.spec.ts`, and `specs/001-project-foundation/quickstart.md`

**Checkpoint**: All user stories should now be independently functional, deterministic, and documented for future extension.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish cross-story quality, documentation, and evidence updates.

- [X] T042 [P] Finalize translation parity, saved-token references, and responsive evidence notes in `README.md`, `specs/001-project-foundation/plan.md`, and `specs/001-project-foundation/quickstart.md`
- [X] T043 Reconcile final accessibility, focus, and no-horizontal-overflow polish in `src/app/globals.css`, `src/shared/styles/a11y.css`, and `tests/visual/foundation-shell.spec.ts`
- [X] T044 [P] Fill any remaining unit, component, contract, E2E, accessibility, or visual gaps in `tests/unit/`, `tests/component/`, `tests/contract/`, `tests/e2e/`, `tests/accessibility/`, and `tests/visual/`
- [X] T045 Run and record the required validation commands in `README.md` and `specs/001-project-foundation/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Starts immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 and blocks all user stories
- **Phase 3 (US1)**: Depends on Phase 2 and defines the MVP shell baseline
- **Phase 4 (US2)**: Depends on Phase 3 for shell context and can extend boundary behavior without adding business workflows
- **Phase 5 (US3)**: Depends on Phase 2, but should land after US1 and US2 so governance and quality evidence reflect the implemented shell and boundary baseline
- **Phase 6 (Polish)**: Depends on all desired stories being complete

### User Story Dependencies

- **US1 (P1)**: Starts after Foundational and has no dependency on later stories
- **US2 (P2)**: Starts after US1 establishes the localized shell it must preserve
- **US3 (P3)**: Starts after Foundational, but should close after US1 and US2 so its docs, fixtures, and CI evidence match the delivered UX baseline

### Within Each User Story

- Tests are defined before implementation and should fail first where practical
- Entities and config precede route or component composition
- Hotspot files for providers and shared barrels stay serial
- Translation updates are required before closing any story that changes user-facing copy
- Story-specific validation should happen before moving to the next phase

### Parallel Opportunities

- `T003` can run in parallel with `T001`-`T002` after the root workspace exists
- `T005`, `T007`, and `T008` can run in parallel after `T004`
- `T013`, `T014`, `T016`, and `T018` can run in parallel after the Phase 2 structure exists
- `T021`, `T022`, and `T023` can run in parallel for US1
- `T024` and `T025` can run in parallel before `T026`-`T028`
- `T029` and `T030` can run in parallel for US2
- `T031` can run in parallel ahead of `T032`-`T034`
- `T035`, `T036`, and `T037` can run in parallel for US3
- `T042` and `T044` can run in parallel during polish
- Do not parallelize tasks that edit `src/shared/providers/app-providers.tsx`, `src/shared/providers/index.ts`, `package.json`, or shared public barrels

---

## Parallel Example: User Story 1

```bash
# Launch User Story 1 verification work together
Task: "T021 Add unit and component coverage for locale routing, shell selection, and metadata behavior"
Task: "T022 Add Playwright shell smoke and responsive visual coverage for placeholder routes"
Task: "T023 Add accessibility coverage for skip link, locale switcher, and visible focus behavior"

# Launch independent implementation work together
Task: "T024 Create starter translation catalogs and namespace loading for shell copy"
Task: "T025 Implement shell-variant and locale-route entities for placeholder navigation"
```

---

## Parallel Example: User Story 3

```bash
# Launch deterministic foundation checks together
Task: "T035 Add unit coverage for env parsing, Query defaults, Axios normalization, and shell-store limits"
Task: "T036 Add deterministic fixture and MSW contract coverage for foundation-only request surfaces"
Task: "T037 Implement deterministic fixture packs and MSW handlers"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate `npm run lint`, `npm run typecheck`, `npm run i18n:check`, `npm run test`, and the US1 shell smoke coverage
5. Stop and review the shell baseline before adding boundary or governance follow-up work

### Incremental Delivery

1. Setup plus Foundational creates the reusable repository baseline
2. US1 delivers the localized shell MVP
3. US2 adds resilient loading, error, and not-found behavior
4. US3 hardens tooling, fixtures, CI, and documentation
5. Phase 6 records final evidence and closes residual gaps

### Parallel Team Strategy

1. One engineer owns the Phase 1 and Phase 2 hotspot files (`package.json`, provider composition, shared barrels)
2. Once Phase 2 is complete:
   - Engineer A can drive US1 shell routes and locale UX
   - Engineer B can prepare US2 boundary tests and entities
   - Engineer C can prepare US3 fixtures, docs, and quality automation
3. Merge hotspot tasks serially to avoid provider, barrel, and package conflicts

---

## Notes

- [P] means different files and no dependency on incomplete work
- No task in this file implements auth, catalog, cart, loan, profile, review, or admin business behavior
- No task fetches or rereads Figma; all design work must use saved tokens and saved context only
- TanStack Query is prepared only as shared infrastructure; this feature does not add domain query adapters
- `RESPONSE-SCHEMA-PARTIAL` remains a documentation and fixture concern only in this phase
- All tasks follow the required checklist format with IDs, optional `[P]`, optional story labels, and exact file paths



