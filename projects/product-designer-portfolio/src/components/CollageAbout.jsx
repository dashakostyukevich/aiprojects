import { collage, profile } from '../data.js'
import CollageCard from './CollageCard.jsx'
import Reveal from './Reveal.jsx'
import SplitReveal from './SplitReveal.jsx'

// §6 About page pattern. Desktop lays cards onto an invisible 12-col grid with
// percentage boxes; the headline keeps the middle clear for legibility. Mobile
// drops to a 2-column masonry in array order.
function Headline() {
  return (
    <SplitReveal
      as="h2"
      className="font-display text-display leading-[1.05] tracking-[-0.03em] text-balance"
    >
      {profile.headline.map((part, i) =>
        part.highlight ? (
          // The accent highlight is the emphasis here. Space Grotesk has no
          // italic cut, so `italic` would synthesise a slanted oblique.
          // `data-split` masks each word, keeping the highlight on both.
          <span key={i} data-split className="highlight font-display">
            {part.text}
          </span>
        ) : (
          // `italic` in the data maps to weight, same as the hero headline.
          <span key={i} data-split className={part.italic ? 'font-medium' : undefined}>
            {part.text}
          </span>
        ),
      )}
    </SplitReveal>
  )
}

export default function CollageAbout() {
  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <div className="container-page">
        {/* Mobile and tablet: headline first, then a plain 2-col masonry. */}
        <Reveal className="lg:hidden">
          <p className="label-meta mb-6">About</p>
          <Headline />
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-4 lg:hidden">
          {collage.map((card, i) => (
            <CollageCard key={i} card={card} index={i} />
          ))}
        </div>

        {/* Desktop: free-form collage on the invisible grid. The wrapper is
            explicitly tall because the cards inside it are absolutely
            positioned, so the parent has to supply the height. The headline is
            centred in the clear middle band; cards cluster near the edges. */}
        <div className="relative hidden lg:block lg:h-[900px]">
          <div className="absolute inset-x-0 top-0 z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 text-center">
            <Reveal>
              <p className="label-meta mb-6">About</p>
              <Headline />
            </Reveal>
          </div>

          {collage.map((card, i) => (
            <CollageCard key={i} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
