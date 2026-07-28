"use client";

import { usePathname } from "next/navigation";

import { BoundaryStateView } from "@/features/foundation-shell";

export default function BooksError({ reset }: { error: Error; reset: () => void }) {
  const pathname = usePathname() ?? "/en/books";

  return <BoundaryStateView onRetry={reset} pathname={pathname} state="error" />;
}