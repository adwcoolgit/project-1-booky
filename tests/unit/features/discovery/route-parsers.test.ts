import { describe, expect, it } from "vitest";

import { parseAuthorRouteParams, parseBookRouteParams } from "@/features/discovery/model";

describe("discovery route parsers", () => {
  it("accepts positive-integer string ids for book and author routes", () => {
    expect(parseBookRouteParams({ bookId: "42" })).toEqual({
      status: "valid",
      params: { bookId: 42 },
    });

    expect(parseAuthorRouteParams({ authorId: "17" })).toEqual({
      status: "valid",
      params: { authorId: 17 },
    });
  });

  it("rejects malformed or non-positive book ids", () => {
    expect(parseBookRouteParams({ bookId: "0" })).toEqual({
      status: "invalid",
      reason: "invalid-book-id",
    });

    expect(parseBookRouteParams({ bookId: "-2" })).toEqual({
      status: "invalid",
      reason: "invalid-book-id",
    });

    expect(parseBookRouteParams({ bookId: "abc" })).toEqual({
      status: "invalid",
      reason: "invalid-book-id",
    });
  });

  it("rejects malformed or non-positive author ids", () => {
    expect(parseAuthorRouteParams({ authorId: "0" })).toEqual({
      status: "invalid",
      reason: "invalid-author-id",
    });

    expect(parseAuthorRouteParams({ authorId: "-2" })).toEqual({
      status: "invalid",
      reason: "invalid-author-id",
    });

    expect(parseAuthorRouteParams({ authorId: "abc" })).toEqual({
      status: "invalid",
      reason: "invalid-author-id",
    });
  });
});