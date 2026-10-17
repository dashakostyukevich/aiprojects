import type { Post } from "../types"
import { weekDates, weekDays } from "../data"
import { platformDots, typeStyles } from "../styles"

/*
  A week at a glance: seven columns, Monday first.

  On a phone the columns are narrower than the screen, so the row scrolls
  sideways rather than squashing everything into unreadable slivers.

  Like the list, this takes posts as a prop so a newly saved post shows up in
  the right column straight away.
*/
export default function WeeklySchedule({ posts }: { posts: Post[] }) {
  return (
    <section className="rounded-2xl border border-line bg-card">
      <div
        className="flex items-baseline justify-between border-b
          border-line px-5 py-4"
      >
        <h2 className="font-display text-xl">This week</h2>
        <span className="text-sm text-ink-faint">17 – 23 March</span>
      </div>

      <div className="overflow-x-auto">
        <div className="grid min-w-[42rem] grid-cols-7 divide-x divide-line">
          {weekDays.map((day, dayIndex) => {
            // The posts that belong on this day of the week.
            const dayPosts = posts.filter((post) => post.day === dayIndex)

            return (
              <div key={day} className="flex flex-col gap-2 p-3">
                <div>
                  <p className="text-xs text-ink-faint">{day.slice(0, 3)}</p>
                  <p className="font-display text-lg leading-tight">
                    {weekDates[dayIndex]}
                  </p>
                </div>

                {dayPosts.length === 0 && (
                  <p className="pt-1 text-xs text-ink-faint/70">—</p>
                )}

                {dayPosts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-lg border border-line bg-paper p-2"
                  >
                    <span
                      className={`mb-1 block h-1.5 w-1.5 rounded-full ${platformDots[post.platform]}`}
                    />
                    <p className={`text-[0.7rem] ${typeStyles[post.type]}`}>
                      {post.type}
                    </p>
                    <p className="mt-0.5 line-clamp-3 text-xs leading-snug">
                      {post.title}
                    </p>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
