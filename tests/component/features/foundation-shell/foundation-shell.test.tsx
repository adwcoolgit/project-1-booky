import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AdminShell, UserShell, createShellDefinition } from "@/features/foundation-shell";
import { getFoundationShellMessages } from "@/shared/i18n/get-messages";

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => <span data-next-image={src} data-next-image-alt={alt} />,
}));

vi.mock("@/features/foundation-shell/components/locale-switcher", () => ({
  LocaleSwitcher: () => <div data-testid="locale-switcher">locale-switcher</div>,
}));

vi.mock("@/shared/i18n/navigation", () => ({
  Link: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a className={className} href={href}>
      {children}
    </a>
  ),
}));

describe("foundation shell components", () => {
  it("renders the user-facing shell with localized navigation", () => {
    const shell = createShellDefinition("en", "public", getFoundationShellMessages("en"));

    render(<UserShell areaLabel="Public area" helper="No business workflow" locale="en" shell={shell} />);

    expect(screen.getByRole("heading", { name: "Public foundation shell" })).toBeInTheDocument();
    expect(screen.getAllByText("User-facing shell").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Reader placeholder" })).toHaveAttribute(
      "href",
      "/en/foundation/user",
    );
    expect(screen.getByTestId("locale-switcher")).toBeInTheDocument();
    expect(screen.getByText("Discover inspiring stories & timeless knowledge, ready to borrow anytime. Explore online or visit our nearest library branch.")).toBeInTheDocument();
  });

  it("renders the admin-facing shell with admin badge", () => {
    const shell = createShellDefinition("en", "admin", getFoundationShellMessages("en"));

    render(<AdminShell areaLabel="Admin area" helper="No business workflow" locale="en" shell={shell} />);

    expect(screen.getByRole("heading", { name: "Admin foundation shell" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Admin placeholder" })).toHaveAttribute(
      "href",
      "/en/foundation/admin",
    );
  });
});



