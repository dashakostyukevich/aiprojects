// Everything about "how often is this habit meant to be done".
//
// Kept out of App.tsx and out of the components for the same reason date maths
// lives in dates.ts: the rule for what counts as a good week, and the wording
// for it, are decisions that several components need to agree on. When the same
// comparison is written twice, one copy is always out of date.
//
// Three questions are answered here, and only these three:
//
//   1. What is the weekly target?        -> `weeklyTarget`
//   2. How is it worded on screen?       -> `describe`
//   3. Is it met, and for how long?      -> `weekProgress`, `countStreak`
//
// A habit is tracked the same way whatever its schedule: `completedOn` is a
// list of days it was done. The schedule only changes what those days are
// *worth*, which is why nothing about storage, the 31-day history view or the
// Done button had to change. A day you did not need is simply a day you can
// tick, and ticking it never hurts.

import { addDays, startOfWeek, todayISO, weekDays, weekdayOf } from './dates.ts'
import type { Schedule, Weekday } from '../types.ts'

/** The schedule every habit gets unless the user picks something else. */
export const DAILY: Schedule = { kind: 'daily' }

/** Choices offered for "times a week". 1 is left out on purpose. */
export const TIMES_PER_WEEK_OPTIONS = [2, 3, 4, 5, 6] as const

/** The weekday chips, Monday first, which is the order weeks are counted in. */
export const WEEKDAY_CHOICES: ReadonlyArray<{ value: Weekday; label: string }> = [
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
  { value: 0, label: 'Sun' },
]

/** One place that turns an unknown value from storage into a usable schedule. */
export function normaliseSchedule(value: unknown): Schedule {
  if (typeof value !== 'object' || value === null) return DAILY

  const { kind } = value as { kind?: unknown }
  if (kind === 'daily') return DAILY

  if (kind === 'timesPerWeek') {
    const { times } = value as { times?: unknown }
    // Clamped rather than rejected: a target of 0 or 99 from a hand-edited file
    // should still give a habit you can actually use, not an empty app.
    if (typeof times !== 'number' || !Number.isFinite(times)) return DAILY
    return { kind: 'timesPerWeek', times: clampTimes(times) }
  }

  if (kind === 'weekdays') {
    const { days } = value as { days?: unknown }
    if (!Array.isArray(days)) return DAILY

    const cleaned = days.filter(isWeekday)
    // Every day selected means every day, which is `daily` — saying it as seven
    // chips would work but would then count differently for streaks.
    if (cleaned.length === 0 || cleaned.length === 7) return DAILY
    // Sorted so equal sets always serialise the same way.
    return { kind: 'weekdays', days: [...cleaned].sort((a, b) => a - b) as Weekday[] }
  }

  return DAILY
}

function isWeekday(value: unknown): value is Weekday {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 6
}

/** Keeps a weekly target inside the range the UI can actually produce. */
export function clampTimes(times: number): number {
  return Math.min(7, Math.max(1, Math.round(times)))
}

/**
 * How many times a week this habit should be done.
 *
 * `daily` is 7, and `weekdays` is however many days were picked. Note that a
 * `timesPerWeek` habit and a `weekdays` habit with the same number are *not*
 * the same thing: "4 times a week" lets you do them all on Monday, while
 * "Mon, Tue, Wed, Thu" requires spreading them out. The number is the same, the
 * streak is not.
 */
export function weeklyTarget(schedule: Schedule): number {
  switch (schedule.kind) {
    case 'daily':
      return 7
    case 'timesPerWeek':
      return schedule.times
    case 'weekdays':
      return schedule.days.length
  }
}

/** How often this habit is meant to be done, in words for the card and form. */
export function describe(schedule: Schedule): string {
  switch (schedule.kind) {
    case 'daily':
      return 'Every day'
    case 'timesPerWeek':
      return `${schedule.times}× a week`
    case 'weekdays': {
      const names = WEEKDAY_CHOICES.filter((day) =>
        schedule.days.includes(day.value),
      ).map((day) => day.label)
      return names.join(', ')
    }
  }
}

/** "1 day" / "3 days", so the card never says "1 days". */
export function pluralDays(count: number): string {
  return `${count} ${count === 1 ? 'day' : 'days'}`
}

/** How far this habit is through the current week. */
export interface WeekProgress {
  /** Times done between Monday and today. */
  done: number
  /** What the week is aiming for. */
  target: number
  /** True once `done` has reached `target`, even mid-week. */
  met: boolean
}

/**
 * Progress through the week containing `today`.
 *
 * Only days up to today count. The rest of the week has not happened yet, and
 * counting it would let a target be "met" on Monday by days that do not exist.
 */
export function weekProgress(
  completedOn: string[],
  schedule: Schedule,
  today: string = todayISO(),
): WeekProgress {
  const done = new Set(completedOn)
  const elapsed = weekDays(today).filter((day) => day <= today)
  const count = elapsed.filter((day) => done.has(day)).length
  const target = weeklyTarget(schedule)

  return { done: count, target, met: count >= target }
}

/** True when the days picked for this habit include the given date. */
export function isScheduledDay(schedule: Schedule, iso: string): boolean {
  if (schedule.kind === 'daily') return true
  if (schedule.kind === 'timesPerWeek') return true
  return schedule.days.includes(weekdayOf(iso) as Weekday)
}

/**
 * How many consecutive weeks ending this week hit the target.
 *
 * A `daily` habit keeps the day streak it always had: "12 days in a row" is
 * more encouraging and more honest than "1 week in a row", and for a habit done
 * every day the two numbers are not even comparable. Every other schedule is
 * counted in weeks, because a day is not the unit of success for a habit done
 * three times a week.
 *
 * The current week is allowed to be short of target without breaking anything,
 * for the same reason today is allowed to be empty in a day streak: it is not
 * over yet. Once it does reach target, it counts as week one.
 */
export function countStreak(
  completedOn: string[],
  schedule: Schedule,
  today: string = todayISO(),
): number {
  if (schedule.kind === 'daily') return countDayStreak(completedOn, today)

  const done = new Set(completedOn)
  const target = weeklyTarget(schedule)
  const thisWeek = startOfWeek(today)

  let cursor = thisWeek
  let streak = 0

  // Seed from the current week, then walk backwards. The `if` rather than a
  // `while` is what stops an unfinished current week from zeroing the streak.
  if (weekMet(done, cursor, target)) {
    streak = 1
    cursor = addDays(cursor, -7)
  } else {
    cursor = addDays(cursor, -7)
  }

  while (weekMet(done, cursor, target)) {
    streak += 1
    cursor = addDays(cursor, -7)
  }

  return streak
}

/** Did the seven days starting at `weekStart` reach `target` completions? */
function weekMet(done: Set<string>, weekStart: string, target: number): boolean {
  let count = 0
  for (let index = 0; index < 7; index += 1) {
    if (done.has(addDays(weekStart, index))) count += 1
  }
  return count >= target
}

/**
 * How many consecutive days ending today are done. A gap or a day that has
 * not happened yet both end the streak, so 0 means "nothing recent".
 */
function countDayStreak(completedOn: string[], today: string): number {
  if (completedOn.length === 0) return 0

  const done = new Set(completedOn)
  let streak = 0

  // Walk back from today one day at a time. Today itself is allowed to be
  // missing: the day is not over yet, so that should not break the streak.
  let cursor = today
  if (!done.has(cursor)) {
    cursor = addDays(cursor, -1)
    if (!done.has(cursor)) return 0
  }

  while (done.has(cursor)) {
    streak += 1
    cursor = addDays(cursor, -1)
  }

  return streak
}
