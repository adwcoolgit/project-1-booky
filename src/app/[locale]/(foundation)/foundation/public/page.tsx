import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { createFoundationMetadata, createShellDefinition, UserShell } from "@/features/foundation-shell";
import { isSupportedLocale } from "@/shared/i18n/config";
import { getFoundationShellMessages, getMessages } from "@/shared/i18n/get-messages";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    return {};
  }

  return createFoundationMetadata("public", getFoundationShellMessages(locale));
}

export default async function PublicFoundationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const messages = getMessages(locale) as {
    Foundation: { shell: { helper: string; areas: { public: string } } };
  };
  const shell = createShellDefinition(locale, "public", getFoundationShellMessages(locale));

  return <UserShell areaLabel={messages.Foundation.shell.areas.public} helper={messages.Foundation.shell.helper} shell={shell} />;
}
