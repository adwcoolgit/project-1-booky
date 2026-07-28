import type { CategoryPresentation, CategorySummary } from "@/entities/category/model";
import type { AppLocale } from "@/shared/i18n/config";

const categoryArtworkPalettes = [
  ["#F3E6D4", "#D98B42", "#73411D"],
  ["#E6EEF8", "#3C78C6", "#1E3B63"],
  ["#E9F5EA", "#53A267", "#275233"],
  ["#F6EBDD", "#C56B46", "#6B3425"],
] as const;

function createCategoryArtworkFallback(name: string, id: number) {
  const [background, accent, text] = categoryArtworkPalettes[id % categoryArtworkPalettes.length] ?? categoryArtworkPalettes[0];
  const initial = name.trim().charAt(0).toUpperCase() || "C";

  return (
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360" fill="none"><rect width="480" height="360" rx="32" fill="${background}"/><circle cx="380" cy="84" r="88" fill="${accent}" opacity="0.16"/><circle cx="96" cy="298" r="120" fill="${accent}" opacity="0.12"/><rect x="44" y="52" width="220" height="164" rx="28" fill="${accent}" opacity="0.18"/><path d="M78 122h152" stroke="${text}" stroke-width="14" stroke-linecap="round" opacity="0.72"/><path d="M78 158h108" stroke="${text}" stroke-width="14" stroke-linecap="round" opacity="0.44"/><text x="240" y="280" text-anchor="middle" font-family="Quicksand, Arial, sans-serif" font-size="96" font-weight="700" fill="${text}">${initial}</text></svg>`,
    )
  );
}

export function mapCategorySummaryToPresentation(category: CategorySummary, locale: AppLocale): CategoryPresentation {
  return {
    id: category.id,
    href: `/${locale}/categories/${category.slug}`,
    name: category.name,
    slug: category.slug,
    artwork: {
      src: category.artwork ?? createCategoryArtworkFallback(category.name, category.id),
      alt: category.artwork ? category.name : "",
      isFallback: category.artwork === null,
    },
  };
}