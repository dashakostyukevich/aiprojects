import type { Status } from "./types"

/*
  Tailwind classes can't be built at runtime, so the class names live here as
  complete strings. Look a colour up by name and use it: statusChip.Published.
*/

/*
  Status is the only thing in this app that carries colour.

  The design system gives five pastels and the pipeline has six stages, so the
  first stage takes the neutral: nothing has started yet, and colour is supposed
  to mean something. From there the six read as one progression —
  grey → pink → orange → yellow → blue → green — with Scheduled on the same
  blue the calendar uses for a date, and Published on green, the "online" colour.

  Platform, content type, idea tags and pillar types are told apart by their
  words instead. A row can only afford two accents, and the status is the one
  worth spending them on.

  Every chip is a pastel fill with dark text; the label is always there, so
  colour never has to carry the meaning on its own.
*/
export const statusChip: Record<Status, string> = {
  Draft: "bg-subtle text-ink-soft",
  Scripting: "bg-pink text-ink",
  Filming: "bg-orange text-ink",
  Editing: "bg-yellow text-ink",
  Scheduled: "bg-blue text-ink",
  Published: "bg-green text-ink",
}

/** The same colours as solid swatches, for calendar bars and column dots. */
export const statusBars: Record<Status, string> = {
  Draft: "bg-ink-faint",
  Scripting: "bg-pink",
  Filming: "bg-orange",
  Editing: "bg-yellow",
  Scheduled: "bg-blue",
  Published: "bg-green",
}

/**
 * The neutral chip, for a label rather than a signal — an idea's tag, a post's
 * pillar, a pillar's type.
 *
 * Deliberately grey: every pastel already means a status, so a coloured tag
 * sitting beside a status pill would read as the same kind of information.
 */
export const quietChip = "bg-subtle text-ink-soft"

/*
  Buttons, in the three shapes the app uses. Kept together so every primary
  action is the same blue, every secondary one the same white, and the delete
  link the same quiet grey until you reach for it.
*/

/** The one primary action on a view: blue fill, white text. */
export const primaryButton =
  "h-11 rounded-xl bg-primary px-5 text-sm font-medium text-white " +
  "transition-colors hover:bg-primary-dark disabled:opacity-40"

/** White with a hairline border: the safe alternative to the primary action. */
export const secondaryButton =
  "h-11 rounded-xl border border-line bg-card px-5 text-sm font-medium " +
  "text-ink transition-colors hover:bg-subtle disabled:opacity-40"

/** No border, no fill: a quiet action that sits inside a row or a card. */
export const quietButton =
  "h-10 rounded-xl px-3 text-sm text-ink-soft transition-colors " +
  "hover:bg-subtle hover:text-ink"

/** The same quiet shape, but it turns red when you reach for it. */
export const deleteButton =
  "h-10 rounded-xl px-3 text-sm text-ink-faint transition-colors " +
  "hover:bg-danger-tint hover:text-danger"

/** A small filter chip: white with a border until it is the chosen one. */
export const filterChip =
  "rounded-xl border px-4 py-2 text-sm transition-colors " +
  "border-line bg-card text-ink-soft hover:bg-subtle hover:text-ink"

/** The same chip once chosen: the current location, in the one blue. */
export const filterChipActive =
  "rounded-xl border px-4 py-2 text-sm font-medium transition-colors " +
  "border-primary bg-primary text-white"

/** Re-exported so components can format dates without importing two files. */
export { toReadableDate } from "./dates"
