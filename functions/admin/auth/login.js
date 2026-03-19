// Uses Web Crypto API (built into CF Workers) — no npm dependencies needed
// PASSWORD_HASH env var must be a SHA-256 hex string of your password
// Generate it: in terminal: echo -n "yourpassword" | sha256sum
// Or node: node -e "const c=require('crypto');console.log(c.createHash('sha256').update('yourpassword').digest('hex'))"

async function verifyPassword(password, storedHash) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex === storedHash;
}

async function rateLimit(ip, kv) {
  const now = Date.now();
  const key = `ratelimit:${ip}`;
  let attempts = [];
  try {
    const raw = await kv.get(key);
    attempts = raw ? JSON.parse(raw) : [];
  } catch(e) {}
  const recent = attempts.filter(t => now - t < 60000);
  if (recent.length >= 5) return false;
  recent.push(now);
  await kv.put(key, JSON.stringify(recent), { expirationTtl: 60 });
  return true;
}

export async function onRequestPost({ request, env }) {
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';

  const allowed = await rateLimit(ip, env.SESSIONS);
  if (!allowed) {
    return Response.json({ success: false, error: 'Too many attempts' }, { status: 429 });
  }

  const { password } = await request.json();
  const valid = await verifyPassword(password, env.PASSWORD_HASH);

  if (!valid) {
    return Response.json({ success: false }, { status: 401 });
  }

  const token = crypto.randomUUID();
  const ttl = 30 * 24 * 60 * 60;
  await env.SESSIONS.put(`session:${token}`, '1', { expirationTtl: ttl });

  const cookie = [
    `admin_session=${token}`,
    `Max-Age=${ttl}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Strict'
  ].join('; ');

  return Response.json({ success: true }, {
    headers: { 'Set-Cookie': cookie }
  });
}