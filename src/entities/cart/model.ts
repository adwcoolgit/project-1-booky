export type CartItemEligibility =
  | { status: "eligible" }
  | { status: "ineligible"; reason: "unavailable" | "stale" };

export type CartRow = {
  cartItemId: number;
  bookId: number;
  title: string;
  authorName: string | null;
  categoryLabel: string | null;
  coverImageUrl: string | null;
  eligibility: CartItemEligibility;
};

export type ServerCart = {
  rows: CartRow[];
  itemCount: number;
};

export type CartRowPresentation = {
  cartItemId: number;
  bookId: number;
  title: string;
  authorName: string | null;
  categoryLabel: string | null;
  isEligible: boolean;
  ineligibleReasonLabel: string | null;
  coverImage: {
    src: string;
    alt: string;
    isFallback: boolean;
  };
};

export type ServerCartPresentation = {
  rows: CartRowPresentation[];
  itemCount: number;
  itemCountLabel: string;
};
