import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import SummaryCards from "./components/SummaryCards"
import PostList from "./components/PostList"
import WeeklySchedule from "./components/WeeklySchedule"
import { posts } from "./data"

/*
  App is the layout: it decides what sits next to what, and passes the sample
  posts down to the components that need them. The sidebar scrolls on its own
  on desktop so the page stays tidy on a tall screen.
*/
function App() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main
          className="flex flex-1 flex-col gap-4 px-5 py-6 md:gap-6
            md:px-8 md:py-8"
        >
          <SummaryCards />
          <WeeklySchedule />
          <PostList posts={posts} />
        </main>
      </div>
    </div>
  )
}

export default App
