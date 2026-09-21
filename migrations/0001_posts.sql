-- odesandcodes: initial schema for the blog (Cloudflare D1)
-- Applied with: npx wrangler@latest d1 execute odes-blog --remote --file=./migrations/0001_posts.sql

CREATE TABLE IF NOT EXISTS posts (
  id          INTEGER PRIMARY KEY,
  title       TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  body        TEXT NOT NULL DEFAULT '',
  post_date   TEXT NOT NULL,        -- ISO datetime string
  created_at  TEXT NOT NULL,        -- ISO datetime string
  updated_at  TEXT NOT NULL         -- ISO datetime string
);
CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(post_date DESC);
