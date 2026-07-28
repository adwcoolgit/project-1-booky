import { z } from "zod";

function coercePositiveIntegerInput(value: unknown) {
  if (typeof value === "string") {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      return undefined;
    }

    if (!/^\d+$/.test(trimmed)) {
      return Number.NaN;
    }

    return Number(trimmed);
  }

  return value;
}

export type PositiveIntegerSchemaOptions = {
  min?: number;
  max?: number;
};

export function createPositiveIntegerSchema(options: PositiveIntegerSchemaOptions = {}) {
  const min = options.min ?? 1;
  let schema = z.number().int().min(min);

  if (options.max !== undefined) {
    schema = schema.max(options.max);
  }

  return z.preprocess(coercePositiveIntegerInput, schema);
}

export const positiveIntegerSchema = createPositiveIntegerSchema();