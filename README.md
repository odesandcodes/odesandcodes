# Odes & Codes

Personal site + mini blog built with Astro, deployed on Cloudflare Pages.

## How it works

- The blog lives in a **Cloudflare D1 database** (a tiny SQLite database), not in markdown files. New entries appear instantly — no rebuild, no git push per post.
- The homepage is the blog stream. Everyone can read it.
- Go to `/login` and enter your password, and the same page grows an editor: a **+ NEW ENTRY** composer at the top, plus **edit** / **delete** buttons on every card. Logged-out visitors never see any of that — it's not rendered at all for them.
- The old `/admin` page and its GitHub-API "tiny CMS" are gone. Nothing to configure there anymore.

## Tech stack

**Frontend:** Astro (server-rendered) · **Hosting:** Cloudflare Pages · **Database:** Cloudflare D1 · **Auth:** shared password (`BLOG_PASSWORD`) stored as an env var, cookie holds only its SHA-256 hash

## Project layout

```
src/pages/index.astro        # blog stream + inline editor (editor only when logged in)
src/pages/login.astro        # password form (not linked anywhere public)
src/pages/404.astro
src/pages/api/auth/          # login, logout, check
src/pages/api/posts/         # list (public), create / edit / delete (logged in only)
src/lib/auth.ts              # password + cookie helpers
src/lib/db.ts                # D1 helpers
migrations/0001_posts.sql    # database schema
migrations/seed.sql          # the 18 old markdown posts, migrated
wrangler.toml                # Pages project + D1 binding (fill in database_id)
```

## Setup walkthrough

Follow `DEPLOY.md` — it covers everything in plain English: testing locally,
pushing to GitHub, connecting Cloudflare Pages (that's your CI/CD — every push
auto-deploys), creating the D1 database, loading your old posts, setting the
password, and pointing your domain at it.
