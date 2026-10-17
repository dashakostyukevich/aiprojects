export type Status = "Idea" | "Draft" | "Scheduled" | "Published"

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
