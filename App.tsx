
import React, { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { authService } from './services/authService';
import { Sparkles } from 'lucide-react';

const Feed = lazy(() => import('./pages/Feed'));
const Profile = lazy(() => import('./pages/Profile'));
const Inbox = lazy(() => import('./pages/Inbox'));
const Market = lazy(() => import('./pages/Market'));
const Groups = lazy(() => import('./pages/Groups'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Auth = lazy(() => import('./pages/Auth'));
const Settings = lazy(() => import('./pages/Settings'));
const AIStudio = lazy(() => import('./pages/AIStudio'));

const SovereignLoader = () => (
  <div className="h-screen w-full bg-[#050208] flex flex-col items-center justify-center space-y-6">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Sparkles size={24} className="text-indigo-500 animate-pulse" />
      </div>
    </div>
    <h2 className="text-xl font-black italic text-white tracking-widest uppercase">FLIXO OS</h2>
  </div>
);

const App: React.FC = () => {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <Router>
      <Suspense fallback={<SovereignLoader />}>
        <Routes>
          {!isAuthenticated ? (
            <Route path="*" element={<Auth onLoginSuccess={() => window.location.reload()} />} />
          ) : (
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Feed />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/inbox" element={<Inbox />} />
                    <Route path="/market" element={<Market />} />
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/ai-studio" element={<AIStudio />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              }
            />
          )}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
