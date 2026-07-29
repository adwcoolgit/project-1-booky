"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { LogoutButton } from "@/features/auth/components/logout-button";
import type { AppLocale } from "@/shared/i18n/config";
import { cn } from "@/shared/lib/utils";

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "h-6 w-6 shrink-0 text-neutral-950 transition-transform",
        open ? "rotate-180" : "",
      )}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function createInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "BK";
  }

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

type UserProfileMenuProps = {
  locale: AppLocale;
  displayName: string;
  labels: {
    profile: string;
    borrowedList: string;
    reviews: string;
    trigger: string;
  };
};

const MENU_ITEMS = [
  { key: "profile", href: "profile" },
  { key: "borrowedList", href: "borrowed" },
  { key: "reviews", href: "reviews" },
] as const;

export function UserProfileMenu({
  locale,
  displayName,
  labels,
}: UserProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();
  const initials = createInitials(displayName);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="relative" data-home-header-profile="true" ref={rootRef}>
      <button
        aria-controls={menuId}
        aria-expanded={open}
        className="flex min-w-0 items-center gap-4 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        data-home-header-profile-trigger="true"
        onClick={() => {
          setOpen((current) => !current);
        }}
        type="button"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-sm font-bold text-brand">
          {initials}
        </div>
        <p className="max-w-[5rem] truncate text-[18px] font-semibold leading-8 tracking-[-0.02em] text-neutral-950">
          {displayName}
        </p>
        <span className="shrink-0" data-home-header-profile-chevron="true">
          <ChevronDownIcon open={open} />
        </span>
        <span className="sr-only">{labels.trigger}</span>
      </button>

      {open ? (
        <div
          className="absolute right-0 top-full z-20 mt-xl flex w-[11.5rem] flex-col gap-xl rounded-2xl bg-white p-xl shadow-card"
          data-home-header-profile-menu="true"
          id={menuId}
        >
          {/* Menu items */}
          {MENU_ITEMS.map((item) => (
            <Link
              className="text-body-md font-semibold tracking-auth text-neutral-950 transition hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              href={`/${locale}/${item.href}`}
              key={item.key}
              onClick={() => {
                setOpen(false);
              }}
            >
              {labels[item.key]}
            </Link>
          ))}

          <LogoutButton
            className="h-auto w-full items-center justify-start rounded-none border-0 px-0 py-0 text-left text-body-md font-semibold tracking-auth text-danger hover:bg-transparent hover:text-danger"
            locale={locale}
            surface="user"
          />
        </div>
      ) : null}
    </div>
  );
}

