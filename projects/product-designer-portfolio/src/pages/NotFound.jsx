import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle.js'

export default function NotFound() {
  useDocumentTitle('Page not found')
  return (
    <main className="mx-auto w-full max-w-5xl px-6">
      <div className="py-32">
        <p className="text-sm text-neutral-400">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          This page doesn’t exist
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          The link may be old, or the project may have moved.
        </p>
        <div className="mt-10 flex gap-5 text-sm">
          <Link to="/" className="rounded-full bg-neutral-900 px-6 py-3 font-medium text-white hover:bg-neutral-700">
            Back home
          </Link>
          <Link to="/#work" className="px-6 py-3 text-neutral-600 hover:text-neutral-900">
            See selected work
          </Link>
        </div>
      </div>
    </main>
  )
}
