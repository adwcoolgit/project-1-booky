import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminShell, createFoundationMetadata, createShellDefinition } from "@/features/foundation-shell";
import { isSupportedLocale } from "@/shared/i18n/config";
import { getFoundationShellMessages, getMessages } from "@/shared/i18n/get-messages";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    return {};
  }

  return createFoundationMetadata("admin", getFoundationShellMessages(locale));
}

export default async function AdminFoundationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const messages = getMessages(locale) as {
    Foundation: { shell: { helper: string; areas: { admin: string } } };
  };
  const shell = createShellDefinition(locale, "admin", getFoundationShellMessages(locale));

  return <AdminShell areaLabel={messages.Foundation.shell.areas.admin} helper={messages.Foundation.shell.helper} shell={shell} />;
}
