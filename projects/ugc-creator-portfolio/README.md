# ugc-creator-portfolio

Portfolio site for a UGC (user-generated content) creator — the kind of creator brands hire to
produce social-first video and photo content for their accounts. Single-page marketing site with
routing ready to grow into work, about and contact pages.

Status: **empty scaffold.** Deps installed, Tailwind v4 wired, build verified. No design or content
yet.

## Commands

```sh
npm run dev      # local dev server
npm run build    # production build into dist/
npm run preview  # serve the built dist/ locally
```

## Stack

- React 19 + Vite 8
- Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js` — theme lives in
  `@theme` blocks inside `src/index.css` when you start styling)
- `react-router-dom` v7 installed for routing, not wired up yet

Dependency versions intentionally match `projects/product-designer-portfolio` so both sites share
the same toolchain.

## Wiring already done

- `vite.config.js` registers the `tailwindcss()` plugin
- `src/index.css` contains only `@import 'tailwindcss';`
- `src/main.jsx` imports `./index.css` and mounts `<App />`
- `src/App.jsx` is an empty `main` with base Tailwind classes, purely to confirm the pipeline works

## Planned content for a UGC portfolio

Placeholder until the design pass. Expected sections:

- Hero — creator name, one-line positioning, primary CTA (usually "book me" or "see my work")
- Reel / showreel embed (Vimeo or YouTube, muted autoplay loop)
- Selected work — one card per brand, each with platform, format, and a short results line
- Platforms and deliverables — what the creator shoots and where
- Testimonials from brands
- Rates / packages, or a "DM for rate card" handoff
- Contact form plus social links

## Next steps

1. Decide the visual direction and record it in this folder's README or a `design.md` (the
   `product-designer-portfolio` project keeps `design.md` as its source of truth — worth copying
   that habit).
2. Set the site title and meta in `index.html`.
3. Add routing when a second page exists.