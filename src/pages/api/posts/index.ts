import type { APIRoute } from "astro";
import { db, listPosts } from "../../../lib/db";
import { isAuthenticated } from "../../../lib/auth";

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const posts = await listPosts(db(locals));
  return Response.json({ posts });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  if (!(await isAuthenticated(request, env))) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body || typeof body.body !== "string" || !body.body.trim()) {
    return Response.json({ error: "The entry body is required." }, { status: 400 });
  }
  const d = db(locals);
  const now = new Date().toISOString();
  const res = await d
    .prepare(
      `INSERT INTO posts (title, description, body, post_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(
      String(body.title || ""),
      String(body.description || ""),
      body.body,
      String(body.post_date || now),
      now,
      now
    )
    .run();
  const id = res.meta.last_row_id as number;
  const post = await d.prepare("SELECT * FROM posts WHERE id = ?").bind(id).first();
  return Response.json(post, { status: 201 });
};
