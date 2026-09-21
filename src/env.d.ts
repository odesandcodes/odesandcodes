// Minimal ambient types for the Cloudflare runtime bindings we use.
interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first(): Promise<any>;
  all(): Promise<{ results: any[] }>;
  run(): Promise<{ meta: { last_row_id: number | string } }>;
}
interface D1Database {
  prepare(query: string): D1PreparedStatement;
}
interface CloudflareEnv {
  DB: D1Database;
  BLOG_PASSWORD?: string;
}
