/**
 * Resolves the API endpoint URL, supporting both same-origin deployments (Vercel, Netlify, Local)
 * and split frontend/backend architectures (e.g. Cloudflare Pages frontend + Vercel/Render backend).
 */
export function getApiUrl(path: string): string {
  const base =
    (typeof import.meta !== "undefined" &&
      (import.meta.env?.VITE_API_URL || import.meta.env?.VITE_API_BASE_URL)) ||
    "";

  if (!base) {
    return path.startsWith("/") ? path : `/${path}`;
  }

  const cleanBase = base.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}
