"use client";

import { useRef, useState } from "react";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { AuthFeedback } from "@/features/auth/components/auth-feedback";
import {
  AuthPasswordField,
  AuthTextField,
} from "@/features/auth/components/auth-form-fields";
import { AuthFormPrompt } from "@/features/auth/components/auth-form-prompt";
import { AuthFormShell } from "@/features/auth/components/auth-form-shell";
import { AuthSubmit } from "@/features/auth/components/auth-submit";
import type { AuthSurface } from "@/features/auth/config/auth-routes";
import { useLoginMutation } from "@/features/auth/hooks/use-login-mutation";
import { createLoginFormSchema } from "@/features/auth/model/login-form";
import type { AuthFeedbackState } from "@/features/auth/model/login-outcome";
import { isBffAuthError } from "@/shared/api/bff/auth-client";
import type { AppLocale } from "@/shared/i18n/config";

type LoginFormProps = {
  locale: AppLocale;
  surface: AuthSurface;
  returnTo?: string | undefined;
  initialFeedback?: AuthFeedbackState | null;
};

type LoginFieldErrors = Partial<Record<"email" | "password", string>>;

type LoginFormState = {
  email: string;
  password: string;
};

function compactFieldErrors(
  entries: Record<string, string | undefined>,
): LoginFieldErrors {
  return Object.fromEntries(
    Object.entries(entries).filter(([, value]) => typeof value === "string"),
  );
}

export function LoginForm({
  locale,
  surface,
  returnTo,
  initialFeedback = null,
}: LoginFormProps) {
  const router = useRouter();
  const t = useTranslations("AuthFeature");
  const loginMutation = useLoginMutation();
  const [values, setValues] = useState<LoginFormState>({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [feedback, setFeedback] = useState<AuthFeedbackState | null>(
    initialFeedback,
  );
  const submitLockRef = useRef(false);
  const isSubmitting = submitLockRef.current || loginMutation.isPending;

  const isAdminSurface = surface === "admin";
  const heading = isAdminSurface ? t("adminLogin.heading") : t("login.heading");
  const subheading = isAdminSurface
    ? t("adminLogin.subheading")
    : t("login.subheading");
  const submitLabel = isAdminSurface
    ? t("adminLogin.submit")
    : t("login.submit");
  const pendingSubmitLabel = isAdminSurface
    ? t("adminLogin.pendingSubmit")
    : t("login.pendingSubmit");
  const validationMessages = {
    required: t("validation.required"),
    emailInvalid: t("validation.emailInvalid"),
    passwordMin: t("validation.passwordMin"),
  };

  function updateField(field: keyof LoginFormState, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setFeedback(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitLockRef.current) {
      return;
    }

    const parsed = createLoginFormSchema(validationMessages).safeParse({
      email: values.email,
      password: values.password,
      surface,
      returnTo,
      surfaceLocale: locale,
    });

    if (!parsed.success) {
      const flattened = parsed.error.flatten().fieldErrors as Record<
        string,
        string[] | undefined
      >;
      setFieldErrors(
        compactFieldErrors({
          email: flattened.email?.[0],
          password: flattened.password?.[0],
        }),
      );
      setFeedback({ tone: "error", message: t("feedback.invalidSubmission") });
      return;
    }

    submitLockRef.current = true;
    setFieldErrors({});
    setFeedback(null);

    try {
      const result = await loginMutation.mutateAsync(parsed.data);
      router.push(result.redirectTo);
    } catch (error) {
      if (isBffAuthError(error) && error.payload) {
        const payload = error.payload as {
          message: string;
          fieldErrors?: Record<string, string>;
        };
        setFieldErrors(compactFieldErrors(payload.fieldErrors ?? {}));
        setFeedback({ tone: "error", message: payload.message });
      } else {
        setFeedback({ tone: "error", message: t("feedback.genericError") });
      }
    } finally {
      submitLockRef.current = false;
    }
  }

  return (
    <AuthFormShell
      description={subheading}
      introClassName="max-w-auth-intro"
      title={heading}
    >
      <form
        className="flex w-full flex-col items-center gap-4"
        noValidate
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      >
        <AuthFeedback
          className="w-full rounded-xl px-4 py-2 text-body-sm"
          feedback={feedback}
        />

        <AuthTextField
          autoComplete="email"
          error={fieldErrors.email}
          id={`${surface}-email`}
          label={t("common.emailLabel")}
          name="email"
          onChange={(event) => updateField("email", event.target.value)}
          placeholder={t("common.emailPlaceholder")}
          type="email"
          value={values.email}
        />

        <AuthPasswordField
          autoComplete="current-password"
          error={fieldErrors.password}
          hideLabel={t("common.hidePassword")}
          id={`${surface}-password`}
          label={t("common.passwordLabel")}
          name="password"
          onChange={(event) => updateField("password", event.target.value)}
          placeholder={t("common.loginPasswordPlaceholder")}
          showLabel={t("common.showPassword")}
          value={values.password}
        />

        <AuthSubmit
          className="auth-submit-primary"
          idleLabel={submitLabel}
          pending={isSubmitting}
          pendingLabel={pendingSubmitLabel}
        />

        <AuthFormPrompt
          basePath={isAdminSurface ? `/${locale}/login` : `/${locale}/register`}
          linkLabel={isAdminSurface ? t("adminLogin.userLoginLink") : t("login.registerLink")}
          promptLabel={isAdminSurface ? undefined : t("login.registerPrompt")}
          returnTo={returnTo ?? null}
        />
      </form>
    </AuthFormShell>
  );
}
