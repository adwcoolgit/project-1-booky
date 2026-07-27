"use client";

import { useMutation } from "@tanstack/react-query";

import type { LoginFormInput } from "@/features/auth/model/login-form";
import { parseLoginSuccessResult } from "@/features/auth/model/login-outcome";
import { loginWithBff } from "@/shared/api/bff/auth-client";

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (input: LoginFormInput) => parseLoginSuccessResult(await loginWithBff(input)),
  });
}
