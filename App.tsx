
import React, { useState, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { authService } from './services/authService';
import { Loader2, Sparkles } from 'lucide-react';

// التحميل الكسول للصفحات لتقليل حجم ملف الـ JS النهائي
const Feed = lazy(() => import('./pages/Feed'));
const Explore = lazy(() => import('./pages/Explore'));
const Create = lazy(() => import('./pages/Create'));
const Inbox = lazy(() => import('./pages/Inbox'));
const Profile = lazy(() => import('./pages/Profile'));
const AIStudio = lazy(() => import('./pages/AIStudio'));
const Market = lazy(() => import('./pages/Market'));
const FriendsNearby = lazy(() => import('./pages/FriendsNearby'));
const ChessArena = lazy(() => import('./pages/ChessArena'));
const Newsroom = lazy(() => import('./pages/Newsroom'));
const Vault = lazy(() => import('./pages/Vault'));
const Auth = lazy(() => import('./pages/Auth'));
const Settings = lazy(() => import('./pages/Settings'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Wallet = lazy(() => import('./pages/Wallet'));
const AIBuddy = lazy(() => import('./pages/AIBuddy'));
const Blueprint = lazy(() => import('./pages/Blueprint'));
const Community = lazy(() => import('./pages/Community'));
const Ports = lazy(() => import('./pages/Ports'));
const Charter = lazy(() => import('./pages/Charter'));
const SovereignStocks = lazy(() => import('./pages/SovereignStocks'));
const DigitalIdentity = lazy(() => import('./pages/DigitalIdentity'));
const OverseerExpert = lazy(() => import('./pages/OverseerExpert'));
const Groups = lazy(() => import('./pages/Groups'));

// واجهة الانتظار السيادية أثناء تحميل الحزم البرمجية
const SovereignLoader = () => (
  <div className="h-screen w-full bg-[#050208] flex flex-col items-center justify-center space-y-6">
    <div className="relative">
      <div className="w-24 h-24 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Sparkles size={32} className="text-pink-500 animate-pulse" />
      </div>
    </div>
    <div className="text-center space-y-2">
      <h2 className="text-xl font-black italic flixo-text-gradient tracking-widest">FLIXO</h2>
      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] animate-pulse">جاري استدعاء البيانات السيادية...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const currentUser = authService.getCurrentUser();

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Suspense fallback={<SovereignLoader />}>
        <Routes>
          {/* المسارات المتاحة للجميع */}
          <Route path="/charter" element={<Charter />} />

          {!isAuthenticated ? (
            <Route path="*" element={<Auth onLoginSuccess={handleLoginSuccess} />} />
          ) : (
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Feed />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/inbox" element={<Inbox />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/nearby" element={<FriendsNearby />} />
                    <Route path="/chess" element={<ChessArena />} />
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/newsroom" element={<Newsroom />} />
                    <Route path="/vault" element={<Vault />} />
                    <Route path="/ai-studio" element={<AIStudio />} />
                    <Route path="/wallet" element={<Wallet />} />
                    <Route path="/stocks" element={<SovereignStocks />} />
                    <Route path="/identity" element={<DigitalIdentity />} />
                    <Route path="/ai-buddy" element={<AIBuddy />} />
                    <Route path="/overseer" element={<OverseerExpert />} />
                    <Route path="/blueprint" element={<Blueprint />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/ports" element={<Ports />} />
                    <Route path="/market" element={<Market />} />
                    <Route path="/settings" element={<Settings />} />
                    {currentUser?.celebrityTier === 0 && (
                      <Route path="/admin" element={<AdminDashboard />} />
                    )}
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
