// The ONLY file in the app that touches localStorage.
//
// Why one file: the rest of the app just calls load() and save(). If storage
// ever changes (different key, IndexedDB, a real backend), you edit this file
// and nothing else.
//
// Storage is text, so everything goes in as a JSON string and comes back out
// parsed. Two things can go wrong and both are handled here:
//   1. nothing saved yet  -> return the fallback (a fresh empty state)
//   2. saved data corrupt  -> fall back too, instead of crashing the app
//
// It also owns *upgrading* what comes out. The shape on disk is allowed to be
// older or hand-mangled; the shape handed to the app is not. That is the whole
// reason this file exists rather than a bare `JSON.parse` at the call site.

import { DAILY, normaliseSchedule } from '../lib/schedule.ts'
import type { AppData, Habit, StoredHabit } from '../types.ts'

/** Key everything is stored under. Namespaced so it cannot clash. */
const KEY = 'tiny-habit-tracker/data'

/** Shape returned when there is nothing usable in storage yet. */
export function emptyData(): AppData {
  return { habits: [] }
}

export function load(): AppData {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw === null) return emptyData()

    const parsed: unknown = JSON.parse(raw)
    const stored = asStoredHabits(parsed)
    if (stored === null) return emptyData()

    // Upgraded on the way in, so nothing downstream ever sees a missing or
    // broken `schedule`. The upgraded data is not written back here: doing that
    // on every load would mean a write on every page load, and the next save
    // from any click rewrites the whole object anyway.
    return { habits: stored.map(upgradeHabit) }
  } catch (error) {
    // Corrupt JSON, or storage blocked (private mode, disabled cookies).
    console.warn('Could not read saved data, starting fresh.', error)
    return emptyData()
  }
}

/**
 * Has anything ever been saved?
 *
 * This exists because "nothing saved yet" and "saved, but the user deleted
 * every habit" are different states that `load()` reports identically: both
 * come back as `habits: []`. Without this check, deleting all your habits
 * would make the app fall back to the starter list again on the next reload.
 */
export function hasSavedData(): boolean {
  try {
    return localStorage.getItem(KEY) !== null
  } catch {
    // Storage blocked: treat as first run, the starter list is a fine answer.
    return false
  }
}

export function save(data: AppData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch (error) {
    // Quota exceeded, or storage blocked. The app keeps working in memory.
    console.warn('Could not save data.', error)
  }
}

/**
 * Narrowing check: is this parsed value a list of habits at all?
 *
 * Returns the habits as the *loose* stored shape. Every field the app relies on
 * is checked, because a half-written or hand-edited entry would otherwise reach
 * the components and crash on `habit.completedOn.includes(...)`, taking the
 * whole app down with it.
 *
 * `schedule` is deliberately not checked here: it did not exist in older saved
 * data, and a habit missing it is normal, not corrupt. It is filled in by
 * `upgradeHabit` instead, which is also the only place that decides what a
 * missing schedule means.
 */
function asStoredHabits(value: unknown): StoredHabit[] | null {
  if (typeof value !== 'object' || value === null) return null
  const { habits } = value as { habits?: unknown }
  if (!Array.isArray(habits)) return null

  const everyHabitIsSane = habits.every(
    (habit): habit is StoredHabit =>
      typeof habit === 'object' &&
      habit !== null &&
      typeof (habit as StoredHabit).id === 'string' &&
      typeof (habit as StoredHabit).name === 'string' &&
      typeof (habit as StoredHabit).emoji === 'string' &&
      Array.isArray((habit as StoredHabit).completedOn) &&
      (habit as StoredHabit).completedOn.every((day) => typeof day === 'string'),
  )

  return everyHabitIsSane ? habits : null
}

/** Stored shape -> the shape the app uses, with a usable schedule. */
function upgradeHabit(habit: StoredHabit): Habit {
  return {
    id: habit.id,
    name: habit.name,
    emoji: habit.emoji,
    // A habit saved before schedules existed was, by definition, a daily one.
    schedule: habit.schedule === undefined ? DAILY : normaliseSchedule(habit.schedule),
    completedOn: habit.completedOn,
  }
}
