/*
  Date helpers for the monthly calendar.

  ## The timezone rule this file follows

  A date like "2026-03-18" is a calendar day, not an instant in time. It has
  no timezone attached, and that is the point. The two mistakes that cause
  off-by-one-day bugs are both avoided here:

  1. `new Date("2026-03-18")` parses as UTC midnight, but `getDate()` reads it
     back in local time. In New York that is March 17. So plain strings are
     never handed to the Date constructor.
  2. Building dates with the local `new Date(y, m, d)` and then reading them
     back with `getUTC*` (or the reverse) mixes the two systems.

  Instead, every date here is built with Date.UTC and read back with getUTC*.
  Both halves use the same clock, so the result is identical everywhere — in
  Auckland, Lisbon, or Los Angeles. The only local-time call in the whole file
  is `todayISO()`, and that is deliberate: "today" means today *where you are*.
*/

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

/** Three-letter month, for the compact date labels in the post list. */
const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

/** Monday first, matching the calendar's column order. */
export const WEEKDAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

/** How many days in a month. Day 0 of the next month is this month's last day. */
export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
}

/** Builds "2026-03-18". Month is 0-based, matching Date. */
export function toISO(year: number, month: number, day: number): string {
  const mm = String(month + 1).padStart(2, "0")
  const dd = String(day).padStart(2, "0")
  return `${year}-${mm}-${dd}`
}

/** Splits "2026-03-18" into numbers, or returns null if it isn't that shape. */
export function parseISO(iso: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])

  // Reject impossible dates such as 2026-02-31, so bad data can't reach the grid.
  if (month < 0 || month > 11) return null
  if (day < 1 || day > daysInMonth(year, month)) return null

  return { year, month, day }
}

export function isValidISO(iso: string): boolean {
  return parseISO(iso) !== null
}

/** "2026-03-18" -> "Mar 18". Returns the input unchanged if it isn't a date. */
export function toReadableDate(iso: string): string {
  const parts = parseISO(iso)
  if (!parts) return iso
  return `${MONTH_SHORT[parts.month]} ${parts.day}`
}

/** "March 2026", for the calendar heading. Month is 0-based. */
export function monthLabel(year: number, month: number): string {
  return `${MONTH_NAMES[month]} ${year}`
}

/** Today, as "2026-10-17". The one place local time is used on purpose. */
export function todayISO(): string {
  const now = new Date()
  return toISO(now.getFullYear(), now.getMonth(), now.getDate())
}

/** Adds days to an ISO date. `amount` may be negative. */
export function addDays(iso: string, amount: number): string {
  const parts = parseISO(iso)
  if (!parts) return iso

  const date = new Date(Date.UTC(parts.year, parts.month, parts.day + amount))
  return toISO(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  )
}

/**
 * Steps a month forward or back, keeping the year in step.
 * Going back from January lands on the December before, not January again.
 */
export function addMonths(
  year: number,
  month: number,
  amount: number,
): { year: number; month: number } {
  const date = new Date(Date.UTC(year, month + amount, 1))
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() }
}

/** Which calendar column an ISO date sits in: 0 = Monday ... 6 = Sunday. */
export function weekdayIndex(iso: string): number {
  const parts = parseISO(iso)
  if (!parts) return 0

  // getUTCDay gives 0 = Sunday. Shifting by 6 turns that into 0 = Monday.
  const sundayFirst = new Date(
    Date.UTC(parts.year, parts.month, parts.day),
  ).getUTCDay()
  return (sundayFirst + 6) % 7
}

/** One square of the calendar grid. */
export interface CalendarDay {
  /** "2026-03-18" */
  iso: string
  /** Day of the month, for printing. */
  day: number
  /** False for the greyed-out days borrowed from the neighbouring months. */
  inMonth: boolean
  /** True for today, so it can be highlighted. */
  isToday: boolean
}

/**
 * Builds every square the month needs, Monday first.
 *
 * The grid starts on the Monday on or before the 1st, which is why the first
 * row often shows days from the previous month. It ends on the Sunday on or
 * after the last day, so the last row can spill into the next month. The
 * result is always whole weeks — 4, 5, or 6 rows depending on the month.
 */
export function buildMonthGrid(year: number, month: number): CalendarDay[] {
  const first = toISO(year, month, 1)
  const leading = weekdayIndex(first)
  const weeks = Math.ceil((leading + daysInMonth(year, month)) / 7)

  const today = todayISO()
  const thisMonth = first.slice(0, 7) // "2026-03"

  const days: CalendarDay[] = []
  for (let index = 0; index < weeks * 7; index += 1) {
    // Counting back from the 1st by the offset of each square covers the
    // leading days of the previous month too, so there is nothing to
    // special-case at the month boundary.
    const iso = addDays(first, index - leading)

    days.push({
      iso,
      day: Number(iso.slice(8, 10)),
      inMonth: iso.slice(0, 7) === thisMonth,
      isToday: iso === today,
    })
  }

  return days
}
