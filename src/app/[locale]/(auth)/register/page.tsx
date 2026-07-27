import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/features/auth/components/register-form";
import { readRouteGuardResult } from "@/features/auth/config/auth-routes";
import { LocaleSwitcher } from "@/features/foundation-shell";
import { getAuthFeatureMessages } from "@/shared/i18n/get-messages";
import { resolveLocale } from "@/shared/i18n/config";

function pickFirst(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
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
    title: messages.metadata.registerTitle,
    description: messages.metadata.registerDescription,
    robots: { index: false, follow: false },
  };
}

export default async function RegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: rawLocale } = await params;
  const resolvedSearchParams = await searchParams;
  const locale = resolveLocale(rawLocale);
  const pathname = `/${locale}/register`;
  const rawReturnTo = pickFirst(resolvedSearchParams.returnTo);
  const guard = await readRouteGuardResult({
    pathname,
    locale,
    returnTo: rawReturnTo ?? null,
  });

  if (guard.redirectPath) {
    redirect(guard.redirectPath);
  }

  return (
    <main className="min-h-screen bg-white px-4 py-6 md:px-8 md:py-8" id="main-content" tabIndex={-1}>
      <header className="mx-auto flex w-full max-w-canvas justify-end pb-8 md:pb-10">
        <LocaleSwitcher />
      </header>
      <div className="mx-auto flex max-w-canvas justify-center pb-10">
        <RegisterForm locale={locale} returnTo={guard.returnTo?.href} />
      </div>
    </main>
  );
}
