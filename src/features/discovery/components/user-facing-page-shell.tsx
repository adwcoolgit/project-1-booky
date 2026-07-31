import type { ReactNode } from "react";

import { HomePageFooter } from "@/features/discovery/components/home-page-footer";
import { HomePageHeader } from "@/features/discovery/components/home-page-header";
import type { AppLocale } from "@/shared/i18n/config";
import { getAuthFeatureMessages, getDiscoveryFeatureMessages, getSourceNavigationMessages } from "@/shared/i18n/get-messages";
import { cn } from "@/shared/lib/utils";

const defaultBrandLabel = "Booky";

type UserFacingPageShellBaseProps = {
  locale: AppLocale;
  children: ReactNode;
  brandLabel?: string | undefined;
  mainClassName?: string | undefined;
  contentClassName?: string | undefined;
};

type AuthenticatedUserFacingPageShellProps = UserFacingPageShellBaseProps & {
  variant: "authenticated";
  displayName: string;
  searchActionHref?: string | undefined;
  searchDefaultValue?: string | undefined;
  searchHiddenFields?: Record<string, string | number | null | undefined> | undefined;
};

type GuestUserFacingPageShellProps = UserFacingPageShellBaseProps & {
  variant: "guest";
};

export type UserFacingPageShellProps =
  | AuthenticatedUserFacingPageShellProps
  | GuestUserFacingPageShellProps;

export function UserFacingPageShell({
  locale,
  children,
  brandLabel = defaultBrandLabel,
  mainClassName,
  contentClassName,
  ...props
}: UserFacingPageShellProps) {
  const auth = getAuthFeatureMessages(locale);
  const discovery = getDiscoveryFeatureMessages(locale);
  const navigation = getSourceNavigationMessages(locale);
  const filters = discovery.results.filters;

  return (
    <div className="min-h-screen bg-white text-foreground">
      {props.variant === "authenticated" ? (
        <HomePageHeader
          borrowedListLabel={navigation.borrowedList}
          brandLabel={brandLabel}
          cartLabel={navigation.cart}
          displayName={props.displayName}
          locale={locale}
          profileLabel={navigation.profile}
          profileMenuLabel={discovery.home.profileMenu.trigger}
          reviewsLabel={navigation.reviews}
          searchActionHref={props.searchActionHref}
          searchDefaultValue={props.searchDefaultValue}
          searchHiddenFields={props.searchHiddenFields}
          searchLabel={filters.searchLabel}
          searchPlaceholder={filters.searchPlaceholder}
          variant="authenticated"
        />
      ) : (
        <HomePageHeader
          brandLabel={brandLabel}
          locale={locale}
          loginLabel={auth.login.heading}
          registerLabel={auth.register.heading}
          searchLabel={filters.searchLabel}
          searchPlaceholder={filters.searchPlaceholder}
          variant="guest"
        />
      )}

      <main
        className={cn("px-4 py-8 md:px-8 md:py-12 xl:px-[120px]", mainClassName)}
        id="main-content"
        tabIndex={-1}
      >
        <div className={cn("mx-auto flex w-full max-w-[75rem] flex-col gap-10", contentClassName)}>
          {children}
        </div>
      </main>

      <HomePageFooter
        brandLabel={brandLabel}
        description={discovery.home.footer}
        locale={locale}
        socialLabel={discovery.home.actions.socialLabel}
      />
    </div>
  );
}
