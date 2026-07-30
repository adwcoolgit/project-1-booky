import Image from "next/image";

export function AuthBrandLockup() {
  return (
    <div className="flex items-center gap-3">
      <Image
        alt=""
        aria-hidden="true"
        className="h-logo w-logo shrink-0"
        height={33}
        priority
        src="/assets/logo.svg"
        width={33}
      />
      <span className="font-display text-auth-brand font-bold text-text-strong">
        Booky
      </span>
    </div>
  );
}
