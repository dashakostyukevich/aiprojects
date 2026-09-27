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

  // Caller styles (e.g. absolute collage positions) merge with the motion vars
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
