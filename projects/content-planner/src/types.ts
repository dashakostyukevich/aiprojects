/**
 * Where a post is in production, in the order it moves through them.
 *
 * "Idea" used to be a status and has been retired: an idea is simply a post at
 * the first stage. Anything saved with the old value is upgraded on load, so
 * nothing is lost — see `storage.ts`.
 */
export type Status =
  | "Draft"
  | "Scripting"
  | "Filming"
  | "Editing"
  | "Scheduled"
  | "Published"

/**
 * Every status, in the order a post moves through them.
 *
 * A value sits next to its type rather than in a separate constants file, so
 * adding a status means changing one place. The status board, the modal's
 * dropdown, the filter's dropdown and the storage check all read this one
 * array, which is why they can't drift apart.
 */
export const STATUSES: Status[] = [
  "Draft",
  "Scripting",
  "Filming",
  "Editing",
  "Scheduled",
  "Published",
]

export type Platform = "Instagram" | "Threads" | "TikTok" | "Blog"

export type ContentType = "Reel" | "Carousel" | "Story" | "Text" | "Blog post"

/**
 * The kinds of idea, in the order the filter chips show them.
 *
 * An idea is deliberately a separate thing from a post, not a stage of one. A
 * hook or a topic is not a post that hasn't been written yet — it is the raw
 * material a post gets built from, and one idea can outlive several posts. So
 * it gets its own type, its own short form, and its own list.
 *
 * This is also a different axis from `ContentType`, which answers "what shape
 * will this be" (a Reel, a carousel). A tag answers "what is it" — an angle, a
 * subject, an image, a whole post.
 */
export type IdeaTag = "Hooks" | "Topics" | "Visuals" | "Post ideas"

export const IDEA_TAGS: IdeaTag[] = [
  "Hooks",
  "Topics",
  "Visuals",
  "Post ideas",
]

export interface Idea {
  id: number
  /** The whole idea, often one line. This is what makes the form short. */
  title: string
  /**
   * Optional on purpose. A passing thought gets captured before you decide
   * what kind of thing it is, and untitled ideas collect under "Uncategorised"
   * rather than blocking the save.
   */
  tag?: IdeaTag
  /** Private scribbles, the same idea as `Post.notes`. */
  notes?: string
  /**
   * The post this idea became, once it has. The idea is kept after promotion —
   * a hook is often worth a second post — so this is a link, not a move. It
   * dangles harmlessly if that post is later deleted.
   */
  postId?: number
}

export interface Post {
  id: number
  title: string
  platform: Platform
  type: ContentType
  /**
   * The publication date as "2026-03-18", or null when the post has no date.
   *
   * This is a plain string, not a Date. A string has no timezone attached, so
   * it can never drift by a day when it crosses machines. "Mar 18" was tried
   * first and needed a second field to hold the real day, which is a trap.
   */
  date: string | null
  status: Status
  /** Private scribbles. Optional, and not shown in the list. */
  notes?: string
}

/**
 * Which page is on screen.
 *
 * There is no router in this app, and it doesn't need one. App holds this in
 * state and renders one view or the other — that is all three pages require.
 */
export type View = "plan" | "calendar" | "ideas"

/**
 * The two ways of looking at the Plan screen: by day of the week, or by status.
 * A view, not a saved preference — a reload opens on the week board.
 */
export type PlanMode = "week" | "status"

/**
 * What the reader has asked the list to show. Each dropdown is either a real
 * value or "all", which is why every field is a union with the string "all".
 *
 * Filters change what is displayed and nothing else — the posts themselves are
 * never rewritten to match one.
 */
export interface ListFilters {
  /** Matched against the title, ignoring case. */
  search: string
  platform: Platform | "all"
  status: Status | "all"
  type: ContentType | "all"
}
