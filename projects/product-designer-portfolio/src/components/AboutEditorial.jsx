import { profile } from '../data.js'
import AboutPortrait from './AboutPortrait.jsx'
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
//   - **The portrait is in colour.** It was black and white until there was a real
//     photograph to put in it, on the rule that the one picture of the person
//     should be the one picture not in colour. That was written for a placeholder
//     holding a column together; a real portrait at 416px is a colour photograph
//     either way, and the desaturation was only draining it. `grayscale` in
//     `AboutPortrait.jsx` brings the old treatment back. That portrait has a
//     second frame which fades in over it on hover, so it lives in its own
//     component rather than being a `PhotoSlot` with two more props — `PhotoSlot`
//     is the "image does not exist yet" marker and is used in five other places on
//     the site, none of which have a hover state.
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

      {/* 26rem, down from 30rem. The box is now 4/5 rather than 16/10, so at the
          old width it would have been 480x600px — taller than the paragraph above
          it, which breaks the "one centred column, every element the same optical
          weight" idea the section is built on. 416x520 sits between the two. */}
      <figure className="relative mx-auto mt-14 w-full max-w-[26rem] lg:mt-20">
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

        <AboutPortrait
          src={profile.portrait}
          hoverSrc={profile.portraitHover}
          alt={profile.portraitAlt ?? `${profile.name}, product designer`}
          // The second frame is the same person in the same room, so it gets no
          // alt of its own — a screen reader has no hover and would otherwise
          // read the same caption twice. See `AboutPortrait.jsx`.
          hoverAlt={profile.portraitHoverAlt ?? ''}
          // 4/5 rather than the 16/10 the slot reserved. Both source frames are
          // 1440x1508 — a little under square — and a 16/10 crop of that cuts the
          // top of the head and the chin, which is the one thing a portrait cannot
          // lose. 4/5 is the nearest sensible ratio that keeps the face whole, and
          // the box is narrower to match, so the column stays as tight as it was.
          ratio="aspect-[4/5]"
        />
      </figure>

      <div className="mt-14 lg:mt-20">
        <Paragraph parts={profile.bio[1]} />
      </div>
    </section>
  )
}
