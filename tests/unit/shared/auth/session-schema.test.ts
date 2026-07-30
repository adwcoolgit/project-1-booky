import { describe, expect, it } from "vitest";

import {
  createAuthenticatedSession,
  createClientSessionSnapshot,
  parseSessionEnvelope,
} from "@/shared/auth/session-schema";
import { decodeSessionCookieValue, encodeSessionCookieValue } from "@/shared/auth/session-cookie";
import { createSessionEnvelopeFixture } from "@/../tests/fixtures/auth/auth-fixtures";

describe("session schema and cookie helpers", () => {
  it("round-trips a session envelope through the signed cookie encoder", () => {
    const envelope = createSessionEnvelopeFixture("ADMIN", "id");
    const encoded = encodeSessionCookieValue(envelope);

    expect(decodeSessionCookieValue(encoded)).toEqual(envelope);
  });

  it("maps an authenticated session into a client-safe snapshot without JWT data", () => {
    const envelope = createSessionEnvelopeFixture("USER", "en");
    const snapshot = createClientSessionSnapshot(createAuthenticatedSession(envelope));

    expect(snapshot).toEqual({
      status: "authenticated",
      user: {
        id: envelope.userId,
        name: envelope.userName,
        email: envelope.userEmail,
        role: envelope.role,
      },
      locale: "en",
    });
    expect(JSON.stringify(snapshot)).not.toContain(envelope.jwt);
  });

  it("rejects invalid session envelopes and tampered cookie signatures", () => {
    const envelope = createSessionEnvelopeFixture("USER", "en");
    const encoded = encodeSessionCookieValue(envelope);
    const [version, encodedPayload, signature] = encoded.split(".");
    const tampered = `${version}.${encodedPayload}.tampered-${signature}`;

    expect(parseSessionEnvelope({ jwt: "", role: "SUPERADMIN" })).toBeNull();
    expect(decodeSessionCookieValue("not-valid-base64")).toBeNull();
    expect(decodeSessionCookieValue(tampered)).toBeNull();
  });
});