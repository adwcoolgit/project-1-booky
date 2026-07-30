import { z } from "zod";

import { sessionEnvelopeSchema, type SessionEnvelope } from "@/shared/auth/session-schema";
import type { AppLocale } from "@/shared/i18n/config";

export const sessionUserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["ADMIN", "USER"]),
});
export type SessionUser = z.infer<typeof sessionUserSchema>;

type LoginResponseLike = {
  token: string;
  user: SessionUser;
};

export function mapLoginResponseToSessionUser(response: LoginResponseLike): SessionUser {
  return sessionUserSchema.parse(response.user);
}

export function mapLoginResponseToSessionEnvelope(
  response: LoginResponseLike,
  locale: AppLocale,
  issuedAt: string = new Date().toISOString(),
): SessionEnvelope {
  const user = mapLoginResponseToSessionUser(response);

  return sessionEnvelopeSchema.parse({
    jwt: response.token,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    role: user.role,
    issuedAt,
    localeAtLogin: locale,
  });
}
