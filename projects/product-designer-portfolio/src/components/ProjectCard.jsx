import { Link } from 'react-router-dom'
import { color, colorClass } from '../lib/color.js'
import PhotoSlot from './PhotoSlot.jsx'
import useCardDrift from '../hooks/useCardDrift.js'

// First-screen project card. Flat, no border and no shadow: either a brand card
// (solid fill, centred lockup) or a photo card (full-bleed image). The label is
// plain text directly beneath, not a bordered box.
//
// Hover has three parts and they live in three separate elements, because they
// animate at three different rates and cannot share one `transform`:
//
//   the card     leans toward the cursor, up to 8px (useCardDrift)
//   the media    scales to 1.04 inside the card's own overflow
//   the veil     fades up from the bottom carrying the outcome line
//
// The outcome line is the point of the reveal. The card already states its title
// and year underneath, so a hover that only rescaled the picture would be
// decoration; this puts the one sentence about what the work *did* inside the
// card, where the eye already is. It is `aria-hidden` because the same sentence
// is on the case study page and because it is inside the link — a screen reader
// announcing it as part of the link's accessible name would make every card in
// the grid read as a paragraph.
export default function ProjectCard({ project, ratio = 'aspect-square' }) {
  const isPhoto = project.kind === 'photo'
  // Token fills come through as a class; a raw client brand hex has to be an
  // inline style, since Tailwind only sees class names it can find in source.
  const fillClass = colorClass(project.fill)
  const cardRef = useCardDrift()

  return (
    <article ref={cardRef} className="work-card">
      <Link
        to={`/work/${project.slug}`}
        className="group relative block overflow-hidden rounded-card focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        // The visible label sits outside the link. Without this the accessible
        // name would be the entire slot, including the "Image needed" text that
        // only renders while a real photo is missing.
        aria-label={
          project.image
            ? undefined
            : `${project.title}, ${project.year}. Image pending, opens the case study.`
        }
      >
        {isPhoto ? (
          // `project.image` is null on every project, so this currently renders
          // a labelled slot rather than a photo. Supply a path in data.js and it
          // becomes a real image in the same reserved box.
          <PhotoSlot
            src={project.image}
            alt={project.imageAlt ?? `${project.title}, ${project.year}`}
            label={project.imageLabel ?? 'Product screenshot'}
            ratio={ratio}
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="work-card-media rounded-card"
          />
        ) : (
          <div
            className={`work-card-media ${fillClass ?? ''} ${ratio} w-full`}
            style={fillClass ? undefined : { backgroundColor: color(project.fill) }}
          />
        )}

        {/* The veil sits inside the link and above the media, so it covers the
            whole reserved box regardless of which of the two card kinds is
            above it.

            A flat wash, not a gradient. The gradient was there to keep the top
            of a screenshot readable while the text sat on the dark end — but at
            this blur the image is already an even field of colour, so there is
            no detailed top left to protect and the gradient was buying contrast
            the blur had already solved. A flat wash is one less thing to get
            wrong, and it darkens the card evenly instead of implying a light
            source.

            65%, and it has to be that deep. A flat wash is only as safe as its
            *lightest* possible backing, which for this grid is a white dashboard
            screenshot: 55% ink over #fff leaves the outcome at 4.4:1 and the CTA
            at 3.25:1, both under 4.5 — the gradient had been carrying that
            weight. At 65% over pure white both sit at 6.31:1, and the CTA is
            full white rather than white/75, which is part of what let it pass.

            To re-check after changing either number, composite the wash over
            #fff and take the ratio against white. Under 4.5 is a fail on a
            screenshot this light, and Groshi's own card is the one that fails
            first. */}
        <span aria-hidden="true" className="work-card-veil pointer-events-none absolute inset-0">
          {/* `h-full` + `justify-between`, not `items-end` on the parent with a
              content-height child. A wash that only covers the text block leaves
              a hard horizontal edge across the card, which is more distracting
              than the gradient it replaced — the eye reads that edge as a seam
              in the image rather than as a scrim.

              `justify-between` rather than `justify-end` because the block now
              has content at both ends: the fact rows at the top and the outcome
              at the bottom, with the gap between them doing the work. Pinned to
              the bottom, the facts would sit directly above the outcome and the
              card would read as one undifferentiated paragraph.

              `pt` matches `pb` rather than being smaller. The wash is edge to
              edge and its top edge coincides with the top of a rounded card, so
              an unpadded first line has its ascenders sitting directly on the
              curve, where the corner crop takes the most pixels off the same
              20-28px band. At 11px the label there is barely legible, and it
              looks like a clipping bug rather than a tight fit. Symmetric
              padding is also the only reading that survives the mobile card,
              whose 1:1 or 4:3 box is short enough that an asymmetric top would
              visibly shorten the gap above the facts. */}
          <span className="flex h-full w-full flex-col justify-between bg-[rgb(10_10_10/0.65)] px-5 pt-5 pb-5 sm:px-7 sm:pt-7 sm:pb-7">
            {/* The two context rows at the top: what I did, and what the
                client's business is. They answer the two questions a stranger
                has about a card in the grid — "is this you or a team?" and "what
                kind of company is this?" — and the label under the card cannot,
                because it only has the title and the year.

                Label in muted white, items in full white. Both sit on the same
                65% wash as the outcome, so the same 6.31:1-over-white holds;
                white/70 on the tag labels still clears 4.5:1 there, and going
                dimmer than that starts reading as disabled rather than as
                secondary. */}
            {project.cardFacts && (
              <span className="block">
                {project.cardFacts.map((fact) => (
                  <span key={fact.label} className="mb-2 block last:mb-0">
                    <span className="block text-[0.6875rem] font-medium tracking-[0.08em] text-white/70 uppercase">
                      {fact.label}
                    </span>
                    <span className="mt-1 block text-[0.8125rem] leading-snug text-white">
                      {fact.items.join(' · ')}
                    </span>
                  </span>
                ))}
              </span>
            )}

            <span>
            <span className="block font-display text-[0.9375rem] leading-snug font-medium text-white text-balance">
              {project.outcome}
            </span>
            <span className="mt-2 block text-[0.75rem] font-medium tracking-[0.02em] text-white uppercase">
              View case study →
            </span>
            </span>
          </span>
        </span>

        {/* Client lockup, for a brand card only. Centred with generous internal
            padding, and the word is set in the display face rather than drawn as
            a logo, so it reads as a placeholder until the real mark is supplied.

            The ink colour is chosen per fill, not fixed to white. White on the
            chartreuse fill measured 1.16:1 and white on terracotta 3.27:1, both
            unreadable; ink on those fills is 17.1:1 and 6.1:1. A real client logo
            would be an asset with its own contrast, so this only has to be
            legible while it is a word.

            A sibling of the veil, not a child of the media, and that is the whole
            reason it is here. Two things forced it out:

              - The veil used to be a gradient that faded out well before the
                middle of the card, so the wordmark was never underneath it. A
                flat wash covers everything, and 65% ink over the navy fill
                takes white down to about 2:1 — the lockup all but vanished.
              - Putting it back inside the media does not fix that with a
                `z-index`. `.work-card-media` is transformed on hover, and a
                transform creates a stacking context, so the lockup is pinned
                below the veil no matter how high its `z-index` goes. Only
                leaving the media's stacking context works.

            It is `pointer-events-none` because the whole card is already one
            link; nothing inside it needs to be separately clickable. */}
        {!isPhoto && (
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-10 font-display text-3xl tracking-tight select-none sm:text-4xl ${
              project.fill === 'accent' || project.fill === 'sky'
                ? 'text-accent-ink'
                : 'text-white'
            }`}
          >
            {project.lockup ?? project.title}
          </span>
        )}
      </Link>

      {/* The label carries the year and outcome on hover, so the grid conveys
          more than four titles. It is always in the DOM, not hover-only, so it
          is available to assistive tech and on touch. */}
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <p className="text-ink transition-colors duration-150 group-hover:text-ink-muted">
          {project.title}
        </p>
        <span className="label-meta shrink-0">{project.year}</span>
      </div>

      {/* The same outcome line again, for readers with no pointer to hover with.

          A touch device fires no `:hover`, so the sentence inside the card would
          simply never appear for them — the desktop reveal would be the only
          place that sentence exists, which is the kind of parity a portfolio
          cannot afford when the sentence is the argument. Rather than leave the
          veil permanently up on touch (a permanent scrim over every card, hiding
          the screenshot it exists to annotate), the line moves out from under the
          picture and sits here in the label block, where it costs no image.

          Hidden at `hover: hover` so exactly one copy is ever visible. Both are
          `aria-hidden` or `aria`-neutral by construction: the veil copy is
          hidden from assistive tech because it is inside the link, and this one
          is a plain paragraph after it, read once, in normal document order. */}
      <p className="work-card-fallback mt-2 hidden text-[0.9375rem] leading-snug text-ink-muted">
        {project.outcome}
        {/* Same two rows as the top of the veil, on the same parity argument:
            a finger fires no hover, so without this the "what is it / who did
            it" facts would exist only inside a pointer-only reveal. */}
        {project.cardFacts && (
          <>
            {project.cardFacts.map((fact) => (
              <span key={fact.label} className="mt-2 block">
                <span className="label-meta">{fact.label}</span>
                <span className="mt-0.5 block">{fact.items.join(' · ')}</span>
              </span>
            ))}
          </>
        )}
      </p>
    </article>
  )
}
