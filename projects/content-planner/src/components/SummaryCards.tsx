import type { Status } from "../types"
import type { Post } from "../types"
import { STATUSES } from "../types"

/*
  Four numbers, in a row on desktop and two-by-two on a phone.

  The middle card counts everything still being made — every stage up to the
  point where a post is merely waiting for its day. With six statuses, "Drafts"
  on its own would describe a single step of the pipeline and make the board
  look busier than it is.
*/
const IN_PRODUCTION = STATUSES.slice(0, STATUSES.indexOf("Scheduled"))

const cards: { label: string; statuses: Status[] | null; tone: string }[] = [
  { label: "Total posts", statuses: null, tone: "text-ink" },
  { label: "In production", statuses: IN_PRODUCTION, tone: "text-clay" },
  { label: "Scheduled", statuses: ["Scheduled"], tone: "text-honey" },
  { label: "Published", statuses: ["Published"], tone: "text-sage" },
]

/*
  The posts arrive as a prop, so the counts are recomputed every time App's
  posts state changes — including right after a new post is saved.
*/
export default function SummaryCards({ posts }: { posts: Post[] }) {
  const counts = cards.map((card) =>
    card.statuses === null
      ? posts.length
      : posts.filter((post) => card.statuses!.includes(post.status)).length,
  )

  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {cards.map((card, index) => (
        <div
          key={card.label}
          className="rounded-2xl border border-line bg-card px-5 py-4"
        >
          <p className="text-sm text-ink-soft">{card.label}</p>
          <p className={`mt-1 font-display text-3xl ${card.tone}`}>
            {counts[index]}
          </p>
        </div>
      ))}
    </section>
  )
}
