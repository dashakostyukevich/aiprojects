# content-planner

A content planning app. Client-side only: no backend, no database, no
authentication, no external APIs. Everything will live in `localStorage` in the
browser.

Status: **working app.** Create, edit and delete posts, ideas and content
pillars, saved to the browser's localStorage, on four pages — a Plan screen with
draggable week and status boards, a Calendar page with the month grid and
searchable list, an Ideas page for hooks, topics and visuals before they become
posts, and a Pillars page for the themes the posts are meant to serve. Still no
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
  App.tsx               every list, the four pages, and which page is on screen
  index.css             Tailwind import + the design tokens (colour, type, shape)
  types.ts              what a Post, an Idea and a Pillar look like, plus the lists
  pillarTypes.ts        what each of the nine pillar types is for, and the advice
  data.ts               12 example posts, 8 example ideas, 4 example pillars
  styles.ts             status colours, chips and the button shapes, in one place
  dates.ts              all date maths: ISO parsing, week and month grids
  cover.ts              a picked image file, shrunk to something storage can hold
  storage.ts            the only file that touches localStorage
  components/
    Sidebar.tsx         navigation: Plan, Calendar, Ideas, Pillars
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
    Pillars.tsx         the Pillars page: the mix, the pillars, the nine types
    StatusPill.tsx      the small coloured status label
    PostEditor.tsx      the post editor — a whole page, for creating and editing
    Dialog.tsx          the frame the short forms use: backdrop, panel, heading
    IdeaDialog.tsx      the short form — three fields, for ideas
    PillarDialog.tsx    the short form — name, type, description, for pillars
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

## Design

The interface follows the **Mondays design system**: a near-white canvas, white
cards with 1px hairline borders and 20px corners, one confident blue for actions
and the current location, and a small set of pastels that only ever mean a
status.

`src/index.css` holds the tokens — the five surfaces, three text weights, the
blue, the five pastels and the two shadows. Change a value there and every
component follows, because no component carries a hex code of its own.

Three decisions are worth knowing about, because each one is a deliberate
departure or addition:

- **Status is the only thing that carries colour.** Six stages, five pastels, so
  Draft takes the neutral: nothing has started yet and colour is meant to mean
  something. The rest run pink (Scripting), orange (Filming), yellow (Editing),
  blue (Scheduled), green (Published) — blue is the same
  colour the calendar already gives a scheduled post, and green is the stage
  that is finished. Platform, content type, idea tags and pillar types are told
  apart by their words instead.
- **One colour is added to the system: `danger` (#B3261E).** The system's five
  pastels are all too light to read as "stop" on white, and a destructive action
  has to. It is used for the delete hover, a failed write, a field error, and the
  one "usually goes wrong" label on the pillar reference.
- **List dividers are dotted.** A 1px dotted rule covers only half the pixels it
  spans, so the system's `#E3E3E6` lands at about `#F1F1F3` on screen and
  disappears. The token is set darker so the rendered line matches the weight of
  a solid hairline, and stays lighter than the border around the card.

The serif is the wordmark's alone (`--font-brand`, top left); every other piece
of text is the interface sans. No font is fetched — both stacks start with the
system font they name and fall back to what the operating system already has,
because the app never talks to a network.

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

## Four pages

The app has four pages — Plan, Calendar, Ideas and Pillars — and no router. `App`
holds a `View` in state and renders one of them; the sidebar buttons report
which was clicked. That is all four pages need.

The sidebar links used to be `<a href="#">` anchors that went nowhere. They are
buttons now, because they don't open a URL — they change what is rendered.

Plan is the landing page: it is the screen a plan lives on. Calendar holds the
month grid and the searchable list, which moved out of the old Overview to give
the boards a page of their own. The two halves read in order: Plan and Calendar
are for *doing* — what is made, when, and how far along it is — while Ideas and
Pillars are for *thinking*, with Pillars the strategy layer above both.

## The post editor

A post is edited on a page of its own rather than in a dialog. It takes the
place of the header and the page underneath; the sidebar stays, because that is
where you leave from, and it still points at the page you came from.

The page runs in the order a post is actually made:

| Part | Fields |
| --- | --- |
| Heading | the title, typed straight in — what every card and list row shows |
| Header | platform, content type, pillar, status, day, cover image |
| Writing | hooks, then script, then caption |

The six header fields are the decisions made once and then not thought about
again: what it is, who it is for, what it is *for*, where it is in the pipeline,
and when it goes out. The pillar sits among them because it is the same kind of
decision — the post's place in the strategy, not part of its writing.

The three sections below are the work in the order it happens: what stops the
scroll, what you say, what goes underneath. All four text fields are optional, so
a post can be a bare title, a finished script, or anything between the two.

Creating and editing are this one page with the same nine fields. `App` holds a
single `editor` state — `{ create }` or `{ edit, post }` — and renders
`PostEditor` whenever it isn't null, so there is only ever one form to keep
correct. The idea and pillar forms are still dialogs: three short fields do not
need a page, and they belong to one card rather than to the whole screen.

The title is a textarea that grows to its content rather than an input, because
an input shows only as much as fits on one line and the heading is the one place
the whole title should be readable. Enter saves instead of adding a line — a
title is a single line of data.

### Cover images

A cover is picked from disk and stored as a data URL, which puts it against
`localStorage`'s roughly 5 MB for the whole origin — and one phone photo can be
more than half of that. `cover.ts` redraws every image onto a canvas at a
maximum of 1200 px on its longest edge and re-encodes it as JPEG before it is
handed to storage. A 4000 × 2400 screenshot of 884 KB comes out at about
72 KB.

An image already inside that limit is stored as it is, so a small PNG keeps its
transparency instead of coming back with a white box behind it.

### Leaving without saving

A page you can type a whole script into is a worse thing to lose on a misclick
than a dialog was, so leaving asks first — `window.confirm`, the same as
deleting:

```ts
if (editorDirty && !window.confirm("Discard your unsaved changes to this post?"))
  return false
```

The editor reports whether its form still differs from the state it opened with,
and every way out — Back, Cancel, any sidebar item — goes through that one
check. Saving doesn't ask: the writing has just been kept, so there is nothing
left to question.

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
on any card opens the editor page, where the date and status can be changed
directly. That is the phone's way of moving a post, and it works everywhere.

Because a drag and a click can arrive together, `BoardCard` swallows the one
stray click that some browsers fire when a drag ends, so dropping a card never
throws the editor open.

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

Tags are grey on purpose. Every colour in the palette already means a status, so
a coloured tag sitting beside a status pill would read as the same kind of
information. Post pillars reuse the same grey chip for the same reason — a label
is told apart by its words, not its colour.

The tag is optional: deciding what kind of thought you just had is a separate
act from having it. Untagged ideas collect under their own group rather than
blocking the save.

### Turning an idea into a post

"Turn into a post" copies the idea's title into a new Draft, carries its notes
across into the caption, and opens the editor page so the rest can be filled in.
Both lists change in one write, so the post and the link to it are saved
together and can never be half-saved.

The idea stays on the page afterwards, and gains a link to what it became. That
is deliberate: using an idea once is not the same as using it up, and a hook
that worked is worth a second post. Promotion adds a post rather than moving the
idea somewhere else. The card then offers "View post" instead of promoting a
second time — and if that post is later deleted, the link dangles harmlessly
and the card offers to promote again.

Deleting an idea never touches the post it became. They are separate records.

### One page and one dialog

Posts and ideas have different homes, because length is part of what a form is
for:

| | The post editor | The idea form | The pillar form |
| --- | --- | --- | --- |
| Fields | title, platform, format, pillar, day, status, cover, hooks, script, caption | title, tag, notes | name, type, description |
| Surface | a page of its own, replacing the main content | a `max-w-md` dialog over the page | the same dialog |
| Opened by | the header button, the boards, the calendar, promoting an idea | the Ideas page | the Pillars page |

The idea and pillar dialogs are both built on `Dialog.tsx`, which owns the
backdrop, the panel, the heading and the close button. A dialog owns nothing
about its fields; it is only the frame. One `modal` state in `App` says which of
them is open, if either.

The pillar form shows the chosen type's summary under the dropdown, read from the
same `PILLAR_GUIDE` the Pillars page uses, so the choice is made with the meaning
in front of you rather than from a list of nine words — and the two can never
disagree about what "Engaging" means.

The current page is not saved. A reload opens Plan, which is the page you want
first.

## The Pillars page

The strategy page. Plan and Calendar answer what is being made and when; Ideas
answers what it could be made from; Pillars answers what all of it is *for*.

A pillar is a theme you keep returning to — larger than a post, smaller than the
account. You might post under "Postcards in Progress" twice a month for a year,
and every one of those posts is a different post.

```tsx
interface Pillar {
  id: number
  name: string                                         // "Freelance, honestly"
  type: PillarType                                     // one of the nine below
  description?: string                                 // what belongs here, and what doesn't
}
```

### Two axes, not one

A pillar carries both a name and a **type**, and they answer different questions.

The name is yours and carries the specifics — "Postcards in Progress", not
"Travel". The type is shared vocabulary, taken from Cloud Campaign's guide to
content pillars:

> Educational · Promotional · Engaging · Inspiring · Entertaining · Community ·
> Authenticity · Trending · Social proof

A type describes what a post does *for the reader*, not what it is about. Two
pillars can share a subject and still do completely different jobs: "The
explainer" teaches typography, "Postcards in Progress" makes you feel something
about a place, and both could be about the same afternoon. That is why the type
is the thing the page can balance and audit, and the name is the thing only you
can judge.

Both lists live in `types.ts` as `PILLAR_TYPES`, the single source for the form's
dropdown, the storage check and the reference section — the same arrangement
`STATUSES` and `IDEA_TAGS` use.

### Three parts, in the order a strategy gets built

**Your mix** lays the set out by type. One row per type, always all nine, so the
empty ones are as visible as the full ones. The bar measures *posts*, not
pillars: the question this card answers is what the account is actually making,
and a type can be well planned and never posted in — which shows up as an empty
bar beside a type that has pillars in it. The count beside the bar is the same
number, spelled out.

Underneath, up to three observations about the shape of the set: a pillar with no
description, posts not filed under anything yet, two pillars sharing a type, no
type that asks anything of the reader. They are rule-based, not generated — there
is no AI in this app and pretending otherwise would be worse than saying nothing
— so every note can be checked against the numbers above it, and every one says
what to do about it. Three is the cap: a page that lists nine problems reads as a
scolding, and the fourth point is never the one that changes anything.

**Your pillars** are the themes themselves, as cards: name, type, description,
and how many posts are filed under each. Edit and delete in place.

**The nine types** is the reference, and it is shown even when the page holds no
pillars at all — the same decision the Ideas page makes with its tag chips. You
should be able to read the vocabulary before you are asked to use it. Each type
carries three things:

| Part | What it is |
| --- | --- |
| the summary | what this pillar does for the reader |
| "Make it land" | the specific move that separates a good one from a forgettable one |
| "Usually goes wrong" | the failure this type ends in |

The count beside each type name is how many of your pillars sit there, so the
reference doubles as the plan-side half of the mix. The prose lives in
`pillarTypes.ts` rather than in the component: it is editorial writing, it is the
part most likely to be revised, and it is worth reading through in one file.

### The link between a post and a pillar

`Post.pillarId` is an optional number, and the editor's header has a Pillar
dropdown with "No pillar" as a real choice. A post with no pillar is a normal
post — the field arrived after the app did, and an old post simply has none.

Deleting a pillar asks first, and says what it will cost: *"Its one post keeps
everything else but loses its pillar."* The posts are updated in the same write
that removes the pillar, so no post is ever left pointing at something gone. A
dangling id would be worse than it sounds — the post would still be in the list,
but silently absent from every count on the Pillars page, which reads as a bug
rather than a consequence.

The pillar shows on the editor and on each row of the post list, as a quiet grey
chip at the end of the title. It deliberately does *not* appear on the board
cards: those answer when a post goes out and how far along it is, and a third
label on a card that small is noise. The mix, the reference counts and the list
are where a post's purpose belongs.

There is no pillar filter on the post list yet. It would be a fourth dropdown on
a bar that already has three, and it should arrive with a decision about whether
filters stack with the Pillars page or replace it.

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
`content-planner:posts`, holding a JSON object with all three lists. No server,
no account, no network call anywhere in the app.

```json
{ "posts": [...], "ideas": [...], "pillars": [...] }
```

One key rather than three, so a save writes every list together and they cannot
end up out of step with each other. That matters most for pillars: a post points
at one by id, so a post and the pillar it names must always be written in the
same breath.

`src/storage.ts` is the only file that touches `localStorage`:

- `loadStore()` — reads and parses the key. Returns `null` if nothing is saved
  or the data can't be trusted, and `App` then falls back to the examples.
- `saveStore(store)` — writes every list and returns whether it worked. Never
  throws, so a full or blocked store can't break the app; the `false` it returns
  instead is what puts the red "this change has not been saved" banner on screen.

`App` keeps the lists in one piece of state. Every change — create, edit, delete,
dragging a card on either board, promoting an idea, deleting a pillar — goes
through `applyStore`, which puts the new store in memory and writes it in the
same breath, and then through the `setPosts`, `setIdeas` and `setPillars`
wrappers that replace one list and leave the others exactly as they were. A
second piece of state would mean two saves that could fall out of step; saving
from an effect instead would mean the warning can't say which write failed.

New ids come from the highest existing id plus one, computed with `reduce`
starting at 0. `Math.max(...items.map(...))` looks equivalent but returns
`-Infinity` on an empty list, which JSON turns into `null`.

Storage is per-origin, so `localhost:5173` (dev) and `localhost:4173`
(preview) keep separate copies. To wipe saved data and start from the examples
again, run `localStorage.clear()` in the browser console.

### Reading old data

Bad saved data is filtered rather than trusted: anything that isn't a
well-formed post, idea or pillar is dropped, and if no post survives the app
falls back to the examples. An empty list is respected as a real state — it means
everything was deleted.

Upgrades run on the way in, before validation, because all of them would
otherwise throw data away.

**The old array shape.** Before ideas existed the key held a bare array of
posts. `loadStore` reads that shape too, and treats it as a store with nothing in
the other two lists:

```ts
if (Array.isArray(parsed)) {
  const posts = readPosts(parsed)
  return posts === null ? null : { posts, ideas: [], pillars: [] }
}
```

Reading the old shape rather than refusing it is what stops an upgrade from
emptying the app. Someone upgrading this way keeps every post and starts with an
empty Ideas page — example ideas are only ever copied in on a first run, never
into data that already exists.

**A missing key.** Pillars arrived after ideas, so a store saved by the previous
version has no `pillars` key at all. It gets an empty list rather than the
examples: filling in sample pillars would put words in the mouth of someone who
already has their own posts, and their posts have no pillar to point at anyway.
The Pillars page opens on its empty state with the nine types still readable.

**Two renamed fields.** The check rejects anything it doesn't recognise, so a
post saved with a retired status would read as bad data and be dropped:

```ts
const RETIRED_STATUSES: Record<string, Status> = { Idea: "Draft" }
```

The status once called "Idea" went this way when the pipeline grew to six
stages. That is not the same thing as the `Idea` type — a separate list with its
own form — so only a post's *status* is upgraded here.

The second rename is the post's free `notes` field, folded into `caption` when
the editor grew hooks, script and caption and stopped having notes. Both renames
happen in `upgradePost`, which runs on every load and rewrites a post into a new
object, so it is safe to run twice: once a value has been replaced there is
nothing left for it to match, and the stored JSON is rewritten to the new shape
on the next save.

Renaming a *type* rather than a value needs the same treatment. Adding a tag to
`IDEA_TAGS` later, or a type to `PILLAR_TYPES`, would discard it from old saves
unless it gets an upgrade here too.

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
