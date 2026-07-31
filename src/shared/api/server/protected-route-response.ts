import "server-only";

import { NextResponse } from "next/server";

import { ProtectedRequestError } from "@/shared/api/server/protected-request";

const failureTypeStatus: Record<ProtectedRequestError["failureType"], number> = {
  "session-ended": 401,
  forbidden: 403,
  transport: 502,
};

export function mapProtectedRequestErrorToResponse(error: ProtectedRequestError) {
  const status = error.httpError.status ?? failureTypeStatus[error.failureType];

  return NextResponse.json(
    {
      message: error.httpError.message,
      code: error.httpError.code,
    },
    { status },
  );
}

export function createForbiddenOriginError(message = "Disallowed origin for this request."): ProtectedRequestError {
  return new ProtectedRequestError("forbidden", {
    source: "http",
    code: "forbidden",
    message,
    status: 403,
  });
}

export function createInvalidRequestError(message = "Invalid request payload."): ProtectedRequestError {
  return new ProtectedRequestError("transport", {
    source: "http",
    code: "bad-request",
    message,
    status: 400,
  });
}
