import { getLocalizedAuthPaths } from "@/shared/auth/route-access";
import type { SessionRole } from "@/shared/auth/session-schema";
import type { AppLocale } from "@/shared/i18n/config";
import { getBoundaryMessages } from "@/shared/i18n/get-messages";
import { Link } from "@/shared/i18n/navigation";
import { FocusTarget } from "@/shared/ui";

type ForbiddenViewProps = {
  locale: AppLocale;
  role: SessionRole | null;
};

export function ForbiddenView({ locale, role }: ForbiddenViewProps) {
  const copy = getBoundaryMessages(locale).authGuards;
  const paths = getLocalizedAuthPaths(locale);
  const primaryPath = role === "ADMIN" ? paths.adminHome : role === "USER" ? paths.userHome : paths.login;
  const primaryLabel = role === "ADMIN" ? copy.adminHomeAction : role === "USER" ? copy.userHomeAction : copy.loginAction;

  return (
    <main className="min-h-screen bg-page-user-accent px-4 py-10 md:px-8 md:py-16">
      <div className="mx-auto flex min-h-guard-stage max-w-canvas items-center justify-center">
        <FocusTarget
          aria-live="polite"
          className="w-full max-w-guard rounded-5xl border border-border bg-white p-6 shadow-card md:p-8"
          role="status"
        >
          <p className="text-eyebrow font-semibold text-brand">{copy.eyebrow}</p>
          <h1 className="mt-4 text-page-title text-foreground">
            {copy.forbiddenTitle}
          </h1>
          <p className="mt-3 text-body-default text-text-muted">{copy.forbiddenDescription}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand/90"
              href={primaryPath}
            >
              {primaryLabel}
            </Link>
            <Link
              className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
              href={paths.login}
            >
              {copy.loginAction}
            </Link>
          </div>
        </FocusTarget>
      </div>
    </main>
  );
}
