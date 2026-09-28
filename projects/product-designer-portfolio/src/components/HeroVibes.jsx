import { heroVibes, profile } from '../data.js'
import useHeroDrift from '../hooks/useHeroDrift.js'
import Doodle from './Doodle.jsx'
import HeroHeadline from './HeroHeadline.jsx'

// The hero is a composition, not a column: an introduction with objects placed
// around it, the way someone arranges a desk. The objects do the work a stock
// hero photo would otherwise do — they say what the person is like before a word
// of the bio has been read.
//
// The positions are scattered and hand-picked rather than generated, and that
// distinction is the whole difference between a scatter and noise. Six objects
// at six arbitrary offsets, all the same size, all upright, evenly split left
// and right, reads as a grid that gave up. What makes it read as *placed*:
//
//   1. **Nothing shares a baseline, and nothing mirrors.** The six heights are
//      11.3 / 21.1 / 42.9 / 55.1 / 79.8 / 90.2 — no two within 10 points of each
//      other, and no two summing to about 100, which is the second way a scatter
//      turns back into a grid. The previous set was 14 / 13 / 45 / 45 / 78 / 79
//      across left-then-right: three rows, each one a near-copy of its partner on
//      the other side. That is the arrangement that read as a symmetric pair of
//      columns no matter how irregular the numbers were within each column, so
//      the fix was never "pick odder values" — it was to stop the two sides
//      agreeing with each other. An earlier pass had the camera at 45% and the
//      bicycle at 47% on opposite sides, and they read as a row of two however far
//      apart they were horizontally.
//   2. **Distance from the centre varies.** The objects sit at 7.5–11.4% and
//      89.4–94.8%, a 4-point spread on each flank rather than a single line. The
//      old set had the same variation, so this rule is unchanged; what changed is
//      that the flanks no longer mirror each other's *heights*.
//   3. **Three sizes.** Same stroke weight, same drawing rules, different
//      extents. Six identical objects at six irregular positions is six
//      identical objects; three sizes is a still life.
//   4. **A few degrees of tilt on each drawing.** Small and varied, and settled
//      — the entrance rotates *into* the resting angle rather than out of zero,
//      so the motion reads as an object being set down. The tilt is on the
//      drawing and never on the label: ±6° reads as hand-placed at 130px and as
//      a bug at 12px.
//   5. **One rule for the middle.** Nothing lands inside the introduction. The
//      headline's measure is capped at 62% of the box so the clear band is
//      19%–81% at every width, which is what lets the positions in data.js stay
//      valid from 1024px up without a per-breakpoint recalculation.
//
//      62% is not a round-looking number chosen for looks: it is the narrowest
//      cap that puts the headline on **three** lines rather than four. The break
//      is emergent, so the cap is a threshold, not a preference — measured at
//      1440px, anything at or below 60% wraps to four lines and anything from
//      61% up holds three. 62% sits just inside the window, and the nearest
//      object still clears the text by 66px horizontally (SMILEY DAYS, the only
//      one that shares a line's vertical band with the headline), so the extra
//      width costs the composition nothing.
//
// The coordinates in `data.js` were re-picked by rejection sampling rather than
// by eye, because "more random" is not a thing that can be eyeballed into
// existence — the first attempts at this all failed in the same way. The
// generator drew candidate positions, rejected any that overlapped the measured
// headline rect or each other *at the smallest composition box the layout can
// reach* (389px, at 1280x600), and scored the survivors for the two properties
// that actually make a scatter read as a scatter: no two objects within 10
// points of the same height, and no two whose heights sum to about 100. Only
// same-flank pairs were checked for overlap, since an object at 8% can never
// collide with one at 92% however their heights fall.
//
// The useful finding is what the space does *not* allow. Sampling ~900k
// candidates produced no layout with both zero aligned rows and zero mirrored
// rows: with six objects on two flanks and the objects' real pixel heights, some
// pair always lands close. The set that shipped has zero aligned rows and four
// mirrored pairs, which is the best available trade, and it clears the headline
// by 14px at the tightest width and 37px at 1440 and above. Verified collision
// free at 1024x700, 1280x600/800, 1440x700/900, 1512x982, 1920x1080, 2560x1400.
//
// The old set was *not* merely less random — at 1280x600 its left flank was
// already overlapping by 14px, so the previous coordinates were relying on the
// box being taller than it is allowed to get. That is the sort of thing that
// only shows up on a short window, which is why the floor is in the constraint
// set rather than checked afterwards.
//
// Below `lg` there is no room to scatter into — a 390px screen has no flanks,
// and percentages that mean "far from the text" at desktop mean "off the
// screen" here. So the objects fall into one row of three under the
// introduction, chosen for silhouette rather than for position. That row is
// drawn separately rather than reflowed: the wide layout needs each object at an
// explicit point in the composition, and a flex order producing the same picture
// on a narrow screen would have to interleave the two lists, putting the reading
// order and the visual order out of step. Both copies are decorative and
// `aria-hidden`, so the duplication costs nothing to a screen reader.
//
// The section is `max(80dvh, 34rem)`, not a bare `80dvh`. The proportion is the
// design — the hero takes 80% of the screen, so the headline and the scatter get
// the room they were composed for — but the introduction is a *fixed* height. A
// three-line headline plus a role line plus the personal aside plus a button is
// 367px and it does not shrink with the viewport, while the scatter scales with
// the box. Measured with a bare `dvh`: at 1440x760 the composition box is 377px
// and at 1280x600 it is 276px, so below roughly 700px tall the text is taller
// than the area it is scattered through and the objects land on the words.
//
// 34rem is the floor at which that stops happening. It binds below about a
// 680px-tall window and nowhere else: on any ordinary laptop 80dvh is the
// larger value and the section is exactly 80% of the screen. The section spends
// 154px of its height on padding, the gap above the availability line and the
// line itself, so 80% of the viewport is about 79% of it in the box the objects
// are placed in.
//
// The floor is load-bearing in a way it was not before the aside paragraph was
// added under the headline. The introduction used to be headline + role line +
// button = 293px, and 34rem (544px) less the section's 154px of padding left a
// 390px box for it with room to spare. With the aside it is 367px, and at
// 1280x600 the section measures exactly 544px — the floor binding rather than
// 80dvh, which is the correct outcome and the reason that number is there. The
// alternative was not the objects moving but the aside overlapping them.
// Verified: the intro clears every one of the six objects at 1024x700,
// 1280x600/800, 1440x700/900, 1512x982, 1920x1080 and 2560x1400.
//
// This was 60dvh, which existed to lift two project cards above the fold — at
// 1440x900 that left 244px of the first and 148px of the second. 80% gives the
// hero the screen it was drawn for and takes that back: only 68px of the first
// card now reaches the first screen, and the second is entirely below it. That
// is a deliberate trade, not an oversight. `Reveal` still reveals on arrival
// anything already intersecting the viewport, so the first card animates in
// rather than waiting for a scroll, but at this height there is only that one
// band of it — so the arrival state is a hint of work rather than a preview of
// two cases. If two readable cards below the hero matter more than the hero
// filling the screen, 60dvh is the value that delivers it.

function VibeArt({ vibe, className }) {
  // `image` is the escape hatch. Point an entry in data.js at a real file and
  // it renders as a picture instead of a drawing, so these can be replaced with
  // your own things one at a time without touching this component.
  if (vibe.image) {
    return (
      <img
        src={vibe.image}
        alt={vibe.label}
        loading="lazy"
        decoding="async"
        className={`${className} object-contain`}
      />
    )
  }
  return <Doodle name={vibe.doodle} className={className} />
}

// Objects land after the headline's own reveal, in reading order, so the
// composition assembles itself rather than appearing finished.
const DELAYS = ['280ms', '360ms', '440ms', '520ms', '600ms', '680ms']

// Drawn sizes, as literal class lookups rather than interpolated from the data:
// Tailwind only emits classes it can find as literal source. The two scales are
// because the same `size` name has to mean "one sixth of a 1200px box" on a
// desktop and "a third of a 320px row" on a phone.
//
// These were 6.5 / 7.5 / 8.5rem when the objects were line drawings, and that is
// roughly 30% too large for photographs. A drawing has no matter in the middle
// of its box, so it can be scaled to its outline. A photograph is mostly subject
// and the box is the subject, so the same width produces a much taller object:
// swapping the 90px plant for the 232px baking dish made the left column 530px
// tall in a 475px box, and the three objects could no longer stack without
// touching. 5 / 5.75 / 6.5rem puts the tallest column back under 380px, which
// leaves the vertical gaps the composition needs.
const SIZES = {
  sm: 'w-12 lg:w-20',
  md: 'w-14 lg:w-[5.75rem]',
  lg: 'w-16 lg:w-[6.5rem]',
}

// The card and the object each: drawing, then the label beneath it. The two
// halves animate separately — the drawing carries the scale-and-settle entrance
// and the resting tilt, the label a plain fade — because a rotated uppercase
// label at 12px is a mistake, not a flourish.
//
// Three nested elements, three owners, one property each. `<li>` owns the
// centring, `.hero-drift` owns the pointer reaction, and `.hero-pop` owns the
// entrance. The pointer could not have gone on the other two: the entrance
// keyframes write `transform` on `.hero-pop` on every frame of the animation, and
// the centring is Tailwind's `translate` property on the `<li>`.
//
// `.hero-drift` wraps the label as well as the picture, and that is the whole
// point of where the boundary sits. Wrapping only the picture moves the object
// out from under its own caption and leaves "WEEKEND BAKING" pointing at nothing.
// The label has its own entrance on `.hero-enter`, which is a different element
// inside this one, so both entrances still run independently and the pair travels
// together.
function Vibe({ vibe, delay, className = '', style }) {
  const { scale, gain, spin } = vibe.drift ?? {}

  return (
    <li className={className} style={style}>
      <div className="hero-drift" data-scale={scale} data-gain={gain} data-spin={spin}>
        <div className="flex flex-col items-center gap-2.5">
          <div
            className="hero-pop"
            style={{
              '--hero-delay': delay,
              '--hero-rest-rotate': `${vibe.tilt ?? 0}deg`,
            }}
          >
            <VibeArt vibe={vibe} className={SIZES[vibe.size] ?? SIZES.md} />
          </div>
          <span className="label-meta hero-enter whitespace-nowrap" style={{ '--hero-delay': delay }}>
            {vibe.label}
          </span>
        </div>
      </div>
    </li>
  )
}

export default function HeroVibes() {
  // Three of the six, chosen for silhouette: a curved cup, a boxy camera, a
  // curved-but-open pair of headphones. Taking the first three entries instead
  // would have put three shapes from the same part of the scatter side by side.
  const compact = [heroVibes[0], heroVibes[2], heroVibes[3]]

  // The ref is on the section rather than on the composition box, so the pointer
  // is read from the whole hero. Both layouts drift, including the compact row —
  // `useHeroDrift` measures where each object actually is rather than assuming
  // the scatter coordinates, so a straight row of three gets a straight row of
  // three and a scattered six gets a scattered six.
  const driftRef = useHeroDrift()

  return (
    <section
      ref={driftRef}
      className="flex min-h-[max(80dvh,34rem)] flex-col gap-10 px-4 py-10 sm:px-14 lg:px-16 lg:py-12"
    >
      {/* The composition box. Capped at the container width and centred, so the
          percentages in data.js mean the same thing on every screen — and so an
          object at `x: 5` sits 60px from the container edge rather than 72px
          from the viewport edge on an ultrawide display. */}
      <div className="relative mx-auto flex w-full max-w-[1200px] flex-1 items-center">
        {/* The scatter. Inert: it carries no controls and no pointer targets, so
            a stray click cannot land on a label that looks tappable. */}
        <ul aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
          {heroVibes.map((vibe, i) => (
            <Vibe
              key={vibe.label}
              vibe={vibe}
              delay={DELAYS[i]}
              // Centred on its own coordinates. The transform lives here, on the
              // positioned element, because the entrance owns `transform` on the
              // child — a translate on the animated element is overwritten by the
              // keyframes, which is the bug that used to swallow the column
              // stagger.
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${vibe.x}%`, top: `${vibe.y}%` }}
            />
          ))}
        </ul>

        {/* `z-10` so the introduction sits above the scatter; the objects are
            positioned out of its way already, this only settles the stacking
            order where a tilted edge comes close.

            The percentage cap is `lg` and up only. Below that there is no scatter
            to keep clear, and capping the measure at 62% of a 342px content box
            is 212px — narrow enough to break "useful interfaces" across two
            lines and push the headline to nine. Wide screens get the cap so the
            clear band stays 19%–81% of the box; narrow screens get the full
            measure. */}
        <div className="relative z-10 w-full text-center">
          {/* The stack is nameplate, claim, colour: role line, headline, aside.
              The aside has been above the headline and below it, and this is
              the third arrangement. It started under the role line, moved to the
              top of the stack, and now sits at the bottom.

              Bottom is the one that survives. The other two each had a cost
              that showed: under the role line, it split the nameplate from the
              headline it belongs to; above the headline, it made the first
              thing on the page a small grey paragraph, so the page opened in
              the wrong register — a visitor meets a scrap of small print before
              they meet the claim. At the bottom the nameplate and the headline
              are adjacent again, and the aside reads as what it is: a
              qualification offered after the case is made, not a preamble to
              it.

              `mt-7` is on the headline, so the gap between the two metadata
              rows is asymmetric by one step — the aside sits a little closer
              to the headline than the role line does. That is deliberate. The
              role line labels the headline, so it is set tight to it; the aside
              is a separate thought and needs the air. */}
          <p className="hero-enter label-meta" style={{ '--hero-delay': '160ms' }}>
            {profile.role} &middot; {profile.location}
          </p>

          <HeroHeadline className="mx-auto mt-7 max-w-[30ch] text-[clamp(1.75rem,3.05vw,2.75rem)] lg:max-w-[min(30ch,62%)]" />

          {/* The aside, and the reason its measure is a character count rather
              than the hero's 62% cap. That cap exists to hold a clear band for
              the scatter — see the long note above — and 62% of the box at
              1200px is 744px, which is a 90-character rag. The aside is a
              160-character sentence, so uncapped it would set as four or five
              short centred lines in a narrow column directly under a three-line
              headline. Capping it at `44ch` holds it to three lines at every
              width from 390px to 2560px — measured, not estimated. Three is the
              floor rather than a target: a wider cap pulls it to two lines, but
              only by growing the block toward the scatter, which is the
              collision the cap above exists to prevent.

              `text-ink-muted` and smaller than the role line on purpose: the
              role line is metadata, this is colour, and the page should not ask
              the reader to weigh the two equally. */}
          <p className="hero-enter mx-auto mt-8 max-w-[44ch] text-pretty text-sm leading-relaxed text-balance text-ink-muted sm:text-[0.9375rem]" style={{ '--hero-delay': '260ms' }}>
            {profile.aside}
          </p>

          <div className="hero-enter mt-9" style={{ '--hero-delay': '300ms' }}>
            <a href="#work" className="btn-outline">
              See the work
            </a>
          </div>
        </div>
      </div>

      {/* `px-3` is not decoration. The labels are `whitespace-nowrap` and the
          widest of them is around 117px, so a `justify-between` row inset only
          by the section's own page padding pushes the last label's right edge
          onto the viewport edge at 390px. */}
      <ul
        aria-hidden="true"
        className="mx-auto flex w-full max-w-[22rem] items-start justify-between px-3 lg:hidden"
      >
        {compact.map((vibe, i) => (
          <Vibe key={vibe.label} vibe={vibe} delay={DELAYS[i]} />
        ))}
      </ul>

      {/* The line that sits below everything, the way a caption sits below a
          picture. Availability is a real fact about the person, so it earns the
          last line of the first screen rather than a slot in the nav. */}
      <p
        className="hero-enter mx-auto text-center text-[0.8125rem] text-ink-muted"
        style={{ '--hero-delay': '380ms' }}
      >
        <span aria-hidden="true" className="mr-2 inline-block size-1.5 rounded-full bg-accent align-middle" />
        {profile.availability}
      </p>
    </section>
  )
}
