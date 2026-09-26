# tiny-habit-tracker

A very small habit tracker that runs entirely in the browser. No backend, no
database, no accounts, no external APIs. Data lives in `localStorage`.

There are two views, switched with the toggle under the header:

- **Today** — the original card list, one card per habit with a streak count
  and a Done button, plus the 7-day strip.
- **Last 31 days** — one row per habit, with 31 circles: one per day, oldest
  on the left and today on the right. Filled means done. Click any circle to
  mark that day done or undo it.

Both views edit the same data and stay in sync, and everything is saved to
`localStorage` as you click. Three starter habits are shown on a first visit.

Every habit has a **schedule**: how often it is meant to be done. It is picked
in the same form as the name, when adding or renaming, and there are three
kinds:

- **Every day** — the default.
- **Times a week** — 2 to 6. Flexible: any that many days count, you choose
  which. 1 is deliberately not offered, because once a week is what you get by
  picking a single weekday.
- **Certain days** — pick the weekdays, e.g. Mon, Wed, Sat.

The Today card then shows the schedule and the progress towards it: *"3× a week
· 2 of 3 this week"*, with the count in green once the week's target is met. A
daily habit shows no count, because 7 of 7 is not news. A **daily** habit keeps
its day streak; every other schedule is counted in **weeks** instead, so a
3×-a-week habit reads "2 week streak" rather than a day streak that is almost
always 1.

Tracking itself did not change. `completedOn` is still a list of days, the Done
button still marks today, and the 31-day view is untouched — the schedule only
decides what those days are *worth*. A day you did not need is a day you can
still tick, and ticking it never hurts.

Habits can be added with **Add habit**. Every habit has a **⋯** overflow menu
with Rename and Delete, in both views. Rename edits the name, emoji and
schedule in place, taking the habit's spot rather than opening somewhere else.
In the 31-day view the ⋯ sits after the circles, pinned to the right edge so it
stays reachable without scrolling the days.

Delete asks twice, and the confirmation lives inside the menu: the first pick
turns the Delete item into a red "Delete for sure?" and the menu stays open,
the second one deletes. So the control you are about to click is the one that
says what it will do, and backing out is just closing the menu — Escape,
clicking elsewhere, or doing nothing for a few seconds. There is no undo,
which is why it takes two clicks: deleting a habit throws away its history.

## Stack

- **Vite** — dev server with hot reload, and the build tool
- **React 19** — the UI, built out of components
- **TypeScript** — types, so mistakes show up in the editor instead of in the
  browser console
- **oxlint** — the linter (`npm run lint`)

No CSS framework, no state library, no router. Plain CSS files and React
`useState` are enough at this size.

## Running it

Double-click **`Dev.command`** in this folder. Finder opens a Terminal window,
dependencies are installed if needed, and the dev server starts at
<http://localhost:5173/>. Press **Ctrl+C** to quit, or close the window.

From a terminal:

```sh
npm install      # first time only
npm run dev      # dev server at http://localhost:5173/
npm run build    # type-check, then production build into dist/
npm run preview  # serve the production build
npm run lint     # lint the source
```

## Layout

```
index.html            the one HTML page; <div id="root"> is where React mounts
vite.config.ts        Vite config: React plugin, dev server
tsconfig.json         TypeScript config, in two parts (see below)
tsconfig.app.json     rules for src/
tsconfig.node.json    rules for vite.config.ts
Dev.command           double-click launcher for the dev server
public/favicon.svg    tab icon, copied to the site root as-is
src/
  main.tsx            entry point: finds #root and renders <App />
  App.tsx             page layout, the view toggle, and all habit state
  App.css             all layout and card styles
  index.css           global styles: colors, fonts, reset, .sr-only
  types.ts            shared shapes (Habit, Schedule, AppData)
  lib/
    dates.ts          all date maths: today, offsets, weeks, the 31-day list
    emojis.ts         the emoji a habit can be given
    schedule.ts       what a schedule means: targets, wording, streaks
  components/
    WeekStrip.tsx     the 7 day dots (still hardcoded)
    HabitCard.tsx     one habit: emoji, name, goal, streak, Done button
    HabitRow.tsx      one habit: name + 31 clickable day circles
    HabitForm.tsx     name box + emoji picker + schedule, for add and rename
    SchedulePicker.tsx the every-day / times-a-week / certain-days control
    EmojiPicker.tsx   the grid of emoji to click
    HabitMenu.tsx     the per-habit "⋯" menu: Rename and two-step Delete
  storage/
    localStore.ts     the only file that touches localStorage
```

## Components

`App` is the page. It owns the list of habits and the current view:

```
App
├── header            title + subtitle (plain markup, no component needed)
├── view toggle       Today / Last 31 days
└── one of two views
    ├── Today         WeekStrip + a HabitCard per habit, or a HabitForm
    │                 when renaming, plus Add habit
    └── Last 31 days  a HabitRow per habit, or a HabitForm when renaming
```

Every change to the habit list goes through one `commit()` function in `App`,
which sets the state and saves. Having a single exit point means saving
cannot be forgotten by a new action later.

`HabitCard`, `HabitRow` and `WeekStrip` take values as **props** and hold no
state of their own. That is deliberate: the moment they need state, that state
belongs in `App`, and the components just redraw.

`tsconfig.json` is split into two files because browser code and Node code
(config files) need different settings. `tsconfig.app.json` covers `src/`,
`tsconfig.node.json` covers the build config.

## The one idea to remember

`src/storage/localStore.ts` is the only module that reads or writes
`localStorage`, and it only exposes `load()` and `save()`. Everything else in
the app goes through those two functions. That is the whole data layer.

`App` calls `load()` once, in the `useState` initializer, rather than in an
`effect`. That matters: an effect runs *after* the first paint, so the app
would show the starter habits and then jump to the real ones, and a separate
"saving" effect could fire before the stored data was read and overwrite it.
Saving happens in the click handler instead, right next to the state update
it belongs to.

Two details in `localStore.ts` that are easy to get wrong:

- **`hasSavedData()` exists because "nothing saved yet" and "saved, but the
  user deleted every habit" look identical to `load()`** — both return
  `habits: []`. Without the separate check, deleting all your habits would
  bring the starter list back on the next reload.
- **`isAppData()` checks every field of every habit**, not just that `habits`
  is an array. A half-written entry would otherwise reach the components and
  crash on `habit.completedOn.includes(...)`, taking the whole app down.

`lib/emojis.ts` is separate from `EmojiPicker.tsx` on purpose: a file that
exports both a component and a plain value defeats React Fast Refresh, so
editing the component forces a full reload. One export kind per file.

Streak counting lives in `lib/schedule.ts` and works backwards from today. Today
being missing does not break the streak, because the day is not over yet;
yesterday missing does.

`lib/dates.ts` is the only place that does date maths. It never calls
`toISOString()`, which converts to UTC and can shift the calendar day for
anyone not on Greenwich — dates are built from the local
`getFullYear`/`getMonth`/`getDate` instead. Because `completedOn` holds plain
`"YYYY-MM-DD"` strings, comparisons are string comparisons and no parsing is
needed.

## Schedules: how often, and what counts

`Schedule` in `types.ts` is a union of three kinds, and `lib/schedule.ts` is the
only file that interprets one. `App` asks it three questions — what is the
weekly target, how is that worded on screen, and is it met — and passes the
answers down as plain props. Nothing else in the app knows what a
`timesPerWeek` is.

A few decisions worth keeping:

- **The union, not one shape with optional fields.** `{ times?: number,
  days?: number[] }` would allow states the UI cannot produce: zero times a
  week, or weekdays *and* a separate count. Whoever read it would have to guess
  which one the user meant. Three separate shapes make that impossible.
- **`schedule` is required on `Habit`, optional on `StoredHabit`.** The running
  app always has a valid schedule; only the copy on disk is allowed to be old.
  Making it optional on `Habit` would push a `?? daily` into every component
  that reads it, and one of them would eventually be missed.
- **Weeks start on Monday**, because `toLocaleDateString('en-GB')` — which
  already prints the weekday letters in the history rows — assumes it. A
  Sunday-start week here would disagree with the labels above the circles.
- **`weekProgress` only counts days up to today.** The rest of the week has not
  happened, and counting it would let a target be met on Monday by days that do
  not exist.
- **A daily habit keeps the day streak.** "12 days in a row" is more
  encouraging and more honest than "1 week in a row", and for a habit done
  every day the two are not comparable. Only habits with a weekly target are
  counted in weeks.
- **A `timesPerWeek` habit and a `weekdays` habit with the same number are not
  the same thing.** "4 times a week" lets you do them all on Monday; "Mon, Tue,
  Wed, Thu" requires spreading them out. Same number, different streak.

### Old saved data

Habits saved before this feature have no `schedule` field, and that is *normal*,
not corrupt. So `isAppData` was replaced by two steps in `localStore.ts`:
`asStoredHabits` checks that every habit has the fields the app will read
without a fallback (`id`, `name`, `emoji`, `completedOn`), and `upgradeHabit`
then fills in the schedule — `daily` when it is missing, `normaliseSchedule`
when it is present but nonsense.

`normaliseSchedule` clamps rather than rejects, because data that is
*recoverable* should not cost the user their habit list. A target of 0 becomes
1, a target of 99 becomes 7, weekday `9` and `"x"` are dropped, and a weekday
list that is empty or holds all seven days becomes `daily` — seven chips that
happen to all be lit is not a pattern, it is every day, and `normaliseSchedule`
collapses it so it counts like every day instead of like a schedule. The
upgraded data is **not** written back on load: that would mean a write on every
page load, and the next click from the user rewrites the whole object anyway.

### The picker

`SchedulePicker` is controlled, like the rest of the form, and keeps each kind's
value when you switch between kinds. Going from Mon/Wed/Fri to "times a week"
starts at 3, not 1, because 3 is what that habit was already aiming for.

- **The three kinds are real radios**, visually hidden by clipping rather than
  `display: none` — which would drop them from the tab order and leave the
  labels as the only way in. Clipping keeps the arrow-key behaviour a radio
  group is expected to have, and the focus ring is moved onto the *label*,
  since the input itself is a 1px sliver with nowhere to draw it.
- **`.schedule-kind` is `position: relative`.** The clipped input is absolutely
  positioned, and without a positioned wrapper it resolves against some further
  ancestor (or the initial containing block), putting the focus target nowhere
  near what was clicked.
- **The last weekday cannot be unticked.** A habit scheduled for no days has no
  target, so there would be nothing to show or count towards.
- **The summary line says the schedule back in a sentence**, so the choice is
  never something you have to infer from which chips happen to be lit.

### The goal line on the card

`"3× a week · 1 of 3 this week"` is `display: flex; flex-wrap: wrap` with each
half `white-space: nowrap`, not a line of inline text. The two halves have to be
separate boxes so a narrow card can break *between* them; as plain text the
browser will happily split "1 of 3 this week" across two lines. The separator
lives *inside* the second half rather than between them, for the same reason:
as a flex item of its own it gets stranded alone on a line. And the gap between
them is `column-gap` rather than a `margin-left` on the second half, because
flex gap only applies between items on the same line — a margin would indent
the wrapped second line, which reads as a stray hierarchy.

At 420px the two halves do not fit on one line (measured: 164.75px of text in a
160px column) and the card shows them on two lines. That is the honest layout,
not a bug.

A styling note: in `App.css`, use longhand properties
(`background-color`, not the `background` shorthand) when the value is a
`var()`. The shorthand silently kept the light-mode value when dark mode was
enabled, which is exactly the kind of bug variables are supposed to prevent.

## The sticky habit name in the 31-day rows

On a phone, 31 circles do not fit, so the rows scroll sideways and the habit
name is `position: sticky; left: 0` so it stays readable. Two things are
needed for that to actually work, and both look like they should be
unnecessary:

- **The row is `display: flex`, not `grid`.** A sticky element is confined to
  its containing block, and for a grid *item* that block is its own grid
  column. The label would be unable to move at all.
- **The row is `width: max-content; min-width: 100%`.** As a plain block-level
  flex container the row is only as wide as the screen, so the sticky label
  hits the end of its containing block straight away and slides off anyway.

Verified by scrolling fully right on a 390px viewport and checking the label is
still on screen and today's circle is still visible.

## The overflow menu, and why it uses a portal

`HabitMenu.tsx` is a "⋯" trigger plus a popup. The popup is rendered into a
portal on `document.body` with `position: fixed`, and that is not a stylistic
choice — it is the only way the menu is reliably visible.

The 31-day rows live in `.history-scroll`, which scrolls sideways. A popup
rendered inside that scroller is its descendant, so the browser clips it to
the scroller's box, and `overflow-x: auto` clips vertically too. With a long
habit list the scroller grows far taller than the window, so a menu near the
bottom of the screen was cut off and its **Delete button could not be clicked
at all**. Flipping the menu upward does not fix that: the container is the
clipper, and the container is bigger than the viewport, so "is there room
below?" measured against it always says yes. Measuring against the window
instead is right, but pointless while the container is still allowed to clip.

Three things follow from the portal:

- **The position is written straight to the DOM node**, in a layout effect,
  rather than held in React state. The popup has to render before its width
  and height are known, and moving a box is a layout concern, not application
  state.
- **"Click outside" tests two nodes** — the trigger wrapper *and* the popup —
  because the popup is no longer a descendant of the wrapper.
- **The menu repositions on scroll and resize**, with `capture: true` on the
  scroll listener so it also fires for the inner horizontal scroller and not
  just the page. The trigger is sticky, so it moves relative to the window as
  the days scroll; a popup that does not move with it points at nothing.

The portal also retired two earlier bugs for free: the sticky
`.habit-row-label` used to trap the popup's `z-index` inside its own stacking
context (impossible from outside), and the `.habit-row:has(...)` z-index lift
is no longer needed at all.

### Positioning the trigger in the 31-day rows

- **`position: sticky; right: 1rem`, not just "last in the row".** 31 circles
  are far wider than a phone, so "last" alone would put the ⋯ off-screen
  until every day had been scrolled into view. The inset is the sticky offset
  rather than a `margin-right`, because sticky clamps the border box to the
  scrollport and not the margin box: at `right: 0` the trigger sat flush
  against the card edge while the emoji on the left was inset, and a
  `margin-right` did nothing at all.
- **The lane is `padding-right` on `.habit-row-days`, not on
  `.history-scroll`.** The row is `width: max-content`, so the scroll
  container's padding is ignored by the row's width and reserves nothing.
  Worse, putting it there moved the pin 3rem left, straight onto the circles,
  hiding today's dot. Padding on the days gives a real 2.5rem gap. Mid-scroll
  a couple of dots still pass behind the trigger — inherent to any
  always-visible pinned control in a scrolling row, like a frozen column.

`close()` is the only way the menu shuts, and it resets the delete-confirming
state. With that reset spread across the call sites, a habit could reopen
still asking "Delete for sure?".
