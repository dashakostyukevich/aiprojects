import { profile } from '../data.js'
import SplitReveal from './SplitReveal.jsx'

export default function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-hairline bg-ink text-bg">
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

        {/* The closing action. It was a 15px outline "Back to work" pill, which
            put the page's smallest control directly under its largest line — the
            "Let's make something clear and calm." above. A `mailto:` button used
            to sit here too, as an equal-weight pair, and both were removed on the
            reasoning that a `mailto:` is a wall rather than an action and the
            contact route is one nav hop away.

            What was left was a heading arguing and a link whispering. The
            resolution is not to resurrect the email button but to give the one
            action that remains enough presence to be read as the close of the
            page: `btn-closer`, display scale, solid accent, with the arrow that
            says "go somewhere" rather than "this is a link".

            It still points at the work rather than the inbox. That is a
            deliberate choice, not an oversight — the strongest thing this
            portfolio can offer someone who has just read three case studies is
            more of them, and the address is one nav hop away in both directions.

            `profile.email` therefore still has no reader in this file. It stays
            in `data.js` because `RouteFallback.jsx` renders it, and because it
            is the one field a real deployment has to fill in. */}

        <div className="mt-12">
          <a href="#work" className="btn-closer group">
            See the work
            {/* `aria-hidden` because the link's accessible name is the label
                alone. Without it a screen reader announces "See the work right
                arrow", which is a direction, not a destination. The same reason
                the card outcome line inside the project grid is `aria-hidden`. */}
            <span aria-hidden="true" className="btn-closer-arrow">
              &rarr;
            </span>
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
