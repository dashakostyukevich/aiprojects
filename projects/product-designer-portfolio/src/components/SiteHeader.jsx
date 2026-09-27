import { Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { profile } from '../data.js'

const nav = [
  ['Work', '/#work'],
  ['Services', '/#services'],
  ['About', '/#about'],
  ['Contact', '/#contact'],
]

// Hash links point at sections on the home page, so a click from a project page
// has to navigate home first and then let the browser jump to the anchor.
function isHashLink(to) {
  return to.startsWith('/#')
}

export default function SiteHeader() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-medium">
          {profile.name}
        </Link>
        <nav className="flex gap-5 text-sm text-neutral-600">
          {nav.map(([label, href]) =>
            isHashLink(href) ? (
              <Link key={href} to={href} className="hover:text-neutral-900">
                {label}
              </Link>
            ) : (
              <NavLink
                key={href}
                to={href}
                className={({ isActive }) =>
                  isActive ? 'text-neutral-900' : 'hover:text-neutral-900'
                }
              >
                {label}
              </NavLink>
            ),
          )}
        </nav>
      </div>
    </header>
  )
}
