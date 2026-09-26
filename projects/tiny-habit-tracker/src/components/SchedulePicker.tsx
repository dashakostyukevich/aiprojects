// Picks how often a habit should be done, inside the add/rename form.
//
// Three kinds, one component, because they are one decision with three shapes:
// every day, a number of times a week, or fixed weekdays. Picking a kind swaps
// which of the two sub-controls is showing, and each keeps its own value, so
// switching daily -> times -> weekdays and back does not lose what you chose.
//
// The picker is controlled: `schedule` and `onChange` come from the form, which
// owns the value like it owns the name. Nothing here holds state.

import {
  DAILY,
  TIMES_PER_WEEK_OPTIONS,
  WEEKDAY_CHOICES,
  describe,
} from '../lib/schedule.ts'
import type { Schedule, Weekday } from '../types.ts'

interface SchedulePickerProps {
  /** The schedule currently chosen. */
  value: Schedule
  /** Called with the new schedule whenever anything is picked. */
  onChange: (schedule: Schedule) => void
  /** `picker` for a radio group of buttons, `group` for the chip rows. */
  labelledBy: string
}

export default function SchedulePicker({
  value,
  onChange,
  labelledBy,
}: SchedulePickerProps) {
  /** The kinds offered, in the order they are shown. */
  const kinds: Array<{ kind: Schedule['kind']; label: string }> = [
    { kind: 'daily', label: 'Every day' },
    { kind: 'timesPerWeek', label: 'Times a week' },
    { kind: 'weekdays', label: 'Certain days' },
  ]

  function chooseKind(kind: Schedule['kind']) {
    if (kind === 'daily') {
      onChange(DAILY)
      return
    }

    if (kind === 'timesPerWeek') {
      // Carry the current weekly target across, so switching from a Mon/Wed/Fri
      // habit to "times a week" starts at 3 rather than 1 — which is the number
      // that habit was already aiming for.
      onChange({ kind: 'timesPerWeek', times: carriedTarget() })
      return
    }

    // Same idea in reverse: picking weekdays after a count starts from the same
    // number of days, the next ones in the week.
    onChange({ kind: 'weekdays', days: firstDays(carriedTarget()) })
  }

  /** The weekly target to carry across when the kind of schedule changes. */
  function carriedTarget(): number {
    return value.kind === 'weekdays' ? value.days.length : 3
  }

  function toggleWeekday(day: Weekday) {
    if (value.kind !== 'weekdays') return

    const picked = value.days.includes(day)
      ? value.days.filter((other) => other !== day)
      : [...value.days, day].sort((a, b) => a - b)

    // The last day cannot be taken off: a habit scheduled for no days at all
    // has no target, so there would be nothing left to show or count towards.
    if (picked.length === 0) return

    onChange({ kind: 'weekdays', days: picked })
  }

  return (
    <div className="schedule-picker" role="group" aria-labelledby={labelledBy}>
      {/* A row of mutually exclusive choices, so a radio group says what a row
          of buttons cannot: that picking one cancels the others. The inputs are
          visually hidden rather than `display: none`, which would take them out
          of the tab order. */}
      <div className="schedule-kinds">
        {kinds.map((option) => {
          const id = `${labelledBy}-${option.kind}`
          return (
            <div className="schedule-kind" key={option.kind}>
              <input
                type="radio"
                id={id}
                name={labelledBy}
                className="schedule-kind-input"
                checked={value.kind === option.kind}
                onChange={() => chooseKind(option.kind)}
              />
              <label className="schedule-kind-label" htmlFor={id}>
                {option.label}
              </label>
            </div>
          )
        })}
      </div>

      {value.kind === 'timesPerWeek' && (
        <div className="schedule-option" aria-label="Times per week">
          {TIMES_PER_WEEK_OPTIONS.map((times) => (
            <button
              key={times}
              type="button"
              className="schedule-chip"
              aria-pressed={value.times === times}
              onClick={() => onChange({ kind: 'timesPerWeek', times })}
            >
              {times}
            </button>
          ))}
        </div>
      )}

      {value.kind === 'weekdays' && (
        <div className="schedule-option" aria-label="Days of the week">
          {WEEKDAY_CHOICES.map((day) => (
            <button
              key={day.value}
              type="button"
              className="schedule-chip"
              aria-pressed={value.days.includes(day.value)}
              onClick={() => toggleWeekday(day.value)}
              // A bare "Mon" button says nothing about what it does, and the
              // pressed state is what the dot pattern depends on.
              aria-label={`${day.label} — ${
                value.days.includes(day.value) ? 'scheduled' : 'not scheduled'
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      )}

      {/* Says the schedule back in a sentence, so the choice never has to be
          inferred from which chips are lit. */}
      <p className="schedule-summary">{describe(value)}</p>
    </div>
  )
}

/** The first `count` weekdays, Monday first. */
function firstDays(count: number): Weekday[] {
  return WEEKDAY_CHOICES.slice(0, Math.min(count, WEEKDAY_CHOICES.length)).map(
    (day) => day.value,
  )
}
