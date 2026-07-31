"use client";

import { cn } from "@/shared/lib/utils";

export type CheckoutPolicyAgreementCopy = {
  agreement: string;
  policyRequired: string;
};

export type CheckoutPolicyAgreementProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  copy: CheckoutPolicyAgreementCopy;
  className?: string | undefined;
};

export function CheckoutPolicyAgreement({ checked, onChange, copy, className }: CheckoutPolicyAgreementProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)} data-checkout-policy="true">
      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
        <input
          checked={checked}
          className="h-5 w-5 shrink-0 rounded border-border text-brand focus:outline-brand"
          data-checkout-policy-checkbox="true"
          onChange={(event) => onChange(event.target.checked)}
          type="checkbox"
        />
        {copy.agreement}
      </label>
      {!checked ? (
        <p className="text-sm text-text-muted" data-checkout-policy-required="true" role="status">
          {copy.policyRequired}
        </p>
      ) : null}
    </div>
  );
}
