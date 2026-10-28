import { useState } from "react"
import Dialog from "./Dialog"
import { PILLAR_TYPES } from "../types"
import type { Pillar, PillarType } from "../types"
import { PILLAR_GUIDE } from "../pillarTypes"
import { primaryButton, secondaryButton } from "../styles"

/** What the pillar form hands back to App when Save is pressed. */
export interface DraftPillar {
  name: string
  type: PillarType
  description: string
}

/* The shared look of every control in this form. */
const fieldStyle =
  "rounded-xl border bg-card px-3 py-2.5 text-sm text-ink " +
  "placeholder:text-ink-faint"

/*
  The pillar form — short, like the idea form, and for the same reason: a pillar
  is a name, a type and a sentence, not a document.

  The type is the field that decides everything else. Picking one shows what
  that type is for underneath the dropdown, so the choice is made with the
  meaning in front of you rather than from a list of nine words. That line is
  read from the same `PILLAR_GUIDE` the Pillars page uses, so the two can't
  disagree about what "Engaging" means.

  `pillar` is the difference between the two modes, the same as everywhere else
  in the app: undefined creates, a Pillar edits.
*/
export default function PillarDialog({
  pillar,
  onSave,
  onCancel,
}: {
  /** The pillar being edited, or undefined when creating a new one. */
  pillar?: Pillar
  onSave: (draft: DraftPillar) => void
  onCancel: () => void
}) {
  // The initial value is only read on the first render — filled in when
  // editing, blank when creating. App unmounts the dialog on close, so each
  // open starts fresh and there is nothing to re-sync afterwards.
  const [draft, setDraft] = useState<DraftPillar>({
    name: pillar?.name ?? "",
    // A new pillar has to start somewhere, and the first type in the list is
    // as good a default as any — the reader changes it in one click.
    type: pillar?.type ?? PILLAR_TYPES[0],
    description: pillar?.description ?? "",
  })
  const [nameError, setNameError] = useState(false)

  function update<K extends keyof DraftPillar>(field: K, value: DraftPillar[K]) {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  function handleSave() {
    if (draft.name.trim() === "") {
      setNameError(true)
      return
    }

    onSave({ ...draft, name: draft.name.trim() })
    setNameError(false)
  }

  return (
    <Dialog title={pillar ? "Edit pillar" : "New pillar"} onClose={onCancel}>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          handleSave()
        }}
        className="flex flex-col gap-4"
      >
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-ink-soft">
            Name <span className="text-danger">*</span>
          </span>
          <input
            value={draft.name}
            onChange={(event) => {
              update("name", event.target.value)
              if (nameError) setNameError(false)
            }}
            placeholder="What you actually call it"
            autoFocus
            className={`${fieldStyle} ${
              nameError ? "border-danger" : "border-line"
            }`}
          />
          {nameError && (
            <span className="text-xs text-danger">
              A name is required before saving.
            </span>
          )}
        </label>

        <div className="flex flex-col gap-1.5">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-ink-soft">Type</span>
            <select
              value={draft.type}
              onChange={(event) =>
                update("type", event.target.value as PillarType)
              }
              className={`${fieldStyle} border-line`}
            >
              {PILLAR_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          {/*
            What the chosen type is for, read in the moment of choosing.

            Outside the label on purpose: a label's text becomes the control's
            accessible name, so leaving it inside would rename the dropdown to
            "Type" followed by a paragraph.
          */}
          <p className="text-xs leading-relaxed text-ink-faint">
            {PILLAR_GUIDE[draft.type].summary}
          </p>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-ink-soft">
            Description <span className="text-ink-faint">(optional)</span>
          </span>
          <textarea
            value={draft.description}
            onChange={(event) => update("description", event.target.value)}
            rows={3}
            placeholder="What belongs in this pillar — and what doesn't…"
            className={`${fieldStyle} resize-none border-line`}
          />
        </label>

        <div className="mt-1 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className={secondaryButton}>
            Cancel
          </button>
          <button type="submit" className={primaryButton}>
            {pillar ? "Save changes" : "Save pillar"}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
