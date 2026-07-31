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
    <fieldset className={cn("flex flex-col gap-2", className)} data-checkout-duration="true">
      <legend className="text-sm font-semibold text-foreground">{copy.label}</legend>
      <div className="flex flex-wrap gap-2" role="radiogroup">
        {DURATION_OPTIONS.map((option) => (
          <button
            aria-pressed={value === option}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              value === option
                ? "border-brand bg-brand text-white"
                : "border-border bg-white text-neutral-950 hover:bg-neutral-50",
            )}
            data-checkout-duration-option={option}
            key={option}
            onClick={() => onChange(option)}
            type="button"
          >
            {t("durationDays", { count: option })}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
