import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import NavRow from '../components/NavRow.jsx'
import useDocumentMeta from '../hooks/useDocumentMeta.js'

export default function NotFound() {
  const { pathname } = useLocation()
  useDocumentMeta(pathname)

  return (
    <main className="container-page py-8 sm:py-10">
      <NavRow className="mb-16 border-b border-hairline pb-6 sm:mb-24" />
      {/* "404" stays. It is the one place on the site where the status is
          useful to a human, and it is the subject of the page rather than an
          eyebrow above a section headline. */}
      {/* Muted ink, not terracotta. Terracotta on the page background measures
          3.19:1, which is under AA for 12px text; `ink-muted` is 5.19:1. The
          terracotta accents in this project are artwork fills, not text
          colours, which is what design.md §2 asks for. */}
      <p className="label-meta">404</p>
      <h1 className="mt-6 max-w-2xl font-display text-display leading-[1.05] tracking-[-0.03em] text-balance">
        This page doesn&rsquo;t exist
      </h1>
      <p className="mt-6 max-w-[46ch] text-body text-ink-muted">
        The link may be old, or the project may have moved.
      </p>
      {/* One work path and one home path. The previous pair read "Back home"
          and "See selected work" while the nav and the footer already offered
          "Projects" and an email button, which is four labels for two intents. */}
      <div className="mt-10 flex flex-wrap gap-4">
        <Link to="/#work" className="btn-accent">
          See the work
        </Link>
        <Link to="/" className="btn-outline">
          Back home
        </Link>
      </div>
    </main>
  )
}
