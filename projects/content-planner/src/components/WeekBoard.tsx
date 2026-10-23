import { useState } from "react"
import type { DragEvent } from "react"
import type { Post } from "../types"
import {
  WEEKDAY_SHORT,
  addDays,
  todayISO,
  toReadableDate,
} from "../dates"
import BoardCard from "./BoardCard"
import BoardColumn from "./BoardColumn"

/*
  The week board: seven day columns, Monday first, with the posts planned for
  each day underneath. Posts with no date have nowhere to go in the grid, so
  they collect in the Unscheduled strip below it — visible, and one drag away
  from a real day.

  Dragging a card onto a day changes that post's date. This is a mouse
  gesture; on a phone you tap a card and change the date in the dialog.

  Undated posts are also draggable, so the strip works both ways: drop a card
  in it to clear its date, drop it on a day to schedule it.
*/

/**
 * The strip's stand-in for a date. ISO dates are always "YYYY-MM-DD", so
 * nothing real can ever equal this.
 */
const NO_DATE = "no-date"

export default function WeekBoard({
  posts,
  weekStart,
  onMoveDate,
  onSelect,
}: {
  posts: Post[]
  /** The Monday being shown, as "2026-10-19". */
  weekStart: string
  onMoveDate: (post: Post, date: string | null) => void
  onSelect: (post: Post) => void
}) {
  const [dragId, setDragId] = useState<number | null>(null)
  // Which column the card is currently over, or null when it is over nothing.
  const [overKey, setOverKey] = useState<string | null>(null)

  const today = todayISO()
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))

  // Bucket the posts once, up front, so the columns below are just lookups.
  const byDate = new Map<string, Post[]>()
  const unscheduled: Post[] = []
  for (const post of posts) {
    if (post.date === null) {
      unscheduled.push(post)
      continue
    }
    const bucket = byDate.get(post.date)
    if (bucket) bucket.push(post)
    else byDate.set(post.date, [post])
  }

  /** Applies the drop: `key` is an ISO date, or NO_DATE to clear the date. */
  function dropOn(key: string) {
    if (dragId === null) return

    const post = posts.find((candidate) => candidate.id === dragId)
    setDragId(null)
    setOverKey(null)
    if (!post) return

    const newDate = key === NO_DATE ? null : key
    // Dropping a card back where it came from changes nothing, so don't.
    if (post.date === newDate) return

    onMoveDate(post, newDate)
  }

  /**
   * Marks a column as a target. The preventDefault is not optional — without
   * it the browser assumes you mean to open the file and refuses the drop.
   */
  function dragOver(key: string) {
    return (event: DragEvent) => {
      event.preventDefault()
      setOverKey(key)
    }
  }

  function dropHandler(key: string) {
    return (event: DragEvent) => {
      event.preventDefault()
      dropOn(key)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Seven columns do not fit on a phone, and the app must never require
          sideways scrolling. So below xl the board is a plain vertical list —
          one day per row, which is how a week is read on a phone anyway — and
          only from xl up does it become the familiar seven-column grid. */}
      <div className="overflow-x-auto pb-1">
        <div
          className="flex flex-col gap-3 xl:grid xl:min-w-[840px]
            xl:grid-cols-7"
        >
          {days.map((iso, index) => {
            const dayPosts = byDate.get(iso) ?? []

            return (
              <BoardColumn
                key={iso}
                title={WEEKDAY_SHORT[index]}
                hint={toReadableDate(iso)}
                isToday={iso === today}
                isDropTarget={overKey === iso}
                count={dayPosts.length}
                emptyLabel="Nothing planned"
                onDragOver={dragOver(iso)}
                onDrop={dropHandler(iso)}
              >
                {dayPosts.map((post) => (
                  <BoardCard
                    key={post.id}
                    post={post}
                    meta={post.status}
                    isDragging={dragId === post.id}
                    onSelect={() => onSelect(post)}
                    onDragStart={() => setDragId(post.id)}
                    onDragEnd={() => setDragId(null)}
                  />
                ))}
              </BoardColumn>
            )
          })}
        </div>
      </div>

      <BoardColumn
        title="Unscheduled"
        hint="No date yet"
        count={unscheduled.length}
        isDropTarget={overKey === NO_DATE}
        emptyLabel="Nothing waiting. Drag a card here to take its date off."
        // This strip spans the whole board, so its cards are spread across a
        // grid rather than stacked into one very long full-width column.
        bodyClassName="grid gap-2 sm:grid-cols-2 xl:grid-cols-3"
        onDragOver={dragOver(NO_DATE)}
        onDrop={dropHandler(NO_DATE)}
      >
        {unscheduled.map((post) => (
          <BoardCard
            key={post.id}
            post={post}
            meta={post.status}
            isDragging={dragId === post.id}
            onSelect={() => onSelect(post)}
            onDragStart={() => setDragId(post.id)}
            onDragEnd={() => setDragId(null)}
          />
        ))}
      </BoardColumn>
    </div>
  )
}
