# Odes & Codes

A high-performance, minimalist personal blog built with **Astro**, deployed on **Cloudflare Pages**, and managed via a custom **TinyCMS** integration.

## 🚀 Tech Stack

- **Framework:** [Astro 5.0](https://astro.build/) (Static Output)
- **Deployment:** [Cloudflare Pages](https://pages.cloudflare.com/)
- **CMS:** TinyCMS (Custom Vanilla JS/HTML5)
- **Authentication:** GitHub OAuth via Cloudflare Workers
- **Styling:** CSS Variables & Responsive Design

## 📂 Project Structure

- `src/content/blog/`: The source of truth. All posts are stored here as `.md` files.
- `src/pages/`: Astro components that render the frontend.
- `public/admin/`: The TinyCMS dashboard. A single-file entry point for content management.
- `astro.config.mjs`: Configuration for static site generation.

## 🛠 The TinyCMS Workflow

This project uses a custom-built "Headless" CMS workflow to avoid heavy third-party dependencies.

1. **Authentication:** The Admin panel uses a Cloudflare Worker proxy to handle GitHub OAuth.
2. **Persistence:** Access tokens are stored in `localStorage` for seamless sessions.
3. **API Bridge:** The Cloudflare Worker acts as a secure CORS proxy to communicate with the GitHub REST API.
4. **Automation:** Saving a post in the TinyCMS triggers a GitHub Commit, which automatically starts a new Cloudflare Pages build.

## 🔄 Development & Syncing

Because content can be created both via the web dashboard and locally on a machine, it is vital to keep the local repository in sync.

### The Golden Rule:
**Always pull before you push.**

```bash
# Before starting local work:
git pull origin main

# After finishing local work:
git add .
git commit -m "Update description"
git push origin main# odesandcodes
