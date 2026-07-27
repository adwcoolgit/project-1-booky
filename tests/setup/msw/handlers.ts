import { http, HttpResponse } from "msw";

import { runtimeConfig } from "@/shared/config/runtime";
import { isSupportedLocale } from "@/shared/i18n/config";
import {
  createFoundationHealthFixture,
  foundationConflictMessage,
} from "@/../tests/fixtures/foundation/shell-fixtures";
import { foundationSourceArtifactsFixture } from "@/../tests/fixtures/foundation/source-artifacts";
import {
  authTestCredentials,
  createLoginResponseFixture,
  createOpaqueSessionToken,
  recordLoginPayload,
  recordRegisterPayload,
} from "@/../tests/fixtures/auth/auth-fixtures";
import {
  protectedAdminProfileFixture,
  protectedForbiddenMessage,
  protectedForbiddenToken,
  protectedProfileFixture,
  protectedUnauthorizedMessage,
  protectedUnauthorizedToken,
} from "@/../tests/fixtures/auth/protected-route-fixtures";

const foundationBaseUrl = runtimeConfig.apiBaseUrl;
const authBaseUrl = runtimeConfig.apiBaseUrl;

const authHandlers = [
  http.post(`${authBaseUrl}/auth/register`, async ({ request }) => {
    const payload = (await request.json()) as Record<string, unknown>;

    recordRegisterPayload(payload);

    if (payload.email === authTestCredentials.duplicateRegisterEmail) {
      return HttpResponse.text("Duplicate email.", { status: 400 });
    }

    return HttpResponse.json({ ok: true }, { status: 201 });
  }),
  http.post(`${authBaseUrl}/auth/login`, async ({ request }) => {
    const payload = (await request.json()) as Record<string, unknown>;

    recordLoginPayload(payload);

    if (
      payload.email === authTestCredentials.admin.email &&
      payload.password === authTestCredentials.admin.password
    ) {
      return HttpResponse.json(createLoginResponseFixture("ADMIN"));
    }

    if (
      payload.email === authTestCredentials.user.email &&
      payload.password === authTestCredentials.user.password
    ) {
      return HttpResponse.json(createLoginResponseFixture("USER"));
    }

    return HttpResponse.text("Unauthorized", { status: 401 });
  }),
  http.get(`${authBaseUrl}/me`, ({ request }) => {
    const authorizationHeader = request.headers.get("authorization");
    const token = authorizationHeader?.replace(/^Bearer\s+/i, "") ?? null;

    if (!token || token === protectedUnauthorizedToken) {
      return HttpResponse.text(protectedUnauthorizedMessage, { status: 401 });
    }

    if (token === createOpaqueSessionToken("ADMIN")) {
      return HttpResponse.json(protectedAdminProfileFixture);
    }

    if (token === createOpaqueSessionToken("USER")) {
      return HttpResponse.json(protectedProfileFixture);
    }

    if (token === protectedForbiddenToken) {
      return HttpResponse.text(protectedForbiddenMessage, { status: 403 });
    }

    return HttpResponse.text(protectedUnauthorizedMessage, { status: 401 });
  }),
];

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
  ...authHandlers,
];
