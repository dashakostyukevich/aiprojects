# random-trip-generator

"Where Should I Go?" — answer two questions, get a random destination.

The app is a three-step wizard on one page:

1. **Budget** — `Any`, `€`, `€€`, or `€€€`
2. **Trip type** — pick as many as you like, or "No preference"
3. **Result** — a destination card, re-roll, and your saved shortlist

## MVP scope

- 48 destinations, each with city, country, budget level, 2–4 trip types, and a one-line reason to go
- Three screens: choose budget, choose trip type, see the result
- "Surprise me again" that re-rolls within the chosen filters, never the same place twice in a row
- Destination card: country, city, trip type tags, `€` / `€€` / `€€€` budget, and a short description
- "Save this" toggle plus a saved list, persisted in `localStorage`
- Live match counts on both filter screens, so you can see what a roll can return before you get there

## Screens

Navigation is linear with working back buttons. Changing a filter and continuing
forward re-rolls only if the current card no longer fits, so stepping back to check
something does not throw away a result you were happy with. Selections on both filter
screens are remembered as you move between them.

Back behaviour is deliberately not uniform. **Back on screen 2** steps to screen 1.
**Back on screen 3** — the "Change" link, and the "Try different filters" link in the
empty state — jumps straight to screen 1, skipping the type screen. From the result,
"back" means "ask me the questions again", and the budget is the first of those. It is
a jump rather than a reset: whatever is already selected stays selected and ticked, so
you can change one thing and carry on.

| Screen | Contents |
| --- | --- |
| 1. Budget | Four radio options, each with a plain-language explanation of the tier |
| 2. Trip type | Type chips, plus "No preference" which clears the rest |
| 3. Result | Filter summary pills, match count, the card, re-roll, saved list, and a "Change" link back to screen 1 |

Focus moves to the new screen's heading on every step change, so keyboard and
screen-reader users land in the right place instead of at the top of the document.

## Filters

- **Budget** narrows — pick one tier or `Any`.
- **Trip type** widens — the chips are checkboxes, and picking several means *any of
  them*. Beach + Food returns beaches **or** food towns, not places that are both,
  because almost nobody wants a destination that is exclusively both.

The two combine with AND: `Beach` + `€` gives cheap beach towns. A combination with
no matches (for example `Adventure` + `€`, which is empty) is flagged in amber on
screen 2, and screen 3 shows a "no destinations match" message with a link back to
screen 1 rather than silently rolling from everywhere.

The seven types are `beach`, `city`, `culture`, `nature`, `adventure`, `food`,
`nightlife`.

## Stack

Vite + vanilla HTML/CSS/JS. No framework — the app is `index.html`, `src/main.js`,
`src/data.js`, and `src/style.css`.

The three brand fonts (Anton, Caveat, Poppins) are installed as npm packages via
`@fontsource` and bundled by Vite, so there is no CDN request and the app works
offline. Only the Latin subsets are imported; the full packages drag in Cyrillic and
Devanagari that is never rendered.

## Running it

Double-click **`Dev.command`** in this folder. Finder opens a Terminal window, the
dev server starts, and it prints <http://localhost:5173/>.

Press **Ctrl+C** to quit, or just close the window. `Dev.command` handles setup for
you: it adds `~/.local/node/bin` to `PATH` (Finder-launched apps do not get it), runs
`npm install` on first use, and stops a dev server left over from a previous run so
the URL is always 5173.

From a terminal instead, the npm scripts work as usual:

```sh
npm install      # first time only
npm run dev      # dev server, prints a local URL
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## Layout

```
index.html                   the three .screen sections, the progress strip, SVG motifs
src/main.js                  screen navigation, rolling, filtering, saving, rendering
src/data.js                  the 48 destinations, the trip-type list, budget labels
src/style.css                Daisy Made tokens, motifs, and all component styling
public/favicon.svg           tab icon
Dev.command                  double-clickable launcher for the dev server
daisy-made-design-system.md  Daisy Made brand reference: palette, type, motifs
```

## Design system

`daisy-made-design-system.md` is the brand reference for any Daisy Made visual work —
the Instagram/template look by Nabi Studio. Consult it before adding colors, fonts, or
decorative elements, and keep `src/style.css` consistent with it.

At a glance:

- **Palette** — mustard gold `#E8A93C`, coral red `#D94F3D`, olive green `#7C8B3E`,
  bubblegum pink `#F2A8C7`, sky blue `#A9C9E8`, cream `#FBF2DC`, rust text `#B5432D`,
  dark text `#2E2A20`. One dominant hue plus cream per card; max two saturated colors.
- **Type** — one bold condensed all-caps display face (Anton / Archivo Black /
  League Gothic) + one handwritten script accent (Caveat / Permanent Marker) + one
  clean geometric body face (Poppins / Nunito Sans). Three typefaces, no more.
- **Motifs** — rounded sticker callouts instead of sharp rectangles, hand-drawn
  flower/asterisk accents, slight rotations and overlaps, and a fixed logo badge as the
  one consistent anchor across the grid.
- **Voice** — warm, communal, handcrafted; maker energy over corporate polish.

### How it is applied here

| Brand rule | Where it shows up |
| --- | --- |
| Cream is the base neutral | `body` background plus a faint rust dot texture, so the cream never reads as flat white |
| One dominant hue per card | each budget option and each result card commits to a single hue; `--fill` picks it |
| Max two saturated colors per card | the result card is cream/paper with one tier hue; pink and mustard alternate across type tags |
| Display face does the visual weight | wordmark, screen titles, and city names, all uppercase in Anton |
| Script is for taglines only | the tagline, per-screen hints, match counts, and the saved count, in Caveat |
| Body face is factual, low priority | all descriptive copy and controls, in Poppins |
| Three typefaces, no more | Anton + Caveat + Poppins, nothing else |
| Rounded sticker callouts, never sharp rectangles | budget sticker, type tags, summary pills, and buttons are pills or blob-radius; nothing is a hard rectangle |
| Slight rotation and imperfection | budget options alternate ±0.5–0.7°, chips and tags ±1.4–2°, and the card sits at −0.6° |
| Hand-drawn accents | asterisk and flower motifs beside headings, a checkerboard strip under the masthead |
| One fixed logo anchor | the circular mascot badge above the wordmark, same spot on every screen |
| Solid offset shadow, not a soft blur | `3px 3px 0` ink on stickers, `5px 5px 0` on the card — the sticker look |
| Warm, handmade voice | "Two questions, one destination", the ✳ bullet on the card, dashed rules instead of hard borders |

### Colours adjusted for accessibility

Four brand hues are tuned for large fills and paper texture, so they fall short of
WCAG AA once used for small text or a solid button. `src/style.css` defines darker
(and for olive, paler) variants of the same hues for those cases, keeping the palette
recognisably Daisy Made while clearing 4.5:1:

| Token | Hex | Pair | Ratio |
| --- | --- | --- | --- |
| `--coral-deep` | `#C0442F` | paper text (primary buttons) | 5.02:1 |
| `--olive-deep` | `#5C6B2A` | paper text (saved button, tier-1 labels) | 5.74:1 |
| `--olive-pale` | `#9DAA63` | ink text (selected € option) | 5.70:1 |
| `--sky-ink` | `#3F6F95` | paper text (tier-2 labels) | 5.61:1 |
| `--mustard-ink` | `#A9761C` | paper text (tier-3 labels) | 4.66:1 |

The raw `#D94F3D` coral and `#7C8B3E` olive are still used for borders, motifs, and
the progress dots, where no text sits on them.

Two other deliberate departures:

- **No dark mode.** The system is defined around a cream base with rust and ink text;
  there is no specified dark palette, so the app sets `color-scheme: light` rather than
  inventing one. A warm dark variant would need brand sign-off.
- **The euro signs use Poppins, not Anton.** Anton's `€` is so condensed it reads as a
  smudge at label sizes, so currency tiers drop to the body face. "Any" stays in Anton
  because it is a word rather than a symbol.

## How the screens work

`index.html` holds all three screens at once as `<section class="screen">` with
`data-screen="1|2|3"`; exactly one is visible and the rest carry `hidden`. `goTo(n)`
in `src/main.js` is the only thing that switches them, which keeps navigation in one
place and stops screen-specific listeners from drifting out of sync with the markup.

Both filter screens are built in JS rather than hand-written in the HTML: budget
options come from `BUDGET_LABELS` / `BUDGET_MEANING`, and type chips come from
`TRIP_TYPES`. Add a data entry and the UI grows with it. `renderMatchCount()` and
`renderTypeNote()` both read the same `pool()` the roll uses, so the counts shown to
the user cannot disagree with what they actually get.

## Adding a destination

Append one object to `DESTINATIONS` in `src/data.js`:

```js
{ id: 'tallinn', city: 'Tallinn', country: 'Estonia', budget: 1,
  types: ['city', 'culture', 'nature'], why: 'Medieval towers and design shops.' }
```

- `id` must be unique and stable. It is the key used in `localStorage`, so changing
  an existing `id` orphans anything already saved under the old one.
- `budget` is `1`, `2`, or `3` for `€`, `€€`, `€€€`.
- `types` must be keys from `TRIP_TYPES`. Give a place 2–4: one is too coarse to
  filter on, more than four stops being a useful filter. Tag the thing the trip is
  actually *for* — Reykjavík is `nature`/`adventure`, not `city`, even though it is
  technically a city.
- Saved entries whose `id` no longer exists in the data file are dropped on load, so
  deleting a destination cannot leave a dead row in the saved list.

## Adding a trip type

Append a key to `TRIP_TYPES` in `src/data.js`, then tag destinations with it. The
filter chips, their counts, and the card tags are all generated from that list, so
nothing in the HTML or JS needs touching.

## Notes

- Saved destinations live in `localStorage` under `where-should-i-go:saved` as a JSON
  array of ids. There is no backend and no account; clearing site data clears the list.
- Budget levels are rough guideposts for a *trip*, not a per-day figure, and are meant
  to be loosely indicative rather than accurate. Flights usually dominate the total.
- "Surprise me again" avoids repeating the current destination when the filtered pool
  has more than one entry, so the button never feels stuck. With a single place
  matching it will repeat, since there is no alternative to offer.
- Each budget tier maps to a brand hue via `--tier` (fill: budget sticker, selected
  option) and `--tier-ink` (small text: the country line and saved-list budget).
- Budget options and type chips each wrap a real `<input type="radio">` or
  `<input type="checkbox">` in a `<label>`, so they work with the keyboard and screen
  readers. The input is visually hidden but stays focusable, and the chip or option
  draws a focus ring with `:has(input:focus-visible)`.
- `[hidden]` is forced to `display: none !important` near the top of `src/style.css`.
  The UA stylesheet's `[hidden] { display: none }` loses to any author `display` rule,
  and several elements here are flex or grid containers — without it, an element with
  `hidden` set would still render.
- The mascot, asterisk, and flower are inline `<symbol>`s at the top of `index.html`,
  reused with `<use>`. They are `aria-hidden` and purely decorative, so they are not
  announced by screen readers.
- The number on each type chip is how many of the 48 destinations carry that type at
  all, not how many match your budget. It is a sense of scale, not a result count — the
  `N places match your budget` line on screen 2 is the result count.
- The app always opens on screen 1 with no destination stored, so there is no stale
  result from a previous visit. Saved places do persist, via `localStorage`.
- Screens and the card fade in on entry; that animation is disabled under
  `prefers-reduced-motion`.
- Styling uses CSS custom properties at the top of `src/style.css`.
- `Dev.command` is macOS only. On other systems use `npm run dev`.
