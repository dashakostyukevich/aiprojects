import { Children, useEffect, useRef } from 'react'

// Scroll-driven word-by-word reveal for display type.
//
// Text is split into words, each wrapped in a clipping mask that slides the word
// up from below its own line box. How much of the headline is revealed is a
// single scrubbed progress value (0 → 1) mapped across the words, so scrolling
// moves the reveal rather than just triggering it. The mapping is pure CSS
// driven by per-word inline styles written in one rAF loop, so there is no
// React re-render per frame.
//
// Three cases:
//   - Below the fold on mount: progress is driven by scroll, so the text
//     reveals as the reader reaches it.
//   - Already in view on mount (the hero): progress ramps 0 → 1 over ~1s so it
//     plays as an intro, then latches.
//   - `prefers-reduced-motion`: everything is revealed immediately and no
//     listener is attached at all.
//
// Progress never runs backwards. Once a word is revealed it stays revealed, so
// scrolling back up never re-hides text the reader has already read.

// How long the intro ramp takes when a block is already in view on mount. Long
// enough for the last words to land, short enough not to hold up the page.
const INTRO_MS = 1100

// Split children into renderable units. Plain strings break on whitespace.
// Elements stay atomic so their internals are never touched, with one
// exception: an element carrying `data-split` is a styled *run of text* (the
// `em` phrases in the hero headline, say) whose words each need their own mask
// but must keep the run's classes. Those are split, and the wrapper's className
// is copied onto every word it produces.
function toUnits(children) {
  const units = []

  const pushText = (text, prefix, inherited = null) => {
    // A `data-split` wrapper can be handed undefined children (a data-driven
    // part with no text, say). Skip it rather than throwing on `.toString()`.
    if (text === null || text === undefined || text === false) return

    text
      .toString()
      .split(/(\s+)/)
      .forEach((token, ti) => {
        if (!token) return
        const key = `${prefix}-${ti}`
        // The space between two words of the same run has to carry `inherited`
        // too, or the run fragments and each word gets its own background box
        // instead of one continuous highlight.
        if (/^\s+$/.test(token)) units.push({ key, space: token, inherited })
        else units.push({ key, word: token, inherited })
      })
  }

  Children.toArray(children).forEach((child, ci) => {
    if (child === null || child === undefined || child === false) return

    if (typeof child === 'string' || typeof child === 'number') {
      pushText(child, `${ci}`)
      return
    }

    // A styled text run: split it, carrying its classes onto each word. If it
    // has no text to split, fall through and render it whole.
    if (child.props?.['data-split'] && child.props.children) {
      // `data-split` is consumed here and not forwarded: on the rendered
      // wrapper it would be a meaningless DOM attribute. `children` is pulled
      // out for the same reason, and also read to recover any trailing
      // whitespace (see the run wrapper in the render).
      const { className, children: text, ...restProps } = child.props
      delete restProps['data-split']
      pushText(text, `s${ci}`, { className, props: restProps, text })
      return
    }

    units.push({ key: child.key ?? `n-${ci}`, node: child })
  })

  return units
}

export default function SplitReveal({
  as: Tag = 'div',
  className = '',
  style,
  children,
  ...rest
}) {
  const containerRef = useRef(null)

  // Progress as a ref, not state: the rAF loop writes it and the loop itself
  // applies the styles, so scrolling never triggers a render.
  const progress = useRef(0)
  const latched = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Read the word nodes from the DOM rather than from a ref array filled by
    // callback refs. Callback refs are populated during commit, but under
    // StrictMode's double mount the array can hold nodes from the discarded
    // first render, so writes would land on detached elements and the visible
    // text would stay hidden.
    const words = Array.from(el.querySelectorAll('.split-word'))
    if (words.length === 0) return

    const reduced =
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

    // Each word gets its own slice of the progress range. `spread` overlaps the
    // slices so several words are mid-flight at once, which is what makes it
    // read as a wave rather than a typewriter.
    const spread = Math.min(6, words.length)

    const paint = () => {
      const p = progress.current

      words.forEach((word, i) => {
        // Word i starts moving once p passes its slot and finishes a `spread`
        // later. Clamped, so the last words complete before p reaches 1.
        const t = Math.min(1, Math.max(0, (p * (words.length + spread) - i) / spread))

        // No "already done" skip here. It looks like an optimisation, but the
        // mark lives on the DOM node, which survives a StrictMode remount: a
        // discarded mount could leave words marked as finished, and the
        // surviving mount would then skip them and freeze them part-revealed.
        // Writing the same values again is cheap, and a scroll frame is not a
        // hot path.
        //
        // `.split-word` is the word itself: it fades, blurs, and slides. Its
        // parent is the mask, which only clips.
        word.style.opacity = t.toFixed(3)
        word.style.transform = `translate3d(0, ${((1 - t) * 105).toFixed(2)}%, 0)`
        word.style.filter = t === 1 ? 'none' : `blur(${((1 - t) * 5).toFixed(1)}px)`
      })
    }

    if (reduced) {
      progress.current = 1
      paint()
      return
    }

    // Where the element is between "just about to enter" and "comfortably in
    // view". Both are fractions of the viewport height, so the same numbers
    // work on a phone and a desktop.
    const START = 0.92
    const END = 0.34

    const measure = () => {
      if (latched.current) return 1
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const from = vh * START
      const to = vh * END
      const p = Math.min(1, Math.max(0, (from - rect.top) / (from - to)))

      // Near the bottom of the document there is no more scroll left, so a
      // heading near the end (the footer, say) can never reach its band and
      // would stay hidden forever. If the page cannot scroll any further, treat
      // whatever is on screen as revealed.
      const atBottom = window.scrollY + vh >= document.documentElement.scrollHeight - 2
      if (atBottom && rect.top < vh) return 1

      return p
    }

    let frame = 0
    let introFrame = 0
    let introStart = 0

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        if (latched.current) return
        const p = measure()

        // `measure()` reads the element's *top* edge, so a fast scroll (a
        // keyboard jump, a hash link, a flung trackpad) can sail past the band
        // and land straight on p === 1. That is handled here: the heading is
        // simply already revealed. What must never happen is a heading ending
        // the scroll still partly hidden, which the latch below prevents.
        progress.current = p
        paint()

        if (p >= 1) latched.current = true
      })
    }

    // Intro ramp. If the block is already in view when it mounts, replay the
    // same 0 → 1 mapping as a timed animation so the hero announces itself.
    //
    // The frame id is tracked so cleanup can cancel it. Without that, StrictMode's
    // double mount leaves the first mount's rAF chain running alongside the
    // second's; both write `progress`, and the older chain's stale timestamp
    // makes it latch early and freeze the reveal part-way.
    const startIntro = () => {
      if (latched.current || introFrame) return
      progress.current = 0
      paint()
      introStart = performance.now()
      const step = (now) => {
        const t = Math.min(1, (now - introStart) / INTRO_MS)
        // Ease-out, so the last words do not crawl.
        progress.current = 1 - Math.pow(1 - t, 3)
        paint()
        if (t < 1) {
          introFrame = requestAnimationFrame(step)
        } else {
          introFrame = 0
          latched.current = true
        }
      }
      introFrame = requestAnimationFrame(step)
    }

    const onResize = () => {
      if (latched.current) {
        paint()
        return
      }
      progress.current = measure()
      paint()
    }

    progress.current = 0
    paint()

    // Paint the current position synchronously rather than deferring to the
    // rAF-guarded scroll path. A below-the-fold heading must settle on its real
    // value immediately; the listener only handles later movement.
    progress.current = measure()
    paint()

    // Anything already at least partly on screen plays its intro, ramping from
    // 0 so the reader sees the whole reveal rather than finding the text frozen
    // at whatever fraction the mount position happened to land on. Testing for
    // `>= 1` here would be wrong: the hero is usually not fully clear of the
    // viewport bottom when it mounts, so it would take the scroll path and sit
    // stuck at ~0.87 with no scroll left to trigger it.
    if (progress.current > 0) {
      progress.current = 0
      startIntro()
    } else {
      onScroll()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      if (introFrame) cancelAnimationFrame(introFrame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const units = toUnits(children)

  const mask = (unit) => (
    <span
      key={unit.key}
      // The mask. `overflow-hidden` clips the word as it travels.
      //
      // No padding here on purpose: vertical padding would put a transparent
      // gap between adjacent masks, which breaks a continuous background
      // highlight into separate blocks. The travel room the word needs comes
      // from the word's own padding instead, cancelled by a matching negative
      // margin so the line box is unchanged.
      className="inline-block overflow-hidden align-baseline"
    >
      {/* No inline `style` here on purpose. React owns the style attribute, so
          a re-render would overwrite the transform and opacity that the rAF
          loop writes, snapping words back to hidden. The hidden start state
          comes from CSS instead, and only the loop writes inline styles. */}
      <span className="split-word py-[0.16em] -my-[0.16em]">
        {unit.word ?? unit.node}
      </span>
    </span>
  )

  // Index of the first unit after the run starting at `i`, or `i + 1`.
  const runEnd = (i) => {
    let end = i + 1
    while (end < units.length && units[end].inherited === units[i].inherited) end += 1
    return end
  }

  const out = []
  for (let i = 0; i < units.length; i += 1) {
    const unit = units[i]

    if (unit.inherited) {
      // A styled run of words. The run's classes go on a wrapper *around* all
      // of its masks rather than on each word, so a background highlight stays
      // one continuous block instead of a separate box per word. Spaces inside
      // the run stay inside the wrapper so the background runs unbroken.
      const run = units.slice(i, runEnd(i))
      const { className: runClass, props: runProps } = unit.inherited

      out.push(
        // `inline-block` is required, not cosmetic: as a plain inline box the
        // wrapper's background is painted per line-box fragment, so the gaps
        // between its inline-block children would show through as dark slivers
        // and the highlight would read as separate blocks. Making the wrapper
        // itself inline-block gives it one continuous background across them.
        //
        // The cost of inline-block is that a trailing space inside the wrapper
        // collapses, which would run the run's last word into whatever follows
        // ("interfacesfor"). The source text's own trailing whitespace is
        // therefore re-emitted after the wrapper.
        <span key={unit.key} className={`inline-block ${runClass ?? ''}`} {...runProps}>
          {run.map((u) => (u.space ? u.space : mask(u)))}
        </span>,
        /[ \t\n]$/.test(String(unit.inherited.text ?? '')) ? ' ' : null,
      )
      i = runEnd(i) - 1
      continue
    }

    // Whitespace outside a run is plain text, never inside a mask. That keeps
    // text selection and copy-paste intact: the clipboard gets
    // "I design calm, useful interfaces", not "Idesigncalm,useful".
    if (unit.space) {
      out.push(<span key={unit.key}>{unit.space}</span>)
      continue
    }

    out.push(mask(unit))
  }

  return (
    <Tag ref={containerRef} className={className} style={style} {...rest}>
      {out}
    </Tag>
  )
}
