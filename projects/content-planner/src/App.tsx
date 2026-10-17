import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import SummaryCards from "./components/SummaryCards"
import PostList from "./components/PostList"
import WeeklySchedule from "./components/WeeklySchedule"
import NewPostModal from "./components/NewPostModal"
import type { DraftPost } from "./components/NewPostModal"
import { posts as examplePosts } from "./data"
import { toReadableDate, toWeekDay } from "./dates"
import type { Post } from "./types"

/*
  What the dialog is currently doing. One state instead of a separate
  "is open" flag and "which post" value, so the two can never disagree.

    null        the dialog is closed
    { create }  adding a brand new post
    { edit, post }  changing a post that already exists
*/
type Modal = { mode: "create" } | { mode: "edit"; post: Post } | null

/*
  App owns the posts. Everything below it receives posts as a prop and
  re-renders when they change, which is why the list and the four count cards
  update the instant a post is saved or deleted.

  Two pieces of state:
    posts   the real list, starting as the example data
    modal   what the dialog is doing, or null when it's closed

  Still React state only — a refresh brings the example data back, because
  nothing is written to the browser yet.
*/
function App() {
  const [posts, setPosts] = useState<Post[]>(examplePosts)
  const [modal, setModal] = useState<Modal>(null)

  function closeModal() {
    setModal(null)
  }

  /** Turns the form values into the fields a Post stores. */
  function postFromDraft(draft: DraftPost, id: number): Post {
    return {
      id,
      title: draft.title,
      platform: draft.platform,
      type: draft.type,
      date: draft.dateInput ? toReadableDate(draft.dateInput) : "Unscheduled",
      status: draft.status,
      // The weekly board only shows 17–23 March. Anything outside it, or with
      // no date at all, gets -1 and simply doesn't appear there.
      day: toWeekDay(draft.dateInput),
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
      // The highest existing id, plus one.
      const nextId = Math.max(...posts.map((post) => post.id)) + 1
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

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onNewPost={() => setModal({ mode: "create" })} />

        <main
          className="flex flex-1 flex-col gap-4 px-5 py-6 md:gap-6
            md:px-8 md:py-8"
        >
          <SummaryCards posts={posts} />
          <WeeklySchedule posts={posts} />
          <PostList
            posts={posts}
            onEdit={(post) => setModal({ mode: "edit", post })}
            onDelete={handleDelete}
          />
        </main>
      </div>

      {modal && (
        <NewPostModal
          // Passing the post is what puts the form into edit mode.
          post={modal.mode === "edit" ? modal.post : undefined}
          onSave={handleSave}
          onCancel={closeModal}
        />
      )}
    </div>
  )
}

export default App
