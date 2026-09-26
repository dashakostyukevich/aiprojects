// One habit as a row: name on the left, then 31 circles, one per day,
// oldest on the left and today on the right.
//
// The row is a dumb component like the other ones. It does not know what
// "completedOn" means, it just knows which of the days it was given are in
// the done set, and it calls `onToggleDay` when a circle is clicked.

import HabitMenu from './HabitMenu.tsx'
import { formatDayMonth, isToday } from '../lib/dates.ts'

interface HabitRowProps {
  /** The habit's name, e.g. "Drink water". */
  name: string
  /** The habit's emoji, shown next to the name. */
  emoji: string
  /** Every day the row shows, oldest first, ending today. */
  days: string[]
  /** Which of those days were completed, as "YYYY-MM-DD" strings. */
  completedOn: string[]
  /** Called with the ISO date of the circle that was clicked. */
  onToggleDay: (date: string) => void
  /** Called when "Rename" is pressed, to swap this row for a form. */
  onEdit: () => void
  /** Called when delete is confirmed. Removes the habit and its history. */
  onDelete: () => void
}

export default function HabitRow({
  name,
  emoji,
  days,
  completedOn,
  onToggleDay,
  onEdit,
  onDelete,
}: HabitRowProps) {
  // A Set for lookup: `includes` on an array is O(n), and this runs 31 times
  // per habit per render.
  const done = new Set(completedOn)
  const doneCount = days.filter((day) => done.has(day)).length

  return (
    <article className="habit-row">
      <div className="habit-row-label">
        <span className="habit-row-emoji" aria-hidden="true">
          {emoji}
        </span>
        <h3 className="habit-row-name">{name}</h3>
        <p className="habit-row-count">
          {doneCount} / {days.length}
        </p>
      </div>

      <ol className="habit-row-days">
        {days.map((day) => {
          const isDone = done.has(day)

          return (
            <li key={day} className="row-day">
              <button
                type="button"
                className={[
                  'row-dot',
                  isDone ? 'row-dot--done' : '',
                  isToday(day) ? 'row-dot--today' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onToggleDay(day)}
                aria-pressed={isDone}
                // The circle itself shows no text, so the accessible name has
                // to carry the date and the state.
                aria-label={`${name} on ${formatDayMonth(day)}${
                  isDone ? ', done' : ', not done'
                }`}
                title={`${formatDayMonth(day)} — click to ${isDone ? 'undo' : 'mark done'}`}
              />
            </li>
          )
        })}
      </ol>

      {/* After the days, not in the label: the menu belongs at the end of the
          row's reading direction. The CSS makes it sticky to the right edge,
          so it stays reachable without scrolling the 31 days. */}
      <HabitMenu
        name={name}
        onEdit={onEdit}
        onDelete={onDelete}
        variant="compact"
      />
    </article>
  )
}
