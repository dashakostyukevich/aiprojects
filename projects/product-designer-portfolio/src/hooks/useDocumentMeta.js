import { useEffect } from 'react'
import { getProject, profile } from '../data.js'

/**
 * Per-route document metadata for client-side navigation.
 *
 * The previous build set `document.title` from an effect and nothing else, so
 * the static head in index.html was all a non-JS crawler ever saw: every one of
 * the five indexable URLs shipped the same title and the same description.
 *
 * That is now fixed at build time by scripts/prerender.mjs, which writes real
 * per-route head tags into each emitted HTML file. This hook exists only
 * because the prerendered head is not re-read after first paint, so a
 * client-side route change would otherwise leave the tab title stale.
 */

const SITE = (import.meta.env.VITE_SITE_URL ?? '').replace(/\/$/, '')

export function metaForPath(pathname) {
  if (pathname === '/') {
    return {
      title: `${profile.name} — ${profile.role}`,
      description: profile.tagline,
    }
  }

  const match = pathname.match(/^\/work\/([^/]+)\/?$/)
  if (match) {
    const project = getProject(match[1])
    if (project) {
      return {
        title: `${project.title} — ${profile.name}`,
        // The summary is the right length for a description on its own; the
        // outcome is what makes it worth clicking.
        description: `${project.summary} ${project.outcome}.`,
      }
    }
  }

  return { title: 'Page not found', description: null }
}

function upsertMeta(selector, key, value) {
  if (!value) return
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(key.name, key.value)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

export default function useDocumentMeta(pathname) {
  const { title, description } = metaForPath(pathname)

  useEffect(() => {
    document.title = title
    upsertMeta('meta[name="description"]', { name: 'description' }, description)
    upsertMeta('meta[property="og:title"]', { property: 'og:title' }, title)
    upsertMeta('meta[property="og:description"]', { property: 'og:description' }, description)
    upsertMeta('meta[property="og:url"]', { property: 'og:url' }, `${SITE}${pathname}`)
  }, [title, description, pathname])
}
