"use client";

import { useMutation } from "@tanstack/react-query";

import type { AuthSurface } from "@/features/auth/config/auth-routes";
import { parseLogoutSuccessResult } from "@/features/auth/model/login-outcome";
import { logoutWithBff } from "@/shared/api/bff/auth-client";

export function useLogoutMutation() {
  return useMutation({
    mutationFn: async ({
      locale,
      surface,
      returnTo,
    }: {
      locale: string;
      surface: AuthSurface;
      returnTo?: string | null;
    }) => parseLogoutSuccessResult(await logoutWithBff({ locale, surface, ...(returnTo === undefined ? {} : { returnTo }) })),
  });
}
