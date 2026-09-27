import { Link } from 'react-router-dom'
import NavRow from '../components/NavRow.jsx'
import useDocumentTitle from '../hooks/useDocumentTitle.js'

export default function NotFound() {
  useDocumentTitle('Page not found')
  return (
    <main className="container-page py-8 sm:py-10">
      <NavRow className="mb-16 border-b border-hairline pb-6 sm:mb-24" />
      <p className="label-meta">404</p>
      <h1 className="mt-6 max-w-2xl font-display text-display leading-[1.05] tracking-[-0.03em] text-balance">
        This page doesn&rsquo;t exist
      </h1>
      <p className="mt-6 text-body text-ink-muted">
        The link may be old, or the project may have moved.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link to="/" className="btn-accent">
          Back home
        </Link>
        <Link to="/#work" className="btn-outline">
          See selected work
        </Link>
      </div>
    </main>
  )
}
