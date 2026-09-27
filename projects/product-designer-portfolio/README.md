# product-designer-portfolio

Portfolio site for a product designer: a one-page home plus a case study page per project.
React + Vite + Tailwind CSS v4, `react-router-dom` for routing, static build, ready to deploy on
Netlify.

## Commands

```sh
npm run dev      # local dev server
npm run build    # production build into dist/
npm run preview  # serve the built dist/ locally
npm run lint     # oxlint
```

## Editing content

All copy lives in `src/data.js` — name, bio, links, services, experience, testimonials, and the
`projects` array. Replacing the placeholders normally means editing that one file.

Each entry in `projects` needs:

- `slug` — becomes the URL, `/work/<slug>`. Must be unique.
- `title`, `year`, `summary`, `outcome`, `tags`, `accent` — used on the work grid and the card.
- `meta` — the sidebar block (role, timeline, team, platform, status). Add or remove keys freely;
  the labels come from `metaLabels` in `src/pages/CaseStudy.jsx`.
- `intro` and `sections` — the long-form body. `sections` is an array of `{ heading, body }`, where
  `body` is an array of paragraphs. Order is whatever reads best; nothing is hardcoded.
- `pullquote` / `pullquoteBy` — optional. Set both to `null` to hide the block.

## Routes

| Route          | Page                                                      |
| -------------- | --------------------------------------------------------- |
| `/`            | Home: hero, work grid, services, about, contact            |
| `/work/:slug`  | Case study for that project                               |
| anything else  | 404 page                                                   |

An unknown `/work/:slug` redirects to `/#work` rather than showing a dead end. The
`netlify.toml` SPA redirect is what makes these deep links work on refresh in production.

The header's `Work / Services / About / Contact` links are `/#section` hash links. `SiteHeader`
scrolls to them after the route changes, including when navigating in from a case study page.

## Project images

Project cards and case study covers currently use gradient blocks as stand-ins. To add real
images, drop files in `public/` (e.g. `public/work/atlas.png`), then use them where the gradient
`<div>` is in `src/components/ProjectCard.jsx` and `src/pages/CaseStudy.jsx`.

## Deploying to Netlify

`netlify.toml` is already set up: build command `npm run build`, publish directory `dist`, plus a
SPA redirect so deep links work.

1. Push the project to a GitHub repo.
2. In Netlify: **Add new site → Import an existing project** and pick the repo. The
   `netlify.toml` is detected automatically, so no manual build settings needed.
3. Deploy. Any push to the connected branch redeploys.

The SPA redirect in `netlify.toml` is required. Without it, reloading `/work/atlas-analytics`
returns Netlify's 404 page instead of the case study.

For a quick throwaway preview without GitHub, `npx netlify deploy` works too.
