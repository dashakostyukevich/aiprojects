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

function StatCard({ card }) {
  return (
    <>
      <p className="font-display text-4xl leading-none">{card.figure}</p>
      <p className="label-meta mt-2 opacity-70">{card.label}</p>
    </>
  )
}

function IllustrationCard({ card, flip }) {
  return (
    <>
      {/* §7 line-art, weight matched to the sans stroke. Swap for real art.
          `flip` keeps two doodle cards from looking like the same drawing. */}
      <svg
        viewBox="0 0 120 64"
        className={`w-full ${flip ? '-scale-x-100' : ''}`}
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
      <p className="label-meta mt-1 opacity-60">{card.caption}</p>
    </>
  )
}

function PhotoCard({ card }) {
  return (
    <>
      {/* §5 rounded photo block. Placeholder for a real image in public/. */}
      <div className="h-20 w-full rounded-[14px] bg-ink/10" aria-hidden="true" />
      <p className="mt-3 text-sm font-medium">{card.title}</p>
      <p className="label-meta mt-1 opacity-60">{card.caption}</p>
    </>
  )
}

function QuoteCard({ card }) {
  return (
    <>
      <p className="text-sm leading-snug font-medium">“{card.quote}”</p>
      <p className="label-meta mt-2 opacity-60">{card.name}</p>
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
      <p className="label-meta mt-2 opacity-60">{card.detail}</p>
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

export default function CollageCard({ card, index }) {
  const Body = types[card.type] ?? StatCard
  const pos = card.pos ?? {}
  const style = {
    '--pos-left': pos.left != null ? `${pos.left}%` : undefined,
    '--pos-top': pos.top != null ? `${pos.top}%` : undefined,
    '--pos-width': pos.width != null ? `${pos.width}%` : undefined,
  }

  return (
    <Reveal
      delay={60 * index}
      rotate={card.rotate ?? 0}
      restRotate={0}
      style={style}
      className={`collage-item p-5 ${fills[card.fill] ?? fills.surface} hover:-translate-y-0.5 hover:shadow-card-hover`}
    >
      <Body card={card} flip={index % 2 === 1} />
    </Reveal>
  )
}
