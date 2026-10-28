import { useEffect, useRef, useState } from "react"
import type { ChangeEvent } from "react"
import { fileToCover } from "../cover"
import { STATUSES } from "../types"
import type { ContentType, Pillar, Platform, Post, Status } from "../types"
import { primaryButton, secondaryButton } from "../styles"

/** What the page hands back to App when Save is pressed. */
export interface EditorDraft {
  title: string
  platform: Platform
  type: ContentType
  /** The pillar this post belongs to, or null when it isn't filed under one. */
  pillarId: number | null
  /** The raw "2026-03-18" from the date input. "" means no date at all. */
  dateInput: string
  status: Status
  /** A data URL from `cover.ts`, or "" when the post has no cover yet. */
  cover: string
  hooks: string
  script: string
  caption: string
}

const platforms: Platform[] = ["Instagram", "Threads", "TikTok", "Blog"]
const contentTypes: ContentType[] = [
  "Reel",
  "Carousel",
  "Story",
  "Text",
  "Blog post",
]

/*
  Every dropdown, date field and textarea on this page is the same control in
  a different place: white, a hairline border, 12px corners. Keeping it in one
  string means the five header fields can't drift apart.
*/
const fieldStyle =
  "rounded-xl border border-line bg-card px-3 py-2.5 text-sm text-ink " +
  "placeholder:text-ink-faint"

/* Every field starts empty, and this is what a brand new post begins as. */
const blankDraft: EditorDraft = {
  title: "",
  platform: "Instagram",
  type: "Reel",
  pillarId: null,
  dateInput: "",
  status: STATUSES[0],
  cover: "",
  hooks: "",
  script: "",
  caption: "",
}

/**
 * Turns an existing post into the draft this page works on. Every field maps
 * straight across; the only conversion is the date, where "no date at all"
 * becomes the empty string the date input uses for the same thing.
 *
 * The four optional fields come back as "" rather than undefined, because a
 * controlled textarea has to have a string either way — `blankDraft` and an
 * empty post should look and behave identically.
 */
function draftFromPost(post: Post): EditorDraft {
  return {
    title: post.title,
    platform: post.platform,
    type: post.type,
    pillarId: post.pillarId ?? null,
    // Posts store the same "YYYY-MM-DD" the date input uses, so it goes
    // straight back in. No conversion needed either way.
    dateInput: post.date ?? "",
    status: post.status,
    cover: post.cover ?? "",
    hooks: post.hooks ?? "",
    script: post.script ?? "",
    caption: post.caption ?? "",
  }
}

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
        className={fieldStyle}
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
 * One writing section. `rows` sets how much room it starts with — hooks are a
 * line or two, a script is a page — and it still grows as you write, because
 * `resize-y` is left on for all three.
 */
function Section({
  label,
  note,
  value,
  onChange,
  rows,
  placeholder,
}: {
  label: string
  note: string
  value: string
  onChange: (value: string) => void
  rows: number
  placeholder: string
}) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h2 className="text-xl text-ink">{label}</h2>
        <p className="text-xs text-ink-faint">{note}</p>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="resize-y rounded-xl border border-line bg-card px-4 py-3
          text-sm leading-relaxed text-ink placeholder:text-ink-faint"
      />
    </section>
  )
}

/**
 * The post editor — a full page rather than a dialog, used for creating a post
 * and for changing one.
 *
 * The order of the page is deliberate and follows how a post is actually made:
 *
 *   1. the title, which is the page heading and names the post everywhere
 *   2. the header — platform, content type, pillar, status, day, cover image:
 *      all the decisions that get made once and then not thought about again
 *   3. hooks, then script, then caption — the writing, in the order it is
 *      written: what stops the scroll, what you say, what goes underneath
 *
 * `post` is the difference between the two modes: undefined starts the page
 * blank, a Post starts it filled in with that post.
 *
 * All nine fields live in one `draft`. The page reports back whether that
 * draft still differs from what it opened with (see `onDirtyChange`), so App
 * can ask before throwing typed work away.
 */
export default function PostEditor({
  post,
  pillars,
  onSave,
  onCancel,
  onDirtyChange,
}: {
  /** The post being edited, or undefined when creating a new one. */
  post?: Post
  /** What the Pillar dropdown offers, read from App's pillar list. */
  pillars: Pillar[]
  onSave: (draft: EditorDraft) => void
  onCancel: () => void
  /** Reports true once the form differs from the state it opened in. */
  onDirtyChange: (dirty: boolean) => void
}) {
  // The initial value is only read on the first render, which is exactly what
  // we want: pre-filled when editing, blank when creating. App unmounts this
  // page on close, so each open starts fresh.
  const [draft, setDraft] = useState<EditorDraft>(
    post ? draftFromPost(post) : blankDraft,
  )
  const [titleError, setTitleError] = useState(false)
  const [coverError, setCoverError] = useState("")
  const [coverBusy, setCoverBusy] = useState(false)

  // Where the page opened, so "have you changed anything" is a straight
  // comparison against something that never moves. JSON is enough here: the
  // draft is eight strings and nothing else.
  const initialDraft = useRef(draft)

  useEffect(() => {
    onDirtyChange(
      JSON.stringify(draft) !== JSON.stringify(initialDraft.current),
    )
  }, [draft, onDirtyChange])

  // The editor replaces a page that may have been scrolled halfway down it,
  // and the browser keeps that scroll position for whatever comes next — so a
  // post opened from the bottom of the calendar list would arrive with its own
  // title above the top of the screen. Sending the window back to the top on
  // mount is a side effect on the DOM, which is precisely what an effect is
  // for; it sets no state, so nothing re-runs it.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // The file input is hidden and opened by the button beside it, because the
  // native control can't be made to look like part of this page.
  const fileInput = useRef<HTMLInputElement>(null)

  // The title field, so its height can be set from its own content below.
  const titleRef = useRef<HTMLTextAreaElement>(null)

  // Grows the title field to hold whatever is in it, measured in lines rather
  // than characters. Runs on every title change as well as on mount — `auto`
  // first, so shortening a long title collapses it back down instead of
  // leaving behind the height it had grown to.
  useEffect(() => {
    const field = titleRef.current
    if (field === null) return
    field.style.height = "auto"
    field.style.height = `${field.scrollHeight}px`
  }, [draft.title])

  const isEditing = post !== undefined
  const heading = isEditing ? "Edit post" : "New post"
  const saveLabel = isEditing ? "Save changes" : "Save post"

  /** Update one field and leave the rest alone. */
  function update<K extends keyof EditorDraft>(field: K, value: EditorDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  function handleSave() {
    if (draft.title.trim() === "") {
      setTitleError(true)
      return
    }

    // The title is trimmed so stray spaces never reach the list. The date is
    // formatted by App, which owns how dates are stored.
    onSave({ ...draft, title: draft.title.trim() })
  }

  /** Reads the picked file and turns it into a storable cover. */
  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Cleared before the first `await`, so choosing the same image twice in a
    // row still fires this — a file input ignores a second pick of one file.
    event.target.value = ""
    if (file === undefined) return

    setCoverError("")
    setCoverBusy(true)

    try {
      update("cover", await fileToCover(file))
    } catch (error) {
      setCoverError(
        error instanceof Error
          ? error.message
          : "That image could not be added.",
      )
    } finally {
      setCoverBusy(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      {/*
        The header carries the title and the six fixed decisions. It scrolls
        away with the page on purpose — none of it is needed once you are
        writing, and keeping all of it on screen would leave a script with a
        hundred lines to live in.

        Save stays reachable through the sticky bar at the bottom.
      */}
      <header className="border-b border-line bg-card">
        {/*
          The max-width lives on the same element as the padding, so the title
          and the section headings below share one left edge. Padding outside
          the max-width would centre the header on a different line from the
          writing — 32px out at every desktop width.
        */}
        <div
          className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-5 py-5
            md:px-8 md:py-7"
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="-ml-2 flex items-center gap-1.5 rounded-xl px-2 py-1
                text-sm text-ink-soft transition-colors hover:bg-subtle
                hover:text-ink"
            >
              <span aria-hidden="true">←</span> Back
            </button>
            <span className="text-xs text-ink-faint">{heading}</span>
          </div>

          {/* The title is the page heading, typed straight in — the way a
              document editor works, rather than one field among many. */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="post-title" className="sr-only">
              Post title
            </label>
            {/*
              A textarea rather than an input, sized to whatever is in it.

              An input only ever shows as much of the title as fits on one
              line, and the heading is the one place on screen where the whole
              title should be readable — the Lisbon post was being cut off
              mid-word at every desktop width.

              Enter adds no line: a title is a single line of data, so Enter
              saves instead, the way it would in a form.
            */}
            <textarea
              id="post-title"
              ref={titleRef}
              rows={1}
              value={draft.title}
              onChange={(event) => {
                update("title", event.target.value)
                if (titleError) setTitleError(false)
              }}
              onKeyDown={(event) => {
                if (event.key !== "Enter") return
                event.preventDefault()
                handleSave()
              }}
              placeholder="Untitled post"
              className={`w-full resize-none overflow-hidden border-b
                bg-transparent pb-2 text-3xl font-medium leading-tight
                placeholder:text-ink-faint md:text-4xl ${
                  titleError ? "border-danger" : "border-transparent"
                }`}
            />
            {titleError && (
              <span className="text-xs text-danger">
                A title is required before saving.
              </span>
            )}
          </div>

          {/* The header row: the five choices that set the post's place in
              the app. Two across on a phone, three once there is room. With
              an odd number, the last row simply doesn't fill — which reads
              better than squeezing five dropdowns into one line. */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
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

            {/*
              The pillar, unlike the two above it, is chosen from a list the
              reader owns and can be left empty — so it gets its own select
              rather than the shared `Select`, whose options are a fixed list of
              strings and which has no way to say "none".
            */}
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-ink-soft">Pillar</span>
              <select
                value={draft.pillarId === null ? "" : String(draft.pillarId)}
                onChange={(event) =>
                  update(
                    "pillarId",
                    event.target.value === "" ? null : Number(event.target.value),
                  )
                }
                className="rounded-xl border border-line bg-card px-3 py-2.5
                  text-sm text-ink"
              >
                <option value="">No pillar</option>
                {pillars.map((pillar) => (
                  <option key={pillar.id} value={pillar.id}>
                    {pillar.name}
                  </option>
                ))}
              </select>
            </label>

            <Select
              label="Status"
              value={draft.status}
              options={STATUSES}
              onChange={(value) => update("status", value)}
            />
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-ink-soft">Day</span>
              <input
                type="date"
                value={draft.dateInput}
                onChange={(event) => update("dateInput", event.target.value)}
                className={fieldStyle}
              />
            </label>
          </div>

          {/* The fifth item in the header: the cover, showing a thumbnail
              rather than a filename, because it is a picture. */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="w-20 shrink-0 text-xs font-medium text-ink-soft">
              Cover image
            </span>

            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="sr-only"
            />

            {draft.cover === "" ? (
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={coverBusy}
                className="rounded-xl border border-dashed border-line px-4
                  py-2.5 text-sm text-ink-soft transition-colors
                  hover:border-ink-faint hover:bg-subtle hover:text-ink
                  disabled:opacity-40"
              >
                {coverBusy ? "Adding…" : "+ Add cover"}
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <img
                  src={draft.cover}
                  alt="Cover preview"
                  className="h-14 w-24 rounded-lg object-cover ring-1 ring-line"
                />
                <div className="flex flex-col items-start gap-1">
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    disabled={coverBusy}
                    className="text-xs text-ink-soft underline underline-offset-2
                      transition-colors hover:text-ink disabled:opacity-40"
                  >
                    {coverBusy ? "Adding…" : "Replace"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCoverError("")
                      update("cover", "")
                    }}
                    className="text-xs text-ink-faint underline underline-offset-2
                      transition-colors hover:text-danger"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {coverError && (
              <span className="text-xs text-danger">{coverError}</span>
            )}
          </div>
        </div>
      </header>

      {/* The writing, in the order it happens. */}
      <main
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-5
          py-8 md:px-8"
      >
        <Section
          label="Hooks"
          note="What stops the scroll"
          value={draft.hooks}
          onChange={(value) => update("hooks", value)}
          rows={4}
          placeholder="The first line, the opening shot, the reason to stay…"
        />

        <Section
          label="Script"
          note="What you say, in order"
          value={draft.script}
          onChange={(value) => update("script", value)}
          rows={12}
          placeholder="Cold open, the three points, the close…"
        />

        <Section
          label="Caption"
          note="What goes underneath"
          value={draft.caption}
          onChange={(value) => update("caption", value)}
          rows={6}
          placeholder="The body text, the hashtags, the call to action…"
        />
      </main>

      {/*
        A sticky bar rather than a button in the header: a script runs long, and
        the only thing worse than a form this size is one whose Save button is
        two hundred lines off screen.
      */}
      <div
        className="sticky bottom-0 border-t border-line bg-card/95
          backdrop-blur"
      >
        <div
          className="mx-auto flex w-full max-w-3xl flex-wrap items-center
            justify-end gap-3 px-5 py-3 sm:justify-between md:px-8"
        >
          <p className="hidden text-xs text-ink-faint sm:block">
            Nothing is saved until you press {saveLabel.toLowerCase()}.
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={onCancel} className={secondaryButton}>
              Cancel
            </button>
            <button type="button" onClick={handleSave} className={primaryButton}>
              {saveLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
