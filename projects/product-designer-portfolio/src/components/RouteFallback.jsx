/**
 * Route-level error boundary.
 *
 * The previous build had none: a throw anywhere in a page unmounted the whole
 * app to a blank white screen, because there is no error boundary between a
 * React render and `document.body`. On a portfolio that is the worst possible
 * failure, since the case studies are the only reason most visitors arrive.
 *
 * This catches render errors below it and shows a recoverable state. It cannot
 * catch async errors or errors thrown in event handlers; those would need a
 * window-level handler, which is deliberately out of scope here.
 */
import { Component } from 'react'
import { Link } from 'react-router-dom'
import { profile } from '../data.js'

export default class RouteFallback extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Replace with your reporter (Sentry, OpenCode, whatever you run) if you
    // add one. Console keeps the stack visible in development.
    console.error('Route render failed:', error, info?.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <main className="container-page py-20 sm:py-28">
        {/* `ink-muted` rather than terracotta: 3.19:1 on the page background
            fails AA at 12px. See the note in NotFound.jsx. */}
        <p className="label-meta">Something broke</p>
        <h1 className="mt-6 max-w-3xl font-display text-display leading-[1.05] tracking-[-0.03em] text-balance">
          This page failed to load.
        </h1>
        <p className="mt-6 max-w-[52ch] text-body text-ink-muted">
          It is a fault on my side, not yours. The work index is still reachable,
          or you can email {profile.email} and I will sort it out.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link to="/#work" className="btn-accent">
            See the work
          </Link>
          <a href={`mailto:${profile.email}`} className="btn-outline">
            Email me
          </a>
        </div>
      </main>
    )
  }
}
