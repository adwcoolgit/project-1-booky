"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { discoveryPageDefault, type DiscoveryQueryState } from "@/features/discovery/model/discovery-query";
import {
  applyDiscoverySearchPatch,
  createDiscoverySearchParams,
  normalizeDiscoverySearchParams,
  type NormalizeDiscoverySearchParamsOptions,
} from "@/features/discovery/model/discovery-search-params";

export function useDiscoverySearchParams(options: NormalizeDiscoverySearchParamsOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startNavigation] = useTransition();
  const state = normalizeDiscoverySearchParams(searchParams, options);

  function replaceState(patch: Partial<DiscoveryQueryState>) {
    startNavigation(() => {
      const nextState = applyDiscoverySearchPatch(state, patch, options);
      const nextSearchParams = createDiscoverySearchParams(nextState, options).toString();
      const href = nextSearchParams.length > 0 ? `${pathname}?${nextSearchParams}` : pathname;

      router.replace(href, { scroll: false });
    });
  }

  function createHref(patch: Partial<DiscoveryQueryState>) {
    const nextState = applyDiscoverySearchPatch(state, patch, options);
    const nextSearchParams = createDiscoverySearchParams(nextState, options).toString();

    return nextSearchParams.length > 0 ? `${pathname}?${nextSearchParams}` : pathname;
  }

  function resetFilters() {
    replaceState({
      q: undefined,
      categoryId: null,
      authorId: null,
      minRating: null,
      page: discoveryPageDefault,
    });
  }

  return {
    state,
    isPending,
    replaceState,
    createHref,
    resetFilters,
  };
}