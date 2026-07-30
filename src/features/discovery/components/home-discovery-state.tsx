import Link from "next/link";

import { cn } from "@/shared/lib/utils";

export type HomeDiscoveryStateCopy = {
  loading: {
    title: string;
    description: string;
  };
  empty: {
    title: string;
    description: string;
  };
  error: {
    title: string;
    description: string;
    retry: string;
  };
  stale: {
    badge: string;
    description: string;
  };
};

export type HomeDiscoveryStateVariant = "loading" | "empty" | "error";

export type HomeDiscoveryStateProps = {
  state: HomeDiscoveryStateVariant;
  copy: HomeDiscoveryStateCopy;
  retryHref?: string | undefined;
  className?: string | undefined;
};

export function HomeDiscoveryState({ state, copy, retryHref, className }: HomeDiscoveryStateProps) {
  const variantCopy = copy[state];

  return (
    <div
      aria-busy={state === "loading" ? true : undefined}
      className={cn(
        "rounded-4xl border border-dashed border-border bg-white/90 p-5 shadow-sm",
        className,
      )}
      data-home-discovery-state={state}
      role={state === "error" ? "alert" : undefined}
    >
      {state === "loading" ? (
        <div aria-hidden="true" className="mb-4 space-y-3">
          <div className="h-4 w-28 rounded-full bg-muted" />
          <div className="h-10 rounded-3xl bg-muted/70" />
          <div className="h-20 rounded-3xl bg-muted/50" />
        </div>
      ) : null}
      <h3 className="text-lg font-semibold text-foreground">{variantCopy.title}</h3>
      <p className="mt-2 max-w-prose text-sm text-text-muted">{variantCopy.description}</p>
      {state === "error" && retryHref ? (
        <Link
          className="mt-4 inline-flex rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          href={retryHref}
        >
          {copy.error.retry}
        </Link>
      ) : null}
    </div>
  );
}

export function HomeDiscoveryStaleNotice({
  copy,
  className,
}: {
  copy: HomeDiscoveryStateCopy;
  className?: string | undefined;
}) {
  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      className={cn("mb-4 rounded-3xl border border-border bg-brand-subtle px-4 py-3", className)}
      role="status"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand">
          {copy.stale.badge}
        </span>
        <p className="text-sm text-foreground">{copy.stale.description}</p>
      </div>
    </div>
  );
}