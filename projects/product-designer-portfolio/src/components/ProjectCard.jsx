import { Link } from 'react-router-dom'
import { color, colorClass } from '../lib/color.js'

// First-screen project card. Flat, no border and no shadow: either a brand card
// (solid fill, centred white lockup) or a photo card (full-bleed image). The
// label is plain text directly beneath, not a bordered box.
export default function ProjectCard({ project, ratio = 'aspect-square' }) {  const isPhoto = project.kind === 'photo'
  // Token fills come through as a class; a raw client brand hex has to be an
  // inline style, since Tailwind only sees class names it can find in source.
  const fillClass = colorClass(project.fill)

  return (
    <article>
      <Link
        to={`/work/${project.slug}`}
        className="group block overflow-hidden rounded-[22px]"
      >
        {isPhoto ? (
          project.image ? (
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className={`${ratio} w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02]`}
            />
          ) : (
            // Placeholder crop until a real screenshot is dropped into public/.
            // Keeps the slot at the right size so the row stays consistent.
            <span
              className={`${ratio} block w-full`}
              style={{
                backgroundImage: `linear-gradient(140deg, ${color('sky')} 0%, ${color('sand')} 100%)`,
              }}
            />
          )
        ) : (
          <div
            className={`${fillClass ?? ''} ${ratio} flex w-full items-center justify-center p-10 transition-transform duration-200 ease-out group-hover:scale-[1.02]`}
            style={fillClass ? undefined : { backgroundColor: color(project.fill) }}
          >
            {/* White logo lockup, centred with generous internal padding.
                Placeholder for the real client mark. */}
            <span className="font-serif text-3xl tracking-tight text-white select-none sm:text-4xl">
              {project.lockup ?? project.title}
            </span>
          </div>
        )}
      </Link>

      <p className="mt-4 text-ink">{project.title}</p>
    </article>
  )
}
