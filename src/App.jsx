import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout & UI Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnimatedPreloader from './components/AnimatedPreloader';
import ScrollToTop from './components/ScrollToTop';
import Background from './components/Background';

// Page Components
import Home from './pages/Home';
import Sessions from './pages/Sessions';
import Achievements from './pages/Achievements';
import Researchers from './pages/Researchers';
import LeaderBoard from './pages/LeaderBoard';
// import JoinUs from './pages/JoinUs';
import JoinUsSuccess from './pages/JoinUsSuccess';
import Appointment from './pages/Appointment';
import OrganizationDetails from './pages/OrganizationDetails';
import StudentCV from './pages/StudentCV';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      <ScrollToTop />

      {/* Preloader Overlay */}
      <AnimatePresence mode="wait">
        {loading && (
          <AnimatedPreloader key="preloader" finishLoading={() => setLoading(false)} />
        )}
      </AnimatePresence>

      <div className={`min-h-screen transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {!loading && (
          <>
            <Background />
            <Navbar />

            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/researchers" element={<Researchers />} />
                <Route path="/leaderboard" element={<LeaderBoard />} />
                {/* <Route path="/join" element={<JoinUs />} /> */}
                <Route path="/join/success" element={<JoinUsSuccess />} />
                <Route path="/appointment" element={<Appointment />} />
                <Route path="/organization/:orgId" element={<OrganizationDetails />} />
                <Route path="/cv/:studentId" element={<StudentCV />} />
              </Routes >
            </AnimatePresence >

            <Footer />
          </>
        )
        }
      </div >
    </Router >
  );
}

export default App;
