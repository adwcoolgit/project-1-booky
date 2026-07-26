export const normalizedErrorCodes = [
  "unknown",
  "network",
  "bad-request",
  "unauthenticated",
  "forbidden",
  "not-found",
  "conflict",
  "rate-limit",
  "server-error",
] as const;

export type NormalizedErrorCode = (typeof normalizedErrorCodes)[number];

export type NormalizedError = {
  code: NormalizedErrorCode;
  message: string;
  status: number | null;
  details?: string | undefined;
  cause?: unknown;
};

export function createNormalizedError(input: NormalizedError): NormalizedError {
  return input;
}
