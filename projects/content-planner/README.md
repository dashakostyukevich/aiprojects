# content-planner

A content planning app. Client-side only: no backend, no database, no
authentication, no external APIs. Everything will live in `localStorage` in the
browser.

Status: **static UI only.** The interface is built and rendered from
hardcoded sample data in `src/data.ts`. Nothing is saved, nothing is clickable
yet — no localStorage, no API calls, no backend.

## Layout

```
src/
  main.tsx              entry point — leave alone
  App.tsx               the page layout, and where the sample posts are passed down
  index.css             Tailwind import + the warm colour palette
  types.ts              what a Post looks like
  data.ts               10 example posts, written by hand
  styles.ts             colour classes for each status, platform and content type
  components/
    Sidebar.tsx         navigation: Overview, Content Calendar, Ideas
    Header.tsx          page title, subtitle, "+ New post" button
    SummaryCards.tsx    the four count cards
    WeeklySchedule.tsx  seven columns, Monday first
    PostList.tsx        the list of posts, one row each
    StatusPill.tsx      the small coloured status label
```

Design notes: cream page (`paper`), lighter cards (`card`), hairline borders
(`line`), serif headings via `font-display`, and four muted status colours —
sage for published, honey for scheduled, clay for draft, stone for idea. Change
a value in `src/index.css` and the whole app follows.

## Stack

| Piece | Choice | Why |
| --- | --- | --- |
| Build tool | Vite 8 | instant HMR, one dependency, static output |
| UI | React 19 + TypeScript | typed components, no framework ceremony |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` | no config file, no PostCSS, no runtime |
| Lint | oxlint | fast, single binary, no config beyond rules |

State will be plain React (`useState`/`useReducer`) plus a thin
`src/storage/localStore.ts` wrapper over `localStorage`. No state library, no
router, no data-fetching library — none of them are needed until they are.

## Commands

```sh
npm install       # already done
npm run dev       # http://localhost:5173
npm run build     # tsc -b && vite build -> dist/
npm run preview   # serve the production build
npm run lint      # oxlint
```

`Dev.command` is a double-clickable Finder launcher: starts the dev server and
opens the browser.

## Project structure

```
content-planner/
  index.html            Vite entry point; <div id="root"> is the mount node
  vite.config.ts        React + Tailwind plugins. No proxy, no env vars, no server config
  tsconfig.json         References the two tsconfigs below (project references setup)
  tsconfig.app.json     Type-checking rules for src/
  tsconfig.node.json    Type-checking rules for vite.config.ts
  .oxlintrc.json        Lint rules
  Dev.command           Finder launcher for the dev server
  public/               Static files copied verbatim into dist/ (favicon)
See the layout section above for `src/`.
```

## Constraints to keep

- No `fetch` to any external service, and no `.env` files.
- Persistence goes through `localStorage` only, behind one module, so it is
  swappable later.
- Keep it a static build: `npm run build` must produce something that can be
  opened over HTTP with no server-side runtime.
