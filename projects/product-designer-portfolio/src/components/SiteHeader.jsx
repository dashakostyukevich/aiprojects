import { Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { profile } from '../data.js'

const nav = [
  ['Work', '/#work'],
  // Hidden on the smallest screens, where four links plus the name overflow.
  // Services is a section on the same page, so nothing is lost.
  ['Services', '/#services', 'hidden sm:block'],
  ['About', '/#about'],
  ['Contact', '/#contact'],
]

// Hash links point at sections on the home page, so a click from a case study
// page has to navigate home first and then let the browser jump to the anchor.
function isHashLink(to) {
  return to.startsWith('/#')
}

export default function SiteHeader() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // Wait for the home page to mount before scrolling to a section on it.
      requestAnimationFrame(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return (
    // §5 Nav, flat utility variant: name left, uppercase links right.
    <header className="sticky top-0 z-30 border-b border-hairline bg-bg/85 backdrop-blur">
      <div className="container-page flex h-18 items-center justify-between gap-4 py-4">
        <Link to="/" className="font-serif text-xl leading-none sm:text-h2">
          {profile.name}
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          {nav.map(([label, href, hide]) =>
            isHashLink(href) ? (
              <Link
                key={href}
                to={href}
                className={`nav-link text-ink-muted hover:text-ink ${hide ?? ''}`}
              >
                {label}
              </Link>
            ) : (
              <NavLink key={href} to={href} className={`nav-link ${hide ?? ''}`}>
                {({ isActive }) => (
                  <span className={isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'}>
                    {label}
                  </span>
                )}
              </NavLink>
            ),
          )}
          <a
            href={`mailto:${profile.email}`}
            className="btn-outline hidden px-5 py-2.5 sm:inline-flex"
          >
            Get in touch
          </a>
        </nav>
      </div>
    </header>
  )
}
