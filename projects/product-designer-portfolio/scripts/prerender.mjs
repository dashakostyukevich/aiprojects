/**
 * Per-route prerender.
 *
 * The problem this solves: the site is a client-rendered SPA, so every
 * indexable URL shipped the same <title>, the same <meta description>, no
 * canonical, and no structured data. The four case studies are the pages most
 * likely to be searched and least likely to be indexed correctly.
 *
 * What it does: after `vite build`, this script writes one real HTML file per
 * route into dist/, each with its own head tags. Netlify already serves
 * /work/<slug> through the SPA fallback in netlify.toml, and a directory with
 * an index.html inside takes precedence over that rewrite, so the static file
 * wins on a cold hit and the client router takes over on navigation.
 *
 * What it deliberately does NOT do: render the React tree. Server-rendering the
 * app would mean a second renderer, and the animations all start from
 * opacity 0 in CSS anyway, so the prerendered body would be an empty root
 * div. What actually matters for a crawler is the head: one honest title, one
 * honest description, a canonical, and JSON-LD that describes the work.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

// Single source of truth: the same file the app reads at runtime. Values that
// differ between build and runtime would be worse than no metadata at all.
const { profile, projects } = await import(join(root, 'src/data.js'))

const SITE = (process.env.SITE_URL ?? 'https://example.com').replace(/\/$/, '')

const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  )

const routes = [
  {
    path: '/',
    file: 'index.html',
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      mainEntity: {
        '@type': 'Person',
        name: profile.name,
        jobTitle: profile.role,
        url: `${SITE}/`,
      },
    },
  },
  ...projects.map((p) => ({
    path: `/work/${p.slug}`,
    file: join('work', p.slug, 'index.html'),
    title: `${p.title} — ${profile.name}`,
    description: `${p.summary} ${p.outcome}.`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: p.title,
      headline: p.title,
      description: `${p.summary} ${p.outcome}.`,
      dateCreated: p.year,
      creator: { '@type': 'Person', name: profile.name, jobTitle: profile.role },
      keywords: p.tags.join(', '),
      url: `${SITE}/work/${p.slug}`,
    },
  })),
]

function headFor(route) {
  const url = `${SITE}${route.path}`
  return [
    `<title>${escape(route.title)}</title>`,
    `<meta name="description" content="${escape(route.description)}" />`,
    `<link rel="canonical" href="${escape(url)}" />`,
    `<meta property="og:type" content="${route.path === '/' ? 'website' : 'article'}" />`,
    `<meta property="og:title" content="${escape(route.title)}" />`,
    `<meta property="og:description" content="${escape(route.description)}" />`,
    `<meta property="og:url" content="${escape(url)}" />`,
    `<meta property="og:image" content="${SITE}/og/${route.path === '/' ? 'home' : route.file.split('/')[1]}.png" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<script type="application/ld+json">${JSON.stringify(route.jsonLd)}</script>`,
  ].join('\n    ')
}

if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/index.html not found. Run `vite build` first.')
  process.exit(1)
}

const template = await readFile(join(dist, 'index.html'), 'utf8')

// Strip the template's own head metadata. Everything between the first
// <title> and the end of the last <script type="application/ld+json"> block
// is replaced wholesale, so the home page's values can never leak into a case
// study. Font preloads and the noscript block sit outside this range and are
// preserved.
const HEAD_BOUNDS = /(<title>[\s\S]*?<\/script>)/

for (const route of routes) {
  const replaced = template.replace(HEAD_BOUNDS, () => headFor(route))
  const out = join(dist, route.file)
  await mkdir(dirname(out), { recursive: true })
  await writeFile(out, replaced, 'utf8')
  console.log(`prerendered ${route.path} -> ${route.file}`)
}

// sitemap.xml and robots.txt. Both are pure additions; no existing route,
// nav label, anchor or field is touched.
const today = new Date().toISOString().slice(0, 10)
const urls = routes
  .map(
    (r) =>
      `  <url>\n    <loc>${SITE}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${r.path === '/' ? '1.0' : '0.7'}</priority>\n  </url>`,
  )
  .join('\n')

await writeFile(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  'utf8',
)
console.log('wrote sitemap.xml')

await writeFile(
  join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`,
  'utf8',
)
console.log('wrote robots.txt')
