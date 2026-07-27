import { z } from "zod";

export const loginResponseUserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["ADMIN", "USER"]),
});
export type LoginResponseUserDto = z.infer<typeof loginResponseUserSchema>;

export const loginResponseDtoSchema = z.object({
  token: z.string().min(1),
  user: loginResponseUserSchema,
});
export type LoginResponseDto = z.infer<typeof loginResponseDtoSchema>;

export function parseLoginResponseDto(value: unknown): LoginResponseDto {
  return loginResponseDtoSchema.parse(value);
}
