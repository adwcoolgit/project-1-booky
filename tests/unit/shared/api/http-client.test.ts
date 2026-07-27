import { describe, expect, it } from "vitest";

import { createHttpClient } from "@/shared/api/http-client";

function readDefaultHeader(headers: unknown, name: string): string | undefined {
  if (headers && typeof headers === "object") {
    const record = headers as Record<string, unknown>;
    const directValue = record[name];
    if (typeof directValue === "string") {
      return directValue;
    }

    const commonHeaders =
      record.common && typeof record.common === "object"
        ? (record.common as Record<string, unknown>)
        : undefined;
    const commonValue = commonHeaders?.[name];
    if (typeof commonValue === "string") {
      return commonValue;
    }
  }

  return undefined;
}

describe("http client foundation", () => {
  it("sets JSON and locale headers without a global multipart content type", () => {
    const client = createHttpClient("id");

    expect(readDefaultHeader(client.defaults.headers, "Accept")).toBe("application/json");
    expect(readDefaultHeader(client.defaults.headers, "Accept-Language")).toBe("id");
    expect(readDefaultHeader(client.defaults.headers, "Content-Type")).toBeUndefined();
  });

  it("normalizes transport conflicts through the shared interceptor", async () => {
    const client = createHttpClient("en");

    await expect(client.get("/__foundation__/conflict")).rejects.toMatchObject({
      source: "http",
      code: "conflict",
      status: 409,
      details: "Deterministic foundation conflict.",
    });
  });
});
