import type { ReactNode } from "react"

/*
  The shell every dialog in this app is built from: a dimmed page behind it, a
  panel that comes up from the bottom on a phone and centres on a desktop, a
  heading, and a close button.

  The idea form and the pillar form both use it, so the two stay looking like
  siblings without a second copy of the same styling to keep in step. A dialog
  owns nothing about its fields — it is only the frame.

  It is the one place in the app that floats above the page, so it takes the
  design system's third elevation: a wide, soft shadow and no hard edge.

  Clicking the dimmed background cancels. Clicking inside the panel does not,
  which is what the stopPropagation on the panel is for: without it, reaching
  for a field near the edge would close the dialog.
*/
export default function Dialog({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  /** Set when a form has more than three fields. */
  wide?: boolean
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30
        p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-heading"
        onClick={(event) => event.stopPropagation()}
        className={`max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border
          border-line bg-card p-6 shadow-pop sm:rounded-2xl ${
            wide ? "max-w-lg" : "max-w-md"
          }`}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 id="dialog-heading" className="text-xl text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 grid h-9 w-9 place-items-center rounded-xl text-lg
              leading-none text-ink-faint transition-colors hover:bg-subtle
              hover:text-ink"
          >
            ×
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}
