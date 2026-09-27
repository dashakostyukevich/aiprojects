import { Link, Navigate, useParams } from 'react-router-dom'
import { getAdjacentProjects, getProject, projects } from '../data.js'
import useDocumentTitle from '../hooks/useDocumentTitle.js'

const metaLabels = {
  role: 'Role',
  timeline: 'Timeline',
  team: 'Team',
  platform: 'Platform',
  status: 'Status',
}

function Meta({ project }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
      {Object.entries(project.meta).map(([key, value]) => (
        <div key={key}>
          <dt className="text-xs font-semibold tracking-[0.15em] text-neutral-400 uppercase">
            {metaLabels[key] ?? key}
          </dt>
          <dd className="mt-1 text-neutral-800">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

function Prose({ paragraphs }) {
  return paragraphs.map((p, i) => (
    <p key={i} className="mb-4 text-lg leading-relaxed text-neutral-700">
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
    <main className="mx-auto w-full max-w-5xl px-6">
      <article>
        {/* Hero */}
        <header className="py-16 sm:py-24">
          <Link
            to="/#work"
            className="text-sm text-neutral-500 hover:text-neutral-900"
          >
            ← All work
          </Link>
          <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              {project.title}
            </h1>
            <span className="text-sm text-neutral-400">{project.year}</span>
          </div>
          <p className="mt-6 max-w-2xl text-lg text-neutral-600">{project.summary}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <li
                key={t}
                className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs text-neutral-500"
              >
                {t}
              </li>
            ))}
          </ul>
        </header>

        <div className={`h-64 rounded-3xl bg-gradient-to-br sm:h-96 ${project.accent}`} />

        {/* Intro + meta */}
        <div className="mt-16 grid gap-12 sm:mt-20 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div>
            <Prose paragraphs={project.intro} />
            <p className="mt-8 border-l-2 border-neutral-900 pl-4 text-xl font-medium">
              {project.outcome}
            </p>
          </div>
          <aside className="lg:border-l lg:border-neutral-200 lg:pl-8">
            <Meta project={project} />
          </aside>
        </div>

        {/* Body */}
        {project.sections.map((section) => (
          <section
            key={section.heading}
            className="mt-16 border-t border-neutral-200 pt-12 sm:mt-24"
          >
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {section.heading}
            </h2>
            <div className="mt-6 max-w-2xl">
              <Prose paragraphs={section.body} />
            </div>
          </section>
        ))}

        {project.pullquote && (
          <figure className="mt-16 border-t border-neutral-200 pt-12 sm:mt-24">
            <blockquote className="max-w-2xl text-2xl leading-snug font-medium tracking-tight sm:text-3xl">
              {project.pullquote}
            </blockquote>
            <figcaption className="mt-4 text-sm text-neutral-500">
              {project.pullquoteBy}
            </figcaption>
          </figure>
        )}
      </article>

      {/* More work */}
      <section className="mt-20 border-t border-neutral-200 py-16 sm:mt-28">
        <h2 className="text-sm font-semibold tracking-[0.2em] text-neutral-400 uppercase">
          More work
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {more.map((p) => (
            <Link
              key={p.slug}
              to={`/work/${p.slug}`}
              className="group flex items-center gap-4 rounded-xl border border-neutral-200 p-4 transition hover:border-neutral-400"
            >
              <div className={`h-12 w-20 shrink-0 rounded-lg bg-gradient-to-br ${p.accent}`} />
              <span className="font-medium group-hover:underline group-hover:underline-offset-4">
                {p.title}
              </span>
            </Link>
          ))}
        </div>

        {prev && next && (
          <div className="mt-10 flex flex-wrap justify-between gap-4 text-sm">
            <Link
              to={`/work/${prev.slug}`}
              className="text-neutral-500 hover:text-neutral-900"
            >
              ← {prev.title}
            </Link>
            <Link
              to={`/work/${next.slug}`}
              className="text-neutral-500 hover:text-neutral-900"
            >
              {next.title} →
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}
