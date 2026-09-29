# Design System

Base structure from gowthamganesan.com and typographic/grid style from the Framer "Luna Rae" template.

Section-level patterns since: the scattered-object hero, the flat service cards, and the centred editorial About column, all from the references in `references/`. Everything below is what the code actually does — if the two ever disagree, the code wins and this file is the thing that is wrong.

## 1. Design Principles

- **Structure vs. chaos** — typography and layout stay disciplined; imagery and accents are where personality lives.
- **One accent, used loudly** — a single saturated color carries all emotional weight. Everything else is black/cream/white.
- **Scale is the hierarchy** — size does more work than color or weight. Big means important.
- **Full-bleed, not boxed** — content runs edge-to-edge; break the grid intentionally, not accidental.
- **Editorial warmth** — a mix of case and weight, not a serif. The site's voice is a poster: uppercase set at a real size, one accent doing all the emotional work.
- **Curated chaos, not meme chaos** — the scattered objects on the hero are drawn to one rule, and the scatter is chosen by eye rather than generated. Random-looking is not the same as random.
- **The page gets quieter as it goes.** Full-bleed type, then data rows, then cards, then a centred column, then two small quote cards.

## 2. Color

### Primary palette

| Token | Value | Usage |
| --- | --- | --- |
| `color-bg` | `#FDFCF8` | Primary background — warm off-white/cream |
| `color-bg-alt` | `#FFFFFF` | Content cards, panels sitting on `color-bg` |
| `color-text` | `#0A0A0A` | Primary text, headlines, nav |
| `color-text-muted` | `#6B6B6B` | Secondary labels, meta/date rows |
| `color-accent` | `#E84436` | Single brand accent (vermilion) — highlights, badges, key CTAs |
| `color-accent-ink` | `#FFFFFF` | Text/icons placed on top of `color-accent` |
| `color-border` | `#E8E6DF` | Hairline dividers, card outlines |
| `color-card-neutral` | `#EFEBE2` | Neutral card fill (beige/tan) for non-accent floating cards |

### Secondary/illustration accents

Used only inside artwork, never as UI chrome.

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
| `text-nav` | Sans | 14px | 13px | 500, +4% tracking, uppercase | Nav links |
| `text-body` | Sans | 16–18px | 15–16px | 400 | Paragraph copy |
| `text-meta` | Sans | 12–13px | 12px | 500, +2% tracking, uppercase | Dates, tags, card labels, table rows |

### The asterisk (the site's one mark)

A six-arm asterisk, drawn as a single twelve-point polygon in `src/components/Spark.jsx`. It is the logo in the nav, the shape that collides with the portrait in About, the punctuation that closes the statement band, and the mark at the end of the services list. Always the same proportions, so it reads as a signature rather than as four different decorations.

**It is never set inside a sentence.** It used to drop into the hero headline as an inline chip between two words, and it could not survive there: `SplitReveal` renders every word as its own `inline-block` mask, and browsers break lines between adjacent inline-blocks whether or not whitespace separates them, so the mark orphaned onto the start of the next line every time. As standalone punctuation it always lands where it was put.

Two details that are load-bearing:

- **The points are comma-separated.** A `points` attribute is a coordinate-pair list, not path data. The `"50 14 L 56.5 38.7 …"` form is valid inside a `d` attribute and parses to *zero* points in `points`, which leaves an element in the DOM, correctly sized and correctly coloured, with no shape on it.
- **`strokeWidth` is set per use.** The polygon is on a 100-unit grid, so a stroke of 2 renders as `size / 50` CSS pixels — crisp on the 144px mark in About, an invisible hairline on the 24px one in the nav.

### Highlight pattern (Umi reference)

Apply `color-accent` as a highlighter-style background behind a phrase within display type — mimics a marker stroke. The utility carries `box-decoration-break: clone`, so a phrase that wraps keeps one continuous block per line rather than breaking into separate boxes. Emphasis is weight or the marker, never colour: a second highlight hue would be a second accent, and there is only one.


## 4. Spacing & Grid

- **Base unit:** 8px
- **Scale:** 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128
- **Container:** full-bleed (100vw) for hero/statement sections; 1140–1200px max-width, centered, for readable content and the "framed" page feel (Luna Rae wraps the whole site in a card on a colored backdrop — optional treatment for a landing/teaser page)
- **Nav height:** 64–80px, fixed top, flat single row (utility-sans style) or pill-button style. This site: flat single row, **fixed** at the top — one instance in the app shell, not one per page, so every route gets the same bar by construction.
- **Section padding (desktop):** 96–160px vertical
- **Section padding (mobile):** 48–64px vertical

### Hero composition — a curated scatter

The hero is an introduction with objects placed around it, the way someone arranges a desk. The objects do the work a stock hero photo would otherwise do: they say what the person is like before a word of the bio has been read.

The positions are **hand-picked percentages, not generated ones, and not a grid**. That distinction is the whole difference between a scatter and noise. Six objects at six arbitrary offsets, all the same size, all upright, evenly split left and right, read as a grid that gave up. What makes it read as *placed*:

1. **No shared baselines.** The six heights are 12 / 15 / 40 / 47 / 79 / 87, and the gaps between consecutive ones are as uneven as those numbers. Two objects at nearly the same height on opposite sides of the text read as a row of two no matter how far apart they are horizontally.
2. **Distance from the centre varies a lot.** Most objects hug the edges at 5–16% and 88–91%. One tucks in under the text instead of flanking it, and that single deviation is what stops the arrangement reading as two symmetrical columns of three.
3. **Three sizes**, one stroke weight, one drawing rule. Six identical objects at six irregular positions is still six identical objects.
4. **A few degrees of tilt on each drawing — never on the label.** ±6° reads as hand-placed at 130px and as a bug at 12px. The entrance rotates *into* the resting angle rather than out of zero, so the motion reads as an object being set down.
5. **One rule for the middle.** Nothing lands inside the introduction. From `lg` up the headline's measure is capped at `min(30ch, 62%)`, so the clear band down the middle is 19%–81% of the box at every width — which is what lets the percentages stay valid from 1024px up without a per-breakpoint recalculation. The cap is a line-count threshold rather than a preference: at or below 60% the headline wraps to four lines, 61% and up holds three, and 62% is the value that buys the shorter block while the nearest object still clears the text. Below `lg` there is no scatter, so the cap lifts and the headline gets its full measure; capping a 342px content box at 62% breaks it to nine lines.

Positions are percentages of a 1200px box, measured from its top-left, and are the *centres* of each object. The section is 80% of the viewport height, with a floor at which the introduction — a fixed ~293px, unlike the scatter, which scales — would otherwise be taller than the box it is scattered through. Below `lg` there is no room to scatter into, so the objects fall into one row of three under the introduction, chosen for silhouette rather than for position.

An earlier version put the objects in two columns of three on a 12×3 grid. That was tidier and worse: it read as arranged, but it read as arranged *on purpose*, and it spent the hero's only piece of personality on symmetry.

### Grid discipline vs. freedom

- Nav, footer, and content/data tables → strict 12-col grid, aligned
- Hero/statement moments → free-form absolute positioning allowed, anchored to a few consistent baseline points
- About → a single centred measure, and the only element allowed to break it is the asterisk (§3), which hangs off the left edge of the portrait


## 5. Components

### Nav bar — two variants

- **Flat utility** — logo/name left, links center-right, all uppercase `text-nav`, generous letter spacing (gowthamganesan.com style)
- **Pill/outline** — each nav item in its own `rounded-full` outlined button (1px `color-text` border, transparent fill, serif or sans label), evenly spaced, centered or right-aligned (Luna Rae style) — use for softer, more approachable pages like About or a coming-soon/teaser

**This site uses the flat variant, with the active link in the site's bracket mark.** The pills were built first and then dropped: three outlined pills beside a bare asterisk read as a row of buttons rather than as a way into the page, and once hover stopped inverting a fill the outline had no state left to express. So position in the page is carried by `[ … ]` around the active label — the same punctuation as the `[.ABOUT.]` heading in §6, in `color-ink-muted` brackets around a full-ink word. The brackets stay in the layout at full size and only their opacity changes, so a link becoming active moves nothing.

**The bar is fixed, not scrolling with the page.** That reverses the first-screen spec, and it reverses because of the bracket: a nav that scrolls away can only display its active state at the top of the page, so the feature was built and then was almost never seen. The trade is a bar crossing the accent service card and the dark footer, which is why the fill is a glass tint rather than a plain translucent wash: `bg-bg/80` over `backdrop-blur-xl`, saturate-boosted so the accent card does not grey out as it passes under. 80% is the lowest value that keeps the muted hover label above 3:1 against the near-black footer. This is the site's one glass surface, and it is the one exception to the flat rule. The single hairline under the bar is what tells the reader content is passing beneath something rather than the bar being a rendering fault.

### Buttons / CTAs

- Solid `color-accent` fill, `color-accent-ink` (white) text, full pill radius. Both button variants share one radius: a control is a pill or nothing, and a primary/secondary pair with different corner shapes reads as two different systems.
- **Outline variant:** 1px `color-text` border, transparent fill, full pill radius — for secondary actions (the footer's "Back to work"). Not for nav links, which are flat and mark their active state with brackets instead.
- **Hover:** darken fill 8%, no scale/shadow tricks

### Content surface

The card unit for anything sitting on the page background rather than inside a grid of other cards — currently the testimonial cards.

- **Radius:** 18px (`--radius-card`)
- **Fill:** `color-sand` — the same fill as the §5 service cards, so both sets of cards on the page are made of one material
- **Padding:** 20px
- **Flat, at rest and on hover.** No shadow and no border, on the same reasoning as the service cards: these are coloured shapes on the page, not surfaces floating above it, and they are not links, so a card that lifts and gains a shadow under the cursor has lied about what it does.

This replaces the "floating collage card" that used to be the core unit of a scattered-objects section. That section is gone; the radius and padding survived it because the testimonials were already using them. The shadow went with it: the testimonial cards were the last thing on the site with an elevation, so a drop shadow here made them read as a heavier, different object from the sand service cards a screen earlier. There are no shadow tokens in the system now — reintroducing an elevation means adding one deliberately rather than finding it already defined.

### Project/work grid (Luna Rae reference)

- Square or 4:5 cards, 16–20px radius, solid color or photo fill
- Label directly beneath each card (project name only, sans, `text-meta` weight) — no border, no card chrome around the label
- 2–3 columns desktop, 1–2 mobile, generous gutter (32–48px)

### Service cards (flat fill, staggered)

A row of cards for "What I do". Four things make it work:

- **Flat fill, and flat at rest.** A card here is a coloured shape, not a surface floating above the page. `color-card-neutral` and `color-accent` are the whole treatment. A border on top of the fill makes a ghost card; a shadow fights the stagger for attention. There is no shadow on hover either — these cards are not links, and a card that lifts and gains a shadow under the cursor has lied about what it does.
- **A high, a low, a high.** Three cards at 0 / 24 / 0 of extra space, so the row has a silhouette instead of a horizon. The middle card is also the accent one, so the emphasis lands twice over.
- **Content anchored to the bottom** (`margin-top: auto` on the text block), so titles sit on one line even when the bodies run to different lengths. Titles aligned across a row is what makes the set scannable.
- **A number, and nothing else, above it.** A small disc tinted with the card's own ink. It sits alone, not in a header row opposite anything: this pattern's reference card carries a diagonal arrow in the top corner, and on a card that opens nothing that arrow reads as a control. Affordances belong on things that do something.

One column until `lg`. At a two-column width three cards tile 2 + 1 and the third sits alone on its own row, which is a worse accident than three full-width cards.

The heading and its tags share a wrapping flex row, so the tags annotate the section rather than queueing under it as a subtitle nobody reads. There is no control in the header: an earlier version put a jump-down button in the top right, and it was pointing at a section the reader had not yet decided they wanted.

### Data/meta rows (work history, project list — utility pages)

- Plain table-like rows, thin `color-border` divider
- Columns: year / project / role — left-aligned, `text-meta` token

## 6. About — one centred column

About is a single centred measure running top to bottom: a bracketed heading, a paragraph, a portrait, another paragraph. Symmetry is the organising idea — every element shares the same optical centre.

- **Uppercase at a real size** — 17–24px, not 12px. Small uppercase reads as a legal notice; large uppercase reads as a poster. Keep the measure short enough that the caps stay legible and `text-balance` never opens a river in the rag.
- **One accent highlight per paragraph, one italic.** The reference this follows ran three different highlight colours in a row; one accent used twice is the version that fits a system with a single accent in it.
- **The portrait is in colour.** Every image on the site is in colour, including this one. It was black and white for as long as it was a placeholder, on the rule that the one picture of the person should be the one picture not in colour — a rule written for a small quiet photograph holding a column together, which is not what a real portrait is. Both hover frames carry no filter, so the swap reads as the same moment a second later rather than as the picture warming up.
- **The portrait has a second frame.** `about main.png` rests; `about on hover.png` cross-fades in over it on hover, both cropped 4/5. Same person, same wall, same crop, so the swap reads as the same moment a second later rather than as a different picture. It is two stacked images rather than a `src` swap so nothing decodes at hover time, the reveal is behind `@media (hover: hover)` so a finger's latched hover cannot stick it on, and the second image is `aria-hidden` because a screen reader has no hover and would read the caption twice.
- **The heading is `[.ABOUT.]`**, brackets in `color-text-muted`, word at full ink. The runs are written without whitespace between them: `SplitReveal` emits a literal space for any trailing space inside a run, and `[. About.]` with a gap in the middle is not the mark.

This section was a "random-things" collage with a headline held in columns 1–6, and then for a while it was that collage *plus* this column, and then the collage became a second section below it. Both are gone now. A centred editorial column and a scattered card grid are not the same composition, and once they are forced to share a section neither one can be itself — but neither did the page need both. One centred column, followed by the testimonials, does the whole job.

## 7. Imagery & Iconography

- **Hero objects:** six photographs, positioned as a scatter around a centred introduction. One of them is a star-shaped cut-out of the designer and is the largest object in the set, in the top-left corner — the first thing the eye reaches after the headline's first line. The one picture of the person is the one given the most weight, not the least. The scatter is measured, not eyeballed: nothing inside the headline's clear band, no two objects within 10 points of the same height, and no overlap at the tightest viewport the layout reaches (1280×600, where the composition box is 389px). Growing an object invalidates the `y` it was placed at, because the coordinates are percentages of the box and say nothing about the space the object needs.
- **Case-study/work imagery:** clean product shots or UI screens. The scattered-objects collage is gone, so there is no longer a second place where artwork and photography mix.
- **Icons:** simple line-weight consistent with the sans typeface's stroke weight


## 8. Motion

- **The hero is the only above-the-fold block, so it is the only one that plays an entrance on arrival.** Everything else waits to be scrolled to. Inside the hero the parts are staggered to set reading order: headline, role, action, availability, then the objects beside them, which land *after* the words so the composition assembles itself rather than appearing finished.
- Objects settle rather than slide — they scale up a little and rotate into their own resting angle, which is the gesture that reads as an object being placed. The entrance owns `transform`, so anything that needs to offset an object uses padding or a parent translate, never a translate on the animated element itself.
- Scroll-triggered entrance for the work cards and the service cards, staggered by ~60–90ms
- Nav/buttons: instant or near-instant, no elaborate easing
- **Nothing on the page lifts on hover unless it does something.** The service cards and the testimonial cards are not links, so neither has a hover shadow. Hover is reserved for real controls, where it means "this is pressable."
- Respect `prefers-reduced-motion` — every entrance above collapses to nothing, and `SplitReveal` skips its listener entirely

## 9. Accessibility Notes

- `color-text` on `color-bg` = high contrast (safe)
- `color-accent` (#E84436) is a mid-tone: white on it is 3.95:1 and near-black on it is 5.01:1. `color-accent-ink` is white, which clears the 3:1 large-text floor and is the intended look, but it is below AA for body-size text. So white is restricted to the display-size moments — the service card title, the footer highlight marker, large button labels — and small text on the accent must not be dimmed further with `opacity`, which drops it back under 3:1. If AA body text on the accent is ever required, the accent itself has to darken (around #B8341C) rather than the text lightening.
- Highlighter-style text treatment must still meet contrast on the underlying accent block
- Secondary text on a coloured card steps down with opacity of the card's own foreground, never grey. `color-text-muted` is tuned for the page background and drops below 4.5:1 on a sand fill.
- Hero objects are `aria-hidden` and duplicated across the wide and narrow layouts; they are decoration and carry no information
- The About portrait's second frame is `aria-hidden`. A screen reader has no hover, so an `alt` on it would read the same caption as the first portrait twice.
- An empty photo slot is deliberately *not* `aria-hidden`: while it is a slot rather than a picture, its label is the only description of that content on the page


## 10. Implementation Notes

- **Tokens live in `src/index.css` under `@theme`.** Class lookups are written as literal strings in the component rather than interpolated from the data, because Tailwind only emits classes it can find as literal source.
- **Random values in a `clamp()` need spaces around `+`.** Write them as underscores — `text-[clamp(1rem,_0.5rem_+_2vw,_2rem)]`. Without them the whole declaration is silently dropped and the heading inherits its size from the parent.
- Keep the hero composition as an isolated component so its absolute positioning does not leak into grid-based sections elsewhere on the site.

