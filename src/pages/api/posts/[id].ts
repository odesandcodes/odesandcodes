import type { APIRoute } from "astro";
import { db } from "../../../lib/db";
import { isAuthenticated } from "../../../lib/auth";

export const prerender = false;

// Returns a 401 Response when the request is not authenticated, else null.
async function requireAuth(request: Request, locals: any): Promise<Response | null> {
  const env = (locals as any).runtime?.env;
  if (!(await isAuthenticated(request, env))) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }
  return null;
}

export const PATCH: APIRoute = async ({ request, locals, params }) => {
  const denied = await requireAuth(request, locals);
  if (denied) return denied;
  const id = Number(params.id);
  if (!Number.isInteger(id)) return Response.json({ error: "Bad id." }, { status: 400 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body.body !== "string" || !body.body.trim()) {
    return Response.json({ error: "The entry body is required." }, { status: 400 });
  }
  const d = db(locals);
  const now = new Date().toISOString();
  await d
    .prepare(
      `UPDATE posts
       SET title = ?, description = ?, body = ?, post_date = ?, updated_at = ?
       WHERE id = ?`
    )
    .bind(
      String(body.title || ""),
      String(body.description || ""),
      body.body,
      String(body.post_date || now),
      now,
      id
    )
    .run();
  // D1's run() doesn't reliably report changes; re-read to confirm.
  const post = await d.prepare("SELECT * FROM posts WHERE id = ?").bind(id).first();
  if (!post) return Response.json({ error: "Not found." }, { status: 404 });
  return Response.json(post);
};

export const DELETE: APIRoute = async ({ request, locals, params }) => {
  const denied = await requireAuth(request, locals);
  if (denied) return denied;
  const id = Number(params.id);
  if (!Number.isInteger(id)) return Response.json({ error: "Bad id." }, { status: 400 });
  const d = db(locals);
  const post = await d.prepare("SELECT id FROM posts WHERE id = ?").bind(id).first();
  if (!post) return Response.json({ error: "Not found." }, { status: 404 });
  await d.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
  return Response.json({ ok: true });
};
