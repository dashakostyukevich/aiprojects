// The per-habit overflow menu: a "⋯" button that opens Rename and Delete.
//
// Why a menu instead of two buttons on the row: the habit list is mostly
// reading, not editing, and Rename/Delete on every card is two permanent
// controls per habit competing with the Done button for attention. Hiding
// them behind one quiet trigger keeps the row about the habit.
//
// Delete stays two-step, and the confirmation lives *inside* the menu: the
// first pick turns the item into a red "Delete for sure?" and keeps the menu
// open, the second one deletes. So the thing you are about to click is the
// thing that says what it will do, and backing out is just closing the menu.
//
// The popup is rendered into a portal on document.body, NOT inside the row.
// That is the whole reason this component is shaped the way it is:
//
//   The 31-day rows live in `.history-scroll`, which scrolls sideways. Any
//   popup rendered inside it is a descendant of that scroller, so the browser
//   clips it to the scroller's box — and `overflow-x: auto` clips vertically
//   too. With a long habit list the scroller is far taller than the window,
//   so a menu near the bottom of the screen was cut off and its Delete button
//   could not be clicked at all. No amount of flipping fixes that: the
//   container is the clipper, and the container is bigger than the viewport.
//
// Rendering into document.body with `position: fixed` puts the popup outside
// every clipping ancestor, so it is only ever bounded by the window, which is
// exactly what we want to measure against.
//
// Because of that, the position is written straight to the DOM node's style
// in a layout effect rather than held in React state. The popup has to be
// rendered before its width and height are known, and measuring it is a
// layout concern, not application state — re-rendering the whole menu to move
// a box would be wasteful and would flash at the wrong spot for a frame.

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/** How long the Delete item waits in its confirming state. */
const CONFIRM_MS = 4000

/** Gap between the trigger and the popup, and the minimum screen margin. */
const GAP = 6

interface HabitMenuProps {
  /** The habit's name, used in the trigger's label and the delete prompt. */
  name: string
  /** Called when Rename is chosen, to swap the habit for a form. */
  onEdit: () => void
  /** Called on the confirming second click. Removes the habit and history. */
  onDelete: () => void
  /**
   * Marks this menu as the narrow variant used inside the 31-day rows. It goes
   * on the *wrapper*, not the trigger, because the wrapper is what the compact
   * trigger sizing hangs off.
   */
  variant?: 'compact'
}

export default function HabitMenu({
  name,
  onEdit,
  onDelete,
  variant,
}: HabitMenuProps) {
  const [open, setOpen] = useState(false)
  // The Delete item is showing "Delete for sure?" and the next pick deletes.
  const [confirming, setConfirming] = useState(false)

  // The wrapper owns the trigger; the popup lives in the portal, so "click
  // outside" has to test both nodes.
  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Ties the popup to its trigger for screen readers.
  const menuId = useId()

  /**
   * The single way the menu closes. Resetting the confirming state here,
   * rather than in each caller, means a habit cannot reopen still asking
   * "Delete for sure?", and there is only one place to forget.
   */
  function close() {
    setOpen(false)
    setConfirming(false)
  }

  // Place the popup against the trigger, inside the window.
  //
  // Runs on open and again on every scroll or resize, because the trigger is
  // sticky inside a scroller: it moves relative to the window as the days are
  // scrolled, and a popup that does not move with it points at nothing.
  // `capture: true` on the scroll listener so it also fires for the inner
  // horizontal scroller, not just the page.
  useLayoutEffect(() => {
    if (!open) return

    function place() {
      const trigger = triggerRef.current
      const popup = menuRef.current
      if (!trigger || !popup) return

      const anchor = trigger.getBoundingClientRect()
      const width = popup.offsetWidth
      const height = popup.offsetHeight

      // Prefer below the trigger; flip above when it will not fit and there is
      // more room up there. Then clamp, so a trigger near a window edge still
      // gets a fully visible menu.
      const roomBelow = window.innerHeight - anchor.bottom
      const flipUp = height + GAP > roomBelow && anchor.top > roomBelow

      const top = flipUp
        ? anchor.top - height - GAP
        : Math.min(anchor.bottom + GAP, window.innerHeight - height - GAP)

      // Aligned to the trigger's right edge, which is what the eye expects
      // from a menu that drops from a button on the right of a row.
      const left = Math.max(
        GAP,
        Math.min(anchor.right - width, window.innerWidth - width - GAP),
      )

      popup.style.top = `${Math.max(GAP, top)}px`
      popup.style.left = `${left}px`
    }

    place()

    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open])

  // Close on a click anywhere else, counting the portalled popup as "inside".
  // `pointerdown` rather than `click` so the menu is already gone by the time
  // the clicked element reacts, which stops a click landing on whatever is
  // underneath the menu.
  useEffect(() => {
    if (!open) return

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node
      const insideTrigger = wrapRef.current?.contains(target)
      const insidePopup = menuRef.current?.contains(target)
      if (!insideTrigger && !insidePopup) close()
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  // Escape closes and hands focus back to the trigger, so keyboard focus is
  // never left on a menu item that is no longer in the document.
  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation()
        close()
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  // Move focus onto the first item when the menu opens, so it is not
  // keyboard-reachable-only-after-tabbing-past-the-trigger.
  useEffect(() => {
    if (open) menuRef.current?.querySelector('button')?.focus()
  }, [open])

  // Stand down from the confirming state on a timer, so an abandoned menu
  // does not sit there offering to delete something.
  useEffect(() => {
    if (!confirming) return

    const timer = setTimeout(() => setConfirming(false), CONFIRM_MS)
    return () => clearTimeout(timer)
  }, [confirming])

  function chooseEdit() {
    close()
    onEdit()
  }

  function chooseDelete() {
    if (confirming) {
      // Second pick: this is the one that deletes.
      close()
      onDelete()
      return
    }

    // First pick only arms the item. The menu deliberately stays open, so the
    // confirmation is visible and the way out is right there.
    setConfirming(true)
  }

  function onTriggerClick() {
    if (open) {
      close()
      return
    }

    setOpen(true)
  }

  // Arrow keys move between the items, as expected in a menu.
  function onMenuKeyDown(event: React.KeyboardEvent) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return

    event.preventDefault()
    const items = Array.from(menuRef.current?.querySelectorAll('button') ?? [])
    if (items.length === 0) return

    // A NodeList has no indexOf, so this is an array now.
    const current = items.indexOf(document.activeElement as HTMLButtonElement)
    const step = event.key === 'ArrowDown' ? 1 : -1
    // Wrap around: ArrowUp from the first item lands on the last.
    const next = (current + step + items.length) % items.length
    items[next]?.focus()
  }

  return (
    <div
      className={`habit-menu${variant === 'compact' ? ' habit-menu--compact' : ''}`}
      ref={wrapRef}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`habit-menu-trigger${open ? ' habit-menu-trigger--open' : ''}`}
        onClick={onTriggerClick}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        // The trigger is three dots, which means nothing out loud, so the
        // label has to carry the habit it belongs to.
        aria-label={`More options for ${name}`}
      >
        <span aria-hidden="true">⋯</span>
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            id={menuId}
            className="habit-menu-popup"
            role="menu"
            aria-label={`Options for ${name}`}
            onKeyDown={onMenuKeyDown}
          >
            <button
              type="button"
              className="habit-menu-item"
              role="menuitem"
              onClick={chooseEdit}
            >
              Rename
            </button>

            <button
              type="button"
              className={[
                'habit-menu-item',
                'habit-menu-item--danger',
                // Filled in while confirming, so the destructive choice is the
                // one that looks like it is about to happen.
                confirming ? 'habit-menu-item--confirming' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              role="menuitem"
              onClick={chooseDelete}
            >
              {confirming ? 'Delete for sure?' : 'Delete'}
            </button>
          </div>,
          document.body,
        )}
    </div>
  )
}
