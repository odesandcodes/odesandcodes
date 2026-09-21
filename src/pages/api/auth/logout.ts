import type { APIRoute } from "astro";
import { clearCookieHeader } from "../../../lib/auth";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const headers = new Headers();
  headers.append("Set-Cookie", clearCookieHeader());
  // Plain form post (the sidebar logout link) goes home.
  const ctype = request.headers.get("content-type") || "";
  if (!ctype.includes("application/json")) {
    headers.set("Location", "/");
    return new Response(null, { status: 303, headers });
  }
  return new Response(JSON.stringify({ ok: true }), { headers });
};
