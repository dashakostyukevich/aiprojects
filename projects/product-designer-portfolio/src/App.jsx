import { experience, profile, projects, services, testimonials } from './data.js'

const nav = [
  ['Work', '#work'],
  ['Services', '#services'],
  ['About', '#about'],
  ['Contact', '#contact'],
]

function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-neutral-200 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-5xl px-6">
        <h2 className="mb-10 text-sm font-semibold tracking-[0.2em] text-neutral-400 uppercase">
          {title}
        </h2>
        {children}
      </div>
    </section>
  )
}

function App() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-neutral-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <span className="font-medium">{profile.name}</span>
          <nav className="flex gap-5 text-sm text-neutral-600">
            {nav.map(([label, href]) => (
              <a key={href} href={href} className="hover:text-neutral-900">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

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
              <article key={p.title} className="group">
                <div className={`h-44 rounded-2xl bg-gradient-to-br ${p.accent}`} />
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-medium">{p.title}</h3>
                  <span className="text-sm text-neutral-400">{p.year}</span>
                </div>
                <p className="mt-2 text-neutral-600">{p.summary}</p>
                <p className="mt-3 text-sm font-medium text-neutral-900">{p.outcome}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs text-neutral-500"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
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

      {/* Contact */}
      <footer id="contact" className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto w-full max-w-5xl px-6 py-20">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Let’s work together
          </h2>
          <a
            href={`mailto:${profile.email}`}
            className="mt-4 inline-block text-lg text-neutral-600 underline underline-offset-4 hover:text-neutral-900"
          >
            {profile.email}
          </a>
          <div className="mt-10 flex flex-wrap gap-5 text-sm text-neutral-500">
            {profile.links.map((l) => (
              <a key={l.label} href={l.href} className="hover:text-neutral-900">
                {l.label}
              </a>
            ))}
          </div>
          <p className="mt-12 text-sm text-neutral-400">
            © {new Date().getFullYear()} {profile.name}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
