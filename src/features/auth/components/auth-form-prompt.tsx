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
      <p className="flex w-full justify-center gap-1 text-center text-[14px] font-semibold leading-7 tracking-[-0.02em] text-text-strong sm:text-[14px] md:text-[15px] md:leading-7 lg:text-body-md lg:tracking-auth">
        <span>{promptLabel}</span>
        <AuthLink
          basePath={basePath}
          className="text-[14px] font-bold leading-7 tracking-[-0.02em] text-brand hover:underline sm:text-[14px] md:text-[15px] md:leading-7 lg:text-body-md lg:tracking-auth"
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
        className="text-[14px] font-bold leading-7 tracking-[-0.02em] text-brand hover:underline sm:text-[14px] md:text-[15px] md:leading-7 lg:text-body-md lg:tracking-auth"
        returnTo={returnTo ?? null}
      >
        {linkLabel}
      </AuthLink>
    </div>
  );
}