"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/shared/lib/utils";

export type CheckoutDurationOption = 3 | 5 | 10;

const DURATION_OPTIONS: readonly CheckoutDurationOption[] = [3, 5, 10];

export type CheckoutDurationSelectCopy = {
  label: string;
};

export type CheckoutDurationSelectProps = {
  value: CheckoutDurationOption;
  onChange: (value: CheckoutDurationOption) => void;
  copy: CheckoutDurationSelectCopy;
  className?: string | undefined;
};

export function CheckoutDurationSelect({ value, onChange, copy, className }: CheckoutDurationSelectProps) {
  const t = useTranslations("Checkout");

  return (
    <fieldset className={cn("flex flex-col gap-3", className)} data-checkout-duration="true">
      <legend className="text-sm font-bold leading-7 tracking-tight2 text-neutral-950 lg:text-base lg:leading-7.5">
        {copy.label}
      </legend>
      <div className="flex flex-wrap items-center gap-4" role="radiogroup">
        {DURATION_OPTIONS.map((option) => (
          <button
            aria-pressed={value === option}
            className="flex items-center gap-2 transition"
            data-checkout-duration-option={option}
            key={option}
            onClick={() => onChange(option)}
            type="button"
          >
            <span
              aria-hidden="true"
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                value === option ? "border-brand bg-brand" : "border-neutral-400 bg-white",
              )}
            >
              {value === option ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
            </span>
            <span className="text-sm font-semibold leading-7 tracking-tight2 text-neutral-950 lg:text-base lg:leading-7.5">
              {t("durationDays", { count: option })}
            </span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
