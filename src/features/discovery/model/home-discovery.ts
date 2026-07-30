import type { AuthorPresentation } from "@/entities/author";
import type { BookPresentation } from "@/entities/book";
import type { CategoryPresentation } from "@/entities/category";

export type HomeDiscoveryReadyState<TItem> = {
  status: "ready";
  items: TItem[];
  isStale?: boolean;
};

export type HomeDiscoveryCollectionState<TItem> =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "error" }
  | HomeDiscoveryReadyState<TItem>;

export type HomeDiscoveryPaginatedCollectionState<TItem> =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "error" }
  | (HomeDiscoveryReadyState<TItem> & {
      page: number;
      limit: number;
      hasMore: boolean;
    });

export type HomeDiscoveryViewModel = {
  categories: HomeDiscoveryCollectionState<CategoryPresentation>;
  recommendations: HomeDiscoveryPaginatedCollectionState<BookPresentation>;
  popularAuthors: HomeDiscoveryCollectionState<AuthorPresentation>;
};