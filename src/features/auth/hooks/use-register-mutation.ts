"use client";

import { useMutation } from "@tanstack/react-query";

import type { RegisterFormInput } from "@/features/auth/model/register-form";
import { parseRegisterSuccessResult } from "@/features/auth/model/login-outcome";
import { registerWithBff } from "@/shared/api/bff/auth-client";

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (input: RegisterFormInput) => parseRegisterSuccessResult(await registerWithBff(input)),
  });
}
