import { z } from "zod";

const apiPositiveIntegerSchema = z.number().int().positive();
const apiNonNegativeIntegerSchema = z.number().int().min(0);
const nullableTextSchema = z.string().nullable().optional();
const isoDateTimeSchema = z.string().min(1);
const nestedEnvelopeKeys = ["data", "items"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function createPassthroughRecordSchema(shape: Record<string, z.ZodTypeAny>) {
  return z.object(shape).partial().passthrough();
}

function createCollectionRecordSchema<TItem extends z.ZodTypeAny>(
  itemSchema: TItem,
  keys: readonly string[],
  options: { allowNestedEnvelopes?: boolean } = {},
) {
  const allowNestedEnvelopes = options.allowNestedEnvelopes ?? true;
  const arraySchema = z.array(itemSchema);
  const shape: Record<string, z.ZodTypeAny> = {
    data: arraySchema.optional(),
    items: arraySchema.optional(),
    pagination: paginationDtoSchema.optional(),
    meta: paginationDtoSchema.optional(),
    page: apiPositiveIntegerSchema.optional(),
    limit: apiPositiveIntegerSchema.optional(),
    total: apiNonNegativeIntegerSchema.optional(),
    totalPages: apiNonNegativeIntegerSchema.optional(),
    hasMore: z.boolean().optional(),
  };

  for (const key of keys) {
    shape[key] = arraySchema.optional();
  }

  if (allowNestedEnvelopes) {
    const nestedRecordSchema = createCollectionRecordSchema(itemSchema, keys, {
      allowNestedEnvelopes: false,
    });

    shape.data = z.union([nestedRecordSchema, arraySchema]).optional();
    shape.items = z.union([nestedRecordSchema, arraySchema]).optional();
  }

  return createPassthroughRecordSchema(shape);
}

function createCollectionEnvelopeSchema<TItem extends z.ZodTypeAny>(
  itemSchema: TItem,
  keys: readonly string[],
) {
  return z.union([z.array(itemSchema), createCollectionRecordSchema(itemSchema, keys)]);
}

function createNestedDetailRecordSchema<TItem extends z.ZodTypeAny>(
  itemSchema: TItem,
  keys: readonly string[],
) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const key of keys) {
    shape[key] = itemSchema.optional();
  }

  return createPassthroughRecordSchema(shape).refine(
    (value) => keys.some((key) => value[key] !== undefined),
    {
      message: `Expected a detail envelope with ${keys.join(", ")}.`,
    },
  );
}

function createAuthorBooksRecordSchema(options: { allowNestedEnvelopes?: boolean } = {}) {
  const allowNestedEnvelopes = options.allowNestedEnvelopes ?? true;
  const arraySchema = z.array(bookDtoSchema);
  const shape: Record<string, z.ZodTypeAny> = {
    author: authorDtoSchema.optional(),
    data: arraySchema.optional(),
    items: arraySchema.optional(),
    books: arraySchema.optional(),
    pagination: paginationDtoSchema.optional(),
    meta: paginationDtoSchema.optional(),
    page: apiPositiveIntegerSchema.optional(),
    limit: apiPositiveIntegerSchema.optional(),
    total: apiNonNegativeIntegerSchema.optional(),
    totalPages: apiNonNegativeIntegerSchema.optional(),
    hasMore: z.boolean().optional(),
  };

  if (allowNestedEnvelopes) {
    const nestedRecordSchema = createAuthorBooksRecordSchema({
      allowNestedEnvelopes: false,
    });

    shape.data = z.union([nestedRecordSchema, arraySchema]).optional();
    shape.items = z.union([nestedRecordSchema, arraySchema]).optional();
  }

  return createPassthroughRecordSchema(shape);
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
  createAuthorBooksRecordSchema(),
]);

const nestedBookDetailRecordSchema = createNestedDetailRecordSchema(bookDtoSchema, [
  "data",
  "item",
  "book",
] as const);

const bookDetailEnvelopeDtoSchema = createPassthroughRecordSchema({
  data: z.union([nestedBookDetailRecordSchema, bookDtoSchema]).optional(),
  item: z.union([nestedBookDetailRecordSchema, bookDtoSchema]).optional(),
  book: z.union([nestedBookDetailRecordSchema, bookDtoSchema]).optional(),
}).refine((value) => value.data !== undefined || value.item !== undefined || value.book !== undefined, {
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

function collectRecordCandidates(payload: Record<string, unknown>) {
  const candidates = [payload];

  for (const key of nestedEnvelopeKeys) {
    const value = payload[key];

    if (isRecord(value)) {
      candidates.push(value);
    }
  }

  return candidates;
}

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

  for (const candidate of collectRecordCandidates(payload)) {
    for (const key of ["data", "items", ...keys]) {
      const value = candidate[key];

      if (Array.isArray(value)) {
        return value as TItem[];
      }
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

  const candidates = collectRecordCandidates(payload);
  const directKeys = keys.filter((key) => !nestedEnvelopeKeys.includes(key as (typeof nestedEnvelopeKeys)[number]));
  const envelopeKeys = keys.filter((key) => nestedEnvelopeKeys.includes(key as (typeof nestedEnvelopeKeys)[number]));

  for (const keyGroup of [directKeys, envelopeKeys]) {
    for (const candidate of candidates) {
      for (const key of keyGroup) {
        const value = candidate[key];

        if (value !== undefined && value !== null && !Array.isArray(value)) {
          return value as TItem;
        }
      }
    }
  }

  return null;
}

export function extractPaginationDto(payload: unknown): PaginationDto | null {
  if (!isRecord(payload)) {
    return null;
  }

  const candidates: unknown[] = [];

  for (const candidate of collectRecordCandidates(payload)) {
    candidates.push(candidate.pagination, candidate.meta, candidate);
  }

  for (const candidate of candidates) {
    const result = paginationDtoSchema.safeParse(candidate);

    if (!result.success) {
      continue;
    }

    const { page, limit, total, totalPages, hasMore } = result.data;

    if (page !== undefined || limit !== undefined || total !== undefined || totalPages !== undefined || hasMore !== undefined) {
      return result.data;
    }
  }

  return null;
}