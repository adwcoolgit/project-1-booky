import { getDiscoveryFeatureMessages } from "@/shared/i18n/get-messages";
import type { AppLocale } from "@/shared/i18n/config";

export function createDiscoverySearchFormCopy(locale: AppLocale) {
  const discovery = getDiscoveryFeatureMessages(locale).results;

  return {
    filters: discovery.filters,
    criteria: discovery.criteria,
    pagination: discovery.pagination,
    states: discovery.states,
  };
}
