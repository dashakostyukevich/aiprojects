import { color } from '../lib/color.js'

// Inline chips for the hero headline. All three sit in a word slot, vertically
// centred on the cap-height, and scale down with the headline on small screens.
//
// These are decorative punctuation, so they are hidden from assistive tech.

const sizes = 'h-8 w-14 sm:h-11 sm:w-20' // ~2:1 capsule

function IconChip({ color: c = 'navy' }) {
  return (
    <span
      aria-hidden="true"
      className="mx-[0.14em] inline-flex shrink-0 items-center align-middle"
      style={{ color: color(c) }}
    >
      <svg
        viewBox="0 0 32 32"
        className="h-6 w-6 sm:h-7 sm:w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        {/* Asterisk/flower mark, stroke weight matched to the sans. */}
        <path d="M16 3v26M4.6 9.5l22.8 13M4.6 22.5l22.8-13" />
        <circle cx="16" cy="16" r="3.2" />
      </svg>
    </span>
  )
}

function PhotoChip({ src, alt = '', fallback = ['sky', 'sand'] }) {
  return (
    <span
      aria-hidden="true"
      className={`mx-[0.14em] inline-block shrink-0 overflow-hidden rounded-full align-middle ${sizes}`}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : (
        // Placeholder until a real crop exists in public/. Decorative swatch so
        // the slot keeps its size in the line.
        <span
          className="block h-full w-full"
          style={{
            backgroundImage: `linear-gradient(120deg, ${color(fallback[0])} 0%, ${color(fallback[1])} 100%)`,
          }}
          title={alt}
        />
      )}
    </span>
  )
}

function BlockChip({ colors = ['terracotta', 'accent'] }) {
  const [a, b] = colors
  return (
    <span
      aria-hidden="true"
      className={`mx-[0.14em] inline-block shrink-0 rounded-full align-middle ${sizes}`}
      style={{
        // Diagonal split of two flat colours: a decorative swatch, no content.
        backgroundImage: `linear-gradient(115deg, ${color(a)} 0 50%, ${color(b)} 50% 100%)`,
      }}
    />
  )
}

const chips = { icon: IconChip, photo: PhotoChip, block: BlockChip }

export default function HeadlineChip({ chip, ...props }) {
  const Chip = chips[chip]
  if (!Chip) return null
  return <Chip {...props} />
}
