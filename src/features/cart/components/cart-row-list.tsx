import type { CartRowPresentation } from "@/entities/cart";
import { CartRow, type CartRowCopy } from "@/features/cart/components/cart-row";
import type { AppLocale } from "@/shared/i18n/config";
import { cn } from "@/shared/lib/utils";

export type CartRowListProps = {
  rows: readonly CartRowPresentation[];
  locale: AppLocale;
  copy: CartRowCopy;
  isSelected: (cartItemId: number) => boolean;
  onToggleSelect: (cartItemId: number) => void;
  className?: string | undefined;
};

export function CartRowList({ rows, locale, copy, isSelected, onToggleSelect, className }: CartRowListProps) {
  return (
    <ul className={cn("flex flex-col divide-y divide-neutral-300", className)} data-cart-row-list="true">
      {rows.map((row) => (
        <CartRow
          copy={copy}
          isSelected={isSelected(row.cartItemId)}
          key={row.cartItemId}
          locale={locale}
          onToggleSelect={onToggleSelect}
          row={row}
        />
      ))}
    </ul>
  );
}
