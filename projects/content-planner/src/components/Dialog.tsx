import type { ReactNode } from "react"

/*
  The shell every dialog in this app is built from: a dimmed page behind it, a
  panel that comes up from the bottom on a phone and centres on a desktop, a
  heading, and a close button.

  The post form and the much shorter idea form both use it, so the two stay
  looking like siblings without a second copy of the same styling to keep in
  step. A dialog owns nothing about its fields — it is only the frame.

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
  /** The post form is wide. The idea form is not — it has three fields. */
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
        className={`max-h-[92vh] w-full overflow-y-auto rounded-t-2xl
          border border-line bg-paper p-6 sm:rounded-2xl ${
            wide ? "max-w-lg" : "max-w-md"
          }`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 id="dialog-heading" className="font-display text-2xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-1 rounded-full px-2 py-1 text-lg
              leading-none text-ink-faint transition-colors hover:text-ink"
          >
            ×
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}
