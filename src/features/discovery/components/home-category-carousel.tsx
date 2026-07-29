"use client";

import { useEffect, useRef, useState } from "react";

import { CategoryCard, type CategoryPresentation } from "@/entities/category";
import { cn } from "@/shared/lib/utils";

export type HomeCategoryCarouselProps = {
  categories: CategoryPresentation[];
  labelledById: string;
  controlsLabel?: string | undefined;
  className?: string | undefined;
};

const EDGE_TOLERANCE = 4;

function resolveScrollStep(scroller: HTMLUListElement) {
  const firstSlide = scroller.querySelector<HTMLElement>("[data-home-category-slide='true']");
  const computedStyle = window.getComputedStyle(scroller);
  const gap = Number.parseFloat(computedStyle.columnGap || computedStyle.gap || "0");

  return (firstSlide?.offsetWidth ?? scroller.clientWidth * 0.82) + gap;
}

function ChevronLeftIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M15 6L9 12L15 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M9 6L15 12L9 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

export function HomeCategoryCarousel({
  categories,
  labelledById,
  controlsLabel,
  className,
}: HomeCategoryCarouselProps) {
  const scrollerRef = useRef<HTMLUListElement | null>(null);
  const targetScrollLeftRef = useRef(0);
  const [controls, setControls] = useState({
    hasOverflow: false,
    canScrollPrev: false,
    canScrollNext: false,
  });

  const updateControls = () => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const maxScrollLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);

    setControls({
      hasOverflow: maxScrollLeft > EDGE_TOLERANCE,
      canScrollPrev: scroller.scrollLeft > EDGE_TOLERANCE,
      canScrollNext: scroller.scrollLeft < maxScrollLeft - EDGE_TOLERANCE,
    });
  };

  const scrollToTarget = (nextTarget: number) => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    targetScrollLeftRef.current = nextTarget;
    scroller.scrollTo({
      left: nextTarget,
      behavior: "smooth",
    });
    requestAnimationFrame(updateControls);
  };

  const scrollByDirection = (direction: 1 | -1) => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return false;
    }

    const step = resolveScrollStep(scroller);
    const maxScrollLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const baseScrollLeft =
      Math.abs(scroller.scrollLeft - targetScrollLeftRef.current) > 1
        ? targetScrollLeftRef.current
        : scroller.scrollLeft;
    const nextTarget = Math.min(
      maxScrollLeft,
      Math.max(0, baseScrollLeft + direction * step),
    );

    if (Math.abs(nextTarget - baseScrollLeft) <= 1) {
      return false;
    }

    scrollToTarget(nextTarget);
    return true;
  };

  useEffect(() => {
    const syncControls = () => requestAnimationFrame(updateControls);

    syncControls();
    window.addEventListener("resize", syncControls);

    const scroller = scrollerRef.current;
    const resizeObserver =
      typeof ResizeObserver !== "undefined" && scroller
        ? new ResizeObserver(syncControls)
        : null;

    if (resizeObserver && scroller) {
      resizeObserver.observe(scroller);
    }

    return () => {
      window.removeEventListener("resize", syncControls);
      resizeObserver?.disconnect();
    };
  }, [categories.length]);

  return (
    <div className={cn("relative", className)}>
      {controls.hasOverflow ? (
        <div className="mb-4 flex items-center justify-between gap-4" data-home-categories-controls="true">
          <div className="min-w-0">
            {controlsLabel ? (
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-text-muted">
                {controlsLabel}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Scroll categories left"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-neutral-950 shadow-sm transition hover:bg-muted disabled:cursor-default disabled:opacity-40"
              disabled={!controls.canScrollPrev}
              onClick={() => {
                scrollByDirection(-1);
              }}
              type="button"
            >
              <ChevronLeftIcon />
            </button>
            <button
              aria-label="Scroll categories right"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-neutral-950 shadow-sm transition hover:bg-muted disabled:cursor-default disabled:opacity-40"
              disabled={!controls.canScrollNext}
              onClick={() => {
                scrollByDirection(1);
              }}
              type="button"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      ) : null}

      <ul
        aria-labelledby={labelledById}
        className="flex gap-4 overflow-x-auto overscroll-x-contain overscroll-y-contain scroll-smooth pb-2 pr-1 snap-x snap-mandatory touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        data-home-categories-carousel="true"
        data-home-categories-grid="true"
        onScroll={() => {
          const scroller = scrollerRef.current;

          if (!scroller) {
            return;
          }

          if (Math.abs(scroller.scrollLeft - targetScrollLeftRef.current) <= 1) {
            targetScrollLeftRef.current = scroller.scrollLeft;
          }

          updateControls();
        }}
        onWheelCapture={(event) => {
          const scroller = scrollerRef.current;

          if (!scroller || event.shiftKey) {
            return;
          }

          const hasHorizontalOverflow = scroller.scrollWidth > scroller.clientWidth;
          const dominantDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX)
            ? event.deltaY
            : event.deltaX;

          if (!hasHorizontalOverflow || dominantDelta === 0) {
            return;
          }

          const didScroll = scrollByDirection(dominantDelta > 0 ? 1 : -1);

          if (!didScroll) {
            return;
          }

          event.preventDefault();
          event.stopPropagation();
        }}
        ref={scrollerRef}
        tabIndex={0}
      >
        {categories.map((category) => (
          <li
            className="min-w-0 shrink-0 snap-start basis-[14rem] sm:basis-[13.5rem] lg:basis-[13rem] xl:basis-[13rem]"
            data-home-category-slide="true"
            key={category.id}
          >
            <CategoryCard category={category} className="h-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}