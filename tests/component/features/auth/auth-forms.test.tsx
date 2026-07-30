import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { LoginForm } from "@/features/auth/components/login-form";
import { RegisterForm } from "@/features/auth/components/register-form";
import { getMessages } from "@/shared/i18n/get-messages";
import { renderWithProviders } from "@/shared/test/render-with-providers";

const pushSpy = vi.fn();
const replaceSpy = vi.fn();
const loginMutationState = {
  mutateAsync: vi.fn(),
  isPending: false,
};
const registerMutationState = {
  mutateAsync: vi.fn(),
  isPending: false,
};

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushSpy,
    replace: replaceSpy,
    prefetch: vi.fn(),
  }),
  usePathname: () => "/en/login",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/shared/i18n/navigation", () => ({
  Link: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a className={className} href={href}>
      {children}
    </a>
  ),
  buildPathWithSearchParams: (pathname: string, searchParams: Record<string, string | null | undefined>) => {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(searchParams)) {
      if (value) {
        params.set(key, value);
      }
    }

    const query = params.toString();

    return query ? `${pathname}?${query}` : pathname;
  },
}));

vi.mock("@/features/auth/hooks/use-login-mutation", () => ({
  useLoginMutation: () => loginMutationState,
}));

vi.mock("@/features/auth/hooks/use-register-mutation", () => ({
  useRegisterMutation: () => registerMutationState,
}));

describe("auth forms", () => {
  beforeEach(() => {
    pushSpy.mockReset();
    replaceSpy.mockReset();
    loginMutationState.mutateAsync.mockReset();
    registerMutationState.mutateAsync.mockReset();
    loginMutationState.isPending = false;
    registerMutationState.isPending = false;
  });

  it("renders localized login validation feedback accessibly", async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginForm locale="id" surface="user" />, {
      locale: "id",
      messages: getMessages("id"),
    });

    await user.click(screen.getByRole("button", { name: "Masuk" }));

    expect(await screen.findAllByText("Kolom ini wajib diisi.")).toHaveLength(2);
    expect(screen.getByRole("alert")).toHaveTextContent("Perbaiki kolom yang ditandai lalu coba lagi.");
  });

  it("prevents duplicate login submissions and toggles password visibility", async () => {
    const user = userEvent.setup();
    loginMutationState.mutateAsync.mockImplementation(() => new Promise(() => undefined));

    renderWithProviders(<LoginForm locale="en" surface="user" />, {
      locale: "en",
      messages: getMessages("en"),
    });

    await user.type(screen.getByLabelText("Email"), "reader@booky.test");
    const passwordField = screen.getByLabelText("Password");
    await user.type(passwordField, "Password123!");

    expect(passwordField).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(passwordField).toHaveAttribute("type", "text");

    const submitButton = screen.getByRole("button", { name: "Login" });
    await user.click(submitButton);
    await user.click(submitButton);

    expect(loginMutationState.mutateAsync).toHaveBeenCalledTimes(1);
  });

  it("preserves a sanitized returnTo in auth navigation links", () => {
    renderWithProviders(<LoginForm locale="id" returnTo="/id/admin/users?page=2#summary" surface="user" />, {
      locale: "id",
      messages: getMessages("id"),
    });

    expect(screen.getByRole("link", { name: "Daftar" })).toHaveAttribute(
      "href",
      "/id/register?returnTo=%2Fid%2Fadmin%2Fusers%3Fpage%3D2%23summary",
    );
  });

  it("keeps confirm password and policy validation local to the register form", async () => {
    const user = userEvent.setup();

    renderWithProviders(<RegisterForm locale="en" />, {
      locale: "en",
      messages: getMessages("en"),
    });

    await user.type(screen.getByLabelText("Name"), "Booky Reader");
    await user.type(screen.getByLabelText("Email"), "reader@booky.test");
    await user.type(screen.getByLabelText("Password"), "Password123!");
    await user.type(screen.getByLabelText("Confirm password"), "Password999!");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByText("Passwords do not match.")).toBeInTheDocument();
    expect(screen.getByText("You must agree to the borrowing policy before continuing.")).toBeInTheDocument();
    expect(registerMutationState.mutateAsync).not.toHaveBeenCalled();
  });

  it("shows unauthorized login feedback returned by the BFF adapter", async () => {
    const user = userEvent.setup();
    const loginError = Object.assign(new Error("Unauthorized"), {
      source: "http",
      payload: {
        status: "error",
        code: "unauthorized",
        message: "Email or password is incorrect.",
      },
    });
    loginMutationState.mutateAsync.mockRejectedValue(loginError);

    renderWithProviders(<LoginForm locale="en" surface="user" />, {
      locale: "en",
      messages: getMessages("en"),
    });

    await user.type(screen.getByLabelText("Email"), "reader@booky.test");
    await user.type(screen.getByLabelText("Password"), "Password123!");
    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Email or password is incorrect.");
    });
    expect(pushSpy).not.toHaveBeenCalled();
  });
});
