# content-planner

A content planning app. Client-side only: no backend, no database, no
authentication, no external APIs. Everything will live in `localStorage` in the
browser.

Status: **project setup only.** No features built yet.

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
  src/
    main.tsx            React root: mounts <App /> into #root, imports index.css
    App.tsx             App shell. Currently just a placeholder heading
    index.css           Tailwind entry point (@import "tailwindcss")
```

New code goes in `src/`. When the planner starts, the natural additions are
`src/types.ts`, `src/storage/localStore.ts`, and `src/components/`.

## Constraints to keep

- No `fetch` to any external service, and no `.env` files.
- Persistence goes through `localStorage` only, behind one module, so it is
  swappable later.
- Keep it a static build: `npm run build` must produce something that can be
  opened over HTTP with no server-side runtime.
