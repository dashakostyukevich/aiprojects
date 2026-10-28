import { useState } from "react"
import type { DragEvent } from "react"
import type { Post, Status } from "../types"
import { STATUSES } from "../types"
import { toReadableDate } from "../dates"
import { statusBars } from "../styles"
import BoardCard from "./BoardCard"
import BoardColumn from "./BoardColumn"

/*
  The status board: one column per status, running left to right from an
  untouched draft through to published. Dragging a card into another column
  changes that post's status and nothing else — the date, the written sections
  and the id all stay as they were.

  Six columns read from STATUSES, so adding a stage to that one array is all it
  takes to grow the board.

  As with the week board, dragging is a mouse gesture. On a phone, tap a card
  to open the editor page and change the status there.
*/

/** A short line for each column header, so the board reads at a glance. */
const hints: Record<Status, string> = {
  Draft: "Loose notes",
  Scripting: "Writing the words",
  Filming: "On camera",
  Editing: "In post-production",
  Scheduled: "Has a date",
  Published: "Live",
}

export default function StatusBoard({
  posts,
  onMoveStatus,
  onSelect,
}: {
  posts: Post[]
  onMoveStatus: (post: Post, status: Status) => void
  onSelect: (post: Post) => void
}) {
  const [dragId, setDragId] = useState<number | null>(null)
  const [overStatus, setOverStatus] = useState<Status | null>(null)

  function dropOn(status: Status) {
    if (dragId === null) return

    const post = posts.find((candidate) => candidate.id === dragId)
    setDragId(null)
    setOverStatus(null)
    if (!post) return

    // Already in that column — nothing to change.
    if (post.status === status) return

    onMoveStatus(post, status)
  }

  /**
   * Marks a column as a target. The preventDefault is what allows the drop to
   * happen at all; without it the browser keeps the gesture for itself.
   */
  function dragOver(status: Status) {
    return (event: DragEvent) => {
      event.preventDefault()
      setOverStatus(status)
    }
  }

  function dropHandler(status: Status) {
    return (event: DragEvent) => {
      event.preventDefault()
      dropOn(status)
    }
  }

  return (
    // Six columns side by side would be slivers, so the board is two rows of
    // three from lg up — wide enough for a title to read without wrapping
    // into a ribbon.
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {STATUSES.map((status) => {
        const statusPosts = posts.filter((post) => post.status === status)

        return (
          <BoardColumn
            key={status}
            title={status}
            hint={hints[status]}
            dot={statusBars[status]}
            isDropTarget={overStatus === status}
            count={statusPosts.length}
            emptyLabel="Nothing here yet. Drag a card across."
            onDragOver={dragOver(status)}
            onDrop={dropHandler(status)}
          >
            {statusPosts.map((post) => (
              <BoardCard
                key={post.id}
                post={post}
                meta={post.date === null ? "No date" : toReadableDate(post.date)}
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
  )
}
