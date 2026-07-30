"use client";

import { usePathname } from "next/navigation";

import { BoundaryStateView } from "@/features/foundation-shell";

export default function AuthorBooksError({ reset }: { error: Error; reset: () => void }) {
  const pathname = usePathname() ?? "/en/authors/1";

  return <BoundaryStateView onRetry={reset} pathname={pathname} state="error" />;
}