"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useId } from "react";

import {
  getBoundaryRecoveryHref,
  getBoundaryStateCopy,
  resolveBoundaryLocale,
  type BoundaryErrorScope,
  type BoundaryNotFoundReason,
  type BoundaryStateId,
} from "@/entities/boundary-state";
import { getFoundationAreaFromPathname } from "@/entities/locale-route";
import { AdminShell } from "@/features/foundation-shell/components/admin-shell";
import { UserShell } from "@/features/foundation-shell/components/user-shell";
import { createShellDefinition } from "@/features/foundation-shell/config/foundation-routes";
import { getFoundationShellChromeMessages, getFoundationShellMessages } from "@/shared/i18n/get-messages";
import { cn } from "@/shared/lib/utils";
import { FocusTarget } from "@/shared/ui";

type BoundaryStateViewProps = {
  state: BoundaryStateId;
  locale?: string;
  pathname?: string;
  error?: Error & { digest?: string };
  errorScope?: BoundaryErrorScope;
  notFoundReason?: BoundaryNotFoundReason;
  onRetry?: () => void;
  recoveryHref?: string;
};

export function BoundaryStateView({
  state,
  locale,
  pathname,
  error,
  errorScope = "route",
  notFoundReason = "generic",
  onRetry,
  recoveryHref,
}: BoundaryStateViewProps) {
  const params = useParams<{ locale?: string }>();
  const pathnameFromHook = usePathname();
  const activeLocale = resolveBoundaryLocale(locale ?? params?.locale);
  const currentPathname = pathname ?? pathnameFromHook ?? `/${activeLocale}/foundation/public`;
  const area = getFoundationAreaFromPathname(currentPathname) ?? "public";
  const shell = createShellDefinition(activeLocale, area, getFoundationShellMessages(activeLocale));
  const shellChrome = getFoundationShellChromeMessages(activeLocale);
  const copy = getBoundaryStateCopy(activeLocale, state, { errorScope, notFoundReason });
  const focusId = useId().replace(/:/g, "");
  const headingId = `${focusId}-title`;
  const inverse = shell.variant === "admin-facing";
  const resolvedRecoveryHref = recoveryHref ?? getBoundaryRecoveryHref(activeLocale);

  useEffect(() => {
    if (state === "loading") {
      return;
    }

    document.getElementById(focusId)?.focus();
  }, [focusId, state]);

  const panelClassName = cn(
    "rounded-panel border p-6 shadow-card md:p-8",
    inverse ? "border-white/10 bg-neutral-950 text-white" : "border-border bg-muted/60 text-foreground",
  );
  const subtleTextClassName = inverse ? "text-neutral-300" : "text-text-muted";
  const eyebrowClassName = inverse ? "text-primary-200" : "text-brand";
  const secondaryButtonClassName = inverse
    ? "border-white/15 bg-white/5 text-white hover:bg-white/10"
    : "border-border bg-white text-foreground hover:bg-muted";

  const content = (
    <FocusTarget
      aria-busy={state === "loading" ? "true" : undefined}
      aria-labelledby={headingId}
      aria-live={state === "error" ? "assertive" : "polite"}
      className={panelClassName}
      role={state === "error" ? "alert" : "status"}
      targetId={focusId}
    >
      <p className={cn("text-eyebrow font-semibold", eyebrowClassName)}>{copy.eyebrow}</p>
      <h2 className="mt-3 text-section-title" id={headingId}>
        {copy.title}
      </h2>
      <p className={cn("mt-4 max-w-2xl text-body-default", subtleTextClassName)}>{copy.description}</p>

      {state === "loading" ? (
        <div aria-hidden="true" className="mt-6 space-y-3">
          <div className={cn("h-3 w-32 animate-pulse rounded-full", inverse ? "bg-white/15" : "bg-border")} />
          <div className={cn("h-3 w-full animate-pulse rounded-full", inverse ? "bg-white/10" : "bg-border")} />
          <div className={cn("h-3 w-5/6 animate-pulse rounded-full", inverse ? "bg-white/10" : "bg-border")} />
        </div>
      ) : null}

      {copy.statusMessage ? <p className="sr-only">{copy.statusMessage}</p> : null}

      {error?.digest ? (
        <p className={cn("mt-4 text-sm", subtleTextClassName)}>
          <span className="font-semibold">{copy.digestLabel}:</span> {error.digest}
        </p>
      ) : null}

      {state !== "loading" ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {state === "error" && onRetry ? (
            <button className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white" onClick={onRetry} type="button">
              {copy.retryLabel}
            </button>
          ) : null}
          <Link
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              secondaryButtonClassName,
            )}
            href={resolvedRecoveryHref}
          >
            {copy.recoveryLabel}
          </Link>
        </div>
      ) : null}
    </FocusTarget>
  );

  if (shell.variant === "admin-facing") {
    return <AdminShell areaLabel={shellChrome.areas[area]} helper={shellChrome.helper} locale={activeLocale} shell={shell}>{content}</AdminShell>;
  }

  return <UserShell areaLabel={shellChrome.areas[area]} helper={shellChrome.helper} locale={activeLocale} shell={shell}>{content}</UserShell>;
}


