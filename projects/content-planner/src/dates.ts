/*
  Small date helpers. The weekly board covers 17–23 March, so "which column
  does this date belong to?" is a subtraction, not a real calendar problem.
*/

const MONTHS = [
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

/** The Monday of the displayed week. */
const WEEK_START_MONTH = 2 // Mar, counting from 0
const WEEK_START_DATE = 17

/**
 * Turn "2026-03-18" from a date input into "Mar 18" for display.
 * Splits on the hyphens rather than building a Date object.
 */
export function toReadableDate(value: string): string {
  const parts = value.split("-")
  if (parts.length !== 3) return value

  const monthName = MONTHS[Number(parts[1]) - 1]
  if (!monthName) return value

  // The day arrives as a string like "08"; Number drops the leading zero.
  return `${monthName} ${Number(parts[2])}`
}

/**
 * Which column of the weekly board this date lands in.
 * Returns 0–6 for Mon–Sun, or -1 if the date is outside the displayed week.
 */
export function toWeekDay(value: string): number {
  const parts = value.split("-")
  if (parts.length !== 3) return -1

  const month = Number(parts[1])
  const day = Number(parts[2])

  const isThisWeek =
    parts[0] === "2026" &&
    month === WEEK_START_MONTH + 1 &&
    day >= WEEK_START_DATE &&
    day <= WEEK_START_DATE + 6

  return isThisWeek ? day - WEEK_START_DATE : -1
}

/**
 * The other direction: turn a stored "Mar 18" back into "2026-03-18" so the
 * edit form can pre-fill the date input.
 * Returns "" for "Unscheduled" or anything unrecognised, which leaves the
 * date field empty.
 */
export function toInputDate(label: string): string {
  const parts = label.split(" ")
  if (parts.length !== 2) return ""

  const monthIndex = MONTHS.indexOf(parts[0])
  const day = Number(parts[1])
  if (monthIndex === -1 || Number.isNaN(day)) return ""

  // "03" and "18" — both need two digits.
  const month = String(monthIndex + 1).padStart(2, "0")
  return `2026-${month}-${String(day).padStart(2, "0")}`
}
