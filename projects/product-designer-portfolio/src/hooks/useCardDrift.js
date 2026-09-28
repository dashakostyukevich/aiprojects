import { useEffect, useRef } from 'react'

/**
 * Magnetic pull for a project card.
 *
 * The card leans toward the cursor while it is under the pointer and settles
 * back when the pointer leaves. `max` is the travel in px at the card's edge, so
 * the middle of the card is inert and the pull grows toward the corners — a card
 * that moved under a cursor sitting dead centre would have no direction to move
 * in, and picking one arbitrarily would make the card twitch as the pointer
 * crossed it.
 *
 * Three deliberate constraints:
 *
 *   - **The listener is on the card, not the window.** A window listener would
 *     run `getBoundingClientRect` for every card on every mouse move, for an
 *     effect that can only apply to the one card being hovered. Attaching it to
 *     the element means the rect is read at most once per move, and only while
 *     the pointer is genuinely on the card.
 *
 *   - **Both axes divide by width, not by height.** The card is not square on
 *     every project — the grid runs 16/10, 4/3 and square crops — and dividing
 *     each axis by its own extent would make the vertical pull weaker than the
 *     horizontal one on a wide card. Dividing both by width keeps the gesture
 *     circular, so the card leans toward the cursor rather than crawling along
 *     it.
 *
 *   - **Scroll repaints from the last known pointer position.** A rect captured
 *     at pointer-enter goes stale the moment the page scrolls under a stationary
 *     cursor, and nothing fires `pointermove` to correct it, so the card would
 *     hold an offset computed for where it used to be. Scroll and resize both
 *     repaint from the cached coordinates instead.
 *
 * Writes two custom properties and never `transform`, for the reason
 * `useHeroDrift` does: the CSS transition reads them, and nothing else on the
 * card owns `transform`.
 */
export default function useCardDrift({ max = 8 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // A reader who has asked for less motion gets a card that does not lean, and
    // a finger has no hover to lean toward. Both are checked once: neither can
    // change while these listeners are attached.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (reduce.matches || !fine.matches) return

    let frame = 0
    let px = null
    let py = null

    const paint = () => {
      frame = 0
      if (px === null || py === null) return
      const r = el.getBoundingClientRect()
      if (!r.width || !r.height) return
      const nx = (px - (r.left + r.width / 2)) / (r.width / 2)
      const ny = (py - (r.top + r.height / 2)) / (r.width / 2)
      el.style.setProperty('--card-x', `${(Math.max(-1, Math.min(1, nx)) * max).toFixed(2)}px`)
      el.style.setProperty('--card-y', `${(Math.max(-1, Math.min(1, ny)) * max).toFixed(2)}px`)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint)
    }

    const onMove = (e) => {
      px = e.clientX
      py = e.clientY
      schedule()
    }

    const release = () => {
      // The CSS transition carries the card home, so the custom properties only
      // have to be zeroed — nothing animates them here.
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      px = null
      py = null
      el.style.setProperty('--card-x', '0px')
      el.style.setProperty('--card-y', '0px')
    }

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', release)
    el.addEventListener('pointercancel', release)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', release)
      el.removeEventListener('pointercancel', release)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [max])

  return ref
}
