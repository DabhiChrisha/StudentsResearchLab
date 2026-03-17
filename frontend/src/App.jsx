import { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout & UI Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnimatedPreloader from './components/AnimatedPreloader';
import ScrollToTop from './components/ScrollToTop';
import MobileDock from './components/MobileDock';


// Page Components (Lazy Loaded for Performance)
const Home = lazy(() => import('./pages/Home'));
const Sessions = lazy(() => import('./pages/Sessions'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Activities = lazy(() => import('./pages/Activities'));
const Researchers = lazy(() => import('./pages/Researchers'));
const LeaderBoard = lazy(() => import('./pages/LeaderBoard'));
const JoinUs = lazy(() => import('./pages/JoinUs'));
const JoinUsSuccess = lazy(() => import('./pages/JoinUsSuccess'));
const Appointment = lazy(() => import('./pages/Appointment'));
const OrganizationDetails = lazy(() => import('./pages/OrganizationDetails'));
const StudentCV = lazy(() => import('./pages/StudentCV'));
import PageTransitionWrapper from './components/PageTransitionWrapper';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      <AppContent loading={loading} setLoading={setLoading} />
    </Router>
  );
}

// Inner component to ensure useLocation works inside Router
function AppContent({ loading, setLoading }) {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />

      {/* Preloader Overlay */}
      <AnimatePresence mode="wait">
        {loading && (
          <AnimatedPreloader key="preloader" finishLoading={() => setLoading(false)} />
        )}
      </AnimatePresence>

      <div className={`h-screen w-full flex flex-col overflow-hidden bg-primary relative transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {!loading && (
          <>

            <Navbar />

            <div id="main-content" className="flex-1 w-full h-full overflow-y-scroll overflow-x-hidden relative z-10 pb-0 flex flex-col justify-between">
              <div className="flex-1 w-full flex flex-col">
              <Suspense fallback={
                <div className="w-full flex-1 flex items-center justify-center">
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 bg-amber-500/80 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2.5 h-2.5 bg-amber-500/80 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2.5 h-2.5 bg-amber-500/80 rounded-full animate-bounce"></div>
                  </div>
                </div>
              }>
                <AnimatePresence mode="wait">
                  <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<PageTransitionWrapper><Home /></PageTransitionWrapper>} />
                    <Route path="/sessions" element={<PageTransitionWrapper><Sessions /></PageTransitionWrapper>} />
                    <Route path="/achievements" element={<PageTransitionWrapper><Achievements /></PageTransitionWrapper>} />
                    <Route path="/activities" element={<PageTransitionWrapper><Activities /></PageTransitionWrapper>} />
                    <Route path="/researchers" element={<PageTransitionWrapper><Researchers /></PageTransitionWrapper>} />
                    <Route path="/leaderboard" element={<PageTransitionWrapper><LeaderBoard /></PageTransitionWrapper>} />
                    <Route path="/join" element={<PageTransitionWrapper><JoinUs /></PageTransitionWrapper>} />
                    <Route path="/join/success" element={<PageTransitionWrapper><JoinUsSuccess /></PageTransitionWrapper>} />
                    <Route path="/appointment" element={<PageTransitionWrapper><Appointment /></PageTransitionWrapper>} />
                    <Route path="/organization/:orgId" element={<PageTransitionWrapper><OrganizationDetails /></PageTransitionWrapper>} />
                    <Route path="/cv/:studentId" element={<PageTransitionWrapper><StudentCV /></PageTransitionWrapper>} />
                  </Routes>
                </AnimatePresence>
              </Suspense>
              </div>

              <div className="mt-auto w-full">
                <Footer />
              </div>
            </div>

            <MobileDock />
          </>
        )}
      </div>
    </>
  );
}

export default App;
