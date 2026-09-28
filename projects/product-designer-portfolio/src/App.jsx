import { Route, Routes } from 'react-router-dom'
import RouteFallback from './components/RouteFallback.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import Home from './pages/Home.jsx'
import CaseStudy from './pages/CaseStudy.jsx'
import NotFound from './pages/NotFound.jsx'
import useHashScroll from './hooks/useHashScroll.js'

export default function App() {
  // Nav lives inside each page's first screen rather than in a global header,
  // so scroll-on-route-change is handled here.
  useHashScroll()

  return (
    <div className="flex min-h-[100dvh] flex-col">
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
