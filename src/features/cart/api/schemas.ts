import { z } from "zod";

const apiPositiveIntegerSchema = z.number().int().positive();
const apiNonNegativeIntegerSchema = z.number().int().min(0);
const nullableTextSchema = z.string().nullable().optional();

const cartItemBookReferenceSchema = z.object({ name: z.string() }).partial().passthrough();

const cartItemBookDtoSchema = z
  .object({
    title: z.string(),
    coverImage: nullableTextSchema,
    availableCopies: apiNonNegativeIntegerSchema,
    authorName: z.string(),
    categoryName: z.string(),
    author: cartItemBookReferenceSchema.optional(),
    category: cartItemBookReferenceSchema.optional(),
  })
  .partial()
  .passthrough();

export const cartItemDtoSchema = z
  .object({
    id: apiPositiveIntegerSchema,
    bookId: apiPositiveIntegerSchema,
    book: cartItemBookDtoSchema.optional(),
  })
  .partial()
  .passthrough();

export const cartResponseDtoSchema = z.union([
  z.array(cartItemDtoSchema),
  z
    .object({
      cartId: apiPositiveIntegerSchema,
      items: z.array(cartItemDtoSchema),
      itemCount: apiNonNegativeIntegerSchema,
    })
    .partial()
    .passthrough(),
]);

export const addToCartRequestDtoSchema = z.object({
  bookId: apiPositiveIntegerSchema,
});

export type CartItemDto = z.infer<typeof cartItemDtoSchema>;
export type CartResponseDto = z.infer<typeof cartResponseDtoSchema>;
export type AddToCartRequestDto = z.infer<typeof addToCartRequestDtoSchema>;
