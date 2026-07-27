import { http, HttpResponse } from "msw";

import { runtimeConfig } from "@/shared/config/runtime";
import { isSupportedLocale } from "@/shared/i18n/config";
import {
  createFoundationHealthFixture,
  foundationConflictMessage,
} from "@/../tests/fixtures/foundation/shell-fixtures";
import { foundationSourceArtifactsFixture } from "@/../tests/fixtures/foundation/source-artifacts";

const foundationBaseUrl = runtimeConfig.apiBaseUrl;

export const handlers = [
  http.get(`${foundationBaseUrl}/__foundation__/health`, ({ request }) => {
    const requestLocale = request.headers.get("accept-language");
    const locale = requestLocale && isSupportedLocale(requestLocale) ? requestLocale : undefined;

    return HttpResponse.json(createFoundationHealthFixture(locale));
  }),
  http.get(`${foundationBaseUrl}/__foundation__/source-artifacts`, () => {
    return HttpResponse.json(foundationSourceArtifactsFixture);
  }),
  http.get(`${foundationBaseUrl}/__foundation__/conflict`, () => {
    return HttpResponse.text(foundationConflictMessage, { status: 409 });
  }),
];
