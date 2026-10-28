import { PILLAR_TYPES } from "../types"
import type { Pillar, PillarType, Post } from "../types"
import { PILLAR_GUIDE } from "../pillarTypes"
import {
  deleteButton,
  quietButton,
  quietChip,
  secondaryButton,
} from "../styles"

/*
  The Pillars page is the strategy page. The other three pages answer "what am I
  making, when, and from what"; this one answers "what is all of it for".

  Three parts, in the order a strategy actually gets built:

    1. Your mix — what the set adds up to once it is laid out by type, and a
       few honest observations about the shape it makes
    2. Your pillars — the themes themselves, editable
    3. The nine types — the vocabulary, with what each one is for and how it
       usually goes wrong

  The reference section is shown even when there are no pillars yet, which is
  the same decision the Ideas page makes with its tag chips: you should be able
  to read the vocabulary before you are asked to use it. The zeroes beside each
  type are part of the point — a type nobody has taken is a visible gap.

  Nothing here is saved by this page. It reads App's `pillars` and `posts` and
  reports clicks back up, like every other page.
*/

/** Whether any pillar has taken this type. */
function hasType(pillars: Pillar[], type: PillarType): boolean {
  return pillars.some((pillar) => pillar.type === type)
}

/**
 * The strategy read: a few honest observations about the set that was built.
 *
 * Rule-based on purpose. There is no AI behind this page, and pretending
 * otherwise would be worse than saying nothing — so every note here can be
 * checked against the numbers next to it, and every one says what to do about
 * it.
 *
 * Capped at three. A page that lists nine problems reads as a scolding, and the
 * fourth point is never the one that changes anything.
 */
function assess(
  pillars: Pillar[],
  posts: Post[],
  typesUsed: number,
): string[] {
  const notes: string[] = []

  const unplaced = posts.filter((post) => post.pillarId === undefined).length
  const undescribed = pillars.filter(
    (pillar) => pillar.description === undefined,
  ).length

  // Which pillars share a type. Grouped by type, then only the groups with
  // more than one name in them are interesting — two pillars doing the same
  // job look like variety on the page and are not.
  const byType: Record<string, string[]> = {}
  for (const pillar of pillars) {
    byType[pillar.type] = [...(byType[pillar.type] ?? []), pillar.name]
  }
  const shared = Object.keys(byType).filter((type) => byType[type].length > 1)

  if (posts.length > 0 && unplaced === posts.length) {
    notes.push(
      "No post is filed under a pillar yet, so this is a plan rather than a " +
        "practice. Open any post and pick its pillar in the header.",
    )
  }

  if (undescribed > 0) {
    notes.push(
      (undescribed === 1
        ? "One pillar has"
        : `${undescribed} pillars have`) +
        " no description. The name is what it is called; the description is " +
        "what tells you which ideas belong in it and which do not.",
    )
  }

  if (shared.length > 0 && pillars.length >= 2) {
    notes.push(
      `More than one pillar is ${shared.join(" and ")}. Pillars that share a ` +
        "type compete for the same posts — give one a different job, or merge " +
        "them.",
    )
  }

  if (
    pillars.length >= 3 &&
    !hasType(pillars, "Promotional") &&
    !hasType(pillars, "Social proof")
  ) {
    notes.push(
      "Nothing here is Promotional or Social proof: every pillar gives, none " +
        "asks. One honest post about what you do, and one showing it working " +
        "for somebody, is usually enough to close the gap.",
    )
  }

  if (typesUsed === 1 && pillars.length > 1) {
    notes.push(
      `Every pillar is ${pillars[0].type}. The nine types exist because a ` +
        "feed needs more than one purpose — one type alone goes flat however " +
        "good the posts are.",
    )
  }

  if (pillars.length === 1) {
    notes.push(
      "One pillar is a theme, not a mix. Three or four, each a different " +
        "type, is where a strategy starts to be visible.",
    )
  }

  return notes.slice(0, 3)
}

/*
  What the set adds up to. One row per type, always all nine, so the empty ones
  are as visible as the full ones.

  The bar measures posts, not pillars: the question this card answers is what
  the account is actually making, and a type can be well planned and never
  posted in. The reference section further down shows where the pillars sit.
*/
function Mix({ pillars, posts }: { pillars: Pillar[]; posts: Post[] }) {
  const rows = PILLAR_TYPES.map((type) => {
    const ids = pillars
      .filter((pillar) => pillar.type === type)
      .map((pillar) => pillar.id)

    return {
      type,
      pillars: ids.length,
      posts: posts.filter(
        (post) => post.pillarId !== undefined && ids.includes(post.pillarId),
      ).length,
    }
  })

  const placed = rows.reduce((total, row) => total + row.posts, 0)
  const typesUsed = rows.filter((row) => row.pillars > 0).length
  const notes = assess(pillars, posts, typesUsed)

  // The tallest bar fills the track. `Math.max(1, …)` keeps the divisor away
  // from zero when nothing has been filed yet, which would make every width
  // NaN and every bar look broken.
  const peak = Math.max(1, ...rows.map((row) => row.posts))

  const filed =
    posts.length === 0
      ? null
      : placed === posts.length
        ? `all ${posts.length} posts filed`
        : `${placed} of ${posts.length} posts filed`

  return (
    <div className="rounded-2xl border border-line bg-card px-5 py-5 sm:px-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-xl text-ink">Your mix</h3>
        <p className="text-xs text-ink-faint">
          {pillars.length} {pillars.length === 1 ? "pillar" : "pillars"} across{" "}
          {typesUsed} of {PILLAR_TYPES.length} types
          {filed !== null && ` · ${filed}`}
        </p>
      </div>

      <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
        {rows.map((row) => (
          <li key={row.type} className="flex items-center gap-3">
            <span
              className={`w-28 shrink-0 text-sm ${
                row.pillars === 0 ? "text-ink-faint" : "text-ink"
              }`}
            >
              {row.type}
            </span>

            {/* The track is always drawn, so "planned but never posted"
                looks like an empty bar rather than a missing row. */}
            <span className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-subtle">
              <span
                className="block h-full rounded-full bg-ink-soft"
                style={{ width: `${(row.posts / peak) * 100}%` }}
              />
            </span>

            <span className="w-8 shrink-0 text-right text-xs tabular-nums text-ink-faint">
              {row.posts === 0 ? "—" : row.posts}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-xs text-ink-faint">
        The bar is how many posts each type has. Where your pillars sit is in
        the type list further down.
      </p>

      {notes.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2.5 border-t border-line pt-4">
          {notes.map((note) => (
            <li
              key={note}
              className="flex gap-2.5 text-sm leading-relaxed text-ink-soft"
            >
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange"
              />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* One theme, as a card. */
function PillarCard({
  pillar,
  postCount,
  onEdit,
  onDelete,
}: {
  pillar: Pillar
  postCount: number
  onEdit: (pillar: Pillar) => void
  onDelete: (pillar: Pillar) => void
}) {
  return (
    <li className="flex flex-col gap-2 rounded-2xl border border-line bg-card px-5 py-5 sm:px-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-lg font-medium text-ink">{pillar.name}</h3>
        <span className={`rounded-full px-3 py-1 text-xs ${quietChip}`}>
          {pillar.type}
        </span>
      </div>

      {pillar.description === undefined ? (
        <p className="text-sm italic text-ink-faint">No description yet</p>
      ) : (
        <p className="text-sm leading-relaxed text-ink-soft">
          {pillar.description}
        </p>
      )}

      {/* `mt-auto` keeps the counts and buttons on one line across cards whose
          descriptions are different lengths. */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
        <span className="text-xs text-ink-faint">
          {postCount === 0
            ? "No posts yet"
            : `${postCount} ${postCount === 1 ? "post" : "posts"}`}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(pillar)}
            aria-label={`Edit ${pillar.name}`}
            className={quietButton}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(pillar)}
            aria-label={`Delete ${pillar.name}`}
            className={deleteButton}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  )
}

/*
  The vocabulary. Always on show, including before anything has been created.

  Each type carries three things: what it is for, the specific move that makes
  one land, and the failure it usually ends in. The last two are the opinionated
  part of this page — the reason it is worth reading rather than just a dropdown
  with nine options.
*/
function Reference({ pillars }: { pillars: Pillar[] }) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h3 className="text-xl text-ink">The nine types</h3>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-soft">
          A type describes what a post does for the reader, not what it is
          about. Two pillars can share a subject and still do completely
          different jobs — which is why four pillars and one type would be
          narrower than four pillars and four.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {PILLAR_TYPES.map((type) => {
          const count = pillars.filter((pillar) => pillar.type === type).length
          const guide = PILLAR_GUIDE[type]

          return (
            <li
              key={type}
              className="flex flex-col gap-2 rounded-2xl border border-line
                bg-card px-5 py-5 sm:px-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h4 className="text-lg font-medium text-ink">{type}</h4>
                <span className="text-xs text-ink-faint">
                  {count === 0
                    ? "Not used"
                    : `${count} ${count === 1 ? "pillar" : "pillars"}`}
                </span>
              </div>

              <p className="text-sm leading-relaxed text-ink-soft">
                {guide.summary}
              </p>

              <p className="text-sm leading-relaxed text-ink">
                <span className="text-ink-faint">Make it land — </span>
                {guide.makeItLand}
              </p>

              <p className="text-sm leading-relaxed text-ink-soft">
                <span className="text-danger">Usually goes wrong — </span>
                {guide.watchOut}
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default function Pillars({
  pillars,
  posts,
  onNew,
  onEdit,
  onDelete,
}: {
  pillars: Pillar[]
  /** Used only to count how much of the output each type actually carries. */
  posts: Post[]
  onNew: () => void
  onEdit: (pillar: Pillar) => void
  onDelete: (pillar: Pillar) => void
}) {
  return (
    <section className="flex flex-col gap-5">
      <div
        className="flex flex-col gap-4 sm:flex-row sm:items-end
          sm:justify-between"
      >
        <div>
          <h2 className="text-2xl text-ink">Content pillars</h2>
          <p className="mt-1 text-sm text-ink-soft">
            The themes you post under, and what each one is for.
          </p>
        </div>

        {/* Hidden when the empty state below is showing, because that already
            offers the same button. */}
        {pillars.length > 0 && (
          <button
            type="button"
            onClick={onNew}
            className={`${secondaryButton} shrink-0`}
          >
            + New pillar
          </button>
        )}
      </div>

      {pillars.length === 0 ? (
        <div className="rounded-2xl border border-line bg-card px-5 py-16 text-center">
          <p className="text-xl text-ink">No pillars yet</p>
          <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-ink-soft">
            A pillar is a theme you keep coming back to — not one post, not a
            platform, not a content type. Name three or four, give each a type,
            and then every post can be filed under the one it belongs to.
          </p>
          <button
            type="button"
            onClick={onNew}
            className={`${secondaryButton} mt-5`}
          >
            + New pillar
          </button>
        </div>
      ) : (
        <>
          <Mix pillars={pillars} posts={posts} />

          <ul className="grid gap-3 sm:grid-cols-2">
            {pillars.map((pillar) => (
              <PillarCard
                key={pillar.id}
                pillar={pillar}
                postCount={
                  posts.filter((post) => post.pillarId === pillar.id).length
                }
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </ul>
        </>
      )}

      <Reference pillars={pillars} />
    </section>
  )
}
