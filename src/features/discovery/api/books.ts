import type { AxiosInstance } from "axios";

import type { BookDetailResponseDto, BooksCollectionDto } from "@/features/discovery/api/schemas";
import {
  bookDetailResponseDtoSchema,
  booksCollectionDtoSchema,
} from "@/features/discovery/api/schemas";
import type { DiscoveryListQuery } from "@/features/discovery/model/discovery-query";

export async function getBooks(
  client: AxiosInstance,
  params: DiscoveryListQuery,
): Promise<BooksCollectionDto> {
  const response = await client.get("/books", { params });

  return booksCollectionDtoSchema.parse(response.data);
}

export async function getBookDetail(
  client: AxiosInstance,
  bookId: number,
): Promise<BookDetailResponseDto> {
  const response = await client.get(`/books/${bookId}`);

  return bookDetailResponseDtoSchema.parse(response.data);
}