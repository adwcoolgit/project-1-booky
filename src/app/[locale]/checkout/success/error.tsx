"use client";

import { usePathname } from "next/navigation";

import { BoundaryStateView } from "@/features/foundation-shell";

export default function CheckoutSuccessError({ reset }: { error: Error; reset: () => void }) {
  const pathname = usePathname() ?? "/en/checkout/success";

  return <BoundaryStateView onRetry={reset} pathname={pathname} state="error" />;
}
