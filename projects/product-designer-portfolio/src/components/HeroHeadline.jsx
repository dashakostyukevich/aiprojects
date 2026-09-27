import { profile } from '../data.js'
import HeadlineChip from './HeadlineChip.jsx'
import SplitReveal from './SplitReveal.jsx'

// One paragraph, read as an inline flow. Em spans are the emphasised phrases,
// chips drop into word slots, and the line count is emergent from the measure
// rather than hardcoded, so the block reflows on narrow screens.
//
// `em` used to mean italic. Space Grotesk ships no italic cut, so the browser
// would synthesise a slanted oblique, which looks broken next to the upright
// text. Emphasis is weight instead: 500 against the surrounding 400, which the
// variable font supports natively. The data key is unchanged, so restoring real
// italics later is a one-line change here.
//
// `uppercase` is set here rather than by uppercasing the strings in data.js, so
// the About section, which renders the same `profile.headline` array, keeps its
// sentence case. Uppercase caps run noticeably wider than lowercase in Space
// Grotesk, which is why the measure grew to 1000px and the size went up: the old
// 780px/3rem pairing only worked because the text was mostly x-height glyphs.
//
// The words are wrapped in `SplitReveal`, which masks and slides each one in,
// scrubbed by scroll (see that component). It is a heading, so it is <h1> via
// the `as` prop.
export default function HeroHeadline() {
  return (
    <SplitReveal
      as="h1"
      className="mx-auto max-w-[1000px] text-center font-display text-[clamp(1.75rem,4.4vw,4rem)] leading-[1.15] tracking-[-0.035em] text-balance uppercase"
    >
      {profile.headline.map((part, i) =>
        part.chip ? (
          <HeadlineChip key={i} {...part} />
        ) : (
          // `data-split` tells SplitReveal to break this run into words so each
          // gets its own mask, while keeping `font-semibold` on all of them.
          // 600, not 500: uppercase caps have far less stroke contrast than
          // lowercase, so a 400/500 pair is almost invisible once the text is
          // shouted. 600 against 400 reads clearly at this size.
          <span key={i} data-split className={part.em ? 'font-semibold' : undefined}>
            {part.text}
          </span>
        ),
      )}
    </SplitReveal>
  )
}
