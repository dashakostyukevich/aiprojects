import { useState } from 'react'
import HabitCard from './components/HabitCard.tsx'
import HabitForm from './components/HabitForm.tsx'
import HabitRow from './components/HabitRow.tsx'
import WeekStrip from './components/WeekStrip.tsx'
import { DAYS_IN_ROW, lastDays, todayISO } from './lib/dates.ts'
import { DAILY, countStreak, describe, weekProgress } from './lib/schedule.ts'
import { hasSavedData, load, save } from './storage/localStore.ts'
import type { Habit, Schedule } from './types.ts'
import './App.css'

// Which of the two layouts is showing. Kept in App because both layouts read
// the same habits, and only one is on screen at a time.
type View = 'today' | 'history'

// Shown on a first visit, so the app is not an empty screen. The moment the
// user adds, renames or deletes anything, this is never used again. All daily:
// a starter list that mixes schedule kinds would be demonstrating the feature
// rather than helping the user get started.
const starterHabits: Habit[] = [
  { id: '1', name: 'Drink water', emoji: '💧', schedule: DAILY, completedOn: [] },
  { id: '2', name: 'Read 10 pages', emoji: '📚', schedule: DAILY, completedOn: [] },
  { id: '3', name: 'Go for a walk', emoji: '🚶', schedule: DAILY, completedOn: [] },
]

/**
 * Ids only have to be unique within this browser's saved data, so the simplest
 * thing that will not collide is enough. `randomUUID` is available in every
 * browser this app targets, and unlike Date.now() it cannot produce two equal
 * ids when two habits are added in the same millisecond.
 */
function newId(): string {
  return crypto.randomUUID()
}

/**
 * Read once, on the very first render. Doing this in a useState initializer
 * rather than an effect means there is no flash of starter habits followed by
 * a second render, and no risk of saving over real data before it is read.
 */
function initialHabits(): Habit[] {
  // hasSavedData() is what separates "first ever visit" from "the user deleted
  // every habit". Without it, deleting all of them would bring the starters
  // back on the next reload.
  if (!hasSavedData()) return starterHabits

  const stored = load().habits
  return stored.length > 0 ? stored : []
}

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits)
  const [view, setView] = useState<View>('today')

  // The add form and the rename form are never open at the same time: both
  // write to the same list, and two forms competing for the keyboard is
  // confusing. One of these three is null at any moment.
  const [adding, setAdding] = useState(false)
  /** Id of the habit being renamed, or null. */
  const [editingId, setEditingId] = useState<string | null>(null)

  // Recomputed per render so the row always ends on the real today, even if
  // the tab was left open across midnight.
  const days = lastDays(DAYS_IN_ROW)
  const today = todayISO()

  /**
   * The one place habits change. Every edit goes through here so that saving
   * can never be forgotten: the alternative is a `save()` call per action,
   * and one of them eventually gets missed.
   */
  function commit(next: Habit[]) {
    setHabits(next)
    save({ habits: next })
  }

  function addHabit(name: string, emoji: string, schedule: Schedule) {
    // New habits start with no history. completedOn is never copied from
    // anything, so a new habit cannot inherit a streak it never earned — which
    // matters more now that a streak is measured against a schedule.
    commit([...habits, { id: newId(), name, emoji, schedule, completedOn: [] }])
    setAdding(false)
  }

  function renameHabit(id: string, name: string, emoji: string, schedule: Schedule) {
    commit(
      habits.map((habit) =>
        // The schedule is editable in the same form as the name, because it is
        // part of the same decision: "Go for a walk, 3 times a week".
        habit.id === id ? { ...habit, name, emoji, schedule } : habit,
      ),
    )
    setEditingId(null)
  }

  function deleteHabit(id: string) {
    // The whole habit goes, including completedOn. There is no undo, which is
    // why HabitMenu asks twice first.
    commit(habits.filter((habit) => habit.id !== id))
    // The deleted habit may have been the one being renamed.
    if (editingId === id) setEditingId(null)
  }

  function toggleDay(habitId: string, date: string) {
    // Computed from the render's `habits`, not inside a setState updater:
    // updaters should stay pure, and this runs from a click handler where
    // `habits` is already the current value.
    commit(
      habits.map((habit) => {
        if (habit.id !== habitId) return habit

        const isDone = habit.completedOn.includes(date)
        return {
          ...habit,
          // Keep the list sorted so the saved JSON does not grow unordered
          // noise as dates are toggled on and off.
          completedOn: isDone
            ? habit.completedOn.filter((day) => day !== date)
            : [...habit.completedOn, date].sort(),
        }
      }),
    )
  }

  // Toggling today through the card list and the history row should be the
  // same action, so both go through toggleDay.
  function toggleToday(habitId: string) {
    toggleDay(habitId, today)
  }

  function startAdding() {
    setAdding(true)
    setEditingId(null)
  }

  function startEditing(id: string) {
    setEditingId(id)
    setAdding(false)
  }

  function cancelForm() {
    setAdding(false)
    setEditingId(null)
  }

  return (
    <div className={`app app--${view}`}>
      <header className="header">
        <h1 className="header-title">Tiny Habits</h1>
        <p className="header-subtitle">Small things, every day.</p>
      </header>

      <nav className="view-toggle" aria-label="Choose a view">
        <button
          type="button"
          className="view-toggle-button"
          onClick={() => setView('today')}
          aria-pressed={view === 'today'}
        >
          Today
        </button>
        <button
          type="button"
          className="view-toggle-button"
          onClick={() => setView('history')}
          aria-pressed={view === 'history'}
        >
          Last {DAYS_IN_ROW} days
        </button>
      </nav>

      {view === 'today' ? (
        <>
          <WeekStrip />

          <main className="habits">
            <h2 className="habits-title">Today</h2>

            {habits.length === 0 ? (
              <p className="empty-note">
                No habits yet. Add your first one below.
              </p>
            ) : (
              <ul className="habits-list">
                {habits.map((habit) =>
                  editingId === habit.id ? (
                    <li key={habit.id}>
                      <HabitForm
                        initialName={habit.name}
                        initialEmoji={habit.emoji}
                        initialSchedule={habit.schedule}
                        submitLabel="Save"
                        onSubmit={(name, emoji, schedule) =>
                          renameHabit(habit.id, name, emoji, schedule)
                        }
                        onCancel={cancelForm}
                      />
                    </li>
                  ) : (
                    <li key={habit.id}>
                      <HabitCard
                        emoji={habit.emoji}
                        name={habit.name}
                        goal={describe(habit.schedule)}
                        week={weeklyLine(habit, today)}
                        streak={countStreak(habit.completedOn, habit.schedule, today)}
                        streakUnit={habit.schedule.kind === 'daily' ? 'day' : 'week'}
                        doneToday={habit.completedOn.includes(today)}
                        onComplete={() => toggleToday(habit.id)}
                        onEdit={() => startEditing(habit.id)}
                        onDelete={() => deleteHabit(habit.id)}
                      />
                    </li>
                  ),
                )}
              </ul>
            )}

            {adding ? (
              <HabitForm
                submitLabel="Add"
                onSubmit={addHabit}
                onCancel={cancelForm}
              />
            ) : (
              <button type="button" className="add-button" onClick={startAdding}>
                <span aria-hidden="true">＋</span> Add habit
              </button>
            )}
          </main>
        </>
      ) : (
        <main className="history">
          <h2 className="habits-title">Last {DAYS_IN_ROW} days</h2>

          {habits.length === 0 ? (
            <p className="empty-note">No habits yet. Add one from the Today view.</p>
          ) : (
            <div className="history-scroll">
              <ul className="history-list">
                {habits.map((habit) =>
                  // Renaming happens in the same place in both views, so the
                  // form takes the row's spot rather than opening somewhere
                  // else on the page.
                  editingId === habit.id ? (
                    <li key={habit.id}>
                      <HabitForm
                        initialName={habit.name}
                        initialEmoji={habit.emoji}
                        initialSchedule={habit.schedule}
                        submitLabel="Save"
                        onSubmit={(name, emoji, schedule) =>
                          renameHabit(habit.id, name, emoji, schedule)
                        }
                        onCancel={cancelForm}
                      />
                    </li>
                  ) : (
                    <li key={habit.id}>
                      <HabitRow
                        name={habit.name}
                        emoji={habit.emoji}
                        days={days}
                        completedOn={habit.completedOn}
                        onToggleDay={(date) => toggleDay(habit.id, date)}
                        onEdit={() => startEditing(habit.id)}
                        onDelete={() => deleteHabit(habit.id)}
                      />
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}

          <p className="history-hint">
            Oldest day on the left, today on the right. Click a circle to mark
            that day done or undo it.
          </p>
        </main>
      )}
    </div>
  )
}

/**
 * The "2 of 3 this week" line, or null for a daily habit.
 *
 * Null rather than a number, because a daily habit's week is 7 of 7 by
 * definition and saying so every day is just noise. Decided here rather than in
 * the card so the "is this worth showing" rule sits next to weekProgress().
 */
function weeklyLine(
  habit: Habit,
  today: string,
): { done: number; target: number } | null {
  if (habit.schedule.kind === 'daily') return null

  const { done, target } = weekProgress(habit.completedOn, habit.schedule, today)
  return { done, target }
}
