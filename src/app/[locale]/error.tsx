"use client";

import { useEffect, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { BoundaryStateView } from "@/features/foundation-shell";
import { useSessionFailureNotifier } from "@/shared/providers/app-providers";

type BoundaryAwareError = Error & {
  digest?: string;
  code?: string;
  httpError?: {
    code?: string;
  };
};

function readFailureCode(error: BoundaryAwareError): "unauthenticated" | "forbidden" | null {
  const candidates = [error.code, error.httpError?.code];

  for (const candidate of candidates) {
    if (candidate === "unauthenticated" || candidate === "forbidden") {
      return candidate;
    }
  }

  return null;
}

export default function LocaleError({ error, reset }: { error: BoundaryAwareError; reset: () => void }) {
  const pathname = usePathname() ?? "/en/foundation/public";
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionFailureNotifier = useSessionFailureNotifier();
  const [isRecoveringSession, setIsRecoveringSession] = useState(false);
  const failureCode = readFailureCode(error);

  useEffect(() => {
    if (!failureCode) {
      return;
    }

    setIsRecoveringSession(true);
    sessionFailureNotifier.handleFailure({
      code: failureCode,
      currentPath: `${pathname}${searchParams?.size ? `?${searchParams.toString()}` : ""}`,
      loginSurface: pathname.includes("/admin") ? "admin" : "user",
    });
  }, [failureCode, pathname, searchParams, sessionFailureNotifier]);

  function handleRetry() {
    if (searchParams.get("boundary") === "error") {
      router.replace(pathname);
      return;
    }

    reset();
  }

  if (isRecoveringSession && failureCode) {
    return <BoundaryStateView pathname={pathname} state="loading" />;
  }

  return <BoundaryStateView error={error} onRetry={handleRetry} pathname={pathname} state="error" />;
}
