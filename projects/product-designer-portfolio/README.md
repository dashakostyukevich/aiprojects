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

### Known divergences from `design.md`

The first-screen spec asked for things `design.md` does not describe, or describes differently.
These are deliberate, and `design.md` has not been edited to match:

- **The gradient frame** is outside the palette (§2 is one accent plus neutrals for UI chrome).
  Opt-in via `hero.frame`.
- **The nav is not sticky.** §4 says fixed top; the first-screen spec says it scrolls with the
  page. It is also the §5 pill variant rather than the flat uppercase one, and has no wordmark.
- **Project card labels are plain text**, not the §5 uppercase `text-meta` treatment, and cards
  carry no shadow. The §5 label rule still applies to the collage and the meta rows.

If any of these should be reverted, `design.md` is the place to record it.

### The first screen (hero)

The first screen is built to a separate, more literal spec than the rest of the site: a **showcase
frame** with the nav, the headline, and the projects grid, floating as one white canvas.

- **Frame.** A full-viewport soft gradient with a white canvas on top: 1140px max width, 28px
  radius, `0 24px 60px rgb(0 0 0 / 0.08)` shadow, 64px top/bottom margin, `max(20px, 5vw)` sides.
  Configured by the `hero` export in `src/data.js`. The gradient is **deliberately not in the design
  system palette** — §2 is one accent plus neutrals for UI chrome. Set `hero.frame: false` to drop
  the frame and let the first screen sit directly on the design system background.
- **Nav.** The §5 pill/outline variant: a bare asterisk mark on the left (no wordmark, the link's
  accessible name carries it) and three outlined pills on the right, 12px gap, 1px ink border,
  999px radius, 8px/20px padding. Scrolls with the page, not sticky. The links themselves come
  from the `nav` export.
- **Headline.** One paragraph read as an inline flow, `clamp(1.5rem, 3.3vw, 3rem)`, line-height
  1.35, centred at a 780px measure. `profile.headline` is an array of parts, where a part is
  `{ text, em? }` or `{ chip, ...props }`, so italic spans and chips interleave in the sentence.
  The three chip types are `icon`, `photo`, and `block` (see `HeadlineChip.jsx`); they sit in word
  slots, centre on the cap-height, and wrap with the line. Chips are decorative and hidden from
  assistive tech. The three-line count is emergent, not hardcoded.
- **Projects grid.** Two columns on desktop, one on mobile, 44px column gap, 48px row gap, canvas
  padding. Cards are flat with a 22px radius and no border or shadow: `kind: 'brand'` is a solid
  fill with a centred white lockup, `kind: 'photo'` is a full-bleed `object-cover` image. The label
  is plain 16px sans text 16px beneath the card, not a bordered box.

### The display section

`src/components/sections/HeroSection.jsx` is a headline row (display type left, supporting
paragraph right, bottom-aligned) over three overlapping shapes. Rendered on the home page between
the statement band and services.

Spacing, sizing, rotation, container height, the mobile breakpoints, and the accent on one word
all follow the reference spec exactly. What changed, to fit this project:

- **Colours.** The reference's `#262626`, `#f2efec`, `#dd2f1b`, and `#e6aed3` became `ink`, `bg`,
  the §3 accent highlight, and `sky`. The emphasised word uses the highlight pattern rather than
  red text, because the accent fails contrast as a text colour (§9).
- **Type.** Anton became the project's display serif. Its line-height is 100% rather than the
  reference's 96%: 96% works only with Anton's tight metrics, and the two lines collide with the
  project serif. The display size sits on the heading, not the child spans, so the percentage
  line-height resolves against the right font size.
- **Container.** `container-page` (1200px) rather than 1450px, to match every other section.
- **Semantics.** An `h2`, not the reference's `h1`, since the first screen owns the page's only
  `h1`.
- **Copy and link** come from the `display` export in `src/data.js`. The quote reuses
  `testimonials[1]`, so it also appears in the About section; swap it if you would rather not
  repeat it.
- **Entrance timing** follows §8 via `Reveal` (0/90/180ms), the project standard.

Two fixes worth knowing about, in case the reference is used again:

- The mobile rule was "all vectors become relative", but the reference's code only did that for
  the first shape, which left the third absolutely positioned and overlapping it. All three are
  relative below 768px here. The geometry lives in a `min-width: 48rem` media query in
  `src/index.css` rather than inline styles, because inline values cannot be overridden at a
  breakpoint.
- The three SVGs were hotlinked from a third-party domain, so they are vendored into `public/hero/`
  and recoloured to the project palette. One of them, the centre blob, had the source site's
  "ECH©" logotype drawn into the SVG itself as paths; those four paths were deleted and only the
  blob kept. What remains is plain decorative geometry. These came from a design reference, so
  replace them with your own if that reference was not yours to use.

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
- `title`, `year`, `summary`, `outcome`, `tags` — used on the card and the case study.
- `kind` — `'brand'` (solid fill plus white lockup) or `'photo'` (full-bleed image).
- `fill` — card colour for brand cards, the case-study cover, and the more-work cards. Either a
  token name (`accent`, `sand`, `sky`, `terracotta`, `navy`, `ink`) or a raw hex, which is how a
  client's real brand colour goes in. Resolved by `src/lib/color.js`.
- `lockup` — the white logotype centred on a brand card. `null` falls back to the title.
- `image` — path under `public/` for a photo card. `null` renders a placeholder swatch.
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
| `/`            | First screen (frame, nav, headline, projects), statement band, display section, services, About collage, contact |
| `/work/:slug`  | Case study for that project                        |
| anything else  | 404 page                                           |

The nav is rendered by each page rather than a global header, so the home page can put it inside
the frame. Case studies and the 404 page carry the same row above a hairline.

An unknown `/work/:slug` redirects to `/#work` rather than showing a dead end. The
`netlify.toml` SPA redirect is what makes these deep links work on refresh in production.

The nav's links are `/#section` hash links. `useHashScroll` (in `App.jsx`) scrolls to them after
the route changes, including when navigating in from a case study.

## Project images

Brand cards render a white logotype and photo cards render a placeholder swatch until real assets
exist. To add them, drop files in `public/` (e.g. `public/work/atlas.png`) and set `image` on the
project. The same applies to the collage's photo cards (`PhotoCard` in
`src/components/CollageCard.jsx`) and the hero's photo chip, which takes an `src` in
`profile.headline`.

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
