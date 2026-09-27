import { Link, Navigate, useParams } from 'react-router-dom'
import { getAdjacentProjects, getProject, projects } from '../data.js'
import Reveal from '../components/Reveal.jsx'
import useDocumentTitle from '../hooks/useDocumentTitle.js'

const metaLabels = {
  role: 'Role',
  timeline: 'Timeline',
  team: 'Team',
  platform: 'Platform',
  status: 'Status',
}

const fills = {
  accent: 'bg-accent',
  sand: 'bg-sand',
  sky: 'bg-sky',
  terracotta: 'bg-terracotta',
  navy: 'bg-navy',
  ink: 'bg-ink',
}

// §5 Meta sidebar as data rows: thin hairline divider, text-meta keys.
function Meta({ project }) {
  return (
    <dl className="border-t border-hairline">
      {Object.entries(project.meta).map(([key, value]) => (
        <div
          key={key}
          className="flex items-baseline justify-between gap-6 border-b border-hairline py-3"
        >
          <dt className="label-meta">{metaLabels[key] ?? key}</dt>
          <dd className="text-right text-sm font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

function Prose({ paragraphs }) {
  return paragraphs.map((p, i) => (
    <p key={i} className="mb-5 text-body leading-relaxed text-ink-muted">
      {p}
    </p>
  ))
}

export default function CaseStudy() {
  const { slug } = useParams()
  const project = getProject(slug)

  // Unknown slug: send the visitor to the work grid rather than a dead end.
  // The hook call stays above the early return so it is never conditional.
  useDocumentTitle(project?.title)

  if (!project) return <Navigate to="/#work" replace />

  const { prev, next } = getAdjacentProjects(slug)
  const more = projects.filter((p) => p.slug !== slug).slice(0, 2)

  return (
    <main>
      <article>
        {/* Hero */}
        <header className="container-page pt-14 pb-12 sm:pt-20">
          <Link to="/#work" className="nav-link text-ink-muted hover:text-ink">
            &larr; All work
          </Link>

          <div className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <h1 className="font-serif text-display leading-[1.05]">{project.title}</h1>
            <span className="label-meta">{project.year}</span>
          </div>

          <p className="mt-6 max-w-2xl text-body text-ink-muted">{project.summary}</p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <li
                key={t}
                className="label-meta rounded-full border border-hairline px-3 py-1.5"
              >
                {t}
              </li>
            ))}
          </ul>
        </header>

        {/* Cover: solid fill stand-in for a real screenshot. */}
        <div className="container-page">
          <Reveal
            className={`aspect-16/9 w-full rounded-[20px] lg:aspect-21/9 ${fills[project.fill] ?? fills.sand}`}
          />
        </div>

        {/* Intro and meta */}
        <div className="container-page mt-14 grid gap-12 sm:mt-20 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <Prose paragraphs={project.intro} />
            <p className="mt-8 inline-block rounded-[6px] bg-accent px-3 py-2 font-semibold text-accent-ink">
              {project.outcome}
            </p>
          </div>
          <aside className="lg:pt-1">
            <Meta project={project} />
          </aside>
        </div>

        {/* Body */}
        <div className="container-page">
          {project.sections.map((section, i) => (
            <section key={section.heading} className="border-t border-hairline py-12 sm:py-16">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-20">
                <h2 className="text-h2 font-semibold tracking-tight">
                  <span className="label-meta mr-4 text-terracotta">0{i + 1}</span>
                  {section.heading}
                </h2>
                <div className="max-w-2xl">
                  <Prose paragraphs={section.body} />
                </div>
              </div>
            </section>
          ))}

          {project.pullquote && (
            <figure className="border-t border-hairline py-12 sm:py-16">
              <blockquote className="max-w-3xl font-serif text-h1 leading-tight italic text-balance">
                {project.pullquote}
              </blockquote>
              <figcaption className="label-meta mt-5">{project.pullquoteBy}</figcaption>
            </figure>
          )}
        </div>
      </article>

      {/* More work */}
      <section className="container-page border-t border-hairline py-16 sm:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-h2 font-semibold tracking-tight">More work</h2>
          <div className="flex gap-6">
            {prev && (
              <Link to={`/work/${prev.slug}`} className="nav-link text-ink-muted hover:text-ink">
                &larr; {prev.title}
              </Link>
            )}
            {next && (
              <Link to={`/work/${next.slug}`} className="nav-link text-ink-muted hover:text-ink">
                {next.title} &rarr;
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:gap-12">
          {more.map((p) => (
            <Link key={p.slug} to={`/work/${p.slug}`} className="group block">
              <div
                className={`aspect-4/5 w-full rounded-[18px] ${fills[p.fill] ?? fills.sand} transition-transform duration-200 ease-out group-hover:-translate-y-0.5`}
              />
              <p className="label-meta mt-4 text-ink group-hover:underline group-hover:underline-offset-4">
                {p.title}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
