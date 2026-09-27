// First-screen projects grid: an intentionally uneven 12-column composition.
//
// Every project carries three placement keys (see `projects` in data.js):
//   `size`  — column span. `wide` takes 7, `narrow` takes 5, so the four cards
//             pair up into two full rows (7+5, 5+7) and nothing leaves a gap.
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
}

const RATIO = {
  wide: 'aspect-[16/10]',
  landscape: 'aspect-[4/3]',
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
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
