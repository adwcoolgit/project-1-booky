import type { BookPresentation } from "@/entities/book";

export type DiscoveryResultsPagination = {
  page: number;
  hasPrevious: boolean;
  hasNext: boolean;
  total: number | null;
};

export type DiscoveryResultsViewState =
  | {
      status: "error";
    }
  | {
      status: "empty";
      pagination: DiscoveryResultsPagination;
    }
  | {
      status: "ready";
      items: BookPresentation[];
      pagination: DiscoveryResultsPagination;
    };