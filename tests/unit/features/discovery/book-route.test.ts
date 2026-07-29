import { describe, expect, it } from "vitest";

import { parseBookRouteParams } from "@/features/discovery/model";

describe("book route parser", () => {
  it("accepts positive-integer book ids at the route boundary", () => {
    expect(parseBookRouteParams({ bookId: "101" })).toEqual({
      status: "valid",
      params: { bookId: 101 },
    });
  });

  it("rejects malformed, missing, and non-positive book ids", () => {
    expect(parseBookRouteParams({ bookId: "0" })).toEqual({
      status: "invalid",
      reason: "invalid-book-id",
    });

    expect(parseBookRouteParams({ bookId: "-7" })).toEqual({
      status: "invalid",
      reason: "invalid-book-id",
    });

    expect(parseBookRouteParams({ bookId: "abc" })).toEqual({
      status: "invalid",
      reason: "invalid-book-id",
    });

    expect(parseBookRouteParams({})).toEqual({
      status: "invalid",
      reason: "invalid-book-id",
    });
  });
});
