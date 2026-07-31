import type { AxiosInstance } from "axios";

import { cartCheckoutResponseDtoSchema, type CartCheckoutResponseDto } from "@/features/checkout/api/schemas";
import { createBffRequestError } from "@/shared/api/bff/bff-client";

export async function getCartCheckout(client: AxiosInstance): Promise<CartCheckoutResponseDto> {
  try {
    const response = await client.get("/api/cart/checkout");

    return cartCheckoutResponseDtoSchema.parse(response.data);
  } catch (error) {
    throw createBffRequestError(error);
  }
}
