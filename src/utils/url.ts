export function normalizeUrl(raw: string): string | null {
  const u = raw.trim();
  if (!u) return null;
  if (/^https?:\/\//i.test(u)) return u;
  // obliga HTTPS por RNF-06 básico
  return `https://${u}`;
}