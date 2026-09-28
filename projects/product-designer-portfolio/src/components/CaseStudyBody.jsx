import PhotoSlot from './PhotoSlot.jsx'

/**
 * Case study body renderer.
 *
 * `body` used to be an array of plain paragraph strings, and the other three
 * projects on this site still pass exactly that. So a bare string is still a
 * paragraph, and everything richer is a tagged object block:
 *
 *   'Plain paragraph.'                      -> <p>
 *   { p: 'Paragraph.' }                     -> <p>
 *   { list: ['one', 'two'] }                -> <ul>, accent ticks
 *   { table: { head, rows } }               -> <table>, row headers by default
 *   { sub: { number, heading, body } }      -> <h3> plus its own nested body
 *   { note: 'A stated principle.' }         -> accent-ruled callout
 *   { image: { src, alt, label, ratio } }   -> PhotoSlot, labelled when empty
 *
 * The nested `body` in a `sub` takes the same block grammar, which is the only
 * reason this is a recursive component rather than a flat switch.
 *
 * Order is the author's, so a table can sit directly under the paragraph that
 * introduces it, and an image slot can land between two arguments.
 */

// `margin-bottom` on the last block would push the section's own padding, so
// the trailing gap is trimmed here instead of at every call site.
function Block({ block }) {
  if (typeof block === 'string') {
    return <p className="mb-5 text-body leading-relaxed text-ink-muted">{block}</p>
  }

  if (block.p) {
    return <p className="mb-5 text-body leading-relaxed text-ink-muted">{block.p}</p>
  }

  if (block.list) {
    return (
      <ul className="mb-6 space-y-2.5">
        {block.list.map((item, i) => (
          <li key={i} className="flex gap-3 text-body leading-relaxed text-ink-muted">
            {/* The tick is decorative; the list semantics carry the meaning for
                assistive tech, so it is hidden rather than read out. */}
            <span aria-hidden="true" className="mt-[0.55em] h-[3px] w-[3px] shrink-0 bg-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }

  if (block.table) {
    const { head, rows, rowHeader = true } = block.table
    return (
      <div className="mb-6 overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left">
          {head && (
            <thead>
              <tr className="border-b border-ink">
                {head.map((cell, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="label-meta pb-2.5 pr-6 align-bottom last:pr-0"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-b border-hairline">
                {row.map((cell, ci) =>
                  rowHeader && ci === 0 ? (
                    <th
                      key={ci}
                      scope="row"
                      className="py-3 pr-6 align-top text-[0.9375rem] font-semibold text-ink"
                    >
                      {cell}
                    </th>
                  ) : (
                    <td
                      key={ci}
                      className="py-3 pr-6 align-top text-[0.9375rem] leading-relaxed text-ink-muted last:pr-0"
                    >
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (block.sub) {
    const { number, heading, body = [] } = block.sub
    return (
      <div className="mb-6">
        <h3 className="mb-3 flex items-baseline gap-3 font-display text-[1.25rem] leading-snug font-semibold tracking-[-0.01em]">
          {/* The number is a small accent chip rather than an `01` set in type:
              it labels the sub-section without competing with the real
              headings, and accent is never used as a text colour (§9). */}
          {number && (
            <span className="label-meta shrink-0 rounded-control bg-accent px-2 py-0.5 text-accent-ink">
              {number}
            </span>
          )}
          <span>{heading}</span>
        </h3>
        <Body blocks={body} className="[&>*:last-child]:mb-0" />
      </div>
    )
  }

  if (block.note) {
    return (
      <p className="mb-6 border-l-2 border-accent py-1 pl-5 text-body leading-relaxed font-medium text-ink">
        {block.note}
      </p>
    )
  }

  if (block.image) {
    const { src = null, alt = '', label, ratio = 'aspect-16/9', caption } = block.image
    return (
      <figure className="mb-8">
        <PhotoSlot src={src} alt={alt} label={label} ratio={ratio} />
        {caption && <figcaption className="label-meta mt-3 normal-case">{caption}</figcaption>}
      </figure>
    )
  }

  return null
}

export default function Body({ blocks, className = '' }) {
  if (!blocks) return null
  return (
    <div className={className}>
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  )
}
