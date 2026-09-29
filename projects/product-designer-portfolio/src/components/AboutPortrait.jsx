/**
 * The About portrait, with an optional second frame revealed on hover.
 *
 * This is a separate component from `PhotoSlot` rather than a pair of extra props
 * on it, because the two have different jobs. `PhotoSlot` is the "this image does
 * not exist yet" marker and is used in five places across the site; this one is
 * about a specific photograph that happens to have a hover state. Growing
 * `PhotoSlot` for it would have meant a `hoverSrc` prop that four of its five
 * callers would never pass.
 *
 * How the swap works, and why:
 *
 *   - **Two stacked images, not one `src` swap.** Swapping `src` on hover blanks
 *     the frame while the new file decodes, which on a slow connection shows the
 *     sand fill flashing through. Both images are in the DOM from the start, so
 *     the reveal is a pure opacity change and never a load.
 *   - **The second image is decorative.** A screen reader has no hover, so an
 *     `alt` on it would read the same caption twice. It is `aria-hidden` and its
 *     alt is whatever the caller passed, unused.
 *   - **Hover only where hover exists.** A finger produces a sticky `:hover` that
 *     sticks after the tap, so on a coarse pointer the second frame would latch on
 *     and stay. The reveal is wrapped in `@media (hover: hover)` and the resting
 *     image is simply the photograph.
 *   - **`focus-within` alongside `hover`,** so a keyboard user who cannot hover
 *     still reaches the second frame. The portrait is not a link and takes no
 *     focus of its own, so this only fires if the figure ever grows a control.
 *   - **The fade is 420ms and it survives reduced motion.** A cross-fade between
 *     two photographs is a change of picture, not decoration; the reduced-motion
 *     rule drops the duration to 0 so the swap is instant rather than removing
 *     the swap itself.
 *
 * The frame is a `div` with a fixed aspect ratio so nothing moves when the images
 * arrive, and `rounded-[14px]` to match the one radius in `index.css`.
 *
 * The photographs are in colour. They were black and white for as long as this was
 * a placeholder, on the design.md §6 rule that the one picture of the person
 * should be the one picture not in colour. That rule assumed a small, quiet
 * photograph holding a column together; a real portrait at 416px is a colour
 * photograph whether it wants to be or not, and the desaturation was doing nothing
 * but draining it. Both frames carry no filter now, which is also what keeps the
 * hover swap honest — a cross-fade between two colour photographs reads as the
 * same moment a second later, where a filtered one read as the picture warming up.
 * Add `grayscale` to both `className`s below to go back.
 */
export default function AboutPortrait({
  src,
  hoverSrc = null,
  alt = '',
  hoverAlt = '',
  ratio = 'aspect-[4/5]',
  className = '',
}) {
  const frame = `absolute inset-0 size-full object-cover transition-opacity duration-[420ms] ease-out motion-reduce:transition-none`

  return (
    // A `div`, not a `figure`. The caller already wraps this in the <figure> that
    // carries the Spark overhang, and a figure inside a figure is a nested
    // landmark for no reason — the photograph has no caption of its own.
    <div data-portrait className={`relative overflow-hidden rounded-[14px] bg-sand ${ratio} ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={frame}
        data-portrait-rest
      />
      {hoverSrc && (
        <img
          src={hoverSrc}
          alt={hoverAlt}
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className={`${frame} opacity-0`}
          data-portrait-hover
        />
      )}
    </div>
  )
}
