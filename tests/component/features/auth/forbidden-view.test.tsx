import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { ForbiddenView } from "@/features/auth/components/forbidden-view";

vi.mock("@/shared/i18n/navigation", () => ({
  Link: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a className={className} href={href}>
      {children}
    </a>
  ),
}));

describe("forbidden view", () => {
  it("renders localized forbidden copy and the correct USER recovery action", () => {
    render(<ForbiddenView locale="id" role="USER" />);

    expect(screen.getByRole("heading", { name: "Halaman ini tidak tersedia untuk peran Anda" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Buka beranda user" })).toHaveAttribute("href", "/id");
    expect(screen.getByRole("link", { name: "Buka login" })).toHaveAttribute("href", "/id/login");
  });

  it("uses the admin recovery action for ADMIN sessions", () => {
    render(<ForbiddenView locale="en" role="ADMIN" />);

    expect(screen.getByRole("link", { name: "Go to admin home" })).toHaveAttribute("href", "/en/admin/users");
  });
});
