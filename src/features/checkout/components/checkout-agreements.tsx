"use client";

import { cn } from "@/shared/lib/utils";

export type CheckoutAgreementsCopy = {
  returnAcknowledgement: string;
  policyAgreement: string;
};

export type CheckoutAgreementsProps = {
  returnAcknowledged: boolean;
  onChangeReturnAcknowledged: (checked: boolean) => void;
  policyAccepted: boolean;
  onChangePolicyAccepted: (checked: boolean) => void;
  copy: CheckoutAgreementsCopy;
  className?: string | undefined;
};

function AgreementCheckbox({
  checked,
  onChange,
  label,
  testId,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  testId: string;
}) {
  return (
    <label className="flex items-center gap-4">
      <input
        checked={checked}
        className="h-5 w-5 shrink-0 rounded-xs border-neutral-400 accent-brand focus:outline-brand"
        data-testid={testId}
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span className="text-sm font-semibold leading-7 tracking-tight2 text-neutral-950 lg:text-base lg:leading-7.5">
        {label}
      </span>
    </label>
  );
}

export function CheckoutAgreements({
  returnAcknowledged,
  onChangeReturnAcknowledged,
  policyAccepted,
  onChangePolicyAccepted,
  copy,
  className,
}: CheckoutAgreementsProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} data-checkout-agreements="true">
      <AgreementCheckbox
        checked={returnAcknowledged}
        label={copy.returnAcknowledgement}
        onChange={onChangeReturnAcknowledged}
        testId="checkout-return-acknowledgement"
      />
      <AgreementCheckbox
        checked={policyAccepted}
        label={copy.policyAgreement}
        onChange={onChangePolicyAccepted}
        testId="checkout-policy-checkbox"
      />
    </div>
  );
}
