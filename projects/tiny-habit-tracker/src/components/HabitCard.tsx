// One habit, as a card.
//
// Props (the values a parent passes in) are listed in `HabitCardProps`.
// The card is "dumb" on purpose: it shows what it is given and calls
// `onComplete` when the button is pressed. It holds no state of its own.

import HabitMenu from './HabitMenu.tsx'

interface HabitCardProps {
  /** The emoji shown on the left, e.g. "💧". */
  emoji: string
  /** The habit's name, e.g. "Drink water". */
  name: string
  /** How often it should be done, in words, e.g. "3× a week". */
  goal: string
  /**
   * Times done so far this week, and the weekly target. Null hides the line
   * entirely, which is what a daily habit does: "7 of 7 this week" is noise on
   * a habit you are meant to do every single day.
   */
  week: { done: number; target: number } | null
  /** How many days in a row it has been done. 0 means the streak is broken. */
  streak: number
  /**
   * The unit the streak is counted in: 'day' for a daily habit, 'week' for one
   * with a weekly target. Passed in rather than worked out here, so the number
   * and its unit can never disagree.
   */
  streakUnit: 'day' | 'week'
  /** Whether today is already done. */
  doneToday: boolean
  /** Called when the "Done" button is pressed. */
  onComplete: () => void
  /** Called when Rename is chosen from the overflow menu. */
  onEdit: () => void
  /** Called when delete is confirmed. Removes the habit and its history. */
  onDelete: () => void
}

export default function HabitCard({
  emoji,
  name,
  goal,
  week,
  streak,
  streakUnit,
  doneToday,
  onComplete,
  onEdit,
  onDelete,
}: HabitCardProps) {
  return (
    <article className={`habit${doneToday ? ' habit--done' : ''}`}>
      <span className="habit-emoji" aria-hidden="true">
        {emoji}
      </span>

      <div className="habit-text">
        <h3 className="habit-name">{name}</h3>

        {/* The schedule and the progress towards it, on one line: "3× a week ·
           2 of 3 this week". Two separate lines for a card this size pushes
           everything else down. The two halves never break internally — the
           separator is the only place a wrap is allowed, so a narrow card reads
           "3× a week ·" then "1 of 3 this week" rather than splitting the
           phrase across three lines. */}
        <p className="habit-goal">
          <span className="habit-goal-part">{goal}</span>
          {week && (
            <span
              className={[
                'habit-goal-part',
                week.done >= week.target ? 'habit-goal-met' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {/* Inside the second half, not between the two: the halves are
                  flex items, so a separator between them can be left stranded
                  on a line of its own when the card is narrow. Here it travels
                  with the text it introduces. aria-hidden because the pause is
                  punctuation, and a screen reader announcing "middle dot" is
                  noise. */}
              <span aria-hidden="true">· </span>
              {week.done} of {week.target} this week
            </span>
          )}
        </p>

        <p className="habit-streak">
          {streak > 0 ? (
            <>
              <span aria-hidden="true">🔥</span> {streak} {streakUnit} streak
            </>
          ) : (
            // "start today" would be wrong advice for a weekly habit: the thing
            // that starts a week streak is the first day you get to it, not any
            // particular day.
            `No streak yet — start this ${streakUnit}`
          )}
        </p>
      </div>

      <HabitMenu name={name} onEdit={onEdit} onDelete={onDelete} />

      <button
        type="button"
        className="habit-button"
        onClick={onComplete}
        aria-pressed={doneToday}
      >
        {doneToday ? 'Done ✓' : 'Done'}
      </button>
    </article>
  )
}
