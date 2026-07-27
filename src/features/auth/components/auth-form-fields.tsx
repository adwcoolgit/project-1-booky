"use client";

import EyeIcon from "@iconify-react/tabler/eye";
import EyeOffIcon from "@iconify-react/tabler/eye-off";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useState } from "react";

import { cn } from "@/shared/lib/utils";

const fieldClassName =
  "h-12 w-full rounded-xl border border-border bg-white px-4 py-2 text-body-sm text-foreground outline-none transition placeholder:text-text-muted focus:border-brand focus-visible:ring-2 focus-visible:ring-brand/20";

const fieldErrorClassName =
  "border-danger focus:border-danger focus-visible:ring-danger/20";

const passwordToggleClassName =
  "absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center text-foreground transition hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/20";

const labelClassName =
  "w-full text-body-sm font-bold tracking-auth text-foreground";

const helperClassName =
  "text-body-sm font-medium tracking-auth-helper text-danger";

type AuthFieldShellProps = {
  label: string;
  labelFor: string;
  error?: string | undefined;
  helperId: string;
  children: ReactNode;
};

function AuthFieldShell({
  label,
  labelFor,
  error,
  helperId,
  children,
}: AuthFieldShellProps) {
  return (
    <div className="flex w-full flex-col items-start gap-0.5">
      <label className={labelClassName} htmlFor={labelFor}>
        {label}
      </label>
      {children}
      {error ? (
        <p className={helperClassName} id={helperId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

type AuthTextFieldProps = Omit<ComponentPropsWithoutRef<"input">, "className"> & {
  label: string;
  error?: string | undefined;
};

export function AuthTextField({
  label,
  error,
  id,
  ...inputProps
}: AuthTextFieldProps) {
  if (!id) {
    throw new Error("AuthTextField requires an id.");
  }

  const helperId = `${id}-error`;

  return (
    <AuthFieldShell error={error} helperId={helperId} label={label} labelFor={id}>
      <input
        {...inputProps}
        aria-describedby={error ? helperId : undefined}
        aria-invalid={Boolean(error)}
        className={cn(fieldClassName, error && fieldErrorClassName)}
        id={id}
      />
    </AuthFieldShell>
  );
}

type AuthPasswordFieldProps = Omit<ComponentPropsWithoutRef<"input">, "className" | "type"> & {
  label: string;
  error?: string | undefined;
  showLabel: string;
  hideLabel: string;
};

export function AuthPasswordField({
  label,
  error,
  id,
  showLabel,
  hideLabel,
  ...inputProps
}: AuthPasswordFieldProps) {
  if (!id) {
    throw new Error("AuthPasswordField requires an id.");
  }

  const [visible, setVisible] = useState(false);
  const helperId = `${id}-error`;

  return (
    <AuthFieldShell error={error} helperId={helperId} label={label} labelFor={id}>
      <div className="relative w-full">
        <input
          {...inputProps}
          aria-describedby={error ? helperId : undefined}
          aria-invalid={Boolean(error)}
          className={cn(`${fieldClassName} pr-12`, error && fieldErrorClassName)}
          id={id}
          type={visible ? "text" : "password"}
        />
        <button
          aria-label={visible ? hideLabel : showLabel}
          aria-pressed={visible}
          className={passwordToggleClassName}
          onClick={() => setVisible((current) => !current)}
          type="button"
        >
          {visible ? (
            <EyeOffIcon aria-hidden="true" className="h-5 w-5" />
          ) : (
            <EyeIcon aria-hidden="true" className="h-5 w-5" />
          )}
        </button>
      </div>
    </AuthFieldShell>
  );
}

type AuthCheckboxFieldProps = Omit<ComponentPropsWithoutRef<"input">, "type" | "className"> & {
  label: string;
  error?: string | undefined;
  helperId: string;
};

export function AuthCheckboxField({
  label,
  error,
  helperId,
  ...inputProps
}: AuthCheckboxFieldProps) {
  return (
    <div className="flex w-full flex-col items-start gap-0.5">
      <label className="flex w-full items-start gap-3 rounded-xl border border-border bg-white px-4 py-3 text-body-sm font-semibold tracking-auth text-text-strong">
        <input
          {...inputProps}
          aria-describedby={error ? helperId : undefined}
          aria-invalid={Boolean(error)}
          className="mt-1 h-4 w-4 rounded border-border text-brand focus:ring-brand"
          type="checkbox"
        />
        <span>{label}</span>
      </label>
      {error ? (
        <p className={helperClassName} id={helperId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
