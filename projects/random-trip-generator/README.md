# random-trip-generator

"Where Should I Go?" — press one button, get a random destination.

The whole app is a single page: a **Surprise me** button, a destination card showing
city, country and a budget level, and a **Save this** button that keeps your
shortlist in the browser.

## MVP scope

- 48 destinations, each with city, country, budget level, 2–4 trip types, and a one-line reason to go
- "Surprise me" button that picks a random destination, never the same one twice in a row
- Destination card: country, city, trip type tags, `€` / `€€` / `€€€` budget, and a short description
- "Save this" toggle plus a saved list, persisted in `localStorage`
- Filters for budget (`Any` / `€` / `€€` / `€€€`) and trip type, with a live count of how many places match

## Filters

Two independent filters, both reflected in the `N of 48 places match` line under the
controls so you can see what a roll can possibly return before you press it.

- **Budget** narrows — pick one tier or `Any`.
- **Trip type** widens — the chips are checkboxes, and picking several means *any of
  them*. Beach + Food returns beaches **or** food towns, not places that are both,
  because almost nobody wants a destination that is exclusively both.

The two combine with AND: `Beach` + `€` gives cheap beach towns. A combination with
no matches (for example `Adventure` + `€`, which is empty) shows a "no destinations
match" message and disables the result rather than silently rolling from everywhere.
Relaxing any filter from that state rolls a fresh card immediately.

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
index.html          markup: heading, button, filters, card, saved list
src/main.js         all behaviour: rolling, filtering, saving, rendering
src/data.js         the 48 destinations, the trip-type list, budget labels
src/style.css       all styling, light and dark via prefers-color-scheme
public/favicon.svg  tab icon
Dev.command         double-clickable launcher for the dev server
```

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
- "Surprise me" avoids repeating the current destination when the filtered pool has
  more than one entry, so the button never feels stuck.- Each budget tier has its own accent colour (`--tier-1/2/3` in `src/style.css`), used
  for the pips, the card's left edge, the card's type tags, and the saved-list tags.
- The type chips wrap a real `<input type="checkbox">` in a `<label>`, so they work with
  the keyboard and screen readers. The checkbox is visually hidden but stays focusable,
  and the chip draws a focus ring with `:has(input:focus-visible)`.
- The number on each chip is how many of the 48 destinations carry that type at all, not
  how many match your other filters. It is a sense of scale, not a result count — the
  `N of 48 places match` line is the result count.
- The card fades in on each roll; that animation is disabled under
  `prefers-reduced-motion`.
- Styling uses CSS custom properties at the top of `src/style.css`.
- `Dev.command` is macOS only. On other systems use `npm run dev`.
