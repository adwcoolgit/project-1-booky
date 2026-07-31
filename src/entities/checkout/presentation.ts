import { mapCartRowToPresentation } from "@/entities/cart/presentation";
import type { CheckoutPreview, CheckoutPreviewPresentation } from "@/entities/checkout/model";
import type { AppLocale } from "@/shared/i18n/config";

export function mapCheckoutPreviewToPresentation(
  preview: CheckoutPreview,
  options: { locale: AppLocale },
): CheckoutPreviewPresentation {
  return {
    user: preview.user,
    rows: preview.rows.map((row) => mapCartRowToPresentation(row, options)),
  };
}
