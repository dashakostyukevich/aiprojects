import type { Post } from "../types"
import { WEEKDAY_SHORT, buildMonthGrid, monthLabel } from "../dates"
import { platformDots, statusBars } from "../styles"

/*
  The month view: one square per day, Monday first, with the posts that fall
  on that day inside it.

  `month` is { year, month } with a 0-based month, so March is 2. The
  navigation is passed in as callbacks so App stays the only place that
  decides which month is on screen.
*/
export default function Calendar({
  month,
  posts,
  onPrevious,
  onNext,
  onToday,
  onSelectPost,
}: {
  month: { year: number; month: number }
  posts: Post[]
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  onSelectPost: (post: Post) => void
}) {
  const days = buildMonthGrid(month.year, month.month)

  // Group the dated posts by ISO date once, instead of scanning the whole list
  // for each of the 35-42 squares.
  const postsByDate = new Map<string, Post[]>()
  for (const post of posts) {
    if (post.date === null) continue
    const existing = postsByDate.get(post.date)
    if (existing) existing.push(post)
    else postsByDate.set(post.date, [post])
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-card">
      <div
        className="flex flex-wrap items-center justify-between gap-3
          border-b border-line px-5 py-3"
      >
        <h2 className="font-display text-xl">
          {monthLabel(month.year, month.month)}
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevious}
            className="rounded-full border border-line px-4 py-1.5 text-sm
              text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={onToday}
            className="rounded-full border border-line px-4 py-1.5 text-sm
              text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
          >
            Today
          </button>
          <button
            type="button"
            onClick={onNext}
            className="rounded-full border border-line px-4 py-1.5 text-sm
              text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-line bg-paper/60">
        {WEEKDAY_SHORT.map((day) => (
          <div
            key={day}
            className="px-2 py-2 text-center text-xs font-medium text-ink-faint"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayPosts = postsByDate.get(day.iso) ?? []

          return (
            <div
              key={day.iso}
              className={`min-h-24 border-b border-r border-line p-1.5
                sm:min-h-28 ${day.inMonth ? "bg-card" : "bg-paper/40"}`}
            >
              <span
                className={`inline-grid h-6 w-6 place-items-center rounded-full
                  text-xs tabular-nums ${
                    day.isToday
                      ? "bg-ink font-medium text-paper"
                      : day.inMonth
                        ? "text-ink-soft"
                        : "text-ink-faint/50"
                  }`}
              >
                {day.day}
              </span>

              <div className="mt-1 flex flex-col gap-1">
                {dayPosts.map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => onSelectPost(post)}
                    title={`${post.title} — ${post.status}`}
                    className="flex w-full items-center gap-1 rounded-md
                      border border-line bg-paper px-1 py-1 text-left
                      transition-colors hover:bg-ink/5"
                  >
                    {/* The left edge carries the status, matching the pill in
                        the list; the dot carries the platform. */}
                    <span
                      className={`h-3.5 w-0.5 shrink-0 rounded-full ${statusBars[post.status]}`}
                    />
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${platformDots[post.platform]}`}
                    />
                    {/* A phone gives each day a seventh of the width, so the
                        title is hidden there and only the dots show. The full
                        title is always in the tooltip and in the list below. */}
                    <span className="hidden min-w-0 flex-1 truncate text-xs sm:block">
                      {post.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
