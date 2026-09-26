# random-trip-generator

"Where Should I Go?" — press one button, get a random destination.

The whole app is a single page: a **Surprise me** button, a destination card showing
city, country and a budget level, and a **Save this** button that keeps your
shortlist in the browser.

## MVP scope

- 48 destinations, each with city, country, budget level, and a one-line reason to go
- "Surprise me" button that picks a random destination, never the same one twice in a row
- Destination card: country, city, `€` / `€€` / `€€€` budget, and a short description
- "Save this" toggle plus a saved list, persisted in `localStorage`
- Optional budget filter (`Any` / `€` / `€€` / `€€€`) to roll within a tier

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
index.html          markup: heading, button, filter, card, saved list
src/main.js         all behaviour: rolling, filtering, saving, rendering
src/data.js         the 48 destinations + budget labels
src/style.css       all styling, light and dark via prefers-color-scheme
public/favicon.svg  tab icon
Dev.command         double-clickable launcher for the dev server
```

## Adding a destination

Append one object to `DESTINATIONS` in `src/data.js`:

```js
{ id: 'tallinn', city: 'Tallinn', country: 'Estonia', budget: 1, why: 'Medieval towers and design shops.' }
```

- `id` must be unique and stable. It is the key used in `localStorage`, so changing
  an existing `id` orphans anything already saved under the old one.
- `budget` is `1`, `2`, or `3` for `€`, `€€`, `€€€`.
- Saved entries whose `id` no longer exists in the data file are dropped on load, so
  deleting a destination cannot leave a dead row in the saved list.

## Notes

- Saved destinations live in `localStorage` under `where-should-i-go:saved` as a JSON
  array of ids. There is no backend and no account; clearing site data clears the list.
- Budget levels are rough guideposts for a *trip*, not a per-day figure, and are meant
  to be loosely indicative rather than accurate. Flights usually dominate the total.
- "Surprise me" avoids repeating the current destination when the filtered pool has
  more than one entry, so the button never feels stuck.
- Each budget tier has its own accent colour (`--tier-1/2/3` in `src/style.css`), used
  for the pips, the card's left edge, and the tags in the saved list.
- The card fades in on each roll; that animation is disabled under
  `prefers-reduced-motion`.
- Styling uses CSS custom properties at the top of `src/style.css`.
- `Dev.command` is macOS only. On other systems use `npm run dev`.
