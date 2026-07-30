import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import type { AppShellDefinition } from "@/entities/app-shell";
import { LocaleSwitcher } from "@/features/foundation-shell/components/locale-switcher";
import type { AppLocale } from "@/shared/i18n/config";
import { cn } from "@/shared/lib/utils";

const BRAND_LABEL = "Booky";

function createInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "AD";
  }

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

type AdminShellProps = {
  locale: AppLocale;
  shell: AppShellDefinition;
  helper: string;
  areaLabel: string;
  children?: ReactNode;
};

export function AdminShell({
  locale,
  shell,
  helper,
  areaLabel,
  children,
}: AdminShellProps) {
  const initials = createInitials(areaLabel);

  return (
    <div className="min-h-screen bg-page-admin-accent text-foreground">
      <header className="sticky top-0 z-50 home-card-shadow border-b border-border bg-white">
        <div className="mx-auto flex w-full max-w-canvas items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-8 lg:px-10 xl:px-[120px]">
          <Link className="flex shrink-0 items-center gap-[15px]" href={`/${locale}/foundation/admin`}>
            <Image
              alt=""
              aria-hidden="true"
              className="h-10 w-10 lg:h-[42px] lg:w-[42px]"
              height={42}
              priority
              src="/assets/logo.svg"
              width={42}
            />
            <span className="hidden font-display text-[32px] font-bold leading-[42px] text-neutral-950 sm:inline-flex">
              {BRAND_LABEL}
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <LocaleSwitcher className="shrink-0" />
            <div className="flex min-w-0 items-center gap-3 rounded-full">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-sm font-bold text-brand md:h-12 md:w-12">
                {initials}
              </div>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-base font-semibold leading-7 tracking-[-0.02em] text-neutral-950 md:text-[18px] md:leading-8">
                  {areaLabel}
                </p>
                <p className="truncate text-[11px] font-bold uppercase tracking-[0.08em] text-brand md:text-xs">
                  {shell.badge}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-10 lg:py-14 xl:px-[120px] xl:py-16" id="main-content" tabIndex={-1}>
        <div className="mx-auto flex w-full max-w-content flex-col gap-6 md:gap-8">
          <section className="rounded-5xl border border-border bg-white p-6 shadow-card md:p-8">
            <div className="flex flex-col gap-6 md:gap-7">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-brand-subtle px-3 py-1 text-xs font-semibold text-brand">
                  {shell.badge}
                </span>
                <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-semibold text-neutral-700">
                  {areaLabel}
                </span>
              </div>

              <div className="max-w-4xl space-y-4">
                <h1 className="text-page-title text-foreground">{shell.title}</h1>
                <p className="text-body-default text-text-muted">{shell.description}</p>
              </div>

              <p className="max-w-4xl rounded-[20px] bg-brand-subtle/60 px-4 py-4 text-body-default text-neutral-800 sm:px-5">
                {helper}
              </p>

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

          {children ? (
            <div>{children}</div>
          ) : (
            <section className="grid gap-4 md:grid-cols-3">
              {shell.navigation.map((item) => {
                const active = item.area === shell.area;

                return (
                  <Link
                    key={item.href}
                    className={cn(
                      "rounded-4xl border bg-white p-5 shadow-card transition hover:-translate-y-0.5",
                      active ? "border-brand/30" : "border-border",
                    )}
                    href={item.href}
                  >
                    <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">{shell.badge}</p>
                    <h2 className="mt-3 text-[20px] font-bold leading-[34px] tracking-[-0.02em] text-foreground">
                      {item.label}
                    </h2>
                    <p className="mt-2 text-sm font-medium leading-7 tracking-[-0.02em] text-text-muted">
                      Foundation route siap dipakai untuk validasi state, boundary, dan navigasi area admin.
                    </p>
                  </Link>
                );
              })}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
