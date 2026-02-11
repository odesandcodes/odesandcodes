# Odes & Codes CMS Setup

Simple GitHub-based CMS for managing blog posts on odesandcodes.com

## Architecture

```
Browser → Caddy (HTTPS) → Express Auth Server → GitHub API
                ↓
         Static Files (dist/)
```

## Components

### 1. Express Auth Server (`/var/www/admin-auth/server.js`)
- Runs on port 3000 (localhost only)
- Handles login/logout with bcrypt password
- Proxies authenticated requests to GitHub API
- **Requires:** `GITHUB_TOKEN` environment variable

### 2. Caddy Reverse Proxy
- Routes `/admin/auth/*` → `localhost:3000`
- Serves static site from `/var/www/odesandcodes/dist`
- Config managed via API (port 2019)
- Auto-persists configuration

### 3. Admin Interface (`/var/www/odesandcodes/dist/admin.html`)
- Browser-based markdown editor
- Direct GitHub commits via auth server
- Manages files in `src/content/blog/`

## Running Services

```bash
# Check status
pm2 status

# Should see:
# - server (port 3000) - the auth server
# - caddy running in background

# View logs
pm2 logs server
journalctl -u caddy -f
```

## Maintenance

### Restart Services
```bash
pm2 restart server
systemctl restart caddy
```

### Update GitHub Token
```bash
pm2 set server GITHUB_TOKEN "new_token_here"
pm2 restart server --update-env
pm2 save
```

### Change Admin Password
1. Generate new hash: `node -e "console.log(require('bcryptjs').hashSync('newpass', 10))"`
2. Update `PASSWORD_HASH` in `server.js`
3. `pm2 restart server`

## Security Notes

- ✅ Password is bcrypt hashed
- ✅ GitHub token only in environment (never in code)
- ✅ Auth server only on localhost (not exposed)
- ✅ Sessions use httpOnly cookies
- ⚠️ Consider adding rate limiting on `/login`
- ⚠️ Rotate GitHub token periodically

## Boot Persistence

Ensure services start on reboot:
```bash
pm2 startup  # Run the command it outputs
pm2 save
systemctl enable caddy
```

## Troubleshooting

**Posts not loading:**
- Check `GITHUB_TOKEN` is set: `pm2 env 0` (or correct ID)
- Verify GitHub token has `repo` permissions
- Check logs: `pm2 logs server`

**Login not working:**
- Check session cookies in browser DevTools
- Verify only ONE server running on port 3000: `pm2 list`
- Check password hash matches

**Port conflicts:**
```bash
# Check what's on port 3000
netstat -tlnp | grep 3000

# Should only be PM2's server process
```

## Deploy Workflow

1. Make changes locally
2. Push to GitHub
3. GitHub Action builds site
4. Action deploys to `/var/www/odesandcodes/dist`
5. Caddy serves updated files (no restart needed)
6. Admin updates posts via `/admin.html`

## File Locations

- Auth server: `/var/www/admin-auth/`
- Site files: `/var/www/odesandcodes/dist/`
- Blog posts: `src/content/blog/*.md` (in GitHub repo)
- PM2 config: `/home/ubuntu/.pm2/`
- Caddy config: Managed via API (use `curl localhost:2019/config/`)

## Quick Commands

```bash
# Check everything
pm2 status && systemctl status caddy

# Restart everything
pm2 restart all && systemctl restart caddy

# View all logs
pm2 logs

# Save current state
pm2 save
```
