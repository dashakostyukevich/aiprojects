# content-planner

A content planning app. Client-side only: no backend, no database, no
authentication, no external APIs. Everything will live in `localStorage` in the
browser.

Status: **working app.** Create, edit and delete posts, saved to the browser's
localStorage, on two pages — an Overview with the calendar and post list, and an
Ideas page. Still no backend, database, authentication or API.

## Positioning

This app is deliberately **not** a feature-for-feature rival to Workhorse
(`app.workhorsehq.co`), which owns the "AI + content strategy + production
pipeline" lane and is desktop-only on the web.

Here we are a **mobile-first, opinionated planner**: a calm, editorial tool
that is genuinely good on a phone, starts with working defaults instead of a
setup wizard, and gets out of the way. See `AUDIT.md` for the competitive
teardown and `PLAN.md` for the roadmap.

Two commitments shape the roadmap:

1. **Mobile-first, not mobile-tolerant.** The primary surface is a phone.
2. **Opinionated defaults.** A new user lands on a working plan, not an
   empty form.

## Layout

```
src/
  main.tsx              entry point — leave alone
  App.tsx               the two views, the posts, and which page is on screen
  index.css             Tailwind import + the warm colour palette
  types.ts              what a Post looks like
  data.ts               12 example posts, dated relative to today
  styles.ts             colour classes for each status, platform and content type
  dates.ts              all date maths: ISO parsing, the month grid, month stepping
  storage.ts            the only file that touches localStorage
  components/
    Sidebar.tsx         navigation between the two views: Overview and Ideas
    Header.tsx          page title, subtitle, "+ New post" button
    SummaryCards.tsx    the four count cards
    Calendar.tsx        the month grid and its Previous / Today / Next buttons
    FilterBar.tsx       the search box and the three filter dropdowns
    PostList.tsx        the list of posts, plus the filter state
    Ideas.tsx           the Ideas page: a card grid of posts with status "Idea"
    StatusPill.tsx      the small coloured status label
    NewPostModal.tsx    the create/edit dialog, shared by every page
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

## Two views, one list of posts

The app has two pages — Overview and Ideas — and no router. `App` holds a
`View` in state and renders one or the other; the sidebar buttons report which
was clicked. That is genuinely all two pages need, and adding a third is one
more branch in the same place.

The sidebar links used to be `<a href="#">` anchors that went nowhere. They are
buttons now, because they don't open a URL — they change what is rendered. The
"Content Calendar" entry is gone: the calendar is part of Overview, and a nav
item pointing at a section inside another page needs scroll-spy to feel right,
which is more machinery than this app wants.

## The Ideas page

An idea is not a separate kind of thing. It is a post whose `status` is
`"Idea"`, so `Ideas.tsx` takes the same `posts` array as everything else and
does this one line of work:

```tsx
const ideas = posts.filter((post) => post.status === "Idea")
```

Nothing is copied and there is no second data structure to keep in sync. The
"Move to Draft" button maps over the posts and replaces one — the post keeps its
id, date and notes, and simply stops being an idea on the next render.

Everything else is reused:

- **Create** opens the same modal, with `preset: { status: "Idea" }` so the form
  already has the right status, and `createHeading: "New idea"` so the dialog
  says what it is. A preset is only a few fields layered over the blank form,
  which is why the rest still starts empty.
- **Edit** and **delete** are the exact handlers Overview uses.
- **Storage** is the same single `localStorage` key. There is no ideas-specific
  persistence anywhere.

The current view is not saved. A reload opens Overview, which is the page you
want first.

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
`useEffect` watching `posts`. Create, edit, delete and moving an idea to Draft
only call `setPosts` — they never save directly, so no handler can forget to.

New ids come from the highest existing id plus one, computed with `reduce`
starting at 0. `Math.max(...posts.map(...))` looks equivalent but returns
`-Infinity` on an empty list, which JSON turns into `null`.

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
  AUDIT.md              Competitive teardown of Workhorse — what they have, where they're weak
  PLAN.md               Repositioning roadmap: mobile-first, opinionated planner
See the layout section above for `src/`.
```

## Constraints to keep

- No `fetch` to any external service, and no `.env` files.
- Persistence goes through `localStorage` only, behind one module, so it is
  swappable later.
- Keep it a static build: `npm run build` must produce something that can be
  opened over HTTP with no server-side runtime.
- No login, no account, no server. `localStorage` only, behind one module.
- The app must never require horizontal scrolling at 390 px.
