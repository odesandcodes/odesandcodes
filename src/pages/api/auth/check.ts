import type { APIRoute } from "astro";
import { isAuthenticated } from "../../../lib/auth";

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  const authed = await isAuthenticated(request, env);
  return Response.json({ authenticated: authed });
};
