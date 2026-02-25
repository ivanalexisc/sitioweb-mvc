const BACKEND_ORIGIN = "http://localhost:3001";

export function resolveImageUrl(imagePath: string | null | undefined) {
  if (!imagePath) return null;

  let normalized = imagePath.replace(/\\/g, "/").trim();

  if (!normalized) return null;

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }

  normalized = normalized.replace(/^public\//, "");

  if (!normalized.includes("/")) {
    normalized = `images/${normalized}`;
  }

  return `${BACKEND_ORIGIN}/${normalized}`;
}
