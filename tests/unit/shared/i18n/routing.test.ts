import { describe, expect, it } from "vitest";

import { createFoundationMetadata } from "@/features/foundation-shell/config/foundation-routes";
import { getFoundationShellMessages } from "@/shared/i18n/get-messages";
import { getLocaleDirection, routing } from "@/shared/i18n/routing";

describe("routing foundation", () => {
  it("uses always-prefixed en/id locales", () => {
    expect(routing.locales).toEqual(["en", "id"]);
    expect(routing.localePrefix).toBe("always");
    expect(getLocaleDirection()).toBe("ltr");
  });

  it("builds localized foundation metadata", () => {
    const metadata = createFoundationMetadata("public", getFoundationShellMessages("id"));

    expect(metadata.title).toBe("Shell fondasi publik | Aplikasi Perpustakaan Booky");
    expect(metadata.description).toBe(
      "Placeholder publik responsif untuk baseline shell Booky yang terlokalisasi.",
    );
  });
});

