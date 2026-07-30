"use client";

import { cn } from "@/shared/lib/utils";
import type { AuthFeedbackState } from "@/features/auth/model/login-outcome";

type AuthFeedbackProps = {
  feedback: AuthFeedbackState | null;
  className?: string;
};

export function AuthFeedback({ feedback, className }: AuthFeedbackProps) {
  if (!feedback) {
    return null;
  }

  const toneClassName =
    feedback.tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : feedback.tone === "info"
        ? "border-sky-200 bg-sky-50 text-sky-900"
        : "border-rose-200 bg-rose-50 text-rose-900";

  return (
    <div
      aria-live={feedback.tone === "error" ? "assertive" : "polite"}
      className={cn("rounded-2xl border px-4 py-3 text-sm font-medium", toneClassName, className)}
      role={feedback.tone === "error" ? "alert" : "status"}
    >
      {feedback.message}
    </div>
  );
}
