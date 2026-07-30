import "server-only";

import { redirect } from "next/navigation";

import { executeProtectedServerRequest } from "@/shared/api/server/authenticated-client";
import { resolveProtectedRequestFailure } from "@/shared/auth/guards";
import { resolveProtectedProfileFixture } from "@/shared/auth/protected-profile-fixture";
import { readSessionEnvelope } from "@/shared/auth/session.server";
import type { AuthenticatedSession } from "@/shared/auth/session-schema";
import { runtimeConfig } from "@/shared/config/runtime";
import type { AppLocale } from "@/shared/i18n/config";

type UserProfileSummary = {
  name?: string;
  email?: string;
};

export async function readDiscoveryAuthenticatedDisplayName({
  locale,
  currentPath,
  session,
}: {
  locale: AppLocale;
  currentPath: string;
  session: AuthenticatedSession;
}) {
  const protectedProfile = runtimeConfig.authE2eFixtureMode
    ? resolveProtectedProfileFixture(await readSessionEnvelope())
    : await executeProtectedServerRequest(
        async (client) => (await client.get<UserProfileSummary>("/me")).data,
        locale,
      );

  if (protectedProfile.status === "failure") {
    const failure = resolveProtectedRequestFailure({
      error: protectedProfile.error,
      pathname: currentPath,
      locale,
      returnTo: currentPath,
      loginSurface: "user",
    });

    if (failure.redirectPath) {
      redirect(failure.redirectPath);
    }

    throw protectedProfile.error;
  }

  return protectedProfile.data.name ?? session.displayName ?? session.email;
}
