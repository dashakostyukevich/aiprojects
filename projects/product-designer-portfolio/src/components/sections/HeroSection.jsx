import { Link } from 'react-router-dom'
import { display } from '../../data.js'
import Reveal from '../Reveal.jsx'

/**
 * Display section: a headline row (display type left, supporting paragraph
 * right, bottom-aligned) over a composition of three overlapping shapes.
 *
 * Layout, spacing, sizing, rotation and the responsive behaviour all follow the
 * reference spec exactly. What changed, per the project's design system:
 *
 * - Colours: the reference's #262626 / #f2efec / #dd2f1b / #e6aed3 are now
 *   `ink`, `bg`, the §3 accent highlight, and `sky`. The shapes themselves were
 *   recoloured in public/hero/ to match, so the SVGs ship with the site.
 * - Type: Anton becomes Space Grotesk, the project display face; Geist is the
 *   project text face. The emphasised word uses the §3 highlight pattern rather
 *   than red text, since the accent fails contrast as a text colour.
 * - Container: the project runs everything on `container-page` (1200px), not
 *   1450px.
 * - Copy and the link target come from `data.js`.
 * - Entrance timing follows the project standard (§8) via `Reveal`.
 *
 * The reference's mobile rule was "all vectors become relative"; its code only
 * did that for the first shape, which left the third absolutely positioned and
 * overlapping it. This applies it to all three.
 */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-4 pb-[50px]">
      <div className="container-page">
        {/* Headline row */}
        <div className="mb-[150px] flex items-end justify-start gap-[83px] max-[767px]:mb-16 max-[767px]:flex-col max-[767px]:items-center max-[767px]:justify-between max-[767px]:gap-8 max-[767px]:text-center max-[479px]:mb-10">
          {/* h2, not the reference's h1: the first screen already owns the
              page's only h1. Visually identical. The display size lives here,
              not on the spans: a percentage line-height resolves against the
              element's own font-size, and the reference's 96% only works because
              it sets that on the heading too. It is 100% here because Anton's
              tight metrics allow 96% while the project's display serif has
              taller ascenders and the two lines collide. */}
          <h2 className="m-0 font-display text-ink font-semibold text-[110px] max-[991px]:text-[64px] max-[767px]:text-[52px] max-[479px]:text-[13vw] leading-[100%] tracking-[-0.06em]">
            <span className="block">{display.headline.line1}</span>
            <span className="block">
              {display.headline.line2.map((part, i) =>
                part.accent ? (
                  // No `italic` here: Space Grotesk ships no italic cut, so the
                  // browser would synthesise a slanted oblique. The accent
                  // highlight already carries the emphasis.
                  <span key={i} className="highlight font-display">
                    {part.text}
                  </span>
                ) : (
                  <span key={i}>{part.text}</span>
                ),
              )}
            </span>
          </h2>

          <div className="mb-[43px] max-[767px]:mb-0">
            <div className="max-w-[358px]">
              <p className="m-0 text-lg leading-none text-ink max-[767px]:tracking-[-0.03em]">
                {display.body}
              </p>
            </div>
          </div>
        </div>

        {/* Shape composition */}
        <div className="relative h-[600px] max-[991px]:h-[400px] max-[767px]:flex max-[767px]:h-auto max-[767px]:flex-col max-[767px]:items-center max-[767px]:justify-start">
          {/* Shape 1: accent blob, rotated -19deg, left. Carries the quote. */}
          <Reveal
            delay={0}
            className="hero-shape hero-shape-left -rotate-[19deg] max-[767px]:w-[60%] max-[767px]:rotate-0 max-[479px]:w-[85%]"
          >
            <img
              loading="lazy"
              src="/hero/quote-blob.svg"
              alt=""
              className="h-full w-full"
            />
            <div className="absolute inset-0 mx-auto flex w-[70%] items-center justify-center px-[10px] text-center">
              <p className="m-0 text-lg leading-none text-ink">
                {display.quote.quote}
                <br />
                <br />
                {display.quote.name}
              </p>
            </div>
          </Reveal>

          {/* Shape 2: deep blob, centred, sitting on top of the others. */}
          <Reveal delay={90} className="hero-shape hero-shape-centre">
            <img
              loading="lazy"
              src="/hero/centre-blob.svg"
              alt=""
              className="h-full w-full"
            />
          </Reveal>

          {/* Shape 3: dark circle, rotated 14deg, bottom right. Carries the link. */}
          <Reveal
            delay={180}
            className="hero-shape hero-shape-right ml-auto rotate-[14deg] max-[767px]:ml-0 max-[767px]:mt-8 max-[767px]:w-[60%] max-[767px]:rotate-0 max-[479px]:w-[85%]"
          >
            <img
              loading="lazy"
              src="/hero/cta-circle.svg"
              alt=""
              className="h-full w-full"
            />
            <div className="absolute inset-0 mx-auto flex w-[70%] items-center justify-center px-[10px] text-center">
              <p className="m-0 text-lg leading-none">
                <span className="text-sky">{display.cta.line}</span>
                <br />
                <br />
                <Link
                  to={display.cta.link.to}
                  className="font-medium text-bg underline decoration-transparent underline-offset-4 transition-colors duration-150 hover:decoration-current focus-visible:ring-2 focus-visible:ring-bg focus-visible:outline-none"
                >
                  {display.cta.link.label}
                </Link>
                <br />
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
