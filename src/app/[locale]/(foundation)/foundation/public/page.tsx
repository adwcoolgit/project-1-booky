import type { Metadata } from "next";

import { BoundaryStateView, createFoundationMetadata, createShellDefinition, UserShell } from "@/features/foundation-shell";
import { isSupportedLocale } from "@/shared/i18n/config";
import { getFoundationShellChromeMessages, getFoundationShellMessages } from "@/shared/i18n/get-messages";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    return {};
  }

  return createFoundationMetadata("public", getFoundationShellMessages(locale));
}

export default async function PublicFoundationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ boundary?: string }>;
}) {
  const { locale } = await params;
  const { boundary } = await searchParams;
  const pathname = `/${locale}/foundation/public`;

  if (!isSupportedLocale(locale)) {
    return <BoundaryStateView locale={locale} notFoundReason="unsupported-locale" pathname={pathname} state="not-found" />;
  }

  if (boundary === "error") {
    return <BoundaryStateView locale={locale} pathname={pathname} state="error" />;
  }

  if (boundary === "not-found") {
    return <BoundaryStateView locale={locale} pathname={pathname} state="not-found" />;
  }

  if (boundary === "loading") {
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  const shell = createShellDefinition(locale, "public", getFoundationShellMessages(locale));
  const shellChrome = getFoundationShellChromeMessages(locale);

  return <UserShell areaLabel={shellChrome.areas.public} helper={shellChrome.helper} shell={shell} />;
}
