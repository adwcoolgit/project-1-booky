import { z } from "zod";

import { cartItemDtoSchema } from "@/features/cart/api";

const apiPositiveIntegerSchema = z.number().int().positive();
const apiNonNegativeIntegerSchema = z.number().int().min(0);
const nullableTextSchema = z.string().nullable().optional();
const isoDateTimeSchema = z.string().min(1);
const localDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const cartCheckoutDurationDaysSchema = z.union([z.literal(3), z.literal(5), z.literal(10)]);

const cartCheckoutUserDtoSchema = z
  .object({
    name: nullableTextSchema,
    email: nullableTextSchema,
    phone: nullableTextSchema,
  })
  .partial()
  .passthrough();

export const cartCheckoutResponseDtoSchema = z
  .object({
    user: cartCheckoutUserDtoSchema,
    items: z.array(cartItemDtoSchema),
    itemCount: apiNonNegativeIntegerSchema,
  })
  .partial()
  .passthrough();
export type CartCheckoutResponseDto = z.infer<typeof cartCheckoutResponseDtoSchema>;

export const loanFromCartRequestDtoSchema = z.object({
  itemIds: z.array(apiPositiveIntegerSchema).min(1),
  days: cartCheckoutDurationDaysSchema.optional(),
  borrowDate: localDateSchema.optional(),
});
export type LoanFromCartRequestDto = z.infer<typeof loanFromCartRequestDtoSchema>;

const loanSummaryDtoSchema = z
  .object({
    cartItemId: apiPositiveIntegerSchema,
    itemId: apiPositiveIntegerSchema,
    id: apiPositiveIntegerSchema,
    bookId: apiPositiveIntegerSchema,
    bookTitle: z.string(),
    book: z.object({ title: z.string() }).partial().passthrough(),
    borrowedAt: isoDateTimeSchema,
    dueAt: isoDateTimeSchema,
    returnByMessage: nullableTextSchema,
  })
  .partial()
  .passthrough();

const failedCartItemDtoSchema = z
  .object({
    cartItemId: apiPositiveIntegerSchema,
    itemId: apiPositiveIntegerSchema,
    id: apiPositiveIntegerSchema,
    reason: z.string(),
    reasonCode: z.string(),
    message: z.string(),
  })
  .partial()
  .passthrough();

const removedCartItemDtoSchema = z.union([
  apiPositiveIntegerSchema,
  z.object({ cartItemId: apiPositiveIntegerSchema, itemId: apiPositiveIntegerSchema, id: apiPositiveIntegerSchema }).partial().passthrough(),
]);

export const loanFromCartResponseDtoSchema = z
  .object({
    loans: z.array(loanSummaryDtoSchema),
    failed: z.array(failedCartItemDtoSchema),
    removedFromCart: z.array(removedCartItemDtoSchema),
  })
  .partial()
  .passthrough();
export type LoanFromCartResponseDto = z.infer<typeof loanFromCartResponseDtoSchema>;
