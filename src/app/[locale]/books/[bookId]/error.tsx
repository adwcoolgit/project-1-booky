"use client";

import { useParams, usePathname } from "next/navigation";

import { BookRouteStatePanel } from "@/features/discovery/components/book-detail-hero";
import { resolveLocale } from "@/shared/i18n/config";
import { getDiscoveryFeatureMessages } from "@/shared/i18n/get-messages";

export default function BookDetailError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  void error;

  const params = useParams<{ locale?: string }>();
  const pathname = usePathname() ?? "/en/books/1";
  const locale = resolveLocale(typeof params?.locale === "string" ? params.locale : "en");
  const detail = getDiscoveryFeatureMessages(locale).results.detail;
  const stateCopy = {
    invalidId: detail.states.invalidId,
    notFound: detail.states.notFound,
    error: detail.states.error,
  };

  return (
    <main className="min-h-screen bg-page-user-accent px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10" id="main-content" tabIndex={-1}>
      <div className="mx-auto flex max-w-content flex-col gap-6 lg:gap-8">
        <section className="rounded-5xl border border-border bg-white p-6 shadow-card md:p-8">
          <p className="text-eyebrow font-semibold text-brand">{detail.headerLabel}</p>
          <h1 className="mt-3 text-page-title text-foreground">{detail.states.error.title}</h1>
          <p className="mt-3 max-w-3xl text-body-default text-text-muted">
            {detail.states.error.description}
          </p>
        </section>

        <BookRouteStatePanel copy={stateCopy} onRetry={reset} retryHref={pathname} state="error" />
      </div>
    </main>
  );
}
