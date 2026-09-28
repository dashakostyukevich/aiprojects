/**
 * Labelled image slot.
 *
 * Every image on this site is still a placeholder, so this component makes the
 * gap explicit rather than faking it. It reserves the exact box the real image
 * will occupy (so there is no layout shift when one is dropped in), renders a
 * quiet diagonal hatch in the token neutral, and states in text what belongs
 * there and at what size.
 *
 * It is deliberately not `aria-hidden`. The label is the only description of
 * this content that exists right now, and hiding it would leave a screen reader
 * with a silent rectangle.
 *
 * To use a real image, pass `src`. The slot then becomes a plain <img> with the
 * same reserved box, and the label disappears.
 */
export default function PhotoSlot({
  src,
  alt = '',
  label,
  ratio = 'aspect-[4/3]',
  className = '',
  sizes,
  compact = false,
}) {
  const frame = `relative w-full overflow-hidden rounded-[14px] bg-sand ${ratio} ${className}`

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        sizes={sizes}
        className={`${frame} object-cover`}
      />
    )
  }

  return (
    <figure className={frame}>
      {/* Hatch marks the slot as unfinished without competing for attention. */}
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, rgb(10 10 10 / 0.05) 0 1px, transparent 1px 9px)',
        }}
      />
      <figcaption className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-4 text-center">
        <span className="label-meta text-ink-muted">Image needed</span>
        {/* `compact` is for slots that sit inside a card which already carries a
            title and caption directly beneath. Repeating the subject there
            would print the same sentence twice. */}
        {!compact && (
          <span className="text-[0.8125rem] leading-snug text-ink-muted">{label}</span>
        )}
      </figcaption>
    </figure>
  )
}
