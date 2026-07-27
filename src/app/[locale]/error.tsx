"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { BoundaryStateView } from "@/features/foundation-shell";

export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const pathname = usePathname() ?? "/en/foundation/public";
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleRetry() {
    if (searchParams.get("boundary") === "error") {
      router.replace(pathname);
      return;
    }

    reset();
  }

  return <BoundaryStateView error={error} onRetry={handleRetry} pathname={pathname} state="error" />;
}
