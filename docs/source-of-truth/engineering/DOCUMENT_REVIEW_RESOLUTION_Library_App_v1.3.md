# Library App v1.3 - Document Review Resolution

| Review finding | v1.3 resolution |
|---|---|
| Status was too optimistic | Status now separates implementation-ready documentation from runtime-unverified behavior |
| Live vs mock capability unclear | Added strict-live, hybrid-portfolio, and mock deployment modes plus screen contract status |
| `/loans/from-cart` uncertain | Request is documented: CartItem `itemIds`, 3/5/10 days, optional calendar borrow date |
| Locale preference contradiction | Removed backend `preferredLocale`; cookie persistence only |
| Cart store ownership inconsistent | Cart is TanStack Query server state; Zustand may hold selected CartItem IDs only |
| Tests mixed live/mock | Added contract-mock, portfolio-mock, and optional runtime-integration profiles |
| Author/category UI scope creep | API CRUD acknowledged; UI remains outside supplied Figma unless separately specified |
| Guard ordering unclear | Session/locale responsibilities clarified in architecture and security rules |
| Date model too broad | Split date-time and local-date schemas |
| Endpoint manifest too weak | Expanded to 41 operations with security, parameters, media types, required fields, statuses, schema/runtime status |
| Accessibility audit overclaim | v1.3 audit reports document structure only; application accessibility remains implementation QA |
| API capabilities understated | Added persistent cart, profile, reviews, admin users/overview, upload formats, Bearer JWT |
| Figma/API field mismatch | Added explicit pageCount, imagery, ISBN/year/copies gap decisions |
