import type { ReactNode } from "react";

import { AuthBrandLockup } from "@/features/auth/components/auth-brand-lockup";
import { cn } from "@/shared/lib/utils";

type AuthFormShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  introClassName?: string | undefined;
};

export function AuthFormShell({
  title,
  description,
  children,
  introClassName,
}: AuthFormShellProps) {
  return (
    <section className="flex w-full max-w-[324px] flex-col items-start gap-5 sm:max-w-[344px] sm:gap-6 md:max-w-[380px] md:gap-7 lg:max-w-[440px] xl:max-w-auth">
      <AuthBrandLockup />

      <div className={cn("flex w-full flex-col items-start gap-0.5 sm:gap-1", introClassName)}>
        <h1 className="font-display text-[24px] font-bold leading-9 tracking-[-0.02em] text-text-strong sm:text-[26px] sm:leading-9 md:text-[28px] md:leading-10 lg:text-auth-title lg:tracking-auth">
          {title}
        </h1>
        <p className="text-[14px] font-semibold leading-7 tracking-[-0.02em] text-neutral-700 sm:text-[14px] sm:leading-7 md:text-[15px] md:leading-7 lg:text-body-md lg:tracking-auth">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}