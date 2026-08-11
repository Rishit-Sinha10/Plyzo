const BASE = "https://internal.invalid";
export function safeRedirectPath(
  raw: string | null | undefined,
  fallback = "/dashboard",
): string {
  const value = raw?.trim();
  if (!value) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  if (value.includes("\\")) return fallback;
  if (/[\u0000-\u001f]/.test(value)) return fallback;
  try {
    const parsed = new URL(value, BASE);
    if (parsed.origin !== BASE) return fallback;
  } catch {
    return fallback;
  }
  return value;
}
