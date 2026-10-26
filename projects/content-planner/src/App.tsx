import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import SummaryCards from "./components/SummaryCards"
import PostList from "./components/PostList"
import Calendar from "./components/Calendar"
import PlanBoard from "./components/PlanBoard"
import Ideas from "./components/Ideas"
import PostEditor from "./components/PostEditor"
import type { EditorDraft } from "./components/PostEditor"
import IdeaDialog from "./components/IdeaDialog"
import type { DraftIdea } from "./components/IdeaDialog"
import { ideas as exampleIdeas, posts as examplePosts } from "./data"
import { addMonths, isValidISO, parseISO, todayISO } from "./dates"
import { loadStore, saveStore } from "./storage"
import type { Store } from "./storage"
import { STATUSES } from "./types"
import type { Idea, Post, Status, View } from "./types"

/*
  The stage a new post starts at. Read from the list rather than typed in, so
  renaming the pipeline only ever means changing `STATUSES`.
 */
const FIRST_STAGE = STATUSES[0]

/*
  What the idea dialog is currently doing. One state instead of a separate
  "is open" flag and "which idea" value, so the two can never disagree.

    null                closed
    { newIdea }         adding a brand new idea
    { editIdea, idea }  changing an idea that already exists

  Posts are not here any more: the long form grew into a page, which App
  renders in place of the rest of the screen rather than over the top of it.
*/
type IdeaModal =
  | { mode: "newIdea" }
  | { mode: "editIdea"; idea: Idea }
  | null

/*
  What the editor page is doing — the same one-state idea as above, for the
  same reason.

    null           not editing, so the three normal pages are on screen
    { create }     adding a brand new post
    { edit, post } changing a post that already exists
*/
type Editor = { mode: "create" } | { mode: "edit"; post: Post } | null

/** One more than the highest id in a list. */
function nextId(items: { id: number }[]): number {
  // reduce starts at 0 rather than at -Infinity, so the very first item gets
  // id 1 even when the list is empty — `Math.max(...[])` would return -Infinity
  // here, which JSON then writes out as null.
  return items.reduce((highest, item) => Math.max(highest, item.id), 0) + 1
}

/*
  App owns both lists. Everything below receives them as props and re-renders
  when they change, which is why the boards, the count cards, the calendar and
  the ideas grid all update together.

  Six pieces of state:
    store        both lists, read from the browser on startup
    editor       which post the editor page has open, or null when it doesn't
    editorDirty  whether the editor holds writing that hasn't been saved
    ideaModal    what the idea dialog is doing, or null when it is closed
    saveFailed   the last write to localStorage didn't take
    month        the year and month the calendar page is showing
    view         which page is on screen — Plan, Calendar or Ideas
*/
function App() {
  // The function form of useState runs once, on the first render, which is
  // what we want for reading storage. Passing the object directly would run it
  // on every render.
  const [store, setStore] = useState<Store>(
    () => loadStore() ?? { posts: examplePosts, ideas: exampleIdeas },
  )
  const [editor, setEditor] = useState<Editor>(null)
  const [editorDirty, setEditorDirty] = useState(false)
  const [ideaModal, setIdeaModal] = useState<IdeaModal>(null)
  const [saveFailed, setSaveFailed] = useState(false)
  const [view, setView] = useState<View>("plan")

  const { posts, ideas } = store

  // The calendar opens on the current month, read from the real clock.
  const [month, setMonth] = useState(() => {
    const today = parseISO(todayISO())!
    return { year: today.year, month: today.month }
  })

  /**
   * Puts a new store in memory and writes it to the browser in the same
   * breath.
   *
   * Every change in the app comes through here rather than through an effect
   * that watches `store`, which is what lets the warning below name the change
   * that didn't take — and stops React from being asked to report on a write
   * that already happened.
   *
   * Only ever called from an event handler, and only ever once per one, so
   * reading the current `store` out of the closure is safe: a click produces
   * one new store and one write.
   */
  function applyStore(next: Store) {
    setStore(next)
    // A post can carry a cover image now, and a store can fill up. When the
    // write doesn't take, `saveFailed` says so instead of letting the app
    // carry on looking healthy while nothing is being kept.
    setSaveFailed(!saveStore(next))
  }

  // Updates the posts and leaves the ideas exactly as they are. A wrapper
  // rather than a second piece of state, because both lists have to be saved
  // together — two states would mean two saves that could fall out of step.
  function setPosts(update: (posts: Post[]) => Post[]) {
    applyStore({ ...store, posts: update(store.posts) })
  }

  /** Updates the ideas and leaves the posts exactly as they are. */
  function setIdeas(update: (ideas: Idea[]) => Idea[]) {
    applyStore({ ...store, ideas: update(store.ideas) })
  }

  /** Closes the editor outright, with no question asked. */
  function closeEditor() {
    setEditor(null)
    setEditorDirty(false)
  }

  /**
   * Leaves the editor the way leaving normally should work: asking first when
   * there is unsaved writing in it, because a page you can type a whole script
   * into is a worse thing to lose on a misclick than a dialog was.
   *
   * Returns false when the user chose to carry on editing, so the caller knows
   * whether to go on navigating.
   */
  function dismissEditor(): boolean {
    if (editor === null) return true

    if (
      editorDirty &&
      !window.confirm("Discard your unsaved changes to this post?")
    ) {
      return false
    }

    closeEditor()
    return true
  }

  /**
   * Goes to another page, closing the editor on the way. Every sidebar item
   * goes through here for that reason — while the editor is open the sidebar
   * is the only way out of it.
   */
  function navigate(next: View) {
    if (!dismissEditor()) return
    setView(next)
  }

  function closeIdeaModal() {
    setIdeaModal(null)
  }

  /** Turns the form values into a post. */
  function postFromDraft(draft: EditorDraft, id: number): Post {
    // A section left empty is not stored at all. "" and absent mean the same
    // thing to everything that reads them, and leaving it out keeps the saved
    // JSON down. Whitespace-only counts as empty; real content is kept exactly
    // as it was typed, indentation and all.
    const section = (value: string) => (value.trim() === "" ? undefined : value)

    return {
      id,
      title: draft.title,
      platform: draft.platform,
      type: draft.type,
      // The date input already speaks "YYYY-MM-DD", so it is stored as-is.
      // No date at all means null, which keeps the post off the calendar.
      date: draft.dateInput === "" ? null : draft.dateInput,
      status: draft.status,
      cover: draft.cover === "" ? undefined : draft.cover,
      hooks: section(draft.hooks),
      script: section(draft.script),
      caption: section(draft.caption),
    }
  }

  /**
   * One save handler for both modes. The `editor` state says which it is:
   * editing swaps the post with the same id, creating adds a new one.
   *
   * Closes with `closeEditor` rather than `dismissEditor` — the writing has
   * just been saved, so there is nothing left to ask about.
   */
  function handleSaveEditor(draft: EditorDraft) {
    if (editor?.mode === "edit") {
      const updated = postFromDraft(draft, editor.post.id)
      setPosts((current) =>
        current.map((post) => (post.id === updated.id ? updated : post)),
      )
    } else {
      setPosts((current) => [postFromDraft(draft, nextId(posts)), ...current])
    }

    closeEditor()
  }

  /** Removes one post, after asking first. */
  function handleDelete(post: Post) {
    const confirmed = window.confirm(
      `Delete "${post.title}"?\n\nThis cannot be undone.`,
    )
    if (!confirmed) return

    setPosts((current) => current.filter((p) => p.id !== post.id))
  }

  /**
   * Dragging a card on the status board changes one post's status, and
   * nothing else — it keeps its id, date and written sections, and simply
   * appears in a different column on the next render.
   */
  function handleMoveStatus(post: Post, status: Status) {
    setPosts((current) =>
      current.map((p) => (p.id === post.id ? { ...p, status } : p)),
    )
  }

  /**
   * Dragging a card on the week board changes one post's date. `date` may be
   * null, which is what dropping a card into the Unscheduled strip does.
   */
  function handleMoveDate(post: Post, date: string | null) {
    setPosts((current) =>
      current.map((p) => (p.id === post.id ? { ...p, date } : p)),
    )
  }

  /** Opens the editor page to add a post. */
  function openCreate() {
    if (!dismissEditor()) return
    setEditor({ mode: "create" })
  }

  /** Opens the editor page on a post that already exists. */
  function openEdit(post: Post) {
    if (!dismissEditor()) return
    setEditor({ mode: "edit", post })
  }

  /** Opens the short form to add an idea. */
  function openNewIdea() {
    setIdeaModal({ mode: "newIdea" })
  }

  /** Opens the short form on an idea that already exists. */
  function openEditIdea(idea: Idea) {
    setIdeaModal({ mode: "editIdea", idea })
  }

  /** One save handler for both modes of the idea dialog. */
  function handleSaveIdea(draft: DraftIdea) {
    if (ideaModal?.mode === "editIdea") {
      const updated: Idea = {
        ...ideaModal.idea,
        title: draft.title,
        tag: draft.tag,
        notes: draft.notes,
      }
      setIdeas((current) =>
        current.map((idea) => (idea.id === updated.id ? updated : idea)),
      )
    } else {
      // `draft.tag` is undefined when nothing was chosen, which is exactly how
      // an untagged idea is stored — no special "none" value needed.
      setIdeas((current) => [
        {
          id: nextId(current),
          title: draft.title,
          tag: draft.tag,
          notes: draft.notes,
        },
        ...current,
      ])
    }

    closeIdeaModal()
  }

  /** Removes one idea, after asking first. Any post it became is left alone. */
  function handleDeleteIdea(idea: Idea) {
    const confirmed = window.confirm(
      `Delete "${idea.title}"?\n\nThis cannot be undone.`,
    )
    if (!confirmed) return

    setIdeas((current) => current.filter((i) => i.id !== idea.id))
  }

  /**
   * Turns an idea into a post.
   *
   * The idea is kept and linked rather than converted, because a hook or a
   * topic is often worth a second post — using an idea once is not the same as
   * using it up. The new post starts at the first stage with no date, ready
   * for the rest to be filled in.
   *
   * Both lists change in one applyStore, so the post and the link to it are
   * written together and can never end up half-saved.
   */
  function handlePromoteIdea(idea: Idea) {
    const post: Post = {
      id: nextId(posts),
      title: idea.title,
      // Defaults the user can change a moment later in the page that opens.
      platform: "Instagram",
      type: "Text",
      date: null,
      status: FIRST_STAGE,
      // The scribbles follow the idea into the post, so nothing is retyped.
      // They land in the caption, which is where a post's free writing lives
      // now that the form has hooks, script and caption instead of notes.
      caption: idea.notes,
    }

    applyStore({
      posts: [post, ...store.posts],
      ideas: store.ideas.map((candidate) =>
        candidate.id === idea.id ? { ...candidate, postId: post.id } : candidate,
      ),
    })

    // Land straight in the editor page — that is the point of promoting.
    setEditor({ mode: "edit", post })
  }

  /** Steps the calendar back or forward, keeping the year in step. */
  function stepMonth(amount: number) {
    setMonth((current) => addMonths(current.year, current.month, amount))
  }

  function goToToday() {
    const today = parseISO(todayISO())!
    setMonth({ year: today.year, month: today.month })
  }

  /** Moves the calendar to whichever month a post was given. */
  function jumpToPost(post: Post) {
    if (post.date === null || !isValidISO(post.date)) return
    const parts = parseISO(post.date)!
    setMonth({ year: parts.year, month: parts.month })
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar view={view} onNavigate={navigate} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/*
          Shown for both branches, because a failed write is the one thing the
          reader needs to know about no matter which page they are on.
        */}
        {saveFailed && (
          <p
            role="alert"
            className="bg-clay/15 px-5 py-2.5 text-xs text-clay md:px-8"
          >
            This change has not been saved — the browser's storage is full or
            unavailable. Remove a cover image or a post and it will write again
            on the next change.
          </p>
        )}

        {/*
          The editor is a page, so it takes the place of the header and the
          main content rather than sitting on top of them the way a dialog did.

          The sidebar stays where it is, and `view` is deliberately left alone
          while editing: it still points at the page you came from, so the
          highlight reads true and clicking any of them is a way to leave.
        */}
        {editor !== null ? (
          <PostEditor
            // Passing the post is what puts the page into edit mode.
            post={editor.mode === "edit" ? editor.post : undefined}
            onSave={handleSaveEditor}
            onCancel={dismissEditor}
            onDirtyChange={setEditorDirty}
          />
        ) : (
          <>
            <Header onNewPost={openCreate} />

            <main
              className="flex flex-1 flex-col gap-4 px-5 py-6 md:gap-6
                md:px-8 md:py-8"
            >
              {view === "plan" && (
                <>
                  <SummaryCards posts={posts} />

                  <PlanBoard
                    posts={posts}
                    onSelect={openEdit}
                    onMoveDate={handleMoveDate}
                    onMoveStatus={handleMoveStatus}
                  />
                </>
              )}

              {view === "calendar" && (
                <>
                  <Calendar
                    month={month}
                    posts={posts}
                    onPrevious={() => stepMonth(-1)}
                    onNext={() => stepMonth(1)}
                    onToday={goToToday}
                    onSelectPost={openEdit}
                  />

                  <PostList
                    posts={posts}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    onShowInCalendar={jumpToPost}
                  />
                </>
              )}

              {view === "ideas" && (
                <Ideas
                  ideas={ideas}
                  posts={posts}
                  onNew={openNewIdea}
                  onEdit={openEditIdea}
                  onDelete={handleDeleteIdea}
                  onPromote={handlePromoteIdea}
                  onOpenPost={openEdit}
                />
              )}
            </main>
          </>
        )}
      </div>

      {/*
        The idea dialog still rides over the page — it is short, and it belongs
        to a specific card rather than taking over the screen. The state says
        which one, or neither: when it is null the dialog stays unmounted, so
        each open starts with a fresh form.
      */}
      {ideaModal !== null && (
        <IdeaDialog
          // Passing the idea is what puts the short form into edit mode.
          idea={ideaModal.mode === "editIdea" ? ideaModal.idea : undefined}
          onSave={handleSaveIdea}
          onCancel={closeIdeaModal}
        />
      )}
    </div>
  )
}

export default App
