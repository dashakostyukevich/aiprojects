import { Route, Routes } from 'react-router-dom'
import NavRow from './components/NavRow.jsx'
import RouteFallback from './components/RouteFallback.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import Home from './pages/Home.jsx'
import CaseStudy from './pages/CaseStudy.jsx'
import NotFound from './pages/NotFound.jsx'
import useHashScroll from './hooks/useHashScroll.js'

export default function App() {
  // Nav lives here rather than inside each page, because it is fixed: a fixed
  // element is positioned against the viewport, so one rendered per page would
  // mean several bars stacked on top of each other, and three pages each
  // restyling their own would drift apart. One instance in the layout is the
  // only way "the nav looks the same everywhere" is true by construction rather
  // than by three copies agreeing.
  useHashScroll()

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* The bar paints the page background and carries the one hairline, so
          content passing beneath it reads as passing beneath something. Height
          comes from --nav-h, the same token `nav-offset` and
          `scroll-padding-top` use, so the three cannot disagree. */}
      <header className="nav-bar">
        <NavRow className="h-full px-4 sm:px-14 lg:px-16" />
      </header>

      <div className="flex-1">
        {/* A render error in any page now resolves to a recoverable state
            instead of a blank document. */}
        <RouteFallback>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work/:slug" element={<CaseStudy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </RouteFallback>
      </div>
      <SiteFooter />
    </div>
  )
}
