// Every shape the app passes around is declared here, once.
// Add a type when you need a new one, and use it everywhere instead of
// writing object shapes inline.

/**
 * A day of the week, as `Date.getDay()` numbers: 0 is Sunday, 6 is Saturday.
 * Chosen over a custom enum so a weekday can be compared straight against
 * `getDay()` and used as an array index, with no mapping table in between.
 */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

/**
 * How often a habit is meant to be done.
 *
 * A union rather than one shape with optional fields, because the three kinds
 * are genuinely different: "every day" has no number to tune, "4 times a week"
 * has no days, and "Mondays and Thursdays" has both but a *set*, not a count.
 * Optional fields would let an impossible state through — 0 times a week, or
 * Monday-and-Wednesday-with-a-target-of-3 — and the code reading it would have
 * to guess what the user meant.
 *
 * - `daily` is the default, and what every habit saved before this feature
 *   existed is treated as, so old data needs no migration step of its own.
 * - `timesPerWeek` is a flexible target: any `times` days in the week count,
 *   which day is up to you.
 * - `weekdays` is a fixed pattern: only those days count, and skipping one
 *   breaks the week the same way missing a day breaks a daily streak.
 */
export type Schedule =
  | { kind: 'daily' }
  | { kind: 'timesPerWeek'; times: number }
  | { kind: 'weekdays'; days: Weekday[] }

/** A habit the user is trying to keep. */
export interface Habit {
  /** Stable unique id, generated at creation time. */
  id: string
  /** What the habit is called, e.g. "Drink water". */
  name: string
  /** The emoji shown on the habit card, e.g. "💧". */
  emoji: string
  /**
   * How often it should be done.
   *
   * Required here even though data saved before this feature existed has no
   * such field: `schedule` is what the running app works with, and the version
   * in `localStorage` is a separate, looser shape that `localStore` upgrades on
   * the way in. Making the field optional here would push a `?? daily` into
   * every component that reads it, and one of them would eventually be missed.
   */
  schedule: Schedule
  /** ISO date strings (YYYY-MM-DD) on which this habit was completed. */
  completedOn: string[]
}

/** The full contents of localStorage: every habit plus the chosen date. */
export interface AppData {
  habits: Habit[]
}

/**
 * A habit as it may be found in `localStorage`: the same thing, but with
 * `schedule` missing or malformed because it was written by an older version
 * of the app, or hand-edited. Only `localStore` deals in this shape, and only
 * to turn it into a `Habit`.
 */
export type StoredHabit = Omit<Habit, 'schedule'> & { schedule?: unknown }
