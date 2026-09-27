import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// The nav's links are `/#section` hash links pointing at sections on the home
// page, so navigating in from a case study has to mount home first and then
// scroll. Without a hash, every route change starts at the top.
export default function useHashScroll() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
}
