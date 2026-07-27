import { describe, expect, it } from "vitest";

import { createHttpClient } from "@/shared/api/http-client";
import { createFoundationHealthFixture } from "@/../tests/fixtures/foundation/shell-fixtures";
import { foundationSourceArtifactsFixture } from "@/../tests/fixtures/foundation/source-artifacts";

describe("foundation MSW contract", () => {
  it("returns deterministic health payloads for the localized shell surface", async () => {
    const client = createHttpClient("id");
    const response = await client.get("/__foundation__/health");

    expect(response.status).toBe(200);
    expect(response.data).toEqual(createFoundationHealthFixture("id"));
  });

  it("returns checksum governance metadata without claiming runtime verification", async () => {
    const client = createHttpClient("en");
    const response = await client.get("/__foundation__/source-artifacts");

    expect(response.status).toBe(200);
    expect(response.data).toEqual(foundationSourceArtifactsFixture);
  });
});
