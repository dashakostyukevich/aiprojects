/**
 * Hand-drawn line art for the hero "vibe" objects.
 *
 * These are vector geometry, not pictures: every shape here is an exact path or
 * circle on a 100x100 grid, so nothing is faked or sketched. They are drawn to a
 * single rule so the set reads as one family rather than six cliparts:
 *
 *   - one stroke weight (1.6) and one cap/join style (round) everywhere
 *   - nothing filled, no shading, no texture — outline only
 *   - every drawing is optically centred in the box and fills roughly the same
 *     area, so six of them side by side do not read as one big one and five
 *     small ones
 *   - `currentColor`, so a doodle inherits the ink of whatever it sits on
 *
 * The colour is the only thing that changes between them. Swap the whole set
 * for your own images by giving an entry in `data.js` an `image` path instead of
 * a `doodle` name — see `VibeDoodles.jsx`.
 */

const PATHS = {
  // A cup and saucer, two curls of steam. The steam is the only part that
  // breaks the horizontal axis, so this one reads as the lightest of the six.
  coffee: (
    <>
      <path d="M27 46h40v18a12 12 0 0 1-12 12H39a12 12 0 0 1-12-12V46Z" />
      <path d="M67 52h6a9 9 0 0 1 0 18h-6" />
      <path d="M24 84h52" />
      <path d="M34 84c1.5 4.5 7 7 16 7s14.5-2.5 16-7" />
      <path d="M40 38c0-5 5-5 5-9.5S40 23 40 18.5" />
      <path d="M56 38c0-5 5-5 5-9.5S56 23 56 18.5" />
    </>
  ),

  // A plant in a pot. Leaves are closed teardrops built from two quadratic
  // curves, so they share the same silhouette as the pot's tapered sides.
  plant: (
    <>
      <path d="M50 62V36" />
      <path d="M50 42c-11 0-17-5.5-17-13 9.5-1.5 17 4 17 13Z" />
      <path d="M50 36c11 0 17-5.5 17-13-9.5-1.5-17 4-17 13Z" />
      <path d="M50 54c-8.5 0-13-4-13-9.5 7.5-1.5 13 2.5 13 9.5Z" />
      <path d="M50 50c8.5 0 13-4 13-9.5-7.5-1.5-13 2.5-13 9.5Z" />
      <path d="M32 62h36l-4.5 24h-27L32 62Z" />
      <path d="M30 62h40" />
    </>
  ),

  // A camera: body, viewfinder bump, two concentric lens rings, flash dot.
  camera: (
    <>
      <path d="M36 36l5.5-9h17L64 36" />
      <rect x="22" y="36" width="56" height="38" rx="8" />
      <circle cx="50" cy="55" r="12.5" />
      <circle cx="50" cy="55" r="5" />
      <path d="M31 45h6" />
      <circle cx="70" cy="44" r="2.4" fill="currentColor" stroke="none" />
    </>
  ),

  // An open book. Two page blocks either side of a spine, with two ruled lines
  // per page. The spine is the same weight as the outline on purpose.
  book: (
    <>
      <path d="M50 33c-7-5-16-7.5-26-6.5V67c10-1 19 1.5 26 6.5 7-5 16-7.5 26-6.5V26.5c-10-1-19 1.5-26 6.5Z" />
      <path d="M50 33v40.5" />
      <path d="M32 42c4-.2 7 .6 10 2M32 53c4-.2 7 .6 10 2" />
      <path d="M68 42c-4-.2-7 .6-10 2M68 53c-4-.2-7 .6-10 2" />
    </>
  ),

  // A bicycle, reduced to hubs and frame lines. Rear hub, bottom bracket, seat
  // cluster and bar cluster are the four corners everything else is drawn
  // between, and the fork has to land exactly on the front hub — an earlier
  // version dropped it 3px short and the whole drawing read as crossed lines
  // rather than as a bike.
  bike: (
    <>
      <circle cx="26" cy="64" r="17" />
      <circle cx="74" cy="64" r="17" />
      {/* Chain stay, seat tube, top tube. */}
      <path d="M26 64h24L36 38l32-3" />
      {/* Down tube, then the fork down to the front hub. */}
      <path d="M50 64 68 35l6 29" />
      <path d="M30 38h12" />
      <path d="M62 35h12" />
      <circle cx="50" cy="64" r="3" />
    </>
  ),

  // Over-ear headphones: one band, two cups, a cable-free silhouette. The
  // heaviest of the set, so it usually wants the largest box.
  headphones: (
    <>
      <path d="M23 62V53a27 27 0 0 1 54 0v9" />
      <rect x="15" y="57" width="19" height="27" rx="8.5" />
      <rect x="66" y="57" width="19" height="27" rx="8.5" />
      <path d="M34 62v17M66 62v17" />
    </>
  ),
}

export default function Doodle({ name, className = '' }) {
  const art = PATHS[name]
  // An unknown name renders an empty box rather than nothing, so a typo in
  // data.js is visible instead of silently leaving a hole in the composition.
  if (!art) return null

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {art}
    </svg>
  )
}
