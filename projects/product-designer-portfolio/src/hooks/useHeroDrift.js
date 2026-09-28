import { useEffect, useRef } from 'react'

// The hero objects move away from the pointer, each in its own way, and they
// respond to the pointer *anywhere on the page* rather than only when the cursor
// is over the hero.
//
// This started as a whole-page parallax — one shared vector, every object sliding
// along it in proportion to how far it sat from the centre. It read as a single
// flat layer tilting, because that is what it was: with one direction for all
// six, the eye sees the arrangement as one thing moving, not six things reacting.
// What replaced it is a local repulsion: each object measures its own distance to
// the cursor and pushes directly away from it, so the object nearest the pointer
// moves the most and the six differ because their `scale`, `gain` and `spin`
// differ — the values live in `data.js` next to the coordinates, hand-picked like
// everything else in that array.
//
// **The listener is on the window, and there is no dead zone.** Both halves of
// that were changed together, because either alone is wrong:
//
//   - It used to be `pointermove` on the hero element, so the objects were inert
//     whenever the cursor was over the rest of the page. A reader who moved the
//     mouse to read the About column and then moved it back found the hero had
//     not tracked them at all, which reads as a broken effect rather than a
//     distant one.
//   - It also used to stop dead past each object's `reach` — a hard cutoff, so an
//     object was either reacting or inert with nothing in between. Widening the
//     listener without removing the cutoff would have changed nothing for
//     anything but the two objects nearest the cursor, because everything else
//     was still parked at zero.
//
// So the falloff is now a Lorentzian, `1 / (1 + (d/scale)²)`, which decays
// smoothly and — crucially — is never zero. On top of that sits `FLOOR`, the
// share of full travel every object keeps no matter where the cursor is. That
// floor is what makes "responds everywhere" true rather than approximately true:
// without it the far objects would still settle to nothing at the far corners of
// a wide screen, and the effect would be a proximity trigger wearing a
// continuous curve.
//
// Three details keep it reading as recoil rather than as sliding:
//
//   - **Squared falloff near the object.** The Lorentzian already drops fast
//     close in, and `MAX` is small enough that a near object commits while a far
//     one only shifts.
//   - **A floor instead of a cutoff.** The far field is a quarter-strength
//     version of the same gesture, not a smaller version of a different one, so
//     nothing changes character as the cursor crosses the page — only amount.
//   - **A little rotation.** Each object turns slightly as it goes, on top of the
//     resting `tilt` it already had. Pure translation reads as a sticker sliding;
//     a couple of degrees of turn is what sells the idea that something is
//     recoiling. It is deliberately small and signed, so the direction of the turn
//     varies across the set.
//
// One honest weakness: with the cursor far from the hero, all six pushes point
// broadly the same way, so the arrangement drifts as a loose group. The per-object
// `scale` and `gain` keep the six from moving in lockstep, but the far-field read
// is closer to the old parallax than the near-field read is. That is the cost of
// responding across the whole page, and it is the right trade for an effect that
// is otherwise dead most of the time.
//
// The hook writes CSS custom properties and never `transform`. The entrance
// keyframes on `.hero-pop` own `transform` and rewrite it on every frame of the
// animation, and a `transform` set from here would be destroyed by them; the
// transform that reads these three properties lives on its own wrapper.
export default function useHeroDrift() {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    // Nothing to do for a reader who has asked for less motion, or for a finger.
    // A touch device fires no hover, and the objects are mid-hero on arrival, so
    // leaving them parked wherever a phantom pointer left them would be the worst
    // possible outcome. Both are checked up front rather than per event, because
    // neither can change while the listener is attached.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (reduce.matches || !fine.matches) return

    // Base travel at full strength, in px. `gain` scales it per object, so this
    // is the floor and the ceiling is 1.4x it.
    const MAX = 9
    // The share of full travel every object keeps at any distance. Without this
    // the falloff is merely smoother, not global: the far corners of a wide
    // screen would still park the objects at zero.
    //
    // 0.42 is set by what the far field has to look like, not by taste. At 0.26
    // the objects settled to 1.65–3.3px once the cursor was a screen away, which
    // is below the threshold where motion reads as motion — the effect was
    // technically global and practically invisible, which is the worst of both.
    // At 0.42 the resting far-field travel is 2.6–5.3px depending on the
    // object's `gain`: clearly a shift rather than a rounding error, and still
    // less than the near-field peak of 3–9px, so the arrival of the cursor on
    // the hero still reads as a change in kind and not just a bigger wobble.
    const FLOOR = 0.42

    const nodes = [...root.querySelectorAll('.hero-drift')]
    if (!nodes.length) return

    // Per-object config, read once. These are hand-picked numbers in `data.js`,
    // not derived values, so there is nothing to recompute.
    const config = nodes.map((el) => ({
      el,
      scale: Number(el.dataset.scale) || 0.2,
      gain: Number(el.dataset.gain) || 1,
      spin: Number(el.dataset.spin) || 0,
    }))

    // Normalised -0.5..0.5 from the centre of the section, so the arithmetic does
    // not care how big the section is. Both axes are divided by the *width*: a
    // circle has to stay a circle, and dividing the vertical by the height as
    // well would stretch every push into an ellipse that flattens as the window
    // gets shorter.
    //
    // These offsets are relative to the section, so they survive scrolling on
    // their own. The section's *position* is stored in page coordinates rather
    // than viewport coordinates, which is the part that has to be right: the
    // pointer arrives as `clientX/clientY`, and subtracting a viewport-relative
    // `box.left` captured at mount gives the wrong answer the moment the page
    // scrolls — the objects would react as though the hero were still where it
    // was on arrival. Adding the live `scrollX/scrollY` to the pointer before
    // comparing keeps both sides in one frame without re-measuring on scroll.
    const offsets = new Map()
    let boxLeft = null
    let boxWidth = 0

    const measure = () => {
      const rect = root.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      boxLeft = rect.left + window.scrollX
      boxWidth = rect.width
      for (const { el } of config) {
        const r = el.getBoundingClientRect()
        offsets.set(el, [
          (r.left + r.width / 2 - rect.left) / rect.width,
          (r.top + r.height / 2 - rect.top) / rect.width,
        ])
      }
    }

    let frame = 0
    let px = 0
    let py = 0
    // The pointer starts outside any plausible position, so the first paint
    // before any movement settles the objects rather than pushing them all
    // towards a cursor sitting at the origin.
    let seen = false

    const rest = (el) => {
      el.style.setProperty('--drift-x', '0px')
      el.style.setProperty('--drift-y', '0px')
      el.style.setProperty('--drift-spin', '0deg')
    }

    const paint = () => {
      frame = 0
      if (boxWidth === 0) measure()
      if (!boxWidth || !seen) return
      const mx = (px + window.scrollX - boxLeft) / boxWidth
      const my = (py + window.scrollY - boxLeft) / boxWidth

      for (const { el, scale, gain, spin } of config) {
        const [ox, oy] = offsets.get(el) ?? [0.5, 0.5]
        let dx = ox - mx
        let dy = oy - my
        let d = Math.hypot(dx, dy)

        // The pointer sitting exactly on an object has no direction to flee
        // along. Rather than produce a NaN, push it out from the centre of the
        // section, which is the same answer the object would give for any
        // pointer position just off it.
        if (d < 1e-4) {
          dx = ox - 0.5
          dy = oy - 0.5
          d = Math.hypot(dx, dy) || 1
        }

        const r = d / scale
        // Never zero, so every object responds at any cursor position.
        const near = 1 / (1 + r * r)
        const k = FLOOR + (1 - FLOOR) * near
        const push = k * MAX * gain
        el.style.setProperty('--drift-x', `${(dx / d) * push}px`)
        el.style.setProperty('--drift-y', `${(dy / d) * push}px`)
        el.style.setProperty('--drift-spin', `${spin * k}deg`)
      }
    }

    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(paint)
    }

    const onMove = (e) => {
      px = e.clientX
      py = e.clientY
      seen = true
      schedule()
    }

    const settle = () => {
      seen = false
      for (const { el } of config) rest(el)
    }

    // The observer exists to re-measure after the photography loads and on any
    // width change, and to do nothing else.
    const ro = new ResizeObserver(() => {
      measure()
      settle()
    })
    ro.observe(root)
    measure()

    // On the window, not on the hero. The cursor is somewhere on the page almost
    // all of the time, and an effect that only runs inside one section is inert
    // for the rest of the read. `pointerleave` on the document is the "the cursor
    // left the browser entirely" case — leaving the hero no longer means anything,
    // so there is nothing to settle on.
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', settle)
    window.addEventListener('blur', settle)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', settle)
      window.removeEventListener('blur', settle)
    }
  }, [])

  return ref
}
