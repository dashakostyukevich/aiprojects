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

/** The stage a post goes to next. A post at the last stage stays there. */
export function nextStatus(status: Status): Status {
  const index = STATUSES.indexOf(status)
  return STATUSES[Math.min(index + 1, STATUSES.length - 1)]
}

export type Platform = "Instagram" | "Threads" | "TikTok" | "Blog"

export type ContentType = "Reel" | "Carousel" | "Story" | "Text" | "Blog post"

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
