# content-planner

A content planning app. Client-side only: no backend, no database, no
authentication, no external APIs. Everything will live in `localStorage` in the
browser.

Status: **working app.** Create, edit and delete posts, saved to the browser's
localStorage. Still no backend, database, authentication or API.

## Layout

```
src/
  main.tsx              entry point — leave alone
  App.tsx               the page layout, and where the sample posts are passed down
  index.css             Tailwind import + the warm colour palette
  types.ts              what a Post looks like
  data.ts               12 example posts, dated relative to today
  styles.ts             colour classes for each status, platform and content type
  dates.ts              all date maths: ISO parsing, the month grid, month stepping
  storage.ts            the only file that touches localStorage
  components/
    Sidebar.tsx         navigation: Overview, Content Calendar, Ideas
    Header.tsx          page title, subtitle, "+ New post" button
    SummaryCards.tsx    the four count cards
    Calendar.tsx        the month grid and its Previous / Today / Next buttons
    FilterBar.tsx       the search box and the three filter dropdowns
    PostList.tsx        the list of posts, plus the filter state
    StatusPill.tsx      the small coloured status label
    NewPostModal.tsx    the create/edit dialog
```

## Dates

A post's date is stored as the string `"2026-03-18"`, or `null` when it has no
date. Strings, not `Date` objects, because a calendar day has no timezone and
shouldn't be able to drift by one.

`src/dates.ts` builds and reads every date with `Date.UTC` and `getUTC*`, so the
same input gives the same result in every timezone. The one exception is
`todayISO()`, which uses local time on purpose — "today" should mean today where
you are.

Two bugs this avoids, both of which show up as a post landing on the wrong day:

- `new Date("2026-03-18")` is parsed as UTC midnight but read back with
  `getDate()` in local time, so in Pacific/Midway it returns March 17.
- Mixing the local constructor `new Date(y, m, d)` with `getUTC*`.

`parseISO` also rejects impossible days like `2026-02-31`, and `storage.ts`
drops any saved post whose date doesn't parse, so bad data can't reach the grid.

To try a different month, use the Previous / Next buttons. Clicking a date in the
post list jumps the calendar to that month.

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

State is plain React (`useState`) plus a thin `src/storage.ts` wrapper over
`localStorage`. No state library, no router, no data-fetching library — none of
them are needed.

## Searching and filtering

The post list has a title search and three dropdowns: platform, status and
content type. They combine, so choosing Instagram *and* Scheduled narrows to
posts that are both.

Filters live as state inside `PostList`, not in `App`, because they only affect
that list. They never rewrite the posts — `posts.filter(matches)` produces a new
array to render and leaves the original untouched, which is why the summary
cards and calendar always show every post, and why editing a post so it stops
matching simply makes it disappear from the filtered view while the filter stays
put.

Filters are deliberately not saved to `localStorage`: they are a way of looking
at the list, not data about it. A reload starts unfiltered.

## How data is stored

Everything lives in the browser's `localStorage` under one key,
`content-planner:posts`, holding a JSON array. No server, no account, no
network call anywhere in the app.

`src/storage.ts` is the only file that touches `localStorage`:

- `loadPosts()` — reads and parses the key. Returns `null` if nothing is saved
  or the data can't be trusted, and `App` then falls back to the example posts.
- `savePosts(posts)` — writes the array. Never throws, so a full or blocked
  store can't break the app.

`App` loads once with a lazy `useState` initializer, then saves from a
`useEffect` watching `posts`. Create, edit and delete only call `setPosts` —
they never save directly, so no handler can forget to.

Storage is per-origin, so `localhost:5173` (dev) and `localhost:4173`
(preview) keep separate copies. To wipe saved data and start from the examples
again, run `localStorage.clear()` in the browser console.

Bad saved data is filtered rather than trusted: anything that isn't a
well-formed post is dropped, and if nothing survives the app falls back to the
examples. An empty array is respected as a real state — it means every post was
deleted.

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
