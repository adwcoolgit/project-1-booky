import "server-only";

import type { AxiosInstance } from "axios";

import { createHttpClient } from "@/shared/api/http-client";
import { ProtectedRequestError, executeProtectedRequest } from "@/shared/api/server/protected-request";
import { readSessionEnvelope } from "@/shared/auth/session.server";
import type { SessionEnvelope } from "@/shared/auth/session-schema";
import type { AppLocale } from "@/shared/i18n/config";

function createMissingSessionError() {
  return new ProtectedRequestError("session-ended", {
    source: "http",
    code: "unauthenticated",
    message: "Missing authenticated session.",
    status: 401,
  });
}

export function createAuthenticatedServerClientFromEnvelope(
  envelope: SessionEnvelope,
  locale?: AppLocale,
): AxiosInstance {
  return createHttpClient(locale, {
    headers: {
      Authorization: `Bearer ${envelope.jwt}`,
    },
  });
}

export async function createAuthenticatedServerClient(locale?: AppLocale): Promise<AxiosInstance> {
  const envelope = await readSessionEnvelope();

  if (!envelope) {
    throw createMissingSessionError();
  }

  return createAuthenticatedServerClientFromEnvelope(envelope, locale);
}

export async function executeWithAuthenticatedServerClient<T>(
  request: (client: AxiosInstance) => Promise<T>,
  locale?: AppLocale,
): Promise<T> {
  const client = await createAuthenticatedServerClient(locale);

  return executeProtectedRequest(() => request(client));
}

export type ProtectedServerRequestResult<T> =
  | {
      status: "success";
      data: T;
    }
  | {
      status: "failure";
      error: ProtectedRequestError;
    };

export async function executeProtectedServerRequest<T>(
  request: (client: AxiosInstance) => Promise<T>,
  locale?: AppLocale,
): Promise<ProtectedServerRequestResult<T>> {
  try {
    const data = await executeWithAuthenticatedServerClient(request, locale);

    return {
      status: "success",
      data,
    };
  } catch (error) {
    if (error instanceof ProtectedRequestError) {
      return {
        status: "failure",
        error,
      };
    }

    throw error;
  }
}
