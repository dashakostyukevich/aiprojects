/*
  The top of the page: title, one line of context, and the primary button.

  onNewPost is a function passed down from App. This component doesn't know
  what happens when the button is clicked — it just reports that it happened.
*/
export default function Header({ onNewPost }: { onNewPost: () => void }) {
  return (
    <header className="border-b border-line">
      <div
        className="flex flex-col gap-4 px-5 py-6 sm:flex-row
          sm:items-end sm:justify-between md:px-8"
      >
        <div>
          <h1 className="font-display text-3xl tracking-tight md:text-4xl">
            Content Planner
          </h1>
          <p className="mt-1 text-sm text-ink-soft">Your ideas, organized.</p>
        </div>

        <button
          type="button"
          onClick={onNewPost}
          className="w-full rounded-full bg-ink px-5 py-2.5 text-sm
            font-medium text-paper transition-opacity hover:opacity-90
            sm:w-auto"
        >
          + New post
        </button>
      </div>
    </header>
  )
}
