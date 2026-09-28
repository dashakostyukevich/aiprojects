// First-screen projects grid: an intentionally uneven 12-column composition.
//
// Every project carries three placement keys (see `projects` in data.js):
//   `size`  — column span. `wide` takes 7 and `narrow` takes 5, so the cards pair
//             up into full rows (7+5, 5+7) and nothing leaves a gap. `full` takes
//             all 12 and is a closer: a single card on the last row would
//             otherwise leave a hole in the grid. Five projects is an odd count,
//             so they pair as 7+5, 5+7 and then one 12.
//   `ratio` — the crop. Two different crops on the same row is most of what
//             makes the grid read as varied rather than as a table of squares.
//   `drop`  — a top offset applied from `lg` up, so a card can start lower than
//             its neighbour and the row reads as staggered. Mobile ignores it
//             entirely: below `lg` every card is one full-width column in array
//             order, which is the only sane reading order on a phone.
//
// Row gaps grow with the viewport (`gap-y-16` to `gap-y-24`) and the column gap
// is generous, so the grid breathes rather than tiling. The row gap is
// deliberately smaller than a `drop`: a drop is meant to stagger a card against
// its neighbour, not to add another band of whitespace to the whole row.
const SPAN = {
  wide: 'lg:col-span-7',
  narrow: 'lg:col-span-5',
  full: 'lg:col-span-12',
}

const RATIO = {
  wide: 'aspect-[16/10]',
  landscape: 'aspect-[4/3]',
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  // Only for a `full` closer. A 12-column card at 16/10 would be 750px tall on
  // a 1200px grid, which is taller than the first screen; 21/9 brings it to
  // roughly 510px, which still reads as a substantial image band.
  band: 'aspect-[21/9]',
}

// Stagger steps. Kept to a small set so the offsets read as a rhythm instead of
// as arbitrary nudges.
const DROP = {
  sm: 'lg:mt-10',
  md: 'lg:mt-16',
  lg: 'lg:mt-24',
  xl: 'lg:mt-32',
}

export default function WorkGrid({ projects, renderCard }) {
  return (
    <div
      className="grid grid-cols-1 gap-x-10 gap-y-16 sm:gap-x-14 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-20 xl:gap-y-24"
    >
      {projects.map((p, i) => (
        <div
          key={p.slug}
          className={`${SPAN[p.size] ?? SPAN.narrow} ${DROP[p.drop] ?? ''}`}
        >
          {renderCard(p, RATIO[p.ratio] ?? RATIO.square, i)}
        </div>
      ))}
    </div>
  )
}
