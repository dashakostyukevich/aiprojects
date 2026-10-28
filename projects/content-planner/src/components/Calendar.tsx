import type { Post } from "../types"
import { WEEKDAY_SHORT, buildMonthGrid, monthLabel } from "../dates"
import { statusBars } from "../styles"

/*
  The month view: one square per day, Monday first, with the posts that fall
  on that day inside it.

  `month` is { year, month } with a 0-based month, so March is 2. The
  navigation is passed in as callbacks so App stays the only place that
  decides which month is on screen.

  Two colours, and both mean something: today's number sits in an orange tile,
  and each post's left edge carries its status, matching the pill in the list.
  The platform used to get a dot of its own; it is gone, because a day cell
  with three colours in it stops saying anything at a glance.
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
        className="flex flex-col gap-3 border-b border-line px-5 py-4
          lg:flex-row lg:items-center lg:justify-between"
      >
        <h2 className="text-xl text-ink">
          {monthLabel(month.year, month.month)}
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevious}
            className="rounded-xl border border-line px-3.5 py-2 text-sm
              text-ink-soft transition-colors hover:bg-subtle hover:text-ink"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={onToday}
            className="rounded-xl border border-line px-3.5 py-2 text-sm
              text-ink-soft transition-colors hover:bg-subtle hover:text-ink"
          >
            Today
          </button>
          <button
            type="button"
            onClick={onNext}
            className="rounded-xl border border-line px-3.5 py-2 text-sm
              text-ink-soft transition-colors hover:bg-subtle hover:text-ink"
          >
            Next →
          </button>
        </div>
      </div>

      {/* The weekday row is the design system's table header: a subtle strip
          with the labels, not another row of cards. */}
      <div className="grid grid-cols-7 border-b border-line bg-subtle">
        {WEEKDAY_SHORT.map((day) => (
          <div
            key={day}
            className="px-2 py-2 text-center text-xs font-medium text-ink-soft"
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
                sm:min-h-28 ${day.inMonth ? "bg-card" : "bg-subtle"}`}
            >
              <span
                className={`inline-grid h-7 w-7 place-items-center rounded-lg
                  text-xs tabular-nums ${
                    day.isToday
                      ? "bg-orange font-medium text-ink"
                      : day.inMonth
                        ? "text-ink-soft"
                        : "text-ink-faint"
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
                    className="flex w-full items-center gap-1 rounded-lg px-1 py-1
                      text-left transition-colors sm:bg-subtle
                      sm:hover:bg-primary-tint"
                  >
                    {/* On a phone the chip is a bar across the day: there is
                        no room for a title, but "there is a post here, at this
                        stage" is the whole point of the cell. From sm up it
                        becomes the left edge of a real chip. The full title is
                        always in the tooltip and in the list below. */}
                    <span
                      className={`h-1.5 w-full shrink-0 rounded-full
                        sm:h-3.5 sm:w-0.5 ${statusBars[post.status]}`}
                    />
                    <span className="hidden min-w-0 flex-1 truncate text-xs text-ink-soft sm:block">
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
