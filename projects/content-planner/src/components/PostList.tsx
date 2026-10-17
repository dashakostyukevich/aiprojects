import type { Post } from "../types"
import { platformDots, typeStyles } from "../styles"
import StatusPill from "./StatusPill"

/* One row of the content list. */
function PostRow({ post }: { post: Post }) {
  return (
    <li
      className="flex flex-col gap-3 px-5 py-4 transition-colors
        hover:bg-paper/60 sm:flex-row sm:items-center sm:gap-4"
    >
      {/* Platform, shown as a dot plus a name */}
      <div className="flex items-center gap-2 sm:w-40 sm:shrink-0">
        <span className={`h-2 w-2 rounded-full ${platformDots[post.platform]}`} />
        <span className="text-sm text-ink-soft">{post.platform}</span>
      </div>

      {/* Title gets the most room */}
      <p className="min-w-0 flex-1 text-sm font-medium">
        <span className={`mr-2 ${typeStyles[post.type]}`}>{post.type}</span>
        {post.title}
      </p>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <span className="text-sm tabular-nums text-ink-soft">{post.date}</span>
        <StatusPill status={post.status} />
      </div>
    </li>
  )
}

/*
  The main list of posts. Renders one PostRow per post in data.ts.
*/
export default function PostList({ posts }: { posts: Post[] }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-card">
      <div
        className="flex items-baseline justify-between border-b
          border-line px-5 py-4"
      >
        <h2 className="font-display text-xl">Content</h2>
        <span className="text-sm text-ink-faint">{posts.length} posts</span>
      </div>

      <ul className="divide-y divide-line">
        {posts.map((post) => (
          <PostRow key={post.id} post={post} />
        ))}
      </ul>
    </section>
  )
}
