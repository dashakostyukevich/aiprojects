import { experience, profile, projects, services, testimonials } from '../data.js'
import CollageAbout from '../components/CollageAbout.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import Reveal from '../components/Reveal.jsx'

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

export default function Home() {
  return (
    <main>
      {/* Hero: full-bleed, serif display with the highlight phrase. */}
      <section className="container-page pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
        <Reveal>
          <p className="label-meta">
            {profile.role} / {profile.location}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-6 max-w-4xl font-serif text-display leading-[1.04] text-balance">
            {profile.headline.map((part, i) =>
              part.highlight ? (
                <span key={i} className="highlight font-serif italic">
                  {part.text}
                </span>
              ) : (
                <span key={i} className={part.italic ? 'italic' : undefined}>
                  {part.text}
                </span>
              ),
            )}
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a href="#work" className="btn-accent">
              See selected work
            </a>
            <span className="label-meta">{profile.availability}</span>
          </div>
        </Reveal>
      </section>

      {/* Statement: text-display-xl, one line per row, second line bleeding a
          few percent off the right edge. Sized in vw so both lines stay close
          to whole at any width. */}
      <section className="border-y border-hairline bg-surface py-16 sm:py-24">
        <p className="overflow-hidden text-[clamp(1.95rem,7.8vw,7rem)] leading-[0.94] font-extrabold tracking-[-0.03em] whitespace-nowrap uppercase">
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

      {/* Work */}
      <section id="work" className="container-page scroll-mt-24 py-16 sm:py-24 lg:py-32">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-6">
          <h2 className="text-h2 font-semibold tracking-tight">Selected work</h2>
          <p className="label-meta">{projects.length} projects</p>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="container-page scroll-mt-24 py-16 sm:py-24 lg:py-32">
        <h2 className="mb-12 border-b border-hairline pb-6 text-h2 font-semibold tracking-tight">
          What I do
        </h2>
        <div className="grid gap-10 sm:grid-cols-3 sm:gap-12">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 70}>
              <p className="label-meta mb-3 text-terracotta">0{i + 1}</p>
              <h3 className="text-h2 font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-3 text-body text-ink-muted">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* About: free-form collage section */}
      <div id="about" className="scroll-mt-24 border-t border-hairline">
        <CollageAbout />
      </div>

      {/* Bio, history, testimonials */}
      <section className="container-page border-t border-hairline py-16 sm:py-24 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            {profile.bio.map((p, i) => (
              <p
                key={i}
                className="mb-5 font-serif text-h2 leading-snug text-balance"
              >
                {p}
              </p>
            ))}
          </div>

          <div>
            <h3 className="label-meta mb-6">Words from</h3>
            <div className="space-y-4">
              {testimonials.map((t) => (
                <figure key={t.name} className="collage-card">
                  <blockquote className="font-serif text-h2 leading-snug italic">
                    {t.quote}
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
          <h3 className="label-meta mb-6">Experience</h3>
          <ExperienceRows />
        </div>
      </section>
    </main>
  )
}
