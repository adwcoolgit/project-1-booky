"use client";

import { cn } from "@/shared/lib/utils";

export type CartSelectAllProps = {
  label: string;
  eligibleCount: number;
  selectedEligibleCount: number;
  onSelectAll: () => void;
  onClear: () => void;
  className?: string | undefined;
};

export function CartSelectAll({
  label,
  eligibleCount,
  selectedEligibleCount,
  onSelectAll,
  onClear,
  className,
}: CartSelectAllProps) {
  const isAllSelected = eligibleCount > 0 && selectedEligibleCount === eligibleCount;

  return (
    <label
      className={cn(
        "flex items-center gap-4 text-base font-semibold leading-7.5 tracking-tight2 text-neutral-950",
        className,
      )}
      data-cart-select-all="true"
    >
      <input
        aria-label={label}
        checked={isAllSelected}
        className="h-5 w-5 rounded-xs border-neutral-400 accent-brand disabled:cursor-not-allowed disabled:opacity-50"
        disabled={eligibleCount === 0}
        onChange={() => (isAllSelected ? onClear() : onSelectAll())}
        type="checkbox"
      />
      {label}
    </label>
  );
}
