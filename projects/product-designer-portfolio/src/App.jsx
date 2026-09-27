import { Route, Routes } from 'react-router-dom'
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
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<CaseStudy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <SiteFooter />
    </div>
  )
}
