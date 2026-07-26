import type { AbstractIntlMessages } from "next-intl";

import sourceEnMessages from "../../../docs/source-of-truth/i18n/messages/en.json";
import sourceIdMessages from "../../../docs/source-of-truth/i18n/messages/id.json";
import foundationEnMessages from "@/shared/i18n/messages/en/foundation.json";
import foundationIdMessages from "@/shared/i18n/messages/id/foundation.json";
import type { AppLocale } from "@/shared/i18n/config";

const sourceMessages = {
  en: sourceEnMessages,
  id: sourceIdMessages,
} as const;

const foundationMessages = {
  en: foundationEnMessages,
  id: foundationIdMessages,
} as const;

export type FoundationShellMessages = {
  appTitle: string;
  appDescription: string;
  badge: {
    "user-facing": string;
    "admin-facing": string;
  };
  routeTitles: {
    public: string;
    user: string;
    admin: string;
  };
  routeDescriptions: {
    public: string;
    user: string;
    admin: string;
  };
  navigation: {
    public: string;
    user: string;
    admin: string;
  };
};

export function getMessages(locale: AppLocale): AbstractIntlMessages {
  return {
    ...sourceMessages[locale],
    Foundation: foundationMessages[locale],
  } satisfies AbstractIntlMessages;
}

export function getFoundationShellMessages(locale: AppLocale): FoundationShellMessages {
  const source = sourceMessages[locale];
  const foundation = foundationMessages[locale];

  return {
    appTitle: source.Metadata.appTitle,
    appDescription: source.Metadata.appDescription,
    badge: {
      "user-facing": foundation.shell.userBadge,
      "admin-facing": foundation.shell.adminBadge,
    },
    routeTitles: {
      public: foundation.routes.public.title,
      user: foundation.routes.user.title,
      admin: foundation.routes.admin.title,
    },
    routeDescriptions: {
      public: foundation.routes.public.description,
      user: foundation.routes.user.description,
      admin: foundation.routes.admin.description,
    },
    navigation: {
      public: foundation.shell.navigation.public,
      user: foundation.shell.navigation.user,
      admin: foundation.shell.navigation.admin,
    },
  };
}
