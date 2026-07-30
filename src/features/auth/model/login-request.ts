import { z } from "zod";

export const loginRequestDtoSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});
export type LoginRequestDto = z.infer<typeof loginRequestDtoSchema>;

export function createLoginRequestDto(input: { email: string; password: string }): LoginRequestDto {
  return loginRequestDtoSchema.parse({
    email: input.email.trim().toLowerCase(),
    password: input.password,
  });
}
