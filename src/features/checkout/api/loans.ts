import type { AxiosInstance } from "axios";

import { loanFromCartRequestDtoSchema, type LoanFromCartRequestDto } from "@/features/checkout/api/schemas";
import { createBffRequestError } from "@/shared/api/bff/bff-client";

export async function confirmLoanFromCart(client: AxiosInstance, request: LoanFromCartRequestDto): Promise<unknown> {
  try {
    const payload = loanFromCartRequestDtoSchema.parse(request);
    const response = await client.post("/api/loans/from-cart", payload);

    return response.data;
  } catch (error) {
    throw createBffRequestError(error);
  }
}
