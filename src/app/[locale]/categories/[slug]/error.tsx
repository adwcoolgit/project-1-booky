"use client";

import { usePathname } from "next/navigation";

import { BoundaryStateView } from "@/features/foundation-shell";

export default function CategoryBooksError({ reset }: { error: Error; reset: () => void }) {
  const pathname = usePathname() ?? "/en/categories";

  return <BoundaryStateView onRetry={reset} pathname={pathname} state="error" />;
}