# Odes & Codes

A digital ledger of technical experiments and poetic fragments. Built for speed, durability, and a minimalist aesthetic.

## 🏗 The Stack
* **Framework:** [Astro 5.0](https://astro.build/) (Content Collections API)
* **Hosting:** [Cloudflare Pages](https://pages.cloudflare.com/)
* **Editor:** Zero-CMS (Direct GitHub Markdown editing)

---

## 📱 Mobile Workflow (Posting from your phone)
This site is designed to be updated without a computer. 

1.  Open the **GitHub App** on your phone.
2.  Navigate to `src/content/blog/`.
3.  Tap **Create new file**.
4.  **Name it:** `YYYY-MM-DD-title.md` (e.g., `2026-02-05-first-entry.md`).
5.  **Paste this template:**

---
title: "Your Title"
description: "Brief caption/footer text"
date: 2026-02-05
---

Write your post or paste your code here.

6.  **Commit changes.** Cloudflare will build and deploy the update in ~60 seconds.

---

## 💻 Local Development (MacBook)
For design changes and architectural tweaks:

```bash
# Setup
npm install

# Development
npm run dev

# Deploy
git add .
git commit -m "Brief description of change"
git push