# Odes & Codes

Personal site built with Astro, deployed on AWS with Caddy.

## Live Sites

- [odesandcodes.com](https://odesandcodes.com) — Main site + blog
- [tides.odesandcodes.com](https://tides.odesandcodes.com) — Tide tracker
- [metal.odesandcodes.com](https://metal.odesandcodes.com) — Metal tracker
- [radidash.odesandcodes.com](https://radidash.odesandcodes.com) — Radio dashboard

## Tech Stack

**Frontend:** Astro, Markdown  
**Server:** AWS EC2, Caddy (API config)  
**Deploy:** GitHub Actions  
**CMS:** Custom lightweight admin  

## Local Development

```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
```

## Deploy

Pushes to `main` trigger automatic deployment to AWS via GitHub Actions.

---

*Simple tools. Clean code. No bloat.*