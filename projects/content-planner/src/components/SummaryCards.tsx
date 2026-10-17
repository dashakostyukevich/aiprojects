import type { Status } from "../types"
import type { Post } from "../types"

const cards: { label: string; status: Status | null; tone: string }[] = [
  { label: "Total posts", status: null, tone: "text-ink" },
  { label: "Drafts", status: "Draft", tone: "text-clay" },
  { label: "Scheduled", status: "Scheduled", tone: "text-honey" },
  { label: "Published", status: "Published", tone: "text-sage" },
]

/*
  Four numbers, in a row on desktop and two-by-two on a phone.

  The posts arrive as a prop, so the counts are recomputed every time App's
  posts state changes — including right after a new post is saved.
*/
export default function SummaryCards({ posts }: { posts: Post[] }) {
  const counts = cards.map((card) =>
    card.status === null
      ? posts.length
      : posts.filter((post) => post.status === card.status).length,
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
