import type { AxiosInstance } from "axios";

import type { RecommendationsCollectionDto } from "@/features/discovery/api/schemas";
import { recommendationsCollectionDtoSchema } from "@/features/discovery/api/schemas";
import type { RecommendationQuery } from "@/features/discovery/model/discovery-query";

export async function getRecommendedBooks(
  client: AxiosInstance,
  params: RecommendationQuery,
): Promise<RecommendationsCollectionDto> {
  const response = await client.get("/books/recommend", { params });

  return recommendationsCollectionDtoSchema.parse(response.data);
}