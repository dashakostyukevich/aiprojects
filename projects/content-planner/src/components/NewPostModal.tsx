import { useState } from "react"
import type { ContentType, Platform, Post, Status } from "../types"

/** What the modal hands back to App when Save is pressed. */
export interface DraftPost {
  title: string
  platform: Platform
  type: ContentType
  /** The raw "2026-03-18" from the date input, kept so App can work out
      which column of the weekly board the post belongs in. */
  dateInput: string
  status: Status
  notes: string
}

/*
  Every field starts empty, and this is the shape the form works on.
  `dateInput` stays "" until a date is picked.
*/
const emptyDraft: DraftPost = {
  title: "",
  platform: "Instagram",
  type: "Reel",
  dateInput: "",
  status: "Idea",
  notes: "",
}

const platforms: Platform[] = ["Instagram", "Threads", "TikTok", "Blog"]
const contentTypes: ContentType[] = [
  "Reel",
  "Carousel",
  "Story",
  "Text",
  "Blog post",
]
const statuses: Status[] = ["Idea", "Draft", "Scheduled", "Published"]

/* One labelled dropdown, reused three times below. */
function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-ink-soft">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="rounded-lg border border-line bg-card px-3 py-2 text-sm
          text-ink outline-none focus:border-ink-faint"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

/**
 * Turns an existing post into a draft the form understands. The only fiddly
 * part is the date: posts store "Mar 18", the date input wants "2026-03-18".
 */
function draftFromPost(post: Post): DraftPost {
  return {
    title: post.title,
    platform: post.platform,
    type: post.type,
    // Posts store the same "YYYY-MM-DD" the date input uses, so it goes
    // straight back in. No conversion needed either way.
    dateInput: post.date ?? "",
    status: post.status,
    notes: post.notes ?? "",
  }
}

/*
  The post dialog, used for both creating and editing.

  All seven fields live in one piece of state called `draft`. Typing calls
  setDraft with a new object that copies the old one and changes one field —
  that's why nothing else on screen reacts to an edit.

  `post` is the difference between the two modes:
    undefined  creating — the form starts blank
    a Post     editing  — the form starts filled in with that post

  Cancel closes without saving. Save checks the title, then hands the draft
  back up to App and clears itself for next time.
*/
export default function NewPostModal({
  post,
  onSave,
  onCancel,
}: {
  /** The post being edited, or undefined when creating a new one. */
  post?: Post
  onSave: (draft: DraftPost) => void
  onCancel: () => void
}) {
  // The initial value is only read on the first render, which is exactly what
  // we want: pre-filled when editing, blank when creating. App remounts the
  // modal by unmounting it on close, so each open starts fresh.
  const [draft, setDraft] = useState<DraftPost>(
    post ? draftFromPost(post) : emptyDraft,
  )
  const [titleError, setTitleError] = useState(false)

  const isEditing = post !== undefined

  /** Update one field and leave the rest alone. */
  function update<K extends keyof DraftPost>(field: K, value: DraftPost[K]) {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  function handleSave() {
    if (draft.title.trim() === "") {
      setTitleError(true)
      return
    }

    // Trim the title so stray spaces never reach the list. The date is
    // formatted by App, which owns how dates are stored.
    onSave({ ...draft, title: draft.title.trim() })

    setDraft(post ? draftFromPost(post) : emptyDraft)
    setTitleError(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30
        p-0 sm:items-center sm:p-4"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-post-heading"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl
          border border-line bg-paper p-6 sm:rounded-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 id="new-post-heading" className="font-display text-2xl">
            {isEditing ? "Edit post" : "New post"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="-mr-1 -mt-1 rounded-full px-2 py-1 text-lg
              leading-none text-ink-faint transition-colors hover:text-ink"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleSave()
          }}
          className="flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-ink-soft">
              Title <span className="text-clay">*</span>
            </span>
            <input
              value={draft.title}
              onChange={(event) => {
                update("title", event.target.value)
                if (titleError) setTitleError(false)
              }}
              placeholder="What's the post about?"
              className={`rounded-lg border bg-card px-3 py-2 text-sm
                outline-none focus:border-ink-faint ${
                  titleError ? "border-clay" : "border-line"
                }`}
            />
            {titleError && (
              <span className="text-xs text-clay">
                A title is required before saving.
              </span>
            )}
          </label>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Platform"
              value={draft.platform}
              options={platforms}
              onChange={(value) => update("platform", value)}
            />
            <Select
              label="Content type"
              value={draft.type}
              options={contentTypes}
              onChange={(value) => update("type", value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-ink-soft">
                Publication date
              </span>
              <input
                type="date"
                value={draft.dateInput}
                onChange={(event) => update("dateInput", event.target.value)}
                className="rounded-lg border border-line bg-card px-3 py-2
                  text-sm text-ink outline-none focus:border-ink-faint"
              />
            </label>

            <Select
              label="Status"
              value={draft.status}
              options={statuses}
              onChange={(value) => update("status", value)}
            />
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-ink-soft">
              Notes <span className="text-ink-faint">(optional)</span>
            </span>
            <textarea
              value={draft.notes}
              onChange={(event) => update("notes", event.target.value)}
              rows={3}
              placeholder="Angle, references, first line…"
              className="resize-none rounded-lg border border-line bg-card
                px-3 py-2 text-sm outline-none focus:border-ink-faint"
            />
          </label>

          <div className="mt-1 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-line px-5 py-2 text-sm
                font-medium text-ink-soft transition-colors
                hover:bg-ink/5 hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-ink px-5 py-2 text-sm font-medium
                text-paper transition-opacity hover:opacity-90"
            >
              {isEditing ? "Save changes" : "Save post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
