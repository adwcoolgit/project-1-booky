import type { AppLocale } from "@/shared/i18n/config";
import { getCartFeatureMessages } from "@/shared/i18n/get-messages";
import type { CartRow, CartRowPresentation, ServerCart, ServerCartPresentation } from "@/entities/cart/model";

const cartRowCoverFallback =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="280" height="420" viewBox="0 0 280 420" fill="none"><rect width="280" height="420" rx="24" fill="#F0E3D0"/><rect x="32" y="44" width="216" height="332" rx="18" fill="#C98A3D" opacity="0.28"/><path d="M62 88h156" stroke="#6E4A2A" stroke-width="12" stroke-linecap="round"/><path d="M62 132h124" stroke="#6E4A2A" stroke-width="12" stroke-linecap="round" opacity="0.7"/><path d="M62 176h92" stroke="#6E4A2A" stroke-width="12" stroke-linecap="round" opacity="0.5"/></svg>',
  );

function resolveIneligibleReasonLabel(
  row: CartRow,
  messages: ReturnType<typeof getCartFeatureMessages>,
): string | null {
  if (row.eligibility.status !== "ineligible") {
    return null;
  }

  return row.eligibility.reason === "unavailable" ? messages.ineligibleUnavailable : messages.ineligibleStale;
}

export function mapCartRowToPresentation(
  row: CartRow,
  options: { locale: AppLocale },
): CartRowPresentation {
  const messages = getCartFeatureMessages(options.locale);
  const title = row.title.length > 0 ? row.title : messages.unknownBookTitle;

  return {
    cartItemId: row.cartItemId,
    bookId: row.bookId,
    title,
    authorName: row.authorName,
    categoryLabel: row.categoryLabel,
    isEligible: row.eligibility.status === "eligible",
    ineligibleReasonLabel: resolveIneligibleReasonLabel(row, messages),
    coverImage: {
      src: row.coverImageUrl ?? cartRowCoverFallback,
      alt: row.coverImageUrl ? title : "",
      isFallback: row.coverImageUrl === null,
    },
  };
}

function resolveItemCountLabel(itemCount: number, options: { locale: AppLocale }): string {
  const messages = getCartFeatureMessages(options.locale);
  const template = itemCount === 1 ? messages.itemCountOne : messages.itemCountOther;

  return template.replace("{count}", new Intl.NumberFormat(options.locale).format(itemCount));
}

export function mapServerCartToPresentation(
  cart: ServerCart,
  options: { locale: AppLocale },
): ServerCartPresentation {
  return {
    rows: cart.rows.map((row) => mapCartRowToPresentation(row, options)),
    itemCount: cart.itemCount,
    itemCountLabel: resolveItemCountLabel(cart.itemCount, options),
  };
}
