import { z } from "zod";

import { positiveIntegerSchema } from "@/shared/lib/zod/positive-int";

export const bookRouteParamsSchema = z.object({
  bookId: positiveIntegerSchema,
});

export type BookRouteParams = z.infer<typeof bookRouteParamsSchema>;

export type BookRouteParseResult =
  | {
      status: "valid";
      params: BookRouteParams;
    }
  | {
      status: "invalid";
      reason: "invalid-book-id";
    };

export function parseBookRouteParams(input: unknown): BookRouteParseResult {
  const result = bookRouteParamsSchema.safeParse(input);

  if (!result.success) {
    return {
      status: "invalid",
      reason: "invalid-book-id",
    };
  }

  return {
    status: "valid",
    params: result.data,
  };
}