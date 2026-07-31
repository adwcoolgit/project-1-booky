import type { AxiosInstance } from "axios";

import { createBffClient } from "@/shared/api/bff/bff-client";

export function createCartBffClient(): AxiosInstance {
  return createBffClient();
}

export * from "@/features/cart/api/cart";
export * from "@/features/cart/api/schemas";
