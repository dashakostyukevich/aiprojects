import { useEffect, useState } from "react"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import SummaryCards from "./components/SummaryCards"
import PostList from "./components/PostList"
import Calendar from "./components/Calendar"
import PlanBoard from "./components/PlanBoard"
import Ideas from "./components/Ideas"
import NewPostModal from "./components/NewPostModal"
import type { DraftPost } from "./components/NewPostModal"
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
  What a dialog is currently doing. One state instead of a separate "is open"
  flag and "which record" value, so the two can never disagree.

    null                both dialogs are closed
    { create }          adding a brand new post
    { edit, post }      changing a post that already exists
    { newIdea }         adding a brand new idea
    { editIdea, idea }  changing an idea that already exists

  Posts and ideas have separate modes because they have separate forms: the
  long one and the short one.
*/
type Modal =
  | { mode: "create" }
  | { mode: "edit"; post: Post }
  | { mode: "newIdea" }
  | { mode: "editIdea"; idea: Idea }
  | null

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

  Five pieces of state:
    store    both lists, read from the browser on startup
    modal    what a dialog is doing, or null when they are closed
    month    the year and month the calendar page is showing
    view     which page is on screen — Plan, Calendar or Ideas
*/
function App() {
  // The function form of useState runs once, on the first render, which is
  // what we want for reading storage. Passing the object directly would run it
  // on every render.
  const [store, setStore] = useState<Store>(
    () => loadStore() ?? { posts: examplePosts, ideas: exampleIdeas },
  )
  const [modal, setModal] = useState<Modal>(null)
  const [view, setView] = useState<View>("plan")

  const { posts, ideas } = store

  // The calendar opens on the current month, read from the real clock.
  const [month, setMonth] = useState(() => {
    const today = parseISO(todayISO())!
    return { year: today.year, month: today.month }
  })

  // Updates the posts and leaves the ideas exactly as they are. A wrapper
  // rather than a second piece of state, because both lists have to be saved
  // together — two states would mean two saves that could fall out of step.
  function setPosts(update: (posts: Post[]) => Post[]) {
    setStore((current) => ({ ...current, posts: update(current.posts) }))
  }

  /** Updates the ideas and leaves the posts exactly as they are. */
  function setIdeas(update: (ideas: Idea[]) => Idea[]) {
    setStore((current) => ({ ...current, ideas: update(current.ideas) }))
  }

  // Runs after every render where `store` is a different object. Creating,
  // editing, deleting, dragging and promoting all produce a new one, so all of
  // them get saved without any of them knowing localStorage exists.
  useEffect(() => {
    saveStore(store)
  }, [store])

  function closeModal() {
    setModal(null)
  }

  /** Turns the form values into a post. */
  function postFromDraft(draft: DraftPost, id: number): Post {
    return {
      id,
      title: draft.title,
      platform: draft.platform,
      type: draft.type,
      // The date input already speaks "YYYY-MM-DD", so it is stored as-is.
      // No date at all means null, which keeps the post off the calendar.
      date: draft.dateInput === "" ? null : draft.dateInput,
      status: draft.status,
      notes: draft.notes,
    }
  }

  /**
   * One save handler for both modes. The `modal` state says which it is:
   * editing swaps the post with the same id, creating adds a new one.
   */
  function handleSave(draft: DraftPost) {
    if (modal?.mode === "edit") {
      const updated = postFromDraft(draft, modal.post.id)
      setPosts((current) =>
        current.map((post) => (post.id === updated.id ? updated : post)),
      )
    } else {
      setPosts((current) => [postFromDraft(draft, nextId(posts)), ...current])
    }

    closeModal()
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
   * nothing else — it keeps its id, date and notes, and simply appears in a
   * different column on the next render.
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

  /** Opens the long form to add a post. */
  function openCreate() {
    setModal({ mode: "create" })
  }

  /** Opens the long form on a post that already exists. */
  function openEdit(post: Post) {
    setModal({ mode: "edit", post })
  }

  /** Opens the short form to add an idea. */
  function openNewIdea() {
    setModal({ mode: "newIdea" })
  }

  /** Opens the short form on an idea that already exists. */
  function openEditIdea(idea: Idea) {
    setModal({ mode: "editIdea", idea })
  }

  /** One save handler for both modes of the idea dialog. */
  function handleSaveIdea(draft: DraftIdea) {
    if (modal?.mode === "editIdea") {
      const updated: Idea = {
        ...modal.idea,
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

    closeModal()
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
   * Both lists change in one setStore, so the post and the link to it are
   * written together and can never end up half-saved.
   */
  function handlePromoteIdea(idea: Idea) {
    const post: Post = {
      id: nextId(posts),
      title: idea.title,
      // Defaults the user can change a moment later in the form that opens.
      platform: "Instagram",
      type: "Text",
      date: null,
      status: FIRST_STAGE,
      // The scribbles follow the idea into the post, so nothing is retyped.
      notes: idea.notes,
    }

    setStore((current) => ({
      posts: [post, ...current.posts],
      ideas: current.ideas.map((candidate) =>
        candidate.id === idea.id ? { ...candidate, postId: post.id } : candidate,
      ),
    }))

    // Land straight in the long form — that is the point of promoting.
    setModal({ mode: "edit", post })
  }

  /** Steps the calendar back or forward, keeping the year in step. */
  function stepMonth(amount: number) {
    setMonth((current) => addMonths(current.year, current.month, amount))
  }

  function goToToday() {
    const today = parseISO(todayISO())!
    setMonth({ year: today.year, month: today.month })
  }

  /** Opens a post's date in the editor. */
  function jumpToPost(post: Post) {
    if (post.date === null || !isValidISO(post.date)) return
    const parts = parseISO(post.date)!
    setMonth({ year: parts.year, month: parts.month })
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar view={view} onNavigate={setView} />

      <div className="flex min-w-0 flex-1 flex-col">
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
      </div>

      {/*
        Two dialogs, one per kind of thing. The modal state says which — or
        neither, when it is null and both stay unmounted, so each open starts
        with a fresh form.
      */}
      {modal !== null &&
        (modal.mode === "newIdea" || modal.mode === "editIdea" ? (
          <IdeaDialog
            // Passing the idea is what puts the short form into edit mode.
            idea={modal.mode === "editIdea" ? modal.idea : undefined}
            onSave={handleSaveIdea}
            onCancel={closeModal}
          />
        ) : (
          <NewPostModal
            // Passing the post is what puts the form into edit mode.
            post={modal.mode === "edit" ? modal.post : undefined}
            onSave={handleSave}
            onCancel={closeModal}
          />
        ))}
    </div>
  )
}

export default App
