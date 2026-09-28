import { collage, profile } from '../data.js'
import CollageCard from './CollageCard.jsx'
import Reveal from './Reveal.jsx'
import SplitReveal from './SplitReveal.jsx'

// §6 About page pattern, rebuilt as a real grid.
//
// The previous version absolutely positioned every card inside a wrapper with a
// hardcoded `lg:h-[900px]`, which meant the section had ~400px of dead space
// under the headline and the top-right card overlapped the section above. Cards
// are placed on a CSS grid instead, so the collage is as tall as its content
// and nothing can escape the box.
//
// There is exactly one headline node and one instance of each card. An earlier
// version rendered the headline twice, once in a `lg:hidden` block and once
// inside the desktop grid, which put the same sentence in the document as both
// the page's only h1 and two h2s. The responsive behaviour now comes entirely
// from breakpoint classes on a single grid:
//
//   below lg   `grid-cols-2`, no placement classes, so the cards flow two-up in
//              array order, which is the only sane reading order on a phone.
//   from lg    `grid-cols-12`, and each card's `at` coordinates in data.js
//              resolve to explicit col-start/row-start, so the composition is
//              placed rather than flowed.
//
// That is the whole trick: one grid, two layouts, no duplicated markup.

// The About headline is sentence case and has to fit a six-column band without
// breaking into a tall narrow column, so it carries its own scale rather than
// reusing `text-display`, which is sized for a full-width footer h2.
//
// The clamp is vw-only on purpose. A `1.1rem+1.5vw` middle term needs spaces
// around the `+` to be valid inside an arbitrary Tailwind value; without them
// the whole declaration is dropped and the heading silently inherits its size
// from the parent.
const Headline = () => (
  <SplitReveal
    as="h2"
    className="max-w-[22ch] font-display text-[clamp(1.5rem,2.6vw,2.5rem)] leading-[1.1] tracking-[-0.03em] text-balance"
  >
    {profile.headline.map((part, i) =>
      part.highlight ? (
        <span key={i} data-split className="highlight font-display">
          {part.text}
        </span>
      ) : (
        <span key={i} data-split className={part.italic ? 'font-medium' : undefined}>
          {part.text}
        </span>
      ),
    )}
  </SplitReveal>
)

export default function CollageAbout() {
  return (
    <section className="pad-section">
      <div className="container-page">
        {/* Rows size to their tallest item rather than being forced equal
            (`auto-rows-fr` made a two-word badge card 250px tall with the text
            pinned to the top). Cards align to the start of their cell so a short
            card in a tall row reads as intentional rather than stretched. */}
        <div className="grid grid-cols-2 gap-4 lg:auto-rows-min lg:grid-cols-12 lg:gap-5">
          <Reveal className="col-span-2 mb-2 lg:col-span-6 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:mb-0 lg:flex lg:flex-col lg:justify-center lg:pr-8">
            <p className="label-meta mb-6">About</p>
            <Headline />
          </Reveal>

          {collage.map((card, i) => (
            <CollageCard key={i} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
