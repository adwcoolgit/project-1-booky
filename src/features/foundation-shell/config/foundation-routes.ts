import type { FoundationArea } from "@/entities/app-shell/model";
import { buildFoundationMetadata } from "@/entities/app-shell/model";
import { buildFoundationRouteMap, getFoundationRoute } from "@/entities/locale-route/model";
import type { FoundationShellMessages } from "@/shared/i18n/get-messages";
import type { AppLocale } from "@/shared/i18n/config";

export type FoundationMessages = FoundationShellMessages;

export function createShellDefinition(locale: AppLocale, area: FoundationArea, messages: FoundationMessages) {
  const route = getFoundationRoute(area);

  return {
    area,
    variant: route.variant,
    badge: messages.badge[route.variant],
    title: messages.routeTitles[area],
    description: messages.routeDescriptions[area],
    navigation: buildFoundationRouteMap(locale, messages.navigation),
  };
}

export function createFoundationMetadata(area: FoundationArea, messages: FoundationMessages) {
  return buildFoundationMetadata({
    appTitle: messages.appTitle,
    appDescription: messages.appDescription,
    pageTitle: messages.routeTitles[area],
    pageDescription: messages.routeDescriptions[area],
  });
}
