# Deploy walkthrough — odesandcodes.com blog

Everything here in plain English, in order. The short version: GitHub holds the
code, Cloudflare Pages rebuilds and deploys it on every push (that's your CI/CD),
and your posts live in a little Cloudflare database so publishing never needs a
git push.

> Use your **personal** Cloudflare account for all of this, not the work one.

---

## 1. Test it on your own machine

Open a terminal in the project folder:

```bash
npm install
npm run build
```

If the build finishes without errors, set up the local test database (one time —
this creates the table and loads your 18 old posts into a database that lives
only on your machine):

```bash
npx wrangler@latest d1 execute odes-blog --local --file=./migrations/0001_posts.sql
npx wrangler@latest d1 execute odes-blog --local --file=./migrations/seed.sql
```

(If you ever want a clean slate locally, delete the `.wrangler` folder and run
those two commands again. Don't run the seed command twice without deleting —
it would double up the posts.)

Then start a local copy of the real thing:

```bash
npx wrangler@latest pages dev ./dist \
  --port 8789 \
  --binding BLOG_PASSWORD=testpassword123
```

> Don't add a `--d1` flag here: `pages dev` reads the database binding straight
> from `wrangler.toml`, which is what makes it share the same local database
> the two commands above wrote to. Adding `--d1` would silently point it at a
> different, empty database.

Then open **http://localhost:8789** in your browser — you should see the blog
with your old posts.

Now go to **http://localhost:8789/login** and type `testpassword123`. You should
land back on the homepage and see:

- a **+ NEW ENTRY** button at the top of the stream,
- **edit** and **delete** buttons on every card.

Try it: write a throwaway entry, publish it, edit it, delete it. Then log out
with the **log out** link in the sidebar card and confirm the editing buttons
disappear. When you're done, press Ctrl+C in the terminal.

---

## 2. Put the code on GitHub

Create a new repo at github.com — call it `odesandcodes` (private is fine, same
as the fish app). Then in the project folder:

```bash
git init
git add -A
git commit -m "Blog rebuild: D1-backed, on-page editing"
git branch -M main
git remote add origin git@github.com:odesandcodes/odesandcodes.git
git push -u origin main
```

---

## 3. Connect Cloudflare Pages (this is the CI/CD pipeline)

1. In the Cloudflare dashboard (personal account), go to **Workers & Pages** →
   **Create** → **Pages** → **Connect to Git**.
2. Pick the `odesandcodes/odesandcodes` repo.
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Hit deploy.

That's the whole pipeline: from now on, every `git push` to `main` automatically
rebuilds and redeploys the site. Pushes to other branches get throwaway preview
URLs. There is no GitHub Actions workflow to maintain.

---

## 4. Create the database and load your old posts

In a terminal (make sure `wrangler` is logged into your **personal** Cloudflare
account — run `npx wrangler@latest whoami` if you're not sure):

```bash
# one time: create the database
npx wrangler@latest d1 create odes-blog
```

Copy the `database_id` it prints, paste it into `wrangler.toml` replacing
`PASTE_DATABASE_ID_AFTER_CREATING`, then commit and push so Pages picks it up:

```bash
git add wrangler.toml && git commit -m "Add D1 database id" && git push
```

(Alternative: skip the wrangler.toml edit and bind D1 in the Pages dashboard
instead — **Settings → Functions → D1 database bindings**, binding name `DB`.
Either way works; the binding name must be `DB`.)

Now create the table and load your 18 old posts — both one-time commands:

```bash
npx wrangler@latest d1 execute odes-blog --remote --file=./migrations/0001_posts.sql
npx wrangler@latest d1 execute odes-blog --remote --file=./migrations/seed.sql
```

---

## 5. Set your password

In the Pages dashboard for this project: **Settings → Environment variables** →
**Add variable**:

- Name: `BLOG_PASSWORD`
- Value: whatever password you want for the editor

Add it for **Production** (and Preview too if you want to test the editor on
preview URLs). Then **retry the latest deployment** so the new variable takes
effect.

Nobody can guess the login page exists — it's at `/login` and isn't linked
anywhere on the site. Only someone with the password ever sees the editor.

---

## 6. Point your domain at it

In the Pages project: **Custom domains** → **Set up a custom domain** →
`odesandcodes.com`. Since the domain already lives in your Cloudflare account,
this wires itself up — no manual DNS needed.

> Heads-up: this replaces however odesandcodes.com is served today (the old
> README says AWS/Caddy). Once the Pages custom domain is active and you've
> confirmed the new site looks right, you can retire the old server setup.

---

## 7. Daily use

1. Go to `odesandcodes.com/login`, enter your password.
2. Write entries right on the page with **+ NEW ENTRY**. Edit or delete any
   card with its buttons.
3. That's it. No git, no rebuild, no deploy — the page reads straight from the
   database.

## Files that matter

- `src/pages/index.astro` — the whole blog page + editor
- `src/pages/api/posts/*` — the database API (create/edit/delete need login)
- `src/lib/auth.ts` — the password gate (same pattern as the fish app)
- `migrations/` — schema + your migrated posts
- `wrangler.toml` — Pages project name + D1 binding
