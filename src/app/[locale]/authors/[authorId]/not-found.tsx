"use client";

import { useParams } from "next/navigation";

import { AuthorRouteStatePanel } from "@/features/discovery/components/author-books-section";
import { resolveLocale } from "@/shared/i18n/config";
import { getDiscoveryFeatureMessages } from "@/shared/i18n/get-messages";

export default function AuthorBooksNotFound() {
  const params = useParams<{ locale?: string }>();
  const locale = resolveLocale(typeof params?.locale === "string" ? params.locale : "en");
  const discovery = getDiscoveryFeatureMessages(locale).results.author;
  const stateCopy = {
    invalidId: discovery.states.invalidId,
    notFound: discovery.states.notFound,
    error: discovery.states.error,
  };

  return (
    <main className="min-h-screen bg-page-user-accent px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10" id="main-content" tabIndex={-1}>
      <div className="mx-auto flex max-w-content flex-col gap-6 lg:gap-8">
        <section className="rounded-5xl border border-border bg-white p-6 shadow-card md:p-8">
          <p className="text-eyebrow font-semibold text-brand">{discovery.headerLabel}</p>
          <h1 className="mt-3 text-page-title text-foreground">{discovery.states.notFound.title}</h1>
          <p className="mt-3 max-w-3xl text-body-default text-text-muted">
            {discovery.states.notFound.description}
          </p>
        </section>

        <AuthorRouteStatePanel copy={stateCopy} state="notFound" />
      </div>
    </main>
  );
}