import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingFallback from './components/LoadingFallback';
import './App.css';

// Route-based code splitting using React.lazy()
const Home = lazy(() => import('./pages/Home'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));

// Supplementary Problem 1: Lazy loaded heavy modal component
const AnalyticsModal = lazy(() => import('./components/AnalyticsModal'));

function App() {
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar onOpenAnalytics={() => setIsAnalyticsOpen(true)} />

        <main className="main-content">
          {/* Suspense wrapper with meaningful fallback UI */}
          <Suspense fallback={<LoadingFallback message="Loading requested route chunk asynchronously..." />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Suspense>

          {/* Lazy loaded heavy analytics modal */}
          {isAnalyticsOpen && (
            <Suspense fallback={<LoadingFallback message="Loading heavy Analytics visualization chunk..." />}>
              <AnalyticsModal isOpen={isAnalyticsOpen} onClose={() => setIsAnalyticsOpen(false)} />
            </Suspense>
          )}
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
