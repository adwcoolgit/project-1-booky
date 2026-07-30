"use client";

import { useRef, useState } from "react";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { AuthFeedback } from "@/features/auth/components/auth-feedback";
import {
  AuthCheckboxField,
  AuthPasswordField,
  AuthTextField,
} from "@/features/auth/components/auth-form-fields";
import { AuthFormPrompt } from "@/features/auth/components/auth-form-prompt";
import { AuthFormShell } from "@/features/auth/components/auth-form-shell";
import { AuthSubmit } from "@/features/auth/components/auth-submit";
import { useRegisterMutation } from "@/features/auth/hooks/use-register-mutation";
import type { AuthFeedbackState } from "@/features/auth/model/login-outcome";
import { createRegisterFormSchema } from "@/features/auth/model/register-form";
import { isBffAuthError } from "@/shared/api/bff/auth-client";
import type { AppLocale } from "@/shared/i18n/config";

type RegisterFormProps = {
  locale: AppLocale;
  returnTo?: string | undefined;
};

type RegisterFormState = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  policyAccepted: boolean;
};

type RegisterFieldErrors = Partial<Record<keyof RegisterFormState, string>>;

function compactFieldErrors(
  entries: Record<string, string | undefined>,
): RegisterFieldErrors {
  return Object.fromEntries(
    Object.entries(entries).filter(([, value]) => typeof value === "string"),
  );
}

export function RegisterForm({ locale, returnTo }: RegisterFormProps) {
  const router = useRouter();
  const t = useTranslations("AuthFeature");
  const registerMutation = useRegisterMutation();
  const [values, setValues] = useState<RegisterFormState>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    policyAccepted: false,
  });
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [feedback, setFeedback] = useState<AuthFeedbackState | null>(null);
  const submitLockRef = useRef(false);
  const isSubmitting = submitLockRef.current || registerMutation.isPending;
  const validationMessages = {
    required: t("validation.required"),
    emailInvalid: t("validation.emailInvalid"),
    passwordMin: t("validation.passwordMin"),
    passwordMismatch: t("validation.passwordMismatch"),
    policyRequired: t("validation.policyRequired"),
  };

  function updateField(field: keyof RegisterFormState, value: string | boolean) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setFeedback(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitLockRef.current) {
      return;
    }

    const parsed = createRegisterFormSchema(validationMessages).safeParse({
      name: values.name,
      email: values.email,
      phone: values.phone,
      password: values.password,
      confirmPassword: values.confirmPassword,
      policyAccepted: values.policyAccepted,
      surfaceLocale: locale,
    });

    if (!parsed.success) {
      const flattened = parsed.error.flatten().fieldErrors as Record<
        string,
        string[] | undefined
      >;
      setFieldErrors(
        compactFieldErrors({
          name: flattened.name?.[0],
          email: flattened.email?.[0],
          phone: flattened.phone?.[0],
          password: flattened.password?.[0],
          confirmPassword: flattened.confirmPassword?.[0],
          policyAccepted: flattened.policyAccepted?.[0],
        }),
      );
      setFeedback({ tone: "error", message: t("feedback.invalidSubmission") });
      return;
    }

    submitLockRef.current = true;
    setFieldErrors({});
    setFeedback(null);

    try {
      const result = await registerMutation.mutateAsync(parsed.data);
      const redirectUrl = new URL(result.redirectTo, "http://localhost");

      if (returnTo) {
        redirectUrl.searchParams.set("returnTo", returnTo);
      }

      router.push(`${redirectUrl.pathname}${redirectUrl.search}`);
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
      description={t("register.subheading")}
      title={t("register.heading")}
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
          autoComplete="name"
          error={fieldErrors.name}
          id="register-name"
          label={t("common.nameLabel")}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder={t("common.registerNamePlaceholder")}
          type="text"
          value={values.name}
        />

        <AuthTextField
          autoComplete="email"
          error={fieldErrors.email}
          id="register-email"
          label={t("common.emailLabel")}
          onChange={(event) => updateField("email", event.target.value)}
          placeholder={t("common.emailPlaceholder")}
          type="email"
          value={values.email}
        />

        <AuthTextField
          autoComplete="tel"
          error={fieldErrors.phone}
          id="register-phone"
          label={t("common.phoneLabel")}
          onChange={(event) => updateField("phone", event.target.value)}
          placeholder={t("common.phonePlaceholder")}
          type="tel"
          value={values.phone}
        />

        <AuthPasswordField
          autoComplete="new-password"
          error={fieldErrors.password}
          hideLabel={t("common.hidePassword")}
          id="register-password"
          label={t("common.passwordLabel")}
          onChange={(event) => updateField("password", event.target.value)}
          placeholder={t("common.newPasswordPlaceholder")}
          showLabel={t("common.showPassword")}
          value={values.password}
        />

        <AuthPasswordField
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
          hideLabel={t("common.hidePassword")}
          id="register-confirm-password"
          label={t("common.confirmPasswordLabel")}
          onChange={(event) => updateField("confirmPassword", event.target.value)}
          placeholder={t("common.confirmPasswordPlaceholder")}
          showLabel={t("common.showPassword")}
          value={values.confirmPassword}
        />

        <AuthCheckboxField
          checked={values.policyAccepted}
          error={fieldErrors.policyAccepted}
          helperId="register-policy-error"
          label={t("register.policyLabel")}
          onChange={(event) => updateField("policyAccepted", event.target.checked)}
        />

        <AuthSubmit
          className="auth-submit-primary"
          idleLabel={t("register.submit")}
          pending={isSubmitting}
          pendingLabel={t("register.pendingSubmit")}
        />

        <AuthFormPrompt
          basePath={`/${locale}/login`}
          linkLabel={t("register.loginLink")}
          promptLabel={t("register.loginPrompt")}
          returnTo={returnTo ?? null}
        />
      </form>
    </AuthFormShell>
  );
}
