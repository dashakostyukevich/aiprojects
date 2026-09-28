import PhotoSlot from './PhotoSlot.jsx'
import Reveal from './Reveal.jsx'

// §5 Floating collage card sub-types. Every one shares the same radius, shadow
// and padding — that shared treatment is what stops the random-things grid
// from reading as messy. Only the inside changes.
const fills = {
  surface: 'bg-surface text-ink',
  sand: 'bg-sand text-ink',
  accent: 'bg-accent text-accent-ink',
  ink: 'bg-ink text-bg',
  sky: 'bg-sky text-ink',
  terracotta: 'bg-terracotta text-ink',
}

// Card-local meta label. `label-meta` hardcodes `text-ink-muted`, which is
// correct on the page background (5.19:1) but wrong inside a card: on a sand
// fill it drops to 4.48:1, and on the two ink-filled cards it put 12px grey
// text on near-black, roughly 2:1. Inside a card the label inherits the card's
// own foreground and steps down with opacity, which keeps it on the same
// contrast footing as the body text beside it on every fill.
const CARD_META = 'text-[0.75rem] font-medium tracking-[0.02em] uppercase opacity-75'

function StatCard({ card }) {
  return (
    <>
      <p className="font-display text-4xl leading-none">{card.figure}</p>
      <p className={`${CARD_META} mt-2`}>{card.label}</p>
    </>
  )
}

function IllustrationCard({ card, flip }) {
  return (
    <>
      {/* §7 line-art, weight matched to the sans stroke. Swap for real art.
          `flip` keeps two doodle cards from looking like the same drawing.

          The `max-w` cap matters: this SVG has no intrinsic height, so at a
          four-column span it scaled to ~380px tall and swamped the collage. The
          card sets the drawing's width, not the card's. */}
      <svg
        viewBox="0 0 120 64"
        className={`w-full max-w-[180px] ${flip ? '-scale-x-100' : ''}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <rect x="2" y="14" width="34" height="36" rx="6" />
        <path d="M12 26h14M12 34h9" opacity="0.5" />
        <path d="M46 32h14M56 22l10 10-10 10" />
        <rect x="70" y="6" width="48" height="52" rx="6" />
        <path d="M80 46l8-12 7 8 5-6 8 10" />
      </svg>
      <p className="mt-3 text-sm font-medium">{card.title}</p>
      <p className={`${CARD_META} mt-1`}>{card.caption}</p>
    </>
  )
}

function PhotoCard({ card }) {
  return (
    <>
      {/* TODO photo: `card.image` is null for every card, so this renders a
          labelled slot. Drop a file in public/ and set the path in data.js and
          it becomes a real image with the same reserved box. */}
      {/* Fixed height, not an aspect ratio. An aspect-ratio slot scales with the
          card's column span, so the same card was 80px tall in a 2-column cell
          and 210px in a 4-column one, and the wide one came to dominate the
          whole collage. A photo slot in a collage is decoration at a constant
          size, so it gets a constant size. */}
      <PhotoSlot
        src={card.image}
        alt={card.alt ?? card.title}
        label={card.photoLabel ?? card.caption}
        ratio="h-24"
        // The card prints its own title and caption right below, so the slot
        // only needs to say that something is missing.
        compact
      />
      <p className="mt-3 text-sm font-medium">{card.title}</p>
      <p className={`${CARD_META} mt-1`}>{card.caption}</p>
    </>
  )
}

function QuoteCard({ card }) {
  return (
    <>
      <p className="text-sm leading-snug font-medium">“{card.quote}”</p>
      <p className={`${CARD_META} mt-2`}>{card.name}</p>
    </>
  )
}

function BadgeCard({ card }) {
  return (
    <>
      <div className="flex items-center gap-2">
        <svg
          viewBox="0 0 20 20"
          className="size-4 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 10.5l4 4 8-9" />
        </svg>
        <p className="text-sm font-bold">{card.label}</p>
      </div>
      <p className={`${CARD_META} mt-2`}>{card.detail}</p>
    </>
  )
}

const types = {
  stat: StatCard,
  illustration: IllustrationCard,
  photo: PhotoCard,
  quote: QuoteCard,
  badge: BadgeCard,
}

// Placement is declared in data.js as grid coordinates against the 12x4 collage
// grid. Column and row starts are looked up separately: an earlier version
// shared one lookup between them, so a card at column 4 row 1 resolved to
// `col-start-4 row-start-4` and every card piled into the same cells.
//
// Classes come from literal lookups rather than being interpolated from the
// data, because Tailwind only emits classes it can find as literal source.
const COL_START = {
  1: 'lg:col-start-1',
  2: 'lg:col-start-2',
  3: 'lg:col-start-3',
  4: 'lg:col-start-4',
  5: 'lg:col-start-5',
  6: 'lg:col-start-6',
  7: 'lg:col-start-7',
  8: 'lg:col-start-8',
  9: 'lg:col-start-9',
  10: 'lg:col-start-10',
  11: 'lg:col-start-11',
  12: 'lg:col-start-12',
}

const ROW_START = {
  1: 'lg:row-start-1',
  2: 'lg:row-start-2',
  3: 'lg:row-start-3',
  4: 'lg:row-start-4',
}

const COL_SPAN = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
  7: 'lg:col-span-7',
  8: 'lg:col-span-8',
  9: 'lg:col-span-9',
  10: 'lg:col-span-10',
  11: 'lg:col-span-11',
  12: 'lg:col-span-12',
}

const ROW_SPAN = {
  1: 'lg:row-span-1',
  2: 'lg:row-span-2',
}

export default function CollageCard({ card, index }) {
  const Body = types[card.type] ?? StatCard
  const at = card.at ?? {}

  const placement = [
    COL_START[at.col] ?? '',
    ROW_START[at.row] ?? '',
    COL_SPAN[at.colSpan ?? 1] ?? '',
    ROW_SPAN[at.rowSpan ?? 1] ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Reveal
      delay={60 * index}
      rotate={card.rotate ?? 0}
      restRotate={0}
      className={`collage-card w-full self-start p-5 text-left ${fills[card.fill] ?? fills.surface} hover:-translate-y-0.5 hover:shadow-card-hover ${placement}`}
    >
      <Body card={card} flip={index % 2 === 1} />
    </Reveal>
  )
}
