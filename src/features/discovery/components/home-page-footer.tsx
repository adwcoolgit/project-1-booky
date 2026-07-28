import Image from "next/image";
import Link from "next/link";

type HomePageFooterProps = {
  locale: string;
  brandLabel: string;
  description: string;
  socialLabel: string;
};

function FacebookIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-neutral-950" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5 21v-7h2.4l.36-2.73H13.5V9.53c0-.8.22-1.34 1.37-1.34H16.5V5.75A19.3 19.3 0 0 0 14.15 5c-2.33 0-3.93 1.42-3.93 4.04v2.23H7.5V14h2.72v7h3.28Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-neutral-950" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect height="14" rx="4" stroke="currentColor" strokeWidth="1.8" width="14" x="5" y="5" />
      <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.4" cy="7.6" fill="currentColor" r="1" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-neutral-950" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.94 8.5H4.06V20h2.88V8.5ZM5.5 4A1.7 1.7 0 1 0 5.54 7.4 1.7 1.7 0 0 0 5.5 4ZM20 13.02c0-3.48-1.86-5.1-4.35-5.1-2 0-2.9 1.1-3.4 1.88V8.5H9.38c.04.86 0 11.5 0 11.5h2.88v-6.42c0-.34.03-.69.12-.93.27-.69.9-1.4 1.96-1.4 1.38 0 1.93 1.05 1.93 2.59V20H20v-6.98Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 text-neutral-950" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.9 3c.2 1.63 1.14 3.08 2.57 3.92.82.48 1.76.74 2.72.75v2.94a7.53 7.53 0 0 1-4.13-1.24v5.7A5.06 5.06 0 1 1 11 10.02v3.03a2.02 2.02 0 1 0 2.02 2.02V3h1.88Z" />
    </svg>
  );
}

export function HomePageFooter({ locale, brandLabel, description, socialLabel }: HomePageFooterProps) {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto flex w-full max-w-canvas justify-center px-4 py-12 md:px-8 md:py-16 xl:px-[150px] xl:py-20">
        <div className="flex w-full max-w-[71.25rem] flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-[22px] text-center">
            <Link className="flex items-center gap-[15px]" href={`/${locale}`}>
              <Image alt="" aria-hidden="true" height={42} src="/assets/logo.svg" width={42} />
              <span className="font-display text-[32px] font-bold leading-[42px] text-neutral-950">{brandLabel}</span>
            </Link>
            <p className="text-base font-semibold leading-[30px] tracking-[-0.02em] text-neutral-950">{description}</p>
          </div>

          <div className="flex flex-col items-center gap-5">
            <p className="text-base font-bold leading-[30px] text-neutral-950">{socialLabel}</p>
            <div aria-hidden="true" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border"><FacebookIcon /></span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border"><InstagramIcon /></span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border"><LinkedInIcon /></span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border"><TikTokIcon /></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
