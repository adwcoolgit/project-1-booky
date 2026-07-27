import type { AppLocale } from "@/shared/i18n/config";

export const foundationShellAreas = ["public", "user", "admin"] as const;
export const foundationConflictMessage = "Deterministic foundation conflict.";

export type FoundationShellArea = (typeof foundationShellAreas)[number];

export type FoundationHealthFixture = {
  ok: true;
  status: "foundation-only";
  localeEcho: AppLocale | "none";
  runtimeApiStatus: "RUNTIME-UNVERIFIED";
  checksumAuthority: "docs/source-of-truth/source-of-truth-manifest.json";
  availableShells: readonly FoundationShellArea[];
};

const foundationHealthBaseFixture = Object.freeze({
  ok: true,
  status: "foundation-only" as const,
  runtimeApiStatus: "RUNTIME-UNVERIFIED" as const,
  checksumAuthority: "docs/source-of-truth/source-of-truth-manifest.json" as const,
  availableShells: foundationShellAreas,
});

export function createFoundationHealthFixture(locale?: AppLocale): FoundationHealthFixture {
  return {
    ...foundationHealthBaseFixture,
    localeEcho: locale ?? "none",
  };
}
