import { useState } from "react"
import type { ListFilters, Pillar, Post } from "../types"
import {
  deleteButton,
  quietButton,
  quietChip,
  secondaryButton,
  toReadableDate,
} from "../styles"
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
        hover:bg-subtle/60 sm:flex-row sm:items-center sm:gap-4"
    >
      {/* Platform, as plain secondary text. Colour in this app is the status
          pill's job, so a platform dot beside it would compete for the same
          attention. */}
      <div className="sm:w-40 sm:shrink-0">
        <span className="text-sm text-ink-soft">{post.platform}</span>
      </div>

      {/* Title gets the most room. The pillar rides at the end of it as a
          quiet label rather than a column of its own: it is a fact about the
          post, not something you scan for on the way down. */}
      <p className="min-w-0 flex-1 text-base">
        <span className="mr-2 text-xs text-ink-faint">{post.type}</span>
        <span className="font-medium">{post.title}</span>
        {pillar !== undefined && (
          <span
            className={`ml-2 whitespace-nowrap rounded-full px-2 py-0.5
              align-middle text-xs ${quietChip}`}
          >
            {pillar}
          </span>
        )}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
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
            className={quietButton}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(post)}
            aria-label={`Delete ${post.title}`}
            className={deleteButton}
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
    <div className="px-5 py-16 text-center">
      <p className="text-xl text-ink">Nothing here</p>
      <p className="mx-auto mt-1 max-w-xs text-sm text-ink-soft">
        {hasActiveFilters
          ? "No posts match your search and filters. Try widening them."
          : "You have not written any posts yet."}
      </p>
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className={`${secondaryButton} mt-5`}
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
          border-line px-5 py-5"
      >
        <h2 className="text-xl text-ink">All posts</h2>
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
        // Dotted separators, the design system's treatment for rows inside a
        // list. A solid line is kept for the edge of a region, not between
        // items in it.
        <ul className="divide-y divide-dotted divide-line-soft border-t border-line">
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
