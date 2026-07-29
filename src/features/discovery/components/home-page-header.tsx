import Image from "next/image";
import Link from "next/link";

import { DiscoveryBagIcon } from "@/features/discovery/components/discovery-bag-icon";
import { UserProfileMenu } from "@/features/discovery/components/user-profile-menu";
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
      <div className="mx-auto flex w-full max-w-canvas flex-col gap-4 px-4 py-4 md:px-8 xl:min-h-[80px] xl:flex-row xl:items-center xl:justify-between xl:px-[120px] xl:py-[18px]">
        <Link className="flex shrink-0 items-center gap-[15px]" href={`/${locale}`}>
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

        {props.variant === "authenticated" ? (
          <>
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
            className="flex w-full items-center justify-end gap-3 sm:w-auto sm:gap-4"
            data-home-header-guest-actions="true"
          >
            <Link
              className="inline-flex h-12 min-w-[10.1875rem] items-center justify-center rounded-full border border-border bg-white px-4 text-base font-bold leading-[30px] tracking-[-0.02em] text-neutral-950 transition hover:bg-neutral-50"
              href={`/${locale}/login`}
            >
              {props.loginLabel}
            </Link>
            <Link
              className="inline-flex h-12 min-w-[10.1875rem] items-center justify-center rounded-full bg-brand px-4 text-base font-bold leading-[30px] tracking-[-0.02em] text-white transition hover:brightness-95"
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
