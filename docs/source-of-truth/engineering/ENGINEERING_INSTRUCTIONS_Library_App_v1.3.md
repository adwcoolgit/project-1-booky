# Library App - Engineering Implementation Instructions v1.3

This file is the execution-oriented companion to PRD v1.3.

## Mandatory Stack

- Next.js App Router
- TypeScript strict
- Tailwind CSS utility-first
- shadcn/ui
- Zustand
- Zod
- Axios
- TanStack Query
- next-intl

## Contract Source

- Embedded OpenAPI: `library-app-api-reference.txt`
- OpenAPI: `3.0.3`
- API version: `1.0.0`
- Runtime base: `https://library-backend-production-b9cf.up.railway.app/api`
- Security: HTTP Bearer JWT on protected operations
- Inventory: 31 paths, 41 operations
- Runtime behavior: not tested for v1.3

## Non-negotiable Architecture

1. Default to Server Components and isolate interactive client islands.
2. Apply feature/entity/shared Separation of Concerns with public APIs.
3. Use TanStack Query for every remote entity, including persistent cart.
4. Zustand may store shell UI and selected CartItem IDs only.
5. Parse route IDs to positive integers.
6. Keep API DTOs, frontend domain models, and presentation formatting separate.
7. Use Bearer JWT; prefer a Next.js BFF with an HttpOnly cookie.
8. Never store JWT in Zustand or logs.
9. Do not set a global Content-Type; support JSON and multipart correctly.
10. Send only documented fields and parameters.
11. Validate documented `Book` and `LoginResponse` properties; their requiredness is not declared, so enforce screen-required fields in domain mappers.
12. Mark description-only response adapters `RESPONSE-SCHEMA-PARTIAL`.
13. Implement `en`/`id` locale-prefixed routes; persist locale in cookie only.
14. Never send `preferredLocale`, `confirmPassword`, policy agreement, or `pageCount` to the API.
15. Match saved Figma at 393 px and 1440 px; do not re-read nodes without permission.

## Core API Rules

- Axios base URL ends in `/api`; service paths do not repeat `/api`.
- Protected calls use `Authorization: Bearer <token>`.
- Cart is server state: `/cart`, `/cart/checkout`, `/cart/items`.
- Loan-from-cart `itemIds` are CartItem IDs.
- Direct loan days: 1-30; cart days: 3/5/10.
- Loan transport status: `BORROWED`, `LATE`, `RETURNED`.
- Review request: `bookId`, `star`, optional `comment`.
- Create book requires `title`, `isbn`, `categoryId`, plus `authorId` or `authorName`.
- Book/profile uploads allow documented image formats and max 5 MB.
- Figma page count is an unresolved API gap.

## Required Query Roots

`books`, `authors`, `categories`, `cart`, `loans`, `me`, `reviews`, `admin-overview`, `admin-users`, `admin-books`, `admin-loans`.

## Required Commands

```bash
npm run lint
npm run typecheck
npm run i18n:check
npm run test
npm run test:e2e
npm run build
```

Full runtime smoke/mutation testing is not required for the documentation revision. Use MSW for contract and portfolio test profiles.

## Review Checklist

- No remote data duplicated in Zustand.
- No JWT in Zustand/source/logs.
- No `/api` duplication.
- No global multipart Content-Type.
- No undocumented request/query fields.
- No string ID past route parsing.
- No fabricated `pageCount` or `preferredLocale`.
- No description-only response presented as a final API schema.
- No hardcoded user-facing copy.
- English/Indonesian key parity passes.
- Cart partial-success reconciliation is covered.
- Protected routes preserve locale and clear session/cache on logout/401.
