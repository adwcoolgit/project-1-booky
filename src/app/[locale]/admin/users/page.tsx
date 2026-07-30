import { redirect } from "next/navigation";

import { LogoutButton } from "@/features/auth/components/logout-button";
import { readRouteGuardResult } from "@/features/auth/config/auth-routes";
import { executeProtectedServerRequest } from "@/shared/api/server/authenticated-client";
import { resolveProtectedRequestFailure } from "@/shared/auth/guards";
import { readSessionEnvelope } from "@/shared/auth/session.server";
import { resolveProtectedProfileFixture } from "@/shared/auth/protected-profile-fixture";
import { runtimeConfig } from "@/shared/config/runtime";
import { resolveLocale } from "@/shared/i18n/config";
import { getBoundaryMessages } from "@/shared/i18n/get-messages";

type AdminProfileSummary = {
  name?: string;
  email?: string;
  activeLoanCount?: number;
};

function serializeSearchParams(searchParams: Record<string, string | string[] | undefined>): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (!value) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const entry of value) {
        params.append(key, entry);
      }
      continue;
    }

    params.set(key, value);
  }

  return params.toString();
}

export default async function AdminUsersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: rawLocale } = await params;
  const resolvedSearchParams = await searchParams;
  const locale = resolveLocale(rawLocale);
  const pathname = `/${locale}/admin/users`;
  const serializedSearch = serializeSearchParams(resolvedSearchParams);
  const currentPath = serializedSearch ? `${pathname}?${serializedSearch}` : pathname;
  const guard = await readRouteGuardResult({
    pathname,
    locale,
    returnTo: currentPath,
  });

  if (guard.redirectPath) {
    redirect(guard.redirectPath);
  }

  if (guard.session.status !== "authenticated") {
    throw new Error("Expected authenticated session after admin route guard.");
  }

  const protectedProfile = runtimeConfig.authE2eFixtureMode
    ? resolveProtectedProfileFixture(await readSessionEnvelope())
    : await executeProtectedServerRequest(
        async (client) => (await client.get<AdminProfileSummary>("/me")).data,
        locale,
      );

  if (protectedProfile.status === "failure") {
    const failure = resolveProtectedRequestFailure({
      error: protectedProfile.error,
      pathname: currentPath,
      locale,
      returnTo: currentPath,
      loginSurface: "admin",
    });

    if (failure.redirectPath) {
      redirect(failure.redirectPath);
    }

    throw protectedProfile.error;
  }

  const copy = getBoundaryMessages(locale).authGuards;
  const profile = protectedProfile.data;

  return (
    <main className="min-h-screen bg-page-admin-accent px-4 py-10 text-foreground md:px-8 md:py-16">
      <div className="mx-auto max-w-content rounded-5xl border border-border bg-white p-6 shadow-card md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-eyebrow font-semibold text-brand">{copy.eyebrow}</p>
            <h1 className="mt-4 text-page-title text-foreground">{copy.adminUsersTitle}</h1>
            <p className="mt-3 text-body-default text-text-muted">{copy.adminUsersDescription}</p>
          </div>
          <LogoutButton locale={locale} surface="admin" />
        </div>

        <dl className="mt-8 grid gap-4 rounded-4xl bg-muted/50 p-5 text-sm text-foreground md:grid-cols-3">
          <div>
            <dt className="font-semibold text-text-muted">Name</dt>
            <dd className="mt-1">{profile.name ?? guard.session.displayName}</dd>
          </div>
          <div>
            <dt className="font-semibold text-text-muted">Email</dt>
            <dd className="mt-1 break-all">{profile.email ?? guard.session.email}</dd>
          </div>
          <div>
            <dt className="font-semibold text-text-muted">Active loans</dt>
            <dd className="mt-1">{profile.activeLoanCount ?? 0}</dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
