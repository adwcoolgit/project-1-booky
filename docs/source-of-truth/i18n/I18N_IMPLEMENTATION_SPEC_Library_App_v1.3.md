# Library App - i18n Implementation Specification v1.3

## Decision Summary

| Decision | Value |
|---|---|
| Integration | next-intl |
| Locales | `en`, `id` |
| Default | `en` |
| URL strategy | Always prefixed |
| Direction | LTR for MVP |
| Source copy | English |
| Persistence | Locale cookie for guest and authenticated sessions |
| Backend profile field | Not documented; do not send `preferredLocale` |

## Translation Boundary

Translate navigation, buttons, headings, helper/validation text, normalized errors, statuses, empty/loading/success states, and date/number/plural presentation.

Do not automatically translate book titles, author names, profile data, user reviews, transport enums, IDs, query keys, or analytics identifiers.

## Language Switcher

- Auth pages: compact top-right control outside the centered form.
- Authenticated User/Admin: inside avatar menu before Logout.
- Display accessible self-names `English` and `Bahasa Indonesia`; the visible control MAY be flag-only if those names remain available through sr-only text or an equivalent accessible name.
- Preserve pathname, dynamic IDs, search params, hash, and session.
- Persist using locale cookie only; the OpenAPI register/profile requests contain no locale field.
- Do not invalidate locale-neutral API queries merely because UI locale changes.

## API and Error Localization

- Send `Accept-Language` as a request preference, but do not assume catalog responses are localized.
- OpenAPI does not define stable error body codes; normalize HTTP statuses to language-neutral frontend codes and localize at presentation.
- Raw backend messages are diagnostics/fallback context, not the sole user-facing copy.

## Formatting

- Preserve date-time instants and calendar dates separately.
- Format borrow/review/profile dates at presentation.
- Use ICU plural/select for books, reviews, copies, and loan days.
- Locale formatting never changes loan business calculations.

## Quality Gate

- `en`/`id` key parity.
- No mixed-language system copy.
- No clipped labels at 393 px and 1440 px with 30% text expansion.
- Correct `lang`, keyboard/focus behavior, and self-named language options.
- Locale switching preserves route/query/session.
- No undocumented locale field sent to backend.
