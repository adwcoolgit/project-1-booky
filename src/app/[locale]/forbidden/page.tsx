import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ForbiddenView } from "@/features/auth/components/forbidden-view";
import { readRouteGuardResult } from "@/features/auth/config/auth-routes";
import { getBoundaryMessages } from "@/shared/i18n/get-messages";
import { resolveLocale } from "@/shared/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const messages = getBoundaryMessages(locale).authGuards;

  return {
    title: messages.forbiddenTitle,
    description: messages.forbiddenDescription,
    robots: { index: false, follow: false },
  };
}

export default async function ForbiddenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const pathname = `/${locale}/forbidden`;
  const guard = await readRouteGuardResult({
    pathname,
    locale,
    returnTo: pathname,
  });

  if (guard.redirectPath) {
    redirect(guard.redirectPath);
  }

  return <ForbiddenView locale={locale} role={guard.session.status === "authenticated" ? guard.session.role : null} />;
}
