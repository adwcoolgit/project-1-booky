import type { CategorySummary } from "@/entities/category/model";
import { createIdBackedSlug } from "@/shared/lib/slug";
import { extractCollectionItems } from "@/shared/lib/transport/partial-response";

type CategoryMapperDto = {
  id?: unknown;
  name?: unknown;
};

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function normalizeText(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

export function mapCategoryDtoToSummary(dto: CategoryMapperDto): CategorySummary | null {
  const id = isPositiveInteger(dto.id) ? dto.id : null;
  const name = normalizeText(dto.name);

  if (!id || !name) {
    return null;
  }

  return {
    id,
    name,
    slug: createIdBackedSlug(name, id, "category"),
    artwork: null,
  };
}

export function mapCategoriesCollectionDtoToSummaries(payload: unknown): CategorySummary[] {
  return extractCollectionItems<CategoryMapperDto>(payload, ["categories"])
    .map((dto) => mapCategoryDtoToSummary(dto))
    .filter((category): category is CategorySummary => category !== null);
}