// A small grid of emojis to click, used when adding or renaming a habit.
//
// Deliberately not a free text field: typing an emoji means finding one
// somewhere else and pasting it, which is a lot of friction for picking an
// icon. A fixed short list also means every habit ends up with an emoji that
// actually renders, instead of whatever half-finished character got pasted.
//
// The list itself lives in lib/emojis.ts, not here: a file exporting both a
// component and a plain value breaks React Fast Refresh.

import { EMOJIS } from '../lib/emojis.ts'

interface EmojiPickerProps {
  /** The emoji currently chosen. */
  value: string
  /** Called with the emoji that was clicked. */
  onChange: (emoji: string) => void
  /** Used to label the group for screen readers. */
  label?: string
}

export default function EmojiPicker({
  value,
  onChange,
  label = 'Choose an emoji',
}: EmojiPickerProps) {
  return (
    <div className="emoji-picker" role="group" aria-label={label}>
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          className="emoji-option"
          onClick={() => onChange(emoji)}
          aria-pressed={emoji === value}
          // The emoji itself is not a useful name out loud, so spell it out.
          aria-label={`Emoji ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  )
}
