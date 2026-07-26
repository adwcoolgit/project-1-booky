"use client";

import { startTransition } from "react";

import { useLocale, useTranslations } from "next-intl";

import { supportedLocales, type AppLocale } from "@/shared/i18n/config";
import { cn } from "@/shared/lib/utils";

type LocaleSwitcherProps = {
  className?: string;
  tone?: "default" | "inverse";
};

export function LocaleSwitcher({ className, tone = "default" }: LocaleSwitcherProps) {
  const locale = useLocale() as AppLocale;
  const tCommon = useTranslations("Common");
  const tFoundation = useTranslations("Foundation.shell");
  const inverse = tone === "inverse";

  function handleChange(nextLocale: AppLocale) {
    startTransition(() => {
      const nextPath = window.location.pathname.replace(/^\/(en|id)(?=\/)/, `/${nextLocale}`);
      window.location.assign(`${nextPath}${window.location.search}${window.location.hash}`);
    });
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("text-sm font-semibold", inverse ? "text-neutral-100" : "text-foreground")}>
        {tFoundation("languageLabel")}
      </span>
      <div
        aria-label={tFoundation("languageDescription")}
        className={cn(
          "inline-flex rounded-full p-1 shadow-card",
          inverse ? "border border-white/15 bg-neutral-950" : "border border-border bg-white",
        )}
        role="group"
      >
        {supportedLocales.map((entry) => {
          const label = entry === "en" ? tCommon("english") : tCommon("indonesian");
          const active = entry === locale;

          return (
            <button
              key={entry}
              aria-pressed={active}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-semibold transition",
                active
                  ? inverse
                    ? "bg-white text-neutral-950"
                    : "bg-brand text-white"
                  : inverse
                    ? "text-neutral-100 hover:bg-white/10"
                    : "text-foreground hover:bg-muted",
              )}
              onClick={() => handleChange(entry)}
              type="button"
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
