import { useEffect, useState } from 'react'

// Which of a set of page sections the reader is currently inside, for the nav's
// active state. The nav's links are `/#section` hash links, so the targets are
// ids on the page rather than routes.
//
// This is a scroll measure rather than an IntersectionObserver because the
// question is not "which section is intersecting" but "which section has the
// reader passed the top of". `work` is a short grid and `contact` is a tall dark
// footer, so a threshold at 35% down the viewport marks the right one whichever
// of the two it lands in.
//
// The list arrives as a joined string so a caller passing a fresh array literal
// on every render does not tear the listener down and rebuild it each time.
export default function useActiveSection(ids) {
  const key = ids.join(',')
  const [active, setActive] = useState(null)

  useEffect(() => {
    const sections = key.split(',').filter(Boolean)
    // Checked once per effect run rather than per scroll: the targets are set
    // by the route, so this cannot change while the listener is attached.
    const onPage = sections.length > 0 && sections.every((id) => document.getElementById(id))
    let frame = 0

    const measure = () => {
      frame = 0
      // The line a section has to cross to become the active one.
      const line = window.scrollY + window.innerHeight * 0.35
      // Before anything is crossed the first target is still the answer: the
      // hero lives above `#work` and the "Projects" link is what the top of the
      // page is about, so an unmarked nav at scroll 0 would be a dead row.
      let current = null
      let first = null

      // No early exit. The sections are in document order, so the one the reader
      // has just passed is the last crossed, not the first — stopping at `work`
      // would leave it marked for the whole page below the hero.
      for (const id of sections) {
        const el = document.getElementById(id)
        if (!el) continue
        if (first === null) first = id
        if (el.getBoundingClientRect().top + window.scrollY <= line) current = id
      }
      if (current === null) current = first

      // At the very bottom of the document the last section can still sit below
      // the line — the footer especially, since nothing follows it to push it
      // up. Being at the end of the page means being in it. The tolerance is a
      // few pixels rather than 2 because sub-pixel scroll positions and a
      // fractional viewport height can leave the sum just short of the total.
      const atEnd =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4
      if (atEnd) {
        for (let i = sections.length - 1; i >= 0; i -= 1) {
          if (document.getElementById(sections[i])) {
            current = sections[i]
            break
          }
        }
      }

      // The footer is rendered on every route, so `#contact` exists on a case
      // study too — where the other targets are missing and the bottom-of-page
      // rule would light up a link that points at nothing on this page. Only
      // pages that actually carry the whole set get an active state.
      setActive(onPage ? current : null)
    }

    const schedule = () => {
      // Nothing to mark on this page, so no frame is worth scheduling.
      if (frame || !onPage) return
      frame = requestAnimationFrame(measure)
    }

    // No `else setActive(null)`: the hook is mounted per route, so a page without
    // the targets starts at null already and stays there.
    if (onPage) measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // `scroll-behavior: smooth` is set on `html`, so a jump-scroll animates and
    // the last `scroll` event can land a frame or two short of the destination.
    // `scrollend` fires once the position is final, which is when the
    // bottom-of-page case is worth re-measuring.
    window.addEventListener('scrollend', measure)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('scrollend', measure)
    }
  }, [key])

  return active
}
