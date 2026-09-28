import { experience, profile, projects, services, testimonials } from '../data.js'
import CollageAbout from '../components/CollageAbout.jsx'
import HeroHeadline from '../components/HeroHeadline.jsx'
import NavRow from '../components/NavRow.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import Reveal from '../components/Reveal.jsx'
import SplitReveal from '../components/SplitReveal.jsx'
import WorkGrid from '../components/WorkGrid.jsx'

// §5 Data/meta rows: plain rows, thin hairline divider, text-meta columns.
function ExperienceRows() {
  return (
    <div className="border-t border-hairline">
      {experience.map((e) => (
        <div
          key={e.company}
          className="grid grid-cols-1 gap-1 border-b border-hairline py-5 sm:grid-cols-[7rem_1fr_1.4fr] sm:gap-6"
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

// Three services on an uneven 12-column composition: 5 / 4 / 3, with the second
// and third dropped a step so the row reads as staggered rather than as a
// three-up feature strip. Same content, same order, different geometry.
//
// The `01 02 03` numbers that used to sit above each title are gone. With the
// hero, About and (previously) Contact, the page was carrying far more
// uppercase micro-labels than a page this size can justify.
// The steps stay well under one heading-height apart on purpose. At 5/4/3 with
// lg:mt-16 and lg:mt-32 the third heading was pushed far enough to break its own
// line, and the section ended in ~200px of dead space under the last body copy.
const SERVICE_SPAN = [
  'lg:col-span-5',
  'lg:col-span-4 lg:mt-14',
  'lg:col-span-3 lg:mt-28',
]

function Services() {
  return (
    <section id="services" className="container-page pad-section scroll-mt-8">
      <SplitReveal
        as="h2"
        className="mb-12 max-w-[20ch] font-display text-h2 font-semibold tracking-[-0.02em] lg:mb-16"
      >
        What I do
      </SplitReveal>

      {/* Items are top-aligned, so the stagger reads as offset rather than as
          each block drifting down by its own height. */}
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-8">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 70} className={SERVICE_SPAN[i] ?? ''}>
            <SplitReveal
              as="h3"
              className="font-display text-h2 font-semibold tracking-[-0.02em] text-balance"
            >
              {s.title}
            </SplitReveal>
            <p className="mt-3 max-w-[42ch] text-body text-ink-muted">{s.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// Bio prose on the left, testimonials on the right. The two columns are now
// even: the bio was set at text-h2 in a 1.2fr column, so display scale was
// doing body-copy work and the column read heavier than the cards beside it.
function Bio() {
  return (
    <section className="container-page border-t border-hairline pad-section">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="mb-8 font-display text-h2 font-semibold tracking-[-0.02em]">
            A bit about the work
          </h2>
          {profile.bio.map((p, i) => (
            <p key={i} className="mb-5 max-w-[52ch] text-body leading-relaxed text-ink-muted">
              {p}
            </p>
          ))}
        </div>

        <div>
          {/* Promoted from an uppercase micro-label to a real h2, so the block
              carries its own hierarchy instead of borrowing the eyebrow's job. */}
          <h2 className="mb-8 font-display text-h2 font-semibold tracking-[-0.02em]">
            Words from
          </h2>
          <div className="space-y-4">
            {testimonials.map((t) => (
              <figure key={t.name} className="collage-card">
                <blockquote className="text-lg leading-snug font-medium text-balance">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="label-meta mt-4">
                  {t.name} / {t.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 lg:mt-24">
        <h2 className="mb-8 font-display text-h2 font-semibold tracking-[-0.02em]">
          Experience
        </h2>
        <ExperienceRows />
      </div>
    </section>
  )
}

// First screen is full-bleed: no canvas, no frame, no max-width wrapper. The
// hero fills the viewport height (below the nav) and the projects grid runs
// edge to edge, with only reading padding on the content itself.
function FirstScreen() {
  return (
    <>
      {/* Nav row: 72-80px tall, page padding, scrolls with the page. Padding
          tightens on a phone so the three pills plus the mark still fit. */}
      <NavRow className="h-18 px-4 sm:px-14 lg:px-16" />

      {/* The hero is the only above-the-fold block, so it is the only one that
          plays an entrance. The three parts are staggered 90ms apart to set
          reading order: eyebrow, headline, availability. `hero-enter` collapses
          to nothing under prefers-reduced-motion, and SplitReveal independently
          skips its own listener in that mode. */}
      <div className="flex min-h-[60dvh] items-center px-4 sm:px-14 lg:px-16">
        <div className="w-full py-10 sm:py-12">
          <p className="hero-enter label-meta mb-8 text-center" style={{ '--hero-delay': '0ms' }}>
            {profile.role} / {profile.location}
          </p>
          <HeroHeadline />
          <p
            className="hero-enter mt-10 text-center text-body text-ink-muted"
            style={{ '--hero-delay': '180ms' }}
          >
            {profile.availability}
          </p>
        </div>
      </div>

      <section id="work" className="scroll-mt-8 px-4 pb-24 sm:px-14 lg:px-16 lg:pb-32">
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

export default function Home() {
  return (
    <main>
      <FirstScreen />

      {/* Statement: text-statement, one line per row, second line bleeding a
          few percent off the right edge. Sized in vw so both lines stay close
          to whole at any width. */}
      <section className="border-y border-hairline bg-surface py-14 sm:py-20">
        <p className="overflow-hidden font-display text-statement leading-[0.94] font-bold tracking-[-0.045em] whitespace-nowrap uppercase">
          {profile.statement.map((line, i) => (
            <span
              key={i}
              className={`container-page block ${i % 2 ? 'text-ink-muted' : '-translate-x-[2vw]'}`}
            >
              {line}
            </span>
          ))}
        </p>
      </section>

      <Services />

      {/* About: the collage section. */}
      <div id="about" className="scroll-mt-8 border-t border-hairline">
        <CollageAbout />
      </div>

      <Bio />
    </main>
  )
}
