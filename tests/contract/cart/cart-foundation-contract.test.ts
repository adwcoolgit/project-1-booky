import { beforeEach, describe, expect, it, vi } from "vitest";

const { cookieStore } = vi.hoisted(() => {
  const values = new Map<string, string>();

  return {
    cookieStore: {
      get: vi.fn((name: string) => {
        const value = values.get(name);

        return value ? { value } : undefined;
      }),
      set: vi.fn(),
      delete: vi.fn(),
    },
  };
});

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(cookieStore)),
}));

import type { AxiosInstance } from "axios";

import { processCartClearRequest, processCartGetRequest } from "@/app/api/cart/route";
import { processCartCheckoutRequest } from "@/app/api/cart/checkout/route";
import { processAddToCartRequest } from "@/app/api/cart/items/route";
import { processRemoveCartItemRequest } from "@/app/api/cart/items/[itemId]/route";
import { processLoanFromCartRequest } from "@/app/api/loans/from-cart/route";
import type { executeProtectedServerRequest } from "@/shared/api/server/authenticated-client";

type Executor = typeof executeProtectedServerRequest;
type RequestFn = (client: AxiosInstance) => Promise<unknown>;

type FakeAxiosClient = {
  get: (path: string) => Promise<{ data: unknown }>;
  post: (path: string, body?: unknown) => Promise<{ data: unknown }>;
  delete: (path: string) => Promise<{ data: unknown }>;
};

const allowedOrigin = "http://localhost:3000";

function createSuccessExecutor(expectedPath: string, expectedMethod: "get" | "post" | "delete", data: unknown): Executor {
  const calls: { method: string; path: string; body?: unknown }[] = [];
  const client: FakeAxiosClient = {
    get: (path) => {
      calls.push({ method: "get", path });
      return Promise.resolve({ data });
    },
    post: (path, body) => {
      calls.push({ method: "post", path, body });
      return Promise.resolve({ data });
    },
    delete: (path) => {
      calls.push({ method: "delete", path });
      return Promise.resolve({ data });
    },
  };

  return vi.fn(async (request: RequestFn) => {
    const result = await request(client as never);
    const matched = calls.find((call) => call.method === expectedMethod && call.path === expectedPath);

    expect(matched).toBeDefined();

    return { status: "success", data: result };
  }) as unknown as Executor;
}

function createBodyCapturingExecutor(expectedPath: string, responseData: unknown, onBody: (body: unknown) => void): Executor {
  const client: Pick<FakeAxiosClient, "post"> = {
    post: (path, body) => {
      expect(path).toBe(expectedPath);
      onBody(body);
      return Promise.resolve({ data: responseData });
    },
  };

  return vi.fn(async (request: RequestFn) => {
    const result = await request(client as never);

    return { status: "success", data: result };
  }) as unknown as Executor;
}

describe("cart/checkout BFF route contract", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/cart forwards to GET /cart", async () => {
    const executor = createSuccessExecutor("/cart", "get", { items: [] });
    const result = await processCartGetRequest({ executeProtectedServerRequest: executor });

    expect(result.status).toBe("success");
    expect(executor).toHaveBeenCalledTimes(1);
  });

  it("DELETE /api/cart forwards to DELETE /cart when the origin is allowed", async () => {
    const executor = createSuccessExecutor("/cart", "delete", { ok: true });
    const result = await processCartClearRequest(allowedOrigin, {
      executeProtectedServerRequest: executor,
      assertAllowedOrigin: vi.fn(),
    });

    expect(result.status).toBe("success");
  });

  it("DELETE /api/cart rejects a disallowed origin without calling the backend", async () => {
    const executor = vi.fn() as unknown as Executor;
    const assertAllowedOrigin = vi.fn(() => {
      throw new Error("origin rejected");
    });
    const result = await processCartClearRequest("http://evil.test", {
      executeProtectedServerRequest: executor,
      assertAllowedOrigin,
    });

    expect(result.status).toBe("failure");
    if (result.status === "failure") {
      expect(result.error.failureType).toBe("forbidden");
    }
    expect(executor).not.toHaveBeenCalled();
  });

  it("GET /api/cart/checkout forwards to GET /cart/checkout", async () => {
    const executor = createSuccessExecutor("/cart/checkout", "get", { user: {}, items: [] });
    const result = await processCartCheckoutRequest({ executeProtectedServerRequest: executor });

    expect(result.status).toBe("success");
  });

  it("POST /api/cart/items forwards only the documented bookId field", async () => {
    let forwardedBody: unknown;
    const executor = createBodyCapturingExecutor("/cart/items", { ok: true }, (body) => {
      forwardedBody = body;
    });

    const result = await processAddToCartRequest({ bookId: 101, policyAccepted: true }, allowedOrigin, {
      executeProtectedServerRequest: executor,
      assertAllowedOrigin: vi.fn(),
    });

    expect(result.status).toBe("success");
    expect(forwardedBody).toEqual({ bookId: 101 });
  });

  it("POST /api/cart/items rejects a payload without a valid bookId", async () => {
    const executor = vi.fn() as unknown as Executor;
    const result = await processAddToCartRequest({ bookId: "not-a-number" }, allowedOrigin, {
      executeProtectedServerRequest: executor,
      assertAllowedOrigin: vi.fn(),
    });

    expect(result.status).toBe("failure");
    expect(executor).not.toHaveBeenCalled();
  });

  it("DELETE /api/cart/items/[itemId] forwards the parsed positive-integer id", async () => {
    const executor = createSuccessExecutor("/cart/items/501", "delete", { ok: true });
    const result = await processRemoveCartItemRequest("501", allowedOrigin, {
      executeProtectedServerRequest: executor,
      assertAllowedOrigin: vi.fn(),
    });

    expect(result.status).toBe("success");
  });

  it("DELETE /api/cart/items/[itemId] rejects a non-positive-integer id", async () => {
    const executor = vi.fn() as unknown as Executor;
    const result = await processRemoveCartItemRequest("not-an-id", allowedOrigin, {
      executeProtectedServerRequest: executor,
      assertAllowedOrigin: vi.fn(),
    });

    expect(result.status).toBe("failure");
    expect(executor).not.toHaveBeenCalled();
  });

  it("POST /api/loans/from-cart forwards itemIds/days/borrowDate and never a policy-agreement field", async () => {
    let forwardedBody: unknown;
    const executor = createBodyCapturingExecutor(
      "/loans/from-cart",
      { loans: [], failed: [], removedFromCart: [] },
      (body) => {
        forwardedBody = body;
      },
    );

    const result = await processLoanFromCartRequest(
      { itemIds: [501, 502], days: 5, borrowDate: "2026-08-01", policyAccepted: true },
      allowedOrigin,
      { executeProtectedServerRequest: executor, assertAllowedOrigin: vi.fn() },
    );

    expect(result.status).toBe("success");
    expect(forwardedBody).toEqual({ itemIds: [501, 502], days: 5, borrowDate: "2026-08-01" });
    expect(forwardedBody).not.toHaveProperty("policyAccepted");
  });

  it("POST /api/loans/from-cart rejects a missing itemIds payload", async () => {
    const executor = vi.fn() as unknown as Executor;
    const result = await processLoanFromCartRequest({ days: 3 }, allowedOrigin, {
      executeProtectedServerRequest: executor,
      assertAllowedOrigin: vi.fn(),
    });

    expect(result.status).toBe("failure");
    expect(executor).not.toHaveBeenCalled();
  });
});
