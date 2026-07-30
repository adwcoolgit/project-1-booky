import type { AxiosInstance } from "axios";

import type { AuthorBooksResponseDto, AuthorsCollectionDto } from "@/features/discovery/api/schemas";
import {
  authorBooksResponseDtoSchema,
  authorsCollectionDtoSchema,
} from "@/features/discovery/api/schemas";
import type {
  AuthorsListQuery,
  AuthorsPopularQuery,
  AuthorBooksQuery,
} from "@/features/discovery/model/discovery-query";

export async function getAuthors(
  client: AxiosInstance,
  params: AuthorsListQuery,
): Promise<AuthorsCollectionDto> {
  const response = await client.get("/authors", { params });

  return authorsCollectionDtoSchema.parse(response.data);
}

export async function getPopularAuthors(
  client: AxiosInstance,
  params: AuthorsPopularQuery,
): Promise<AuthorsCollectionDto> {
  const response = await client.get("/authors/popular", { params });

  return authorsCollectionDtoSchema.parse(response.data);
}

export async function getAuthorBooks(
  client: AxiosInstance,
  authorId: number,
  params: AuthorBooksQuery,
): Promise<AuthorBooksResponseDto> {
  const response = await client.get(`/authors/${authorId}/books`, { params });

  return authorBooksResponseDtoSchema.parse(response.data);
}