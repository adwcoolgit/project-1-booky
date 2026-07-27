import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { redirectMock } = vi.hoisted(() => ({
  redirectMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("@/shared/i18n/navigation", () => ({
  Link: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a className={className} href={href}>
      {children}
    </a>
  ),
  usePathname: () => "/en/login",
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("@/features/foundation-shell", () => ({
  LocaleSwitcher: () => <div data-testid="locale-switcher" />,
}));

vi.mock("@/features/auth/components/login-surface", () => ({
  LoginSurface: ({ locale, surface }: { locale: string; surface: string }) => (
    <section>
      <h1>{surface === "admin" ? (locale === "id" ? "Masuk Admin" : "Admin Login") : locale === "id" ? "Masuk" : "Login"}</h1>
    </section>
  ),
}));

const { readRouteGuardResultMock } = vi.hoisted(() => ({
  readRouteGuardResultMock: vi.fn(),
}));

vi.mock("@/features/auth/config/auth-routes", () => ({
  readRouteGuardResult: readRouteGuardResultMock,
}));

import LoginPage from "@/app/[locale]/(auth)/login/page";
import AdminLoginPage from "@/app/[locale]/admin/login/page";
import ForbiddenPage from "@/app/[locale]/forbidden/page";
import { createGuestSession } from "@/shared/auth/session-schema";

describe("auth route composition", () => {
  beforeEach(() => {
    redirectMock.mockReset();
    readRouteGuardResultMock.mockReset();
  });

  it("renders the localized login surface when the guest guard allows access", async () => {
    readRouteGuardResultMock.mockResolvedValue({
      session: createGuestSession("en"),
      routeAccess: { kind: "guest-only" },
      localizedPaths: {},
      returnTo: null,
      decision: { outcome: "allow" },
      redirectPath: null,
    });

    const node = await LoginPage({
      params: Promise.resolve({ locale: "en" }),
      searchParams: Promise.resolve({}),
    });
    const { getByRole } = render(node);

    expect(getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("redirects authenticated admins away from the localized user login screen", async () => {
    readRouteGuardResultMock.mockResolvedValue({
      redirectPath: "/id/admin/users",
      returnTo: null,
      session: {
        status: "authenticated",
        role: "ADMIN",
      },
    });

    await AdminLoginPage({
      params: Promise.resolve({ locale: "id" }),
      searchParams: Promise.resolve({}),
    });

    expect(redirectMock).toHaveBeenCalledWith("/id/admin/users");
  });

  it("allows the expired-session login surface to render before cleanup completes", async () => {
    readRouteGuardResultMock.mockResolvedValue({
      session: {
        status: "authenticated",
        role: "USER",
      },
      routeAccess: { kind: "guest-only" },
      localizedPaths: {},
      returnTo: { href: "/id" },
      decision: { outcome: "redirect-login" },
      redirectPath: "/id",
    });

    const node = await LoginPage({
      params: Promise.resolve({ locale: "id" }),
      searchParams: Promise.resolve({ reason: "expired", returnTo: "/id" }),
    });
    const { getByRole } = render(node);

    expect(getByRole("heading", { name: "Masuk" })).toBeInTheDocument();
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("renders the forbidden view for authenticated USER sessions", async () => {
    readRouteGuardResultMock.mockResolvedValue({
      session: {
        status: "authenticated",
        role: "USER",
        userId: 2,
        displayName: "Booky Reader",
        email: "reader@booky.test",
        locale: "en",
      },
      redirectPath: null,
    });

    const node = await ForbiddenPage({
      params: Promise.resolve({ locale: "en" }),
    });
    const { getByRole } = render(node);

    expect(getByRole("heading", { name: "This page is not available for your role" })).toBeInTheDocument();
  });
});