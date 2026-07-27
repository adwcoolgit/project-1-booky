export function buildRedirectPath(
  basePath: string,
  returnTo?: string | null,
  reason?: string | null,
): string {
  const searchParams = new URLSearchParams();

  if (returnTo) {
    searchParams.set("returnTo", returnTo);
  }

  if (reason) {
    searchParams.set("reason", reason);
  }

  const serialized = searchParams.toString();

  return serialized ? `${basePath}?${serialized}` : basePath;
}

function normalizeForLoopComparison(value: string): string {
  try {
    const candidate = value.startsWith("/") ? new URL(value, "http://localhost") : new URL(value);

    return `${candidate.pathname}${candidate.search}`;
  } catch {
    return value;
  }
}

export function isRedirectLoop(currentPath: string, targetPath: string): boolean {
  return normalizeForLoopComparison(currentPath) === normalizeForLoopComparison(targetPath);
}
