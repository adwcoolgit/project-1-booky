import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type SkipLinkProps = {
  href?: string;
  label?: string;
  className?: string;
  children?: ReactNode;
};

export function SkipLink({
  href = "#main-content",
  label = "Skip to content",
  className,
  children,
}: SkipLinkProps) {
  return (
    <a className={cn("skip-link", className)} href={href}>
      {children ?? label}
    </a>
  );
}
