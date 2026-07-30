import Link from "next/link";
import type { ReactNode } from "react";

import { buildPathWithSearchParams } from "@/shared/i18n/navigation";

type AuthLinkProps = {
  basePath: string;
  returnTo?: string | null;
  className?: string;
  children: ReactNode;
};

export function createAuthHref(basePath: string, returnTo?: string | null): string {
  return buildPathWithSearchParams(basePath, {
    returnTo,
  });
}

export function AuthLink({ basePath, returnTo, className, children }: AuthLinkProps) {
  return (
    <Link className={className} href={createAuthHref(basePath, returnTo)}>
      {children}
    </Link>
  );
}
