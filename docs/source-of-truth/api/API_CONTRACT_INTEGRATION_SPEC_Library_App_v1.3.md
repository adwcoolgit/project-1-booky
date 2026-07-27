# Library App - API Contract Integration Specification v1.3

## Source and Confidence

- Source: `library-app-api-reference.txt` embedded `swaggerDoc`.
- OpenAPI: `3.0.3`.
- API: Library API `1.0.0`.
- Runtime root: `https://library-backend-production-b9cf.up.railway.app/api`.
- Security: HTTP Bearer JWT.
- Inventory: 31 paths and 41 operations.
- Runtime behavior was not tested.
- Most response bodies are description-only; `Book` and `LoginResponse` have explicit property schemas, but requiredness is not declared.

## Operations

| # | Area | Method | Axios path | Security | Request | Response | Summary |
|---:|---|---|---|---|---|---|---|
| 1 | Admin | `GET` | `/admin/books` | Bearer JWT | params | description-only | Book list — daftar buku untuk admin (filter & pagination) |
| 2 | Admin | `GET` | `/admin/loans` | Bearer JWT | params | description-only | Borrowed list — pinjaman dengan filter All/Active/Returned/Overdue, search, pagination |
| 3 | Admin | `POST` | `/admin/loans` | Bearer JWT | application/json | description-only | Create a loan (admin) |
| 4 | Admin | `PATCH` | `/admin/loans/{id}` | Bearer JWT | application/json | description-only | Update a loan (admin) — change dueAt or status |
| 5 | Admin | `GET` | `/admin/loans/overdue` | Bearer JWT | params | description-only | List overdue loans (not returned and past dueAt) |
| 6 | Admin | `GET` | `/admin/overview` | Bearer JWT | none | description-only | Admin overview (totals, active/overdue loans, top borrowed books) |
| 7 | Admin | `GET` | `/admin/users` | Bearer JWT | params | description-only | User list — daftar user (search, pagination) |
| 8 | Auth | `POST` | `/auth/register` | Public | application/json | description-only | Register new user |
| 9 | Auth | `POST` | `/auth/login` | Public | application/json | explicit | Login and get token |
| 10 | Authors | `GET` | `/authors` | Public | params | description-only | List authors (optional q = search by name, untuk auto-detect di form Add Book) |
| 11 | Authors, Admin | `POST` | `/authors` | Bearer JWT | application/json | description-only | Create author (admin) |
| 12 | Authors | `GET` | `/authors/popular` | Public | params | description-only | Popular authors by accumulated rating dari buku (rating * reviewCount per buku) |
| 13 | Authors | `GET` | `/authors/{id}/books` | Public | params | description-only | Book by author — daftar buku oleh author (untuk halaman "Book by Author") + pagination |
| 14 | Authors, Admin | `PUT` | `/authors/{id}` | Bearer JWT | application/json | description-only | Update author (admin) |
| 15 | Authors, Admin | `DELETE` | `/authors/{id}` | Bearer JWT | params | description-only | Delete author (admin) — blocked if author still has books |
| 16 | Books | `GET` | `/books` | Public | params | description-only | Daftar buku (user) — filter category, rating, search + pagination |
| 17 | Books | `POST` | `/books` | Bearer JWT | multipart/form-data, application/json | description-only | Create book (admin) |
| 18 | Books | `GET` | `/books/recommend` | Public | params | description-only | Rekomendasi buku (by rating) dengan load more (page) |
| 19 | Books | `GET` | `/books/{id}` | Public | params | description-only | Preview book detail — untuk admin/list (author, category, cover, rating, reviewCount, totalCopies, reviews) |
| 20 | Books | `PUT` | `/books/{id}` | Bearer JWT | application/json | description-only | Update book (admin) |
| 21 | Books, Admin | `DELETE` | `/books/{id}` | Bearer JWT | params | description-only | Delete book (admin) — blocked if there are active loans |
| 22 | Cart | `GET` | `/cart` | Bearer JWT | none | description-only | My cart — daftar buku di cart (untuk halaman My Cart) |
| 23 | Cart | `DELETE` | `/cart` | Bearer JWT | none | description-only | Clear my cart |
| 24 | Cart | `GET` | `/cart/checkout` | Bearer JWT | none | description-only | Checkout payload — User Information + Book List (untuk halaman Checkout) |
| 25 | Cart | `POST` | `/cart/items` | Bearer JWT | application/json | description-only | Add book to cart (untuk pinjam nanti) |
| 26 | Cart | `DELETE` | `/cart/items/{itemId}` | Bearer JWT | params | description-only | Remove item from cart |
| 27 | Categories | `GET` | `/categories` | Public | none | description-only | List categories |
| 28 | Categories, Admin | `POST` | `/categories` | Bearer JWT | application/json | description-only | Create category (admin) |
| 29 | Categories, Admin | `PUT` | `/categories/{id}` | Bearer JWT | application/json | description-only | Update category (admin) |
| 30 | Categories, Admin | `DELETE` | `/categories/{id}` | Bearer JWT | params | description-only | Delete category (admin) — blocked if category has books |
| 31 | Loans | `POST` | `/loans` | Bearer JWT | application/json | description-only | Borrow a book (user) |
| 32 | Loans | `PATCH` | `/loans/{id}/return` | Bearer JWT | params | description-only | Return a book (admin or the borrower) |
| 33 | Loans | `POST` | `/loans/from-cart` | Bearer JWT | application/json | description-only | Confirm & Borrow — checkout dari cart (itemIds, borrowDate, duration 3/5/10 days) |
| 34 | Loans | `GET` | `/loans/my` | Bearer JWT | params | description-only | Borrowed List (user) — filter All/Active/Returned/Overdue, pagination (Load More) |
| 35 | Me | `GET` | `/me` | Bearer JWT | none | description-only | Get my profile + loan statistics |
| 36 | Me | `PATCH` | `/me` | Bearer JWT | multipart/form-data, application/json | description-only | Update my profile (name, phone, foto profil) |
| 37 | Me | `GET` | `/me/loans` | Bearer JWT | params | description-only | List my loans (active & history) |
| 38 | Me | `GET` | `/me/reviews` | Bearer JWT | params | description-only | Halaman Reviews — daftar review yang user berikan (rating, comment, book, timestamp) |
| 39 | Reviews | `POST` | `/reviews` | Bearer JWT | application/json | description-only | Create or update my review for a book |
| 40 | Reviews | `GET` | `/reviews/book/{bookId}` | Public | params | description-only | List reviews for a book |
| 41 | Reviews | `DELETE` | `/reviews/{id}` | Bearer JWT | params | description-only | Delete my review |

## Operation Details

### GET /api/admin/books

- Tags: Admin
- Summary: Book list — daftar buku untuk admin (filter & pagination)
- Security: Bearer JWT
- Axios path: `/admin/books`
- Parameters: query:status (string enum=all|available|borrowed|returned default=all); query:q (string); query:categoryId (integer); query:authorId (integer); query:page (integer default=1); query:limit (integer max=50 default=20)
- Request content/required: none
- Success statuses: 200
- Error statuses: 401,403
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### GET /api/admin/loans

- Tags: Admin
- Summary: Borrowed list — pinjaman dengan filter All/Active/Returned/Overdue, search, pagination
- Security: Bearer JWT
- Axios path: `/admin/loans`
- Parameters: query:status (string enum=all|active|returned|overdue default=all); query:q (string); query:page (integer default=1); query:limit (integer max=50 default=20)
- Request content/required: none
- Success statuses: 200
- Error statuses: not declared
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### POST /api/admin/loans

- Tags: Admin
- Summary: Create a loan (admin)
- Security: Bearer JWT
- Axios path: `/admin/loans`
- Parameters: none
- Request content/required: application/json: userId, bookId
- Success statuses: 201
- Error statuses: 400
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### PATCH /api/admin/loans/{id}

- Tags: Admin
- Summary: Update a loan (admin) — change dueAt or status
- Security: Bearer JWT
- Axios path: `/admin/loans/{id}`
- Parameters: path:id (integer required)
- Request content/required: application/json: none declared
- Success statuses: 200
- Error statuses: 404
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### GET /api/admin/loans/overdue

- Tags: Admin
- Summary: List overdue loans (not returned and past dueAt)
- Security: Bearer JWT
- Axios path: `/admin/loans/overdue`
- Parameters: query:page (integer default=1); query:limit (integer max=50 default=20)
- Request content/required: none
- Success statuses: 200
- Error statuses: not declared
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### GET /api/admin/overview

- Tags: Admin
- Summary: Admin overview (totals, active/overdue loans, top borrowed books)
- Security: Bearer JWT
- Axios path: `/admin/overview`
- Parameters: none
- Request content/required: none
- Success statuses: 200
- Error statuses: 401,403
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### GET /api/admin/users

- Tags: Admin
- Summary: User list — daftar user (search, pagination)
- Security: Bearer JWT
- Axios path: `/admin/users`
- Parameters: query:q (string); query:page (integer default=1); query:limit (integer max=50 default=10)
- Request content/required: none
- Success statuses: 200
- Error statuses: 401,403
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### POST /api/auth/register

- Tags: Auth
- Summary: Register new user
- Security: Public
- Axios path: `/auth/register`
- Parameters: none
- Request content/required: application/json: name, email, password
- Success statuses: 201
- Error statuses: 400
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### POST /api/auth/login

- Tags: Auth
- Summary: Login and get token
- Security: Public
- Axios path: `/auth/login`
- Parameters: none
- Request content/required: application/json: email, password
- Success statuses: 200
- Error statuses: 401
- Response schema: 200:application/json:LoginResponse
- Runtime: NOT_TESTED

### GET /api/authors

- Tags: Authors
- Summary: List authors (optional q = search by name, untuk auto-detect di form Add Book)
- Security: Public
- Axios path: `/authors`
- Parameters: query:q (string)
- Request content/required: none
- Success statuses: 200
- Error statuses: not declared
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### POST /api/authors

- Tags: Authors, Admin
- Summary: Create author (admin)
- Security: Bearer JWT
- Axios path: `/authors`
- Parameters: none
- Request content/required: application/json: name
- Success statuses: 201
- Error statuses: not declared
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### GET /api/authors/popular

- Tags: Authors
- Summary: Popular authors by accumulated rating dari buku (rating * reviewCount per buku)
- Security: Public
- Axios path: `/authors/popular`
- Parameters: query:limit (integer max=50 default=10)
- Request content/required: none
- Success statuses: 200
- Error statuses: not declared
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### GET /api/authors/{id}/books

- Tags: Authors
- Summary: Book by author — daftar buku oleh author (untuk halaman "Book by Author") + pagination
- Security: Public
- Axios path: `/authors/{id}/books`
- Parameters: path:id (integer required); query:page (integer default=1); query:limit (integer max=50 default=12)
- Request content/required: none
- Success statuses: 200
- Error statuses: 404
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### PUT /api/authors/{id}

- Tags: Authors, Admin
- Summary: Update author (admin)
- Security: Bearer JWT
- Axios path: `/authors/{id}`
- Parameters: path:id (integer required)
- Request content/required: application/json: none declared
- Success statuses: 200
- Error statuses: 404
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### DELETE /api/authors/{id}

- Tags: Authors, Admin
- Summary: Delete author (admin) — blocked if author still has books
- Security: Bearer JWT
- Axios path: `/authors/{id}`
- Parameters: path:id (integer required)
- Request content/required: none
- Success statuses: 200
- Error statuses: 400,404
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### GET /api/books

- Tags: Books
- Summary: Daftar buku (user) — filter category, rating, search + pagination
- Security: Public
- Axios path: `/books`
- Parameters: query:q (string); query:categoryId (integer); query:authorId (integer); query:minRating (number min=1 max=5); query:page (integer min=1 default=1); query:limit (integer min=1 max=50 default=12)
- Request content/required: none
- Success statuses: 200
- Error statuses: not declared
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### POST /api/books

- Tags: Books
- Summary: Create book (admin)
- Security: Bearer JWT
- Axios path: `/books`
- Parameters: none
- Request content/required: multipart/form-data: title, isbn, categoryId | application/json: title, isbn, categoryId
- Success statuses: 201
- Error statuses: 400,401,403
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### GET /api/books/recommend

- Tags: Books
- Summary: Rekomendasi buku (by rating) dengan load more (page)
- Security: Public
- Axios path: `/books/recommend`
- Parameters: query:by (string enum=rating|popular default=rating); query:categoryId (integer); query:page (integer min=1 default=1); query:limit (integer max=50 default=8)
- Request content/required: none
- Success statuses: 200
- Error statuses: not declared
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### GET /api/books/{id}

- Tags: Books
- Summary: Preview book detail — untuk admin/list (author, category, cover, rating, reviewCount, totalCopies, reviews)
- Security: Public
- Axios path: `/books/{id}`
- Parameters: path:id (integer required)
- Request content/required: none
- Success statuses: 200
- Error statuses: 404
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### PUT /api/books/{id}

- Tags: Books
- Summary: Update book (admin)
- Security: Bearer JWT
- Axios path: `/books/{id}`
- Parameters: path:id (integer required)
- Request content/required: application/json: none declared
- Success statuses: 200
- Error statuses: 404
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### DELETE /api/books/{id}

- Tags: Books, Admin
- Summary: Delete book (admin) — blocked if there are active loans
- Security: Bearer JWT
- Axios path: `/books/{id}`
- Parameters: path:id (integer required)
- Request content/required: none
- Success statuses: 200
- Error statuses: 400,404
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### GET /api/cart

- Tags: Cart
- Summary: My cart — daftar buku di cart (untuk halaman My Cart)
- Security: Bearer JWT
- Axios path: `/cart`
- Parameters: none
- Request content/required: none
- Success statuses: 200
- Error statuses: not declared
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### DELETE /api/cart

- Tags: Cart
- Summary: Clear my cart
- Security: Bearer JWT
- Axios path: `/cart`
- Parameters: none
- Request content/required: none
- Success statuses: 200
- Error statuses: not declared
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### GET /api/cart/checkout

- Tags: Cart
- Summary: Checkout payload — User Information + Book List (untuk halaman Checkout)
- Security: Bearer JWT
- Axios path: `/cart/checkout`
- Parameters: none
- Request content/required: none
- Success statuses: 200
- Error statuses: not declared
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### POST /api/cart/items

- Tags: Cart
- Summary: Add book to cart (untuk pinjam nanti)
- Security: Bearer JWT
- Axios path: `/cart/items`
- Parameters: none
- Request content/required: application/json: bookId
- Success statuses: 200
- Error statuses: 400
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### DELETE /api/cart/items/{itemId}

- Tags: Cart
- Summary: Remove item from cart
- Security: Bearer JWT
- Axios path: `/cart/items/{itemId}`
- Parameters: path:itemId (integer required)
- Request content/required: none
- Success statuses: 200
- Error statuses: 404
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### GET /api/categories

- Tags: Categories
- Summary: List categories
- Security: Public
- Axios path: `/categories`
- Parameters: none
- Request content/required: none
- Success statuses: 200
- Error statuses: not declared
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### POST /api/categories

- Tags: Categories, Admin
- Summary: Create category (admin)
- Security: Bearer JWT
- Axios path: `/categories`
- Parameters: none
- Request content/required: application/json: name
- Success statuses: 201
- Error statuses: not declared
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### PUT /api/categories/{id}

- Tags: Categories, Admin
- Summary: Update category (admin)
- Security: Bearer JWT
- Axios path: `/categories/{id}`
- Parameters: path:id (integer required)
- Request content/required: application/json: none declared
- Success statuses: 200
- Error statuses: 404
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### DELETE /api/categories/{id}

- Tags: Categories, Admin
- Summary: Delete category (admin) — blocked if category has books
- Security: Bearer JWT
- Axios path: `/categories/{id}`
- Parameters: path:id (integer required)
- Request content/required: none
- Success statuses: 200
- Error statuses: 400,404
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### POST /api/loans

- Tags: Loans
- Summary: Borrow a book (user)
- Security: Bearer JWT
- Axios path: `/loans`
- Parameters: none
- Request content/required: application/json: bookId, days
- Success statuses: 200
- Error statuses: 400
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### PATCH /api/loans/{id}/return

- Tags: Loans
- Summary: Return a book (admin or the borrower)
- Security: Bearer JWT
- Axios path: `/loans/{id}/return`
- Parameters: path:id (integer required)
- Request content/required: none
- Success statuses: 200
- Error statuses: 404
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### POST /api/loans/from-cart

- Tags: Loans
- Summary: Confirm & Borrow — checkout dari cart (itemIds, borrowDate, duration 3/5/10 days)
- Security: Bearer JWT
- Axios path: `/loans/from-cart`
- Parameters: none
- Request content/required: application/json: itemIds
- Success statuses: 200
- Error statuses: 400
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### GET /api/loans/my

- Tags: Loans
- Summary: Borrowed List (user) — filter All/Active/Returned/Overdue, pagination (Load More)
- Security: Bearer JWT
- Axios path: `/loans/my`
- Parameters: query:status (string enum=all|active|returned|overdue default=all); query:q (string); query:page (integer default=1); query:limit (integer max=50 default=10)
- Request content/required: none
- Success statuses: 200
- Error statuses: not declared
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### GET /api/me

- Tags: Me
- Summary: Get my profile + loan statistics
- Security: Bearer JWT
- Axios path: `/me`
- Parameters: none
- Request content/required: none
- Success statuses: 200
- Error statuses: not declared
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### PATCH /api/me

- Tags: Me
- Summary: Update my profile (name, phone, foto profil)
- Security: Bearer JWT
- Axios path: `/me`
- Parameters: none
- Request content/required: multipart/form-data: none declared | application/json: none declared
- Success statuses: 200
- Error statuses: not declared
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### GET /api/me/loans

- Tags: Me
- Summary: List my loans (active & history)
- Security: Bearer JWT
- Axios path: `/me/loans`
- Parameters: query:status (string enum=BORROWED|LATE|RETURNED); query:page (integer default=1); query:limit (integer max=50 default=20)
- Request content/required: none
- Success statuses: 200
- Error statuses: not declared
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### GET /api/me/reviews

- Tags: Me
- Summary: Halaman Reviews — daftar review yang user berikan (rating, comment, book, timestamp)
- Security: Bearer JWT
- Axios path: `/me/reviews`
- Parameters: query:q (string); query:page (integer default=1); query:limit (integer max=50 default=20)
- Request content/required: none
- Success statuses: 200
- Error statuses: not declared
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### POST /api/reviews

- Tags: Reviews
- Summary: Create or update my review for a book
- Security: Bearer JWT
- Axios path: `/reviews`
- Parameters: none
- Request content/required: application/json: bookId, star
- Success statuses: 201
- Error statuses: not declared
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### GET /api/reviews/book/{bookId}

- Tags: Reviews
- Summary: List reviews for a book
- Security: Public
- Axios path: `/reviews/book/{bookId}`
- Parameters: path:bookId (integer required); query:page (integer default=1); query:limit (integer max=50 default=10)
- Request content/required: none
- Success statuses: 200
- Error statuses: not declared
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

### DELETE /api/reviews/{id}

- Tags: Reviews
- Summary: Delete my review
- Security: Bearer JWT
- Axios path: `/reviews/{id}`
- Parameters: path:id (integer required)
- Request content/required: none
- Success statuses: 200
- Error statuses: not declared
- Response schema: DESCRIPTION_ONLY
- Runtime: NOT_TESTED

## Explicit Shared Schemas

### Book

Documented properties: integer `id`, string `title`, nullable description, ISBN, nullable published year/cover, rating/review/copy/borrow metrics, integer author/category IDs, created/updated date-times. No `required` array is declared.

### LoginResponse

Documented properties: `token` and user `{id, name, email, role}` where role is `ADMIN|USER`. No `required` array is declared.

## Known Contract Gaps

- Most response object shapes are not machine-readable schemas.
- Error body schemas/stable codes are absent.
- Logout, refresh, and session introspection are absent.
- Token expiry is unspecified.
- Page count, author portrait, category artwork, and preferred locale are absent.
- Runtime behavior/CORS were not tested.

## Implementation Status Labels

- `DOCUMENTED-EXPLICIT`: machine-readable in OpenAPI.
- `DOCUMENTED-DESCRIPTION`: prose only.
- `RESPONSE-SCHEMA-PARTIAL`: frontend adapter based on documented description/controlled fixture.
- `RUNTIME-UNVERIFIED`: no deployed test performed.
