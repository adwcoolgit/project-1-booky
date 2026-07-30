import type { AxiosInstance } from "axios";

import type { CategoriesCollectionDto } from "@/features/discovery/api/schemas";
import { categoriesCollectionDtoSchema } from "@/features/discovery/api/schemas";

export async function getCategories(client: AxiosInstance): Promise<CategoriesCollectionDto> {
  const response = await client.get("/categories");

  return categoriesCollectionDtoSchema.parse(response.data);
}