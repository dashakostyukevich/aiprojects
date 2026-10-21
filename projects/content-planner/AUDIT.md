# Competitor Audit — Workhorse

**Subject:** `app.workhorsehq.co` · workspace `daryas.diary` (planner `5040ac95…`) · audited 21 Oct 2026
**Our app:** `content-planner` — React 19 + TypeScript + Tailwind 4 + Vite, `localStorage`, 2 views, ~2,000 LOC

## Method

Signed in through the existing session and walked every surface: 5 nav views, the post editor, the settings tree, the paywall, and a 390 px viewport. Read the API schema straight off the wire (Supabase REST) and captured design tokens from the shipped font and asset paths. No state was mutated — reads only.

> **Note:** `/planner/5040ac95…/strategy` redirects to `/add-planner-category?plannerId=…`, which renders a blank page. The real Strategy view is only reachable by clicking the sidebar. A dead-end route on a page intended to be shared publicly.

## 1. What Workhorse is

| Layer | Finding |
| --- | --- |
| Client | **Expo / React Native Web** (`_expo/static/js/web/entry-*.js`) — one codebase for web + iOS + Android. The phone app is a separate native build, not responsive web. |
| Backend | **Supabase** — Postgres + RLS + Auth, ~20 tables. |
| Payments | **RevenueCat** (native IAP) + web billing. |
| Analytics | **PostHog** — analytics *and* feature flags. |
| Fonts | `TimesNewRomanMTStd-Cond` (display), `SymphonyPro-Regular` (body), `FHOscar-Medium` |
| Onboarding | 3-step coachmark tour with hosted video assets |

The RN-Web choice is the most consequential fact: one codebase has to serve a 1,700 px desktop grid *and* a 390 px phone, and it visibly fails at the latter.

## 2. Information architecture

```
Today ──── daily cockpit: today's post in a 6-stage pipeline, Stories, Tasks,
           weekly Plan, "Your day" calendar timeline
Plan ───── Content Planner, Date View ⇄ Status View, week picker, AI idea strip
Grid ───── Instagram 3×3 feed preview
Ideas ──── library: All / Post Ideas / Hooks / Captions / Inspo / Workhorse
Strategy ─ planner identity, Content Pillars, AI pillar suggestions,
           7-day Batching Schedule
```

Persisted everywhere: sidebar, mini month-grid with per-pillar colour dots, account chip.

## 3. The conceptual model — this is the real product

**Status pipeline, 6 stages not 4:**
`Needs Idea → Needs Script → Needs Filming → Needs Edit → Final Prep → Posted`

**Batching phases, 6:**
`Planning & Ideation · Scripting · Filming · Editing · Final Prep & Publishing · Analytics & Performance Review`

**Content pillars** carry emoji + name + colour + `bucket` (`emotional` / `value` / `lifestyle` / `ritual`) + description + `recurring_days` + `is_anchor`. Pillar recurrence drives what auto-populates which weekday.

**A post is not a row.** It is: pillar + date + content type (16 types × 7 platforms, each with `format` = video / carousel / photo / writing and `max_slides`) + status + cover image + hook + script/shot list + caption + carousel slides + cross-post group + story schedules. Multiple posts per day (`Post 1.`, `Post 2.`, `+`).

**Platforms carry capability flags** — `supports_stories`, `supports_reels`, `supports_posts`, `supports_carousel_cover`. Content types are gated per platform because of this.

**Key insight:** Workhorse is not a calendar with posts in it. It is a *production pipeline* — idea → script → film → edit → prep → published — with the calendar as a scheduling surface on top. The calendar is the least important part of the product.

## 4. AI and monetization

| | |
| --- | --- |
| AI surfaces | Pillar suggestions (anchor text + supporting pillars), weekly post ideas (7/day), hooks, captions, "Try another idea", "Back to original", "Add all 7" |
| Credits | 100/mo on Basic. Radial gauge — **87 of 100 left**, "Resets on October 25". Spent on pillar ideas, weekly post ideas, hooks, captions. |
| Pricing | Basic **$9.99**/mo (2 workspaces, 100 credits) · Pro **$14.99**/mo (5, 250) · Premium **$19.99**/mo (unlimited, 600). Yearly toggle. |
| Settings | Account · Planner Settings · Billing · Support & Feedback · Privacy & Data (export/analytics/delete) · **Affiliate program** |

## 5. Design system — we are already at parity

| | Workhorse | Ours |
| --- | --- | --- |
| Ground | warm cream | `#faf7f2` paper / `#fffdf9` card |
| Display type | high-contrast serif | `Iowan Old Style` / `Palatino` serif — same move |
| Body | grotesque | `system-ui` |
| Accent | dusty rose `#E97997` + sage green | sage / honey / clay / stone |
| Forms | pill buttons, hairline borders, pill chips | pill buttons, hairline borders, pill chips |
| Motion | coachmarks, staggered entrances | minimal |

Our visual language is not the gap. Our product model is.

## 6. Gap analysis

| Capability | Workhorse | Ours | Weight |
| --- | --- | --- | --- |
| Responsive web | broken at 390 px | ✅ verified, no overflow | **our edge** |
| Login / account | required | none | neutral |
| Title search | — | ✅ | **our edge** |
| Timezone-safe dates | ✅ | ✅ | tie |
| Code clarity / docs | — | ✅ | **our edge** |
| Status pipeline | 6 stages, production-shaped | 4 generic | 🔴 big gap |
| Content pillars + strategy | ✅ full layer | ❌ nothing | 🔴 biggest gap |
| Batching schedule / workflow | ✅ 7-day | ❌ | 🔴 |
| AI generation | ✅ 4 surfaces + credits | ❌ | 🔴 |
| Stories | ✅ planner + types | ❌ | 🟠 |
| Hooks / captions / insp library | ✅ | ❌ (notes only) | 🟠 |
| IG grid preview | ✅ | ❌ | 🟡 |
| Calendar timeline + tasks | ✅ | ❌ | 🟡 |
| Multi-platform per post | ✅ | ❌ single platform | 🟠 |
| Media / cover photos / slides | ✅ | ❌ | 🟠 |
| Multi-workspace / clients | ✅ (2–∞) | ❌ | 🟡 |
| Sync across devices | ✅ Supabase | ❌ localStorage only | 🔴 real ceiling |
| Export / backup | ✅ Privacy & Data | ❌ | 🟠 |
| Monetization | ✅ $10–20/mo | ❌ | 🟡 |
| Drag-and-drop | ❌ (dropdowns only) | ❌ | tie |
| Bulk actions | only "Add all 7" | ❌ | tie |
| Command palette / shortcuts | ❌ | ❌ | tie |

## 7. Where Workhorse is weak — exploitable

1. **Their web app does not do mobile.** At 390 px the sidebar consumes ~55% of the viewport and content overflows into illegible slivers. They solve it with a native app, which leaves **responsive web-first as an open lane** — and we already have `md:` breakpoints working.
2. **The `/strategy` route is broken.** The page they'd link from marketing lands on a blank `add-planner-category` screen.
3. **Stacked coachmark dialogs** fire on first load and overlap the dashboard.
4. **Empty states are hollow.** Grid shows "Your posts need images" inside a huge empty rectangle; Ideas is a blank page with one card.
5. **No search anywhere in Plan.** We would ship search first.
6. **Dropdown-only interaction** — no drag-and-drop, no multi-select, no bulk edit, no keyboard shortcuts.
7. **Free-text pillar names with emoji prefixes** fight the serif typography (`✈️ Postcards in Progress`).

## 8. What we should not copy

- A mega-modal editor with 12 dropdowns.
- Native apps.
- An affiliate program.
- Dashboard-of-cards.

Our current calm, editor-like aesthetic is a genuine differentiator. Do not trade it for a feature race we cannot win with 2,000 LOC.
