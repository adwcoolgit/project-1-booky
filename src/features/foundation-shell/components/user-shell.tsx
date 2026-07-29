import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import type { AppShellDefinition } from "@/entities/app-shell";
import { LocaleSwitcher } from "@/features/foundation-shell/components/locale-switcher";
import type { AppLocale } from "@/shared/i18n/config";
import { getDiscoveryFeatureMessages } from "@/shared/i18n/get-messages";
import { cn } from "@/shared/lib/utils";

const BRAND_LABEL = "Booky";

function SearchIcon({ className = "h-5 w-5" }: { className?: string | undefined }) {
  return (
    <svg
      aria-hidden="true"
      className={cn(className, "shrink-0")}
      fill="none"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m14.166 14.167 3.334 3.333"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M16.667 8.333a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function BagIcon({ className = "h-8 w-8" }: { className?: string | undefined }) {
  return (
    <svg
      aria-hidden="true"
      className={cn(className, "shrink-0 text-neutral-950")}
      fill="none"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 12V9.5C11 6.73858 13.2386 4.5 16 4.5C18.7614 4.5 21 6.73858 21 9.5V12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M7 11.75H25L23.5 27.5H8.5L7 11.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-neutral-950" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5 21v-7h2.4l.36-2.73H13.5V9.53c0-.8.22-1.34 1.37-1.34H16.5V5.75A19.3 19.3 0 0 0 14.15 5c-2.33 0-3.93 1.42-3.93 4.04v2.23H7.5V14h2.72v7h3.28Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-neutral-950" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect height="14" rx="4" stroke="currentColor" strokeWidth="1.8" width="14" x="5" y="5" />
      <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.4" cy="7.6" fill="currentColor" r="1" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-neutral-950" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.94 8.5H4.06V20h2.88V8.5ZM5.5 4A1.7 1.7 0 1 0 5.54 7.4 1.7 1.7 0 0 0 5.5 4ZM20 13.02c0-3.48-1.86-5.1-4.35-5.1-2 0-2.9 1.1-3.4 1.88V8.5H9.38c.04.86 0 11.5 0 11.5h2.88v-6.42c0-.34.03-.69.12-.93.27-.69.9-1.4 1.96-1.4 1.38 0 1.93 1.05 1.93 2.59V20H20v-6.98Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-neutral-950" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.9 3c.2 1.63 1.14 3.08 2.57 3.92.82.48 1.76.74 2.72.75v2.94a7.53 7.53 0 0 1-4.13-1.24v5.7A5.06 5.06 0 1 1 11 10.02v3.03a2.02 2.02 0 1 0 2.02 2.02V3h1.88Z" />
    </svg>
  );
}

function createInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "BK";
  }

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

type UserShellProps = {
  locale: AppLocale;
  shell: AppShellDefinition;
  helper: string;
  areaLabel: string;
  children?: ReactNode;
};

export function UserShell({
  locale,
  shell,
  helper,
  areaLabel,
  children,
}: UserShellProps) {
  const discovery = getDiscoveryFeatureMessages(locale);
  const initials = createInitials(areaLabel);

  return (
    <div className="min-h-screen bg-white text-foreground" data-foundation-user-shell="true">
      <header className="home-card-shadow border-b border-border bg-white">
        <div className="mx-auto w-full max-w-canvas px-4 py-4 sm:px-6 md:px-8 lg:px-10 lg:py-4 xl:px-[120px] xl:py-[18px]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-4">
              <Link className="flex shrink-0 items-center gap-[15px]" href={`/${locale}`}>
                <Image
                  alt=""
                  aria-hidden="true"
                  className="h-10 w-10 lg:h-[42px] lg:w-[42px]"
                  height={42}
                  priority
                  src="/assets/logo.svg"
                  width={42}
                />
                <span className="font-display text-[32px] font-bold leading-[42px] text-neutral-950">
                  {BRAND_LABEL}
                </span>
              </Link>

              <div className="flex items-center gap-3 lg:hidden">
                <Link
                  aria-label={discovery.results.filters.searchLabel}
                  className="inline-flex h-6 w-6 items-center justify-center text-neutral-950"
                  href={`/${locale}/books`}
                >
                  <SearchIcon className="h-6 w-6 text-neutral-950" />
                </Link>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white">
                  <BagIcon className="h-7 w-7" />
                </span>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-[13px] font-bold text-brand">
                  {initials}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-end">
              <form
                action={`/${locale}/books`}
                className="hidden w-full max-w-[22rem] items-center gap-[6px] rounded-full border border-border bg-white px-4 py-2 lg:flex xl:max-w-[31.25rem]"
              >
                <SearchIcon className="h-5 w-5 text-neutral-600" />
                <input
                  aria-label={discovery.results.filters.searchLabel}
                  className="w-full border-0 bg-transparent text-sm font-medium leading-7 tracking-[-0.03em] text-foreground placeholder:text-neutral-600 focus:outline-none"
                  name="q"
                  placeholder={discovery.results.filters.searchPlaceholder}
                  type="search"
                />
                <button className="sr-only" type="submit">
                  {discovery.results.filters.searchLabel}
                </button>
              </form>

              <div className="flex items-center justify-between gap-3 sm:gap-4 lg:justify-end lg:gap-6">
                <LocaleSwitcher className="shrink-0" />

                <div className="hidden items-center gap-4 lg:flex">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white">
                    <BagIcon className="h-8 w-8" />
                  </span>
                  <div className="flex min-w-0 items-center gap-4 rounded-full">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-sm font-bold text-brand">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[18px] font-semibold leading-8 tracking-[-0.02em] text-neutral-950">
                        {areaLabel}
                      </p>
                      <p className="truncate text-sm font-medium leading-6 tracking-[-0.02em] text-neutral-600">
                        {shell.badge}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main
        className="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-10 lg:px-10 lg:py-8 xl:px-[120px] xl:py-12"
        id="main-content"
        tabIndex={-1}
      >
        <div className="mx-auto flex w-full max-w-[75rem] flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16">
          <section className="home-card-shadow rounded-[16px] bg-white p-6 sm:p-7 md:p-8 lg:p-10 xl:rounded-[24px]">
            <div className="flex flex-col gap-6 sm:gap-8">
              <div className="space-y-4 sm:space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-brand-subtle px-3 py-1 text-xs font-semibold text-brand">
                    {shell.badge}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-semibold text-neutral-700">
                    {areaLabel}
                  </span>
                </div>

                <div className="max-w-4xl space-y-4">
                  <h1 className="text-page-title text-neutral-950">{shell.title}</h1>
                  <p className="text-body-default text-neutral-700">{shell.description}</p>
                </div>

                <p className="max-w-4xl rounded-[20px] bg-page-user-accent px-4 py-4 text-body-default text-neutral-800 sm:px-5">
                  {helper}
                </p>
              </div>

              <nav aria-label={areaLabel} className="flex flex-wrap gap-3">
                {shell.navigation.map((item) => {
                  const active = item.area === shell.area;

                  return (
                    <Link
                      key={item.href}
                      className={cn(
                        "inline-flex min-h-12 items-center justify-center rounded-full border px-5 py-3 text-sm font-bold tracking-[-0.02em] transition",
                        active
                          ? "border-brand bg-brand text-white"
                          : "border-border bg-white text-neutral-950 hover:bg-neutral-50",
                      )}
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </section>

          {children ? <div>{children}</div> : null}
        </div>
      </main>

      <footer className="border-t border-border bg-white">
        <div className="mx-auto flex w-full max-w-canvas justify-center px-4 py-10 sm:px-6 sm:py-12 md:px-8 md:py-14 lg:px-10 lg:py-16 xl:px-[150px] xl:py-20">
          <div className="flex w-full max-w-[71.25rem] flex-col items-center gap-6 sm:gap-8 md:gap-10">
            <div className="flex flex-col items-center gap-4 text-center sm:gap-5 md:gap-[22px]">
              <Link className="flex items-center gap-[11.43px] sm:gap-3 md:gap-[15px]" href={`/${locale}`}>
                <Image
                  alt=""
                  aria-hidden="true"
                  className="h-8 w-8 sm:h-9 sm:w-9 md:h-[42px] md:w-[42px]"
                  height={42}
                  src="/assets/logo.svg"
                  width={42}
                />
                <span className="font-display text-[32px] font-bold leading-[42px] text-neutral-950">{BRAND_LABEL}</span>
              </Link>
              <p className="max-w-[22.5625rem] text-sm font-semibold leading-7 tracking-[-0.02em] text-neutral-950 sm:max-w-[30rem] sm:text-[15px] sm:leading-[30px] lg:max-w-[40rem] md:max-w-none md:text-base md:leading-[30px]">
                {discovery.home.footer}
              </p>
            </div>

            <div className="flex flex-col items-center gap-5">
              <p className="text-center text-base font-bold leading-[30px] tracking-[-0.02em] text-neutral-950">
                {discovery.home.actions.socialLabel}
              </p>
              <div aria-hidden="true" className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border"><FacebookIcon /></span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border"><InstagramIcon /></span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border"><LinkedInIcon /></span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border"><TikTokIcon /></span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
