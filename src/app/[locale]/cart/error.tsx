"use client";

import { usePathname } from "next/navigation";

import { BoundaryStateView } from "@/features/foundation-shell";

export default function CartError({ reset }: { error: Error; reset: () => void }) {
  const pathname = usePathname() ?? "/en/cart";

  return <BoundaryStateView onRetry={reset} pathname={pathname} state="error" />;
}
