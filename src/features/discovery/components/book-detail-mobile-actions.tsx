"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { BookDetailHeroAction } from "@/features/discovery/components/book-detail-hero";
import { cn } from "@/shared/lib/utils";

const REVIEW_SECTION_ID = "book-review-section";

function renderBookDetailAction(
  action: BookDetailHeroAction,
  className: string,
) {
  const buttonClassName = cn(
    className,
    action.variant === "solid"
      ? "bg-brand text-white hover:brightness-95"
      : "border border-border bg-white text-neutral-950 hover:bg-neutral-50",
    action.disabled ? "pointer-events-none cursor-default" : null,
  );

  if (action.href && !action.disabled) {
    return (
      <Link className={buttonClassName} href={action.href} key={action.label}>
        {action.label}
      </Link>
    );
  }

  return (
    <button
      className={buttonClassName}
      disabled={action.disabled}
      key={action.label}
      type="button"
    >
      {action.label}
    </button>
  );
}

export function BookDetailMobileActions({
  actions,
}: {
  actions: readonly BookDetailHeroAction[];
}) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const reviewSection = document.getElementById(REVIEW_SECTION_ID);

    if (!reviewSection) {
      return undefined;
    }

    const syncVisibility = () => {
      const rect = reviewSection.getBoundingClientRect();
      const nextShouldShow = rect.top >= window.innerHeight;

      setShouldShow((previousValue) =>
        previousValue === nextShouldShow ? previousValue : nextShouldShow,
      );
    };

    syncVisibility();
    window.addEventListener("scroll", syncVisibility, { passive: true });
    window.addEventListener("resize", syncVisibility);

    return () => {
      window.removeEventListener("scroll", syncVisibility);
      window.removeEventListener("resize", syncVisibility);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-white/95 shadow-[0_0_20px_rgba(203,202,202,0.25)] backdrop-blur-sm transition duration-200 lg:hidden",
        shouldShow
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0",
      )}
      data-book-detail-mobile-actions="true"
    >
      <div className="mx-auto w-full max-w-[75rem] px-4 py-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:px-6 md:px-8">
        <div className="flex items-start gap-3">
          {actions.map((action) =>
            renderBookDetailAction(
              action,
              "inline-flex h-10 flex-1 items-center justify-center rounded-full px-2 text-sm font-bold leading-7 tracking-[-0.02em] transition sm:h-11 sm:px-3",
            ),
          )}
        </div>
      </div>
    </div>
  );
}