"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import type { AuthSurface } from "@/features/auth/config/auth-routes";
import { useLogoutMutation } from "@/features/auth/hooks/use-logout-mutation";
import type { AppLocale } from "@/shared/i18n/config";
import { cn } from "@/shared/lib/utils";
import { useSessionFailureNotifier } from "@/shared/providers/app-providers";

type LogoutButtonProps = {
  locale: AppLocale;
  surface: AuthSurface;
  className?: string | undefined;
};

export function LogoutButton({ locale, surface, className }: LogoutButtonProps) {
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
      className={cn(
        "rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
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
