import type { APIRoute } from "astro";
import { passwordHash, authCookieHeader } from "../../../lib/auth";

export const prerender = false;

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  const expected = env?.BLOG_PASSWORD;
  if (!expected) {
    return new Response("Server misconfigured: BLOG_PASSWORD is not set.", { status: 500 });
  }

  let password = "", next = "/";
  const ctype = request.headers.get("content-type") || "";
  if (ctype.includes("application/json")) {
    const body = await request.json().catch(() => ({}));
    password = String(body.password || "");
    next = body.next || "/";
  } else {
    const form = await request.formData().catch(() => null);
    password = String(form?.get("password") || "");
    next = String(form?.get("next") || "/");
  }
  if (!next.startsWith("/") || next.startsWith("//")) next = "/";

  if (!timingSafeEqual(password, expected)) {
    // Form posts bounce back to the login page with an error flag.
    if (!ctype.includes("application/json")) {
      return Response.redirect(new URL("/login?error=1", request.url).toString(), 303);
    }
    return new Response(JSON.stringify({ ok: false }), {
      status: 401, headers: { "content-type": "application/json" },
    });
  }

  const headers = new Headers();
  const isHttps = new URL(request.url).protocol === "https:";
  headers.append("Set-Cookie", authCookieHeader(await passwordHash(expected), isHttps));
  if (!ctype.includes("application/json")) {
    headers.set("Location", next);
    return new Response(null, { status: 303, headers });
  }
  return new Response(JSON.stringify({ ok: true }), { headers });
};
