import { experience, projects, testimonials } from '../data.js'
import AboutEditorial from '../components/AboutEditorial.jsx'
import HeroVibes from '../components/HeroVibes.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import Reveal from '../components/Reveal.jsx'
import Services from '../components/Services.jsx'
import WorkGrid from '../components/WorkGrid.jsx'

// §5 Data/meta rows: plain rows, thin hairline divider, text-meta columns.
function ExperienceRows() {
  return (
    <div className="border-t border-hairline">
      {experience.map((e) => (
        <div
          key={e.company}
          className="grid grid-cols-1 gap-1 border-b border-hairline py-5 sm:grid-cols-[8.5rem_1fr_2fr] sm:gap-6"
        >
          <span className="label-meta">{e.period}</span>
          <span className="text-sm font-semibold sm:text-body">
            {e.role}, {e.company}
          </span>
          <span className="text-sm text-ink-muted">{e.notes}</span>
        </div>
      ))}
    </div>
  )
}

// Experience, immediately after the work grid: the grid above shows what was
// made, this says where it was made.
//
// It gets the full container. It used to share a two-column row with the
// testimonials and took seven of twelve columns, but the rows are a three-column
// data table — period, role, notes — and the notes column is the only one worth
// reading, so it was being squeezed for the sake of sitting beside two quotes.
function Experience() {
  return (
    <section id="experience" className="container-page pad-section">
      <h2 className="mb-8 font-display text-h2 font-semibold tracking-[-0.02em]">
        Experience
      </h2>
      <ExperienceRows />
    </section>
  )
}

// Testimonials, after About rather than beside the experience rows. The quotes
// are about the person, so they belong next to the section that introduces the
// person; putting them two sections earlier asked the reader to weigh a
// reference from someone they had not been told anything about yet.
function References() {
  return (
    <section id="references" className="container-page border-t border-hairline pad-section">
      <h2 className="mb-8 font-display text-h2 font-semibold tracking-[-0.02em]">
        Words from
      </h2>
      {/* Two cards on one row rather than two stacked in a narrow column: the
          quotes are one to two lines each, and a full-width card holding two
          lines of text is a very wide, very short rectangle. */}
      <div className="grid gap-4 sm:grid-cols-2">
        {testimonials.map((t) => (
          <figure key={t.name} className="card-surface">
            <blockquote className="text-lg leading-snug font-medium text-balance">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="label-meta mt-4">
              {t.name} / {t.title}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

// First screen is full-bleed: no canvas, no frame, no max-width wrapper. The
// hero fills the viewport below the nav, and the projects grid runs edge to
// edge, with only reading padding on the content itself.
function FirstScreen() {
  return (
    <>
      {/* The nav itself is fixed and lives in App, so this is only the offset
          that keeps the hero out from under it. */}
      <div aria-hidden="true" className="nav-offset" />

      {/* The hero is the only above-the-fold block, so it is the only one that
          plays an entrance. The parts are staggered to set reading order:
          headline, role, action, availability, then the objects beside them.
          `hero-enter` and `hero-pop` both collapse to nothing under
          prefers-reduced-motion, and SplitReveal independently skips its own
          listener in that mode. */}
      <HeroVibes />

      <section id="work" className="px-4 pb-24 sm:px-14 lg:px-16 lg:pb-32">
        <div className="mx-auto max-w-[1200px]">
          <WorkGrid
            projects={projects}
            renderCard={(p, ratio, i) => (
              <Reveal delay={i * 60}>
                <ProjectCard project={p} ratio={ratio} />
              </Reveal>
            )}
          />
        </div>
      </section>
    </>
  )
}

// Section order, and why:
//
//   hero        who this is, and the objects that say what they are like
//   work        the case studies, immediately
//   experience  where the work was done — proof, before the pitch
//   services    what they can hire for
//   about       who they are, read slowly
//   references  what other people say about them
//
// Experience sits between the work and the services on purpose: the work is the
// claim, the experience is the evidence for it, and the services are what the
// reader does with that. It used to be the last section on the page, which
// asked someone to commit to the services before they had seen a single employer
// or date.
//
// The statement band sat here for a while — the thesis, on the page's only
// full-bleed colour field. It is gone, and the gap it left is deliberate: the
// hero already states the position, so a second full-bleed claim two scrolls
// down was saying the same thing louder. The page now steps straight from the
// work into the evidence for it. `StatementBand.jsx` was removed with it, along
// with the `statement` field in `profile` and the `--text-statement` token.
//
// The page also gets quieter as it goes: full-bleed type, then data rows, then
// cards, then a centred column, then two small quote cards.
export default function Home() {
  return (
    <main>
      <FirstScreen />
      <Experience />
      <Services />
      <AboutEditorial />
      <References />
    </main>
  )
}
