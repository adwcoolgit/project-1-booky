"use client";

import { usePathname } from "next/navigation";

import { BoundaryStateView } from "@/features/foundation-shell";

export default function CheckoutError({ reset }: { error: Error; reset: () => void }) {
  const pathname = usePathname() ?? "/en/checkout";

  return <BoundaryStateView onRetry={reset} pathname={pathname} state="error" />;
}
