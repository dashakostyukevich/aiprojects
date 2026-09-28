import { useEffect, useRef, useState } from 'react'

// §8 Motion: fade + slight drift on scroll-in, staggered by delay. Respects
// prefers-reduced-motion via the `.reveal` rules in index.css, which keep the
// element visible regardless of whether the observer ever runs.
export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  rotate = 0,
  restRotate = null,
  className = '',
  style,
  children,
  ...rest
}) {
  const ref = useRef(null)
  // If the browser cannot observe, show the content immediately rather than
  // leaving it stuck at opacity 0.
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    // Already on screen when this mounts: reveal it now rather than waiting for
    // a scroll that may never come.
    //
    // The observer below is tuned for content that *arrives* from below: it
    // wants 15% of the element inside a viewport already shrunk by 8%, so a
    // block does not start animating while it is still a sliver at the bottom
    // edge. That is the right rule for a section the reader is about to scroll
    // to, and the wrong rule for the first two project cards. They are partly
    // visible on arrival — deliberately, so the work is announced below the
    // hero — and they are large, so 15% of a 545px card is 82px of it past a
    // root that has already been cut back. The cards therefore sat at
    // `opacity: 0` while visibly occupying the bottom of the first screen, and
    // only appeared once the reader scrolled the ~114px that pushed them over
    // the threshold. On a page whose first screen ends in a partly visible card
    // that reads as a broken render, not as an animation.
    //
    // So the arrival case is handled here, by geometry, and the observer keeps
    // its stricter rule for everything further down. The check is against the
    // real viewport rather than the shrunk root: any part on screen counts,
    // because at this point the reader can already see it.
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Caller styles (e.g. an element's own transition) merge with the motion vars
  // rather than replacing them.
  const vars = {
    ...style,
    '--reveal-delay': `${delay}ms`,
    '--reveal-rotate': `${rotate}deg`,
    '--reveal-rest-rotate': `${restRotate ?? rotate}deg`,
  }

  return (
    <Tag
      ref={ref}
      style={vars}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
