export const cartQueryKeys = {
  all: () => ["cart"] as const,
  current: () => ["cart", "current"] as const,
  checkout: () => ["cart", "checkout"] as const,
} as const;
