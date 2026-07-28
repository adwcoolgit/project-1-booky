import Link from "next/link";
import type { ReactNode } from "react";

import type { AppShellDefinition } from "@/entities/app-shell";
import { LocaleSwitcher } from "@/features/foundation-shell/components/locale-switcher";
import { cn } from "@/shared/lib/utils";

type UserShellProps = {
  shell: AppShellDefinition;
  helper: string;
  areaLabel: string;
  children?: ReactNode;
};

export function UserShell({
  shell,
  helper,
  areaLabel,
  children,
}: UserShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-subtle to-background text-foreground">
      <header className="bg-white/90 border-b border-border backdrop-blur">
        <div className="mx-auto flex min-h-header-mobile w-full max-w-canvas flex-col gap-4 px-4 py-4 md:min-h-header-desktop md:flex-row md:items-center md:justify-between md:px-layout-desktop-gutter">
          <div>
            <p className="text-eyebrow font-semibold text-brand">
              {shell.badge}
            </p>
            <div className="mt-1 flex items-center gap-3">
              <span className="font-display text-2xl font-bold text-text-strong">
                Booky
              </span>
              <span className="rounded-full bg-brand-subtle px-3 py-1 text-xs font-semibold text-brand">
                {areaLabel}
              </span>
            </div>
          </div>
          <LocaleSwitcher />
        </div>
      </header>

      <main
        className="mx-auto grid w-full max-w-canvas gap-8 px-4 py-8 md:grid-cols-shell-user md:px-layout-desktop-gutter"
        id="main-content"
        tabIndex={-1}
      >
        <aside className="rounded-4xl border border-border bg-white p-5 shadow-card">
          <p className="text-eyebrow font-semibold text-text-muted">
            Placeholder navigation
          </p>
          <nav className="mt-4 flex flex-col gap-2">
            {shell.navigation.map((item) => {
              const active = item.area === shell.area;

              return (
                <Link
                  key={item.href}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    active
                      ? "bg-brand text-white"
                      : "bg-muted text-foreground hover:bg-brand-subtle",
                  )}
                  href={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="rounded-5xl border border-border bg-white p-6 shadow-card md:p-10">
          <div className="max-w-3xl">
            <h1 className="text-section-title">{shell.title}</h1>
            <p className="text-body-default mt-4 text-text-muted">
              {shell.description}
            </p>
            <p className="text-body-default mt-6 rounded-3xl bg-muted px-5 py-4 text-foreground">
              {helper}
            </p>
          </div>
          <div className="mt-8">{children}</div>
        </section>
      </main>
    </div>
  );
}
