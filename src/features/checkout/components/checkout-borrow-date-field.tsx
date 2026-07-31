"use client";

import { cn } from "@/shared/lib/utils";

export type CheckoutBorrowDateFieldCopy = {
  label: string;
  estimateNotice: string;
};

export type CheckoutBorrowDateFieldProps = {
  value: string;
  onChange: (value: string) => void;
  minDate: string;
  copy: CheckoutBorrowDateFieldCopy;
  className?: string | undefined;
};

export function CheckoutBorrowDateField({ value, onChange, minDate, copy, className }: CheckoutBorrowDateFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)} data-checkout-borrow-date="true">
      <label className="text-sm font-semibold text-foreground" htmlFor="checkout-borrow-date">
        {copy.label}
      </label>
      <input
        className="w-full max-w-xs rounded-[10px] border border-border px-3 py-2 text-sm text-foreground focus:outline-brand"
        id="checkout-borrow-date"
        min={minDate}
        onChange={(event) => onChange(event.target.value)}
        type="date"
        value={value}
      />
      <p className="text-xs text-text-muted">{copy.estimateNotice}</p>
    </div>
  );
}
