import { API_BASE_URL } from "@/lib/api/config";

export function apiUrl(path: string) {
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}

export async function assertOk(res: Response) {
  if (res.ok) return;
  const contentType = res.headers.get("content-type") ?? "";
  let details = "";
  try {
    if (contentType.includes("application/json")) {
      const body = (await res.json()) as unknown;
      details = JSON.stringify(body);
    } else {
      details = await res.text();
    }
  } catch {
    // ignore
  }
  const msg = `Request failed (${res.status} ${res.statusText})${details ? `: ${details}` : ""}`;
  throw new Error(msg);
}

