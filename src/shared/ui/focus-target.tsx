import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/lib/utils";

type FocusTargetProps = ComponentPropsWithoutRef<"div"> & {
  targetId?: string;
};

export function FocusTarget({ targetId = "main-content", className, ...props }: FocusTargetProps) {
  return <div className={cn("focus-target outline-none", className)} id={targetId} tabIndex={-1} {...props} />;
}
