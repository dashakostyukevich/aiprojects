import { useState } from "react"
import type { PlanMode, Post, Status } from "../types"
import { addDays, startOfWeek, todayISO, weekLabel } from "../dates"
import WeekBoard from "./WeekBoard"
import StatusBoard from "./StatusBoard"

/*
  The Plan screen: one board, two ways of reading it.

    week    seven day columns, with undated posts underneath
    status  four columns, one per status

  Both boards show the same posts. Only the grouping differs, and only one
  thing about a post can change from each: the week board moves a date, the
  status board moves a status.

  The chosen mode and the week being shown live here rather than in App,
  because they are ways of looking at the board rather than data about it —
  like the list's filters, they reset when you leave.
*/

const modes: { mode: PlanMode; label: string }[] = [
  { mode: "week", label: "Week" },
  { mode: "status", label: "Status" },
]

export default function PlanBoard({
  posts,
  onSelect,
  onMoveDate,
  onMoveStatus,
}: {
  posts: Post[]
  onSelect: (post: Post) => void
  onMoveDate: (post: Post, date: string | null) => void
  onMoveStatus: (post: Post, status: Status) => void
}) {
  const [mode, setMode] = useState<PlanMode>("week")

  // The Monday of the week on screen. Starts at this week, from the clock.
  const [weekAnchor, setWeekAnchor] = useState(() => startOfWeek(todayISO()))

  function stepWeek(amount: number) {
    setWeekAnchor((current) => addDays(current, amount * 7))
  }

  return (
    <section className="flex flex-col gap-4">
      <div
        className="flex flex-wrap items-end justify-between gap-4
          sm:flex-row sm:items-center"
      >
        <div>
          <h2 className="font-display text-2xl tracking-tight">Plan</h2>
          <p className="mt-1 text-sm text-ink-soft">
            {mode === "week"
              ? "Drag a post to another day to change its date."
              : "Drag a post to another column to change its status."}
          </p>
        </div>

        {/* A segmented control rather than two links: these are two views of
            one board, not two pages. */}
        <div
          className="inline-flex shrink-0 rounded-full border border-line
            bg-card p-1"
        >
          {modes.map((entry) => (
            <button
              key={entry.mode}
              type="button"
              onClick={() => setMode(entry.mode)}
              aria-pressed={mode === entry.mode}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                mode === entry.mode
                  ? "bg-ink font-medium text-paper"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </div>

      {/* Week stepping belongs to the week board only — the status board
          always shows every status at once. */}
      {mode === "week" && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium tabular-nums">
            {weekLabel(weekAnchor)}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => stepWeek(-1)}
              aria-label="Previous week"
              className="rounded-full border border-line px-3 py-1.5 text-sm
                text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setWeekAnchor(startOfWeek(todayISO()))}
              className="rounded-full border border-line px-3 py-1.5 text-sm
                text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
            >
              This week
            </button>
            <button
              type="button"
              onClick={() => stepWeek(1)}
              aria-label="Next week"
              className="rounded-full border border-line px-3 py-1.5 text-sm
                text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
            >
              ›
            </button>
          </div>
        </div>
      )}

      {mode === "week" ? (
        <WeekBoard
          posts={posts}
          weekStart={weekAnchor}
          onMoveDate={onMoveDate}
          onSelect={onSelect}
        />
      ) : (
        <StatusBoard
          posts={posts}
          onMoveStatus={onMoveStatus}
          onSelect={onSelect}
        />
      )}
    </section>
  )
}
