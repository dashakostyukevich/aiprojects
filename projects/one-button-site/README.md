# one-button-site

The simplest thing that is still a real website: one page, one button.

Clicking the button increments a counter shown underneath it. Nothing else.

## Stack

Vite + vanilla HTML/CSS/JS. No framework — the whole app is `index.html`,
`src/main.js`, and `src/style.css`.

## Running it

Double-click **`Dev.command`** in this folder. Finder opens a Terminal window,
the dev server starts, and it prints <http://localhost:5173/>.

Press **Ctrl+C** to quit, or just close the window.

`Dev.command` handles the setup for you:

- adds `~/.local/node/bin` to `PATH`, which Finder-launched apps do not get
- runs `npm install` on first use, if `node_modules` is missing
- stops a dev server left over from a previous run, so the URL is always 5173

From a terminal instead, the npm scripts work as usual:

```sh
npm install      # first time only
npm run dev      # dev server, prints a local URL
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## Layout

```
index.html          markup: the heading, the button, the counter line
src/main.js         click handler
src/style.css       all styling, light and dark via prefers-color-scheme
public/favicon.svg  tab icon
Dev.command         double-clickable launcher for the dev server
```

## Notes

- Requires Node. On this machine it lives in `~/.local/node/bin`, which is on
  `PATH` via `~/.zshrc` but not in the minimal `PATH` that Finder gives to
  launched apps — hence the explicit export in `Dev.command`.
- `Dev.command` is macOS only. On other systems use `npm run dev`.
- Styling uses CSS custom properties at the top of `src/style.css`. Change
  `--button-bg` there to recolor the button.
- The counter is plain DOM text, no state library. If it ever needs to be read
  elsewhere on the page, move the count into `main.js` and export it.
