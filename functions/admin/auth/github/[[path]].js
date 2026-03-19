export async function onRequest({ request, env, params }) {
  // Auth check
  const cookie = request.headers.get('cookie') || '';
  const token = getCookie(cookie, 'admin_session');
  if (!token) return Response.json({ error: 'Not authenticated' }, { status: 401 });

  const stored = await env.SESSIONS.get(`session:${token}`);
  if (!stored) return Response.json({ error: 'Not authenticated' }, { status: 401 });

  // Build GitHub URL from the wildcard path segments
  const githubPath = params.path ? params.path.join('/') : '';
  const url = new URL(request.url);
  const githubUrl = `https://api.github.com/${githubPath}${url.search}`;

  // Forward the request to GitHub
  const githubRes = await fetch(githubUrl, {
    method: request.method,
    headers: {
      'Authorization': `token ${env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'OdesAndCodes-Admin'
    },
    body: request.method !== 'GET' ? await request.text() : undefined
  });

  const data = await githubRes.json();
  return Response.json(data, { status: githubRes.status });
}

function getCookie(cookieStr, name) {
  const match = cookieStr.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? match[1] : null;
}