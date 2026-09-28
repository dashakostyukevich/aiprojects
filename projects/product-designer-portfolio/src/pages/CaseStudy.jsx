import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { getAdjacentProjects, getProject, projects } from "../data.js";
import { color, colorClass } from "../lib/color.js";
import Body from "../components/CaseStudyBody.jsx";
import NavRow from "../components/NavRow.jsx";
import PhotoSlot from "../components/PhotoSlot.jsx";
import Reveal from "../components/Reveal.jsx";
import useDocumentMeta from "../hooks/useDocumentMeta.js";

const metaLabels = {
  role: "Role",
  timeline: "Timeline",
  team: "Team",
  platform: "Platform",
  status: "Status",
};

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
  );
}

// Intro prose. Delegates to Body so a paragraph and a list can sit in the same
// array if a case study ever needs that; today both intros are plain strings.
function Prose({ paragraphs }) {
  return <Body blocks={paragraphs} />;
}

export default function CaseStudy() {
  const { slug } = useParams();
  const { pathname } = useLocation();
  const project = getProject(slug);

  // Both hook calls sit above the early return so neither is ever conditional.
  // The meta hook resolves an unknown slug to the not-found title, which is
  // correct for the frame before the redirect lands.
  useDocumentMeta(pathname);

  // Unknown slug: send the visitor to the work grid rather than a dead end.
  if (!project) return <Navigate to="/#work" replace />;

  const { prev, next } = getAdjacentProjects(slug);
  const more = projects.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <main>
      <article>
        {/* Hero */}
        <header className="container-page pt-8 pb-12 sm:pt-10">
          <NavRow className="mb-12 border-b border-hairline pb-6 sm:mb-16" />

          <Link to="/#work" className="nav-link text-ink-muted hover:text-ink">
            &larr; All work
          </Link>

          <div className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <h1 className="font-display text-display leading-[1.05] tracking-[-0.03em]">
              {project.title}
            </h1>
            <span className="label-meta">{project.year}</span>
          </div>

          <p className="mt-6 max-w-2xl text-body text-ink-muted">
            {project.summary}
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <li
                key={t}
                className="label-meta rounded-card border border-hairline px-3 py-1.5"
              >
                {t}
              </li>
            ))}
          </ul>
        </header>

        {/* Cover. `project.cover` is null on every case study, so this renders a
            labelled slot. Supply a path in data.js and it becomes the real
            cover image in the same reserved box, which is what keeps the page
            from reflowing when one is added. */}
        <div className="container-page">
          <Reveal className="w-full">
            <PhotoSlot
              src={project.cover}
              alt={project.coverAlt ?? `${project.title} interface`}
              label={
                project.coverLabel ?? "Hero screenshot of the shipped product"
              }
              ratio="aspect-16/9 lg:aspect-21/9"
              sizes="(min-width: 1024px) 1160px, 100vw"
              className="rounded-card"
            />
          </Reveal>
        </div>

        {/* Intro and meta */}
        <div className="container-page mt-14 grid gap-12 sm:mt-20 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <Prose paragraphs={project.intro} />
            <p className="mt-8 inline-block rounded-control bg-accent px-3 py-2 font-semibold text-accent-ink">
              {project.outcome}
            </p>
          </div>
          <aside className="lg:pt-1">
            <Meta project={project} />
          </aside>
        </div>

        {/* Body */}
        <div className="container-page">
          {project.sections.map((section) => (
            <section
              key={section.heading}
              className="border-t border-hairline py-12 sm:py-16 lg:py-20"
            >
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-20">
                {/* The `01 02 03` numbers are gone. A case study is a document,
                    not a feature grid, and numbering every section was the same
                    eyebrow tic as the services row. The heading alone carries
                    the hierarchy. */}
                <h2 className="font-display text-h2 font-semibold tracking-[-0.02em]">
                  {section.heading}
                </h2>
                {/* Body carries the full block grammar, so lists, tables, nested
                    sub-sections and image slots all arrive here in the author's
                    order. See CaseStudyBody.jsx.

                    `min-w-0` is load-bearing. A grid item defaults to
                    `min-width: auto`, so the widest unbreakable descendant sets
                    the column width instead of the other way round. A wide table
                    inside would then push the whole page into horizontal scroll
                    on a phone. */}
                <div className="min-w-0 max-w-2xl">
                  <Body blocks={section.body} />
                </div>
              </div>
            </section>
          ))}

          {project.pullquote && (
            <figure className="border-t border-hairline py-12 sm:py-16">
              {/* No `italic`: Space Grotesk has no italic cut, so the browser
                  would synthesise a slanted oblique. The display face at h1
                  gives the quote its weight. */}
              <blockquote className="max-w-3xl font-display text-h1 leading-tight tracking-[-0.02em] text-balance">
                {project.pullquote}
              </blockquote>
              <figcaption className="label-meta mt-5">
                {project.pullquoteBy}
              </figcaption>
            </figure>
          )}
        </div>
      </article>

      {/* More work. Hidden when there are fewer than three projects, because
          with only two the whole section is the single other project: the
          `more` card, `prev` and `next` all resolve to it, so the page ends with
          three separate links to one destination. The `All work` link at the top
          of the case study already covers navigation in that case. */}
      {more.length > 0 && projects.length > 2 && (
        <section className="container-page border-t border-hairline py-16 sm:py-24 lg:py-32">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 lg:mb-14">
            <h2 className="font-display text-h2 font-semibold tracking-[-0.02em]">
              More work
            </h2>
            {/* Only shown when prev/next reach projects the cards below do not.
                With three projects the cards are already the other two, so the
                links would name the same destinations twice in one block. They
                earn their place from four projects up, where the two cards are
                the first two of the rest and prev/next can point elsewhere. */}
            {more.length > 0 && projects.length > 3 && (
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {prev && (
                  <Link
                    to={`/work/${prev.slug}`}
                    className="nav-link text-ink-muted transition-colors hover:text-ink"
                  >
                    &larr; {prev.title}
                  </Link>
                )}
                {next && (
                  <Link
                    to={`/work/${next.slug}`}
                    className="nav-link text-ink-muted transition-colors hover:text-ink"
                  >
                    {next.title} &rarr;
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-12">
            {more.map((p) => (
              <Link key={p.slug} to={`/work/${p.slug}`} className="group block">
                {p.kind === "photo" ? (
                  <PhotoSlot
                    src={p.image}
                    alt={p.imageAlt ?? `${p.title}, ${p.year}`}
                    label={p.imageLabel ?? "Product screenshot"}
                    ratio="aspect-4/5"
                    sizes="(min-width: 640px) 30vw, 45vw"
                    className="rounded-card transition-transform duration-200 ease-out group-hover:-translate-y-0.5"
                  />
                ) : (
                  <div
                    className={`${colorClass(p.fill) ?? ""} aspect-4/5 w-full overflow-hidden rounded-card transition-transform duration-200 ease-out group-hover:-translate-y-0.5`}
                    style={
                      colorClass(p.fill)
                        ? undefined
                        : { backgroundColor: color(p.fill) }
                    }
                  >
                    {/* Per-fill ink, same reason as ProjectCard: white on the
                      chartreuse fill is 1.16:1 and on terracotta 3.27:1. */}
                    <span
                      className={`flex h-full w-full items-center justify-center p-8 text-center font-display text-2xl tracking-tight select-none ${
                        p.fill === "accent" || p.fill === "sky"
                          ? "text-accent-ink"
                          : "text-white"
                      }`}
                    >
                      {p.lockup ?? p.title}
                    </span>
                  </div>
                )}
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <p className="text-ink transition-colors duration-150 group-hover:text-ink-muted">
                    {p.title}
                  </p>
                  <span className="label-meta shrink-0">{p.year}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
