import axios from "axios";

import { parseClientSessionSnapshot, type ClientSessionSnapshot } from "@/shared/auth/session-schema";
import type { AuthSurface } from "@/shared/auth/route-access";
import { toHttpError, type HttpError } from "@/shared/api/http-client";

const bffAuthClient = axios.create({
  headers: {
    Accept: "application/json",
  },
  timeout: 10000,
});

export type BffAuthError = Error & HttpError & {
  payload: unknown;
};

function createBffAuthError(error: unknown): BffAuthError {
  const normalized = toHttpError(error);
  const wrapped = new Error(normalized.message) as BffAuthError;
  const payload: unknown = axios.isAxiosError(error) ? (error.response?.data as unknown) : null;

  Object.assign(wrapped, normalized, {
    payload,
  });

  return wrapped;
}

export function isBffAuthError(error: unknown): error is BffAuthError {
  return error instanceof Error && "payload" in error && "source" in error;
}

export async function registerWithBff(payload: unknown): Promise<unknown> {
  try {
    const response = await bffAuthClient.post("/api/auth/register", payload);

    return response.data;
  } catch (error) {
    throw createBffAuthError(error);
  }
}

export async function loginWithBff(payload: unknown): Promise<unknown> {
  try {
    const response = await bffAuthClient.post("/api/auth/login", payload);

    return response.data;
  } catch (error) {
    throw createBffAuthError(error);
  }
}

export async function readSessionSnapshotFromBff(): Promise<ClientSessionSnapshot> {
  try {
    const response = await bffAuthClient.get("/api/auth/session");
    const parsed = parseClientSessionSnapshot(response.data);

    if (!parsed) {
      throw new Error("Invalid session snapshot response.");
    }

    return parsed;
  } catch (error) {
    throw createBffAuthError(error);
  }
}

export async function logoutWithBff({
  locale,
  surface,
  returnTo,
  reason,
}: {
  locale: string;
  surface: AuthSurface;
  returnTo?: string | null;
  reason?: "logged-out" | "expired";
}): Promise<unknown> {
  try {
    const searchParams = new URLSearchParams({
      locale,
      surface,
      reason: reason ?? "logged-out",
    });

    if (returnTo) {
      searchParams.set("returnTo", returnTo);
    }

    const response = await bffAuthClient.post(`/api/auth/logout?${searchParams.toString()}`);

    return response.data;
  } catch (error) {
    throw createBffAuthError(error);
  }
}
