// D1 access helper for pages and API routes.

export function db(locals: any): D1Database {
  const d = (locals as any).runtime?.env?.DB;
  if (!d) throw new Response("D1 binding 'DB' is not configured.", { status: 500 });
  return d;
}

export interface Post {
  id: number;
  title: string;
  description: string;
  body: string;
  post_date: string; // ISO string
  created_at: string;
  updated_at: string;
}

export async function listPosts(d: D1Database): Promise<Post[]> {
  const { results } = await d
    .prepare("SELECT * FROM posts ORDER BY post_date DESC, id DESC")
    .all();
  return (results || []) as Post[];
}
