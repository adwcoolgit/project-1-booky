import type { QueryClient, QueryKey } from "@tanstack/react-query";

import { getQueryRoot } from "@/shared/providers/query-client";

export const privateQueryScopes = [
  { queryRoot: "auth-session", requiresAuthentication: true, roleScope: "shared-private" },
  { queryRoot: "cart", requiresAuthentication: true, roleScope: "shared-private" },
  { queryRoot: "loans", requiresAuthentication: true, roleScope: "shared-private" },
  { queryRoot: "me", requiresAuthentication: true, roleScope: "shared-private" },
  { queryRoot: "reviews", requiresAuthentication: true, roleScope: "shared-private" },
  { queryRoot: "admin-overview", requiresAuthentication: true, roleScope: "ADMIN" },
  { queryRoot: "admin-users", requiresAuthentication: true, roleScope: "ADMIN" },
  { queryRoot: "admin-books", requiresAuthentication: true, roleScope: "ADMIN" },
  { queryRoot: "admin-loans", requiresAuthentication: true, roleScope: "ADMIN" },
] as const;

export type PrivateQueryScope = (typeof privateQueryScopes)[number];

export function isPrivateQueryRoot(queryRoot: string | null): boolean {
  if (!queryRoot) {
    return false;
  }

  return privateQueryScopes.some((scope) => scope.queryRoot === queryRoot);
}

export function isPrivateQueryKey(queryKey: QueryKey): boolean {
  return isPrivateQueryRoot(getQueryRoot(queryKey));
}

export function clearPrivateQueryCache(queryClient: QueryClient): number {
  const privateQueries = queryClient.getQueryCache().findAll({
    predicate: (query) => isPrivateQueryKey(query.queryKey),
  });

  for (const query of privateQueries) {
    queryClient.removeQueries({ queryKey: query.queryKey, exact: true });
  }

  return privateQueries.length;
}
