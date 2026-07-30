import { z } from "zod";

export const loginResponseUserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["ADMIN", "USER"]),
});
export type LoginResponseUserDto = z.infer<typeof loginResponseUserSchema>;

const directLoginResponseDtoSchema = z.object({
  token: z.string().min(1),
  user: loginResponseUserSchema,
});

const loginResponseEnvelopeSchema = z.object({
  success: z.boolean().optional(),
  message: z.string().optional(),
  data: directLoginResponseDtoSchema,
});

export const loginResponseDtoSchema = z.union([
  directLoginResponseDtoSchema,
  loginResponseEnvelopeSchema,
]);
export type LoginResponseDto = z.infer<typeof directLoginResponseDtoSchema>;

export function parseLoginResponseDto(value: unknown): LoginResponseDto {
  const enveloped = loginResponseEnvelopeSchema.safeParse(value);

  if (enveloped.success) {
    return enveloped.data.data;
  }

  return directLoginResponseDtoSchema.parse(value);
}