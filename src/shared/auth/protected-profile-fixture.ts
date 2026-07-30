import { ProtectedRequestError } from "@/shared/api/server/protected-request";
import type { ProtectedServerRequestResult } from "@/shared/api/server/authenticated-client";
import type { SessionEnvelope } from "@/shared/auth/session-schema";

export const authE2eFixtureTokens = {
  user: "opaque-session-token-user",
  admin: "opaque-session-token-admin",
  expired: "opaque-session-token-expired",
  forbidden: "opaque-session-token-forbidden",
} as const;

type ProtectedProfileFixture = {
  name: string;
  email: string;
  activeLoanCount: number;
};

function createProtectedFixtureError(type: "session-ended" | "forbidden") {
  return new ProtectedRequestError(type, {
    source: "http",
    code: type === "session-ended" ? "unauthenticated" : "forbidden",
    message: type === "session-ended" ? "Deterministic protected fixture session expired." : "Deterministic protected fixture forbidden.",
    status: type === "session-ended" ? 401 : 403,
  });
}

export function resolveProtectedProfileFixture(
  envelope: SessionEnvelope | null,
): ProtectedServerRequestResult<ProtectedProfileFixture> {
  if (!envelope) {
    return {
      status: "failure",
      error: createProtectedFixtureError("session-ended"),
    };
  }

  if (envelope.jwt === authE2eFixtureTokens.expired) {
    return {
      status: "failure",
      error: createProtectedFixtureError("session-ended"),
    };
  }

  if (envelope.jwt === authE2eFixtureTokens.forbidden) {
    return {
      status: "failure",
      error: createProtectedFixtureError("forbidden"),
    };
  }

  if (envelope.jwt === authE2eFixtureTokens.admin) {
    return {
      status: "success",
      data: {
        name: "Booky Admin",
        email: "admin@booky.test",
        activeLoanCount: 0,
      },
    };
  }

  if (envelope.jwt === authE2eFixtureTokens.user) {
    return {
      status: "success",
      data: {
        name: "Booky Reader",
        email: "reader@booky.test",
        activeLoanCount: 3,
      },
    };
  }

  return {
    status: "failure",
    error: createProtectedFixtureError("session-ended"),
  };
}
