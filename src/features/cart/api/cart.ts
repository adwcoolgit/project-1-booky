import type { AxiosInstance } from "axios";

import { addToCartRequestDtoSchema, cartResponseDtoSchema, type CartResponseDto } from "@/features/cart/api/schemas";
import { createBffRequestError } from "@/shared/api/bff/bff-client";

export async function getCart(client: AxiosInstance): Promise<CartResponseDto> {
  try {
    const response = await client.get("/api/cart");

    return cartResponseDtoSchema.parse(response.data);
  } catch (error) {
    throw createBffRequestError(error);
  }
}

export async function addToCart(client: AxiosInstance, bookId: number): Promise<unknown> {
  try {
    const payload = addToCartRequestDtoSchema.parse({ bookId });
    const response = await client.post("/api/cart/items", payload);

    return response.data;
  } catch (error) {
    throw createBffRequestError(error);
  }
}

export async function removeCartItem(client: AxiosInstance, cartItemId: number): Promise<unknown> {
  try {
    const response = await client.delete(`/api/cart/items/${cartItemId}`);

    return response.data;
  } catch (error) {
    throw createBffRequestError(error);
  }
}

export async function clearCart(client: AxiosInstance): Promise<unknown> {
  try {
    const response = await client.delete("/api/cart");

    return response.data;
  } catch (error) {
    throw createBffRequestError(error);
  }
}
