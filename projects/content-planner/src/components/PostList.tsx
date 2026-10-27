import { useState } from "react"
import type { ListFilters, Pillar, Post } from "../types"
import { platformDots, quietChip, toReadableDate, typeStyles } from "../styles"
import StatusPill from "./StatusPill"
import FilterBar from "./FilterBar"

/** Nothing filtered — every post shows. */
const noFilters: ListFilters = {
  search: "",
  platform: "all",
  status: "all",
  type: "all",
}

/* One row of the content list. */
function PostRow({
  post,
  pillar,
  onEdit,
  onDelete,
  onShowInCalendar,
}: {
  post: Post
  /** The post's pillar name, when it has one that still exists. */
  pillar?: string
  onEdit: (post: Post) => void
  onDelete: (post: Post) => void
  onShowInCalendar: (post: Post) => void
}) {
  return (
    <li
      className="flex flex-col gap-3 px-5 py-4 transition-colors
        hover:bg-paper/60 sm:flex-row sm:items-center sm:gap-4"
    >
      {/* Platform, shown as a dot plus a name */}
      <div className="flex items-center gap-2 sm:w-40 sm:shrink-0">
        <span className={`h-2 w-2 rounded-full ${platformDots[post.platform]}`} />
        <span className="text-sm text-ink-soft">{post.platform}</span>
      </div>

      {/* Title gets the most room. The pillar rides at the end of it as a
          quiet label rather than a column of its own: it is a fact about the
          post, not something you scan for on the way down. */}
      <p className="min-w-0 flex-1 text-sm font-medium">
        <span className={`mr-2 ${typeStyles[post.type]}`}>{post.type}</span>
        {post.title}
        {pillar !== undefined && (
          <span
            className={`ml-2 whitespace-nowrap rounded-full px-2 py-0.5
              text-xs font-normal ${quietChip}`}
          >
            {pillar}
          </span>
        )}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
        {post.date === null ? (
          // Undated posts stay in this list and never reach the calendar.
          <span className="text-sm italic text-ink-faint">No date</span>
        ) : (
          <button
            type="button"
            onClick={() => onShowInCalendar(post)}
            title="Show this date in the calendar"
            className="text-sm tabular-nums text-ink-soft transition-colors
              hover:text-ink hover:underline"
          >
            {toReadableDate(post.date)}
          </button>
        )}

        <StatusPill status={post.status} />

        {/* Row actions. Quiet by default, stronger on hover. */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(post)}
            aria-label={`Edit ${post.title}`}
            className="rounded-full px-3 py-1 text-sm text-ink-soft
              transition-colors hover:bg-ink/5 hover:text-ink"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(post)}
            aria-label={`Delete ${post.title}`}
            className="rounded-full px-3 py-1 text-sm text-ink-faint
              transition-colors hover:bg-clay/10 hover:text-clay"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  )
}

/* Shown when the filters rule every post out. */
function EmptyState({ hasActiveFilters, onClear }: {
  hasActiveFilters: boolean
  onClear: () => void
}) {
  return (
    <div className="px-5 py-14 text-center">
      <p className="font-display text-xl">Nothing here</p>
      <p className="mx-auto mt-1 max-w-xs text-sm text-ink-soft">
        {hasActiveFilters
          ? "No posts match your search and filters. Try widening them."
          : "You have not written any posts yet."}
      </p>
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 rounded-full bg-ink px-5 py-2 text-sm font-medium
            text-paper transition-opacity hover:opacity-90"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}

/*
  The list of posts, plus the search and filters that decide which of them are
  shown.

  The filters are state held here rather than in App, because they only affect
  this list. App's `posts` is never modified — filtering produces a new array to
  render and leaves the original alone, which is why editing or deleting a
  filtered post still works and the filter survives.
*/
export default function PostList({
  posts,
  pillars,
  onEdit,
  onDelete,
  onShowInCalendar,
}: {
  posts: Post[]
  /** Used only to turn a post's `pillarId` into a name to show. */
  pillars: Pillar[]
  onEdit: (post: Post) => void
  onDelete: (post: Post) => void
  onShowInCalendar: (post: Post) => void
}) {
  const [filters, setFilters] = useState<ListFilters>(noFilters)

  // One lookup for the whole list, rather than a search through every pillar
  // for every row.
  const pillarNames = new Map(
    pillars.map((pillar) => [pillar.id, pillar.name]),
  )

  /**
   * Keeps a post only if it passes every active filter. Each check is
   * independent: a dropdown set to "all" matches everything, so the checks
   * combine without needing AND or OR logic.
   *
   * toLowerCase() on both sides makes the search ignore case.
   */
  function matches(post: Post): boolean {
    if (filters.platform !== "all" && post.platform !== filters.platform) {
      return false
    }
    if (filters.status !== "all" && post.status !== filters.status) return false
    if (filters.type !== "all" && post.type !== filters.type) return false

    const term = filters.search.trim().toLowerCase()
    if (term !== "" && !post.title.toLowerCase().includes(term)) return false

    return true
  }

  const visiblePosts = posts.filter(matches)

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.platform !== "all" ||
    filters.status !== "all" ||
    filters.type !== "all"

  function clearFilters() {
    setFilters(noFilters)
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-card">
      <div
        className="flex items-baseline justify-between gap-3 border-b
          border-line px-5 py-4"
      >
        <h2 className="font-display text-xl">All posts</h2>
        <span className="text-sm text-ink-faint">
          {hasActiveFilters
            ? `${visiblePosts.length} of ${posts.length}`
            : `${posts.length} posts`}
        </span>
      </div>

      <FilterBar
        search={filters.search}
        platform={filters.platform}
        status={filters.status}
        type={filters.type}
        hasActiveFilters={hasActiveFilters}
        onSearch={(search) => setFilters((c) => ({ ...c, search }))}
        onPlatform={(platform) => setFilters((c) => ({ ...c, platform }))}
        onStatus={(status) => setFilters((c) => ({ ...c, status }))}
        onType={(type) => setFilters((c) => ({ ...c, type }))}
        onClear={clearFilters}
      />

      {visiblePosts.length === 0 ? (
        <EmptyState hasActiveFilters={hasActiveFilters} onClear={clearFilters} />
      ) : (
        <ul className="divide-y divide-line border-t border-line">
          {visiblePosts.map((post) => (
            <PostRow
              key={post.id}
              post={post}
              // A pillar deleted by hand leaves an id with no name, which
              // simply means no chip — the post itself is untouched.
              pillar={
                post.pillarId === undefined
                  ? undefined
                  : pillarNames.get(post.pillarId)
              }
              onEdit={onEdit}
              onDelete={onDelete}
              onShowInCalendar={onShowInCalendar}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
