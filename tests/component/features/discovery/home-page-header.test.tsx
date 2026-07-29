import type { ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => <span data-alt={alt} data-src={src} />,
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: ReactNode;
    href: string;
  } & Record<string, unknown>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/features/foundation-shell", () => ({
  LocaleSwitcher: () => <div data-testid="locale-switcher" />,
}));

vi.mock("@/features/discovery/components/discovery-bag-icon", () => ({
  DiscoveryBagIcon: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="bag-icon" />
  ),
}));

vi.mock("@/features/discovery/components/user-profile-menu", () => ({
  UserProfileMenu: ({ displayName }: { displayName: string }) => (
    <div data-testid="profile-menu">{displayName}</div>
  ),
}));

import { HomePageHeader } from "@/features/discovery/components/home-page-header";

describe("home page header", () => {
  it("renders guest login and register actions without search, bag, or profile controls", () => {
    render(
      <HomePageHeader
        brandLabel="Booky"
        locale="en"
        loginLabel="Login"
        registerLabel="Register"
        searchLabel="Search"
        searchPlaceholder="Search books"
        variant="guest"
      />,
    );

    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute("href", "/en/login");
    expect(screen.getByRole("link", { name: "Register" })).toHaveAttribute("href", "/en/register");
    expect(screen.queryByRole("searchbox", { name: "Search" })).not.toBeInTheDocument();
    expect(screen.queryByTestId("bag-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("profile-menu")).not.toBeInTheDocument();
    expect(screen.queryByTestId("locale-switcher")).not.toBeInTheDocument();
  });

  it("keeps authenticated header actions for signed-in sessions", () => {
    render(
      <HomePageHeader
        borrowedListLabel="Borrowed List"
        brandLabel="Booky"
        displayName="Booky Reader"
        locale="id"
        profileLabel="Profil"
        profileMenuLabel="Menu profil"
        reviewsLabel="Ulasan"
        searchLabel="Cari"
        searchPlaceholder="Cari buku"
        variant="authenticated"
      />,
    );

    expect(screen.getByRole("searchbox", { name: "Cari" })).toBeInTheDocument();
    expect(screen.getByTestId("locale-switcher")).toBeInTheDocument();
    expect(screen.getByTestId("bag-icon")).toBeInTheDocument();
    expect(screen.getByTestId("profile-menu")).toHaveTextContent("Booky Reader");
  });
});
