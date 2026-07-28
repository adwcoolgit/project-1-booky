"use client";

import type { MouseEvent, SVGProps } from "react";

import { usePathname, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { supportedLocales, type AppLocale } from "@/shared/i18n/config";
import { cn } from "@/shared/lib/utils";

type LocaleSwitcherProps = {
  className?: string;
  tone?: "default" | "inverse";
};

type FlagIconProps = SVGProps<SVGSVGElement> & {
  locale: AppLocale;
};

function EnglishFlagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 64 48" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="64" height="48" rx="6" fill="#012169" />
      <path d="M0 0L64 48M64 0L0 48" stroke="#FFF" strokeWidth="10" />
      <path d="M0 0L64 48M64 0L0 48" stroke="#C8102E" strokeWidth="4.5" />
      <path d="M32 0V48M0 24H64" stroke="#FFF" strokeWidth="15" />
      <path d="M32 0V48M0 24H64" stroke="#C8102E" strokeWidth="8" />
    </svg>
  );
}

function IndonesianFlagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 64 48" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="64" height="48" rx="6" fill="#fff" />
      <path d="M0 0H64V24H0z" fill="#CE1126" />
      <rect x="0.5" y="0.5" width="63" height="47" rx="5.5" stroke="#D9DEE8" />
    </svg>
  );
}

function FlagIcon({ locale, ...props }: FlagIconProps) {
  if (locale === "id") {
    return <IndonesianFlagIcon {...props} />;
  }

  return <EnglishFlagIcon {...props} />;
}

const localePrefixPattern = /^\/(en|id)(?=\/|$)/;

export function LocaleSwitcher({ className, tone = "default" }: LocaleSwitcherProps) {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname() ?? `/${locale}/foundation/public`;
  const searchParams = useSearchParams();
  const tCommon = useTranslations("Common");
  const tFoundation = useTranslations("Foundation.shell");
  const inverse = tone === "inverse";

  function buildHref(nextLocale: AppLocale) {
    if (localePrefixPattern.test(pathname)) {
      return pathname.replace(localePrefixPattern, `/${nextLocale}`);
    }

    return `/${nextLocale}/foundation/public`;
  }

  function handleClick(event: MouseEvent<HTMLAnchorElement>, nextLocale: AppLocale) {
    if (nextLocale === locale) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    const query = searchParams.toString();
    const search = query ? `?${query}` : "";
    window.location.assign(`${buildHref(nextLocale)}${search}${window.location.hash}`);
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
          const href = buildHref(entry);

          return (
            <a
              aria-current={active ? "page" : undefined}
              aria-label={label}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full p-2 text-sm font-semibold transition",
                active
                  ? inverse
                    ? "bg-white text-neutral-950"
                    : "bg-brand text-white"
                  : inverse
                    ? "text-neutral-100 hover:bg-white/10"
                    : "text-foreground hover:bg-muted",
              )}
              href={href}
              key={entry}
              onClick={(event) => handleClick(event, entry)}
              title={label}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1",
                  active
                    ? inverse
                      ? "ring-neutral-950/10"
                      : "ring-white/30"
                    : inverse
                      ? "ring-white/20"
                      : "ring-border",
                )}
                data-locale-flag={entry}
              >
                <FlagIcon className="h-full w-full" locale={entry} />
              </span>
              <span className="sr-only" data-locale-label={entry}>
                {label}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
