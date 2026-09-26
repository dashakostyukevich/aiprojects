# one-button-site

The simplest thing that is still a real website: one page, one button.

Clicking the button increments a counter shown underneath it. Nothing else.

## Stack

Vite + vanilla HTML/CSS/JS. No framework — the whole app is `index.html`,
`src/main.js`, and `src/style.css`.

## Commands

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
```

## Notes

- Styling uses CSS custom properties at the top of `src/style.css`. Change
  `--button-bg` there to recolor the button.
- The counter is plain DOM text, no state library. If it ever needs to be read
  elsewhere on the page, move the count into `main.js` and export it.
