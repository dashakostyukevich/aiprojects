import { useEffect } from 'react'
import { profile } from '../data.js'

// Sets document.title per route. Keeps the static title in index.html as the
// default for the first paint and for crawlers that do not run JS.
export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${profile.name}` : `${profile.name} — ${profile.role}`
  }, [title])
}
