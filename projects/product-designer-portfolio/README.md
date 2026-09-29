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

- **§2 One accent, used loudly.** Vermilion `#E84436` is the only brand colour. Terracotta, navy
  and sky are illustration accents and stay inside artwork. UI chrome never uses them.
- **§2 Accent contrast.** `#E84436` is a mid-tone: white on it is 3.95:1, near-black 5.01:1.
  `color-accent-ink` is white, which clears the 3:1 large-text floor. It is not AA for body-size
  text, so nothing small sits on the accent, and nothing on it is dimmed with `opacity` — the
  service card keeps its body at full opacity for exactly this reason.
- **§3 Display + text pairing.** Space Grotesk for headings and display type, Geist for everything
  functional. Both are self-hosted from `public/fonts` as variable fonts, so one file each covers
  the 400–700 range the site uses. Tokens: `--font-display` and `--font-sans`. There is no
  `--font-serif`; `design.md` §3 asked for a serif + sans pairing and that was a deliberate
  departure, recorded below.
- **No italics in display type.** Space Grotesk ships **no italic cut**, and the browser would
  otherwise synthesise a slanted oblique that looks broken next to upright text. So emphasis inside
  a display heading is carried by the accent highlight or by weight `600` against a `400` body,
  which the variable font supports natively. The `em` flag in `profile.headline` is unchanged; only
  the rendering changed, so restoring real italics is a one-line change in `HeroHeadline.jsx`. Geist
  *does* have a real italic, so the About section's emphasised phrase and the testimonial
  blockquotes keep theirs.
- **§3 The asterisk.** One six-arm polygon in `src/components/Spark.jsx`, used four times: the nav
  logo, the shape that collides with the About portrait, the punctuation closing the statement band,
  and the mark at the end of the services list. Never set inside a sentence — `SplitReveal` renders
  every word as its own `inline-block` mask and browsers break lines between adjacent inline-blocks,
  so an inline asterisk orphans onto the next line every time.
- **§8 Scroll-scrubbed word reveal.** Display headings reveal word by word, driven by scroll
  position rather than a one-shot trigger. `src/components/SplitReveal.jsx` is the component; see
  its own comment block and the "Word-by-word reveal" section below.
- **§3 Highlight pattern.** An emphasised phrase gets an accent marker-pen background. It is the
  only emphasis device in display type: a second highlight hue would be a second accent, and there
  is only one.
- **§4 Hero composition.** The first screen is a 1200px box holding the introduction and six
  objects placed around it at hand-picked percentages — deliberately not a grid, because two tidy
  columns of three read as arranged *on purpose*, and the hero's whole job is personality. See
  "The six objects" below.
- **§4 Container.** 1200px max width, full-bleed hero. The statement band that used to be the
  other full-bleed section has been removed, so the accent is no longer full-bleed anywhere: it
  appears on the middle service card, the buttons, the `02` disc tint and the availability dot.
- **§5 Nav** is the flat utility variant: mark left, three plain text links right, no border, with
  the active link wearing the site's `[ … ]` bracket mark.
- **§5 Buttons.** Solid accent for primary, outlined for secondary. Both are pills — one radius for
  every control, so the two actions that sit side by side in the footer share a shape. Hover
  darkens, no scale or shadow tricks.
- **§5 Service cards.** Flat fills, and flat at rest — no shadow on hover, because they are not
  links. Three cards staggered high-low-high with the accent card in the middle, content
  bottom-anchored, and a number disc above the title with nothing opposite it.
- **§5 Project grid.** 4:5 cards, 18px radius, solid colour fill, label beneath in `text-meta`
  with no card chrome.
- **§5 Data/meta rows.** Experience and case-study meta are plain rows with a hairline divider.
- **§6 About is one centred column.** Bracketed heading, uppercase copy, colour portrait
  with the asterisk hanging off its left edge. The portrait has a second frame that cross-fades in
  on hover. It was a "random-things" collage with a headline held in columns 1–6, then that collage
  plus this column, then two separate sections. All three failed the same way — a scattered card grid
  and a centred editorial column are not the same composition, and neither needed to exist twice.
  The scattered grid is gone.
- **§7 Hero objects.** Six line drawings in `src/components/Doodle.jsx` on a 100×100 grid: one
  stroke weight, one cap style, nothing filled, `currentColor`. Each `heroVibes` entry also accepts
  an `image` path, which swaps the drawing for a real picture one object at a time.
- **§8 Motion.** The hero is the only above-the-fold block that plays a full entrance on arrival;
  everything below it waits to be scrolled to. The two exceptions are the first project cards, which
  straddle the fold: `Reveal` reveals anything already intersecting the viewport at mount, so they
  animate in on arrival rather than waiting ~114px of scroll. `prefers-reduced-motion` collapses
  every entrance to nothing.
- **§9 Accessibility.** Dark text on every accent block; secondary text on a coloured card steps
  down with opacity of the card's own foreground, never grey. Nothing on the page lifts on hover
  unless it does something.

### Known divergences from `design.md`

The first-screen spec asked for things `design.md` does not describe, or describes differently.
These are deliberate:

- **No serif.** §3 specified a warm serif for editorial headlines, used in both roman and italic.
  The site pairs Space Grotesk with Geist and has dropped the serif entirely, which also means §3's
  serif+italic headline pattern cannot be honoured as written (see the no-italics note above). §3
  named Fraunces and Inter only as examples, so the substitution is within the spirit of the
  section, but the italic treatment is a real loss.
- **The first screen is full-bleed.** A showcase frame (gradient + white canvas) was built first
  and later removed, so the hero and projects grid run the full width of the page on the plain
  design system background. No shadow, no rounded canvas, no off-palette gradient.
- **The nav is sticky, reversing an earlier decision.** §4 says fixed top; the first-screen spec
  said it scrolls with the page, and it used to. It is now fixed, because a nav that scrolls away
  can only ever show its active state at the top of the page — the bracket feature was built and
  then was almost never visible. It has no wordmark. See the Nav entry above for the single-instance
  rule and the `--nav-h` token.
- **Project card labels are plain text**, not the §5 uppercase `text-meta` treatment, and cards
  carry no shadow. The §5 label rule still applies to the meta rows.
- **`display: contents` is not used here any more.** The hero's object layer is a plain absolutely
  positioned list, because the objects are placed individually rather than flowed. The list is
  `pointer-events-none` and `aria-hidden`: it holds no controls, and a label that looks tappable but
  is not should not take a click.

If any of these should be reverted, `design.md` is the place to record it.

### The first screen (hero)

The first screen is full-bleed: the fixed nav bar, a hero, and the projects grid all run the full
width of the page, edge to edge, on the plain design system background. There is no canvas wrapper.

- **Layout.** `NavRow` is a 72px row with page padding (`px-4 sm:px-14 lg:px-16`), inside the fixed
  `nav-bar` header in `App.jsx`; the hero follows a `nav-offset` spacer of the same height. The hero is a
  `min-h-[max(80dvh,34rem)]` flex column holding a 1200px composition box. **80% of the screen**, so
  the headline and the scatter get the room they were composed for.
  `dvh` rather than `vh` so mobile browser chrome does not push the hero past the visible area.
  The grid section carries the same horizontal padding, with the grid itself capped at
  `max-w-[1200px]` so cards stay readable on very wide displays.

  The `34rem` floor exists because the two halves of the hero do not scale together. The
  introduction is a **fixed** height — a three-line headline, a role line and a button is 293px
  and it does not shrink with the viewport — while the scatter is positioned in percentages of a box
  that does. With a bare `dvh`, measured: at 1440×760 the composition box is 377px and at
  1280×600 it is 276px, so below roughly 700px tall the text is taller than the area it is scattered
  through and the objects land on the words. The floor binds below about a 680px-tall window;
  on any ordinary laptop the section is exactly 80% of the viewport.

  Note the section spends 154px of that on padding, the gap above the availability line and the line
  itself, so 80% of the viewport is about 79% of it in the box the objects are placed in. Verified
  free of collisions at 2560×1400, 1920×1080, 1512×982, 1440×900/800/700, 1280×800, 1024×700 — the
  tightest horizontal clearance to the nearest object is 52px at 1024×700.

  **80% is a deliberate trade against the work grid.** It was 60dvh, set so two project cards cleared
  the fold; at 80% only 68px of the first card reaches the first screen at 1440×900 and the second is
  entirely below it. `Reveal` still animates in whatever is already intersecting on mount, so the
  first card is not left stranded at `opacity: 0`, but the arrival state is a band of one card
  rather than a preview of two. 60dvh is the value to go back to if two readable cards below the
  hero matter more than the hero filling the screen.
- **The six hero objects react to the pointer anywhere on the page**, not only when the cursor is
  over the hero. `src/hooks/useHeroDrift.js` is the hook; each object pushes directly away from the
  cursor with a Lorentzian falloff, `1 / (1 + (d/scale)²)`, plus a `FLOOR` of 0.42 that every object
  keeps at any distance.

  Both halves of that had to change together. The listener used to be `pointermove` on the hero
  element, so the objects were inert whenever the cursor was elsewhere on the page; and each object
  used to stop dead past its own `reach`, a hard cutoff, so anything but the two objects nearest the
  cursor sat at exactly zero. Widening the listener alone would have changed almost nothing. The
  `reach` field is now `scale` and describes a falloff width rather than a boundary, which is why the
  rename is not cosmetic.

  Measured travel, `hypot` of the applied transform: 8.6px peak with the cursor on an object, 3.5–7.2px
  over the hero, and a 2.7–5.4px far field that never reaches zero. The floor is set by that last
  number rather than by taste — at 0.26 the far field settled to 1.65–3.3px, which is below where
  motion reads as motion, so the effect was technically global and practically invisible.

  The hook stores the section's position in **page** coordinates, not viewport coordinates. The
  pointer arrives as `clientX/clientY`, so subtracting a viewport-relative `box.left` captured at
  mount gives the wrong answer as soon as the page scrolls — the objects react as though the hero
  were still where it was on arrival. Adding live `scrollX`/`scrollY` to the pointer keeps both sides
  in one frame without re-measuring on scroll.

  One honest weakness: with the cursor far from the hero, all six pushes point broadly the same way,
  so the arrangement drifts as a loose group. Per-object `scale` and `gain` keep them from moving in
  lockstep, but the far-field read is closer to the old whole-page parallax than the near-field read
  is. That is the cost of responding across the whole page, and it is the right trade for an effect
  that was otherwise inert for most of the read.
- **Nav.** The §5 flat utility variant: a bare asterisk mark on the left (no wordmark, the link's
  accessible name carries it) and three plain text links on the right, 16px/24px gap, no fill, no
  border, no radius. Hover steps the label to `color-ink-muted`. The links themselves come from the
  `nav` export.

  **The bar is fixed, and there is exactly one of it.** `App.jsx` renders `<header class="nav-bar">`
  with the `NavRow` inside it, above the routed page. It used to be the opposite: each page rendered
  its own row inside its own container, which is what allowed a case study and the home page to
  disagree about it. A fixed element is positioned against the viewport, so per-page instances would
  also have stacked on top of each other. One instance in the layout makes "looks the same
  everywhere" true by construction rather than by three copies agreeing.

  Three things have to agree on its height, so the height is one token, `--nav-h` (4.5rem = 72px,
  the §4 64–80px band):

  - the bar's own height, and the `nav-offset` utility each page's first element applies so its
    content is not hidden underneath — a fixed element is out of flow and reserves nothing itself;
  - `scroll-padding-top` on `html`, set to `--nav-h` plus 1rem, so a hash jump lands a heading clear
    of the bar rather than behind it. This replaced the per-section `scroll-mt-8`, which existed to
    clear a nav that scrolled away and would now stack with the padding and over-offset.
  - `nav-offset` must be the *only* `padding-top` on the element it lands on. Two padding-top
    utilities on one element collide rather than sum: whichever the stylesheet emits last wins
    outright. That bug put the case study's "All work" link under the bar, so `nav-offset` carries
    the page's own reading padding in the same declaration instead of leaving it to a `pt-8` beside
    it.

  The fill is glass: `bg-bg/80` with `backdrop-blur-xl` and `backdrop-saturate-150`, with an
  `@supports not (backdrop-filter)` fallback to an opaque `bg-bg`. This reverses the site's flat
  rule — the bar was opaque, the one documented exception being that the bar crosses the accent
  service card and the dark footer. 80% is the floor, not a preference: the nav labels are
  near-black, and below 80% the muted hover label falls under 3:1 against the dark footer. The
  saturation boost is needed because blur alone greys the accent card passing underneath. The 1px
  `border-b` hairline is not decoration but the signal that content is passing beneath something;
  without it a headline slides halfway out of sight before clearing, which reads as a rendering
  fault. `nav-item`'s focus ring offsets against `bg` rather than `surface`, so the ring does not
  put a white outline inside the bar.

  Note the cost: `backdrop-filter` on a fixed bar re-evaluates on every scroll frame. It is fine
  on the home page and worth watching on the case studies, which are longer.

  The links used to be outlined pills. The border went because three bordered pills next to a bare
  asterisk read as a row of buttons rather than as a way into the page, and once the hover state
  stopped inverting a fill there was nothing left for the outline to do.

  **The active link wears the site's bracket mark.** `[Projects]` rather than a filled or outlined
  pill, in `color-ink-muted` brackets around a full-ink label — the same punctuation as the
  `[.ABOUT.]` heading, so where you are in the page is stated in the same characters as the section
  you are in. The brackets are always in the layout at full size and only their opacity changes, so
  activating a link shifts nothing; they are `aria-hidden` and the link carries `aria-current`.
  Active state comes from `useActiveSection` (`src/hooks/`), which measures scroll against a line at
  35% of the viewport rather than using an IntersectionObserver: the question is which section the
  reader has passed the top of, and `work` is a short grid while `contact` is a tall dark footer, so
  a threshold marks the right one either way. Two edge cases are handled explicitly — at scroll 0 the
  first target is active (the hero sits above `#work`, and an unmarked row would be a dead nav), and
  at the document end the last target is (nothing follows the footer to push it up the viewport).
  Because the footer is rendered on every route, `#contact` exists on a case study too, so the hook
  only marks anything when the page carries all of the nav's targets.
- **Headline.** One paragraph read as an inline flow, `clamp(1.75rem, 3.05vw, 2.75rem)` (44px at
  1440), line-height 1.05, tracking `-0.04em`, `text-transform: uppercase`, centred at a 30ch
  measure. `profile.headline` is an array of `{ text, em? }` parts, so emphasised spans interleave
  in the sentence. The line count is emergent, not hardcoded — three lines at desktop, five on a
  phone. The desktop cap is a threshold rather than a preference: measured at 1440px, any cap at
  or below 60% wraps to four lines and 61% or more holds three, so 62% sits just inside the
  window. The breaks are identical from 768 to 2560, and the nearest object clears the text
  horizontally at every width from 1024 up.

  The measure is in `ch`, not `px`, because the headline is no longer a full-bleed line across the
  page: it is the centre of a three-part composition, and the only stable way to size it is against
  the type. `HeroHeadline` takes a `className` so the hero sets it; the component no longer carries
  a width of its own.

  Three details that only exist because of the caps:
  - `uppercase` is a class on the `h1`, not baked into the strings in `data.js`. The About section
    renders the same `profile.headline` array and keeps its sentence case.
  - Caps are much wider and taller than lowercase in Space Grotesk, so the measure and size are
    load-bearing together. `text-balance` then evens out the rag.
  - `em` maps to weight **600**, not 500. Caps carry less stroke contrast than lowercase, so a
    400/500 pair is nearly invisible at this size.
- **The asterisk is not in the headline.** `profile.headline` used to carry a `{ chip: 'icon' }` part,
  an inline asterisk dropped into the word slot after "useful interfaces". It is gone, and the
  reason is in `Spark.jsx`: `SplitReveal` renders every word as its own `inline-block` mask, and
  browsers break lines between adjacent inline-blocks whether or not whitespace separates them, so
  the mark orphaned onto the start of the next line and read as a stray glyph. Binding it to the
  preceding word would mean changing how `SplitReveal` groups units, which is not worth it for one
  decorative mark. `HeadlineChip.jsx` went with it.
- **The six objects** come from the `heroVibes` export in `data.js`. Each entry is
  `{ doodle, label, x, y, size, tilt }`, where `x` and `y` are percentages of the 1200px
  composition box and are the *centres* of the object. Move them by editing those two numbers —
  from `lg` up the headline's measure is capped at `min(30ch, 62%)`, so the clear band down the
  middle is the same 19%–81% at every width and the percentages stay valid. Below `lg` the cap
  lifts, because there is no scatter to keep clear and a 62% cap on a phone is nine lines of
  headline.

  Three things the positions have to avoid, all of which are one number's fault if you break them:
  landing inside the headline, landing off the edge, and landing at nearly the same height as
  another object on the opposite side. That last one is the non-obvious one — a camera at 45% and a
  bicycle at 47% read as a row of two across the text no matter how far apart they are horizontally.
  Sort the `y` values and check the gaps between consecutive ones are uneven.

  A fourth thing, found the hard way: **growing an object moves its neighbours' problem, not just its
  own.** The star was 80px at `y: 90.2` and is now 138px at `y: 7.5` — at `lg` it is 104px wide and
  about 138px tall including its label, and at the old `y: 11.3` its bottom sat 123px below the
  camera's top in the 389px box at 1280×600, an 8px overlap. Coordinates are percentages, so they
  describe a position and say nothing about the space an object needs; the `y` that works for a
  sticker does not work for a photograph. Measure the tightest box the layout reaches, which is
  1280×600, rather than trusting a percentage.

  The tilt is on the drawing and never on the label. `hero-pop` rotates *into* `--hero-rest-rotate`,
  so each object arrives at its own angle rather than all snapping upright. Labels get a plain fade
  (`hero-enter`) because ±6° reads as hand-placed at 130px and as a bug at 12px.

  Give an entry an `image` path instead of a `doodle` and it renders as a real picture, which is how
  you replace these with your own things one at a time. Both layouts are `aria-hidden` — the labels
  are decoration, not content.
- **Projects grid.** An intentionally uneven 12-column composition, not a uniform 2×2. Each project
  in `data.js` carries three placement keys, and `WorkGrid.jsx` maps them to classes:

  | key | values | effect |
  | --- | --- | --- |
  | `size` | `wide` (7 cols), `narrow` (5 cols), `full` (12 cols) | 7+5 and 5+7 fill rows exactly; `full` is for a lone closing card |
  | `ratio` | `wide` (16/10), `landscape` (4/3), `square`, `portrait` (3/4), `band` (21/9) | the crop, and the main reason the grid does not read as a table of squares |
  | `drop` | `sm`/`md`/`lg`/`xl` (10/16/24/32 units top margin) | staggers a card against its neighbour |

  Current arrangement: ARASTELLE `wide`/`landscape`/no drop, Groshi `narrow`/`square`/`lg`, NOXS
  `wide`/`landscape`/`md`. Three cards tile 7+5 then 5+7 — the count that closes exactly, so no
  card is left over. Each row has one card hanging lower than the other, and the rows stagger in
  opposite directions.

  `size: 'full'` and `ratio: 'band'` are defined in `WorkGrid.jsx` but currently unused. They exist
  for an odd count, where cards pair 7+5, 5+7 and the last one needs all 12 columns rather than
  leaving a five-column hole. `band` (21/9) is the ratio to pair with it: `wide` (16/10) at 12
  columns is 750px tall on a 1200px grid, taller than the first screen itself.

  Note the grid is a hardcoded 7/5/12 composition, not a layout that adapts to however many
  projects exist. Going from three to four means re-checking `size` and `ratio` on the existing
  three so the rows still pair.

  `drop` and `size` only apply from `lg` up. Below that the grid is a single full-width column in
  array order, which is the only sane reading order on a phone, and the varied `ratio`s still carry
  through. Column gap is 40–64px, row gap 64–96px, growing with the viewport so the grid breathes.

  Cards are flat with a 22px radius and no border or shadow: `kind: 'brand'` is a solid fill with a
  centred white lockup, `kind: 'photo'` is a full-bleed `object-cover` image. The label is plain
  16px sans text 16px beneath the card, not a bordered box.

### Work-card hover

Three layers, three elements, because they animate at three rates and one element has one
`transform`:

| Layer | Element | Property | Timing |
| --- | --- | --- | --- |
| Magnetic lean | `.work-card` (the `<article>`) | `translate3d` toward the cursor, 8px max | 420ms |
| Media scale | `.work-card-media` | `scale(1.12)` inside the card's overflow | 700ms |
| Media blur | `img.work-card-media` | `blur(12px)` | 420ms |
| Reveal | `.work-card-veil` | `opacity` 0 → 1 | 320ms |

The lean is `useCardDrift.js`. It listens on the card, not the window, so `getBoundingClientRect`
runs at most once per move and only while the pointer is genuinely over the card. Both axes divide
by width so a 16/10 card leans toward the cursor rather than crawling along it. It repaints on
scroll and resize from the cached pointer position, because a rect captured at `pointerenter` goes
stale the moment the page scrolls under a stationary cursor.

Three details that are load-bearing:

- **`:focus-visible` matches the link, not the article.** The `<article>` never receives focus, so
  `.work-card:focus-visible` matches nothing and a keyboard user gets an outline around a visually
  unchanged card. The rule is `.work-card a:focus-visible .work-card-media`.
- **The reduced-motion reset has to name the hovered selectors.** A media query adds no
  specificity, so `.work-card-media { transform: none }` (one class) loses to
  `.work-card:hover .work-card-media` (three) and the picture still grows under
  `prefers-reduced-motion: reduce`.
- **Touch gets the outcome line in a different place.** A finger produces no `:hover`, so the veil
  would never appear and that sentence would exist only for mouse users. On `@media not (hover:
  hover)` the line moves out from under the picture into `.work-card-fallback`, below the title.
  Both copies are in one file; exactly one is ever displayed.

The blur is `12px`, still well under the 60px this effect is usually copied at. 60px does not read as
"the card softened", it reads as "the card broke": a screenshot becomes an undifferentiated grey field,
so the hover stops showing the work and starts hiding it. At 12px the image is unmistakably gone and
the card is still recognisably its own colours.

Three constraints the blur forces, all noted in `index.css`:

- **`img` only.** A brand card's fill is flat, so blurring it does nothing, and its lockup is text —
  blurring that would soften a wordmark for no gain. Selecting `img.work-card-media` catches real
  photographs and nothing else, without `ProjectCard` knowing which kind of card it rendered.
- **`scale(1.12)` is arithmetic, not decoration.** A CSS blur of radius R fades the outermost ~1.5R
  pixels of the element toward transparent, sampling from outside its own box; at R=12 that is roughly
  18px of fringe per edge. On a 460px card, 1.12 puts that fringe outside the visible frame. The old
  5px/1.04 pair covered 7px of blur with 9px of scale — it is the ratio between the two numbers that
  has to hold, so raising one without the other brings back a soft halo against the page.
- **The blur survives reduced motion; the timing does not.** It is a change of focus, not movement —
  nothing travels and nothing has a direction. Dropping it would leave a card lifting a veil over its
  own image with nothing softened behind it, which is the state that looks broken. The
  `transition: none` under reduced motion makes it an instant swap, so there is no animation spared.

The veil is a flat 65% wash, not a gradient. Two consequences worth knowing about:

- **65% is set by the lightest screenshot, not by taste.** A flat wash is only as strong as its worst
  backing, and the worst case here is a white dashboard: 55% ink over `#fff` leaves the outcome line at
  4.4:1 and the CTA at 3.25:1, both failures. At 65% with a full-white CTA both clear 6.31:1. The
  gradient had been silently carrying this. Measured across every brand fill too — navy 18.8:1, accent
  13:1, terracotta 11.8:1, sky 7.6:1.
- **The wash covers the whole card**, which the gradient's own height used to take care of by fading
  out. A content-height wash leaves a hard horizontal edge that reads as a seam in the image.

The brand-card lockup is a sibling of the veil, not a child of the media, and it has to stay there. The
flat wash covers the middle of the card where the lockup sits, which takes white on the navy fill down
to about 2:1 — the wordmark all but vanished. Putting it back inside `.work-card-media` and raising
its `z-index` does not fix it either: the media is transformed on hover, and a transform creates a
stacking context, so the lockup is pinned below the veil however high its `z-index` goes.

The outcome line inside the veil is `aria-hidden`. It sits inside the link, and leaving it
announced would make every card in the grid read as a paragraph rather than a link.

`CaseStudy.jsx` uses `ProjectCard` for its "More work" grid rather than a second copy. The two were
near-identical and had drifted: the inline version had its own weaker hover (a 2px lift), so the
same project behaved differently depending on which page you reached it from. Only the ratio
differs, and that is a prop.

### Word-by-word reveal

`src/components/SplitReveal.jsx` wraps display headings and reveals them a word at a time, scrubbed
by scroll position rather than fired once as a trigger. It is used on the hero headline, the
services `h2`, the About heading, both statement-band lines, and the footer `h2`.

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

### Home page section order

`src/pages/Home.jsx` composes the page in this order, and the reason for the order is that
everything after the work grid is slower to read than everything before it, and the page gets
quieter as it goes: full-bleed type, then cards, then a centred column, then scattered objects,
then plain rows.

| # | Section | Component | Notes |
| - | ------- | --------- | ----- |
| 1 | Nav | `NavRow` in `header.nav-bar` | fixed at top, one instance in `App.jsx`, height `--nav-h` |
| 2 | Hero | `HeroVibes` | 1200px scatter, the only section that plays an entrance on arrival |
| 3 | Work | `WorkGrid` | full-bleed, capped at 1200px |
| 4 | Statement | `StatementBand` | accent field, the line bleeds off the right edge |
| 5 | Experience | inline in `Home` | full width, `#experience` anchor target |
| 6 | Services | `Services` | flat cards, high-low-high stagger |
| 7 | About | `AboutEditorial` | one centred column, `#about` anchor target; the portrait is `AboutPortrait` |
| 8 | Words from | inline in `Home` | two flat sand cards on one row, matching the §5 service cards, `#references` |
| 9 | Footer | `SiteFooter` | |

Experience sits between the statement and the services deliberately: the statement is a claim, the
experience is the evidence for it, and the services are what the reader does with that. It was the
last section on the page, which asked someone to read the pitch before seeing a single employer or
date. It also gets the full container now — the rows are a three-column data table and it used to
share a row with the testimonials at seven of twelve columns, squeezing the only column worth
reading.

The testimonials moved the other way, to just after About. The quotes are about the person, so they
belong next to the section that introduces the person.

About went through three shapes: a "random-things" collage with a headline held in columns 1–6, then
that collage plus a centred editorial column below it, then just the column. The scattered grid is
gone. The bio copy never appeared twice — `profile.bio` became the About section's opening and
closing paragraphs, and the old "A bit about the work" column that repeated it was removed.

The statement band *is* wrapped in `SplitReveal` now, once per line. The two lines are separate
`as="span"` blocks, each `block`-level and `whitespace-nowrap`, so each keeps its own masks and its
own mask-rect while the second line is still free to overflow the container and be cropped by the
section's `overflow-hidden`. What does not work is one wrapper around both lines: the `<p>` would
have a single rect, and a word travelling up out of its own line box would be clipped by the mask
belonging to the line it started on.

### Where the tokens live

`src/index.css` holds every design token in a Tailwind v4 `@theme` block: the `color-*`, `font-*`
and `text-*` scales from `design.md`, plus the card radius and the fixed-nav height. There are no
shadow tokens: the testimonial cards were the last thing on the site with an elevation, and they are
flat now like the service cards. The `@utility` rules below
it are the reusable pieces: `container-page`, `pad-section`, `nav-link`, `nav-item`, `label-meta`,
`highlight`, `btn-accent`, `btn-outline`, `card-surface`.

Two things that are easy to get wrong in there:

- **A random value in a `clamp()` needs spaces around `+`.** Tailwind spells a space as an
  underscore, so it is written `text-[clamp(1rem,_0.5rem_+_2vw,_2rem)]`. Without them the whole
  declaration is silently dropped and the element inherits its size from the parent — there is no
  error, the heading is just quietly the wrong size.
- **`::selection` is themed to the accent.** The default is a saturated system blue that belongs to
  nothing on the page, and selection is the one surface the visitor triggers by accident.

Adding a token means editing `@theme` in `src/index.css` and recording it in `design.md`.

## Editing content

All copy lives in `src/data.js` — name, bio, links, services, experience, testimonials, the
`heroVibes` array, and the `projects` array. Replacing the placeholders
normally means editing that one file.

Two of those exports are structured rather than plain strings, because the sections that render them
need more than text:

- **`profile.bio`** is two arrays of segments, one per paragraph. A segment is `{ text }`, or
  `{ text, em: true }` for the accent marker, or `{ text, italic: true }` for a real slanted cut.
  The About section is the only consumer.
- **`profile.portrait`** is `/about/main.jpg` and **`profile.portraitHover`** is `/about/hover.jpg` —
  the resting portrait and a second frame that cross-fades in over it on hover. Both are the same
  1440×1508 source converted to JPEG at a 1200px long edge, quality 82, so ~200KB and ~236KB instead
  of the 1.9MB and 2.2MB PNGs in `my images/`. Setting either back to `null` drops that half of the
  behaviour. The pair renders through `src/components/AboutPortrait.jsx`, not `PhotoSlot` — see
  "The About portrait hover" below.

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
- `intro` and `sections` — the long-form body. `sections` is an array of `{ heading, body }`.
  `body` is a **block array**: either a bare string for a paragraph, or a tagged object. See
  "Case study body blocks" below. Order is whatever reads best; nothing is hardcoded.
- `pullquote` / `pullquoteBy` — optional. Set both to `null` to hide the block.
- `cover` / `coverAlt` / `coverLabel`, `image` / `imageAlt` / `imageLabel` — asset paths plus
  alt text. Each has a sensible default derived from the title, so only set them when the
  default would be wrong or vague.

### Case study body blocks

`sections[].body` used to be an array of paragraph strings, and three of the four projects
still are. So **a bare string is still a paragraph**, and everything richer is a tagged object
rendered by `src/components/CaseStudyBody.jsx`:

| Block                              | Renders as                                                    |
| ---------------------------------- | ------------------------------------------------------------- |
| `'Plain paragraph.'`               | `<p>`                                                          |
| `{ p: 'Paragraph.' }`              | `<p>`, same thing, tagged                                       |
| `{ list: ['one', 'two'] }`         | `<ul>` with a small accent tick per item                       |
| `{ table: { head, rows } }`        | `<table>`, ink rule under the head, hairline rows, first column is a `<th scope="row">`. Add `rowHeader: false` to opt out |
| `{ sub: { number, heading, body } }` | `<h3>` with the number in a small accent chip, plus its own nested block array |
| `{ note: 'A principle.' }`         | a callout with an accent left rule and medium weight            |
| `{ image: { src, alt, label, ratio, caption } }` | a `PhotoSlot`, labelled until `src` is set         |

`sub` takes the same grammar in its own `body`, which is why `CaseStudyBody.jsx` is recursive
rather than a flat switch. `image` blocks are how the case study carries per-section
screenshots: drop a file in `public/` and set `src`, and the placeholder becomes the real image
in the same reserved box. `ratio` defaults to `aspect-16/9`.

`note` is the one to reach for sparingly — it is accent-ruled and medium weight, so two of them
in a row will read as shouting.

## Routes

| Route          | Page                                               |
| -------------- | -------------------------------------------------- |
| `/`            | Nav, hero, work grid, statement band, experience, services, About, references, footer |
| `/work/:slug`  | Case study for that project                        |
| anything else  | 404 page                                           |

The nav is rendered by each page rather than a global header, so the home page can place it at the
top of its first screen. Case studies and the 404 page carry the same row above a hairline.

An unknown `/work/:slug` redirects to `/#work` rather than showing a dead end. The
`netlify.toml` SPA redirect is what makes these deep links work on refresh in production.

The "More work" block at the foot of a case study scales with the project count, because a fixed
version of it duplicates its own links:

- **Two projects or fewer** — the block hides entirely. It would consist of the single other
  project three times over (the card, `prev` and `next` all resolve to it).
- **Three projects** — the block renders the two cards, but `prev`/`next` are suppressed: they
  would name the same two destinations again directly above them.
- **Four or more** — cards and `prev`/`next` both render, since prev/next can then reach projects
  the two cards do not show.

The nav's links are `/#section` hash links. `useHashScroll` (in `App.jsx`) scrolls to them after
the route changes, including when navigating in from a case study.

## Project images

Brand cards render a white logotype and photo cards render a placeholder swatch until real assets
exist. To add them, drop files in `public/` (e.g. `public/work/groshi.png`) and set `image` on the
project. The same applies to any hero object you want as a picture rather than a drawing (set
`image` on the entry instead of a `doodle` name).

### The About portrait

`public/about/` holds two frames converted from the PNGs in `my images/`, both 1440×1508 sources:

| File | Source | Where it appears |
| --- | --- | --- |
| `main.jpg` | `about main.png` | the resting portrait |
| `hover.jpg` | `about on hover.png` | cross-faded in over the first on hover |

Both are JPEG at a 1200px long edge, quality 82 — 200KB and 236KB against 1.9MB and 2.2MB for the
PNGs, which nothing on the site loads. The box is 416px wide at most, so 1200px is still ~2.9x and
they stay sharp on a 2x display. The sources stay in `my images/` so the conversion can be redone:

```sh
sips -s format jpeg -s formatOptions 82 -Z 1200 "my images/about main.png"      --out public/about/main.jpg
sips -s format jpeg -s formatOptions 82 -Z 1200 "my images/about on hover.png" --out public/about/hover.jpg
```

`src/components/AboutPortrait.jsx` renders the pair, and four decisions in it are load-bearing:

- **Two stacked `<img>`s, not one `src` swap.** Swapping `src` blanks the frame while the new file
  decodes, which flashes the sand fill through on a slow connection. Both images are in the DOM from
  the start, so the reveal is a pure opacity change with nothing to load.
- **`@media (hover: hover)` wraps the reveal.** A finger produces a `:hover` that latches after the
  tap and does not clear until something else is touched, so without the guard the second frame
  would stick on a phone. The resting portrait is the permanent state on a coarse pointer.
  `focus-within` sits alongside `hover` so a keyboard user is not locked out.
- **The second image is `aria-hidden`.** A screen reader has no hover, so an `alt` on it would read
  the same caption twice. It carries `profile.portraitHoverAlt` for the record, currently `null`.
- **The ratio is 4/5, not the 16/10 the old slot reserved.** Both sources are a little under square,
  and a 16/10 crop cuts the top of the head and the chin. The figure dropped from `max-w-[30rem]` to
  `max-w-[26rem]` to match, so at 416×520 the portrait does not outweigh the paragraph above it.

Neither frame carries a filter. They were black and white until there was a real photograph to put
in the slot, on the design.md §6 rule that the one picture of the person should be the one picture not
in colour. That rule was written for a placeholder holding a column together; a real portrait at
416px is a colour photograph either way, and the desaturation was only draining it. It is also what
makes the hover read correctly — a cross-fade between two colour photographs reads as the same moment
a second later, where a filtered pair read as the picture warming up. Add `grayscale` to both
`className`s in `AboutPortrait.jsx` to bring the old treatment back. Reduced motion sets
`transition: none` rather than removing the hover: a cross-fade between two photographs is a change
of picture, not movement, so the state is kept and the duration taken to zero.

### Case study images

`public/groshi/` holds the six Groshi screens, converted from the original 1320×823 PNGs in `groshi/`
to JPEG at a 1400px long edge and quality 82 (80 for the research board, which is mostly flat
colour). Sources stay in `groshi/` so the conversion can be redone; the originals are 1.9MB in total
and nothing on the site loads them.

| File | Source | Where it appears |
| --- | --- | --- |
| `ia.jpg` | `Frame 4395.png` | the "scalable financial structure" section |
| `competitors.jpg` | `Frame 4395-1.png` | "Competitive research", after the table |
| `chart-before-after.jpg` | `Frame 4395-2.png` | "Making financial data easier to understand" |
| `categories.jpg` | `Frame 4395-3.png` | the category system section, plus the grid card |
| `budget.jpg` | `Frame 4395-4.png` | "Designing budgeting from scratch", plus the case study cover |
| `research-board.jpg` | `Frame 4395-5.png` | "Research: understanding what users actually struggle with" |

Each `image` block in `data.js` sets `src` plus a `caption`. The captions carry the argument the
screenshot can't: what the reader should conclude from it. `alt` describes the screen for anyone who
can't see it. `label` is kept alongside `src` because that is what renders if a file ever goes
missing — it names the image rather than saying "image needed".

The research board is the one image whose own text is unreadable at page width, and that is
deliberate: at full size it shows the volume and grouping of the feedback, which is the point of
that section, and its caption says so.

### ARASTELLE images

`public/arastelle/` holds seven JPEGs built from screenshots of the live site at arastelle.com, taken
at 1440×900 (390×844 for the two phone shots) and converted at a 1400px long edge, quality 82. The
cover is the exception: it is the supplied mockup, `arastelle.png`, at the repo root — 4000×3000 and
13.9MB as delivered — converted at a 2400px long edge and quality 86, which is 848KB and still well
above the 1160px the cover renders at. Sources stay in `arastelle/` so the crops can be redone;
nothing on the site loads them.

The cover mockup is 4:3 in a 16:9 / 21:9 band, so `object-cover` crops it. Verified at both ratios:
the laptop sits centre and slightly low, so a centred crop keeps the screen at 16:9 and only trims
empty wall at 21:9. No `object-position` override — there was nothing to correct once measured.

This project was `kind: 'brand'` — a solid navy card with a wordmark, on the grounds that the site had
no public imagery. It has imagery, so it is now `kind: 'photo'`, which is the change worth noticing:
a portfolio card should show the work, and a client's name is not the work.

| File | What it is | Where it appears |
| --- | --- | --- |
| `cover.jpg` | the device mockup, from `arastelle.png` at the repo root | the case study cover |
| `hero.jpg` | the hero — station on a rooftop at dusk | unused; the cover fallback |
| `card.jpg` | the product frame, cropped 4:3 from the solution shot | the grid card |
| `solution.jpg` | the BASTION ISR section | "Designing the product experience" |
| `usecase.jpg` | the use-case explorer with border security selected | "Making multiple use cases easy to explore" |
| `interop.jpg` | interoperability, four environments | "Combining technical information with visual storytelling" |
| `about.jpg` | the About band and its three-column grid | "Interaction & visual direction" |
| `responsive.jpg` | a composed desktop/mobile pair | "From Figma to Webflow" |

Three things about how these were made, all of which cost a retry:

- **The sticky nav was hidden before capturing.** It is `position: fixed`, so it sits over whatever
  section you scroll to and appeared in the top third of every single frame. Suppressed with an
  injected stylesheet rather than by cropping around it.
- **`card.jpg` is its own crop, not `solution.jpg`.** A 4:3 centre-crop of the 16:9 section catches
  the seam between the two columns and half a heading. The card needed the product frame alone.
- **`responsive.jpg` is composed, not captured.** It is built by
  `arastelle/responsive-composite.html`, a scratch page that puts the same section at 1440 and 390
  side by side with the two captions. That file is a build tool, not an asset — it is the only reason
  the case study can *show* that the build reflows instead of only claiming it in a list.

The use-case explorer only shows its argument once a scenario is selected: unselected it reads
`[ NOT SELECTED ]` next to a static map. The capture clicks a marker on the map first, which is the
whole reason that image is worth having.

### NOXS images

`public/noxs/` holds four JPEGs from `noxs/`, converted at a 1400px long edge, quality 84. Sources stay
in `noxs/`.

| File | What it is | Where it appears |
| --- | --- | --- |
| `hero.jpg` | the landing page hero | the case study cover and the grid card |
| `stack.jpg` | the CTAs over the integration row | "The challenge" |
| `variants.jpg` | the composed A/B pair | "Testing the first impression" |
| `visual.jpg` | the product visual | "Visual direction" |

`Frame 4395.png` is a screenshot *inside a browser mockup*, so the first pass carried the dark green
frame on all four sides. The page area was found by scanning for the frame colour rather than by
eyeballing the crop, and the frame was trimmed before anything else was derived from it — the two
sub-crops are cut from the trimmed page, not from the original, so their offsets are relative to
`source-hero-page.png`.

`variants.jpg` is composed by `noxs/variants-composite.html`, a scratch page, for the same reason
`arastelle/responsive-composite.html` exists: the section claims the direct hero won, and a reader
cannot see that from one hero. Both variants are placed at their native 566px so neither is upscaled,
which is why the image is 2.8:1 and why that block sets `ratio: 'aspect-[2.8/1]'` — at the 16:9
default `object-cover` would crop roughly 720px off the sides, which is most of both variants.

**Two of the five slots are deliberately still placeholders.** "The page narrative" and "CTA
placement" are both claims about the whole page, and the three supplied files are all hero
screenshots. Filling either with a hero crop would fill the box and say nothing about the seven-step
progression or about the CTA pattern repeating down the page. Both need a full-page capture, which is
the one thing that was not supplied.

## Deploying to Netlify

`netlify.toml` is already set up: build command `npm run build`, publish directory `dist`, plus a
SPA redirect so deep links work.

1. Push the project to a GitHub repo.
2. In Netlify: **Add new site → Import an existing project** and pick the repo. The
   `netlify.toml` is detected automatically, so no manual build settings needed.
3. Deploy. Any push to the connected branch redeploys.

The SPA redirect in `netlify.toml` is required. Without it, reloading `/work/groshi`
returns Netlify's 404 page instead of the case study.

For a quick throwaway preview without GitHub, `npx netlify deploy` works too.
