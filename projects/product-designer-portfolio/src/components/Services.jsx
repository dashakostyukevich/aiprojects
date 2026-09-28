import { services } from '../data.js'
import Reveal from './Reveal.jsx'
import Spark from './Spark.jsx'
import SplitReveal from './SplitReveal.jsx'

// A row of cards, alternating fill, staggered off a common baseline so the
// section reads as objects laid on a table rather than as a feature grid.
//
// The details that make it work, in order of how much they matter:
//
//   - **Flat fills, and flat at rest.** A card here is a coloured shape, not a
//     surface floating above the page. Sand and accent are the whole treatment;
//     adding a border on top of the fill would make a ghost card, and a shadow
//     would fight the stagger for attention. There is no shadow on hover either:
//     these cards are not links, they open nothing, and a card that lifts and
//     gains a shadow under the cursor has lied about what it does. The only
//     motion in this section is the entrance.
//   - **A high, a low, a high.** Three cards at 0 / 24 / 0 of extra space. The
//     middle one rises, so the row has a silhouette instead of a horizon. The
//     middle card is also the accent one, so the emphasis lands twice over and
//     the loudest thing on the page is the primary service.
//   - **Content anchored to the bottom.** `mt-auto` on the text block means all
//     three titles sit on one line even though the bodies run to different
//     lengths. Titles aligned across a row is what makes the set scannable.
//   - **A number, and nothing else, above it.** A small tinted disc, not a
//     badge with a border. It used to sit in a header row opposite a diagonal
//     arrow, which read as "open this" on a card that opens nothing.
//
// The section header is a wrapping flex row, heading and tags on one line. It
// was a two-column grid with a jump-down button on the right, and a grid is
// only worth its complexity when there is a second column to hold.

const RISE = ['', 'lg:mt-12', '']
const FILL = ['bg-sand', 'bg-accent', 'bg-sand']
const INK = ['text-ink', 'text-accent-ink', 'text-ink']
// Body copy steps down with opacity so it reads as secondary to the title. That
// is safe on sand, where near-black at 80% is still 12.9:1, but it is not safe
// on the accent card: white on #E84436 is 3.95:1, and dimming it to 80% drops
// that to 3.03:1, which is the large-text floor with nothing to spare. So the
// accent card keeps its body at full opacity and separates it from the title
// with spacing only.
const BODY = ['opacity-80', '', 'opacity-80']
// The number disc is the card's own fill, shifted one step away from its own
// text. On sand the text is near-black, so a translucent black lifts the disc
// off the fill. On the accent the text is white, so the same translucent ink
// would be invisible against it — `accent-ink` is white now, and white at 12%
// on orange is 1.14:1. The accent disc darkens instead.
const DISC = ['bg-ink/8', 'bg-ink/20', 'bg-ink/8']

function ServiceCard({ service, index }) {
  return (
    <Reveal
      delay={index * 90}
      // `min-h` only from `lg`. The floor exists to line the three cards up
      // against each other in a row; stacked full-width on a phone there is
      // nothing to line up, and the same floor just puts 100px of dead air above
      // every title.
      className={`flex flex-col rounded-card p-7 lg:min-h-[16.5rem] ${FILL[index]} ${INK[index]} ${RISE[index]}`}
    >
      <span
        className={`flex size-9 items-center justify-center rounded-full text-[0.8125rem] font-semibold tabular-nums ${DISC[index]}`}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="mt-auto pt-8">
        <h3 className="font-display text-h2 leading-[1.15] font-semibold tracking-[-0.025em] text-balance">
          {service.title}
        </h3>
        <p className={`mt-3 text-body leading-relaxed ${BODY[index]}`}>{service.body}</p>
      </div>
    </Reveal>
  )
}

export default function Services() {
  return (
    <section id="services" className="container-page pad-section">
      {/* Heading and tags share a baseline row rather than stacking, so the tags
          annotate the section instead of introducing it. */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <SplitReveal as="h2" className="font-display text-h1 font-semibold tracking-[-0.03em]">
          What I do
        </SplitReveal>
        <ul className="flex flex-wrap gap-2">
          {['Services', 'How I work'].map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-hairline px-3.5 py-1.5 text-[0.8125rem] font-medium whitespace-nowrap text-ink-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 max-w-[62ch] text-body leading-relaxed text-ink-muted">
        Three ways I usually get pulled into a product. Most engagements combine
        them — the split depends on how much of the problem is still undefined
        when we start.
      </p>

      {/* One column until `lg`. At the two-column width this used to use, three
          cards tile 2 + 1 and the third sits alone on its own row, which is a
          worse accident than three full-width cards. */}
      <div className="mt-12 grid items-start gap-5 lg:mt-16 lg:grid-cols-3">
        {services.map((service, i) => (
          <ServiceCard key={service.title} service={service} index={i} />
        ))}
      </div>

      {/* One mark per section, used as punctuation rather than as an icon set.
          It carries no meaning of its own, so it is hidden from assistive tech
          and sits outside the text flow. */}
      <Spark className="mt-10 ml-auto size-7 text-ink/30 lg:mt-12" rotate={12} fill="fill-none" strokeWidth={5} />
    </section>
  )
}
