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

/**
 * What a pillar is *for*.
 *
 * The nine come from Cloud Campaign's guide to content pillars, and they are
 * the shared vocabulary of a strategy. Note what they describe: not a subject,
 * but the job a post does for whoever reads it. "Educational" and
 * "Entertaining" can both be about typography and still be nothing alike.
 *
 * That is why a pillar needs two things — a name you chose and a type from this
 * list. The name carries the specifics ("Postcards in Progress"); the type says
 * what the pillar is for, which is the part that can be balanced and audited.
 */
export type PillarType =
  | "Educational"
  | "Promotional"
  | "Engaging"
  | "Inspiring"
  | "Entertaining"
  | "Community"
  | "Authenticity"
  | "Trending"
  | "Social proof"

/**
 * Every type, in the order the Pillars page lists them.
 *
 * One array is the single source for the form's dropdown, the storage check and
 * the reference section, exactly like `STATUSES` and `IDEA_TAGS`. Adding a type
 * means changing this line and adding its advice in `pillarTypes.ts`.
 */
export const PILLAR_TYPES: PillarType[] = [
  "Educational",
  "Promotional",
  "Engaging",
  "Inspiring",
  "Entertaining",
  "Community",
  "Authenticity",
  "Trending",
  "Social proof",
]

/**
 * A theme you keep returning to.
 *
 * A pillar is larger than a post and smaller than the whole account: you might
 * post under "Postcards in Progress" twice a month for a year, and every one of
 * those posts is a different post. Posts point here with `pillarId`.
 */
export interface Pillar {
  id: number
  /** What you actually call it: "Freelance, honestly". */
  name: string
  /** What the pillar is for — the balance and the advice both key off this. */
  type: PillarType
  /**
   * A sentence or two: what belongs in this pillar, and what does not. Optional
   * because a name is enough to start, but the Pillars page points out that a
   * pillar without one is a label rather than a plan.
   */
  description?: string
}

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
  /** Private scribbles. A post's equivalent free writing is its caption. */
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
  /** The page heading, and what every board card and list row shows. */
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
  /**
   * The pillar this post belongs to, if any.
   *
   * Optional, and a plain id rather than a copy of the name, so renaming a
   * pillar renames it everywhere. It dangles harmlessly if the pillar is gone —
   * but deleting a pillar also clears it from the posts that used it, so the
   * dangling case is only ever the result of hand-edited storage. See App's
   * `handleDeletePillar`.
   */
  pillarId?: number
  /**
   * The cover image as a data URL, already downscaled before it got here —
   * see `cover.ts`. Absent when the post has none.
   */
  cover?: string
  /**
   * The three writing sections, in the order they appear on the editor page.
   * All optional: a post can be a bare title, or a finished script, or
   * anything between the two.
   */
  hooks?: string
  script?: string
  caption?: string
}

/**
 * Which page is on screen.
 *
 * There is no router in this app, and it doesn't need one. App holds this in
 * state and renders one view or the other — that is all four pages require.
 */
export type View = "plan" | "calendar" | "ideas" | "pillars"

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
