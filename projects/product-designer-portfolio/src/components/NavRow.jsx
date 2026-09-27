import { Link } from 'react-router-dom'
import { nav, profile } from '../data.js'

// §5 Nav, pill/outline variant: a bare icon mark on the left (no wordmark) and
// outlined pill links on the right. Per the first-screen spec this row scrolls
// with the page rather than sticking.
export function Mark({ className = 'size-6' }) {
  return (
    <span aria-hidden="true" className="inline-flex text-ink">
      <svg
        viewBox="0 0 32 32"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <path d="M16 3v26M4.6 9.5l22.8 13M4.6 22.5l22.8-13" />
        <circle cx="16" cy="16" r="3.2" />
      </svg>
    </span>
  )
}

export default function NavRow({ className = '' }) {
  return (
    <div className={`flex items-center justify-between gap-6 ${className}`}>
      {/* The mark links home; the accessible name carries the name that the
          wordmark would have shown. */}
      <Link to="/" aria-label={`${profile.name}, home`} className="hover:opacity-70">
        <Mark />
      </Link>

      <nav className="flex items-center gap-2 sm:gap-3">
        {nav.map(([label, href]) => (
          <Link key={href} to={href} className="nav-pill">
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
