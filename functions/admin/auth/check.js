export async function onRequestGet({ request, env }) {
  const cookie = request.headers.get('cookie') || '';
  const sessionToken = getCookie(cookie, 'admin_session');

  if (!sessionToken) {
    return Response.json({ authenticated: false });
  }

  const stored = await env.SESSIONS.get(`session:${sessionToken}`);
  return Response.json({ authenticated: !!stored });
}

function getCookie(cookieStr, name) {
  const match = cookieStr.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? match[1] : null;
}