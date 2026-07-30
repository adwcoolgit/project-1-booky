"use client";

type AuthSubmitProps = {
  idleLabel: string;
  pendingLabel: string;
  pending: boolean;
  className?: string;
};

export function AuthSubmit({ idleLabel, pendingLabel, pending, className }: AuthSubmitProps) {
  return (
    <button
      aria-busy={pending}
      className={className ?? "inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-70"}
      disabled={pending}
      type="submit"
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
