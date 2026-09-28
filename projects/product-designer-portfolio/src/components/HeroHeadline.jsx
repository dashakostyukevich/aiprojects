import { profile } from '../data.js'
import SplitReveal from './SplitReveal.jsx'

// One paragraph, read as an inline flow. `em` marks the emphasised phrases and
// the line count is emergent from the measure rather than hardcoded, so the
// block reflows on narrow screens.
//
// `em` used to mean italic. Space Grotesk ships no italic cut, so the browser
// would synthesise a slanted oblique, which looks broken next to the upright
// text. Emphasis is weight instead: 600 against the surrounding 400, which the
// variable font supports natively. The data key is unchanged, so restoring real
// italics later is a one-line change here.
//
// The words are wrapped in `SplitReveal`, which masks and slides each one in,
// scrubbed by scroll (see that component). It is a heading, so it is <h1> via
// the `as` prop.
//
// `className` is appended rather than ignored, because the hero sets its own
// measure. The headline is not a full-bleed line across the page any more, it
// is the centre of a three-part composition, so the measure is a character
// count the caller chooses rather than a width baked in here.
export default function HeroHeadline({ className = '' }) {
  return (
    <SplitReveal
      as="h1"
      className={`text-center font-display leading-[1.05] tracking-[-0.04em] text-balance uppercase ${className}`}
    >
      {profile.headline.map((part, i) => (
        // `data-split` tells SplitReveal to break this run into words so each
        // gets its own mask, while keeping `font-semibold` on all of them.
        // 600, not 500: uppercase caps have far less stroke contrast than
        // lowercase, so a 400/500 pair is almost invisible once the text is
        // shouted. 600 against 400 reads clearly at this size.
        <span key={i} data-split className={part.em ? 'font-semibold' : undefined}>
          {part.text}
        </span>
      ))}
    </SplitReveal>
  )
}
