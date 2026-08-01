import Image from "next/image";

import type { CartRowPresentation } from "@/entities/cart";
import { cn } from "@/shared/lib/utils";

export type CheckoutPreviewSummaryCopy = {
  title: string;
  booksTitle: string;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
};

export type CheckoutPreviewSummaryProps = {
  userName: string | null;
  userEmail: string | null;
  userPhone: string | null;
  rows: readonly CartRowPresentation[];
  copy: CheckoutPreviewSummaryCopy;
  className?: string | undefined;
};

const sectionTitleClassName = "text-lg font-bold leading-8 tracking-tight3 text-neutral-950 lg:text-2xl lg:leading-9 lg:tracking-normal";

function UserInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium leading-7 tracking-tight3 text-neutral-950 lg:text-base lg:leading-7.5">
        {label}
      </span>
      <span className="text-sm font-bold leading-7 tracking-tight2 text-neutral-950 lg:text-base lg:leading-7.5">
        {value}
      </span>
    </div>
  );
}

export function CheckoutPreviewSummary({
  userName,
  userEmail,
  userPhone,
  rows,
  copy,
  className,
}: CheckoutPreviewSummaryProps) {
  return (
    <div className={cn("flex flex-col gap-4 lg:gap-8", className)} data-checkout-preview="true">
      <div className="flex flex-col gap-2 lg:gap-4">
        <h2 className={sectionTitleClassName}>{copy.title}</h2>
        {userName ? <UserInfoRow label={copy.nameLabel} value={userName} /> : null}
        {userEmail ? <UserInfoRow label={copy.emailLabel} value={userEmail} /> : null}
        {userPhone ? <UserInfoRow label={copy.phoneLabel} value={userPhone} /> : null}
      </div>

      <div className="h-px w-full bg-neutral-300" />

      <div className="flex flex-col gap-4">
        <h2 className={sectionTitleClassName}>{copy.booksTitle}</h2>
        <ul className="flex flex-col gap-4" data-checkout-preview-rows="true">
          {rows.map((row) => (
            <li className="flex items-center gap-3 lg:gap-4" data-checkout-row={row.cartItemId} key={row.cartItemId}>
              <div
                className={cn(
                  "relative h-cart-cover-h w-cart-cover-w shrink-0 overflow-hidden lg:h-cart-cover-h-lg lg:w-cart-cover-w-lg",
                  row.coverImage.isFallback ? "bg-brand-subtle" : "bg-muted/50",
                )}
              >
                <Image
                  alt={row.coverImage.alt}
                  className="h-full w-full object-cover"
                  fill
                  sizes="(min-width: 1024px) 92px, 70px"
                  src={row.coverImage.src}
                  unoptimized
                />
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                {row.categoryLabel ? (
                  <span className="inline-flex w-fit items-center rounded-xs border border-neutral-300 px-2 text-sm font-bold leading-7 tracking-tight2 text-neutral-950">
                    {row.categoryLabel}
                  </span>
                ) : null}
                <p className="line-clamp-1 text-base font-bold leading-7.5 tracking-tight2 text-neutral-950 lg:text-xl lg:leading-8.5">
                  {row.title}
                </p>
                {row.authorName ? (
                  <p className="text-sm font-medium leading-7 tracking-tight3 text-neutral-700 lg:text-base lg:leading-7.5">
                    {row.authorName}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
