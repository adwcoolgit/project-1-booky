import { z } from "zod";

const apiPositiveIntegerSchema = z.number().int().positive();
const apiNonNegativeIntegerSchema = z.number().int().min(0);
const nullableTextSchema = z.string().nullable().optional();
const isoDateTimeSchema = z.string().min(1);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function createCollectionEnvelopeSchema<TItem extends z.ZodTypeAny>(
  itemSchema: TItem,
  keys: readonly string[],
) {
  const shape: Record<string, z.ZodTypeAny> = {
    data: z.array(itemSchema).optional(),
    items: z.array(itemSchema).optional(),
    pagination: paginationDtoSchema.optional(),
    meta: paginationDtoSchema.optional(),
    page: apiPositiveIntegerSchema.optional(),
    limit: apiPositiveIntegerSchema.optional(),
    total: apiNonNegativeIntegerSchema.optional(),
    totalPages: apiNonNegativeIntegerSchema.optional(),
    hasMore: z.boolean().optional(),
  };

  for (const key of keys) {
    shape[key] = z.array(itemSchema).optional();
  }

  return z.union([z.array(itemSchema), z.object(shape).partial().passthrough()]);
}

export const paginationDtoSchema = z
  .object({
    page: apiPositiveIntegerSchema,
    limit: apiPositiveIntegerSchema,
    total: apiNonNegativeIntegerSchema,
    totalPages: apiNonNegativeIntegerSchema,
    hasMore: z.boolean(),
  })
  .partial();

export const categoryDtoSchema = z
  .object({
    id: apiPositiveIntegerSchema,
    name: z.string(),
    createdAt: isoDateTimeSchema.optional(),
    updatedAt: isoDateTimeSchema.optional(),
  })
  .partial();

export const authorDtoSchema = z
  .object({
    id: apiPositiveIntegerSchema,
    name: z.string(),
    bio: nullableTextSchema,
    bookCount: apiNonNegativeIntegerSchema.optional(),
    createdAt: isoDateTimeSchema.optional(),
    updatedAt: isoDateTimeSchema.optional(),
  })
  .partial();

export const reviewDtoSchema = z
  .object({
    id: z.union([apiPositiveIntegerSchema, z.string().min(1)]).optional(),
    bookId: apiPositiveIntegerSchema.optional(),
    reviewerName: z.string().optional(),
    star: z.number().int().min(1).max(5),
    comment: nullableTextSchema,
    createdAt: isoDateTimeSchema.optional(),
  })
  .partial();

export const bookDtoSchema = z
  .object({
    id: apiPositiveIntegerSchema,
    title: z.string(),
    description: nullableTextSchema,
    isbn: z.string().optional(),
    publishedYear: z.number().int().nullable().optional(),
    coverImage: z.string().nullable().optional(),
    rating: z.number().optional(),
    reviewCount: apiNonNegativeIntegerSchema.optional(),
    totalCopies: apiNonNegativeIntegerSchema.optional(),
    availableCopies: apiNonNegativeIntegerSchema.optional(),
    borrowCount: apiNonNegativeIntegerSchema.optional(),
    authorId: apiPositiveIntegerSchema.optional(),
    authorName: z.string().optional(),
    categoryId: apiPositiveIntegerSchema.optional(),
    categoryName: z.string().optional(),
    author: authorDtoSchema.optional(),
    category: categoryDtoSchema.optional(),
    createdAt: isoDateTimeSchema.optional(),
    updatedAt: isoDateTimeSchema.optional(),
  })
  .partial();

export const booksCollectionDtoSchema = createCollectionEnvelopeSchema(bookDtoSchema, ["books"] as const);
export const recommendationsCollectionDtoSchema = createCollectionEnvelopeSchema(bookDtoSchema, ["books"] as const);
export const authorsCollectionDtoSchema = createCollectionEnvelopeSchema(authorDtoSchema, ["authors"] as const);
export const categoriesCollectionDtoSchema = createCollectionEnvelopeSchema(categoryDtoSchema, ["categories"] as const);
export const reviewsCollectionDtoSchema = createCollectionEnvelopeSchema(reviewDtoSchema, ["reviews"] as const);
export const authorBooksResponseDtoSchema = z.union([
  z.array(bookDtoSchema),
  z
    .object({
      author: authorDtoSchema.optional(),
      data: z.array(bookDtoSchema).optional(),
      items: z.array(bookDtoSchema).optional(),
      books: z.array(bookDtoSchema).optional(),
      pagination: paginationDtoSchema.optional(),
      meta: paginationDtoSchema.optional(),
      page: apiPositiveIntegerSchema.optional(),
      limit: apiPositiveIntegerSchema.optional(),
      total: apiNonNegativeIntegerSchema.optional(),
      totalPages: apiNonNegativeIntegerSchema.optional(),
      hasMore: z.boolean().optional(),
    })
    .partial()
    .passthrough(),
]);

const bookDetailEnvelopeDtoSchema = z
  .object({
    data: bookDtoSchema.optional(),
    item: bookDtoSchema.optional(),
    book: bookDtoSchema.optional(),
  })
  .partial()
  .passthrough()
  .refine((value) => value.data !== undefined || value.item !== undefined || value.book !== undefined, {
    message: "Expected a detail envelope with data, item, or book.",
  });

export const bookDetailResponseDtoSchema = z.union([bookDetailEnvelopeDtoSchema, bookDtoSchema]);

export type PaginationDto = z.infer<typeof paginationDtoSchema>;
export type CategoryDto = z.infer<typeof categoryDtoSchema>;
export type AuthorDto = z.infer<typeof authorDtoSchema>;
export type ReviewDto = z.infer<typeof reviewDtoSchema>;
export type BookDto = z.infer<typeof bookDtoSchema>;
export type BooksCollectionDto = z.infer<typeof booksCollectionDtoSchema>;
export type RecommendationsCollectionDto = z.infer<typeof recommendationsCollectionDtoSchema>;
export type AuthorsCollectionDto = z.infer<typeof authorsCollectionDtoSchema>;
export type CategoriesCollectionDto = z.infer<typeof categoriesCollectionDtoSchema>;
export type ReviewsCollectionDto = z.infer<typeof reviewsCollectionDtoSchema>;
export type AuthorBooksResponseDto = z.infer<typeof authorBooksResponseDtoSchema>;
export type BookDetailResponseDto = z.infer<typeof bookDetailResponseDtoSchema>;

export function extractCollectionItems<TItem>(
  payload: unknown,
  keys: readonly string[],
): TItem[] {
  if (Array.isArray(payload)) {
    return payload as TItem[];
  }

  if (!isRecord(payload)) {
    return [];
  }

  const preferredKeys = ["data", "items", ...keys];

  for (const key of preferredKeys) {
    const value = payload[key];

    if (Array.isArray(value)) {
      return value as TItem[];
    }
  }

  return [];
}

export function extractSingleItem<TItem>(
  payload: unknown,
  keys: readonly string[],
): TItem | null {
  if (Array.isArray(payload)) {
    return (payload[0] as TItem | undefined) ?? null;
  }

  if (!isRecord(payload)) {
    return null;
  }

  for (const key of keys) {
    const value = payload[key];

    if (value !== undefined && value !== null && !Array.isArray(value)) {
      return value as TItem;
    }
  }

  return null;
}

export function extractPaginationDto(payload: unknown): PaginationDto | null {
  if (!isRecord(payload)) {
    return null;
  }

  const candidates = [payload.pagination, payload.meta, payload];

  for (const candidate of candidates) {
    const result = paginationDtoSchema.safeParse(candidate);

    if (result.success) {
      return result.data;
    }
  }

  return null;
}