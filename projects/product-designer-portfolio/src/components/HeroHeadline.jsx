import { profile } from '../data.js'
import SplitReveal from './SplitReveal.jsx'

// One paragraph, read as an inline flow. `em` marks the emphasised phrases and
// the line count is emergent from the measure rather than hardcoded, so the
// block reflows on narrow screens.
//
// `em` carries the same `highlight` treatment the About column and the footer
// use: the accent as a marker block behind the phrase, with `text-accent-ink` on
// top. It used to be `font-semibold` — 600 against 400 — and the reason it was
// weight rather than the marker is in the git history of this file. In short:
// the hero is the one place on the site where a 400/600 pair was doing real
// work, because at `uppercase` and up to 44px the caps have so little stroke
// contrast that a weight shift alone was nearly invisible. The marker block
// reads at any size and in any case, so the hero no longer has to shout to be
// seen. Weight is kept *underneath* the highlight as well, so the phrase is
// still differentiated by more than colour alone.
//
// `box-decoration-break: clone` inside the utility is what makes this survive
// the headline wrapping across three lines: without it a phrase broken over two
// lines gets a full-height block on the first and a full-height block on the
// second, with the background butting into the line gap. With it, each fragment
// of the phrase gets its own padding and the rag reads as intentional.
//
// The words are wrapped in `SplitReveal`, which masks and slides each one in,
// scrubbed by scroll (see that component). It is a heading, so it is <h1> via
// the `as` prop. `data-split` is what lets the marker survive that split: the
// wrapper's classes are copied onto every word it produces, and the spaces
// between those words carry the class too, so a two-word phrase stays one
// continuous block rather than two blocks with a gap.
//
// `className` is appended rather than ignored, because the hero sets its own
// measure. The headline is not a full-bleed line across the page any more, it
// is the centre of a three-part composition, so the measure is a character
// count the caller chooses rather than a width baked in here.
export default function HeroHeadline({ className = '' }) {
  return (
    <SplitReveal
      as="h1"
      className={`text-center font-display leading-[1.05] tracking-[-0.04em] text-balance uppercase ${className}`}
    >
      {profile.headline.map((part, i) => (
        // `data-split` tells SplitReveal to break this run into words so each
        // gets its own mask, while keeping the run's classes on all of them.
        <span key={i} data-split className={part.em ? 'highlight font-semibold' : undefined}>
          {part.text}
        </span>
      ))}
    </SplitReveal>
  )
}
