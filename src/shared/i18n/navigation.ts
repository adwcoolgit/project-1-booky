import { createNavigation } from "next-intl/navigation";

import { routing } from "@/shared/i18n/routing";

export const { Link, getPathname, redirect, usePathname, useRouter } = createNavigation(routing);

export function buildPathWithSearchParams(
  pathname: string,
  searchParams: Record<string, string | null | undefined>,
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (value) {
      params.set(key, value);
    }
  }

  const query = params.toString();

  return query ? `${pathname}?${query}` : pathname;
}
