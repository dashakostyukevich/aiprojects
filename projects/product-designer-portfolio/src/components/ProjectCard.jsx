import { Link } from 'react-router-dom'
import { color, colorClass } from '../lib/color.js'
import PhotoSlot from './PhotoSlot.jsx'

// First-screen project card. Flat, no border and no shadow: either a brand card
// (solid fill, centred lockup) or a photo card (full-bleed image). The label is
// plain text directly beneath, not a bordered box.
export default function ProjectCard({ project, ratio = 'aspect-square' }) {
  const isPhoto = project.kind === 'photo'
  // Token fills come through as a class; a raw client brand hex has to be an
  // inline style, since Tailwind only sees class names it can find in source.
  const fillClass = colorClass(project.fill)

  return (
    <article>
      <Link
        to={`/work/${project.slug}`}
        className="group block overflow-hidden rounded-card"
        // The visible label sits outside the link. Without this the accessible
        // name would be the entire slot, including the "Image needed" text that
        // only renders while a real photo is missing.
        aria-label={
          project.image
            ? undefined
            : `${project.title}, ${project.year}. Image pending, opens the case study.`
        }
      >
        {isPhoto ? (
          // `project.image` is null on every project, so this currently renders
          // a labelled slot rather than a photo. Supply a path in data.js and it
          // becomes a real image in the same reserved box.
          <PhotoSlot
            src={project.image}
            alt={project.imageAlt ?? `${project.title}, ${project.year}`}
            label={project.imageLabel ?? 'Product screenshot'}
            ratio={ratio}
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="rounded-card transition-transform duration-200 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <div
            className={`${fillClass ?? ''} ${ratio} flex w-full items-center justify-center p-10 transition-transform duration-200 ease-out group-hover:scale-[1.02]`}
            style={fillClass ? undefined : { backgroundColor: color(project.fill) }}
          >
            {/* Client lockup, centred with generous internal padding. The word
                is set in the display face rather than drawn as a logo, so it
                reads as a placeholder until the real mark is supplied.

                The ink colour is chosen per fill, not fixed to white. White on
                the chartreuse fill measured 1.16:1 and white on terracotta
                3.27:1, both unreadable; ink on those fills is 17.1:1 and 6.1:1.
                A real client logo would be supplied as an asset with its own
                contrast, so this only has to be legible while it is a word. */}
            <span
              className={`font-display text-3xl tracking-tight select-none sm:text-4xl ${
                project.fill === 'accent' || project.fill === 'sky'
                  ? 'text-accent-ink'
                  : 'text-white'
              }`}
            >
              {project.lockup ?? project.title}
            </span>
          </div>
        )}
      </Link>

      {/* The label carries the year and outcome on hover, so the grid conveys
          more than four titles. It is always in the DOM, not hover-only, so it
          is available to assistive tech and on touch. */}
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <p className="text-ink transition-colors duration-150 group-hover:text-ink-muted">
          {project.title}
        </p>
        <span className="label-meta shrink-0">{project.year}</span>
      </div>
    </article>
  )
}
