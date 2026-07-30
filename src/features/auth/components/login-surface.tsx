"use client";

import { LoginForm } from "@/features/auth/components/login-form";
import type { AuthSurface } from "@/features/auth/config/auth-routes";
import { useSessionReentry } from "@/features/auth/hooks/use-session-reentry";
import type { AuthFeedbackState } from "@/features/auth/model/login-outcome";
import type { AppLocale } from "@/shared/i18n/config";

type LoginSurfaceProps = {
  locale: AppLocale;
  surface: AuthSurface;
  returnTo?: string | undefined;
  initialFeedback?: AuthFeedbackState | null;
  reason?: string | undefined;
};

export function LoginSurface({ locale, surface, returnTo, initialFeedback = null, reason }: LoginSurfaceProps) {
  useSessionReentry({ locale, returnTo, surface, reason });

  return <LoginForm initialFeedback={initialFeedback} locale={locale} returnTo={returnTo} surface={surface} />;
}
