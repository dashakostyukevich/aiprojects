# content-planner

A content planning app. Client-side only: no backend, no database, no
authentication, no external APIs. Everything will live in `localStorage` in the
browser.

Status: **working app.** Create, edit and delete posts and ideas, saved to the
browser's localStorage, on three pages — a Plan screen with draggable week and
status boards, a Calendar page with the month grid and searchable list, and an
Ideas page for hooks, topics and visuals before they become posts. Still no
backend, database, authentication or API.

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
  App.tsx               both lists, the three pages, and which page is on screen
  index.css             Tailwind import + the warm colour palette
  types.ts              what a Post and an Idea look like, plus the tag lists
  data.ts               12 example posts and 8 example ideas
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
    Ideas.tsx           the Ideas page: a card grid of ideas and its tag chips
    StatusPill.tsx      the small coloured status label
    Dialog.tsx          the frame every dialog shares: backdrop, panel, heading
    NewPostModal.tsx    the long form — seven fields, for posts
    IdeaDialog.tsx      the short form — three fields, for ideas
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

An idea is its own thing, not a stage of a post.

The pipeline — Draft, Scripting, Filming, Editing, Scheduled, Published —
describes how close a *post* is to being live. An idea is the material a post
gets built from, and it does not sit on that scale at all: a hook or a topic has
no platform, no format and no date yet, and one idea can outlive several posts.
Squeezing ideas into the post table would mean inventing a fake platform and a
fake status for every passing thought, which is why there are two lists.

So `Idea` is a separate type — a title, an optional tag, optional notes, and a
link to the post it became:

```tsx
interface Idea {
  id: number
  title: string
  tag?: "Hooks" | "Topics" | "Visuals" | "Post ideas"
  notes?: string
  postId?: number
}
```

The form is deliberately three fields. Recording an idea has to be quicker than
losing it, which is the whole argument for a short form beside the long one
posts use.

### Tags

Tags are a way of *looking* at the page, not something the page acts on. The
chips across the top — All, Hooks, Topics, Visuals, Post ideas, Uncategorised —
each carry a count, and choosing one filters the grid. That state lives inside
`Ideas`, like the post list's filters, and is deliberately not saved.

The chips are on show whether the page holds ideas or not — including on a
first visit, where all six read zero. Seeing the four types before you have
written one is the point: it says what an idea can be, rather than presenting
an empty box and a form. Every chip stays visible at zero too. One that
vanished while selected would leave the page filtering by something with no
control left to see it or turn it off; a count is allowed to be untidy, the
controls are not.

Tags are grey on purpose. Every colour in the palette already means a status or
a platform, so a coloured tag sitting beside a status pill would read as the
same kind of information.

The tag is optional: deciding what kind of thought you just had is a separate
act from having it. Untagged ideas collect under their own group rather than
blocking the save.

### Turning an idea into a post

"Turn into a post" copies the idea's title into a new Draft, carries its notes
across, and opens the long form so the rest can be filled in. Both lists change
in one `setStore`, so the post and the link to it are written together and can
never be half-saved.

The idea stays on the page afterwards, and gains a link to what it became. That
is deliberate: using an idea once is not the same as using it up, and a hook
that worked is worth a second post. Promotion adds a post rather than moving the
idea somewhere else. The card then offers "View post" instead of promoting a
second time — and if that post is later deleted, the link dangles harmlessly
and the card offers to promote again.

Deleting an idea never touches the post it became. They are separate records.

### Two forms

Posts and ideas have separate dialogs, because a form's length is part of what
it is for:

| | The post form | The idea form |
| --- | --- | --- |
| Fields | title, platform, format, date, status, notes | title, tag, notes |
| Panel | `max-w-lg` | `max-w-md` |
| Opened by | the header button, the boards, the calendar | the Ideas page |

Both are built on `Dialog.tsx`, which owns the backdrop, the panel, the heading
and the close button — so the two look like siblings without a second copy of
the same styling to keep in step. A dialog owns nothing about its fields; it is
only the frame.

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
`content-planner:posts`, holding a JSON object with both lists. No server, no
account, no network call anywhere in the app.

```json
{ "posts": [...], "ideas": [...] }
```

One key rather than two, so a save writes both lists together and they cannot
end up out of step with each other.

`src/storage.ts` is the only file that touches `localStorage`:

- `loadStore()` — reads and parses the key. Returns `null` if nothing is saved
  or the data can't be trusted, and `App` then falls back to the examples.
- `saveStore(store)` — writes both lists. Never throws, so a full or blocked
  store can't break the app.

`App` keeps the two lists in one piece of state. `setPosts` and `setIdeas` are
wrappers that replace one list and leave the other exactly as it was — a second
piece of state would mean two saves that could fall out of step. Create, edit,
delete, dragging a card on either board and promoting an idea all only call
those; none of them saves directly, so no handler can forget to.

New ids come from the highest existing id plus one, computed with `reduce`
starting at 0. `Math.max(...items.map(...))` looks equivalent but returns
`-Infinity` on an empty list, which JSON turns into `null`.

Storage is per-origin, so `localhost:5173` (dev) and `localhost:4173`
(preview) keep separate copies. To wipe saved data and start from the examples
again, run `localStorage.clear()` in the browser console.

### Reading old data

Bad saved data is filtered rather than trusted: anything that isn't a
well-formed post or idea is dropped, and if nothing survives the app falls back
to the examples. An empty list is respected as a real state — it means
everything was deleted.

Two upgrades run on the way in, before validation, because both would otherwise
throw data away.

**The old array shape.** Before ideas existed the key held a bare array of
posts. `loadStore` reads that shape too, and treats it as a store with no ideas
in it:

```ts
if (Array.isArray(parsed)) {
  const posts = readPosts(parsed)
  return posts === null ? null : { posts, ideas: [] }
}
```

Reading the old shape rather than refusing it is what stops an upgrade from
emptying the app. Someone upgrading this way keeps every post and starts with an
empty Ideas page — example ideas are only ever copied in on a first run, never
into data that already exists.

**A renamed status.** The check rejects anything it doesn't recognise, so a post
saved with a retired status would read as bad data and be dropped:

```ts
const RETIRED_STATUSES: Record<string, Status> = { Idea: "Draft" }
```

The status once called "Idea" went this way when the pipeline grew to six
stages. That is not the same thing as the `Idea` type — a separate list with its
own form — so only a post's *status* is upgraded here. The upgrade runs on every
load and rewrites a post into a new object, so it is safe to run twice: once a
value has been replaced there is nothing left for it to match, and the stored
JSON is rewritten to the new shape on the next save.

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
