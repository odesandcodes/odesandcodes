import bcrypt from 'bcryptjs';

// Rate limiting via KV: key = "ratelimit:{ip}", value = JSON array of timestamps
async function rateLimit(ip, kv) {
  const now = Date.now();
  const key = `ratelimit:${ip}`;
  const raw = await kv.get(key);
  const attempts = raw ? JSON.parse(raw) : [];
  const recent = attempts.filter(t => now - t < 60000); // 1 min window

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
  const valid = await bcrypt.compare(password, env.PASSWORD_HASH);

  if (!valid) {
    return Response.json({ success: false }, { status: 401 });
  }

  // Generate session token
  const token = crypto.randomUUID();
  const ttl = 30 * 24 * 60 * 60; // 30 days in seconds
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