import { useEffect, useState } from "react"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import SummaryCards from "./components/SummaryCards"
import PostList from "./components/PostList"
import Calendar from "./components/Calendar"
import Ideas from "./components/Ideas"
import NewPostModal from "./components/NewPostModal"
import type { DraftPost } from "./components/NewPostModal"
import { posts as examplePosts } from "./data"
import { addMonths, isValidISO, parseISO, todayISO } from "./dates"
import { loadPosts, savePosts } from "./storage"
import type { Post, View } from "./types"

/*
  What the dialog is currently doing. One state instead of a separate
  "is open" flag and "which post" value, so the two can never disagree.

    null        the dialog is closed
    { create }  adding a brand new post, optionally with a head start
                (`preset` sets fields, `createHeading` renames the dialog)
    { edit, post }  changing a post that already exists
*/
type Modal =
  | { mode: "create"; preset?: Partial<DraftPost>; createHeading?: string }
  | { mode: "edit"; post: Post }
  | null

/*
  App owns the posts. Everything below it receives posts as a prop and
  re-renders when they change, which is why the list, the count cards and the
  calendar all update together.

  Four pieces of state:
    posts    read from the browser on startup
    modal    what the dialog is doing, or null when it's closed
    month    the year and month the calendar is showing
    view     which page is on screen — Overview or Ideas
*/
function App() {
  // The function form of useState runs once, on the first render, which is
  // what we want for reading storage. Passing the array directly would run it
  // on every render.
  const [posts, setPosts] = useState<Post[]>(() => loadPosts() ?? examplePosts)
  const [modal, setModal] = useState<Modal>(null)
  const [view, setView] = useState<View>("overview")

  // The calendar opens on the current month, read from the real clock.
  const [month, setMonth] = useState(() => {
    const today = parseISO(todayISO())!
    return { year: today.year, month: today.month }
  })

  // Runs after every render where `posts` is a different array. Create, edit,
  // delete and moving an idea to Draft all produce a new array, so all four
  // get saved without any of them knowing localStorage exists.
  useEffect(() => {
    savePosts(posts)
  }, [posts])

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
      // One more than the highest id so far. reduce starts at 0 rather than
      // at -Infinity, so the very first post gets id 1 even when the list is
      // empty — `Math.max(...[])` would have produced -Infinity here.
      const nextId =
        posts.reduce((highest, post) => Math.max(highest, post.id), 0) + 1
      setPosts((current) => [postFromDraft(draft, nextId), ...current])
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
   * Promotes an idea to Draft. A status change and nothing else — the post
   * keeps its id, date, notes and everything else, so it simply stops being an
   * idea and disappears from that page on the next render.
   */
  function handleMoveToDraft(post: Post) {
    setPosts((current) =>
      current.map((p) => (p.id === post.id ? { ...p, status: "Draft" } : p)),
    )
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
        <Header onNewPost={() => setModal({ mode: "create" })} />

        <main
          className="flex flex-1 flex-col gap-4 px-5 py-6 md:gap-6
            md:px-8 md:py-8"
        >
          {view === "overview" ? (
            <>
              <SummaryCards posts={posts} />

              <Calendar
                month={month}
                posts={posts}
                onPrevious={() => stepMonth(-1)}
                onNext={() => stepMonth(1)}
                onToday={goToToday}
                onSelectPost={(post) => setModal({ mode: "edit", post })}
              />

              <PostList
                posts={posts}
                onEdit={(post) => setModal({ mode: "edit", post })}
                onDelete={handleDelete}
                onShowInCalendar={jumpToPost}
              />
            </>
          ) : (
            <Ideas
              posts={posts}
              // An idea is a new post with the status already chosen. The
              // modal handles the rest, exactly as it does everywhere else.
              onNewIdea={() =>
                setModal({
                  mode: "create",
                  preset: { status: "Idea" },
                  createHeading: "New idea",
                })
              }
              onEdit={(post) => setModal({ mode: "edit", post })}
              onDelete={handleDelete}
              onMoveToDraft={handleMoveToDraft}
            />
          )}
        </main>
      </div>

      {modal && (
        <NewPostModal
          // Passing the post is what puts the form into edit mode.
          post={modal.mode === "edit" ? modal.post : undefined}
          // Only exists in create mode; both are ignored when editing.
          preset={modal.mode === "create" ? modal.preset : undefined}
          createHeading={
            modal.mode === "create" ? modal.createHeading : undefined
          }
          onSave={handleSave}
          onCancel={closeModal}
        />
      )}
    </div>
  )
}

export default App
