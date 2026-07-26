import { QueryClient } from "@tanstack/react-query";

export const queryClientDefaults = {
  queries: {
    retry: 1,
    staleTime: 30_000,
    gcTime: 600_000,
    refetchOnWindowFocus: false,
  },
  mutations: {
    retry: 0,
  },
} as const;

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: queryClientDefaults,
  });
}
