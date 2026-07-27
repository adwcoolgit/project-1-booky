import type { HttpError } from "@/shared/api/http-client";
import { toHttpError } from "@/shared/api/http-client";

export type ProtectedRequestFailureType = "session-ended" | "forbidden" | "transport";

export class ProtectedRequestError extends Error {
  readonly failureType: ProtectedRequestFailureType;
  readonly httpError: HttpError;

  constructor(failureType: ProtectedRequestFailureType, httpError: HttpError) {
    super(httpError.message);
    this.name = "ProtectedRequestError";
    this.failureType = failureType;
    this.httpError = httpError;
  }
}

export function createProtectedRequestError(error: unknown): ProtectedRequestError {
  const httpError = toHttpError(error);

  if (httpError.code === "unauthenticated") {
    return new ProtectedRequestError("session-ended", httpError);
  }

  if (httpError.code === "forbidden") {
    return new ProtectedRequestError("forbidden", httpError);
  }

  return new ProtectedRequestError("transport", httpError);
}

export async function executeProtectedRequest<T>(request: () => Promise<T>): Promise<T> {
  try {
    return await request();
  } catch (error) {
    throw createProtectedRequestError(error);
  }
}
