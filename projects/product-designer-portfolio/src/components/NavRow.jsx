import { Link } from 'react-router-dom'
import { nav, profile } from '../data.js'
import Spark from './Spark.jsx'
import useActiveSection from '../hooks/useActiveSection.js'

// §5 Nav, flat utility variant: a bare icon mark on the left (no wordmark) and
// plain text links on the right. The row is rendered once, by App, inside the
// fixed `nav-bar` header — see the note there for why it is not per-page.
//
// The links lost their pill outline. Three bordered pills next to a bare
// asterisk read as a row of buttons rather than as a way into the page, and
// there is no second nav state to justify the border. Instead the link you are
// inside gets the site's bracket mark — the same `[ … ]` the About heading
// wears — so position in the page is carried by the same punctuation as the
// section it points at.
//
// The mark is the site's asterisk, the same polygon that appears inline in the
// hero headline, beside the About portrait and at the end of the services list.
// It was previously a separate three-stroke drawing with a centre dot, which
// meant the page carried two different asterisks. Stroke 6 on the 100-unit grid
// is 1.4px at this size, matching the 1.5–2px the rest of the site draws with.
export function Mark({ className = 'size-6' }) {
  return (
    <span aria-hidden="true" className="inline-flex text-ink">
      <Spark className={className} fill="fill-none" strokeWidth={6} />
    </span>
  )
}

// Ids the nav points at, in page order. Derived from `nav` so adding a link
// there is enough to make it highlight.
const navTargets = nav.map(([, href]) => href.slice(href.indexOf('#') + 1))

export default function NavRow({ className = '' }) {
  // The active link follows the scroll, not the hash: the reader reaches About
  // by scrolling as often as by clicking, and the hash does not change either
  // way once they are there. On a case study page none of the home page's ids
  // exist, so nothing is active — which is the honest answer, since none of
  // these links point at anything on this page.
  const active = useActiveSection(navTargets)

  return (
    <div className={`flex items-center justify-between gap-6 ${className}`}>
      {/* The mark links home; the accessible name carries the name that the
          wordmark would have shown. */}
      <Link to="/" aria-label={`${profile.name}, home`} className="hover:opacity-70">
        <Mark />
      </Link>

      {/* `gap` carries the spacing now that the pills are gone, and the bracket
          is a separate element so the active state can fade it without
          re-typesetting the label. The brackets are always in the DOM at the
          same size and only their opacity changes, so marking a link active
          does not shift the row sideways — the alternative, mounting them on
          demand, moves every link after it. */}
      <nav className="flex items-center gap-4 sm:gap-6">
        {nav.map(([label, href]) => {
          const isActive = active === href.slice(href.indexOf('#') + 1)
          return (
            <Link
              key={href}
              to={href}
              aria-current={isActive ? 'true' : undefined}
              data-active={isActive || undefined}
              className="nav-item"
            >
              <span className="nav-bracket" aria-hidden="true">
                [
              </span>
              {label}
              <span className="nav-bracket" aria-hidden="true">
                ]
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
