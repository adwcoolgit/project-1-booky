import type { CartRow, CartRowPresentation } from "@/entities/cart";

export type CheckoutUser = {
  name: string | null;
  email: string | null;
  phone: string | null;
};

export type CheckoutPreview = {
  user: CheckoutUser;
  rows: CartRow[];
};

export type CheckoutPreviewPresentation = {
  user: CheckoutUser;
  rows: CartRowPresentation[];
};
