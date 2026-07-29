import type { AbstractIntlMessages } from "next-intl";

import sourceEnMessages from "../../../docs/source-of-truth/i18n/messages/en.json";
import sourceIdMessages from "../../../docs/source-of-truth/i18n/messages/id.json";
import authEnMessages from "@/shared/i18n/messages/en/auth.json";
import boundariesEnMessages from "@/shared/i18n/messages/en/boundaries.json";
import discoveryEnMessages from "@/shared/i18n/messages/en/discovery.json";
import foundationEnMessages from "@/shared/i18n/messages/en/foundation.json";
import authIdMessages from "@/shared/i18n/messages/id/auth.json";
import boundariesIdMessages from "@/shared/i18n/messages/id/boundaries.json";
import discoveryIdMessages from "@/shared/i18n/messages/id/discovery.json";
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

const boundaryMessages = {
  en: boundariesEnMessages,
  id: boundariesIdMessages,
} as const;

const discoveryFeatureMessages = {
  en: discoveryEnMessages,
  id: discoveryIdMessages,
} as const;

const authFeatureMessages = {
  en: authEnMessages,
  id: authIdMessages,
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

export type FoundationShellChromeMessages = {
  helper: string;
  skipToContent: string;
  areas: {
    public: string;
    user: string;
    admin: string;
  };
};

export type SourceMetadataMessages = (typeof sourceMessages)[AppLocale]["Metadata"];
export type SourceHomeMessages = (typeof sourceMessages)[AppLocale]["Home"];
export type SourceNavigationMessages = (typeof sourceMessages)[AppLocale]["Navigation"];
export type DiscoveryFeatureMessages = (typeof discoveryFeatureMessages)[AppLocale];
export type AuthFeatureMessages = (typeof authFeatureMessages)[AppLocale];
export type BoundaryMessages = (typeof boundaryMessages)[AppLocale];

export function getMessages(locale: AppLocale): AbstractIntlMessages {
  return {
    ...sourceMessages[locale],
    Boundaries: boundaryMessages[locale],
    Discovery: discoveryFeatureMessages[locale],
    Foundation: foundationMessages[locale],
    AuthFeature: authFeatureMessages[locale],
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

export function getFoundationShellChromeMessages(locale: AppLocale): FoundationShellChromeMessages {
  const foundation = foundationMessages[locale];

  return {
    helper: foundation.shell.helper,
    skipToContent: foundation.shell.skipToContent,
    areas: {
      public: foundation.shell.areas.public,
      user: foundation.shell.areas.user,
      admin: foundation.shell.areas.admin,
    },
  };
}

export function getAuthFeatureMessages(locale: AppLocale): AuthFeatureMessages {
  return authFeatureMessages[locale];
}

export function getBoundaryMessages(locale: AppLocale): BoundaryMessages {
  return boundaryMessages[locale];
}

export function getDiscoveryFeatureMessages(locale: AppLocale): DiscoveryFeatureMessages {
  return discoveryFeatureMessages[locale];
}

export function getSourceHomeMessages(locale: AppLocale): SourceHomeMessages {
  return sourceMessages[locale].Home;
}

export function getSourceNavigationMessages(locale: AppLocale): SourceNavigationMessages {
  return sourceMessages[locale].Navigation;
}

export function getSourceMetadataMessages(locale: AppLocale): SourceMetadataMessages {
  return sourceMessages[locale].Metadata;
}
