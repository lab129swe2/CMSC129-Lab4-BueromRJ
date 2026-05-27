const defaultBaseUrl = "http://localhost:3001";

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || defaultBaseUrl;

export async function apiFetch(path: string, init: RequestInit = {}) {
  const url = new URL(path, API_BASE_URL).toString();
  const res = await fetch(url, init);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}
