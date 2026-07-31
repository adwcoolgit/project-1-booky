import type { AxiosInstance } from "axios";

import { createBffClient } from "@/shared/api/bff/bff-client";

export function createCheckoutBffClient(): AxiosInstance {
  return createBffClient();
}

export * from "@/features/checkout/api/checkout";
export * from "@/features/checkout/api/loans";
export * from "@/features/checkout/api/schemas";
