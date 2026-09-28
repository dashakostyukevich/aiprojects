import { profile } from '../data.js'
import SplitReveal from './SplitReveal.jsx'

export default function SiteFooter() {
  return (
    <footer id="contact" className="scroll-mt-8 border-t border-hairline bg-ink text-bg">
      <div className="container-page py-20 sm:py-28">
        {/* The "Contact" eyebrow is gone. With the hero and About, the page now
            carries three uppercase micro-labels, which is the ceiling for a
            seven-section page. The h2 below states the intent on its own. */}
        <SplitReveal
          as="h2"
          className="max-w-3xl font-display text-display leading-[1.05] tracking-[-0.03em] text-balance"
        >
          Let&rsquo;s make something{' '}
          {/* The accent highlight carries the emphasis; Space Grotesk has no
              italic cut, so an `italic` here would be a synthesised oblique.
              `data-split` masks each word separately while keeping the
              highlight background on both. */}
          <span data-split className="highlight font-display text-accent-ink">
            clear and calm
          </span>
          .
        </SplitReveal>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${profile.email}`}
            className="btn-accent focus-visible:ring-offset-ink"
          >
            {profile.email}
          </a>
          <a
            href="#work"
            className="btn-outline border-bg/40 text-bg hover:bg-bg hover:text-ink focus-visible:ring-offset-ink"
          >
            Back to work
          </a>
        </div>

        <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-bg/15 pt-8">
          {profile.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="nav-link text-bg/70 transition hover:text-bg"
            >
              {l.label}
            </a>
          ))}
        </div>

        <p className="mt-10 text-sm text-bg/50">
          &copy; {new Date().getFullYear()} {profile.name} / {profile.role}
        </p>
      </div>
    </footer>
  )
}
