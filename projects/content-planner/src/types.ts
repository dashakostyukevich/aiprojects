/*
  The shape of a post. Every example post in data.ts must match this, or
  TypeScript will complain — which is the whole point of having it.

  A "type" is just a description of what a piece of data looks like.
*/
export type Status = "Idea" | "Draft" | "Scheduled" | "Published"

export type Platform = "Instagram" | "Threads" | "TikTok" | "Blog"

export type ContentType = "Reel" | "Carousel" | "Story" | "Text"

export interface Post {
  id: number
  title: string
  platform: Platform
  type: ContentType
  /** Readable date for display, e.g. "Mar 12". Kept as text because the UI
      only ever shows it, it never does date maths. */
  date: string
  status: Status
  /** Which day of the weekly schedule it appears in. 0 = Monday. */
  day: number
}
