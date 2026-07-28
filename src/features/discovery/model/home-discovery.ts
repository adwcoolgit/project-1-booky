import type { AuthorPresentation } from "@/entities/author";
import type { BookPresentation } from "@/entities/book";
import type { CategoryPresentation } from "@/entities/category";

export type HomeDiscoveryCollectionState<TItem> =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "error" }
  | { status: "ready"; items: TItem[]; isStale?: boolean };

export type HomeDiscoveryViewModel = {
  categories: HomeDiscoveryCollectionState<CategoryPresentation>;
  recommendations: HomeDiscoveryCollectionState<BookPresentation>;
  popularAuthors: HomeDiscoveryCollectionState<AuthorPresentation>;
};