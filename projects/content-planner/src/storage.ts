import type { ContentType, Platform, Post, Status } from "./types"

/*
  All localStorage talking happens in this file. Nothing else in the app
  touches localStorage, so this is the only place to look if the storage
  format ever changes.

  localStorage holds strings only, so posts are saved as JSON. Everything is
  kept under a single key: one array is easier to read, write, and reason
  about than one key per post.
*/
const STORAGE_KEY = "content-planner:posts"

const platforms: Platform[] = ["Instagram", "Threads", "TikTok", "Blog"]
const contentTypes: ContentType[] = [
  "Reel",
  "Carousel",
  "Story",
  "Text",
  "Blog post",
]
const statuses: Status[] = ["Idea", "Draft", "Scheduled", "Published"]

/**
 * Checks one saved value really is a post.
 *
 * Storage can be edited by hand, and can hold data written by an older
 * version of the app, so nothing read back from it is trusted. `value` is
 * typed as `unknown` on purpose — TypeScript forces us to check before use.
 */
function isPost(value: unknown): value is Post {
  if (typeof value !== "object" || value === null) return false

  const post = value as Record<string, unknown>

  return (
    typeof post.id === "number" &&
    typeof post.title === "string" &&
    platforms.includes(post.platform as Platform) &&
    contentTypes.includes(post.type as ContentType) &&
    typeof post.date === "string" &&
    statuses.includes(post.status as Status) &&
    typeof post.day === "number"
  )
}

/**
 * Reads the saved posts.
 * Returns null when there is nothing saved yet, or when what is saved can't be
 * trusted — the caller then falls back to the example posts.
 */
export function loadPosts(): Post[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return null

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null

    // An empty array is a legitimate saved state — it means every post was
    // deleted — so it is passed straight through, not treated as a failure.
    if (parsed.length === 0) return []

    // Keep only the entries that really are posts, so one bad row can't take
    // the whole app down. If none of them survived, something is wrong with
    // what was saved and the caller falls back to the examples.
    const posts = parsed.filter(isPost)
    return posts.length > 0 ? posts : null
  } catch {
    // Unreadable JSON, or storage blocked entirely (private browsing).
    return null
  }
}

/**
 * Writes the posts. Called after every change, so it must never throw —
 * a failed save shouldn't take the app down with it.
 */
export function savePosts(posts: Post[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  } catch {
    // Storage full or unavailable. The app keeps working in memory.
  }
}
