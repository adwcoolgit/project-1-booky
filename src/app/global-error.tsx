"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { BoundaryStateView } from "@/features/foundation-shell";
import { bookyFont } from "@/shared/styles/fonts";

import "./globals.css";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
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

  return (
    <html lang="en">
      <body className={bookyFont.variable}>
        <BoundaryStateView error={error} errorScope="global" onRetry={handleRetry} pathname={pathname} state="error" />
      </body>
    </html>
  );
}
