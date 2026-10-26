import { STATUSES } from "./types"
import type { ContentType, Idea, IdeaTag, Platform, Post, Status } from "./types"
import { isValidISO } from "./dates"

/*
  All localStorage talking happens in this file. Nothing else in the app
  touches localStorage, so this is the only place to look if the storage
  format ever changes.

  localStorage holds strings only, so everything is saved as JSON under one key,
  holding both lists:

    { posts: [...], ideas: [...] }

  One key rather than two, so a save writes both lists at once and they can
  never end up out of step with each other.
*/
const STORAGE_KEY = "content-planner:posts"

/** Both lists the app keeps, as they are stored. */
export interface Store {
  posts: Post[]
  ideas: Idea[]
}

const platforms: Platform[] = ["Instagram", "Threads", "TikTok", "Blog"]
const contentTypes: ContentType[] = [
  "Reel",
  "Carousel",
  "Story",
  "Text",
  "Blog post",
]
const ideaTags: IdeaTag[] = ["Hooks", "Topics", "Visuals", "Post ideas"]

/**
 * Statuses from earlier versions of the app, mapped to the one that replaced
 * them.
 *
 * This exists because of what `isPost` below does: it rejects anything it
 * doesn't recognise. Rename a status without upgrading old data and every post
 * using it reads as bad data and is quietly thrown away. The status once called
 * "Idea" went this way when the pipeline grew to six stages, and became Draft.
 *
 * That is not the same thing as the `Idea` type, which is a separate list with
 * its own short form. Only a post's *status* is upgraded here.
 */
const RETIRED_STATUSES: Record<string, Status> = { Idea: "Draft" }

/**
 * Rewrites one saved post into the shape the app uses now, or passes it
 * through untouched.
 *
 * Two upgrades happen here, both of them renames the reader can't guess:
 *
 *   - a retired status, mapped to the stage that replaced it
 *   - the free-notes field, folded into the caption section when the post
 *     editor grew hooks, script and caption and stopped having notes
 *
 * Takes and returns `unknown` because it runs before anything has been
 * validated — an old post may not be a well-formed post at all yet.
 *
 * Running it twice is harmless: an upgraded post matches neither case, so the
 * result is returned unchanged.
 */
function upgradePost(value: unknown): unknown {
  if (typeof value !== "object" || value === null) return value

  const post = value as Record<string, unknown>
  const changes: Record<string, unknown> = {}

  const retired = RETIRED_STATUSES[post.status as string]
  if (retired !== undefined) changes.status = retired

  // Only fold notes across when there isn't already a caption, so a post that
  // somehow carries both can't lose the caption it has.
  if (typeof post.notes === "string" && post.caption === undefined) {
    changes.caption = post.notes
  }

  if (Object.keys(changes).length === 0) return value

  const upgraded: Record<string, unknown> = { ...post, ...changes }
  delete upgraded.notes
  return upgraded
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
 * Checks one saved value really is an idea.
 *
 * An idea is a much looser thing than a post — just an id and a title, with a
 * tag, notes and a link all optional — so this check is correspondingly light.
 * An unrecognised tag is dropped rather than kept, which means adding a tag to
 * `IDEA_TAGS` later would discard it from old saves; if that ever happens, give
 * it the same upgrade treatment as retired statuses above.
 */
function isIdea(value: unknown): value is Idea {
  if (typeof value !== "object" || value === null) return false

  const idea = value as Record<string, unknown>

  if (typeof idea.id !== "number") return false
  if (typeof idea.title !== "string" || idea.title.trim() === "") return false
  if (idea.tag !== undefined && !ideaTags.includes(idea.tag as IdeaTag)) {
    return false
  }
  if (idea.notes !== undefined && typeof idea.notes !== "string") return false
  if (idea.postId !== undefined && typeof idea.postId !== "number") return false

  return true
}

/**
 * Turns a raw array from storage into posts.
 *
 * Returns null when the array held entries but none of them survived the
 * check — that means what was saved isn't usable, and the caller falls back to
 * the examples. An empty array is a different thing entirely: it is a real
 * state, meaning every post was deleted, so it passes through.
 */
function readPosts(raw: unknown[]): Post[] | null {
  if (raw.length === 0) return []

  // Upgrade anything written by an older version, then keep only the entries
  // that really are posts, so one bad row can't take the whole app down.
  const posts = raw.map(upgradePost).filter(isPost)
  return posts.length > 0 ? posts : null
}

/**
 * Reads both saved lists.
 *
 * Returns null when there is nothing saved yet, or when what is saved can't be
 * trusted — the caller then falls back to the examples.
 */
export function loadStore(): Store | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return null

    const parsed: unknown = JSON.parse(raw)

    // The shape from before ideas existed: a bare array of posts. Reading it
    // as well, rather than refusing it, is what keeps upgrading the format
    // from emptying the app.
    if (Array.isArray(parsed)) {
      const posts = readPosts(parsed)
      return posts === null ? null : { posts, ideas: [] }
    }

    if (typeof parsed !== "object" || parsed === null) return null

    const saved = parsed as Record<string, unknown>
    if (!Array.isArray(saved.posts)) return null

    const posts = readPosts(saved.posts)
    if (posts === null) return null

    // Ideas are optional on purpose: a store written before they existed, or
    // edited by hand, simply has none. Anything malformed is dropped rather
    // than allowed to break the page.
    const ideas = Array.isArray(saved.ideas) ? saved.ideas.filter(isIdea) : []

    return { posts, ideas }
  } catch {
    // Unreadable JSON, or storage blocked entirely (private browsing).
    return null
  }
}

/**
 * Writes both lists, and says whether it worked.
 *
 * Called after every change, so it must never throw — a failed save shouldn't
 * take the app down with it. It does report back, though: the usual reason for
 * failure is storage being full, which is easy to reach now that posts can
 * carry a cover image. App turns `false` into a warning rather than letting
 * the app keep looking fine while writing nothing.
 */
export function saveStore(store: Store): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    return true
  } catch {
    // Storage full or unavailable. The app keeps working in memory.
    return false
  }
}
