import { z } from "zod";

function normalizeOptionalString(value: string | undefined): string | undefined {
  const trimmedValue = value?.trim();

  return trimmedValue ? trimmedValue : undefined;
}

export const registerRequestDtoSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().min(1).optional(),
  password: z.string().min(8),
});
export type RegisterRequestDto = z.infer<typeof registerRequestDtoSchema>;

export function createRegisterRequestDto(input: {
  name: string;
  email: string;
  phone?: string | undefined;
  password: string;
}): RegisterRequestDto {
  return registerRequestDtoSchema.parse({
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: normalizeOptionalString(input.phone),
    password: input.password,
  });
}
