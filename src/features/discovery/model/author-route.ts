import { z } from "zod";

import { positiveIntegerSchema } from "@/shared/lib/zod/positive-int";

export const authorRouteParamsSchema = z.object({
  authorId: positiveIntegerSchema,
});

export type AuthorRouteParams = z.infer<typeof authorRouteParamsSchema>;

export type AuthorRouteParseResult =
  | {
      status: "valid";
      params: AuthorRouteParams;
    }
  | {
      status: "invalid";
      reason: "invalid-author-id";
    };

export function parseAuthorRouteParams(input: unknown): AuthorRouteParseResult {
  const result = authorRouteParamsSchema.safeParse(input);

  if (!result.success) {
    return {
      status: "invalid",
      reason: "invalid-author-id",
    };
  }

  return {
    status: "valid",
    params: result.data,
  };
}