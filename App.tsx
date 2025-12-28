
import React from 'react';
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

const ComingSoon = () => (
  <div className="h-full flex flex-col items-center justify-center p-10 text-center bg-black">
    <div className="w-20 h-20 flixo-gradient rounded-3xl flex items-center justify-center mb-6 animate-pulse">
      <span className="text-white font-black text-4xl">!</span>
    </div>
    <h2 className="text-2xl font-black italic mb-2">قريباً جداً</h2>
    <p className="text-gray-500 text-sm">هذه الميزة في مرحلة التطوير النهائي بمختبرات فليكسو.</p>
    <button onClick={() => window.history.back()} className="mt-8 text-pink-500 font-black uppercase tracking-widest text-xs">العودة</button>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/create" element={<Create />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/nearby" element={<FriendsNearby />} />
          <Route path="/chess" element={<ChessArena />} />
          <Route path="/newsroom" element={<Newsroom />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/ai-studio" element={<AIStudio />} />
          <Route path="/market" element={<Market />} />
          <Route path="/settings" element={<ComingSoon />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
