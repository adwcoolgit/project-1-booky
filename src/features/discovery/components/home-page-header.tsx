import Image from "next/image";
import Link from "next/link";
import { DiscoveryBagIcon } from "@/features/discovery/components/discovery-bag-icon";

import { LogoutButton } from "@/features/auth/components/logout-button";
import { LocaleSwitcher } from "@/features/foundation-shell";
import type { AppLocale } from "@/shared/i18n/config";

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0 text-neutral-600"
      fill="none"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m14.166 14.167 3.334 3.333"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M16.667 8.333a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}


function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6 text-neutral-950"
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

type HomePageHeaderProps = {
  locale: AppLocale;
  brandLabel: string;
  displayName: string;
  searchLabel: string;
  searchPlaceholder: string;
  cartCount?: number;
};

export function HomePageHeader({
  locale,
  brandLabel,
  displayName,
  searchLabel,
  searchPlaceholder,
  cartCount,
}: HomePageHeaderProps) {
  const initials = createInitials(displayName);
  const hasCartBadge = typeof cartCount === "number" && cartCount > 0;
  const cartBadgeLabel = hasCartBadge ? String(Math.min(cartCount, 99)) : null;

  return (
    <header className="home-card-shadow border-b border-border bg-white">
      <div className="mx-auto flex w-full max-w-canvas flex-col gap-4 px-4 py-4 md:px-8 xl:min-h-[80px] xl:flex-row xl:items-center xl:justify-between xl:px-[120px] xl:py-[18px]">
        <Link
          className="flex shrink-0 items-center gap-[15px]"
          href={`/${locale}`}
        >
          <Image
            alt=""
            aria-hidden="true"
            height={42}
            priority
            src="/assets/logo.svg"
            width={42}
          />
          <span className="font-display text-[32px] font-bold leading-[42px] text-neutral-950">
            {brandLabel}
          </span>
        </Link>

        <form
          action={`/${locale}/books`}
          className="order-3 flex w-full max-w-[500px] items-center gap-[6px] rounded-full border border-border bg-white px-4 py-2 xl:order-none"
        >
          <SearchIcon />
          <input
            aria-label={searchLabel}
            className="w-full border-0 bg-transparent text-sm font-medium leading-7 tracking-[-0.03em] text-foreground placeholder:text-neutral-600 focus:outline-none"
            name="q"
            placeholder={searchPlaceholder}
            type="search"
          />
          <button className="sr-only" type="submit">
            {searchLabel}
          </button>
        </form>

        <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:w-auto sm:justify-end sm:gap-4 xl:flex-nowrap">
          <LocaleSwitcher className="shrink-0" />

          <div className="flex items-center gap-6" data-home-header-user-actions="true">
            <div className="relative shrink-0" data-home-header-bag="true">
              <DiscoveryBagIcon className="h-8 w-8 text-neutral-950" />
              {cartBadgeLabel ? (
                <span className="absolute left-[18px] top-[7px] inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-[5px] text-[12px] font-bold leading-[23px] tracking-[-0.02em] text-white">
                  {cartBadgeLabel}
                </span>
              ) : null}
            </div>

            <div className="flex min-w-0 items-center gap-4" data-home-header-profile="true">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-sm font-bold text-brand">
                {initials}
              </div>
              <p className="max-w-[5rem] truncate text-[18px] font-semibold leading-8 tracking-[-0.02em] text-neutral-950">
                {displayName}
              </p>
              <span className="shrink-0" data-home-header-profile-chevron="true">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          <LogoutButton
            className="inline-flex h-12 rounded-full px-5 text-base font-bold leading-[30px] tracking-[-0.02em] xl:hidden"
            locale={locale}
            surface="user"
          />
        </div>
      </div>
    </header>
  );
}