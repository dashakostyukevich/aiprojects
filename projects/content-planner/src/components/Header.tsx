import { primaryButton } from "../styles"

/*
  The top bar: the page title, one line of context, and the primary action.
  It sits on the canvas rather than in a card — the design system keeps
  containers for content and leaves the chrome as a hairline.

  onNewPost is a function passed down from App. This component doesn't know
  what happens when the button is clicked — it just reports that it happened.
*/
export default function Header({ onNewPost }: { onNewPost: () => void }) {
  return (
    <header className="border-b border-line">
      <div
        className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center
          sm:justify-between md:min-h-[72px] md:px-8"
      >
        <div>
          <h1 className="text-xl text-ink">Content Planner</h1>
          <p className="mt-0.5 text-sm text-ink-soft">Your ideas, organized.</p>
        </div>

        <button
          type="button"
          onClick={onNewPost}
          className={`${primaryButton} w-full sm:w-auto`}
        >
          + New post
        </button>
      </div>
    </header>
  )
}
