import type { AbstractIntlMessages } from "next-intl";
import type { ReactElement, ReactNode } from "react";

import { render, type RenderOptions } from "@testing-library/react";

import { defaultLocale, type AppLocale } from "@/shared/i18n/config";
import { AppProviders } from "@/shared/providers/app-providers";

const defaultMessages = {} as AbstractIntlMessages;

type ProvidersOptions = RenderOptions & {
  locale?: AppLocale;
  messages?: AbstractIntlMessages;
};

export function renderWithProviders(
  ui: ReactElement,
  { locale = defaultLocale, messages = defaultMessages, ...options }: ProvidersOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AppProviders locale={locale} messages={messages}>
        {children}
      </AppProviders>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}
