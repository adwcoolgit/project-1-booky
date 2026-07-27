import type { AppShellVariantId } from "@/entities/app-shell/model";

export const boundaryStateIds = ["loading", "error", "not-found"] as const;

export type BoundaryStateId = (typeof boundaryStateIds)[number];

export type BoundaryStateDefinition = {
  state: BoundaryStateId;
  accessibilityContract: readonly string[];
  localizationNamespace: "Boundaries";
  shellVariantCoverage: readonly AppShellVariantId[];
};

export const boundaryStateDefinitions: readonly BoundaryStateDefinition[] = [
  {
    state: "loading",
    accessibilityContract: ["polite-live-region", "shell-hierarchy-preserved"],
    localizationNamespace: "Boundaries",
    shellVariantCoverage: ["user-facing", "admin-facing"],
  },
  {
    state: "error",
    accessibilityContract: ["alert-semantics", "focus-recovery", "recoverable-action"],
    localizationNamespace: "Boundaries",
    shellVariantCoverage: ["user-facing", "admin-facing"],
  },
  {
    state: "not-found",
    accessibilityContract: ["heading-structure", "focus-recovery", "no-redirect"],
    localizationNamespace: "Boundaries",
    shellVariantCoverage: ["user-facing", "admin-facing"],
  },
] as const;

export function isBoundaryStateId(value: string | null | undefined): value is BoundaryStateId {
  return boundaryStateIds.includes(value as BoundaryStateId);
}

export function getBoundaryStateDefinition(state: BoundaryStateId): BoundaryStateDefinition {
  const definition = boundaryStateDefinitions.find((entry) => entry.state === state);

  if (!definition) {
    throw new Error(`Unsupported boundary state: ${state}`);
  }

  return definition;
}
