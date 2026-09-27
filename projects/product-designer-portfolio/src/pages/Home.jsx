import { experience, profile, projects, services, testimonials } from '../data.js'
import CollageAbout from '../components/CollageAbout.jsx'
import HeroHeadline from '../components/HeroHeadline.jsx'
import HeroSection from '../components/sections/HeroSection.jsx'
import NavRow from '../components/NavRow.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import Reveal from '../components/Reveal.jsx'
import ShowcaseFrame from '../components/ShowcaseFrame.jsx'

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

function FirstScreen() {
  return (
    <ShowcaseFrame>
      {/* Nav row: 72-80px tall, canvas padding, scrolls with the page. Padding
          tightens on a phone so the three pills plus the mark still fit. */}
      <NavRow className="h-18 px-4 sm:px-14 lg:px-16" />

      <div className="px-4 pb-10 sm:px-14 sm:pb-14 lg:px-16">
        <div className="pt-14 pb-20 sm:pt-20">
          <Reveal>
            <p className="label-meta mb-8 text-center">
              {profile.role} / {profile.location}
            </p>
            <HeroHeadline />
            <p className="mt-10 text-center text-body text-ink-muted">
              {profile.availability}
            </p>
          </Reveal>
        </div>

        <section id="work" className="scroll-mt-8">
          <div className="grid grid-cols-1 gap-x-11 gap-y-12 md:grid-cols-2">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </ShowcaseFrame>
  )
}

export default function Home() {
  return (
    <main>
      <FirstScreen />

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

      {/* Display section: headline row over the three-shape composition. */}
      <HeroSection />

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
