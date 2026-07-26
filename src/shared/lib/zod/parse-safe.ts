import { type ZodType, z } from "zod";

import { defaultZodErrorMap } from "@/shared/lib/zod/error-map";

z.setErrorMap(defaultZodErrorMap);

export function parseSafe<TSchema extends ZodType>(schema: TSchema, input: unknown) {
  return schema.safeParse(input);
}

export function parseOrThrow<TSchema extends ZodType>(schema: TSchema, input: unknown) {
  return schema.parse(input);
}
