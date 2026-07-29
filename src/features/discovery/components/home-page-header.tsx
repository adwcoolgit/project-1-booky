import Image from "next/image";
import Link from "next/link";

import { DiscoveryBagIcon } from "@/features/discovery/components/discovery-bag-icon";
import { UserProfileMenu } from "@/features/discovery/components/user-profile-menu";
import { LocaleSwitcher } from "@/features/foundation-shell";
import type { AppLocale } from "@/shared/i18n/config";
import { cn } from "@/shared/lib/utils";

function SearchIcon({ className = "h-5 w-5" }: { className?: string | undefined }) {
  return (
    <svg
      aria-hidden="true"
      className={cn(className, "shrink-0")}
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

type HomePageHeaderBaseProps = {
  locale: AppLocale;
  brandLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
};

type AuthenticatedHomePageHeaderProps = HomePageHeaderBaseProps & {
  variant: "authenticated";
  displayName: string;
  profileLabel: string;
  borrowedListLabel: string;
  reviewsLabel: string;
  profileMenuLabel: string;
  cartCount?: number;
};

type GuestHomePageHeaderProps = HomePageHeaderBaseProps & {
  variant: "guest";
  loginLabel: string;
  registerLabel: string;
};

type HomePageHeaderProps = AuthenticatedHomePageHeaderProps | GuestHomePageHeaderProps;

export function HomePageHeader({
  locale,
  brandLabel,
  searchLabel,
  searchPlaceholder,
  ...props
}: HomePageHeaderProps) {
  const cartBadgeLabel =
    props.variant === "authenticated" &&
    typeof props.cartCount === "number" &&
    props.cartCount > 0
      ? String(Math.min(props.cartCount, 99))
      : null;

  return (
    <header className="home-card-shadow border-b border-border bg-white">
      <div
        className={cn(
          "mx-auto w-full max-w-canvas",
          props.variant === "authenticated"
            ? "flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-3.5 md:px-8 lg:min-h-[72px] lg:px-10 lg:py-4 xl:min-h-[80px] xl:px-[120px] xl:py-[18px]"
            : "flex flex-col gap-4 px-4 py-4 sm:px-6 md:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-4 xl:min-h-[80px] xl:px-[120px] xl:py-[18px]",
        )}
      >
        <Link className="flex shrink-0 items-center gap-[15px]" href={`/${locale}`}>
          <Image
            alt=""
            aria-hidden="true"
            className="h-10 w-10 lg:h-[42px] lg:w-[42px]"
            height={42}
            priority
            src="/assets/logo.svg"
            width={42}
          />
          <span
            className={cn(
              "font-display text-[32px] font-bold leading-[42px] text-neutral-950",
              props.variant === "authenticated" ? "hidden lg:inline" : "inline",
            )}
          >
            {brandLabel}
          </span>
        </Link>

        {props.variant === "authenticated" ? (
          <>
            <form
              action={`/${locale}/books`}
              className="hidden w-full max-w-[22rem] items-center gap-[6px] rounded-full border border-border bg-white px-4 py-2 lg:flex xl:max-w-[31.25rem]"
            >
              <SearchIcon className="h-5 w-5 text-neutral-600" />
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

            <div className="flex items-center gap-4 sm:gap-5 lg:gap-6">
              <LocaleSwitcher className="hidden shrink-0 lg:block" />

              <div className="flex items-center gap-4 sm:gap-5 lg:gap-6" data-home-header-user-actions="true">
                <Link
                  aria-label={searchLabel}
                  className="inline-flex h-6 w-6 items-center justify-center text-neutral-950 lg:hidden"
                  href={`/${locale}/books`}
                >
                  <SearchIcon className="h-6 w-6 text-neutral-950" />
                </Link>

                <div className="relative shrink-0" data-home-header-bag="true">
                  <DiscoveryBagIcon className="h-7 w-7 text-neutral-950 sm:h-[1.875rem] sm:w-[1.875rem] lg:h-8 lg:w-8" />
                  {cartBadgeLabel ? (
                    <span className="absolute left-3 top-0 inline-flex h-5 min-w-5 -translate-y-1/2 items-center justify-center rounded-full bg-danger px-[5px] text-[12px] font-bold leading-[23px] tracking-[-0.02em] text-white lg:left-[18px] lg:top-[7px] lg:translate-y-0">
                      {cartBadgeLabel}
                    </span>
                  ) : null}
                </div>

                <UserProfileMenu
                  displayName={props.displayName}
                  labels={{
                    profile: props.profileLabel,
                    borrowedList: props.borrowedListLabel,
                    reviews: props.reviewsLabel,
                    trigger: props.profileMenuLabel,
                  }}
                  locale={locale}
                />
              </div>
            </div>
          </>
        ) : (
          <div
            className="flex w-full items-center justify-end gap-3 sm:gap-4 lg:w-auto"
            data-home-header-guest-actions="true"
          >
            <Link
              className="inline-flex h-12 min-w-[9rem] items-center justify-center rounded-full border border-border bg-white px-4 text-base font-bold leading-[30px] tracking-[-0.02em] text-neutral-950 transition hover:bg-neutral-50 sm:min-w-[10.1875rem]"
              href={`/${locale}/login`}
            >
              {props.loginLabel}
            </Link>
            <Link
              className="inline-flex h-12 min-w-[9rem] items-center justify-center rounded-full bg-brand px-4 text-base font-bold leading-[30px] tracking-[-0.02em] text-white transition hover:brightness-95 sm:min-w-[10.1875rem]"
              href={`/${locale}/register`}
            >
              {props.registerLabel}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
