
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Feed from './pages/Feed';
import Explore from './pages/Explore';
import Create from './pages/Create';
import Inbox from './pages/Inbox';
import Profile from './pages/Profile';
import AIStudio from './pages/AIStudio';
import Market from './pages/Market';
import FriendsNearby from './pages/FriendsNearby';
import ChessArena from './pages/ChessArena';
import Newsroom from './pages/Newsroom';
import Vault from './pages/Vault';
import Auth from './pages/Auth';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import Notifications from './pages/Notifications';
import Wallet from './pages/Wallet';
import AIBuddy from './pages/AIBuddy';
import Blueprint from './pages/Blueprint';
import Community from './pages/Community';
import Ports from './pages/Ports';
import Charter from './pages/Charter';
import SovereignStocks from './pages/SovereignStocks';
import DigitalIdentity from './pages/DigitalIdentity';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const currentUser = authService.getCurrentUser();

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        {/* المسارات المتاحة للجميع */}
        <Route path="/charter" element={<Charter />} />

        {/* المسارات المشروطة بتسجيل الدخول */}
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
                  <Route path="/newsroom" element={<Newsroom />} />
                  <Route path="/vault" element={<Vault />} />
                  <Route path="/ai-studio" element={<AIStudio />} />
                  <Route path="/wallet" element={<Wallet />} />
                  <Route path="/stocks" element={<SovereignStocks />} />
                  <Route path="/identity" element={<DigitalIdentity />} />
                  <Route path="/ai-buddy" element={<AIBuddy />} />
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
    </Router>
  );
};

export default App;
