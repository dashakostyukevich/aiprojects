import type { ReactNode } from "react"

/*
  One column of a board: a titled stack of cards that also accepts drops.

  Both boards are made of these — seven of them for the days of the week, four
  for the statuses — so the drop plumbing and the empty state are written once
  here rather than twice.

  The whole column is the drop target, header included. Dragging over a child
  element would otherwise fire dragleave and make the highlight flicker, so
  `isDropTarget` is driven from dragover alone and cleared on drop or dragend.
*/
export default function BoardColumn({
  title,
  hint,
  count,
  isToday,
  isDropTarget,
  emptyLabel,
  bodyClassName = "flex flex-col gap-2",
  onDragOver,
  onDrop,
  children,
}: {
  title: string
  /** A small grey line under the title, e.g. the date. */
  hint?: string
  count: number
  /** True for today's column on the week board. */
  isToday?: boolean
  isDropTarget: boolean
  /** Shown when nothing is in this column. */
  emptyLabel: string
  /**
   * How the cards inside are laid out. Day and status columns stack them, but
   * the Unscheduled strip is full width, so it spreads them across a grid
   * instead of one card per row stretching the whole page.
   */
  bodyClassName?: string
  onDragOver: (event: React.DragEvent) => void
  onDrop: (event: React.DragEvent) => void
  children: ReactNode
}) {
  return (
    <section
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`flex min-w-0 flex-col rounded-2xl border transition-colors ${
        isDropTarget ? "border-ink bg-ink/5" : "border-line bg-card/60"
      }`}
    >
      <header
        className={`flex items-baseline justify-between gap-2 border-b px-3
          py-2.5 ${isDropTarget ? "border-ink/20" : "border-line"} ${
          isToday ? "bg-honey/10" : ""
        }`}
      >
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium">{title}</h3>
          {hint && <p className="truncate text-xs text-ink-faint">{hint}</p>}
        </div>
        <span className="shrink-0 text-xs tabular-nums text-ink-faint">
          {count}
        </span>
      </header>

      <div className={`flex-1 p-2.5 ${bodyClassName}`}>
        {count === 0 ? (
          <p
            className="px-1 py-3 text-center text-xs leading-relaxed
              text-ink-faint"
          >
            {emptyLabel}
          </p>
        ) : (
          children
        )}
      </div>
    </section>
  )
}
