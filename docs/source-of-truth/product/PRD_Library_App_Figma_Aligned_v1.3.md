# Product Requirements Document & Engineering Instructions
## Portfolio Library App - Figma-Aligned Implementation

**Stack:** Next.js + TypeScript + Tailwind CSS (utility-first) + shadcn/ui + Zustand + Zod + Axios + TanStack Query + next-intl (i18n)  
**Versi dokumen:** 1.3  
**Tanggal:** 26 Juli 2026  
**Status:** Implementation-ready for UI and documented API integration; runtime behavior and description-only response bodies remain unverified  
**Brand pada desain:** Booky  
**Sumber utama Figma:** file key `mPRibw77Y0L8Dl4BtqZZsK` dengan node ID yang tercatat pada Source-of-Truth Matrix  
**Sumber API:** embedded OpenAPI 3.0.3 pada `library-app-api-reference.txt` untuk Library API v1.0.0; runtime API root `https://library-backend-production-b9cf.up.railway.app/api`; runtime behavior tidak diuji pada revisi ini  
**Basis desain:** User Panel dan Admin Panel pada desktop 1440 px dan mobile 393 px, ditambah typography, colors, radius, dan spacing design-system nodes. Setiap supplied node telah dibaca sukses satu kali dan tidak boleh dibaca ulang tanpa izin eksplisit pemilik proyek.

---

## 1. Tujuan Dokumen

Dokumen ini menjadi sumber acuan utama untuk membangun portfolio project **Library App** yang mengikuti desain Figma desktop dan mobile serta menerapkan:

- reusable components dengan boundary yang nyata;
- Separation of Concerns (SoC);
- clean code dan strict TypeScript;
- modular, feature-based folder structure;
- maintainability dan testability;
- server-state management yang benar melalui TanStack Query;
- client UI state yang minimal melalui Zustand;
- runtime validation melalui Zod;
- HTTP boundary melalui Axios;
- accessibility, responsive behavior, performance, dan security;
- internationalization (i18n) untuk English dan Bahasa Indonesia;
- integrasi frontend berdasarkan embedded OpenAPI contract, dengan pemisahan tegas antara schema eksplisit, response description-only, dan runtime behavior yang belum diuji.

Dokumen dapat digunakan oleh developer manusia, reviewer, atau AI coding agent. Kode React/Tailwind yang pernah dihasilkan Figma hanya merupakan referensi visual. Dilarang menempelkannya sebagai satu component besar.

### 1.1 Aturan Penggunaan Figma

1. Gunakan hanya konteks lokal yang sudah tersimpan.
2. Jangan refresh, fetch ulang, atau membaca ulang node yang sudah sukses tanpa izin eksplisit.
3. Bila informasi tidak tercatat, tanyakan kepada pemilik proyek sebelum memakai Figma MCP lagi.
4. Desktop 1440 px dan mobile 393 px adalah explicit source layouts; tablet merupakan interpolasi terkontrol.
5. Design-system token mempunyai prioritas di atas asumsi implementasi.
6. Page-specific value yang terlihat konsisten boleh menjadi semantic token khusus aplikasi.

### 1.2 Normalisasi Nama Teknologi

| Penulisan awal | Nama yang digunakan |
|---|---|
| Next JS | Next.js |
| Tailwind CSS | Tailwind CSS utility-first |
| Shadcd | shadcn/ui |
| Zuzstand | Zustand |
| Tanstact Query | TanStack Query |
| Typscrypt | TypeScript |
| i8n | i18n (internationalization) |
| i18n library | next-intl |

### 1.3 Source-of-Truth Matrix

| Area | Screen / token group | Node ID | Reference |
| --- | --- | --- | --- |
| Design System | Typography | 10455:3156 | Token frame |
| Design System | Colors | 10458:11819 | Token frame |
| Design System | Radius | 10458:4406 | Token frame |
| Design System | Spacing | 10458:7361 | Token frame |
| User Desktop | Login | 39434:1274 | 1440 px |
| User Desktop | Register | 39434:1427 | 1440 px |
| User Desktop | Home after login | 39435:2889 | 1440 px |
| User Desktop | Avatar dropdown | 39437:12186 | Desktop overlay |
| User Desktop | Detail book | 39413:7289 | 1440 px |
| User Desktop | Category | 39435:9377 | 1440 px |
| User Desktop | Book by author | 39436:10431 | 1440 px |
| User Desktop | Cart | 39419:8771 | 1440 px |
| User Desktop | Checkout | 39419:8939 | 1440 px |
| User Desktop | Success | 39419:9207 | 1440 px |
| User Desktop | Borrowed list | 39437:10925 | 1440 px |
| User Desktop | Profile | 39419:9257 | 1440 px |
| User Desktop | Give review | 39437:11105 | Desktop modal |
| User Desktop | Reviews | 39437:11129 | 1440 px |
| User Mobile | Login | 39443:20973 | 393 px |
| User Mobile | Register | 39443:21020 | 393 px |
| User Mobile | Home after login | 39443:22213 | 393 px |
| User Mobile | Detail book | 39443:23090 | 393 px |
| User Mobile | Category | 39443:23464 | 393 px |
| User Mobile | Book by author | 39443:23467 | 393 px |
| User Mobile | Cart | 39448:6168 | 393 px |
| User Mobile | Checkout | 39448:6523 | 393 px |
| User Mobile | Success | 39448:6713 | 393 px |
| User Mobile | Borrowed list | 39448:7451 | 393 px |
| User Mobile | Profile | 39448:7616 | 393 px |
| User Mobile | Give review | 39448:7950 | Mobile modal |
| User Mobile | Reviews | 39448:8034 | 393 px |
| Admin Desktop | Login | 39440:12339 | 1440 px |
| Admin Desktop | User list | 39423:2386 | 1440 px |
| Admin Desktop | Book list | 39441:19469 | 1440 px |
| Admin Desktop | Preview book | 39441:18877 | 1440 px |
| Admin Desktop | Edit book | 39441:19581 | 1440 px |
| Admin Desktop | Delete book event | 39441:19767 | Desktop modal |
| Admin Desktop | Add book | 39441:19106 | 1440 px |
| Admin Desktop | Borrowed list | 39441:20030 | 1440 px |
| Admin Mobile | Login | 39448:8811 | 393 px |
| Admin Mobile | User list | 39453:11765 | 393 px |
| Admin Mobile | Book list | 39453:10137 | 393 px |
| Admin Mobile | Preview book | 39453:10988 | 393 px |
| Admin Mobile | Edit book | 39453:11461 | 393 px |
| Admin Mobile | Delete book event | 39453:10762 | Mobile modal |
| Admin Mobile | Add book | 39453:11225 | 393 px |
| Admin Mobile | Borrowed list | 39449:9389 | 393 px |

Priority saat terjadi perbedaan:

1. Design-system token frame.
2. Explicit screen value pada breakpoint terkait.
3. Semantic rule dalam dokumen ini.
4. Controlled interpolation untuk intermediate viewport.

### 1.4 API Source-of-Truth dan Confidence Level

| Item | Source | Status |
|---|---|---|
| API definition | Embedded `swaggerDoc` dalam `library-app-api-reference.txt` | Verified document source |
| OpenAPI version | `3.0.3` | Explicit |
| API title/version | Library API `1.0.0` | Explicit |
| Runtime API root | `https://library-backend-production-b9cf.up.railway.app/api` | Configuration target |
| Authentication | HTTP Bearer, JWT | Explicit security scheme |
| Paths/methods | 31 paths, 41 operations | Explicit |
| Query/path parameters | Per-operation parameter definitions | Explicit where declared |
| Request bodies/media types | JSON and multipart definitions | Explicit where declared |
| Shared response schemas | `Book`, `LoginResponse` | Explicit components |
| Other response bodies | Mostly prose descriptions without object schemas | Partially specified |
| Error bodies/stable error codes | Response status descriptions only | Not specified |
| Runtime behavior, CORS, deployed response samples | Not tested in this revision | Unverified |

Confidence rules:

1. `DOCUMENTED-EXPLICIT`: field, enum, media type, security, parameter, or status appears directly in OpenAPI.
2. `DOCUMENTED-DESCRIPTION`: capability or response content is described, but no machine-readable response object schema is provided.
3. `FRONTEND-DOMAIN`: model required by the Figma/product layer; it must be mapped from API data and must not be presented as an API DTO.
4. `RUNTIME-UNVERIFIED`: actual deployed behavior has not been tested and must not be claimed as observed.
5. Runtime testing is not required to revise this document; it becomes a separate integration/release activity when a controlled environment and test account are available.


---

## 2. Ringkasan Produk

**Booky** adalah aplikasi perpustakaan digital yang memungkinkan user mencari buku, melihat detail, memasukkan buku ke cart, mengajukan peminjaman, memantau status peminjaman, memperbarui profil, dan memberi review. Admin dapat melihat user, mengelola katalog buku, serta memantau seluruh peminjaman.

### 2.1 Product Vision

Mendemonstrasikan kemampuan frontend production-grade melalui aplikasi portfolio yang:

- memiliki user dan admin experience yang lengkap;
- mempertahankan visual fidelity desktop/mobile;
- menggunakan API-first contracts yang dipetakan ke endpoint backend production;
- memisahkan UI, domain, server state, validation, dan infrastructure;
- mudah dikembangkan dari mock API menjadi backend nyata;
- memiliki kualitas engineering yang dapat dinilai melalui code structure dan test coverage.

### 2.2 Product Goals

| ID | Goal | Success indicator |
|---|---|---|
| PG-01 | Menyediakan discovery buku yang jelas | Search, category, author, recommendation, dan detail dapat digunakan |
| PG-02 | Menyediakan borrowing flow end-to-end | Cart -> checkout -> success -> borrowed list berjalan |
| PG-03 | Menyediakan user self-service | Profile dan reviews dapat dikelola |
| PG-04 | Menyediakan admin catalog management | Add, preview, edit, delete, filter, dan list tersedia |
| PG-05 | Menjaga visual fidelity | Desktop 1440 px dan mobile 393 px lolos visual QA |
| PG-06 | Menjaga maintainability | Dependency direction, public APIs, query keys, dan schemas konsisten |
| PG-07 | Menunjukkan kualitas portfolio | Typecheck, lint, tests, build, accessibility, dan responsive QA lulus |
| PG-08 | Menjaga contract fidelity | Seluruh call mengikuti embedded OpenAPI 3.0.3, dan batas response/runtime yang belum terverifikasi didokumentasikan |
| PG-09 | Menyediakan pengalaman multibahasa | Seluruh system/UI copy tersedia dalam English dan Bahasa Indonesia, route locale konsisten, serta format tanggal/angka mengikuti locale |

### 2.3 Non-Goals MVP

- Implementasi backend production lengkap.
- Payment, fine/penalty collection, reservation queue, atau barcode scanning.
- Multi-tenant library management.
- Real-time chat atau notifications.
- Offline-first sync.
- Social login kecuali ditambahkan kemudian.
- Menyimpan seluruh server state di Zustand.
- Machine translation otomatis untuk judul buku, deskripsi katalog, atau user-generated reviews.
- RTL language pada MVP; arsitektur tidak boleh menghalangi penambahan RTL di masa depan.
- Menyalin absolute positioning Figma untuk seluruh halaman.
- Mengarang response field yang hanya dideskripsikan tanpa schema eksplisit pada OpenAPI.
- Melakukan runtime smoke test atau mutation test terhadap production sebagai bagian dari revisi dokumen ini.
- Menambahkan `preferredLocale` ke payload backend sebelum API menyediakan field tersebut.

---

## 3. Personas, Roles, dan Authorization

| Role | Primary need | Main capabilities |
|---|---|---|
| Guest | Masuk atau membuat akun | Login, register |
| User | Menemukan dan meminjam buku | Browse, cart, checkout, borrowed list, profile, reviews |
| Admin | Mengelola library data | User list, book CRUD, borrow monitoring |

### 3.1 RBAC Matrix

| Capability | Guest | USER | ADMIN |
|---|:---:|:---:|:---:|
| Login/register | Yes | Redirect | Redirect/admin shell |
| Browse books | No by default | Yes | Preview through admin |
| Manage cart/checkout | No | Yes | No |
| Update own profile | No | Yes | Optional |
| Create review | No | Yes, eligible books only | No |
| View all users | No | No | Yes |
| Create/edit/delete books | No | No | Yes |
| View all borrow records | No | Own records | All records |

Authorization wajib ditegakkan oleh backend/API. Client route guard hanya meningkatkan UX dan bukan security boundary.

---

## 4. Information Architecture dan Routes

Gunakan Next.js App Router dengan top-level locale segment dan route groups untuk memisahkan public, user, dan admin composition. MVP menggunakan locale `en` dan `id`, default `en`, dengan prefix selalu tampil agar routing eksplisit dan mudah diuji.

| Area | Route | Page responsibility | Access |
| --- | --- | --- | --- |
| Public | /{locale}/login | UserLoginPage | Guest only |
| Public | /{locale}/register | UserRegisterPage | Guest only |
| User | /{locale} | HomePage | USER |
| User | /{locale}/books/[bookId] | BookDetailPage | USER |
| User | /{locale}/categories/[slug] | CategoryBooksPage | USER |
| User | /{locale}/authors/[authorId] | AuthorBooksPage | USER |
| User | /{locale}/cart | CartPage | USER |
| User | /{locale}/checkout | CheckoutPage | USER |
| User | /{locale}/checkout/success | BorrowSuccessPage | USER |
| User | /{locale}/borrowed | BorrowedListPage | USER |
| User | /{locale}/profile | ProfilePage | USER |
| User | /{locale}/reviews | ReviewsPage | USER |
| Admin | /{locale}/admin/login | AdminLoginPage | Guest/admin only |
| Admin | /{locale}/admin/users | AdminUserListPage | ADMIN |
| Admin | /{locale}/admin/books | AdminBookListPage | ADMIN |
| Admin | /{locale}/admin/books/new | AdminAddBookPage | ADMIN |
| Admin | /{locale}/admin/books/[bookId] | AdminBookPreviewPage | ADMIN |
| Admin | /{locale}/admin/books/[bookId]/edit | AdminEditBookPage | ADMIN |
| Admin | /{locale}/admin/borrowed | AdminBorrowedListPage | ADMIN |

### 4.1 Navigation Contracts

- User header desktop: brand, search/navigation action, cart indicator, avatar menu.
- User mobile header: brand mark, search icon, cart icon/badge, avatar.
- Admin desktop header: brand, avatar/name, dropdown trigger.
- Admin mobile header: brand mark dan avatar.
- Admin primary navigation: Borrowed List, User, Book List.
- Avatar menu user: Profile, Borrowed List, Reviews, Language, Logout.
- Language switcher mempertahankan current pathname, search params, dan hash ketika berpindah locale.
- Auth page menampilkan compact language selector di kanan atas tanpa menggeser komposisi form Figma.
- Language names MUST remain exposed to assistive technology as `English` dan `Bahasa Indonesia`; the visible control MAY be flag-only when those names remain available through sr-only text or an equivalent accessible name.

---

## 5. Screen Inventory dan Functional Scope

| ID | Logical screen | Desktop node | Mobile node | Core responsibility | Required states |
| --- | --- | --- | --- | --- | --- |
| USR-01 | User Login | 39434:1274 | 39443:20973 | Email/password, password visibility, validation, submit, register link | Invalid, pending, auth error, success redirect |
| USR-02 | Register | 39434:1427 | 39443:21020 | Name, email, phone, password, confirm password, submit, login link | Invalid fields, duplicate email, pending, success |
| USR-03 | Home after login | 39435:2889 | 39443:22213 | Header, search, cart badge, hero, categories, recommendations, popular authors, footer | Loading, partial failure, empty recommendations |
| USR-04 | Avatar dropdown | 39437:12186 | Shared mobile avatar behavior | Profile, Borrowed List, Reviews, Logout | Open/closed, keyboard navigation, logout pending |
| USR-05 | Book detail | 39413:7289 | 39443:23090 | Metadata, rating, stock, metrics, description, cart/borrow, reviews, related books | Available, borrowed, unavailable, loading, error |
| USR-06 | Category | 39435:9377 | 39443:23464 | Category title, rating/category filter, book grid, pagination/infinite loading | Filter active, empty, loading, error |
| USR-07 | Books by author | 39436:10431 | 39443:23467 | Author summary and author book grid | Empty, loading, error |
| USR-08 | Cart | 39419:8771 | 39448:6168 | Select all/items, remove, summary, checkout CTA | Empty, partial selection, stale stock, pending |
| USR-09 | Checkout | 39419:8939 | 39448:6523 | User info, selected books, borrow date, duration, return date, agreement, confirm | Invalid, conflict, pending, error |
| USR-10 | Borrow success | 39419:9207 | 39448:6713 | Success icon, due date, borrowed-list CTA | Success only; refresh-safe |
| USR-11 | Borrowed list | 39437:10925 | 39448:7451 | Tabs, search, status filters, borrowed cards, review action, load more | Active, returned, overdue, empty, loading |
| USR-12 | Profile | 39419:9257 | 39448:7616 | Profile summary and editable user fields | Read, edit, invalid, pending, success |
| USR-13 | Give review | 39437:11105 | 39448:7950 | Modal, star rating, review text, send | Open, invalid, pending, success, error |
| USR-14 | Reviews | 39437:11129 | 39448:8034 | Search and review cards with date/book/rating/text | Empty, loading, error |
| ADM-01 | Admin Login | 39440:12339 | 39448:8811 | Email/password and admin authentication | Invalid, pending, forbidden, success |
| ADM-02 | User List | 39423:2386 | 39453:11765 | Search, desktop table/mobile cards, pagination | Loading, empty, error |
| ADM-03 | Book List | 39441:19469 | 39453:10137 | Tabs, add, search, status filter, preview/edit/delete | Loading, empty, menu open, mutation pending |
| ADM-04 | Preview Book | 39441:18877 | 39453:10988 | Book detail preview with actions | Loading, error |
| ADM-05 | Edit Book | 39441:19581 | 39453:11461 | Filled form, category, cover change/delete, save | Dirty, invalid, upload pending, save pending |
| ADM-06 | Delete Book Event | 39441:19767 | 39453:10762 | Destructive confirmation dialog | Open, cancel, confirm pending, error |
| ADM-07 | Add Book | 39441:19106 | 39453:11225 | Empty form, image dropzone, save | Initial, invalid, upload pending, success |
| ADM-08 | Admin Borrowed List | 39441:20030 | 39449:9389 | Search, status filter, loan cards with borrower and due date | Loading, empty, error |
| SYS-01 | Language Switcher | Additive shared control; no explicit Figma node | Additive shared control; no explicit Figma node | Switch locale while preserving route/query and current user context | Open/closed, current locale, navigation pending, fallback |

### 5.0 Delivery Mode dan Contract Status

Tiga deployment modes digunakan agar portfolio completeness tidak tercampur dengan klaim backend:

| Mode | Rule |
|---|---|
| `strict-live` | Hanya data/behavior yang didukung OpenAPI; field visual yang tidak tersedia memakai placeholder atau disembunyikan secara terkontrol |
| `hybrid-portfolio` | Operasi menggunakan live API, sedangkan visual enrichment non-transactional yang tidak ada di API memakai fixtures lokal yang diberi label |
| `mock` | MSW menyediakan deterministic contract untuk development, tests, dan demo offline; path/request harus mengikuti OpenAPI |

| Screen/capability | API status | Default implementation |
|---|---|---|
| Login/Register | Request dan login response explicit | `strict-live` compatible |
| Home recommendations/categories/popular authors | Paths dan query explicit; response mostly description-only | Live adapter + response mapper |
| Book list/detail | `Book` component explicit; expanded detail response description-only | Live adapter; domain enrichment mapped explicitly |
| Category and author pages | Paths/query explicit | Live adapter |
| Cart and checkout | Persistent cart endpoints explicit | TanStack Query server state |
| Borrow/return/borrowed list | Request/query explicit; response description-only | Live adapter |
| Profile | GET/PATCH available; update request explicit | Live adapter |
| Reviews | Create/list/delete paths and request explicit | Live adapter |
| Admin user/book/loan screens | Paths/query/request explicit | Live adapter |
| Logout | No backend logout operation | Clear frontend/BFF session, cache, and redirect |
| Refresh/session introspection | Not documented | Not implemented unless backend contract changes |
| Page count shown in Figma | No `pageCount` field documented | Product/API gap; placeholder, hide, or backend enhancement decision |

### 5.0.1 Multilanguage UX Contract

- Supported MVP locales: `en` (English) and `id` (Bahasa Indonesia).
- Default locale: `en`, preserving the original Figma copy as the baseline source language.
- Authenticated user/admin: language control lives inside the avatar dropdown to minimize visual divergence from Figma.
- Guest/auth pages: use a compact top-right selector outside the centered form container so form width and vertical alignment remain unchanged.
- Switching locale must preserve route parameters, query parameters, hash, and unsaved form values where technically safe.
- Current locale is indicated by text and check state; flags may be decorative but cannot be the only label.
- The control must be keyboard accessible, have a localized accessible name, and announce navigation progress when route replacement is pending.
- UI labels may expand by at least 30% without clipping; components must not rely on fixed text widths.

### 5.1 User Authentication

**Login**

- Email dan password wajib tervalidasi melalui Zod.
- Password visibility toggle harus memiliki accessible label.
- Submit disabled saat pending dan tidak boleh double submit.
- Error API dipetakan menjadi field error atau form-level error.
- Successful login redirect berdasarkan role dan sanitized return URL.

**Register**

- Minimal fields: name, email, phone, password, confirm password.
- Password confirmation harus menggunakan schema refinement.
- Duplicate email/phone ditampilkan sebagai actionable error.
- Setelah sukses: auto-login atau redirect login sesuai API contract; pilih satu behavior dan test.

### 5.2 User Discovery

**Home**

- Hero/banner mengikuti Figma dan tidak boleh menyebabkan CLS.
- Category cards dan recommendations berasal dari query data.
- Popular authors dapat dinavigasi ke route author.
- Search submit menuju book list/filter state yang dapat dibookmark.

**Category**

- Filter disimpan di URL search params bila memengaruhi result set.
- Desktop sidebar/filter dan mobile compact trigger memetakan state yang sama.
- Empty/loading/error tidak mengubah page hierarchy.

**Book by Author**

- Author identity terpisah dari list result.
- Book grid menggunakan BookCard contract yang sama dengan category/home.

**Book Detail**

- Menampilkan cover, category, title, author, rating, page/review metrics, description, availability, actions, reviews, dan related books.
- Add to cart dan borrow langsung harus memeriksa availability.
- Optimistic update hanya digunakan jika rollback jelas.

### 5.3 Cart dan Checkout

**Cart**

- Cart existence berasal dari `GET /cart`; add/remove/clear memakai cart mutations.
- Selection state hanya menyimpan `CartItem.id` yang dipilih dan tidak menduplikasi cart entities.
- Select all menghitung hanya item yang eligible.
- Stale/out-of-stock item harus ditandai dan mutation error dipetakan tanpa menghapus selection lain.
- Summary diturunkan dari selected eligible server-cart items.

**Checkout**

- Checkout payload preview berasal dari `GET /cart/checkout`.
- `POST /loans/from-cart` mengirim `itemIds`, optional `days` (`3|5|10`), dan optional `borrowDate` (`YYYY-MM-DD`).
- Agreement checkbox wajib sebelum submit tetapi tidak dikirim bila tidak ada field API.
- Return date preview dihitung dari borrow date/days untuk UX; server response tetap authority.
- Partial failure mempertahankan failed items dan hanya membersihkan cart items yang dinyatakan berhasil dihapus.

**Success**

- Data receipt disimpan dari mutation result atau dapat direfetch dengan receipt ID.
- Refresh tidak boleh menampilkan success palsu tanpa data valid.

### 5.4 Borrowed, Profile, Reviews

- Borrowed list mendukung All, Active, Returned, Overdue.
- Review action hanya tersedia untuk record yang eligible dan belum direview sesuai rule backend.
- Profile menggunakan `GET /me` dan `PATCH /me`; update mendukung JSON atau multipart dengan `profilePhoto`.
- Profile mutation invalidates `me.profile` dan header summary.
- Review modal mengirim `bookId`, `star`, dan optional `comment` melalui `POST /reviews`.
- Reviews page menggunakan `GET /me/reviews`; book review list memakai `GET /reviews/book/{bookId}`.
- Delete review menggunakan `DELETE /reviews/{id}` setelah confirmation.

### 5.5 Admin Management

**User List**

- Desktop table dan mobile cards menerima page model yang sama dari `GET /admin/users`.
- Query `q`, `page`, dan `limit` mengikuti OpenAPI; default limit 10 dan maksimum 50.
- Search debounce dapat dipakai, tetapi URL tetap menjadi source filter bila navigable.
- Pagination button disabled secara benar pada boundaries.

**Book List**

- Status filter: All, Available, Borrowed, Returned sesuai desain; domain enum harus dikonfirmasi API.
- Mobile overflow menu menggunakan DropdownMenu dan tidak bergantung hover.
- Delete selalu melalui confirmation dialog.

**Add/Edit Book**

- Documented fields: `title`, `isbn`, `categoryId`, optional `authorId` or `authorName`, `description`, `publishedYear`, `totalCopies`, `availableCopies`, dan `coverImage`.
- `title`, `isbn`, dan `categoryId` required; API description requires `authorId` atau `authorName`.
- Create supports JSON URL cover atau multipart binary cover; documented file formats JPEG/PNG/GIF/WebP, max 5 MB.
- Figma `page count` tidak mempunyai documented API field dan harus ditangani sebagai explicit product/API gap.
- Edit mempertahankan existing cover sampai user mengganti; exact multipart behavior for PUT is not machine-described and requires adapter verification.
- Unsaved changes warning dianjurkan pada navigation away.

**Admin Borrowed List**

- Menampilkan status, due date, book data, borrow date, duration, borrower.
- Search/status filter tidak boleh dicampur dengan presentation card logic.

---

## 6. Business Rules

### 6.1 Book Availability

1. Backend exposes `totalCopies` and `availableCopies`; availability UI is derived rather than read from a documented `status` property.
2. A book is eligible for cart/borrow only when `availableCopies > 0` and the relevant mutation accepts it.
3. `POST /cart/items` may reject book-not-found, out-of-stock, or duplicate-cart cases.
4. Delete book is documented as blocked when active loans exist.
5. Admin filter values `all`, `available`, `borrowed`, and `returned` are transport query values, not `Book` entity enums.

### 6.2 Borrowing

1. Direct borrow uses `{bookId, days}` with `days` between 1 and 30.
2. Cart checkout uses `{itemIds, days?, borrowDate?}`; `itemIds` are CartItem IDs, not Book IDs.
3. Cart checkout duration values are `3`, `5`, or `10`, default `3`.
4. `borrowDate` is a calendar date (`YYYY-MM-DD`), while admin `dueAt` is a date-time.
5. Loan transport status values documented for admin/me history are `BORROWED`, `LATE`, and `RETURNED`.
6. User filter values `active` and `overdue` are presentation/query categories and must be mapped separately from transport statuses.
7. `POST /loans/from-cart` may return successful loans, failed items, and removed cart items; the UI must support partial success.

### 6.3 Reviews

1. `star` is an integer from 1 to 5.
2. `comment` is optional according to the documented request schema.
3. `POST /reviews` is described as create-or-update for the current user/book combination.
4. Review deletion requires the review ID and ownership enforcement by backend.
5. The OpenAPI does not define an explicit review-eligibility endpoint; the UI may infer an action candidate from loan state, but backend mutation remains authority.

### 6.4 Book Management

1. Create requires `title`, `isbn`, and `categoryId`.
2. Create must supply `authorId` or `authorName` according to the documented 400 response description.
3. JSON create may send a cover URL; multipart create may upload a binary cover.
4. `totalCopies` minimum is 1 in the JSON create schema; `availableCopies` minimum is 0.
5. Author/category delete is documented as blocked while dependent books exist.
6. Book delete is documented as blocked while active loans exist.
7. The API does not document `pageCount`; Figma display and form requirements must not fabricate this field.

### 6.5 Documented Capability Boundaries

Confirmed operation groups include authentication, catalog discovery, book/author/category management, persistent cart, checkout, loans, profile, reviews, admin overview, admin users, admin books, and admin loans.

Remaining contract gaps:

- most success response bodies are prose descriptions rather than explicit object schemas;
- error response body schemas and stable backend error codes are not defined;
- logout, refresh-token, and session-introspection operations are absent;
- token expiry and refresh behavior are not specified;
- `pageCount`, author portrait, and category artwork fields are absent;
- `preferredLocale` is absent from auth/profile requests;
- runtime CORS, deployed sample payloads, and actual behavior were not tested for this revision.

These gaps use presentation fallbacks, DTO mappers, or explicit open decisions; they must not be silently filled with invented backend fields.


---

## 7. Design System Snapshot

### 7.1 Layout Foundation

| Context | Reference |
|---|---:|
| Desktop canvas | 1440 px |
| Desktop header | 80 px |
| Desktop horizontal padding | 120 px |
| Desktop content width | 1000-1200 px according to screen |
| Mobile canvas | 393 px |
| Mobile header | 64 px |
| Mobile page gutter | 16 px |
| Mobile content width | 361 px reference, implemented fluid |
| Mobile book grid | commonly 2 x 172 px with 16 px gap |
| Shared card shadow | `0 0 10px rgba(203, 202, 202, 0.25)` |

### 7.2 Typography

Display dan body menggunakan **Quicksand**.

| Token | Size | Line height | Typical use |
|---|---:|---:|---|
| Display 3XL | 56 | 68 | Large marketing heading if used |
| Display 2XL | 48 | 60 | Large desktop heading |
| Display LG | 36 | 44 | Page title variant |
| Display MD | 32 | 42 | Brand name / desktop heading |
| Display SM | 28 | 38 | Desktop section title |
| Display XS | 24 | 36 | Mobile page title |
| Text XL | 20 | 34 | Detail/admin mobile title |
| Text LG | 18 | 32 | Desktop item title/body emphasis |
| Text MD | 16 | 30 | Default desktop body/control |
| Text SM | 14 | 28 | Mobile body/control |
| Text XS | 12 | 24 | Supporting metadata |

Gunakan semantic utility seperti `text-page-title`, `text-card-title`, `text-body`, dan `text-caption`; jangan merangkai tracking berbeda secara acak.

### 7.3 Color Tokens

| Token | Value | Usage |
|---|---|---|
| `base-white` | `#FFFFFF` | Main surfaces |
| `base-black` | `#000000` | Base black |
| `neutral-25` | `#FDFDFD` | Light foreground |
| `neutral-50` | `#FAFAFA` | Secondary background |
| `neutral-100` | `#F5F5F5` | Tabs/filter surface |
| `neutral-200` | `#E9EAEB` | Divider/background |
| `neutral-300` | `#D5D7DA` | Primary border |
| `neutral-400` | `#A4A7AE` | Disabled/supporting |
| `neutral-500` | `#717680` | Placeholder |
| `neutral-600` | `#535862` | Secondary text |
| `neutral-700` | `#414651` | Body secondary |
| `neutral-800` | `#252B37` | Dark neutral |
| `neutral-900` | `#181D27` | Primary text alternate |
| `neutral-950` | `#0A0D12` | Primary text |
| `primary-100` | `#F6F9FE` | Selected chip background |
| `primary-200` | `#D2E3FF` | Soft brand background |
| `primary-300` | `#1C65DA` | Primary action |
| `accent-red` | `#D9206E` | Destructive filled action |
| `screen-error` | `#EE1D52` | Validation/error values seen in screens |
| `accent-green` | `#079455` | Success semantic |
| `status-green` | `#24A500` | Active status text in captured cards |
| `accent-yellow` | `#FDB022` | Rating star |

`accent-red` dan `screen-error` tidak boleh disatukan tanpa visual verification karena kedua value muncul pada sumber berbeda.

### 7.4 Radius Scale

| Token | Value |
|---|---:|
| none | 0 |
| xxs | 2 |
| xs | 4 |
| sm | 6 |
| md | 8 |
| lg | 10 |
| xl | 12 |
| 2xl | 16 |
| 3xl | 20 |
| 4xl | 24 |
| full | 9999 |

Mapping utama:

- form fields: 12 px;
- mobile user cards: 12 px;
- book/borrow cards: 16 px;
- dialogs: 16 px;
- button/chip: full pill;
- status badge: 4-6 px.

### 7.5 Spacing Scale

`0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160` px.

Repeated arbitrary values wajib dipromosikan menjadi token atau component variant.

### 7.6 Responsive Rules

| Range | Rule |
|---|---|
| 320-479 | Mobile composition; preserve 16 px gutter and no horizontal overflow |
| 480-767 | Mobile composition with fluid width, not early desktop switch |
| 768-1023 | Tablet interpolation; grids may expand where readable |
| 1024-1279 | Compact desktop; preserve content hierarchy |
| 1280-1439 | Desktop layout with fluid gutter |
| 1440+ | Match 1440 px Figma reference and max-width behavior |

Horizontal chip rows may scroll intentionally on mobile; page root may not scroll horizontally. Localized labels must wrap or expand according to component contract; text truncation requires an explicit UX decision and accessible full label.

---

## 8. Component Architecture

### 8.1 Reusable Component Inventory

| Component | Ownership | Minimum contract | Use |
| --- | --- | --- | --- |
| AppHeader | shared/layout | logo, actions, user, variant | User/admin desktop/mobile shell |
| AppFooter | shared/layout | variant? | User pages requiring footer |
| BrandLogo | shared/brand | size, showName? | Auth/header |
| PageContainer | shared/layout | size, children | Desktop max-width and mobile gutter |
| SearchField | shared/ui | value, onChange, placeholder, size | Home, lists, reviews |
| Button | shared/ui (shadcn) | variant, size, loading | All actions |
| FormField | shared/form | label, error, required | Auth/profile/book/checkout |
| PasswordField | shared/form | value, visibility | Login/register |
| FilterChip | shared/ui | selected, count? | Book/borrow filters |
| StatusBadge | shared/ui | status | Borrow records/book state |
| BookCover | entities/book | src, alt, ratio, sizes | Cards/detail/admin |
| BookCard | entities/book | book, variant, actions? | Home/category/author/related |
| BookListItem | entities/book | book, actions | Admin list and non-cart lists |
| CartItemRow | entities/cart | cartItem, selected, onSelect, onRemove | Persistent server cart |
| AuthorCard | entities/author | author, variant | Home/author page |
| CategoryCard | entities/category | category | Home |
| RatingDisplay | entities/review | value, count?, size | Cards/detail/reviews |
| RatingInput | features/reviews | value, onChange | Give review |
| BorrowedBookCard | entities/borrow | record, roleVariant | User/admin borrowed lists |
| UserSummaryCard | entities/user | user | Profile/admin user card |
| ProfilePhotoField | features/profile | currentUrl, file, validation | JSON/multipart profile update |
| AdminTabs | features/admin-navigation | active | Admin desktop/mobile |
| Pagination | shared/ui | page, totalPages | Admin user list/list pages |
| FileUploadField | shared/form | file, preview, accept, maxSize | Add/edit book |
| ConfirmDialog | shared/ui (shadcn) | title, description, confirm | Delete book/logout |
| EmptyState | shared/ui | title, description, action? | All lists |
| QueryStateBoundary | shared/query | loading, error, empty | Consistent server-state UI |
| LanguageSwitcher | shared/i18n | currentLocale, supportedLocales, preservePath | Guest/auth and avatar menus |
| LocalizedDate | shared/i18n | value, dateStyle/timeStyle | Borrow dates, reviews, created dates |
| LocalizedNumber | shared/i18n | value, format/options | Ratings, counts, pagination metadata |

### 8.2 Reuse Rules

Pindahkan component ke `shared` hanya bila:

- digunakan minimal dua unrelated features;
- props bebas domain wording;
- tidak mengakses feature store/query langsung;
- visual/behavior contract stabil.

Tetap di feature/entity bila:

- component memahami Book, BorrowRecord, Review, atau User domain;
- hanya digunakan satu workflow;
- memiliki behavior khusus layar.

Dilarang membuat `UniversalCard`, `UniversalForm`, atau component dengan boolean-prop explosion.

### 8.3 shadcn/ui Mapping

| Need | Primitive |
|---|---|
| Buttons | Button with Figma variants |
| Avatar menu/mobile actions | DropdownMenu |
| Mobile filters | Sheet or Drawer |
| Delete/review modal | AlertDialog / Dialog |
| Forms | Form, Input, Textarea, Select, Checkbox, RadioGroup |
| Tabs | Tabs |
| Status hints | Badge |
| Notifications | Sonner or inline live region |
| Pagination controls | Button-based accessible composition |
| Cover upload | custom field using Input type=file and shadcn form shell |
| Language selector | DropdownMenu / Select using localized self-names |

Default shadcn styling wajib diretheme agar cocok dengan Figma.

---

## 9. Technical Architecture

### 9.1 Architecture Style

Use feature-based modular architecture with dependency direction:

```text
app composition -> features -> entities -> shared
```

`app` imports feature/entity public APIs. `shared` remains domain-neutral. Cross-feature orchestration belongs in a dedicated workflow feature, not in shared utilities.

### 9.2 Server vs Client Components

- Default layouts/pages are Server Components.
- Client Components are limited to forms, menus, dialogs, selection controls, Zustand consumers, and TanStack Query mutation/query islands.
- Public catalog GET data may be server-prefetched.
- Bearer-authenticated data may be fetched through a BFF/server session boundary or a client query depending on the chosen token architecture.
- Do not convert an entire route into a Client Component because one control is interactive.

### 9.3 Proposed Folder Structure

```text
src/
├─ app/
│  ├─ [locale]/
│  │  ├─ (public)/login/page.tsx
│  │  ├─ (public)/register/page.tsx
│  │  ├─ (user)/...
│  │  ├─ admin/...
│  │  ├─ layout.tsx
│  │  ├─ error.tsx
│  │  └─ not-found.tsx
│  ├─ api/                       # recommended BFF/session route handlers
│  ├─ providers.tsx
│  └─ globals.css
├─ features/
│  ├─ auth/
│  ├─ book-search/
│  ├─ book-filters/
│  ├─ cart/
│  ├─ checkout/
│  ├─ profile/
│  ├─ reviews/
│  ├─ admin-navigation/
│  ├─ admin-book-management/
│  ├─ admin-loans/
│  └─ admin-user-search/
├─ entities/
│  ├─ book/
│  ├─ author/
│  ├─ category/
│  ├─ cart/
│  ├─ user/
│  ├─ borrow/
│  └─ review/
├─ shared/
│  ├─ api/
│  │  ├─ axios-client.ts
│  │  ├─ auth-token-provider.ts
│  │  ├─ api-error.ts
│  │  ├─ api-contract-status.ts
│  │  └─ pagination.ts
│  ├─ query/
│  ├─ ui/
│  ├─ form/
│  ├─ layout/
│  ├─ lib/
│  ├─ config/
│  └─ styles/tokens.css
├─ i18n/
│  ├─ routing.ts
│  ├─ request.ts
│  ├─ navigation.ts
│  ├─ locale.schema.ts
│  └─ formatters.ts
├─ stores/
│  ├─ shell-ui.store.ts
│  └─ cart-selection.store.ts   # selected CartItem IDs only; never cart entities
├─ mocks/
│  ├─ handlers/
│  ├─ fixtures/
│  └─ browser.ts
└─ test/
   ├─ setup.ts
   └─ factories/
messages/
├─ en.json
└─ id.json
public/assets/...
```

### 9.4 Feature Internal Templates

```text
features/cart/
├─ api/cart.api.ts
├─ components/CartItemRow.tsx
├─ components/CartSummary.tsx
├─ queries/cart.queries.ts
├─ mutations/cart.mutations.ts
├─ hooks/useCartSelection.ts
├─ model/cart-selection.types.ts
└─ index.ts

features/checkout/
├─ api/loans.api.ts
├─ components/CheckoutForm.tsx
├─ schemas/create-loans-from-cart.schema.ts
├─ mutations/loan.mutations.ts
├─ services/checkout.service.ts
└─ index.ts
```

### 9.5 Public API and SoC Rules

- Import outside a feature/entity through its `index.ts` only.
- Cart entities are server state; selection is UI state.
- Transport DTOs live beside API adapters, frontend domain models live in entities, and presentation formatting lives in UI/i18n.
- JWT/session lifecycle belongs to auth infrastructure, not Zustand or arbitrary components.
- ESLint boundaries prevent deep imports and inverse dependencies.


---

## 10. Domain Models dan Zod Validation

### 10.1 Shared Transport Schemas

```ts
import {z} from "zod";

export const apiIdSchema = z.number().int().positive();
export const isoDateTimeSchema = z.string().datetime({offset: true});
export const localDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const appLocaleSchema = z.enum(["en", "id"]);
export const loanTransportStatusSchema = z.enum(["BORROWED", "LATE", "RETURNED"]);
```

Do not coerce every backend ID to string. Route params are strings at the router boundary and must be parsed into positive integers before API calls.

### 10.2 Explicit OpenAPI Component Schemas

The embedded specification defines two shared component property schemas:

```ts
export const bookDtoSchema = z.object({
  id: apiIdSchema,
  title: z.string(),
  description: z.string().nullable().optional(),
  isbn: z.string(),
  publishedYear: z.number().int().nullable().optional(),
  coverImage: z.string().nullable().optional(),
  rating: z.number(),
  reviewCount: z.number().int(),
  totalCopies: z.number().int(),
  availableCopies: z.number().int(),
  borrowCount: z.number().int(),
  authorId: apiIdSchema,
  categoryId: apiIdSchema,
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema
}).partial();

export const loginResponseDtoSchema = z.object({
  token: z.string().min(1),
  user: z.object({
    id: apiIdSchema,
    name: z.string(),
    email: z.string().email(),
    role: z.enum(["ADMIN", "USER"])
  }).partial()
}).partial();
```

The specification defines property schemas for `Book` and `LoginResponse`, but neither component declares a `required` array. The transport parser therefore treats those properties as optional until an updated schema or controlled response sample confirms requiredness. The domain mapper then enforces the fields required by a given screen.

The specification does not define explicit reusable schemas for expanded book detail, cart, loans, profile, admin users, or reviews. Their response descriptions guide adapter design but do not justify a strict response DTO until a sample/schema is available.

### 10.3 Documented Request Schemas

| Request | Documented fields |
|---|---|
| Register | required `name`, `email`, `password`; optional `phone` |
| Login | required `email`, `password` |
| Create author | required `name`; optional `bio` |
| Update author | optional `name`, `bio` |
| Create/update category | `name` |
| Create book JSON | required `title`, `isbn`, `categoryId`; optional description/year/cover URL/author/copy fields |
| Create book multipart | required `title`, `isbn`, `categoryId`; optional binary cover and other fields |
| Update book | optional documented book fields; JSON schema is explicit |
| Add cart item | required `bookId` |
| Direct loan | required `bookId`, `days`; days 1-30 |
| Loan from cart | required `itemIds`; optional `days` (`3|5|10`) and `borrowDate` |
| Admin create loan | required `userId`, `bookId`; optional `dueAt` date-time |
| Admin update loan | optional `dueAt`, `status` (`BORROWED|LATE|RETURNED`) |
| Profile update | optional `name`, `phone`, `profilePhoto`; JSON or multipart |
| Create/update review | required `bookId`, `star`; optional `comment` |

Frontend-only fields such as confirm password and policy agreement must be removed by the mapper before sending API requests.

### 10.4 Frontend Domain Mapping

Frontend domain models may enrich transport data with:

- nested `author` and `category` summaries;
- computed `isAvailable` from `availableCopies`;
- localized display status;
- cover fallback and accessible alt text;
- derived due-date presentation;
- review/book summaries used by Figma cards.

Every enrichment must identify its source: explicit response, response description, local asset fixture, or computed presentation value. `pageCount` cannot be populated from the documented API.

### 10.5 Form and File Validation

- Register confirm password is frontend-only.
- Book create validates ISBN, copy counts, `authorId` xor/alternative `authorName`, and cover file constraints.
- Profile photo and book cover accept documented JPEG/PNG/GIF/WebP and max 5 MB.
- FormData serialization converts integer fields intentionally; do not depend on implicit browser coercion.
- For multipart requests, do not manually set the boundary.

### 10.6 Validation Boundary Rule

- Validate user input before mutation.
- Parse responses with explicit schemas where available.
- For description-only responses, use a narrow adapter with documented observed/required fields and mark it `RESPONSE-SCHEMA-PARTIAL` until a machine-readable schema or controlled sample exists.
- Map API DTOs to frontend domain models in services/mappers.
- Never use `z.any()` to hide contract uncertainty.
- Translate Zod issue keys at the UI boundary; do not place localized prose inside transport/domain enums.


---

## 11. Axios HTTP Boundary

### 11.1 Production Base URL

```env
NEXT_PUBLIC_API_BASE_URL=https://library-backend-production-b9cf.up.railway.app/api
```

`/api-swagger/#/` is documentation only. Service paths omit `/api` because it is already present in `baseURL`.

```ts
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 15_000,
  headers: {Accept: "application/json"}
});
```

Do not set a global JSON `Content-Type`, because book/profile operations may use multipart.

### 11.2 Bearer JWT Authentication

The OpenAPI security scheme is HTTP Bearer with JWT. Protected requests send:

```http
Authorization: Bearer <token>
```

Recommended production architecture:

1. Next.js BFF receives login response.
2. BFF stores JWT in a Secure, HttpOnly, SameSite cookie.
3. BFF attaches the Bearer header when calling the Railway API.
4. Browser code never reads the production token directly.

A direct-client portfolio mode may use a dedicated in-memory/session token provider, but must document XSS and session-loss trade-offs. Do not persist the JWT in a Zustand store. No refresh or server logout operation is documented; logout clears local/BFF session state, removes protected Query cache, and redirects.

### 11.3 Interceptor and Media-Type Rules

- Attach Bearer token only to protected API calls through the auth boundary.
- Send `Accept-Language` for `en` or `id`; do not assume the backend localizes data.
- Forward `AbortSignal` from TanStack Query.
- JSON methods send JSON explicitly.
- Multipart methods create `FormData` and let the browser/runtime generate the boundary.
- A 401 clears invalid session state; a 403 preserves session and shows a role/permission error.
- Interceptors normalize transport errors but never contain feature-specific toast copy.

### 11.4 Normalized Frontend Error Model

```ts
export type ApiErrorCode =
  | "VALIDATION"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "NETWORK"
  | "UNKNOWN";

export type AppApiError = {
  code: ApiErrorCode;
  status?: number;
  messageKey: string;
  fieldErrors?: Record<string, string[]>;
  requestId?: string;
  rawMessage?: string;
};
```

The OpenAPI documents response statuses/descriptions but not reusable error body schemas or stable error codes. The normalizer therefore maps HTTP status first and only reads body fields defensively.


---

## 12. TanStack Query Server-State Strategy

### 12.1 Query Keys

| Factory | Backing endpoint |
|---|---|
| `books.list(params)` | `GET /books` |
| `books.recommend(params)` | `GET /books/recommend` |
| `books.detail(id)` | `GET /books/{id}` |
| `authors.list(params)` | `GET /authors` |
| `authors.popular(params)` | `GET /authors/popular` |
| `authors.books(id, params)` | `GET /authors/{id}/books` |
| `categories.all()` | `GET /categories` |
| `cart.current()` | `GET /cart` |
| `cart.checkout()` | `GET /cart/checkout` |
| `loans.my(params)` | `GET /loans/my` |
| `me.profile()` | `GET /me` |
| `me.loans(params)` | `GET /me/loans` |
| `me.reviews(params)` | `GET /me/reviews` |
| `reviews.book(bookId, params)` | `GET /reviews/book/{bookId}` |
| `admin.overview()` | `GET /admin/overview` |
| `admin.users(params)` | `GET /admin/users` |
| `admin.books(params)` | `GET /admin/books` |
| `admin.loans(params)` | `GET /admin/loans` |
| `admin.overdue(params)` | `GET /admin/loans/overdue` |

`GET /loans/my` is the canonical Borrowed List endpoint because its filters match the Figma tabs/search. `GET /me/loans` remains available for profile/history use and uses transport-status filters.

### 12.2 Mutation and Invalidation Matrix

| Mutation | Endpoint | Minimum invalidation/update |
|---|---|---|
| Login/Register | `/auth/*` | Establish session, clear anonymous protected cache |
| Add cart item | `POST /cart/items` | `cart.current`, `cart.checkout` |
| Remove cart item | `DELETE /cart/items/{itemId}` | cart queries |
| Clear cart | `DELETE /cart` | cart queries and local selection |
| Direct borrow | `POST /loans` | loans, books/detail/recommend, profile stats |
| Borrow from cart | `POST /loans/from-cart` | cart, loans, books, profile stats; reconcile partial result |
| Return loan | `PATCH /loans/{id}/return` | user/admin loans, overdue, books, profile stats |
| Update profile | `PATCH /me` | `me.profile` and header summary |
| Create/update review | `POST /reviews` | `me.reviews`, `reviews.book`, `books.detail` and rating lists |
| Delete review | `DELETE /reviews/{id}` | review and affected book roots |
| Create/update/delete book | `/books*` | book roots, admin books, recommendations; authors/categories when relevant |
| Create/update/delete author | `/authors*` | author roots and affected books |
| Create/update/delete category | `/categories*` | categories and affected book/admin lists |
| Admin create/update loan | `/admin/loans*` | admin loans/overdue/overview, user loans, books |

### 12.3 Query Parameter Contracts

Only documented query names are sent. Examples:

- books: `q`, `categoryId`, `authorId`, `minRating`, `page`, `limit`;
- recommendations: `by`, `categoryId`, `page`, `limit`;
- admin books: `status`, `q`, `categoryId`, `authorId`, `page`, `limit`;
- borrowed/admin loans: `status`, `q`, `page`, `limit`;
- admin users: `q`, `page`, `limit`;
- reviews: `q`, `page`, `limit`.

Filter objects must be normalized and serializable. Do not send empty strings or unsupported Figma-only values.

### 12.4 Cart Selection Rule

TanStack Query owns cart entities. Local/Zustand selection owns only selected `CartItem.id` values. On loan-from-cart success:

1. reconcile `removedFromCart` when present;
2. preserve failed item selection for correction;
3. invalidate/refetch cart and loan queries;
4. clear only IDs no longer present in the cart.

### 12.5 SSR and Hydration

- Public GET endpoints may be prefetched at route boundaries.
- One QueryClient per server request.
- Protected queries use the selected BFF/direct-session architecture.
- Dehydrate only required queries and never serialize bearer tokens into page data.
- Locale is included in a key only when response data actually varies by locale.


---

## 13. Zustand Client-State Strategy

Zustand is limited to cross-component client UI state that is not remote data.

```ts
type ShellUiState = {
  mobileNavOpen: boolean;
  setMobileNavOpen(open: boolean): void;
};

type CartSelectionState = {
  selectedItemIds: number[];
  setSelectedItemIds(ids: number[]): void;
  toggle(itemId: number): void;
  reconcile(existingItemIds: number[]): void;
  reset(): void;
};
```

Rules:

- Selected IDs are CartItem IDs, not Book IDs.
- Prefer local component state when selection does not cross component/route boundaries.
- Reconcile selection after cart refetch or partial checkout success.
- Do not store cart items, books, loans, profile, reviews, admin data, Query loading/error state, derived totals, form fields, JWT tokens, active locale, or messages in Zustand.
- JWT/session state uses the auth/session boundary; locale uses route/cookie configuration.
- Use selectors to avoid whole-store subscriptions.


---

## 14. Internationalization (i18n) Strategy

### 14.1 Library and Locale Policy

Use **next-intl** as the Next.js App Router integration layer.

MVP locale policy:

| Setting | Value |
|---|---|
| Supported locales | `en`, `id` |
| Default locale | `en` |
| URL strategy | Always-prefixed sub-path, e.g. `/en/books/123` and `/id/books/123` |
| Direction | `ltr` for both MVP locales |
| Source language | English, matching original Figma copy |
| Fallback | English for missing non-critical development keys; production build must fail key-parity checks |

Locale resolution priority:

1. Explicit locale segment in URL.
2. Locale cookie such as `NEXT_LOCALE`.
3. Browser `Accept-Language` negotiation on first visit.
4. Default locale `en`.

Unsupported locale segments must resolve through a controlled redirect or `notFound()` policy; they must never silently render a mixed-language page.

### 14.2 Routing and Request Configuration

- Place locale-aware pages under `app/[locale]`.
- Validate route locale with `localeSchema` before loading messages.
- Set `<html lang={locale}>` and a locale-derived `dir` attribute.
- Use locale-aware `Link`, `redirect`, pathname, and router wrappers so internal navigation never drops the locale.
- Locale switching must replace only the locale segment and preserve dynamic parameters, search params, and hash.
- Generate static locale params where static rendering is used.
- Current Next.js projects should follow the framework's official proxy/middleware convention for locale negotiation; pin implementation to the project's installed Next.js and next-intl versions.

### 14.3 Translation Resource Architecture

```text
messages/
├─ en.json
└─ id.json
```

Required top-level namespaces:

- `Common`
- `Navigation`
- `Auth`
- `Home`
- `Books`
- `Cart`
- `Checkout`
- `Borrowed`
- `Profile`
- `Reviews`
- `Admin`
- `Validation`
- `Errors`
- `Metadata`

Rules:

- Components reference semantic keys such as `Auth.login.title`, not English source strings.
- Translation files contain UI/system copy only.
- Book title, author name, ISBN-like identifiers, profile data, and user-generated review text remain domain/API content and are not automatically translated.
- Backend-localized catalog fields may be introduced later with explicit locale metadata and locale-aware query keys.
- Use ICU plural/select syntax for counts and durations instead of string concatenation.
- Do not split keys by visual component when the same product concept is shared; namespace by domain/workflow.
- Add a CI key-parity check so `en` and `id` contain the same required keys.

### 14.4 Date, Time, Number, and Plural Formatting

- Domain and API boundaries keep ISO date/time values; formatting occurs at the presentation boundary.
- Borrow date, due date, review date, and account creation date use locale-aware date formatters.
- Rating, count, page count, and duration use locale-aware number/plural formatting.
- Do not concatenate values such as `duration + " Days"`; use a plural message.
- Timezone remains a separate domain decision. Locale changes formatting, not the stored instant or borrowing rule.
- Test representative output for English and Indonesian, including decimal rating and long-form dates.

### 14.5 Validation and Error Localization

- Zod schemas expose stable issue/message keys such as `validation.email.invalid`.
- Form adapters translate issue keys using the active locale.
- API returns stable error codes whenever possible; UI maps `CONFLICT`, `RATE_LIMIT`, and field codes to localized copy.
- Raw backend English messages may be logged for diagnostics but must not become the only user-facing text.
- Fallback error copy must still be localized and must retain the request ID when available.

### 14.6 Language Preference Persistence

- Route locale is the immediate source of truth for rendering.
- Guest preference is persisted in a locale cookie.
- The documented register/profile requests do not include `preferredLocale`; persistence therefore uses the locale cookie for guest and authenticated sessions.
- On login, do not unexpectedly replace an explicitly selected URL locale.
- Add profile-backed locale preference only through a future API contract change; never send an undocumented field.
- Locale preference must not be placed in Zustand or TanStack Query as a duplicate state source.

### 14.7 Server/Client and Bundle Rules

- Load translations in Server Components by default.
- Send only the message subset required by Client Components when supported by the integration pattern.
- Do not mark an entire route as a Client Component just to access translations.
- Avoid importing all locale bundles into the browser.
- Language switcher is a small Client Component; translated page content should remain server-renderable.

### 14.8 SEO and Metadata

- Generate localized title, description, and Open Graph copy where a route is public/indexable.
- Emit canonical and alternate-language (`hreflang`) metadata for public catalog routes if public catalog mode is enabled.
- Login, authenticated user, and admin routes remain `noindex` regardless of locale.
- Sitemap entries must include locale alternates only for routes that are actually indexable.

### 14.9 i18n Acceptance Criteria

- Every visible system label on all User and Admin screens is available in English and Bahasa Indonesia.
- Switching language preserves current route, dynamic IDs, query filters, and authenticated session.
- No production component contains hardcoded user-facing English/Indonesian copy except approved domain fixture content.
- Missing translation keys fail CI/build validation rather than silently shipping mixed-language UI.
- Date, number, plural, validation, and API error output follow the active locale.
- Layout remains usable with at least 30% text expansion and no clipped action labels at 393 px and 1440 px.
- `<html lang>` is correct and language controls are keyboard/screen-reader accessible.

---

## 15. Embedded OpenAPI Contract Alignment

### 15.1 Contract Source

- Source file: `library-app-api-reference.txt`.
- Embedded API: OpenAPI `3.0.3`, Library API `1.0.0`.
- Runtime base: `https://library-backend-production-b9cf.up.railway.app/api`.
- Security scheme: HTTP Bearer JWT.
- Global security is empty; protected operations declare `bearerAuth` individually.
- Inventory: 31 paths and 41 operations.
- Runtime API behavior was not tested for this revision.

### 15.2 Operation Inventory

#### Auth

- `POST /auth/register` — Public; application/json; response description-only.
- `POST /auth/login` — Public; application/json; explicit response schema.

#### Books

- `GET /books` — Public; query/path parameters; response description-only.
- `POST /books` — Bearer JWT; multipart/form-data, application/json; response description-only.
- `GET /books/recommend` — Public; query/path parameters; response description-only.
- `GET /books/{id}` — Public; query/path parameters; response description-only.
- `PUT /books/{id}` — Bearer JWT; application/json; response description-only.
- `DELETE /books/{id}` — Bearer JWT; query/path parameters; response description-only.

#### Authors

- `GET /authors` — Public; query/path parameters; response description-only.
- `POST /authors` — Bearer JWT; application/json; response description-only.
- `GET /authors/popular` — Public; query/path parameters; response description-only.
- `GET /authors/{id}/books` — Public; query/path parameters; response description-only.
- `PUT /authors/{id}` — Bearer JWT; application/json; response description-only.
- `DELETE /authors/{id}` — Bearer JWT; query/path parameters; response description-only.

#### Categories

- `GET /categories` — Public; no request body; response description-only.
- `POST /categories` — Bearer JWT; application/json; response description-only.
- `PUT /categories/{id}` — Bearer JWT; application/json; response description-only.
- `DELETE /categories/{id}` — Bearer JWT; query/path parameters; response description-only.

#### Cart

- `GET /cart` — Bearer JWT; no request body; response description-only.
- `DELETE /cart` — Bearer JWT; no request body; response description-only.
- `GET /cart/checkout` — Bearer JWT; no request body; response description-only.
- `POST /cart/items` — Bearer JWT; application/json; response description-only.
- `DELETE /cart/items/{itemId}` — Bearer JWT; query/path parameters; response description-only.

#### Loans

- `POST /loans` — Bearer JWT; application/json; response description-only.
- `PATCH /loans/{id}/return` — Bearer JWT; query/path parameters; response description-only.
- `POST /loans/from-cart` — Bearer JWT; application/json; response description-only.
- `GET /loans/my` — Bearer JWT; query/path parameters; response description-only.

#### Me

- `GET /me` — Bearer JWT; no request body; response description-only.
- `PATCH /me` — Bearer JWT; multipart/form-data, application/json; response description-only.
- `GET /me/loans` — Bearer JWT; query/path parameters; response description-only.
- `GET /me/reviews` — Bearer JWT; query/path parameters; response description-only.

#### Reviews

- `POST /reviews` — Bearer JWT; application/json; response description-only.
- `GET /reviews/book/{bookId}` — Public; query/path parameters; response description-only.
- `DELETE /reviews/{id}` — Bearer JWT; query/path parameters; response description-only.

#### Admin

- `GET /admin/books` — Bearer JWT; query/path parameters; response description-only.
- `GET /admin/loans` — Bearer JWT; query/path parameters; response description-only.
- `POST /admin/loans` — Bearer JWT; application/json; response description-only.
- `PATCH /admin/loans/{id}` — Bearer JWT; application/json; response description-only.
- `GET /admin/loans/overdue` — Bearer JWT; query/path parameters; response description-only.
- `GET /admin/overview` — Bearer JWT; no request body; response description-only.
- `GET /admin/users` — Bearer JWT; query/path parameters; response description-only.

The companion CSV contains complete query/path parameter names, request media types, required request fields, success/error statuses, response schema status, and runtime status.

### 15.3 Security Classification

Public operations include authentication and public catalog/review reads where no operation-level security is declared. Protected operations declare `bearerAuth`; actual role enforcement is indicated by Admin tags and 401/403 status descriptions where present.

Frontend route RBAC remains a product concern, while backend authorization remains the security authority.

### 15.4 Request and Media-Type Highlights

- Login/register: `application/json`.
- Create book: `application/json` or `multipart/form-data`.
- Profile update: `application/json` or `multipart/form-data`.
- Other documented mutations use JSON.
- Multipart boundaries are runtime-generated.
- Integer fields in FormData are serialized intentionally.

### 15.5 Response Schema Confidence

| Category | Status |
|---|---|
| `LoginResponse` | Explicit property schema; requiredness not declared |
| `Book` | Explicit property schema; requiredness not declared |
| Login success | Explicit `$ref` to LoginResponse |
| Most list/detail/cart/loan/profile/review/admin responses | Description-only, no machine-readable object schema |
| Error responses | Status and description; no reusable body schema |

Adapters for description-only responses use `RESPONSE-SCHEMA-PARTIAL` until a controlled response sample or updated OpenAPI schema is supplied. This does not block UI architecture, request models, security setup, or query parameter implementation.

### 15.6 API-to-Figma Gaps

| Figma/product need | API evidence | Decision |
|---|---|---|
| Page count | No documented field | Do not fabricate; hide/placeholder/backend enhancement |
| Book status label | Copies and admin filter semantics | Derive presentation status through a mapper |
| Category artwork | Category list response not explicitly modeled | Local visual asset keyed by category ID/name in hybrid mode |
| Author portrait | No documented field | Local fixture/fallback avatar in hybrid mode |
| Review eligibility | No dedicated endpoint | UI candidate from loans; mutation response is authority |
| Language preference | No request field | Locale cookie only |
| Logout/refresh | No operation | Clear local/BFF session; no silent refresh |
| Exact response DTOs | Mostly description-only | Narrow adapters and integration samples later |

### 15.7 API Adapter Structure

```text
shared/api/axios-client.ts
shared/api/auth-token-provider.ts
shared/api/api-error.ts
shared/api/api-contract-status.ts
features/auth/api/auth.api.ts
entities/book/api/books.api.ts
entities/author/api/authors.api.ts
entities/category/api/categories.api.ts
entities/cart/api/cart.api.ts
entities/borrow/api/loans.api.ts
features/profile/api/profile.api.ts
features/reviews/api/reviews.api.ts
features/admin-dashboard/api/admin-overview.api.ts
features/admin-user-search/api/admin-users.api.ts
features/admin-book-management/api/admin-books.api.ts
features/admin-loans/api/admin-loans.api.ts
```

Each adapter calls only documented paths, sends only documented parameters/fields, distinguishes JSON/multipart, validates explicit schemas, and marks description-only response adapters visibly.

### 15.8 Contract and Runtime Testing Policy

- Unit tests validate path builders, query serialization, request schemas, status mapping, and DTO/domain mappers.
- MSW mirrors all documented paths/methods and request constraints.
- Full portfolio E2E uses deterministic mock mode.
- Runtime API testing is not required for this document revision and was not performed.
- A future runtime integration pass may use a controlled test account/environment; destructive production tests are never implicit.


---

## 16. Styling dan Tailwind Utility-First Rules

1. Tailwind tetap utility-first; hindari CSS component class besar yang mengembalikan proyek menjadi stylesheet tradisional.
2. Design tokens didefinisikan di CSS variables/Tailwind theme.
3. Gunakan `cn()` dan class variance authority untuk variants yang stabil.
4. Arbitrary value hanya untuk value Figma yang benar-benar unik.
5. Repeated arbitrary value wajib menjadi token.
6. Jangan copy class string Figma yang sangat panjang tanpa refactor.
7. Jangan menggunakan fixed `w-[1440px]` atau `w-[393px]` pada production root.
8. Absolute positioning hanya untuk isolated decorative composition.
9. Jangan gunakan `overflow-hidden` untuk menyembunyikan layout bug.
10. Responsive utility mengikuti mobile-first strategy.

Example semantic variant:

```ts
const buttonVariants = cva(
  "inline-flex items-center justify-center font-bold transition focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary-300 text-neutral-25 hover:bg-primary-300/90",
        outline: "border border-neutral-300 bg-white text-neutral-950",
        destructive: "bg-accent-red text-neutral-25",
      },
      size: {
        desktop: "h-12 rounded-full px-6 text-base",
        mobile: "h-10 rounded-full px-4 text-sm",
      },
    },
  },
);
```

---

## 17. Asset Strategy

### 17.1 Production Assets

Unique visual assets yang harus tersedia lokal:

- Booky brand mark/logo;
- user/admin avatar fixture;
- home hero/banner illustration;
- category artwork/icons if unique;
- all distinct book-cover fixtures used in Figma;
- popular-author portraits;
- success illustration/checkmark if unique;
- any unique decorative vector not replaceable by icon library.

Generic controls seperti search, eye, chevron, cart, more, share, close, upload, trash, calendar, and star may use a consistent icon library only if visually equivalent. Do not download duplicates for the same glyph.

### 17.2 Asset Naming

```text
public/assets/
├─ brand/booky-mark.svg
├─ avatars/user-john-doe.webp
├─ illustrations/home-library-hero.webp
├─ books/psychology-of-money.webp
├─ books/yeti-dan-teki-yang-abadi.webp
├─ authors/<author-slug>.webp
└─ categories/<category-slug>.svg
```

### 17.3 Asset QA

- Preserve aspect ratio and crop from Figma.
- Use `next/image` for raster assets.
- Provide width/height or fill with constrained parent.
- Use informative alt text; decorative assets empty alt.
- Optimize without visible quality loss.
- Do not depend on temporary `figma.com/api/mcp/asset/*` URLs.
- Add source mapping and license/usage note for every non-original cover/photo.

The package includes an asset manifest. Exact binary assets were not re-fetched because the project owner explicitly prohibited re-reading completed Figma frames. An asset-only export pass requires separate explicit permission if the original binaries were not persisted during capture.

---

## 18. Accessibility Requirements

- Semantic landmarks: header, nav, main, section, footer.
- One logical `h1` per page.
- Skip link on authenticated shells.
- All icon-only buttons have accessible names.
- Dropdown/Dialog/AlertDialog rely on accessible primitives.
- Visible focus states match theme.
- Touch target approximately 44 x 44 px where possible.
- Error text associated via `aria-describedby`.
- Pending/success/error announced via live region.
- Rating input supports keyboard arrows or radio semantics.
- Search/filter controls have labels even if visually hidden.
- Tables use proper headers; mobile card transformation retains labels.
- Color is not the only status indicator.
- Reduced-motion preference respected.
- Contrast implementation targets WCAG 2.2 AA.
- Root document uses the correct `lang` attribute and locale-derived `dir`.
- Language selector MUST expose self-names (`English`, `Bahasa Indonesia`) to assistive technology; flags MAY be the only visible labels when those self-names remain available through sr-only text or an equivalent accessible name.
- A locale change preserves focus predictably or moves focus to the new page heading after navigation.

---

## 19. Security and Privacy

- Protected API operations use Bearer JWT.
- Recommended production mode stores JWT behind a Next.js BFF in a Secure HttpOnly SameSite cookie and attaches Bearer upstream.
- Direct-client token persistence, when used for portfolio mode, must be isolated and documented; never store tokens in Zustand or source code.
- No refresh or backend logout endpoint is documented; clear session and protected Query cache on logout/401.
- Backend authorization is the security boundary; client role guards improve UX only.
- Sanitize return URLs and locale redirects.
- Validate JSON and multipart input; file checks include documented MIME family and max 5 MB.
- Never log passwords, JWTs, profile data, or raw multipart bodies.
- Review/profile text renders as plain text, not unsafe HTML.
- Error response bodies are not standardized by the OpenAPI; avoid exposing raw server details.
- Apply CSP, XSS prevention, CSRF protections appropriate to the chosen BFF/direct-token architecture, and secure deployment headers.
- CORS behavior and rate limiting were not verified by the source file and remain deployment checks.


---

## 20. Performance and SEO

| Area | Requirement |
|---|---|
| Images | next/image, responsive sizes, explicit dimensions |
| LCP | Priority only for above-fold hero asset |
| Book grids | Lazy-load below fold and paginate |
| Bundle | Client islands only; individual icon imports |
| Query | Avoid duplicate requests; sensible staleTime |
| Fonts | next/font with only required Quicksand weights |
| Layout | No CLS from covers/avatars |
| Search | Debounce network request; keep input responsive |
| Admin list | Server pagination, not huge client array |
| i18n bundles | Route/server-loaded messages; avoid shipping all locales to every client island |

SEO:

- Public login/register may be noindex depending on portfolio goal.
- Authenticated and admin routes should not be indexed.
- Book detail can be indexable only if a public catalog mode exists.
- Metadata and robots policy must reflect actual deployment mode.
- Public/indexable localized routes expose canonical and alternate-language metadata; protected routes remain noindex in every locale.

---

## 21. Error, Loading, Empty, and Offline States

Every query-driven screen must define:

- initial loading skeleton that resembles final layout;
- retryable error with concise message;
- empty state with relevant action;
- background refetch indicator only when useful;
- mutation pending state that prevents duplicate action;
- conflict handling for availability changes;
- offline/network error separated from validation error;
- all state copy localized through translation keys, including retry, empty, conflict, and offline messages.

Do not use one generic spinner centered on every page.

---

## 22. Testing Strategy

### 22.1 Test Profiles

| Profile | Purpose | Network |
|---|---|---|
| `contract-mock` | Validate OpenAPI paths, requests, security expectations, and response adapters | MSW |
| `portfolio-mock` | Full deterministic Figma flow including visual fixtures | MSW |
| `runtime-integration` | Future controlled environment/account verification | Optional, not performed for v1.3 |

### 22.2 Unit

- OpenAPI-derived request schemas and enums.
- Positive integer ID parsing.
- date-time vs local-date validation.
- query parameter normalization and query-key factories.
- FormData serialization.
- DTO-to-domain mapping and derived availability/status.
- cart selection reconciliation.
- JWT/session error handling without token leakage.
- translation key parity and formatters.

### 22.3 Component

- Auth validation and role redirect states.
- Persistent cart selection/remove/clear behavior.
- Checkout partial-success display.
- Profile JSON/multipart update UI.
- Review create/update/delete behavior.
- Admin user filters/pagination.
- Admin book multipart validation.
- LanguageSwitcher route/query preservation.
- English/Indonesian layouts and 30% text expansion.

### 22.4 MSW Contract Integration

- all 41 documented operations have handlers or explicit unused-operation rationale;
- protected handlers require a Bearer token fixture;
- request body/query constraints match OpenAPI;
- book/profile multipart handlers validate file limits/types;
- description-only responses use documented deterministic fixtures and are marked as fixture shapes, not claimed API schemas;
- 400/401/403/404 scenarios follow documented status availability.

### 22.5 E2E Critical Paths

| ID | Scenario |
|---|---|
| E2E-01 | Register/login -> role-aware home/admin redirect |
| E2E-02 | Browse/search/filter -> detail -> book reviews |
| E2E-03 | Add to persistent cart -> select item IDs -> checkout preview -> borrow -> partial/full success |
| E2E-04 | Borrowed filters -> return -> list/book/cart refresh |
| E2E-05 | Profile update with JSON and photo upload variant |
| E2E-06 | Create/update/delete review |
| E2E-07 | Admin overview/users/books/loans navigation |
| E2E-08 | Admin create/edit/delete book with dependency error states |
| E2E-09 | Admin loan create/update/overdue filters |
| E2E-10 | Locale switch during user/admin flow without losing route/session |
| E2E-11 | Logout clears token/session and protected query cache |

### 22.6 Visual and Accessibility QA

- 320x568, 393 mobile reference, tablet, 1024/1280/1440 desktop, and 1920 max-width.
- Key screens in `en` and `id`.
- No clipping, page horizontal overflow, or inaccessible truncated labels.
- Correct `lang`, keyboard controls, focus restoration, dialog semantics, table headers, live regions, and color-independent status.

Runtime smoke/mutation testing is not a prerequisite for this documentation revision.


---

## 23. Acceptance Criteria Berdasarkan Figma

### 23.1 Global

- Quicksand typography, recorded sizes, colors, radii, spacing, and shadow match tokens.
- Desktop header 80 px and mobile header 64 px.
- Desktop 120 px horizontal reference and mobile 16 px gutter are preserved fluidly.
- Cards use correct 12/16 px radius; buttons use pill shape.
- No page-level horizontal overflow.
- All explicit desktop/mobile screen compositions visibly match source snapshots.
- Additive language controls do not disturb the captured Figma geometry.
- English and Indonesian copy fit without inaccessible truncation or action-label clipping.

### 23.2 User Panel

- Auth layouts retain centered composition and exact field hierarchy.
- Home includes header actions, hero, categories, recommendations, authors, footer.
- Mobile book grids remain two columns where shown.
- Book detail keeps cover/metadata/metrics/description/reviews/actions hierarchy.
- Cart and checkout states preserve selection and summary clarity.
- Success state shows return/due information and CTA.
- Borrowed/profile/reviews use the tab model from Figma.
- Review modal matches desktop/mobile sizing and star states.

### 23.3 Admin Panel

- Desktop admin uses header and 600 px tab group where captured.
- Mobile admin uses 64 px header and 361 px fluid content.
- User list becomes labeled cards on mobile, not a squeezed table.
- Book list mobile uses overflow menu and horizontally scrollable filters.
- Preview mobile uses bottom/sticky action bar where captured.
- Add/edit forms preserve 48 px fields and 12 px radius.
- Delete dialog uses equal-width actions and destructive accent.
- Borrowed list cards preserve status, due date, metadata, duration, borrower.

### 23.4 Interaction

- Keyboard operation works for menu, dialog, tabs, filters, rating, pagination.
- Pending states prevent duplicate mutations.
- Query invalidation makes changed data visible without full reload.
- URL filters survive refresh where required.
- Route guards redirect unauthorized users without exposing protected content.
- Locale switching preserves route/query/session and produces a fully localized page without mixed-language system copy.
- Cart UI renders server cart data; selected IDs remain UI-only and reconcile after mutations.
- Bearer-protected requests never expose tokens in UI/log output.
- Figma-only fields absent from API are handled through an approved gap decision, not invented DTO fields.

---

## 24. Delivery Plan

### Phase 1 - Foundation

- Bootstrap Next.js App Router, TypeScript strict, Tailwind tokens, Quicksand, shadcn/ui, providers, next-intl, and test tooling.
- Configure locale-prefixed routes and design-system primitives.

### Phase 2 - API Contract and Session

- Store extracted OpenAPI JSON as a versioned project artifact.
- Implement typed path/query/request schemas from explicit definitions.
- Implement Bearer JWT session boundary; choose BFF or documented direct-client mode.
- Create Axios client without global multipart-breaking Content-Type.
- Build normalized errors and `RESPONSE-SCHEMA-PARTIAL` markers.
- Create Query keys and MSW handlers for all documented operations.

### Phase 3 - Shared and Entities

- Build shared layout/form/i18n/query primitives.
- Build book, author, category, cart, user, loan, and review entities.
- Add local visual fixtures only for approved hybrid-mode gaps.

### Phase 4 - User Panel

- Auth and discovery.
- Persistent cart, checkout, success, and borrowed/return flows.
- Profile and reviews.

### Phase 5 - Admin Panel

- Admin overview/navigation.
- User list.
- Book create/edit/delete with JSON/multipart.
- Loan create/list/update/overdue.
- Author/category CRUD remains API-supported but UI is outside supplied Figma scope unless separately specified.

### Phase 6 - Quality and Release

- Unit, component, MSW contract, E2E, visual, accessibility, security, and performance QA.
- Localized QA and text expansion.
- Document response fixtures that are description-derived.
- Runtime integration is a separate optional release activity with controlled credentials/data; it was not performed for v1.3.


---

## 25. Definition of Done

A task is done when:

- requirement, deployment mode, and acceptance criteria pass;
- desktop/mobile visual references pass;
- component ownership and dependency direction are correct;
- TypeScript strict has no unexplained `any`;
- route IDs are parsed to positive integers before API calls;
- request fields, media types, parameters, statuses, and security follow embedded OpenAPI;
- explicit response schemas are validated;
- description-only response adapters are marked `RESPONSE-SCHEMA-PARTIAL` and covered by deterministic fixtures;
- persistent server cart is not duplicated in Zustand;
- selected cart item IDs reconcile correctly after mutation/partial checkout;
- Bearer token/session handling follows the chosen documented architecture;
- no undocumented `preferredLocale`, `pageCount`, error code, or response field is sent/claimed;
- loading/error/empty/partial-success states exist;
- English/Indonesian keys and layouts pass;
- keyboard/focus/accessibility behavior is verified;
- lint, typecheck, i18n check, tests, and production build pass;
- assets have local path, dimensions, alt/role, and manifest entry;
- no temporary Figma URL is used;
- runtime API behavior is described as unverified unless a separate controlled integration report exists.


---

## 26. Prohibited Patterns

- One giant page component or copied Figma monolith.
- Deep imports into feature internals.
- Raw Axios calls in JSX/presentation components.
- Query data duplicated in Zustand.
- Server cart entities stored as a local draft store.
- JWT stored in Zustand, source code, logs, or an undocumented persistence layer.
- `withCredentials: true` used as a substitute for documented Bearer JWT handling.
- Global multipart `Content-Type` boundary set manually.
- String IDs retained past the route parsing boundary.
- Sending undocumented `preferredLocale`, agreement, confirmPassword, `pageCount`, filters, or DTO fields.
- Treating response prose descriptions as complete machine-readable schemas.
- Using translated labels as API enums, IDs, query keys, or analytics names.
- Hardcoded user-facing copy in reusable components.
- Fixed 1440/393 root widths, default shadcn appearance, repeated raw hex, or overflow hiding used to mask layout defects.
- Client route guards treated as backend authorization.
- Temporary Figma URLs or re-reading completed Figma nodes without permission.
- Claiming runtime API tests were performed when this revision relies only on the supplied OpenAPI reference.


---

## 27. Instruksi Siap Pakai untuk AI Coding Agent

```text
Build Booky using Next.js App Router, TypeScript strict, Tailwind CSS utility-first,
shadcn/ui, Zustand, Zod, Axios, TanStack Query, and next-intl.

Sources of truth:
- saved Figma context and design-system tokens recorded in this PRD;
- embedded OpenAPI 3.0.3 from library-app-api-reference.txt (Library API v1.0.0);
- runtime base URL https://library-backend-production-b9cf.up.railway.app/api.

Do not re-read completed Figma nodes without explicit permission. Runtime API behavior was
not tested for PRD v1.3; do not claim observed runtime responses.

Architecture:
1. Default to Server Components; isolate interactive Client Components.
2. Apply feature/entity/shared boundaries and public index.ts APIs.
3. Use TanStack Query for all remote data, including persistent cart.
4. Use Zustand only for shell UI and selected CartItem IDs when cross-component state is needed.
5. Parse route IDs into positive integers.
6. Use Bearer JWT for protected operations. Prefer a Next.js BFF with an HttpOnly cookie;
   otherwise isolate and document the direct-client token provider. Never store JWT in Zustand.
7. Do not set global Content-Type; support JSON and multipart requests correctly.
8. Send only documented query parameters/request fields.
9. Validate Book and LoginResponse explicit schemas. Mark other response adapters
   RESPONSE-SCHEMA-PARTIAL when the OpenAPI provides description only.
10. Keep frontend domain models separate from transport DTOs.
11. Use /cart server state; loan-from-cart itemIds are CartItem IDs.
12. Implement profile, reviews, admin users, admin overview, books, and loans from documented paths.
13. Do not send preferredLocale, pageCount, confirmPassword, or policy agreement to the API.
14. Implement en/id locale-prefixed routing and localized presentation only.
15. Match Figma at 393 px and 1440 px, with controlled responsive interpolation.
16. Build MSW contract handlers for documented operations and deterministic description-only fixtures.
17. Run lint, typecheck, i18n parity, unit/component/MSW/E2E, accessibility, visual, and build checks.

Important mappings:
- Book availability derives from availableCopies.
- Direct loan days: 1-30.
- Cart loan days: 3, 5, or 10; borrowDate is YYYY-MM-DD.
- Loan transport status: BORROWED, LATE, RETURNED.
- Review request: bookId, star, optional comment.
- Book create requires title, isbn, categoryId and authorId or authorName.
- Figma page count has no documented API field and requires an explicit product decision.
```


---

## 28. Open Decisions

| ID | Question | Default for v1.3 |
|---|---|---|
| OD-01 | Deployment mode? | `hybrid-portfolio` for demo; `strict-live` rules remain available |
| OD-02 | JWT architecture? | Prefer Next.js BFF + HttpOnly cookie; direct-client mode must be documented |
| OD-03 | Token refresh/logout? | No backend operation documented; clear session on logout/401 |
| OD-04 | Response DTO completion? | Use partial adapters/fixtures until explicit schemas or controlled samples exist |
| OD-05 | Canonical borrowed endpoint? | `/loans/my` for Borrowed List; `/me/loans` for profile/history use |
| OD-06 | Figma page count? | Hide/placeholder or request backend field; never fabricate |
| OD-07 | ISBN/year/copy fields vs Figma form? | Add controlled fields using existing design patterns or obtain screen addendum |
| OD-08 | Author portrait/category artwork? | Local visual fixtures in hybrid mode |
| OD-09 | Review eligibility? | Candidate from loan state; backend mutation remains authority |
| OD-10 | Locale persistence? | Locale cookie; no profile API field |
| OD-11 | Author/category CRUD UI? | Outside supplied Figma MVP; separate specification if added |
| OD-12 | Public catalog indexing? | No by default; authenticated portfolio application |
| OD-13 | Error body/stable codes? | HTTP status mapping until backend schema is documented |
| OD-14 | Runtime integration testing? | Separate controlled activity; not required/performed for v1.3 |
| OD-15 | Exact production asset export? | Separate owner-authorized asset-only pass if needed |


## Appendix A - Core Token Snapshot

- Font: Quicksand for display and body.
- Primary action: `#1C65DA`.
- Neutral scale: 25-950 as listed.
- Accent red design token: `#D9206E`.
- Screen validation red: `#EE1D52`.
- Accent green: `#079455`; observed active green: `#24A500`.
- Accent yellow/star: `#FDB022`.
- Radius: 0, 2, 4, 6, 8, 10, 12, 16, 20, 24, full.
- Spacing: 0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160.
- Card shadow: `0 0 10px rgba(203, 202, 202, 0.25)`.

## Appendix B - Official Technical References

- [Next.js App Router documentation](https://nextjs.org/docs/app)
- [Next.js project structure documentation](https://nextjs.org/docs/app/getting-started/project-structure)
- [Tailwind utility-first documentation](https://tailwindcss.com/docs/styling-with-utility-classes)
- [Tailwind responsive design documentation](https://tailwindcss.com/docs/responsive-design)
- [shadcn/ui installation documentation](https://ui.shadcn.com/docs/installation)
- [TanStack Query React quick start](https://tanstack.com/query/latest/docs/framework/react/quick-start)
- [TanStack Query SSR guidance](https://tanstack.com/query/latest/docs/framework/react/guides/ssr)
- [Zustand documentation](https://zustand.docs.pmnd.rs/)
- [Zod documentation](https://zod.dev/)
- [Axios documentation](https://axios-http.com/docs/intro)
- [Next.js internationalization guide](https://nextjs.org/docs/app/guides/internationalization)
- [next-intl documentation](https://next-intl.dev/)
- API contract source: `library-app-api-reference.txt` (embedded OpenAPI 3.0.3, Library API 1.0.0)

## Appendix C - Saved Read Ledger

See `Library_App_Figma_Read_Ledger.md` in this package for the authoritative list of successfully read nodes. No completed node should be re-read unless the design source changes and the owner explicitly authorizes it.
