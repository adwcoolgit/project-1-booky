import type { AxiosInstance, CreateAxiosDefaults } from "axios";

import { createHttpClient } from "@/shared/api/http-client";
import type { AppLocale } from "@/shared/i18n/config";

export function createDiscoveryApiClient(
  locale?: AppLocale,
  config: CreateAxiosDefaults = {},
): AxiosInstance {
  return createHttpClient(locale, config);
}

export * from "@/features/discovery/api/authors";
export * from "@/features/discovery/api/books";
export * from "@/features/discovery/api/categories";
export * from "@/features/discovery/api/recommendations";
export * from "@/features/discovery/api/reviews";
export * from "@/features/discovery/api/schemas";