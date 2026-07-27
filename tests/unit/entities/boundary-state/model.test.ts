import { describe, expect, it } from "vitest";

import { getBoundaryStateCopy, getBoundaryStateDefinition, resolveBoundaryLocale } from "@/entities/boundary-state";

describe("boundary state model", () => {
  it("defines localized error and not-found coverage for both shell variants", () => {
    expect(getBoundaryStateDefinition("error")).toMatchObject({
      localizationNamespace: "Boundaries",
      shellVariantCoverage: ["user-facing", "admin-facing"],
    });
    expect(getBoundaryStateDefinition("not-found").accessibilityContract).toContain("no-redirect");
  });

  it("resolves unsupported locales and localized not-found copy safely", () => {
    expect(resolveBoundaryLocale("fr")).toBe("en");
    expect(getBoundaryStateCopy("id", "not-found", { notFoundReason: "unsupported-locale" }).description).toBe(
      "Locale ini belum didukung untuk Booky. Gunakan route English atau Bahasa Indonesia.",
    );
  });
});
