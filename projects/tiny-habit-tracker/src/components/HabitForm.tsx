// The form for creating a habit and for renaming an existing one.
//
// One component for both, because they collect exactly the same values.
// The difference is only what gets passed in and what the button says, so
// splitting them would duplicate the whole form for no gain.

import { useId, useState } from 'react'
import EmojiPicker from './EmojiPicker.tsx'
import SchedulePicker from './SchedulePicker.tsx'
import { DEFAULT_EMOJI } from '../lib/emojis.ts'
import { DAILY } from '../lib/schedule.ts'
import type { Schedule } from '../types.ts'

interface HabitFormProps {
  /** Prefilled name when editing; empty when adding. */
  initialName?: string
  /** Prefilled emoji when editing; defaults to the first option when adding. */
  initialEmoji?: string
  /** Prefilled schedule when editing; every day when adding. */
  initialSchedule?: Schedule
  /** What the submit button says, e.g. "Add" or "Save". */
  submitLabel: string
  /** Called with the trimmed name, chosen emoji and chosen schedule. */
  onSubmit: (name: string, emoji: string, schedule: Schedule) => void
  /** Called on Cancel and on Escape. */
  onCancel: () => void
}

export default function HabitForm({
  initialName = '',
  initialEmoji = DEFAULT_EMOJI,
  initialSchedule = DAILY,
  submitLabel,
  onSubmit,
  onCancel,
}: HabitFormProps) {
  const [name, setName] = useState(initialName)
  const [emoji, setEmoji] = useState(initialEmoji)
  const [schedule, setSchedule] = useState<Schedule>(initialSchedule)

  // Two forms are never open at once, so the ids only have to be unique within
  // this one. useId rather than a fixed string, so a habit called "Drink
  // water" in the rename form and another in the add form cannot end up sharing
  // a label's `for`.
  const scheduleLabelId = useId()

  // An empty or whitespace-only name is not a habit. Trim before deciding, so
  // "   " is rejected the same as "".
  const trimmed = name.trim()
  const canSubmit = trimmed.length > 0

  function submit(event: React.FormEvent) {
    // Without this the browser does a full page reload on submit.
    event.preventDefault()
    if (!canSubmit) return
    onSubmit(trimmed, emoji, schedule)
  }

  return (
    <form className="habit-form" onSubmit={submit}>
      <label className="habit-form-label" htmlFor="habit-name">
        Habit name
      </label>

      {/* autoFocus so the caret is ready: adding a habit should not need a
          click in the text box first. */}
      <input
        id="habit-name"
        className="habit-form-input"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Drink water"
        maxLength={60}
        autoFocus
        onKeyDown={(event) => {
          if (event.key === 'Escape') onCancel()
        }}
      />

      <EmojiPicker value={emoji} onChange={setEmoji} />

      <span className="habit-form-label" id={scheduleLabelId}>
        How often
      </span>
      <SchedulePicker value={schedule} onChange={setSchedule} labelledBy={scheduleLabelId} />

      <div className="habit-form-actions">
        <button
          type="submit"
          className="habit-form-submit"
          // Disabled rather than silently ignoring the submit, so it is
          // obvious why nothing happens.
          disabled={!canSubmit}
        >
          {submitLabel}
        </button>

        <button type="button" className="habit-form-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
