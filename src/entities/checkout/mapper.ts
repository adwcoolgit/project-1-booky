import { mapCartItemsCollectionDtoToRows } from "@/entities/cart/mapper";
import type { CheckoutPreview, CheckoutUser } from "@/entities/checkout/model";
import { isTransportRecord } from "@/shared/lib/transport/partial-response";

function normalizeText(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function mapUser(payload: unknown): CheckoutUser {
  if (!isTransportRecord(payload) || !isTransportRecord(payload.user)) {
    return { name: null, email: null, phone: null };
  }

  const user = payload.user;

  return {
    name: normalizeText(user.name),
    email: normalizeText(user.email),
    phone: normalizeText(user.phone),
  };
}

export function mapCartCheckoutResponseDtoToPreview(payload: unknown): CheckoutPreview {
  return {
    user: mapUser(payload),
    rows: mapCartItemsCollectionDtoToRows(payload),
  };
}
