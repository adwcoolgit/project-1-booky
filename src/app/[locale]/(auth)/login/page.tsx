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

  if (pickFirst(searchParams.registered) === "1") {
    return { tone: "success", message: messages.feedback.registeredSuccess };
  }

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
    title: messages.metadata.loginTitle,
    description: messages.metadata.loginDescription,
    robots: { index: false, follow: false },
  };
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: rawLocale } = await params;
  const resolvedSearchParams = await searchParams;
  const locale = resolveLocale(rawLocale);
  const pathname = `/${locale}/login`;
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
    <main className="relative min-h-screen overflow-x-hidden bg-white px-4 py-4 sm:px-5 sm:py-5 md:px-8 md:py-8 lg:px-10 lg:py-10 xl:px-12 xl:py-12" id="main-content" tabIndex={-1}>
      <header className="absolute right-4 top-4 z-10 sm:right-5 sm:top-5 md:static md:mx-auto md:flex md:w-full md:max-w-canvas md:justify-end md:pb-10 lg:pb-12">
        <LocaleSwitcher />
      </header>
      <div className="mx-auto flex min-h-screen w-full max-w-canvas items-center justify-center md:min-h-auth-stage md:pb-0">
        <LoginSurface
          initialFeedback={resolveInitialFeedback(locale, resolvedSearchParams)}
          locale={locale}
          reason={reason}
          returnTo={guard.returnTo?.href}
          surface="user"
        />
      </div>
    </main>
  );
}