import Image from "next/image";

import type { CartRowPresentation } from "@/entities/cart";
import { cn } from "@/shared/lib/utils";

export type CheckoutPreviewSummaryCopy = {
  title: string;
  booksTitle: string;
};

export type CheckoutPreviewSummaryProps = {
  userName: string | null;
  userEmail: string | null;
  userPhone: string | null;
  rows: readonly CartRowPresentation[];
  copy: CheckoutPreviewSummaryCopy;
  className?: string | undefined;
};

export function CheckoutPreviewSummary({
  userName,
  userEmail,
  userPhone,
  rows,
  copy,
  className,
}: CheckoutPreviewSummaryProps) {
  return (
    <section
      className={cn("rounded-[16px] border border-border bg-white p-5", className)}
      data-checkout-preview="true"
    >
      <h2 className="text-lg font-semibold text-foreground">{copy.title}</h2>
      <div className="mt-2 flex flex-col gap-0.5 text-sm text-text-muted">
        {userName ? <p>{userName}</p> : null}
        {userEmail ? <p>{userEmail}</p> : null}
        {userPhone ? <p>{userPhone}</p> : null}
      </div>

      <h3 className="mt-4 text-sm font-semibold text-foreground">{copy.booksTitle}</h3>
      <ul className="mt-2 flex flex-col gap-3" data-checkout-preview-rows="true">
        {rows.map((row) => (
          <li className="flex items-center gap-3" data-checkout-row={row.cartItemId} key={row.cartItemId}>
            <div
              className={cn(
                "relative h-14 w-11 shrink-0 overflow-hidden rounded-[6px]",
                row.coverImage.isFallback ? "bg-brand-subtle" : "bg-muted/50",
              )}
            >
              <Image
                alt={row.coverImage.alt}
                className="h-full w-full object-cover"
                fill
                sizes="44px"
                src={row.coverImage.src}
                unoptimized
              />
            </div>
            <div className="flex flex-col">
              <p className="line-clamp-1 text-sm font-semibold text-foreground">{row.title}</p>
              {row.authorName ? <p className="text-xs text-text-muted">{row.authorName}</p> : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
