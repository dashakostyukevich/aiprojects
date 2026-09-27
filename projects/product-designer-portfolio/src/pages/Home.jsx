import { experience, profile, projects, services, testimonials } from '../data.js'
import Section from '../components/Section.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import useDocumentTitle from '../hooks/useDocumentTitle.js'

export default function Home() {
  useDocumentTitle(null)
  return (
    <main className="mx-auto w-full max-w-5xl px-6">
      {/* Hero */}
      <section className="py-20 sm:py-32">
        <p className="mb-4 text-sm text-neutral-500">
          {profile.role} · {profile.location}
        </p>
        <h1 className="max-w-3xl text-4xl leading-tight font-semibold tracking-tight sm:text-6xl">
          {profile.tagline}
        </h1>
        <p className="mt-6 text-lg text-neutral-500">{profile.availability}</p>
        <a
          href="#work"
          className="mt-10 inline-block rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          See selected work
        </a>
      </section>

      {/* Work */}
      <Section id="work" title="Selected work">
        <div className="grid gap-10 sm:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </Section>

      {/* Services */}
      <Section id="services" title="What I do">
        <div className="grid gap-8 sm:grid-cols-3">
          {services.map((s) => (
            <div key={s.title}>
              <h3 className="font-medium">{s.title}</h3>
              <p className="mt-2 text-neutral-600">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* About */}
      <Section id="about" title="About">
        <div className="grid gap-10 sm:grid-cols-[2fr_1fr]">
          <div>
            {profile.bio.map((p) => (
              <p key={p.slice(0, 24)} className="mb-4 text-lg text-neutral-700">
                {p}
              </p>
            ))}
            <div className="mt-8 space-y-6">
              {experience.map((e) => (
                <div key={e.company} className="border-l-2 border-neutral-200 pl-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-medium">
                      {e.role}, {e.company}
                    </h3>
                    <span className="text-sm text-neutral-400">{e.period}</span>
                  </div>
                  <p className="mt-1 text-neutral-600">{e.notes}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-[0.2em] text-neutral-400 uppercase">
              Words from
            </h3>
            {testimonials.map((t) => (
              <figure key={t.name} className="mb-6">
                <blockquote className="text-neutral-700 italic">“{t.quote}”</blockquote>
                <figcaption className="mt-2 text-sm text-neutral-500">
                  {t.name} — {t.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Section>
    </main>
  )
}
