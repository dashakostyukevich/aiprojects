import { profile } from '../data.js'
import PhotoSlot from './PhotoSlot.jsx'
import Spark from './Spark.jsx'
import SplitReveal from './SplitReveal.jsx'

// About, set as one centred column.
//
// The whole section is a single centred measure running top to bottom: a
// bracketed heading, a paragraph, a portrait, another paragraph. Symmetry is the
// organising idea — every element shares the same optical centre, including the
// asterisk, which is the one thing allowed to break the grid by hanging off the
// left edge of the photograph.
//
// Three decisions carry it:
//
//   - **Uppercase at a real size.** The body copy is set in caps at 17–24px,
//     not at 12px. Small uppercase reads as a legal notice; large uppercase
//     reads as a poster. The measure stays short enough that the caps remain
//     legible and `text-balance` never opens a river in the rag.
//   - **Emphasis is a marker, not a colour.** Each highlighted phrase takes the
//     accent as a highlighter block — the same treatment the hero headline uses
//     — and one phrase per page is italic, which is the only real slanted cut
//     anywhere on the site. The reference this follows ran three different
//     highlight colours in a row; one accent used twice is the version that
//     fits a system with a single accent in it.
//   - **The portrait is black and white.** Every other image on the site is in
//     colour, so the one picture of the person is the one that is not. Drop
//     `grayscale` below to opt out.
//
// The copy is the same `profile.bio` the page has always used, reshaped into
// paragraphs of segments so a phrase can be emphasised without hardcoding markup
// into the data file.

const HEADING =
  'text-center font-display text-[clamp(2.75rem,_1.1rem_+_7.4vw,_6rem)] leading-[0.95] font-medium tracking-[-0.04em] uppercase'

function Paragraph({ parts }) {
  return (
    <p className="mx-auto max-w-[34ch] text-center font-sans text-[clamp(1.0625rem,_0.95rem_+_0.55vw,_1.5rem)] leading-[1.5] tracking-[-0.01em] text-balance uppercase sm:max-w-[44ch] lg:max-w-[54ch]">
      {parts.map((part, i) => {
        if (part.em) {
          // `highlight` is the marker utility from index.css. The
          // `box-decoration-break: clone` inside it is what lets the block
          // survive a line break in the middle of a phrase.
          return (
            <span key={i} className="highlight">
              {part.text}
            </span>
          )
        }
        if (part.italic) {
          // Geist has a real italic cut, so this is a genuine slant rather than
          // the synthesised oblique a display face would produce.
          return (
            <em key={i} className="font-medium">
              {part.text}
            </em>
          )
        }
        return <span key={i}>{part.text}</span>
      })}
    </p>
  )
}

export default function AboutEditorial() {
  return (
    <section id="about" className="container-page pad-section">
      <SplitReveal as="h2" className={HEADING}>
        {/* Three runs so the brackets can be stepped down in tone while the
            word between them stays at full ink. SplitReveal breaks each run
            into words and gives every one its own mask, so the whole line
            scrubs in rather than appearing at once. The runs are written
            without whitespace between them on purpose: SplitReveal emits a
            literal space for any trailing space inside a run, and "[. About.]"
            with a gap in the middle is not the mark. */}
        <span data-split className="text-ink-muted">[.</span>
        <span data-split>About</span>
        <span data-split className="text-ink-muted">.]</span>
      </SplitReveal>

      <div className="mt-12 lg:mt-16">
        <Paragraph parts={profile.bio[0]} />
      </div>

      <figure className="relative mx-auto mt-14 w-full max-w-[30rem] lg:mt-20">
        {/* The asterisk hangs off the left edge and overlaps the photograph. It
            is filled with the page canvas, so it reads as a shape resting on
            top rather than as a hole punched through the picture. Below `sm` it
            is dropped entirely: at 375px an overhang would collide with the
            paragraph above it. */}
        <Spark
          className="absolute -top-8 -left-10 z-10 hidden size-28 text-ink lg:block lg:size-36"
          rotate={-10}
          strokeWidth={3}
        />

        <PhotoSlot
          src={profile.portrait ?? null}
          alt={profile.portraitAlt ?? `${profile.name}, product designer`}
          label={`Portrait of ${profile.name}`}
          ratio="aspect-[16/10]"
          // The filter goes on the photograph, not on the slot. PhotoSlot puts
          // `className` on the frame it wraps *everything* in, so a permanent
          // `grayscale` also desaturated the placeholder's sand fill and turned
          // it into a dead grey rectangle. With no portrait there is nothing to
          // desaturate, so the filter waits for a real file to arrive.
          className={profile.portrait ? 'grayscale' : undefined}
        />
      </figure>

      <div className="mt-14 lg:mt-20">
        <Paragraph parts={profile.bio[1]} />
      </div>
    </section>
  )
}
