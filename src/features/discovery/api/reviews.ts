import type { AxiosInstance } from "axios";

import type { ReviewsCollectionDto } from "@/features/discovery/api/schemas";
import { reviewsCollectionDtoSchema } from "@/features/discovery/api/schemas";
import type { ReviewsQuery } from "@/features/discovery/model/discovery-query";

export async function getBookReviews(
  client: AxiosInstance,
  bookId: number,
  params: ReviewsQuery,
): Promise<ReviewsCollectionDto> {
  const response = await client.get(`/reviews/book/${bookId}`, { params });

  return reviewsCollectionDtoSchema.parse(response.data);
}