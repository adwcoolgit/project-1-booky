import boundariesEnMessages from "@/shared/i18n/messages/en/boundaries.json";
import boundariesIdMessages from "@/shared/i18n/messages/id/boundaries.json";
import { defaultLocale, isSupportedLocale, type AppLocale } from "@/shared/i18n/config";
import type { BoundaryStateId } from "@/entities/boundary-state/model";

const boundaryMessages = {
  en: boundariesEnMessages,
  id: boundariesIdMessages,
} as const;

export type BoundaryErrorScope = "route" | "global";
export type BoundaryNotFoundReason = "generic" | "unsupported-locale";

export type BoundaryStateCopy = {
  eyebrow: string;
  title: string;
  description: string;
  statusMessage?: string;
  retryLabel?: string;
  recoveryLabel?: string;
  digestLabel?: string;
};

export function resolveBoundaryLocale(locale?: string): AppLocale {
  return locale && isSupportedLocale(locale) ? locale : defaultLocale;
}

export function getBoundaryStateMessages(locale: AppLocale) {
  return boundaryMessages[locale];
}

export function getBoundaryStateCopy(
  locale: AppLocale,
  state: BoundaryStateId,
  options: { errorScope?: BoundaryErrorScope; notFoundReason?: BoundaryNotFoundReason } = {},
): BoundaryStateCopy {
  const messages = boundaryMessages[locale];

  switch (state) {
    case "loading":
      return {
        eyebrow: messages.loading.eyebrow,
        title: messages.loading.title,
        description: messages.loading.description,
        statusMessage: messages.loading.status,
      };
    case "error": {
      const group = options.errorScope === "global" ? messages.globalError : messages.error;

      return {
        eyebrow: group.eyebrow,
        title: group.title,
        description: group.description,
        retryLabel: group.retry,
        recoveryLabel: group.recovery,
        digestLabel: group.digestLabel,
      };
    }
    case "not-found":
      return {
        eyebrow: messages.notFound.eyebrow,
        title: messages.notFound.title,
        description:
          options.notFoundReason === "unsupported-locale"
            ? messages.notFound.unsupportedLocaleDescription
            : messages.notFound.description,
        recoveryLabel: messages.notFound.recovery,
      };
  }
}

export function getBoundaryRecoveryHref(locale: AppLocale) {
  return `/${locale}/foundation/public`;
}
