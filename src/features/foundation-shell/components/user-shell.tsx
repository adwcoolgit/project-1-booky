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

export function UserShell({ shell, helper, areaLabel, children }: UserShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-subtle to-background text-foreground">
      <header className="border-b border-border bg-white/90 backdrop-blur">
        <div className="mx-auto flex min-h-[64px] w-full max-w-[1440px] flex-col gap-4 px-4 py-4 md:min-h-[80px] md:flex-row md:items-center md:justify-between md:px-[120px]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">{shell.badge}</p>
            <div className="mt-1 flex items-center gap-3">
              <span className="font-display text-2xl font-bold">Booky</span>
              <span className="rounded-full bg-brand-subtle px-3 py-1 text-xs font-semibold text-brand">{areaLabel}</span>
            </div>
          </div>
          <LocaleSwitcher />
        </div>
      </header>

      <main
        className="mx-auto grid w-full max-w-[1440px] gap-8 px-4 py-8 md:grid-cols-[260px_minmax(0,1fr)] md:px-[120px]"
        id="main-content"
        tabIndex={-1}
      >
        <aside className="rounded-[24px] border border-border bg-white p-5 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-text-muted">Placeholder navigation</p>
          <nav className="mt-4 flex flex-col gap-2">
            {shell.navigation.map((item) => {
              const active = item.area === shell.area;

              return (
                <Link
                  key={item.href}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    active ? "bg-brand text-white" : "bg-muted text-foreground hover:bg-brand-subtle",
                  )}
                  href={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="rounded-[32px] border border-border bg-white p-6 shadow-card md:p-10">
          <div className="max-w-3xl">
            <h1 className="font-display text-[clamp(1.75rem,3vw,3rem)] font-bold leading-tight">{shell.title}</h1>
            <p className="mt-4 text-base leading-8 text-text-muted">{shell.description}</p>
            <p className="mt-6 rounded-3xl bg-muted px-5 py-4 text-sm leading-7 text-foreground">{helper}</p>
          </div>
          <div className="mt-8">{children}</div>
        </section>
      </main>
    </div>
  );
}
