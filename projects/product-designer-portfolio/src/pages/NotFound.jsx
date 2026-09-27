import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle.js'

export default function NotFound() {
  useDocumentTitle('Page not found')
  return (
    <main className="container-page py-24 sm:py-32">
      <p className="label-meta">404</p>
      <h1 className="mt-6 max-w-2xl font-serif text-display leading-[1.05] text-balance">
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
