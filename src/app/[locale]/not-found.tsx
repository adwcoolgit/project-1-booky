"use client";

import { useParams } from "next/navigation";

import { BoundaryStateView } from "@/features/foundation-shell";
import { isSupportedLocale } from "@/shared/i18n/config";

export default function LocaleNotFound() {
  const params = useParams<{ locale?: string }>();
  const reason = isSupportedLocale(params?.locale ?? "") ? "generic" : "unsupported-locale";

  return <BoundaryStateView notFoundReason={reason} state="not-found" />;
}
