import Link from "next/link";
import type { ReactNode } from "react";

import type { AppShellDefinition } from "@/entities/app-shell";
import { LocaleSwitcher } from "@/features/foundation-shell/components/locale-switcher";
import { cn } from "@/shared/lib/utils";

type AdminShellProps = {
  shell: AppShellDefinition;
  helper: string;
  areaLabel: string;
  children?: ReactNode;
};

export function AdminShell({ shell, helper, areaLabel, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto grid min-h-screen w-full max-w-[1440px] md:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-b border-white/10 bg-neutral-900 p-6 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-200">{shell.badge}</p>
              <span className="mt-2 block font-display text-3xl font-bold">Booky</span>
              <p className="mt-2 text-sm text-neutral-200">{areaLabel}</p>
            </div>
            <LocaleSwitcher className="hidden md:flex" tone="inverse" />
          </div>
          <LocaleSwitcher className="mt-4 md:hidden" tone="inverse" />
          <nav className="mt-8 flex flex-col gap-2">
            {shell.navigation.map((item) => {
              const active = item.area === shell.area;

              return (
                <Link
                  key={item.href}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    active ? "bg-white text-neutral-950" : "bg-white/5 text-white hover:bg-white/10",
                  )}
                  href={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="px-4 py-8 md:px-12 md:py-10" id="main-content" tabIndex={-1}>
          <section className="rounded-[32px] border border-white/10 bg-neutral-900 p-6 shadow-card md:p-10">
            <h1 className="font-display text-[clamp(1.75rem,3vw,3rem)] font-bold leading-tight">{shell.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-300">{shell.description}</p>
            <p className="mt-6 rounded-3xl bg-white/5 px-5 py-4 text-sm leading-7 text-neutral-200">{helper}</p>
            <div className="mt-8">{children}</div>
          </section>
        </main>
      </div>
    </div>
  );
}
