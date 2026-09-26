// The emoji a habit can be given.
//
// Its own file, separate from the picker component, because a module that
// exports both a component and a plain value defeats React Fast Refresh:
// editing the component would then force a full reload and throw away
// component state. The rule is one export kind per file.

/** Grouped by nothing in particular, just a scannable order. */
export const EMOJIS = [
  '💧', '📚', '🚶', '🏃', '🧘', '🥗', '💪', '🛌',
  '✍️', '🎸', '🎨', '🌱', '☀️', '🧹', '💊', '🚰',
  '🎯', '⏰', '🧴', '🦷', '🐕', '🌙', '🧠', '🎹',
] as const

/** What a habit gets when the user does not pick one. */
export const DEFAULT_EMOJI = EMOJIS[0]
