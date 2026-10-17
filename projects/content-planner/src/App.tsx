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
  App owns the posts. Everything below it receives posts as a prop and
  re-renders when they change, which is why the list and the four count cards
  update the instant a post is saved.

  Two pieces of state:
    posts   the real list, starting as the example data
    isOpen  whether the modal is on screen

  Still React state only — a refresh brings the example data back, because
  nothing is written to the browser yet.
*/
function App() {
  const [posts, setPosts] = useState<Post[]>(examplePosts)
  const [isOpen, setIsOpen] = useState(false)

  /** Builds a Post from the form values and prepends it to the list. */
  function handleSave(draft: DraftPost) {
    // The highest existing id, plus one. Good enough while ids are just numbers.
    const nextId = Math.max(...posts.map((post) => post.id)) + 1

    // The weekly board only shows 17–23 March. Anything outside it, or with no
    // date at all, gets -1 and simply doesn't appear there.
    const day = toWeekDay(draft.dateInput)

    const newPost: Post = {
      id: nextId,
      title: draft.title,
      platform: draft.platform,
      type: draft.type,
      // The modal already turned the raw input into "Mar 18" for us.
      date: draft.dateInput ? toReadableDate(draft.dateInput) : "Unscheduled",
      status: draft.status,
      day,
      notes: draft.notes,
    }

    setPosts((current) => [newPost, ...current])
    setIsOpen(false)
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onNewPost={() => setIsOpen(true)} />

        <main
          className="flex flex-1 flex-col gap-4 px-5 py-6 md:gap-6
            md:px-8 md:py-8"
        >
          <SummaryCards posts={posts} />
          <WeeklySchedule posts={posts} />
          <PostList posts={posts} />
        </main>
      </div>

      {isOpen && (
        <NewPostModal
          onSave={handleSave}
          onCancel={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default App
