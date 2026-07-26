import type { AppLocale } from "@/shared/i18n/config";
import {
  buildFoundationHref,
  foundationAreas,
  type AppShellVariantId,
  type FoundationArea,
} from "@/entities/app-shell/model";

export type FoundationRouteDefinition = {
  area: FoundationArea;
  pathPattern: `/{locale}/foundation/${FoundationArea}`;
  variant: AppShellVariantId;
  isPlaceholder: true;
};

export const foundationRoutes: FoundationRouteDefinition[] = [
  {
    area: "public",
    pathPattern: "/{locale}/foundation/public",
    variant: "user-facing",
    isPlaceholder: true,
  },
  {
    area: "user",
    pathPattern: "/{locale}/foundation/user",
    variant: "user-facing",
    isPlaceholder: true,
  },
  {
    area: "admin",
    pathPattern: "/{locale}/foundation/admin",
    variant: "admin-facing",
    isPlaceholder: true,
  },
];

export function getFoundationRoute(area: FoundationArea): FoundationRouteDefinition {
  const route = foundationRoutes.find((entry) => entry.area === area);

  if (!route) {
    throw new Error(`Unsupported foundation area: ${area}`);
  }

  return route;
}

export function buildFoundationRouteMap(locale: AppLocale, labels: Record<FoundationArea, string>) {
  return foundationAreas.map((area) => ({
    area,
    href: buildFoundationHref(locale, area),
    label: labels[area],
  }));
}
