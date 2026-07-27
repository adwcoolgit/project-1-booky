"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import type { AuthSurface } from "@/features/auth/config/auth-routes";
import { useLogoutMutation } from "@/features/auth/hooks/use-logout-mutation";
import { useSessionFailureNotifier } from "@/shared/providers/app-providers";
import type { AppLocale } from "@/shared/i18n/config";

type LogoutButtonProps = {
  locale: AppLocale;
  surface: AuthSurface;
};

export function LogoutButton({ locale, surface }: LogoutButtonProps) {
  const t = useTranslations("AuthFeature");
  const router = useRouter();
  const logoutMutation = useLogoutMutation();
  const sessionFailureNotifier = useSessionFailureNotifier();

  async function handleLogout() {
    const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const result = await logoutMutation.mutateAsync({
      locale,
      surface,
      returnTo,
    });

    sessionFailureNotifier.clearPrivateState();
    router.replace(result.redirectTo);
  }

  return (
    <button
      className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
      disabled={logoutMutation.isPending}
      onClick={() => {
        void handleLogout();
      }}
      type="button"
    >
      {logoutMutation.isPending ? t("logout.pending") : t("logout.label")}
    </button>
  );
}
