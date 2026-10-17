import type { ContentType, Platform, Status } from "./types"

/*
  Tailwind classes can't be built at runtime, so the class names live here as
  complete strings. Look a colour up by name and use it: statusStyles.Published.
*/

export const statusStyles: Record<Status, string> = {
  Idea: "bg-stone/10 text-stone ring-stone/25",
  Draft: "bg-clay/10 text-clay ring-clay/25",
  Scheduled: "bg-honey/15 text-honey ring-honey/30",
  Published: "bg-sage/10 text-sage ring-sage/25",
}

/** A small coloured dot, so platforms are told apart without reading the name. */
export const platformDots: Record<Platform, string> = {
  Instagram: "bg-clay",
  Threads: "bg-ink-soft",
  TikTok: "bg-honey",
  Blog: "bg-sage",
}

/** Short, hand-picked labels for the content types used in this app. */
export const typeStyles: Record<ContentType, string> = {
  Reel: "text-clay",
  Carousel: "text-honey",
  Story: "text-sage",
  Text: "text-ink-soft",
  "Blog post": "text-ink-soft",
}
