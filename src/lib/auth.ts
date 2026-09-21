// Simple shared-password gate for the blog's editing UI.
// The cookie holds sha256(BLOG_PASSWORD) — never the password itself.
// Readers need no login at all; only the write API routes check this.

export const COOKIE_NAME = "odes_auth";

export async function passwordHash(password: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function getCookie(req: Request, name: string): string | null {
  const header = req.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export async function isAuthenticated(req: Request, env: any): Promise<boolean> {
  const expected = env?.BLOG_PASSWORD;
  if (!expected) return false; // no password configured -> deny, fail closed
  const cookie = getCookie(req, COOKIE_NAME);
  if (!cookie) return false;
  return cookie === (await passwordHash(expected));
}

export function authCookieHeader(hash: string, secure = true): string {
  const securePart = secure ? " Secure;" : "";
  return `${COOKIE_NAME}=${hash}; HttpOnly;${securePart} SameSite=Lax; Path=/; Max-Age=2592000`;
}

export function clearCookieHeader(): string {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}
