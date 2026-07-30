import Image from "next/image";

export function AuthBrandLockup() {
  return (
    <div className="flex items-center gap-[11.79px] sm:gap-3 md:gap-3.5">
      <Image
        alt=""
        aria-hidden="true"
        className="h-[33px] w-[33px] shrink-0 sm:h-[35px] sm:w-[35px] md:h-[38px] md:w-[38px] lg:h-logo lg:w-logo"
        height={33}
        priority
        src="/assets/logo.svg"
        width={33}
      />
      <span className="font-display text-[25.1429px] font-bold leading-[33px] text-text-strong sm:text-[27px] sm:leading-[35px] md:text-[29px] md:leading-[38px] lg:text-auth-brand">
        Booky
      </span>
    </div>
  );
}