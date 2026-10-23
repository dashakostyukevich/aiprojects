import { STATUSES } from "./types"
import type { ContentType, Platform, Post, Status } from "./types"
import { isValidISO } from "./dates"

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

/**
 * Statuses from earlier versions of the app, mapped to the one that replaced
 * them.
 *
 * This exists because of what `isPost` below does: it rejects anything it
 * doesn't recognise. Rename a status without upgrading old data and every post
 * using it reads as bad data and is quietly thrown away. Ideas were retired
 * when the pipeline grew to six stages, and became Drafts.
 */
const RETIRED_STATUSES: Record<string, Status> = { Idea: "Draft" }

/**
 * Rewrites one saved post into the shape the app uses now, or passes it
 * through untouched.
 *
 * Takes and returns `unknown` because it runs before anything has been
 * validated — an old post may not be a well-formed post at all yet.
 */
function withCurrentStatus(value: unknown): unknown {
  if (typeof value !== "object" || value === null) return value

  const post = value as Record<string, unknown>
  const replacement = RETIRED_STATUSES[post.status as string]
  if (replacement === undefined) return value

  // A new object, so the array read out of storage is never rewritten in
  // place. Running this twice is harmless: once upgraded, there is nothing
  // left for it to match.
  return { ...post, status: replacement }
}

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

  // The date is either null (no date yet) or a real "YYYY-MM-DD" day. An
  // impossible day such as 2026-02-31 is rejected so it can't reach the grid.
  const hasValidDate =
    post.date === null || (typeof post.date === "string" && isValidISO(post.date))

  return (
    typeof post.id === "number" &&
    typeof post.title === "string" &&
    post.title.trim() !== "" &&
    platforms.includes(post.platform as Platform) &&
    contentTypes.includes(post.type as ContentType) &&
    hasValidDate &&
    STATUSES.includes(post.status as Status)
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

    // Upgrade anything written by an older version, then keep only the
    // entries that really are posts, so one bad row can't take the whole app
    // down. If none of them survived, something is wrong with what was saved
    // and the caller falls back to the examples.
    const posts = parsed.map(withCurrentStatus).filter(isPost)
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
