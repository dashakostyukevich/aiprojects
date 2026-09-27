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

## Design system

**`design.md` is the source of truth for the visual design.** It was added after the first build
and the site has since been restyled to match it. Read `design.md` before changing anything
visual, and change it there first, then mirror the value into code.

The rules that shape the code most:

- **§2 One accent, used loudly.** Chartreuse `#D4FF3D` is the only brand colour. Terracotta, navy
  and sky are illustration accents and stay inside artwork. UI chrome never uses them.
- **§2 Accent contrast.** `#D4FF3D` is only ever paired with `color-accent-ink` (`#0A0A0A`), never
  light text.
- **§3 Serif + sans pairing.** Fraunces for editorial headlines (roman and italic), Inter for
  everything functional. Both load from Google Fonts via a `<link>` in `index.html`.
- **§3 Highlight pattern.** The italic phrase in a `text-display` headline gets an accent
  marker-pen background. The hero headline is data-driven, not hardcoded, so the highlighted
  phrase is a flag in `profile.headline`.
- **§3 `text-display-xl` bleeds.** The statement band under the hero is deliberately cropped at
  the viewport edge. Its size is in `vw` so both lines stay near-whole at any width.
- **§4 Container.** 1200px max width, full-bleed hero and statement sections.
- **§5 Nav** is the flat utility variant: name left, uppercase `text-nav` links right.
- **§5 Buttons.** Solid accent (6px radius) for primary, outlined pill for secondary. Hover
  darkens, no scale or shadow tricks.
- **§5 Project grid.** 4:5 cards, 18px radius, solid colour fill, label beneath in `text-meta`
  with no card chrome.
- **§5 Data/meta rows.** Experience and case-study meta are plain rows with a hairline divider.
- **§6 About collage.** The About section is the "random-things" grid: cards on an invisible
  12-col grid, headline in a clear middle band, dense near the edges, mobile falls back to a
  2-column masonry.
- **§8 Motion.** Scroll-triggered entrances with a 60ms stagger, hover lift of 2px, and
  `prefers-reduced-motion` support.
- **§9 Accessibility.** Dark text on every accent block; collage cards follow DOM order, which
  matches the visual reading flow.

### Where the tokens live

`src/index.css` holds every design token in a Tailwind v4 `@theme` block: the `color-*`, `font-*`
and `text-*` scales from `design.md`, plus the card radius and shadow. The `@utility` rules below
it are the reusable pieces: `container-page`, `nav-link`, `label-meta`, `highlight`, `btn-accent`,
`btn-outline`, `collage-card`, `collage-item`.

Adding a token means editing `@theme` in `src/index.css` and recording it in `design.md`.

## Editing content

All copy lives in `src/data.js` — name, bio, links, services, experience, testimonials, the
`collage` array, and the `projects` array. Replacing the placeholders normally means editing that
one file.

Each entry in `projects` needs:

- `slug` — becomes the URL, `/work/<slug>`. Must be unique.
- `title`, `year`, `summary`, `outcome`, `tags` — used on the work grid and the card.
- `fill` — the card colour. One of `accent`, `sand`, `sky`, `terracotta`, `navy`, `ink`.
- `meta` — the sidebar block (role, timeline, team, platform, status). Add or remove keys freely;
  the labels come from `metaLabels` in `src/pages/CaseStudy.jsx`.
- `intro` and `sections` — the long-form body. `sections` is an array of `{ heading, body }`, where
  `body` is an array of paragraphs. Order is whatever reads best; nothing is hardcoded.
- `pullquote` / `pullquoteBy` — optional. Set both to `null` to hide the block.

Each entry in `collage` needs `type` (`stat`, `illustration`, `photo`, `quote`, `badge`), a `fill`
from the same palette, and optionally `pos` (`left`, `top`, `width` as percentages, desktop only)
and `rotate` in degrees. No two adjacent cards should share a type. The wrapper is a fixed
`lg:h-[900px]`, so keep card `top` values inside that budget.

## Routes

| Route          | Page                                               |
| -------------- | -------------------------------------------------- |
| `/`            | Home: hero, statement, work grid, services, About collage, contact |
| `/work/:slug`  | Case study for that project                        |
| anything else  | 404 page                                           |

An unknown `/work/:slug` redirects to `/#work` rather than showing a dead end. The
`netlify.toml` SPA redirect is what makes these deep links work on refresh in production.

The header's `Work / Services / About / Contact` links are `/#section` hash links. `SiteHeader`
scrolls to them after the route changes, including when navigating in from a case study page.
`Services` is hidden below the `sm` breakpoint so the header fits a 390px viewport.

## Project images

Project cards, case-study covers, and the collage's photo/illustration cards are all solid colour
blocks standing in for real assets. To add real images, drop files in `public/` (e.g.
`public/work/atlas.png`) and replace the fill `<div>` in `src/components/ProjectCard.jsx`,
`src/pages/CaseStudy.jsx`, and the `PhotoCard` in `src/components/CollageCard.jsx`.

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
