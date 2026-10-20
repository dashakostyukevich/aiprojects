import type { Post } from "../types"
import { platformDots, toReadableDate, typeStyles } from "../styles"
import StatusPill from "./StatusPill"

/*
  The Ideas page.

  There is no separate store for ideas. An idea is just a post whose status is
  "Idea", so this component receives the same `posts` array as everything else
  and picks out the ones it needs. Move one to Draft and it stops being an idea
  on the next render — no copying, no second list to keep in sync.

  Create, edit and delete all reuse App's existing handlers and the same modal
  as the rest of the app.
*/

/* One idea, as a card. */
function IdeaCard({
  post,
  onEdit,
  onDelete,
  onMoveToDraft,
}: {
  post: Post
  onEdit: (post: Post) => void
  onDelete: (post: Post) => void
  onMoveToDraft: (post: Post) => void
}) {
  return (
    <li
      className="flex flex-col gap-3 rounded-2xl border border-line
        bg-card p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm text-ink-soft">
          <span
            className={`h-2 w-2 rounded-full ${platformDots[post.platform]}`}
          />
          {post.platform}
        </span>
        <StatusPill status={post.status} />
      </div>

      <h3 className="font-display text-lg leading-snug">
        <span className={`mr-2 text-xs ${typeStyles[post.type]}`}>
          {post.type}
        </span>
        {post.title}
      </h3>

      <p className="text-sm text-ink-faint">
        {post.date === null ? "No date yet" : toReadableDate(post.date)}
      </p>

      {/* Actions sit at the bottom of every card, even when the titles above
          are different lengths. `mt-auto` is what pushes them there. */}
      <div className="mt-auto flex flex-wrap items-center gap-1 pt-2">
        <button
          type="button"
          onClick={() => onMoveToDraft(post)}
          className="rounded-full bg-ink px-4 py-1.5 text-sm font-medium
            text-paper transition-opacity hover:opacity-90"
        >
          Move to Draft
        </button>
        <button
          type="button"
          onClick={() => onEdit(post)}
          aria-label={`Edit ${post.title}`}
          className="rounded-full px-3 py-1.5 text-sm text-ink-soft
            transition-colors hover:bg-ink/5 hover:text-ink"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(post)}
          aria-label={`Delete ${post.title}`}
          className="rounded-full px-3 py-1.5 text-sm text-ink-faint
            transition-colors hover:bg-clay/10 hover:text-clay"
        >
          Delete
        </button>
      </div>
    </li>
  )
}

export default function Ideas({
  posts,
  onNewIdea,
  onEdit,
  onDelete,
  onMoveToDraft,
}: {
  posts: Post[]
  onNewIdea: () => void
  onEdit: (post: Post) => void
  onDelete: (post: Post) => void
  onMoveToDraft: (post: Post) => void
}) {
  // The whole page is this one line: an idea is a post with status "Idea".
  const ideas = posts.filter((post) => post.status === "Idea")

  return (
    <section className="flex flex-col gap-5">
      <div
        className="flex flex-col gap-4 sm:flex-row sm:items-end
          sm:justify-between"
      >
        <div>
          <h2 className="font-display text-2xl tracking-tight">Ideas</h2>
          <p className="mt-1 text-sm text-ink-soft">
            {ideas.length === 0
              ? "Nothing waiting in the wings."
              : "Waiting their turn. Move one to Draft when you start writing."}
          </p>
        </div>

        {/* Hidden once there are no ideas, because the empty state below
            already offers the same button. */}
        {ideas.length > 0 && (
          <button
            type="button"
            onClick={onNewIdea}
            className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-sm
              font-medium text-paper transition-opacity hover:opacity-90"
          >
            + New idea
          </button>
        )}
      </div>

      {ideas.length === 0 ? (
        <div className="rounded-2xl border border-line bg-card px-5 py-14 text-center">
          <p className="font-display text-xl">No ideas yet</p>
          <p
            className="mx-auto mt-1 max-w-sm text-sm text-ink-soft"
          >
            Write down the next thing you want to make. It stays here until you
            move it to Draft.
          </p>
          <button
            type="button"
            onClick={onNewIdea}
            className="mt-4 rounded-full bg-ink px-5 py-2 text-sm
              font-medium text-paper transition-opacity hover:opacity-90"
          >
            + New idea
          </button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {ideas.map((post) => (
            <IdeaCard
              key={post.id}
              post={post}
              onEdit={onEdit}
              onDelete={onDelete}
              onMoveToDraft={onMoveToDraft}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
