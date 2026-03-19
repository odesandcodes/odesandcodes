export async function onRequestPost({ request, env }) {
  const cookie = request.headers.get('cookie') || '';
  const token = getCookie(cookie, 'admin_session');

  if (token) {
    await env.SESSIONS.delete(`session:${token}`);
  }

  // Clear the cookie
  const cleared = 'admin_session=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict';
  return Response.json({ success: true }, {
    headers: { 'Set-Cookie': cleared }
  });
}

function getCookie(cookieStr, name) {
  const match = cookieStr.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? match[1] : null;
}