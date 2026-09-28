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
//
// Measure and size are set together, and both are load-bearing.
//
// The previous pairing was max-w-[1000px] at clamp(1.75rem, 4.4vw, 4rem), which
// put the headline on four lines at 1440px and six at 390px. Two things fixed
// it. The decorative capsules are gone from the data (see data.js), which
// recovered roughly two lines on their own. And the measure is now wide enough
// to hold the sentence in two lines at desktop: measured in the browser, 1200px
// at 44px breaks to exactly two lines, while 1000px at 44px breaks to three.
//
// Uppercase Space Grotesk has a large x-height and wide caps, so it needs more
// measure and tighter tracking than a normal-case face would. `text-balance`
// then evens out the rag rather than leaving one orphan word on line two.
export default function HeroHeadline() {
  return (
    <SplitReveal
      as="h1"
      className="mx-auto max-w-[1200px] text-center font-display text-[clamp(1.75rem,3.05vw,2.75rem)] leading-[1.05] tracking-[-0.04em] text-balance uppercase"
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
