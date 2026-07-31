import axios, { type AxiosInstance } from "axios";

import { toHttpError, type HttpError } from "@/shared/api/http-client";

export type BffRequestError = Error &
  HttpError & {
    payload: unknown;
  };

export function createBffClient(): AxiosInstance {
  return axios.create({
    headers: {
      Accept: "application/json",
    },
    timeout: 10000,
  });
}

export function createBffRequestError(error: unknown): BffRequestError {
  const normalized = toHttpError(error);
  const wrapped = new Error(normalized.message) as BffRequestError;
  const payload: unknown = axios.isAxiosError(error) ? (error.response?.data as unknown) : null;

  Object.assign(wrapped, normalized, { payload });

  return wrapped;
}

export function isBffRequestError(error: unknown): error is BffRequestError {
  return error instanceof Error && "payload" in error && "source" in error;
}
