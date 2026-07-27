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
    <section className="flex w-full max-w-auth flex-col items-start gap-5">
      <AuthBrandLockup />

      <div className={cn("flex w-full flex-col items-start gap-2", introClassName)}>
        <h1 className="font-display text-auth-title font-bold tracking-auth text-text-strong">
          {title}
        </h1>
        <p className="text-body-md font-semibold tracking-auth text-neutral-700">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}
