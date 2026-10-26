import { useState } from "react"
import Dialog from "./Dialog"
import { STATUSES } from "../types"
import type { ContentType, Platform, Post, Status } from "../types"

/** What the modal hands back to App when Save is pressed. */
export interface DraftPost {
  title: string
  platform: Platform
  type: ContentType
  /** The raw "2026-03-18" from the date input. "" means no date at all. */
  dateInput: string
  status: Status
  notes: string
}

/*
  Every field starts empty, and this is the shape the form works on.
  `dateInput` stays "" until a date is picked. The status starts at the first
  stage of the pipeline — the front door for anything new.
*/
const emptyDraft: DraftPost = {
  title: "",
  platform: "Instagram",
  type: "Reel",
  dateInput: "",
  status: STATUSES[0],
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
 * Turns an existing post into a draft the form understands. Every field maps
 * straight across; the only conversion is the date, where "no date at all"
 * becomes the empty string the date input uses for the same thing.
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
  The post dialog — the long form — used for both creating and editing.

  All six fields live in one piece of state called `draft`. Typing calls
  setDraft with a new object that copies the old one and changes one field —
  that's why nothing else on screen reacts to an edit.

  `post` is the difference between the two modes:
    undefined  creating — the form starts blank
    a Post     editing  — the form starts filled in with that post

  Cancel closes without saving. Save checks the title, then hands the draft
  back up to App and clears itself for next time.

  The frame itself comes from `Dialog`, shared with the idea form so the two
  look like siblings.
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
  // dialog by unmounting it on close, so each open starts fresh.
  const [draft, setDraft] = useState<DraftPost>(
    post ? draftFromPost(post) : emptyDraft,
  )
  const [titleError, setTitleError] = useState(false)

  const isEditing = post !== undefined
  const heading = isEditing ? "Edit post" : "New post"
  const saveLabel = isEditing ? "Save changes" : "Save post"

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
    <Dialog title={heading} onClose={onCancel} wide>
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
            options={STATUSES}
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
            {saveLabel}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
