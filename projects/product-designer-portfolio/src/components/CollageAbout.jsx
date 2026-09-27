import { collage, profile } from '../data.js'
import CollageCard from './CollageCard.jsx'
import Reveal from './Reveal.jsx'

// §6 About page pattern. Desktop lays cards onto an invisible 12-col grid with
// percentage boxes; the headline keeps the middle clear for legibility. Mobile
// drops to a 2-column masonry in array order.
function Headline() {
  return (
    <h2 className="font-serif text-display leading-[1.05] text-balance">
      {profile.headline.map((part, i) =>
        part.highlight ? (
          <span key={i} className="highlight font-serif italic">
            {part.text}
          </span>
        ) : (
          <span key={i} className={part.italic ? 'italic' : undefined}>
            {part.text}
          </span>
        ),
      )}
    </h2>
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
