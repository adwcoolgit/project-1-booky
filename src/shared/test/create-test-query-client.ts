import { QueryClient } from "@tanstack/react-query";

import { queryClientDefaults } from "@/shared/providers/query-client";

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        ...queryClientDefaults.queries,
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        ...queryClientDefaults.mutations,
      },
    },
  });
}
