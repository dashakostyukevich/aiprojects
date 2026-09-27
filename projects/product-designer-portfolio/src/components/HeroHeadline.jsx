import { profile } from '../data.js'
import HeadlineChip from './HeadlineChip.jsx'

// One paragraph, read as an inline flow. Em spans are the italic phrases, chips
// drop into word slots, and the line count is emergent from the measure rather
// than hardcoded, so the block reflows on narrow screens.
export default function HeroHeadline() {
  return (
    <h1 className="mx-auto max-w-[780px] text-center font-serif text-[clamp(1.5rem,3.3vw,3rem)] leading-[1.35] text-balance">
      {profile.headline.map((part, i) =>
        part.chip ? (
          <HeadlineChip key={i} {...part} />
        ) : (
          <span key={i} className={part.em ? 'italic' : undefined}>
            {part.text}
          </span>
        ),
      )}
    </h1>
  )
}
