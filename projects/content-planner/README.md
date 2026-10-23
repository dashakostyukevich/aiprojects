# content-planner

A content planning app. Client-side only: no backend, no database, no
authentication, no external APIs. Everything will live in `localStorage` in the
browser.

Status: **working app.** Create, edit and delete posts, saved to the browser's
localStorage, on three pages — a Plan screen with draggable week and status
boards, a Calendar page with the month grid and searchable list, and an Ideas
page. Still no backend, database, authentication or API.

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
  App.tsx               the three pages, the posts, and which page is on screen
  index.css             Tailwind import + the warm colour palette
  types.ts              what a Post looks like, plus the STATUSES list
  data.ts               12 example posts, dated relative to today
  styles.ts             colour classes for each status, platform and content type
  dates.ts              all date maths: ISO parsing, week and month grids
  storage.ts            the only file that touches localStorage
  components/
    Sidebar.tsx         navigation: Plan, Calendar, Ideas
    Header.tsx          page title, subtitle, "+ New post" button
    SummaryCards.tsx    the four count cards
    PlanBoard.tsx       the Week / Status toggle and the week stepping
    WeekBoard.tsx       seven day columns, plus the Unscheduled strip
    StatusBoard.tsx     six columns, one per stage of the pipeline
    BoardCard.tsx       one draggable post card, shared by both boards
    BoardColumn.tsx     one titled drop zone, shared by both boards
    Calendar.tsx        the month grid and its Previous / Today / Next buttons
    FilterBar.tsx       the search box and the three filter dropdowns
    PostList.tsx        the list of posts, plus the filter state
    Ideas.tsx           the Ideas page: a card grid of posts at the first stage
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
(`line`), serif headings via `font-display`, and six muted status colours — clay
for draft, slate for scripting, plum for filming, teal for editing, honey for
scheduled, sage for published. Change a value in `src/index.css` and the whole
app follows.

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

## Three pages

The app has three pages — Plan, Calendar and Ideas — and no router. `App`
holds a `View` in state and renders one or the other; the sidebar buttons report
which was clicked. That is all three pages need, and adding a fourth is one more
branch in the same place.

The sidebar links used to be `<a href="#">` anchors that went nowhere. They are
buttons now, because they don't open a URL — they change what is rendered.

Plan is the landing page: it is the screen a plan lives on. Calendar holds the
month grid and the searchable list, which moved out of the old Overview to give
the boards a page of their own.

## The Plan screen

One board, two ways of reading it:

| Mode | Columns | Dragging changes |
| --- | --- | --- |
| Week | seven days, Monday first, plus an Unscheduled strip | the post's **date** |
| Status | Draft, Scripting, Filming, Editing, Scheduled, Published | the post's **status** |

Both boards show the same posts — only the grouping differs, and only one thing
about a post can change from each. `PlanBoard` owns the toggle and the week being
shown; below it, `WeekBoard` and `StatusBoard` are each about sixty lines and
share `BoardCard` and `BoardColumn`.

```tsx
const statusPosts = posts.filter((post) => post.status === status) // status board
const dayPosts = byDate.get(iso) ?? []                             // week board
```

Posts with no date have nowhere to sit in the seven day columns, so they collect
in the Unscheduled strip below — visible, and one drag from a real day. The strip
works both ways: drop a card in it to clear its date.

Both boards bucket posts into a `Map` or a filter on every render rather than
keeping a second copy of anything. A drag maps over `posts` and replaces one
entry, exactly as editing does, so there is still one list of posts and one
`localStorage` key.

### Dragging is a mouse gesture

The boards use the browser's native drag and drop, which does not fire on touch
screens. Rather than add a second, heavier drag implementation for phones, a tap
on any card opens the edit dialog, where the date and status can be changed
directly. That is the phone's way of moving a post, and it works everywhere.

Because a drag and a click can arrive together, `BoardCard` swallows the one
stray click that some browsers fire when a drag ends, so dropping a card never
throws the dialog open.

### Layout

At `xl` and above the week board is seven columns side by side. Below that it is
a vertical list — one day per row, which is how a week is read on a phone
anyway. This is deliberate: the app must never require sideways scrolling at
390 px, and seven columns at that width would be unreadable slivers. The status
board is three columns from `lg` — two rows of three, because six side by side
would be the same slivers — two from `sm`, and one below that.

The board's mode and week are state inside `PlanBoard`, not in `App`, because
they are ways of looking at the board rather than data about it — like the list's
filters, they reset when you leave the page.

## The Ideas page

The pipeline has six stages, read from `STATUSES`: Draft, Scripting, Filming,
Editing, Scheduled, Published. There is no seventh "Idea" status — an idea is a
post at the front of the pipeline, so `Ideas.tsx` takes the same `posts` array
as everything else and shows the first stage:

```tsx
const FIRST_STAGE = STATUSES[0]
const ideas = posts.filter((post) => post.status === FIRST_STAGE)
```

Nothing is copied and there is no second data structure to keep in sync. The
"Move to Scripting" button maps over the posts and replaces one — the post keeps
its id, date and notes, and simply leaves this page on the next render.

Both stages are read from `STATUSES` rather than typed in, so renaming a stage or
extending the pipeline needs no change here: the page always shows the first
stage and always offers the one after it. Idea cards carry no status pill,
because every card on the page is at the same stage and showing it would just
repeat the page's own label.

Everything else is reused:

- **Create** opens the same modal, with `preset: { status: FIRST_STAGE }` so the
  form already has the right status, and `createHeading: "New idea"` so the
  dialog says what it is. A preset is only a few fields layered over the blank
  form, which is why the rest still starts empty.
- **Edit** and **delete** are the exact handlers the other pages use.
- **Storage** is the same single `localStorage` key. There is no ideas-specific
  persistence anywhere.

The current page is not saved. A reload opens Plan, which is the page you want
first.

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
`useEffect` watching `posts`. Create, edit, delete, dragging a card on either
board and advancing an idea to the next stage all only call `setPosts` — none of
them saves directly, so no handler can forget to.

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

Renaming a status would otherwise be the exception that quietly loses data: the
check rejects anything it doesn't recognise, so a post saved with a retired
value would read as bad data and be dropped. `storage.ts` therefore upgrades
saved posts on the way in, before they are validated:

```ts
const RETIRED_STATUSES: Record<string, Status> = { Idea: "Draft" }
```

Ideas were retired when the pipeline grew to six stages, and became Drafts — the
first stage. The upgrade runs on every load and rewrites a post into a new
object, so it is safe to run twice: once a value has been replaced there is
nothing left for it to match, and the stored JSON is rewritten to the new shape
on the next save.

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
