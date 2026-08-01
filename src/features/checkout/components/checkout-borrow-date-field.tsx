"use client";

import CalendarIcon from "@iconify-react/tabler/calendar";

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
    <div className={cn("flex flex-col gap-0.5", className)} data-checkout-borrow-date="true">
      <label
        className="text-sm font-bold leading-7 tracking-tight2 text-neutral-950"
        htmlFor="checkout-borrow-date"
      >
        {copy.label}
      </label>
      <div className="flex h-12 items-center gap-2 rounded-xl border border-neutral-300 bg-neutral-100 px-4 py-2">
        <input
          className="w-full flex-1 bg-transparent text-base font-semibold leading-7.5 tracking-tight2 text-neutral-950 focus:outline-none"
          id="checkout-borrow-date"
          min={minDate}
          onChange={(event) => onChange(event.target.value)}
          type="date"
          value={value}
        />
        <CalendarIcon aria-hidden="true" className="h-5 w-5 shrink-0 text-neutral-950" />
      </div>
      <p className="text-xs text-text-muted">{copy.estimateNotice}</p>
    </div>
  );
}
