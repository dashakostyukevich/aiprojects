// The last 7 days, as a row of day dots.
//
// The days and the done/not-done states are hardcoded, because there is no
// data layer yet. When there is, this component will map over real dates
// instead of over this array — nothing else about it has to change.

interface Day {
  /** Single-letter weekday, e.g. "M" for Monday. */
  label: string
  /** Day of the month, e.g. "14". */
  date: string
  /** Whether the habit set was completed on this day. */
  done: boolean
}

const days: Day[] = [
  { label: 'M', date: '15', done: true },
  { label: 'T', date: '16', done: true },
  { label: 'W', date: '17', done: true },
  { label: 'T', date: '18', done: false },
  { label: 'F', date: '19', done: true },
  { label: 'S', date: '20', done: false },
  { label: 'S', date: '21', done: false },
]

export default function WeekStrip() {
  return (
    <section className="week" aria-label="This week's progress">
      <h2 className="week-title">This week</h2>

      <ol className="week-days">
        {days.map((day, index) => (
          <li
            key={day.date}
            className={[
              'day',
              day.done ? 'day--done' : '',
              index === days.length - 1 ? 'day--today' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className="day-label">{day.label}</span>
            <span className="day-dot" aria-hidden="true">
              {day.done ? '✓' : ''}
            </span>
            <span className="day-date">{day.date}</span>
            <span className="sr-only">
              {day.done ? 'completed' : 'not completed'}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
