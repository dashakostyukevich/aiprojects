/**
 * The asterisk.
 *
 * This is the site's one recurring mark. It is the logo in the nav, the shape
 * that collides with the portrait in About and the mark at the end of the
 * services list — always the same six-arm polygon, always the same proportions,
 * so it reads as a signature rather than as four different decorations.
 *
 * It is never set inside a sentence. It used to drop into the hero headline as
 * an inline chip between two words, and it could not survive there: SplitReveal
 * renders every word as its own `inline-block` mask, and browsers break lines
 * between adjacent inline-blocks whether or not whitespace separates them, so
 * the mark orphaned onto the start of the next line every time. As standalone
 * punctuation it always lands where it was put.
 *
 * It is geometry, not a drawing: twelve computed points on a 100x100 grid
 * alternating between an outer radius of 36 and an inner one of 10. The inner
 * radius is what makes it an asterisk rather than a star — at 36 the notches
 * between the arms are too shallow to read, at 10 the six arms separate cleanly
 * and it looks like three bars crossing.
 *
 * `strokeWidth` is in the viewBox's own units, not pixels, and it has to be set
 * per use. The polygon is drawn on a 100-unit grid, so a stroke of 2 renders as
 * `size / 50` CSS pixels: a crisp 1.4px line on the 144px mark in About, but an
 * invisible 0.5px hairline on the 24px one in the nav. Pass a value in proportion
 * to how large the shape is actually drawn.
 *
 * `fill` defaults to the page canvas so the shape punches a hole in whatever it
 * overlaps; pass `fill="none"` for a pure outline, which is what the nav logo
 * and the marks at the ends of the services and About sections all use.
 */
// The pairs are comma-separated. A `points` list is a coordinate-pair list, not
// path data: the grammar allows only comma-and-whitespace between pairs, so the
// `"50 14 L 56.5 38.7 …"` form that is perfectly valid inside a `d` attribute
// parses to *zero* points here and the mark silently renders as nothing at all.
// It is the kind of failure that leaves the element in the DOM, correctly
// sized and correctly coloured, with no shape on it.
//
// `polygon` closes the path implicitly for both fill and stroke, so there is no
// closing `Z` to add.
const POINTS =
  '50,14 55,41.3 81.2,32 60,50 81.2,68 55,58.7 50,86 45,58.7 18.8,68 40,50 18.8,32 45,41.3'

export default function Spark({
  className = 'size-8',
  rotate = 0,
  strokeWidth = 2,
  fill = 'fill-bg',
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${fill} ${className}`}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
    >
      <polygon points={POINTS} />
    </svg>
  )
}
