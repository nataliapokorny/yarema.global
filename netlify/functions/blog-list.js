// netlify/functions/blog-list.js
//
// Reads every markdown file in _data/blog/ directly from the GitHub repo
// and returns a JSON array of post metadata for the blog cards on the homepage.
// No manual index file needed — publishing a post in the CMS is enough.
//
// Required environment variables (set in Netlify dashboard → Site settings → Environment variables):
//   GITHUB_TOKEN  – a GitHub personal access token with "repo" (or "public_repo") scope
//   GITHUB_REPO   – "owner/repo", e.g. "yaremaglobal/yarema.global"
//   GITHUB_BRANCH – optional, defaults to "main"

exports.handler = async function (event) {
  const token  = process.env.GITHUB_TOKEN;
  const repo   = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  const headers = {
    'User-Agent': 'yarema-global-blog-function',
    'Accept': 'application/vnd.github+json'
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const cacheHeaders = {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=120' // cache 2 minutes — keeps GitHub API calls low
  };

  if (!repo) {
    return {
      statusCode: 500,
      headers: cacheHeaders,
      body: JSON.stringify({ error: 'GITHUB_REPO environment variable is not set' })
    };
  }

  try {
    // 1. List files in _data/blog/
    const listUrl = `https://api.github.com/repos/${repo}/contents/_data/blog?ref=${branch}`;
    const listRes = await fetch(listUrl, { headers });

    if (listRes.status === 404) {
      // Folder doesn't exist yet (no posts published) — return empty list, not an error.
      return { statusCode: 200, headers: cacheHeaders, body: '[]' };
    }
    if (!listRes.ok) {
      const text = await listRes.text();
      return {
        statusCode: 502,
        headers: cacheHeaders,
        body: JSON.stringify({ error: 'GitHub list request failed', detail: text })
      };
    }

    const files = await listRes.json();
    const mdFiles = (Array.isArray(files) ? files : [])
      .filter(f => f.type === 'file' && f.name.endsWith('.md'));

    // 2. Fetch raw content for each markdown file in parallel
    const posts = await Promise.all(mdFiles.map(async file => {
      try {
        const rawRes = await fetch(file.download_url, { headers });
        if (!rawRes.ok) return null;
        const raw = await rawRes.text();
        const { data } = parseFrontmatter(raw);
        const slug = file.name.replace(/\.md$/, '');

        return {
          slug,
          title: data.title || slug,
          excerpt: data.excerpt || '',
          tag: data.tag || 'Article',
          date: data.date || '',
          image: data.image || '',
          published: data.published !== 'false' && data.published !== false
        };
      } catch (e) {
        return null;
      }
    }));

    const clean = posts
      .filter(p => p && p.published)
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    return { statusCode: 200, headers: cacheHeaders, body: JSON.stringify(clean) };
  } catch (err) {
    return {
      statusCode: 500,
      headers: cacheHeaders,
      body: JSON.stringify({ error: 'Unexpected error', detail: String(err) })
    };
  }
};

// Minimal frontmatter parser: expects
// ---
// key: value
// ---
// markdown body...
function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]*([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const [, fmBlock, body] = match;
  const data = {};
  fmBlock.split(/\r?\n/).forEach(line => {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) return;
    let val = m[2].trim();
    if (/^".*"$/.test(val) || /^'.*'$/.test(val)) val = val.slice(1, -1);
    data[m[1]] = val;
  });
  return { data, body };
}
