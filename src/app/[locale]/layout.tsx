import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { isSupportedLocale } from "@/shared/i18n/config";
import { getMessages } from "@/shared/i18n/get-messages";
import { getLocaleDirection } from "@/shared/i18n/routing";
import { AppProviders } from "@/shared/providers";
import { bookyFont } from "@/shared/styles/fonts";
import { SkipLink } from "@/shared/ui";

import "../globals.css";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const messages = getMessages(locale);
  const skipToContent = (messages as { Foundation: { shell: { skipToContent: string } } }).Foundation.shell.skipToContent;

  return (
    <html dir={getLocaleDirection()} lang={locale} suppressHydrationWarning>
      <body className={bookyFont.variable}>
        <AppProviders locale={locale} messages={messages}>
          <nav aria-label="Skip links">
            <SkipLink label={skipToContent} />
          </nav>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
