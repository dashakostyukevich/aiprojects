import { useState } from "react"
import Dialog from "./Dialog"
import { IDEA_TAGS } from "../types"
import type { Idea, IdeaTag } from "../types"
import { primaryButton, secondaryButton } from "../styles"

/** What the dialog hands back to App when Save is pressed. */
export interface DraftIdea {
  title: string
  /** Left out entirely when the idea has no tag. */
  tag?: IdeaTag
  notes: string
}

/* The shared look of every control in this form. */
const fieldStyle =
  "rounded-xl border bg-card px-3 py-2.5 text-sm text-ink " +
  "placeholder:text-ink-faint"

/*
  The idea dialog — the short form, three fields.

  Compare the post editor: platform, format, day, status, cover, hooks, script
  and caption is a page you sit down and work through once, on purpose. This
  one is a form you flick through while something is still fresh, which is why
  it asks for almost nothing. An idea that takes a minute to record is an idea
  that doesn't get recorded.

  The tag starts empty. Deciding what kind of thought you just had is a
  separate act from having it, so nothing here forces the question — an
  untagged idea simply collects under "Uncategorised" on the page.

  The frame comes from `Dialog`.
*/
export default function IdeaDialog({
  idea,
  onSave,
  onCancel,
}: {
  /** The idea being edited, or undefined when creating a new one. */
  idea?: Idea
  onSave: (draft: DraftIdea) => void
  onCancel: () => void
}) {
  // App remounts this dialog on close, so starting fresh on the first render
  // is enough — there is nothing to re-sync afterwards.
  const [draft, setDraft] = useState<DraftIdea>({
    title: idea?.title ?? "",
    tag: idea?.tag,
    notes: idea?.notes ?? "",
  })
  const [titleError, setTitleError] = useState(false)

  function update<K extends keyof DraftIdea>(field: K, value: DraftIdea[K]) {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  function handleSave() {
    if (draft.title.trim() === "") {
      setTitleError(true)
      return
    }

    onSave({ ...draft, title: draft.title.trim() })
    setTitleError(false)
  }

  return (
    <Dialog title={idea ? "Edit idea" : "New idea"} onClose={onCancel}>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          handleSave()
        }}
        className="flex flex-col gap-4"
      >
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-ink-soft">
            Title <span className="text-danger">*</span>
          </span>
          <input
            value={draft.title}
            onChange={(event) => {
              update("title", event.target.value)
              if (titleError) setTitleError(false)
            }}
            placeholder="The idea, in one line"
            autoFocus
            className={`${fieldStyle} ${
              titleError ? "border-danger" : "border-line"
            }`}
          />
          {titleError && (
            <span className="text-xs text-danger">
              A title is required before saving.
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-ink-soft">
            Tag <span className="text-ink-faint">(optional)</span>
          </span>
          {/*
            The empty option is what "no tag" looks like in a select — a
            dropdown can't be blank, so untagged has to be a real choice. App
            turns "" back into `undefined`, which is how the idea is stored.
          */}
          <select
            value={draft.tag ?? ""}
            onChange={(event) =>
              update("tag", (event.target.value || undefined) as IdeaTag)
            }
            className={`${fieldStyle} border-line`}
          >
            <option value="">Uncategorised</option>
            {IDEA_TAGS.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-ink-soft">
            Notes <span className="text-ink-faint">(optional)</span>
          </span>
          <textarea
            value={draft.notes}
            onChange={(event) => update("notes", event.target.value)}
            rows={3}
            placeholder="Why it's worth keeping…"
            className={`${fieldStyle} resize-none border-line`}
          />
        </label>

        <div className="mt-1 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className={secondaryButton}>
            Cancel
          </button>
          <button type="submit" className={primaryButton}>
            {idea ? "Save changes" : "Save idea"}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
