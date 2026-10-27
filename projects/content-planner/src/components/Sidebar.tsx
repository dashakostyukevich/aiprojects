import type { View } from "../types"

/*
  The navigation column. On desktop it sits on the left as a fixed sidebar.
  On small screens the whole thing collapses into a bar above the content.

  These were `<a href="#">` links that went nowhere. They are buttons now,
  because they don't open a URL — they tell App which view to render. Sidebar
  doesn't decide that itself; it just reports the click, the same way every
  other button here does.
*/
const links: { label: string; view: View }[] = [
  { label: "Plan", view: "plan" },
  { label: "Calendar", view: "calendar" },
  { label: "Ideas", view: "ideas" },
  { label: "Pillars", view: "pillars" },
]

export default function Sidebar({
  view,
  onNavigate,
}: {
  view: View
  onNavigate: (view: View) => void
}) {
  return (
    <aside
      className="flex w-full shrink-0 flex-col border-b border-line
        bg-card md:w-56 md:border-b-0 md:border-r"
    >
      <div className="flex items-center gap-2.5 px-5 py-4 md:px-5 md:py-6">
        <span
          className="grid h-7 w-7 place-items-center rounded-lg bg-ink
            font-display text-sm font-semibold text-paper"
        >
          C
        </span>
        <span className="font-display text-base tracking-tight">Content</span>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
        {links.map((link) => {
          const isActive = link.view === view
          return (
            <button
              key={link.view}
              type="button"
              onClick={() => onNavigate(link.view)}
              aria-current={isActive ? "page" : undefined}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-left
                text-sm transition-colors ${
                  isActive
                    ? "bg-ink/5 font-medium text-ink"
                    : "text-ink-soft hover:bg-ink/5 hover:text-ink"
                }`}
            >
              {link.label}
            </button>
          )
        })}
      </nav>

      <p
        className="mx-5 mt-auto hidden border-t border-line py-4 text-xs
          leading-relaxed text-ink-faint md:block"
      >
        Saved in this browser
      </p>
    </aside>
  )
}
