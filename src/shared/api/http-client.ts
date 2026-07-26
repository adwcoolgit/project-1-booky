import axios, { type AxiosInstance, type CreateAxiosDefaults } from "axios";

import { runtimeConfig } from "@/shared/config/runtime";
import type { AppLocale } from "@/shared/i18n/config";
import type { NormalizedError } from "@/shared/lib/errors/normalized-error";

export type HttpError = NormalizedError & {
  source: "http";
};

function mapStatusToCode(status: number | null): NormalizedError["code"] {
  switch (status) {
    case 0:
    case null:
      return "network";
    case 400:
      return "bad-request";
    case 401:
      return "unauthenticated";
    case 403:
      return "forbidden";
    case 404:
      return "not-found";
    case 409:
      return "conflict";
    case 429:
      return "rate-limit";
    default:
      return status !== null && status >= 500 ? "server-error" : "unknown";
  }
}

export function toHttpError(error: unknown): HttpError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? null;

    return {
      source: "http",
      code: mapStatusToCode(status),
      message: error.message,
      status,
      details: typeof error.response?.data === "string" ? error.response.data : undefined,
      cause: error,
    };
  }

  if (error instanceof Error) {
    return {
      source: "http",
      code: "unknown",
      message: error.message,
      status: null,
      cause: error,
    };
  }

  return {
    source: "http",
    code: "unknown",
    message: "Unexpected transport failure.",
    status: null,
    cause: error,
  };
}

function toHttpErrorInstance(error: unknown): Error & HttpError {
  const normalized = toHttpError(error);
  const wrapped = new Error(normalized.message) as Error & HttpError;

  Object.assign(wrapped, normalized);

  return wrapped;
}

export function createHttpClient(locale?: AppLocale, config: CreateAxiosDefaults = {}): AxiosInstance {
  const headers = {
    Accept: "application/json",
    ...(locale ? { "Accept-Language": locale } : {}),
    ...(config.headers ?? {}),
  };

  const client = axios.create({
    baseURL: runtimeConfig.apiBaseUrl,
    timeout: 10000,
    ...config,
    headers,
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(toHttpErrorInstance(error)),
  );

  return client;
}
