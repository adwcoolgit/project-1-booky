import type { Metadata } from "next";

import type { AppLocale } from "@/shared/i18n/config";

export const foundationAreas = ["public", "user", "admin"] as const;
export const appShellVariants = ["user-facing", "admin-facing"] as const;

export type FoundationArea = (typeof foundationAreas)[number];
export type AppShellVariantId = (typeof appShellVariants)[number];

export type AppShellNavigationItem = {
  area: FoundationArea;
  href: string;
  label: string;
};

export type AppShellDefinition = {
  area: FoundationArea;
  variant: AppShellVariantId;
  badge: string;
  title: string;
  description: string;
  navigation: AppShellNavigationItem[];
};

export type FoundationMetadataInput = {
  appTitle: string;
  appDescription: string;
  pageTitle: string;
  pageDescription: string;
};

export function buildFoundationHref(locale: AppLocale, area: FoundationArea): string {
  return `/${locale}/foundation/${area}`;
}

export function buildFoundationMetadata({
  appTitle,
  appDescription,
  pageTitle,
  pageDescription,
}: FoundationMetadataInput): Metadata {
  return {
    title: `${pageTitle} | ${appTitle}`,
    description: pageDescription || appDescription,
  };
}
