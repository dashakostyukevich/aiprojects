import { useRef } from "react"
import type { KeyboardEvent } from "react"
import type { Post } from "../types"
import { statusBars } from "../styles"

/*
  One post card, shared by the week board and the status board. Each board
  decides what the small line under the title says — the status on the week
  board, the date on the status board — by passing `meta`.

  The card can be dragged, and it can be clicked to open the editor page.
  Those two gestures have to be told apart: some browsers fire a click after a
  drag finishes, which would throw the editor straight back open the moment you
  drop a card. `justDragged` swallows that one stray click.

  Dragging is a mouse gesture only. It is deliberately not implemented for
  touch, so on a phone the way to move a post is to tap it and change the date
  or status in the editor.

  The one colour on the card is the status dot beside the meta line: platform
  and content type are told apart by their words, which is what keeps a row
  from carrying three accents at once.
*/
export default function BoardCard({
  post,
  meta,
  isDragging,
  onSelect,
  onDragStart,
  onDragEnd,
}: {
  post: Post
  /** The small grey line under the title, or undefined for none. */
  meta?: string
  /** True while this card is the one being dragged, to fade it out. */
  isDragging: boolean
  onSelect: () => void
  onDragStart: () => void
  onDragEnd: () => void
}) {
  // Set the instant a drag ends, so the click browsers sometimes fire
  // alongside it can be ignored. Cleared on a timer because a drag that ends
  // over nothing fires no click at all, and a flag left behind would swallow
  // the next genuine click.
  const justDragged = useRef(false)

  function handleDragStart(event: React.DragEvent) {
    justDragged.current = false

    // Firefox refuses to start a drag unless something is written here, even
    // though the drop reads the id back from state instead.
    event.dataTransfer.setData("text/plain", String(post.id))
    event.dataTransfer.effectAllowed = "move"

    onDragStart()
  }

  function handleDragEnd() {
    justDragged.current = true
    setTimeout(() => {
      justDragged.current = false
    }, 0)
    onDragEnd()
  }

  function handleKeyDown(event: KeyboardEvent) {
    // Dragging has no keyboard equivalent, so Enter and Space open the editor
    // where the date and status can be changed instead.
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onSelect()
    }
  }

  return (
    <article
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => {
        if (justDragged.current) return
        onSelect()
      }}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${post.title}. ${post.platform}, ${post.type}. Drag to move, or press Enter to edit.`}
      title="Drag to move · click to edit"
      className={`cursor-grab rounded-xl border border-line bg-card p-3
        transition-[box-shadow,transform] duration-150 ease-out
        active:cursor-grabbing motion-safe:hover:-translate-y-0.5
        hover:shadow-card ${isDragging ? "opacity-40" : ""}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-xs text-ink-soft">{post.platform}</span>
        <span className="shrink-0 text-xs text-ink-faint">{post.type}</span>
      </div>

      <p className="mt-1.5 text-sm font-medium leading-snug">{post.title}</p>

      {meta && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-faint">
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
              statusBars[post.status]
            }`}
          />
          <span className="truncate">{meta}</span>
        </p>
      )}
    </article>
  )
}
