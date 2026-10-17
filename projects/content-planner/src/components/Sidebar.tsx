const links = [
  { label: "Overview", current: true },
  { label: "Content Calendar", current: false },
  { label: "Ideas", current: false },
]

/*
  The navigation column. On desktop it sits on the left as a fixed sidebar.
  On small screens the whole thing collapses into a bar above the content.
*/
export default function Sidebar() {
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
        {links.map((link) => (
          <a
            key={link.label}
            href="#"
            aria-current={link.current ? "page" : undefined}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
              link.current
                ? "bg-ink/5 font-medium text-ink"
                : "text-ink-soft hover:bg-ink/5 hover:text-ink"
            }`}
          >
            {link.label}
          </a>
        ))}
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
