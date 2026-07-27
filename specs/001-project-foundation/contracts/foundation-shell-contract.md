# Foundation Shell Contract

## Purpose

Define the non-functional interface that the Booky foundation exposes to later
features: locale-prefixed placeholder routes, shell variants, provider
composition, and boundary-state behavior.

## Route Matrix

| Route | Area | Shell Variant | Purpose | Business Behavior |
|------|------|---------------|---------|-------------------|
| `/{locale}/foundation/public` | Public | `user-facing` | Validate locale-prefixed public shell baseline | None |
| `/{locale}/foundation/user` | User | `user-facing` | Validate authenticated-area shell baseline without auth logic | None |
| `/{locale}/foundation/admin` | Admin | `admin-facing` | Validate admin shell baseline without admin workflows | None |

## Locale Contract

- Supported locales: `en`, `id`
- Locale segment is mandatory in every foundation route.
- Default locale remains `en` for negotiation/config.
- Unsupported locale segments render a controlled `not-found` result with no
  redirect.
- Locale switching must preserve the current placeholder route.
- The root document must set `lang` from the active locale and derive `dir`.

## Shell Variant Contract

### `user-facing`
- Includes Booky brand presence, skip link, locale switcher, and non-functional
  navigation placeholders suitable for public and user contexts.
- Must preserve 80 px desktop header and 64 px mobile header references.
- Must not imply login, cart, profile, or catalog workflow completion.

### `admin-facing`
- Includes Booky brand presence, skip link, locale switcher, and non-functional
  admin navigation placeholders.
- Must preserve the distinct admin shell framing defined by the saved sources.
- Must not imply user list, book list, or loan management behavior.

## Boundary-State Contract

| State | Trigger Surface | Required Behavior |
|------|------------------|-------------------|
| Loading | Route or provider suspense/loading path | Localized message or skeleton, shell hierarchy preserved |
| Error | Route error boundary or provider error surface | Localized error copy, retry/help action where applicable, accessible heading and focus behavior |
| Not found | Unsupported locale or missing foundation route | Localized not-found copy, no redirect, shell-safe recovery link |

- Foundation placeholder routes MAY accept a foundation-only `boundary` query
  trigger with values `loading`, `error`, or `not-found` solely to prove
  boundary behavior in this feature.
- That trigger MUST remain non-business, MUST preserve the existing shell
  variant, and MUST NOT be reused as an application workflow contract.

## Provider Contract

The foundation exposes one provider composition entry point with these rules:
- Query provider exists with shared defaults but no domain queries yet.
- Locale-aware client helpers exist only where interaction requires them.
- No auth/session provider or token interceptor is introduced in this feature.
- Provider composition must be reusable by later business routes without
  rewriting the root layout.

## Accessibility Contract

- Every placeholder route must include a visible-on-focus skip link target.
- One logical `h1` per placeholder page.
- Language switcher is keyboard accessible and labeled with self-names.
- Error and loading announcements use assistive-friendly semantics.
- No shell variant may hide focus states or rely on color alone.

## Visual Contract

- Typography, colors, spacing, radii, shadow, and shell geometry map back to
  saved Booky tokens only.
- Public/user/admin placeholder routes must pass 393 px and 1440 px reference
  validation.
- Intermediate widths must interpolate without page-level horizontal overflow.
