import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginSurface } from "@/features/auth/components/login-surface";
import type { AuthFeedbackState } from "@/features/auth/model/login-outcome";
import { readRouteGuardResult } from "@/features/auth/config/auth-routes";
import { LocaleSwitcher } from "@/features/foundation-shell";
import { getAuthFeatureMessages } from "@/shared/i18n/get-messages";
import { resolveLocale } from "@/shared/i18n/config";

function pickFirst(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function resolveInitialFeedback(
  locale: ReturnType<typeof resolveLocale>,
  searchParams: Record<string, string | string[] | undefined>,
): AuthFeedbackState | null {
  const messages = getAuthFeatureMessages(locale);
  const reason = pickFirst(searchParams.reason);

  if (reason === "expired") {
    return { tone: "info", message: messages.feedback.sessionExpired };
  }

  if (reason === "forbidden") {
    return { tone: "info", message: messages.feedback.forbidden };
  }

  if (reason === "logged-out") {
    return { tone: "info", message: messages.feedback.loggedOut };
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const messages = getAuthFeatureMessages(locale);

  return {
    title: messages.metadata.adminLoginTitle,
    description: messages.metadata.adminLoginDescription,
    robots: { index: false, follow: false },
  };
}

export default async function AdminLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: rawLocale } = await params;
  const resolvedSearchParams = await searchParams;
  const locale = resolveLocale(rawLocale);
  const pathname = `/${locale}/admin/login`;
  const rawReturnTo = pickFirst(resolvedSearchParams.returnTo);
  const reason = pickFirst(resolvedSearchParams.reason);
  const guard = await readRouteGuardResult({
    pathname,
    locale,
    returnTo: rawReturnTo ?? null,
  });

  const shouldBypassGuestRedirect = reason === "expired" && guard.session.status === "authenticated";

  if (guard.redirectPath && !shouldBypassGuestRedirect) {
    redirect(guard.redirectPath);
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6 md:px-8 md:py-8" id="main-content" tabIndex={-1}>
      <header className="mx-auto flex w-full max-w-canvas justify-end pb-10 md:pb-12">
        <LocaleSwitcher />
      </header>
      <div className="mx-auto flex min-h-auth-stage max-w-canvas items-center justify-center pb-10 md:pb-0">
        <LoginSurface
          initialFeedback={resolveInitialFeedback(locale, resolvedSearchParams)}
          locale={locale}
          reason={reason}
          returnTo={guard.returnTo?.href}
          surface="admin"
        />
      </div>
    </main>
  );
}
