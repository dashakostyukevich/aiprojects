// All date handling lives here so the rest of the app never has to think
// about it. Two rules this file exists to enforce:
//
//  1. A "day" is a local calendar day, not a UTC instant. `toISOString()`
//     shifts the date across the day boundary for anyone east or west of
//     Greenwich, which would make habits land on the wrong day. So the ISO
//     string is always built from the local getFullYear/getMonth/getDate.
//  2. `completedOn` stores plain "YYYY-MM-DD" strings, exactly matching the
//     `Habit.completedOn` type. Comparing them as strings is a valid date
//     comparison, so no parsing is ever needed.

/** How many days each habit row shows. One circle per day. */
export const DAYS_IN_ROW = 31

/** Today's date as "YYYY-MM-DD", in the local timezone. */
export function todayISO(): string {
  return toISO(new Date())
}

/** A Date as "YYYY-MM-DD", read in local time on purpose. See note 1 above. */
export function toISO(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** The date `offset` days before `endISO`. Negative offsets move forward. */
export function addDays(endISO: string, offset: number): string {
  const date = fromISO(endISO)
  date.setDate(date.getDate() + offset)
  return toISO(date)
}

/** "YYYY-MM-DD" back to a local Date at midnight, avoiding UTC parsing. */
export function fromISO(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * The last `count` days, oldest first, ending today. This is the order the
 * circles render in: leftmost is 30 days ago, rightmost is today.
 */
export function lastDays(count: number, endISO: string = todayISO()): string[] {
  return Array.from({ length: count }, (_, index) => addDays(endISO, index - (count - 1)))
}

/** "2026-09-14" -> "14 Sep". Short enough to fit under a circle. */
export function formatDayMonth(iso: string): string {
  return fromISO(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

/** True when `iso` is today, used to highlight the last circle in each row. */
export function isToday(iso: string): boolean {
  return iso === todayISO()
}

/**
 * The Monday of the week `iso` falls in, as "YYYY-MM-DD".
 *
 * Weeks start on Monday because that is what `en-GB` and `toLocaleDateString`
 * already assume everywhere else in the app — the day labels in the history
 * rows come from the same locale, so a Sunday-start week here would disagree
 * with the weekday letters printed above the circles.
 */
export function startOfWeek(iso: string): string {
  const date = fromISO(iso)
  // getDay() is 0 for Sunday, so Monday is 1. The modulo turns Sunday (0) into
  // an offset of 6 rather than 0, which is what "days back to Monday" means.
  const sinceMonday = (date.getDay() + 6) % 7
  return addDays(iso, -sinceMonday)
}

/** Which day of the week `iso` is, 0 (Sunday) to 6 (Saturday). */
export function weekdayOf(iso: string): number {
  return fromISO(iso).getDay()
}

/** The seven days of the week `iso` falls in, Monday first. */
export function weekDays(iso: string): string[] {
  const monday = startOfWeek(iso)
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index))
}
