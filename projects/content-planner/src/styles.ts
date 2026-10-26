import type { ContentType, Platform, Status } from "./types"

/*
  Tailwind classes can't be built at runtime, so the class names live here as
  complete strings. Look a colour up by name and use it: statusStyles.Published.
*/

/**
 * The chip on an idea, showing its tag.
 *
 * Deliberately grey. Every colour in the palette already means a status or a
 * platform, so a coloured tag sitting beside a status pill would read as the
 * same kind of information — and a green "Hooks" chip beside a green
 * "Published" pill would be actively misleading. A tag is told apart by its
 * words, not its colour.
 */
export const ideaTagChip =
  "bg-ink-soft/10 text-ink-soft ring-1 ring-inset ring-line"

export const statusStyles: Record<Status, string> = {
  Draft: "bg-clay/10 text-clay ring-clay/25",
  Scripting: "bg-slate/10 text-slate ring-slate/25",
  Filming: "bg-plum/10 text-plum ring-plum/25",
  Editing: "bg-teal/10 text-teal ring-teal/25",
  Scheduled: "bg-honey/15 text-honey ring-honey/30",
  Published: "bg-sage/10 text-sage ring-sage/25",
}

/** Solid colours for the small status bars on calendar entries. */
export const statusBars: Record<Status, string> = {
  Draft: "bg-clay",
  Scripting: "bg-slate",
  Filming: "bg-plum",
  Editing: "bg-teal",
  Scheduled: "bg-honey",
  Published: "bg-sage",
}

/** A small coloured dot, so platforms are told apart without reading the name. */
export const platformDots: Record<Platform, string> = {
  Instagram: "bg-clay",
  Threads: "bg-ink-soft",
  TikTok: "bg-honey",
  Blog: "bg-sage",
}

/** Re-exported so components can format dates without importing two files. */
export { toReadableDate } from "./dates"

/** Short, hand-picked labels for the content types used in this app. */
export const typeStyles: Record<ContentType, string> = {
  Reel: "text-clay",
  Carousel: "text-honey",
  Story: "text-sage",
  Text: "text-ink-soft",
  "Blog post": "text-ink-soft",
}
