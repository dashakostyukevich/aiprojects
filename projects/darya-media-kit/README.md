# Darya's Diary — Media Kit

Rebuild of the Webflow media kit at `daryas-diary.webflow.io`, as static
HTML/CSS/JS. No build step, no dependencies, no framework.

```
./dev.py                   # http://localhost:8912, sends no-store
```

Use `dev.py`, not a bare `python3 -m http.server`. The plain one sends no
`Cache-Control`, so Chrome heuristically caches `style.css` and keeps serving
the old copy after an edit — which looks exactly like a change that "didn't
work". `dev.py` sends `no-store` so every reload is the truth. Production
caching is separate and set in `netlify.toml`.

## Structure

```
index.html
admin/
  index.html               # the editing screen, at <site>/admin/
  config.yml               # what the editing screen shows, field by field
content/content.json       # ALL the content — this is what you edit
assets/
  css/style.css            # design tokens + all component styles
  js/data.js               # built-in copy of the content, used only as a fallback
  js/main.js               # loading, rendering, interaction
  uploads/                 # images added through the editing screen
  work/                    # UGC video covers
  photo-*.avif             # UGC photography stills
  about-*.avif             # about-section images
  hero.mp4, footer-banner.mp4
deploy.sh                  # publishes to Netlify — see Deploying
netlify.toml               # publish dir + cache headers
```

## Editing content

**You do not need to touch any file.** Everything on the page is edited at
**<https://darya-media-kit.netlify.app/admin/>** — name, links, stats, videos,
photos, brands, packages and prices. Change something, press Publish, and the live
site rebuilds about a minute later.

Everything on the page lives in one file, `content/content.json`, and
`admin/config.yml` describes it as a form. The page reads the JSON at runtime, so
nothing is baked into the HTML.

| Key | What it drives |
| --- | --- |
| `SITE` | name, email, socials, hero text, browser title, description, stats, footer |
| `WORK` | the videos, grouped by the category tabs |
| `PHOTOS` | the photography grid; `cat` generates the filter chips |
| `BRANDS` | the brand grid and the scrolling marquee |
| `PACKAGES` | the package cards and their prices |
| `ADDONS` | the add-on list |

### `assets/js/data.js` is a fallback, not the source

It holds a copy of the same content and is only used if `content/content.json`
fails to load — a fresh clone, a bad path, a dropped connection. That way the site
always renders a complete page rather than an empty shell. Keep it in step with
`content.json` if you hand-edit either one.

### One-time Netlify setup for editing

Editing needs two switches in the Netlify dashboard, per site:

1. **Site configuration → Identity & Access → Identity → Enable identity**
2. **Same page → Services → Git Gateway → Enable**

Git Gateway is what carries a published save back to the site. Until it is on,
`/admin` shows a note saying exactly this rather than a bare error.

### The prices are placeholders

`$100 / $240 / $600` and every add-on figure are invented to show the layout
working. **Replace them with your real rates before publishing** — either through
`/admin`, or in the `PACKAGES` and `ADDONS` blocks of `content/content.json`.

## Design system

Tokens live at the top of `style.css`.

| Token | Value | Used for |
| --- | --- | --- |
| `--cream` | `#efe5d7` | page background |
| `--cream-deep` | `#e4d9bd` | cards, footer, stats |
| `--ink` | `#171411` | body text, dark sections |
| `--red` | `#a6171b` | accent, buttons, eyebrows |
| `--yellow` | `#fcb70d` | script accents on dark sections |

Two typefaces, both self-hosted so there is no third-party font request:

- **Cabinet Grotesk** — everything
- **PP Editorial New Italic** — the display accents (`.script` class), from
  `font/PPEditorialNew-Italic-BF644b214fb0c0a.otf`. Commercial, so it stays in
  `font/` at the project root and outside `assets/`. `.script` carries a
  Palatino/Georgia italic fallback so a missing file degrades to a real serif
  rather than reflowing every headline.

## Behaviour worth knowing

- **Content loads at runtime.** `main.js` fetches `content/content.json` and
  renders from it, falling back to `assets/js/data.js` if that fails. The HTML
  ships the real text as a fallback, so the page reads correctly even if the
  fetch never completes.
- **Filters** are generated from the `cat` values in the data. Adding a new
  category to `PHOTOS` or `WORK` makes a new chip appear; you don't touch the HTML.
- **Content is escaped on the way in.** Since content is now typed by hand in a
  web form, every string is HTML-escaped before it goes into the page. A stray `<`
  in a brand name shows as a character, not as markup.
- **Stat figures** are plain numbers in the CMS (`6.47`) and the site adds the
  formatting, so the count-up animation always ends on the value that was typed.
- **Video lightbox** — clicking a work card loads the YouTube iframe on demand
  rather than at page load, so there are 33 fewer third-party requests up front.
  Escape and backdrop clicks close it.
- **Background video** doesn't autoplay below 768px — only the hero uses one.
- **`prefers-reduced-motion`** disables the marquee, reveal animations, the
  scroll fan and the stat count-up; all content is visible without them.
- **The nav is transparent** over the hero and picks up a solid background once
  you scroll past it, matching the original.

## Motion

`assets/css/motion.css` + `assets/js/motion.js`, loaded after `style.css` and
`main.js`. Still no dependencies — the entrance layer is IntersectionObserver,
the scroll-linked layer is one rAF loop, and nothing animates layout.

### The two-key gate

Everything hinges on two classes on `<html>`:

| Class | Added by | Meaning |
| --- | --- | --- |
| `motion` | inline script in `<head>` | JS is running; motion.css may hide things |
| `motion-off` | motion.js on failure, and the `<head>` failsafe | cancel every hidden state |

Hidden states are written as `html.motion:not(.motion-off)`, so they stay in
force **while motion is actually working** — that persistence is the whole
point, since a hidden state dropped before the observer fires is an element that
never animates. The failsafe timer in `<head>` checks `data-motion-alive`, which
motion.js stamps on its first line, so it only fires when motion.js genuinely
never arrived. Blocked script, 404, parse error or a thrown exception all end
the same way: a readable page, no intro, no scroll lock.

`prefers-reduced-motion` short-circuits to `motion-off` immediately.

### The intro

A ~1.2s "cut along the line" panel: monogram, a rule that draws out while a
counter runs 0→100, then a clip-path lift. Runs once per session
(`sessionStorage`), and is skipped entirely under reduced motion or when storage
is unavailable. Capped by `MAX_MS`, released on `load` past a 620ms minimum,
with a hard timeout behind that. The hero waits for it to lift.

### Things that will bite you

Each of these was a real bug found by testing, not a hypothetical:

- **The clip goes on the `<img>`, never on the observed box.** An
  IntersectionObserver measures painted area, so a box clipped to zero height
  reports an empty rect and can never meet any threshold. Clipping the image
  inside an unclipped box gives the observer something to measure.
- **One element, one observer.** `.photo` and `.why__card--photo` carry both
  `.reveal` and `data-motion-media`. Claiming them for both observers strands
  them: the first marks them seen, the second skips them, and only `is-in`
  clears the clip — so they stayed wiped out for the whole visit.
- **Re-split the headings after `content:rendered`.** `main.js` writes the CMS
  strings with `textContent`, which destroys the word spans a boot-time split
  made. `splitHeadings` therefore tests for the spans themselves, not a flag.
- **`MIN_MS`/`MAX_MS` are declared above `boot()`.** `boot()` runs at the top of
  the file; a `const` read from a function defined below it is a
  temporal-dead-zone `ReferenceError`.
- **Skip zero-area boxes.** Below 700px the third about photo is
  `display: none` and can never intersect, so it is not marked for a wipe.
- **`is-in` lands on the observed element, not on its parent.** The about collage
  reveals `.about__photo-in`, so a rule written as `.about__photo.is-in
  .about__photo-in` matches nothing and the photos stay at opacity 0 forever.
  Two selectors in `motion.css` were wrong this way before they were tested.
- **`.plan` and `.brand` are excluded from the kill-switch transform reset.**
  Both carry a hover lift from `style.css`; clearing their transform would
  silently kill that hover for everyone if the motion layer ever failed.

### Section continuity

The eyebrow hairline draws out as each section head lands, the hero background
settles from a slight wide angle on load, the curved hero subtitle rocks ±1.4°,
and the three about photos drift against each other as their section passes
through the viewport. The drift writes `--fan-y` / `--fan-rot` /
`--fan-scale` / `--par-y`; the transform that reads them lives in `style.css`,
so nothing can end up with two transforms fighting. `--par-y` is the per-photo
parallax: each photo travels at its own `--par-depth` against the band, which is
what keeps the collage alive under the pointer. The loop deliberately moves the
cards only a little — the collage's character is its resting arrangement, so the
scroll motion keeps it alive rather than rewriting it.

### The heading lines

Every heading reveals **line by line**, out of a blur: each line rises 40px and
sharpens from `blur(12px)` over 1.2s on `cubic-bezier(0.16, 1, 0.3, 1)`, and
the lines behind it start 150ms apart.

`splitHeadings()` builds the structure — two spans per line, `.line` (the
clipping box) and `.line-i` (what moves). A "line" is a **direct child of the
heading**: a bare text node or an element. The heading's own nested markup
travels inside the line, so the italic in "we'll scope the rest" survives and
the accessible name is never rewritten.

Four things that will bite you, all of them found by testing:

- **Insert the mask before moving the line into it, never after.** Appending
  first and replacing second throws `NotFoundError` on the second pass — by then
  the node is no longer a child of the heading. It took the whole motion layer
  down and left the page with no animation at all.
- **Two spans per line, not one.** A transform on the clipping element moves the
  clip along with it, so a single span masks nothing and the blur bleeds past
  the line's edges.
- **`is-split-in` must not be in the release rule.** It lands on `<html>` at
  boot, and a keyframe animation with `forwards` does not need a transition to
  fire. Every heading animated while still below the fold and was finished by
  the time the visitor scrolled to it. The release is `is-in` only; the hero
  title's own `data-motion-hero` hands it `is-in` too.
- **Reduced motion needs `animation: none`, not a shorter duration.** These run
  as animations, not transitions, so zeroing `transition-duration` does nothing
  to a keyframe animation that is already running.

`display: block` on `.line` is what makes a heading line a line, and it is why
the 150ms stagger reads in order. The cost is that a heading's direct children
now each own a line — "Pick a starting point," and "we'll scope the rest" are
two lines, not one sentence that happens to wrap.

### The package cards

Each card is **two rounded panels**, not one box: a description panel on top, a
price panel below, and a dashed rule floating in the gap between them. The
reference the cards were rebuilt from stacks them exactly that way — two
receipts stapled together.

Three things make the structure hold:

- **The dashed rule is a `::before` on the price panel**, drawn in the gap
  above it. An element node for a decorative rule would mean every card carries
  markup that exists only to hold a border.
- **The description panel is `flex: 1`.** Without it, a card whose copy is
  shorter than its neighbour's pushes its price panel up, and the price rows
  stop lining up across the row. `.plan__list`'s `margin-top: auto` then pins
  the bullets to the foot of that panel, so both the bullets *and* the prices
  line up.
- **The row stagger is a `margin`, not a `transform`.** The hover peel owns the
  transform on the price panel, and a second one on the same element means one
  of them silently stops working.

The barcodes are inline SVG built by `barcode(seed)` in `main.js`, seeded from
the card's **index** — a random one would reshuffle itself on every content
save. The reference draws its own as SVG too, one per card, none alike.

### The card hover

**The card does not move.** Hovering a card peels the **price panel off it**: it
drops 16px and tilts 5°, and its barcode plays a short scan. The card itself
never lifts. That is the reference's actual behaviour, read off its own
interaction data rather than guessed — 500ms in on
`cubic-bezier(.579, .423, .17, 1.452)`, 300ms out on outSine.

Three consequences worth knowing:

- **`.plan` was removed from motion.css's hover-lift list.** It carried a
  `translateY(-4px)` there. A lift on the card plus a peel on the panel is two
  transforms describing one hover, and they fight.
- **`cursor: pointer` is deliberately absent.** The card is not a link — only
  the CTA is. A pointer cursor over the whole card would promise something
  that isn't there.
- **`:focus-within` sits beside `:hover`.** The CTA is the only focusable thing
  inside a card, so `:hover` alone would mean a keyboard user never sees the
  peel at all. The CTA carries a `:focus-visible` ring at `outline-offset: 4px`
  so it clears the panel edge instead of hugging it.
- **`.plan:hover` raises `z-index`.** The 5° tilt swings the panel's corners
  about 13px sideways, which at four-across reaches toward the neighbouring
  card. Lifting the card in the stacking order keeps the peeled panel on top of
  whatever it leans over.

### Four cards across

The grid is 1-up on phones, 2-up from 760px, and **4-up from 1300px**.

1300 is not a round-looking number; it is where the widest footer pair on the
page — "per month" beside "Talk about a retainer →" — still fits on one line.
Below it the row is two-up and the cards are wider, which is the better trade.
At 1440 each card is ~289px; at 1680, ~343px, which is almost exactly the
reference's 334px card.

Two traps in that block, both found by measuring rather than looking:

- **The four-across padding override has to come last.** `.plan__panel` is
  declared after the column-count media query, so a `padding-inline` written
  inside that query is reset by the later base rule. There were two layers of
  the same problem — the base rule also used the `padding` **shorthand**, which
  resets `padding-inline` just as effectively. Both fixed: longhands in the
  base rule, override at the end of the block.
- **`.plan__unit` needs `white-space: nowrap`.** As a shrinkable flex item it
  breaks "per month" across two lines rather than overflowing, and that one
  card's price panel then grows taller than the other three — breaking the very
  alignment the two-panel layout exists for. With `nowrap` the overflow shows
  up in a measurement instead, where the padding and type tightening removes it.

**Do not use `--ease-soft` in style.css.** It is defined in motion.css, not
style.css, and a `var()` that resolves to nothing voids the entire declaration
at computed-value time — no error, no warning, the transition or animation just
silently never runs. It cost an hour of "why does the barcode not animate". Both
easings on this block are written out.

Nothing essential is hover-gated: every price, unit and CTA is plain text in the
flow, which is exactly why the reference — whose CTA is `opacity: 0` until you
hover — gets away with hiding one and this card does not. Under
`(hover: none)` the peel never applies, and under `prefers-reduced-motion` the
panel is pinned with `transform: none !important` so a card can never be caught
mid-peel.

### The about collage

The "Why me?" photos are a collage, not a grid of cards: they overlap into a
band, each one brings its own size, ratio and height, the tilts alternate, and
the whole group leans on the faint lobed shape (`.about__blob`, a generated
SVG, aria-hidden) behind it. The composition follows the reference the section
was rebuilt from — an expressive scattered band on desktop, a compact two-frame
pair below 700px.

Each photo is two elements, and the split is the whole trick:

| Element | Owns |
| --- | --- |
| `.about__photo` | placement in the band, resting tilt, scroll parallax — **the only transform** |
| `.about__photo-in` | rounded corners, shadow, clip box, the arrival, the hover lift |

Everything the scroll loop writes (`--fan-y`, `--fan-rot`, `--fan-scale`,
`--par-y`) lands on the box; everything an animation writes lands on the frame.
One element can only carry one transform, so the moment the entrance and the
tilt share a box, one of them silently stops working. `data-motion-media` is
also marked on the frame, not the box — which means the existing
`[data-motion-media] > img` wipe rules apply unchanged, and the observer gets
an unclipped box to measure.

Four traps in that block, all found by testing:

- **The overlap is a `clamp()` of lengths, not a percentage.** Percentage
  margins resolve against the *containing block's* inline size — the full-width
  row — not the card's own width, so a `-20%` overlap swallowed most of each
  photo instead of a fifth of it.
- **The row height is capped by `42vw` as well as by `vh`.** The cards are
  `flex: none` and cannot shrink, so three cards sized from viewport height
  alone overflow on a tablet and get clipped by `.page-wrapper`'s
  `overflow: clip`. The `vw` term takes over on narrow viewports.
- **The scroll loop must not read the resting tilt back out of the card it just
  wrote it to.** `fanAbout` writes `--fan-y` every frame; reading
  `getComputedStyle` inside the loop therefore reads last frame's value and adds
  to it again, sixty times a second. Scrolling through the section quickly left
  the band ~220px off the page and rotated a photo by 49°. The resting values
  are read once, when `wireScroll` runs, and cached in a `Map`.
- **A sticker placed from `right` and then re-placed from `left` stretches.**
  `.about__sticker--spark-b` inherits `right` from `.about__sticker--spark`, so
  it has to set `right: auto` or the box spans the whole row and the glyph lands
  in an arbitrary corner of it.

The drawn marks (`.about__sticker`) reuse `why-icon-01.avif` and the ✦ glyph
already on the page. They are `aria-hidden` and `pointer-events: none`, and
they hide below 1024px, where the band is too narrow to carry them without one
landing on the heading. They are released by `:has()` on the collage — as soon
as one frame has arrived, the marks follow it on.

## Two CSS traps worth knowing

Both cost real debugging time here, so they are commented in the source:

- **Grid ratios belong on the figure, not the image.** The photography lead tile
  spans two rows. With `aspect-ratio` on the `<img>` plus `height: 100%`, the row
  track sizes from its content while the content sizes from the row track, and
  the grid grows without bound. Put the ratio on the `<figure>` and let the image
  fill it.
- **`<figure>` has a UA margin of `1em 40px`.** Left unreset it silently eats most
  of a narrow grid cell — the tiles rendered 50px wide inside a 129px column. It
  is reset alongside `h1`–`p` in the reset block.

## Deploying

Published at **https://darya-media-kit.netlify.app** (site id `bc483233-ab33-4d5d-a124-9e8dc296cf34`,
team: dashakostyukevich’s team). `netlify.toml` holds the config and `.netlify/`
holds the site link, so there is no build step — the folder *is* the site.

### Deploying by hand

Run the script from this folder:

```sh
./deploy.sh                          # production deploy
./deploy.sh --draft                  # draft URL, leaves the live site alone
./deploy.sh --msg "fix pricing copy"  # attach a message to the deploy
./deploy.sh --help
```

One-time setup, if you ever need to redo it on another machine:

```sh
npm i -g netlify-cli   # the CLI is global, not a project dependency
netlify login          # opens a browser to approve
netlify link           # ties this folder to the site
```

The script fails with a readable message rather than a CLI stack trace if
`netlify-cli` is missing or the folder is not linked, and it warns when there
are uncommitted changes in the folder — deploying publishes whatever is on
disk, not just what is committed.

Any static host works too — drag the folder onto Netlify.

### Visitor access was switched off

The new site shipped returning **401 on every path**: the team account has
`sso_login: true`, which Netlify applies to new sites, so the site was only
visible to logged-in team members. Fixed with:

```sh
netlify api updateSite --data '{"site_id":"bc483233-ab33-4d5d-a124-9e8dc296cf34","body":{"sso_login":false}}'
```

If a redeploy ever comes back 401 again, check that flag first.

### The site is not connected to git

`deploy.sh` publishes with the CLI, and the Netlify site has **no repository
linked** — so nothing rebuilds on its own when a file changes. That matters for
editing: Decap's Git Gateway backend needs a repo to commit to.

To connect it:

1. Push this folder's contents to a repository.
2. Netlify → **Site configuration → Git → Connect repository**, pick that repo
   and the branch. Netlify reads `netlify.toml` from the repo root, so if the
   site lives in a subfolder of a larger repo, the root config needs
   `publish = "path/to/this-folder"`.

After that, `/admin` works and `deploy.sh` becomes optional.

Remember to swap the placeholder prices first.