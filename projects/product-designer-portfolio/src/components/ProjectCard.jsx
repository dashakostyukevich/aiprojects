import { Link } from 'react-router-dom'

// §5 Project/work grid. 4:5 card, 18px radius, solid colour fill, and the
// label directly beneath it as text-meta with no card chrome. The accent is
// reserved for the outcome marker, never for chrome.
const fills = {
  accent: 'bg-accent',
  sand: 'bg-sand',
  sky: 'bg-sky',
  terracotta: 'bg-terracotta',
  navy: 'bg-navy',
  ink: 'bg-ink',
}

export default function ProjectCard({ project }) {
  return (
    <article>
      <Link to={`/work/${project.slug}`} className="group block">
        <div
          className={`aspect-4/5 w-full rounded-[18px] ${fills[project.fill] ?? fills.sand} transition-transform duration-200 ease-out group-hover:-translate-y-0.5`}
        />
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="label-meta text-ink transition group-hover:underline group-hover:underline-offset-4">
            {project.title}
          </h3>
          <span className="label-meta">{project.year}</span>
        </div>
      </Link>

      <p className="mt-3 text-sm text-ink-muted">{project.summary}</p>
      <p className="mt-3 flex items-start gap-2 text-sm font-semibold">
        <span className="mt-1.5 size-2 shrink-0 rounded-[2px] bg-accent" aria-hidden="true" />
        {project.outcome}
      </p>
    </article>
  )
}
