import { describe, expect, it } from "vitest";

import { parseAuthorRouteParams } from "@/features/discovery/model";

describe("author route parser", () => {
  it("accepts positive-integer author ids at the route boundary", () => {
    expect(parseAuthorRouteParams({ authorId: "21" })).toEqual({
      status: "valid",
      params: { authorId: 21 },
    });
  });

  it("rejects malformed, missing, and non-positive author ids", () => {
    expect(parseAuthorRouteParams({ authorId: "0" })).toEqual({
      status: "invalid",
      reason: "invalid-author-id",
    });

    expect(parseAuthorRouteParams({ authorId: "-7" })).toEqual({
      status: "invalid",
      reason: "invalid-author-id",
    });

    expect(parseAuthorRouteParams({ authorId: "abc" })).toEqual({
      status: "invalid",
      reason: "invalid-author-id",
    });

    expect(parseAuthorRouteParams({})).toEqual({
      status: "invalid",
      reason: "invalid-author-id",
    });
  });
});