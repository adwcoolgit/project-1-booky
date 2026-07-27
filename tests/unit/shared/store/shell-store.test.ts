import { afterEach, describe, expect, it } from "vitest";

import { useShellStore } from "@/shared/store/shell-store";

const initialState = useShellStore.getState();

afterEach(() => {
  useShellStore.setState(initialState, true);
});

describe("shell store foundation", () => {
  it("only exposes approved shell UI state", () => {
    expect(Object.keys(useShellStore.getState()).sort()).toEqual([
      "activeSkipTarget",
      "closeMobileNav",
      "isMobileNavOpen",
      "setActiveSkipTarget",
      "setMobileNavOpen",
      "toggleMobileNav",
    ]);
  });

  it("toggles mobile navigation and skip target state only", () => {
    useShellStore.getState().setMobileNavOpen(true);
    useShellStore.getState().setActiveSkipTarget("admin-content");

    expect(useShellStore.getState().isMobileNavOpen).toBe(true);
    expect(useShellStore.getState().activeSkipTarget).toBe("admin-content");

    useShellStore.getState().toggleMobileNav();
    expect(useShellStore.getState().isMobileNavOpen).toBe(false);

    useShellStore.getState().closeMobileNav();
    expect(useShellStore.getState().isMobileNavOpen).toBe(false);
  });
});
