import { Link } from 'react-router-dom'

export default function ProjectCard({ project }) {
  return (
    <article>
      <Link to={`/work/${project.slug}`} className="group block">
        <div
          className={`h-44 rounded-2xl bg-gradient-to-br ${project.accent} transition group-hover:opacity-90`}
        />
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="text-lg font-medium group-hover:underline group-hover:underline-offset-4">
            {project.title}
          </h3>
          <span className="text-sm text-neutral-400">{project.year}</span>
        </div>
      </Link>
      <p className="mt-2 text-neutral-600">{project.summary}</p>
      <p className="mt-3 text-sm font-medium text-neutral-900">{project.outcome}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {project.tags.map((t) => (
          <li
            key={t}
            className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs text-neutral-500"
          >
            {t}
          </li>
        ))}
      </ul>
    </article>
  )
}
