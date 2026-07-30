export function slugifySegment(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function createIdBackedSlug(value: string, id: number, fallback = "item") {
  const base = slugifySegment(value);

  return `${base || fallback}-${id}`;
}