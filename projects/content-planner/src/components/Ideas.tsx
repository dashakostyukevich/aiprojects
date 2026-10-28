import { useState } from "react"
import type { Idea, IdeaTag, Post } from "../types"
import { IDEA_TAGS } from "../types"
import {
  deleteButton,
  filterChip,
  filterChipActive,
  quietButton,
  quietChip,
  secondaryButton,
} from "../styles"

/*
  The Ideas page.

  An idea is its own thing here, not a stage of a post: a hook or a topic is
  the raw material a post gets built from, and one idea can outlive several
  posts. So this page shows the `ideas` list, and the post list never sees it.

  Tags are a way of looking at the page, held in local state like the post
  list's filters. Choosing one re-reads the same array — it never rewrites an
  idea, so tagging nothing is always safe.

  Turning an idea into a post copies its title into a new Draft and records the
  link back. The idea stays on this page afterwards, deliberately: the same
  hook is often worth a second post, and deleting the raw material the moment
  you use it once is how a good idea gets lost.
*/

/** Which tag the page is currently showing. */
type IdeaFilter = "all" | "uncategorised" | IdeaTag

/* One idea, as a card. */
function IdeaCard({
  idea,
  linkedPost,
  onEdit,
  onDelete,
  onPromote,
  onOpenPost,
}: {
  idea: Idea
  /** The post this idea became, when it still exists. */
  linkedPost?: Post
  onEdit: (idea: Idea) => void
  onDelete: (idea: Idea) => void
  onPromote: (idea: Idea) => void
  onOpenPost: (post: Post) => void
}) {
  return (
    <li
      className="flex flex-col gap-3 rounded-2xl border border-line
        bg-card p-5 sm:p-6"
    >
      {/*
        A tag is grey on purpose. Colour in this app already means a status, so
        a coloured tag beside a status pill would read as the same kind of
        information.
      */}
      {idea.tag ? (
        <span
          className={`w-fit rounded-full px-3 py-1 text-xs ${quietChip}`}
        >
          {idea.tag}
        </span>
      ) : (
        <span className="w-fit text-xs text-ink-faint">Uncategorised</span>
      )}

      <h3 className="text-lg font-medium leading-snug text-ink">
        {idea.title}
      </h3>

      {idea.notes && <p className="text-sm text-ink-soft">{idea.notes}</p>}

      {/*
        Actions sit at the bottom of every card, even when the titles above
        are different lengths. `mt-auto` is what pushes them there.
      */}
      <div className="mt-auto flex flex-wrap items-center gap-1 pt-2">
        {/*
          Once an idea has become a post the button follows that post instead
          of making a second one. If it was deleted, the link dangles and this
          quietly offers to promote the idea again.
        */}
        {linkedPost ? (
          <button
            type="button"
            onClick={() => onOpenPost(linkedPost)}
            className={secondaryButton}
          >
            View post
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onPromote(idea)}
            className={secondaryButton}
          >
            Turn into a post
          </button>
        )}

        <button
          type="button"
          onClick={() => onEdit(idea)}
          aria-label={`Edit ${idea.title}`}
          className={quietButton}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(idea)}
          aria-label={`Delete ${idea.title}`}
          className={deleteButton}
        >
          Delete
        </button>
      </div>
    </li>
  )
}

export default function Ideas({
  ideas,
  posts,
  onNew,
  onEdit,
  onDelete,
  onPromote,
  onOpenPost,
}: {
  ideas: Idea[]
  /** Used only to follow an idea's link to the post it became. */
  posts: Post[]
  onNew: () => void
  onEdit: (idea: Idea) => void
  onDelete: (idea: Idea) => void
  onPromote: (idea: Idea) => void
  onOpenPost: (post: Post) => void
}) {
  const [filter, setFilter] = useState<IdeaFilter>("all")

  const untagged = ideas.filter((idea) => idea.tag === undefined).length

  // Each chip carries its own count, so the page answers "how many topics do
  // I have?" without clicking through them all.
  //
  // Every chip is always shown, including at zero. One that vanished while
  // selected would leave the page filtering by something with no control left
  // to see it or turn it off — the count is allowed to be a bit untidy; the
  // controls are not.
  const chips: { label: string; value: IdeaFilter; count: number }[] = [
    { label: "All", value: "all", count: ideas.length },
    ...IDEA_TAGS.map((tag) => ({
      label: tag,
      value: tag as IdeaFilter,
      count: ideas.filter((idea) => idea.tag === tag).length,
    })),
    { label: "Uncategorised", value: "uncategorised", count: untagged },
  ]

  const visible = ideas.filter((idea) => {
    if (filter === "all") return true
    if (filter === "uncategorised") return idea.tag === undefined
    return idea.tag === filter
  })

  // Spelled out rather than read back off the chip above, so the empty state
  // still names the right tag if the chip list ever changes.
  const filterLabel =
    filter === "all" || filter === "uncategorised"
      ? filter
      : filter.toLowerCase()

  return (
    <section className="flex flex-col gap-5">
      <div
        className="flex flex-col gap-4 sm:flex-row sm:items-end
          sm:justify-between"
      >
        <div>
          <h2 className="text-2xl text-ink">Ideas</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Hooks, topics and visuals, kept before they become posts.
          </p>
        </div>

        {/* Hidden when the empty state below is showing, because that already
            offers the same button. */}
        {ideas.length > 0 && (
          <button
            type="button"
            onClick={onNew}
            className={`${secondaryButton} shrink-0`}
          >
            + New idea
          </button>
        )}
      </div>

      {/*
        The chips are always on show, including on a page with no ideas at all.
        Seeing the four types before you have written one is the point: it says
        what an idea can be, rather than presenting an empty box and a form.
      */}
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => {
          const isActive = chip.value === filter

          return (
            <button
              key={chip.value}
              type="button"
              onClick={() => setFilter(chip.value)}
              aria-pressed={isActive}
              className={isActive ? filterChipActive : filterChip}
            >
              {chip.label}{" "}
              <span className={isActive ? "text-white/70" : "text-ink-faint"}>
                {chip.count}
              </span>
            </button>
          )
        })}
      </div>

      {ideas.length === 0 ? (
        <div className="rounded-2xl border border-line bg-card px-5 py-16 text-center">
          <p className="text-xl text-ink">No ideas yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-ink-soft">
            Write down the hook, the subject or the image while it is fresh.
            Tag it when you know what kind it is — it stays here until you turn
            it into a post.
          </p>
          <button
            type="button"
            onClick={onNew}
            className={`${secondaryButton} mt-5`}
          >
            + New idea
          </button>
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-line bg-card px-5 py-16 text-center">
          <p className="text-xl text-ink">Nothing tagged {filterLabel}</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-ink-soft">
            Tag an idea this way from the edit dialog, or add a new one.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              // A link to a post that has since been deleted is simply
              // left unresolved, and the card offers to promote again.
              linkedPost={posts.find((post) => post.id === idea.postId)}
              onEdit={onEdit}
              onDelete={onDelete}
              onPromote={onPromote}
              onOpenPost={onOpenPost}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
