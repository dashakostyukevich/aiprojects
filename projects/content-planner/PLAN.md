# Repositioning Plan — mobile-first, opinionated planner

Companion to [`AUDIT.md`](./AUDIT.md), which is the competitive teardown this plan answers.

## Positioning

Workhorse owns **"AI + strategy + production pipeline"**. We are not going to out-build them there.

We own **"a planner that is genuinely good on a phone, and doesn't make you configure anything."**

Three commitments:

1. **Mobile-first, not mobile-tolerant.** The primary surface is a phone. Desktop is the enlarged view, never the other way round.
2. **Opinionated defaults.** A new user lands on a working plan, not an empty form. No setup wizard, no workspace creation, no pillar setup ritual.
3. **Calm, editorial, fast.** Cream, serif, generous space, few decisions per screen. One tap to create a post, one to move it along.

Concretely, this means we ship **less** than Workhorse, deliberately: no AI, no billing, no workspaces, no native app. We ship the concept *right* instead of the feature list *wide*.

## Phase 1 — Reshape the model (no new screens yet)

Everything else depends on this. Workhorse's depth comes from its data model, not its UI.

### 1.1 Status becomes a production pipeline — ✅ done

Replace the four generic statuses with six that describe *where the work is*.

**Shipped as** `STATUSES` in `src/types.ts`, in the order a post moves through
them:

```ts
export type Status =
  | "Draft"        // loose notes
  | "Scripting"    // writing the words
  | "Filming"      // on camera
  | "Editing"      // in post-production
  | "Scheduled"    // has a date
  | "Published"    // live
```

Two departures from the proposal below. The `needs_*` names lost to plain
English, which reads better in a column header. And `Scheduled` stayed a stage
rather than becoming a `scheduled: boolean` — it is where a post goes when it
has a day, and the date itself is already its own field.

`needs_idea` was dropped outright rather than renamed: an idea is simply a post
at the first stage, which is what the Ideas page shows. Retiring a status means
`storage.ts` has to upgrade saved posts on load, or every post still carrying
the old value would be rejected as malformed data and lost.

**Why it still matters:** a planner for creators is really a production
tracker. Four generic statuses cannot answer "what do I film next?" — six
pipeline stages can, and that question is the daily driver.

### 1.2 Add content pillars

```ts
export interface Pillar {
  id: number
  name: string          // "Postcards in Progress"
  emoji: string         // "✈️" — separate field, never part of the name
  color: string         // hex, chosen from our muted palette
  bucket: "emotional" | "value" | "lifestyle" | "ritual"
  description: string
  recurringDays: number[]  // 0–6, which weekdays this pillar recurs on
}
```

`emoji` as its own field is a deliberate correction to Workhorse's bug — emoji baked into the name fights the serif type.

Pillar colour becomes the primary visual signal, which is what makes the mini-calendar dots and a future grid preview possible.

### 1.3 A post carries more than one platform

```ts
export interface Post {
  id: number
  title: string
  pillarId: number
  platforms: Platform[]      // was: platform: Platform
  type: ContentType
  date: string | null
  scheduled: boolean
  status: Status
  notes?: string
}
```

`platforms` as an array is the change that unlocks crossposting and the grid view later, without a second migration.

### 1.4 Migration

Existing `localStorage` data is `content-planner:posts` with the old shape. `storage.ts` must:

- keep validating and dropping malformed posts (the existing behaviour is correct — keep it),
- add a `migrate()` step that maps old statuses and old `platform` → `platforms: [platform]`,
- fall back to the example posts if migration yields nothing.

Rule: **migration must never throw and never lose data silently.** If a post can't be migrated, keep it with a `needs_idea` status rather than dropping it.

### 1.5 Files touched in Phase 1

| File | Change |
| --- | --- |
| `src/types.ts` | new `Status`, `Pillar`, updated `Post`, `ListFilters` |
| `src/storage.ts` | `migrate()` + pillar storage under `content-planner:pillars` |
| `src/styles.ts` | status styles remapped to the six stages; pillar colour lookup |
| `src/data.ts` | example posts migrated; 3–4 example pillars with real recurring days |
| `src/index.css` | add pillar accent colours alongside the existing four |
| `src/components/SummaryCards.tsx` | count by pipeline stage |
| `src/components/StatusPill.tsx` | new labels |
| `src/components/PostEditor.tsx` | pillar select, multi-platform, scheduled toggle |
| `src/components/FilterBar.tsx` | filter by pillar as well as platform/status/type |
| `src/components/PostList.tsx` | pillar dot on each row |

## Phase 2 — The surfaces that make pillars worth having

### 2.1 Strategy view (mobile-first)

A third view, not a fifth. Content:

- the pillars as a vertical stack of cards (not Workhorse's horizontal carousel — carousels hide items and are hostile on phones),
- each pillar's colour, bucket chip, description, recurring days,
- per-pillar "next scheduled post" and a count of posts in flight.

**Opinionated default:** seed 3 example pillars on first run so the Strategy view is never empty, exactly like the existing example posts.

### 2.2 Today view (mobile-first)

Replace the static summary cards with the answer to "what do I do right now?":

- today's posts grouped by pipeline stage, in stage order — the one screen that makes the pipeline model visible,
- a "this week at a glance" strip,
- the month calendar becomes collapsible; on a phone it should not eat the first screen.

### 2.3 Mobile calendar treatment

The month grid currently fits 390 px but post chips collapse to a bare colour bar and a dot. Fix by:

- rendering **dots only** inside cells (no title) at phone width, with the title in the day detail sheet,
- making a day cell a tap target that opens a bottom sheet listing that day's posts — a bottom sheet, not a modal, because modals on phones are hostile.

## Phase 3 — Polish that compounds the position

- Bulk actions: multi-select with a long-press or checkbox affordance, then status/date/pillar change in one go.
- Drag a post along the pipeline from the Today view. This is the interaction Workhorse has no equivalent for, and it is the heart of the model.
- Command palette on desktop; a swipe gesture on mobile.
- Export / import JSON. `localStorage` without an export is a data-loss risk, and it is a trust gap versus Workhorse's Privacy & Data page.
- Keyboard shortcuts: `n` new post, `j`/`k` move selection, `1`–`6` set stage.

## Phase 4 — Only if the above lands

- **Backend** for sync, multi-device and real backup. This is the current ceiling, but it is a large commitment and should not precede a correct model.
- **A small, honest AI feature** — one surface only, e.g. "suggest a hook for this post", if and only if it can be genuinely good. A credit-metered AI clone of Workhorse is not the play.
- Native app. Only after the web app is genuinely excellent on a phone.

## Non-goals

Explicitly out of scope, so we stop re-litigating them:

- Matching Workhorse's feature count.
- AI generation of posts, pillars or schedules.
- Billing, workspaces, client management.
- Instagram grid preview (needs media; Phase 4 at the earliest).
- Stories, hooks and captions as separate libraries.

## Success criteria for Phase 1

- `npm run build` passes, `npm run lint` clean.
- Existing saved posts survive the migration with their titles and dates intact.
- The post list filters by pillar and by stage.
- At 390 px there is no horizontal overflow and the primary action is reachable without scrolling.
