import type { View } from "../types"

/*
  The navigation column. On desktop it sits on the left as a fixed sidebar, 280
  wide, white against the grey page. On small screens the whole thing collapses
  into a bar above the content: the wordmark on one line, the four pages on the
  next, close enough together that nothing has to scroll sideways.

  These were `<a href="#">` links that went nowhere. They are buttons now,
  because they don't open a URL — they tell App which view to render. Sidebar
  doesn't decide that itself; it just reports the click, the same way every
  other button here does.

  The active item is the one piece of blue in the column: it is the current
  location, which is exactly what the design system reserves the blue for.
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
        bg-card md:w-[280px] md:border-b-0 md:border-r"
    >
      {/* The serif is the wordmark's alone — everywhere else in the app is the
          interface sans. No icon tile beside it: the design system gives the
          wordmark the corner to itself, and the one blue in this column
          belongs to the page you are on. */}
      <div className="flex items-center px-5 py-4 md:px-8 md:py-7">
        <span className="font-brand text-[30px] leading-none text-ink">
          Content
        </span>
      </div>

      <nav
        className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col
          md:gap-1 md:px-4 md:pb-0"
      >
        {links.map((link) => {
          const isActive = link.view === view
          return (
            <button
              key={link.view}
              type="button"
              onClick={() => onNavigate(link.view)}
              aria-current={isActive ? "page" : undefined}
              className={`whitespace-nowrap rounded-xl px-3 py-2.5 text-sm
                transition-colors md:flex md:h-12 md:items-center md:px-4
                md:text-[17px] ${
                  isActive
                    ? "bg-primary font-medium text-white"
                    : "text-ink-soft hover:bg-subtle hover:text-ink"
                }`}
            >
              {link.label}
            </button>
          )
        })}
      </nav>

      <p
        className="mx-4 mt-auto hidden border-t border-line py-5 text-xs
          leading-relaxed text-ink-faint md:block"
      >
        Saved in this browser
      </p>
    </aside>
  )
}
