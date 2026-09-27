# Design System

Base structure from gowthamganesan.com, "random-things" collage pattern from Umi's About page, and typographic/grid style from the Framer "Luna Rae" template.

## 1. Design Principles

- **Structure vs. chaos** — typography and layout stay disciplined; imagery and accents are where personality lives.
- **One accent, used loudly** — a single saturated color carries all emotional weight. Everything else is black/cream/white.
- **Scale is the hierarchy** — size does more work than color or weight. Big means important.
- **Full-bleed, not boxed** — content runs edge-to-edge; break the grid intentionally, not accidental.
- **Editorial warmth** — serif + italic mixed into headlines gives a human, hand-written feel against otherwise clean structure.
- **Curated chaos, not meme chaos** — floating collage elements (About page) are designed cards with consistent radius/shadow, not raw internet imagery.

## 2. Color

### Primary palette

| Token | Value | Usage |
| --- | --- | --- |
| `color-bg` | `#FDFCF8` | Primary background — warm off-white/cream |
| `color-bg-alt` | `#FFFFFF` | Content cards, panels sitting on `color-bg` |
| `color-text` | `#0A0A0A` | Primary text, headlines, nav |
| `color-text-muted` | `#6B6B6B` | Secondary labels, meta/date rows |
| `color-accent` | `#D4FF3D` | Single brand accent (chartreuse/lime) — highlights, badges, key CTAs |
| `color-accent-ink` | `#0A0A0A` | Text/icons placed on top of `color-accent` |
| `color-border` | `#E8E6DF` | Hairline dividers, card outlines |
| `color-card-neutral` | `#EFEBE2` | Neutral card fill (beige/tan) for non-accent floating cards |

### Secondary/illustration accents

Used only inside collage illustrations, never as UI chrome.

- Dusty terracotta `#C77B5C`
- Navy `#1A1F2E`
- Soft sky blue `#BFE3F0`

> **Rule:** UI chrome (nav, buttons, links, form states) only ever uses `color-accent` + neutrals. Illustration accents stay inside artwork.

## 3. Typography

Typefaces: pair a warm serif (editorial headline) with a clean grotesk/sans (everything functional).

- **Serif:** e.g. Canela, Fraunces, or GT Sectra — used in both roman and italic
- **Sans:** e.g. Inter, Suisse Int'l, or Neue Haas Grotesk — used for nav, UI, body

| Token | Font | Size (desktop) | Size (mobile) | Weight/Style | Usage |
| --- | --- | --- | --- | --- | --- |
| `text-display` | Serif, mixed roman/italic | 48–64px | 32–40px | 400 roman / 400 italic | Hero headline — italicize the key phrase, highlight it with `color-accent` (highlighter stroke behind the text) |
| `text-display-xl` | Sans, bold | 120–180px | 56–72px | 700–800 | Full-bleed statement headline (landing/hero variant), bleeds off viewport edge |
| `text-h1` | Sans | 40–56px | 28–32px | 600 | Section headers |
| `text-h2` | Sans | 28–32px | 22–24px | 600 | Sub-headers |
| `text-nav` | Sans | 14px | 13px | 500, +4% tracking, uppercase or in pill buttons | Nav links |
| `text-body` | Sans | 16–18px | 15–16px | 400 | Paragraph copy |
| `text-meta` | Sans | 12–13px | 12px | 500, +2% tracking, uppercase | Dates, tags, card labels, table rows |

### Inline chip pattern (Luna Rae reference)

Small rounded shapes/icons can sit inline within a headline sentence, replacing or emphasizing a word — e.g. a flower icon after "Hi," or a color-block pill mid-sentence. Use sparingly, max 2–3 per headline, sized to match the surrounding cap-height.

### Highlight pattern (Umi reference)

Apply `color-accent` as a highlighter-style background behind italicized phrases within `text-display` — mimics a marker stroke, slightly uneven/rotated baseline is fine.

## 4. Spacing & Grid

- **Base unit:** 8px
- **Scale:** 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128
- **Container:** full-bleed (100vw) for hero/statement sections; 1140–1200px max-width, centered, for readable content and the "framed" page feel (Luna Rae wraps the whole site in a card on a colored backdrop — optional treatment for a landing/teaser page)
- **Nav height:** 64–80px, fixed top, flat single row (utility-sans style) or pill-button style
- **Section padding (desktop):** 96–160px vertical
- **Section padding (mobile):** 48–64px vertical

### Grid discipline vs. freedom

- Nav, footer, and content/data tables → strict 12-col grid, aligned
- Hero/statement moments → free-form absolute positioning allowed, anchored to a few consistent baseline points
- About page → "random-things" grid (§6): loosely scattered but every element sits on an underlying 12-col/8px grid so nothing is truly random — stagger vertical offsets in controlled bands, not pixel-chaos

## 5. Components

### Nav bar — two variants

- **Flat utility** — logo/name left, links center-right, all uppercase `text-nav`, generous letter spacing (gowthamganesan.com style)
- **Pill/outline** — each nav item in its own `rounded-full` outlined button (1px `color-text` border, transparent fill, serif or sans label), evenly spaced, centered or right-aligned (Luna Rae style) — use for softer, more approachable pages like About or a coming-soon/teaser

### Buttons / CTAs

- Solid `color-accent` fill, `color-accent-ink` text, 4–8px radius (softer than a fully-flat system — matches the warmer palette)
- **Outline variant:** 1px `color-text` border, transparent fill, full pill radius — for nav/secondary actions
- **Hover:** darken fill 8%, no scale/shadow tricks

### Floating collage card

Core unit of the "random-things" grid (layout in §6).

- **Radius:** 16–20px
- **Shadow:** soft, low-opacity — `0 8px 24px rgba(0,0,0,0.06)`
- **Fill:** `color-bg-alt` or `color-card-neutral`
- **Padding:** 16–24px internal
- **Rotation:** optional ±2–4° tilt on a subset of cards for organic feel — never more than ±6°

**Card sub-types:**

- **Illustration card** — line-art icon/character on transparent or neutral fill, no border
- **Photo + rating card** — rounded photo (12–16px radius) + title + small star rating + category label beneath, on `color-bg-alt`
- **Chat/quote card** — small avatar or icon + short line of text, minimal padding, no border, reads like a message bubble
- **Badge/goal chip** — solid `color-accent` or `color-card-neutral` fill, checkmark or icon, bold short label ("Goal complete!")
- **Stat/progress card** — small sparkline or number + label, neutral fill

### Project/work grid (Luna Rae reference)

- Square or 4:5 cards, 16–20px radius, solid color or photo fill
- Label directly beneath each card (project name only, sans, `text-meta` weight) — no border, no card chrome around the label
- 2–3 columns desktop, 1–2 mobile, generous gutter (32–48px)

### Data/meta rows (work history, project list — utility pages)

- Plain table-like rows, thin `color-border` divider
- Columns: year / project / role — left-aligned, `text-meta` token

## 6. About Page Pattern — "Random-Things Grid"

Use this specifically for an About/personality page (per Umi reference):

1. Start from an invisible 12-col grid across the full page width.
2. Place a headline (`text-display`, serif + italic + highlight per §3) roughly center, spanning 6–8 columns.
3. Scatter 8–14 floating collage cards (see §5 sub-types) around the headline — mix illustration, photo, badge, and stat cards so no two adjacent cards are the same type.
4. Keep a loose radial balance: denser card clustering near the edges/corners, headline area kept clearest for legibility.
5. Apply consistent shadow + radius (§5) to every card regardless of type — this is what keeps "random" from reading as "messy."
6. Limit rotation and overlap: cards may touch/slightly overlap but should never fully obscure another card or the headline.
7. On mobile, stack collage cards into a simple 2-column masonry below the headline rather than attempting free positioning.

## 7. Imagery & Iconography

- **Hero/About collage:** mix of custom line-art illustrations, real photography (rounded, card-framed), and UI/product snippets — all designed assets, not raw internet memes
- **Case-study/work imagery elsewhere:** clean product shots or UI screens, no collage mixing outside hero/About
- **Icons:** simple line-weight consistent with the sans typeface's stroke weight

## 8. Motion

- Scroll-triggered entrance for collage cards (fade + slight drift/rotation), staggered by ~60–100ms per card
- Hover states on cards: subtle lift (`translateY(-2px)`) + shadow increase, 150–200ms ease
- Nav/buttons: instant or near-instant, no elaborate easing
- Respect `prefers-reduced-motion` — disable drift/parallax for those users

## 9. Accessibility Notes

- `color-text` on `color-bg` = high contrast (safe)
- `color-accent` (#D4FF3D) has low contrast with white/light text — always pair with `color-accent-ink` (dark) text on top of it, never light text
- Highlighter-style text treatment must still meet contrast on the underlying accent block
- Ensure floating collage cards don't trap keyboard focus order in a confusing sequence — set explicit tab order matching visual reading flow (headline → left cluster → right cluster)

## 10. Implementation Notes (Figma / Webflow)

- **Figma:** set up `color-*` and `text-*` as variables/style tokens; build the floating card as a single component with variants for each sub-type (illustration / photo / chat / badge / stat) so the About page grid is just instances, not one-offs
- **Webflow:** mirror tokens as CSS variables at `:root`; build the "random-things grid" as a `relative`-positioned wrapper with absolutely-positioned card divs on desktop, switching to a CSS masonry/column layout at mobile breakpoint via a class swap
- Keep the hero and About-page collage sections as isolated symbols/components so their free-form layout doesn't leak into grid-based sections elsewhere on the site
