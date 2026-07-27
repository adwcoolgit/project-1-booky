import { AuthLink } from "@/features/auth/components/auth-link";

type AuthFormPromptProps = {
  basePath: string;
  linkLabel: string;
  returnTo?: string | null | undefined;
  promptLabel?: string | undefined;
};

export function AuthFormPrompt({
  basePath,
  linkLabel,
  returnTo,
  promptLabel,
}: AuthFormPromptProps) {
  if (promptLabel) {
    return (
      <p className="flex w-full justify-center gap-1 text-center text-body-md font-semibold tracking-auth text-text-strong">
        <span>{promptLabel}</span>
        <AuthLink
          basePath={basePath}
          className="text-body-md font-bold tracking-auth text-brand hover:underline"
          returnTo={returnTo ?? null}
        >
          {linkLabel}
        </AuthLink>
      </p>
    );
  }

  return (
    <div className="flex w-full justify-center text-center">
      <AuthLink
        basePath={basePath}
        className="text-body-md font-bold tracking-auth text-brand hover:underline"
        returnTo={returnTo ?? null}
      >
        {linkLabel}
      </AuthLink>
    </div>
  );
}
