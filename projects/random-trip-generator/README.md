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

| Screen | Contents |
| --- | --- |
| 1. Budget | Four radio options, each with a plain-language explanation of the tier |
| 2. Trip type | Type chips, plus "No preference" which clears the rest |
| 3. Result | Filter summary pills, match count, the card, re-roll, saved list, and a "Change" link back to screen 2 |

Focus moves to the new screen's heading on every step change, so keyboard and
screen-reader users land in the right place instead of at the top of the document.

## Filters

- **Budget** narrows — pick one tier or `Any`.
- **Trip type** widens — the chips are checkboxes, and picking several means *any of
  them*. Beach + Food returns beaches **or** food towns, not places that are both,
  because almost nobody wants a destination that is exclusively both.

The two combine with AND: `Beach` + `€` gives cheap beach towns. A combination with
no matches (for example `Adventure` + `€`, which is empty) is flagged in amber on
screen 2, and screen 3 shows a "no destinations match" message with a link back
rather than silently rolling from everywhere.

The seven types are `beach`, `city`, `culture`, `nature`, `adventure`, `food`,
`nightlife`.

## Stack

Vite + vanilla HTML/CSS/JS. No framework — the app is `index.html`, `src/main.js`,
`src/data.js`, and `src/style.css`.

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
index.html          the three .screen sections, the progress strip, static shells
src/main.js         screen navigation, rolling, filtering, saving, rendering
src/data.js         the 48 destinations, the trip-type list, budget labels
src/style.css       all styling, light and dark via prefers-color-scheme
public/favicon.svg  tab icon
Dev.command         double-clickable launcher for the dev server
```

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
- Each budget tier has its own accent colour (`--tier-1/2/3` in `src/style.css`), used
  for the pips, the card's left edge, the card's type tags, and the saved-list tags.
- Budget options and type chips each wrap a real `<input type="radio">` or
  `<input type="checkbox">` in a `<label>`, so they work with the keyboard and screen
  readers. The input is visually hidden but stays focusable, and the chip or option
  draws a focus ring with `:has(input:focus-visible)`.
- The number on each type chip is how many of the 48 destinations carry that type at
  all, not how many match your budget. It is a sense of scale, not a result count — the
  `N places match your budget` line on screen 2 is the result count.
- The app always opens on screen 1 with no destination stored, so there is no stale
  result from a previous visit. Saved places do persist, via `localStorage`.
- Screens and the card fade in on entry; that animation is disabled under
  `prefers-reduced-motion`.
- Styling uses CSS custom properties at the top of `src/style.css`.
- `Dev.command` is macOS only. On other systems use `npm run dev`.
