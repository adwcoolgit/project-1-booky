import { describe, expect, it } from "vitest";

import { createShellDefinition } from "@/features/foundation-shell/config/foundation-routes";
import { getFoundationRoute } from "@/entities/locale-route";
import { getFoundationShellMessages } from "@/shared/i18n/get-messages";

describe("foundation route model", () => {
  it("maps public and user areas to the user-facing shell", () => {
    expect(getFoundationRoute("public").variant).toBe("user-facing");
    expect(getFoundationRoute("user").variant).toBe("user-facing");
    expect(getFoundationRoute("admin").variant).toBe("admin-facing");
  });

  it("builds localized navigation links per area", () => {
    const shell = createShellDefinition("id", "admin", getFoundationShellMessages("id"));

    expect(shell.navigation).toEqual([
      { area: "public", href: "/id/foundation/public", label: "Placeholder publik" },
      { area: "user", href: "/id/foundation/user", label: "Placeholder pembaca" },
      { area: "admin", href: "/id/foundation/admin", label: "Placeholder admin" },
    ]);
    expect(shell.badge).toBe("Shell admin-facing");
  });
});

