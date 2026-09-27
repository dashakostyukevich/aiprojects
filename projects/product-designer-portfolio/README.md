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
- **§3 Display + text pairing.** Space Grotesk for headings and display type, Geist for everything
  functional. Both load from Google Fonts via a `<link>` in `index.html`, and both are variable
  fonts, so one file each covers the 400–700 range the site uses. Tokens: `--font-display` and
  `--font-sans`. There is no `--font-serif`; `design.md` §3 asked for a serif + sans pairing and
  that was a deliberate departure, recorded below.
- **No italics in display type.** Space Grotesk ships **no italic cut** — the Google Fonts API
  silently returns normal-only for an `ital` request, and the browser would otherwise synthesise a
  slanted oblique that looks broken next to upright text. So emphasis inside a display heading is
  carried by the accent highlight (where the design already had one) or by weight `500` against a
  `400` body, which the variable font supports natively. The `em` / `italic` flags in `data.js`
  are unchanged; only the rendering changed, so restoring real italics is a one-line change in
  `HeroHeadline.jsx` and `CollageAbout.jsx`. Geist *does* have a real italic, so the testimonial
  blockquotes on the home page keep theirs.
- **§8 Scroll-scrubbed word reveal.** Display headings reveal word by word, driven by scroll
  position rather than a one-shot trigger. `src/components/SplitReveal.jsx` is the component; see
  its own comment block and the "Word-by-word reveal" section below.
- **§3 Highlight pattern.** The emphasised phrase in a `text-display` headline gets an accent
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

- **No serif.** §3 specifies a warm serif for editorial headlines, used in both roman and italic.
  The site now pairs Space Grotesk with Geist and has dropped the serif entirely, which also means
  §3's serif+italic headline pattern cannot be honoured as written (see the no-italics note above).
  §3 named Fraunces and Inter only as examples, so the substitution is within the spirit of the
  section, but the italic treatment is a real loss and `design.md` should be updated if this is
  meant to be permanent.
- **The first screen is full-bleed.** A showcase frame (gradient + white canvas) was built first
  and later removed, so the hero and projects grid now run the full width of the page on the plain
  design system background. No shadow, no rounded canvas, no off-palette gradient.
- **The nav is not sticky.** §4 says fixed top; the first-screen spec says it scrolls with the
  page. It is also the §5 pill variant rather than the flat uppercase one, and has no wordmark.
- **Project card labels are plain text**, not the §5 uppercase `text-meta` treatment, and cards
  carry no shadow. The §5 label rule still applies to the collage and the meta rows.

If any of these should be reverted, `design.md` is the place to record it.

### The first screen (hero)

The first screen is full-bleed: the nav row, a hero that fills the viewport height below it, and the
projects grid all run the full width of the page, edge to edge, on the plain design system
background. There is no canvas wrapper.

- **Layout.** `NavRow` is a 72px row with page padding (`px-4 sm:px-14 lg:px-16`). The hero is a
  flex container of `min-h-[calc(100dvh-4.5rem)]` that centres its content, so the first screen is
  exactly one viewport tall. The grid section carries the same horizontal padding, with the grid
  itself capped at `max-w-[1200px]` so cards stay readable on very wide displays.
- **Nav.** The §5 pill/outline variant: a bare asterisk mark on the left (no wordmark, the link's
  accessible name carries it) and three outlined pills on the right, 12px gap, 1px ink border,
  999px radius, 8px/20px padding. Scrolls with the page, not sticky. The links themselves come
  from the `nav` export.
- **Headline.** One paragraph read as an inline flow, `clamp(1.75rem, 4.4vw, 4rem)` (63px at
  1440), line-height 1.15, tracking `-0.035em`, `text-transform: uppercase`, centred at a 1000px
  measure. `profile.headline` is an array of parts, where a part is `{ text, em? }` or
  `{ chip, ...props }`, so emphasised spans and chips interleave in the sentence. The three chip
  types are `icon`, `photo`, and `block` (see `HeadlineChip.jsx`); they sit in word slots, centre on
  the cap-height, and wrap with the line. Chips are decorative and hidden from assistive tech. The
  line count is emergent, not hardcoded — uppercase wraps it to four lines at desktop width.

  Two details that only exist because of the caps:
  - `uppercase` is a class on the `h1`, not baked into the strings in `data.js`. The About section
    renders the same `profile.headline` array and keeps its sentence case.
  - Caps are much wider and taller than lowercase in Space Grotesk, so the measure grew from 780px
    to 1000px and the size went up; the old pairing only worked because the text was mostly
    x-height glyphs. Leading dropped from 1.35 to 1.15 to keep the block from sprawling.
  - `em` maps to weight **600**, not 500. Caps carry less stroke contrast than lowercase, so a
    400/500 pair is nearly invisible at this size.
- **Projects grid.** An intentionally uneven 12-column composition, not a uniform 2×2. Each project
  in `data.js` carries three placement keys, and `WorkGrid.jsx` maps them to classes:

  | key | values | effect |
  | --- | --- | --- |
  | `size` | `wide` (7 cols), `narrow` (5 cols) | 7+5 and 5+7 fill both rows exactly, so nothing leaves a gap |
  | `ratio` | `wide` (16/10), `landscape` (4/3), `square`, `portrait` (3/4) | the crop, and the main reason the grid does not read as a table of squares |
  | `drop` | `sm`/`md`/`lg`/`xl` (10/16/24/32 units top margin) | staggers a card against its neighbour |

  Current arrangement: Atlas `wide`/`landscape`/no drop, Fieldnote `narrow`/`square`/`lg`,
  Kern `narrow`/`square`/no drop, Pulse `wide`/`wide`/`md`. So each row has one card hanging lower
  than the other, and the two rows stagger in opposite directions.

  `drop` and `size` only apply from `lg` up. Below that the grid is a single full-width column in
  array order, which is the only sane reading order on a phone, and the varied `ratio`s still carry
  through. Column gap is 40–64px, row gap 64–96px, growing with the viewport so the grid breathes.

  Cards are flat with a 22px radius and no border or shadow: `kind: 'brand'` is a solid fill with a
  centred white lockup, `kind: 'photo'` is a full-bleed `object-cover` image. The label is plain
  16px sans text 16px beneath the card, not a bordered box.

### Word-by-word reveal

`src/components/SplitReveal.jsx` wraps display headings and reveals them a word at a time, scrubbed
by scroll position rather than fired once as a trigger. It is used on the hero headline, the
services `h2` and its three `h3`s, the About headline, and the footer `h2`.

- **How it scrubs.** A single `progress` value (0 → 1) is derived from where the block sits in the
  viewport, between 92% and 34% of viewport height, and mapped across the words. Scrolling moves the
  reveal, so the reader controls the pace. Each word's slice overlaps its neighbour's by `spread`
  words, which is what makes it read as a wave rather than a typewriter.
- **Two entry paths.** A block that is already at least partly on screen at mount plays a 1100ms
  ease-out intro ramp from 0 — this is the hero. A block below the fold waits for scroll. Note the
  test is `> 0`, not `>= 1`: the hero is usually not fully clear of the viewport bottom when it
  mounts, so a `>= 1` test would park it at ~0.87 with nothing left to trigger it.
- **One-way.** Once a word is revealed it stays revealed, so scrolling back up never re-hides text
  the reader has already read.
- **Two safety nets.** A fast scroll (keyboard jump, hash link, flung trackpad) can sail past the
  trigger band, and a heading near the document end can never scroll far enough to reach it. Both
  cases resolve to fully revealed rather than stuck hidden — the second via an `atBottom` check in
  `measure()`.
- **No React re-render per frame.** `progress` is a ref, and the rAF loop writes inline styles
  directly. Those styles must not come from JSX: React owns the `style` attribute, so a re-render
  would overwrite them and snap the words back to hidden. The hidden start state lives in
  `.split-word` in `index.css` instead.
- **Markup.** Each word is a mask (`overflow-hidden`) wrapping a `.split-word` span that does the
  moving. Whitespace between words is emitted as plain text, so text selection and copy-paste
  still yield `"I design calm, useful interfaces"`. An element marked `data-split` is a styled run
  of text: each of its words gets its own mask, while the wrapper's classes go on a single
  `inline-block` around the whole run. That is what keeps a background highlight one continuous
  block — putting the class on each word instead splits it into separate boxes, and the wrapper
  must be `inline-block` or the gaps between its children show through. A trailing space inside
  such a run is re-emitted after the wrapper, since `inline-block` would otherwise collapse it and
  run the last word into the next.
- **Reduced motion.** With `prefers-reduced-motion: reduce` everything is revealed immediately and
  no listener is attached. The `<noscript>` block in `index.html` does the same, since the words
  start hidden.

The statement band is deliberately **not** wrapped: its `whitespace-nowrap` and negative
`translate-x` fight the per-word masks.

### The display section

`src/components/sections/HeroSection.jsx` is a headline row (display type left, supporting
paragraph right, bottom-aligned) over three overlapping shapes. Rendered on the home page between
the statement band and services.

Spacing, sizing, rotation, container height, the mobile breakpoints, and the accent on one word
all follow the reference spec exactly. What changed, to fit this project:

- **Colours.** The reference's `#262626`, `#f2efec`, `#dd2f1b`, and `#e6aed3` became `ink`, `bg`,
  the §3 accent highlight, and `sky`. The emphasised word uses the highlight pattern rather than
  red text, because the accent fails contrast as a text colour (§9).
- **Type.** Anton became Space Grotesk, the project display face. Its line-height is 100% rather
  than the reference's 96%: 96% works only with Anton's tight metrics, and the two lines collide
  with Space Grotesk's taller ascenders. The display size sits on the heading, not the child spans,
  so the percentage line-height resolves against the right font size. The reference's italic
  emphasised word became the accent highlight alone, because Space Grotesk has no italic cut.
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
| `/`            | First screen (nav, hero, projects), statement band, display section, services, About collage, contact |
| `/work/:slug`  | Case study for that project                        |
| anything else  | 404 page                                           |

The nav is rendered by each page rather than a global header, so the home page can place it at the
top of its first screen. Case studies and the 404 page carry the same row above a hairline.

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
