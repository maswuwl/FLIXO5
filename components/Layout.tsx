
import React, { useState, useEffect } from 'react';
import { Home, Plus, X, Brain, Wallet, ShieldCheck, Newspaper, LayoutDashboard, TrendingUp, BadgeCheck, Search, Bell, Sparkles, UserCircle, Zap, ShoppingBag, Radar, Cable, Scale, MessageCircle, Cpu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import GlobalSearch from './GlobalSearch';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutComponent: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(true);
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    const handleUpdate = () => setCurrentUser(authService.getCurrentUser());
    window.addEventListener('userUpdate', handleUpdate);
    return () => window.removeEventListener('userUpdate', handleUpdate);
  }, []);

  const isAdmin = currentUser?.celebrityTier === 0;

  const menuItems = [
    { label: 'المخطط السيادي', icon: <Scale size={20} />, path: '/blueprint', color: 'text-pink-400' },
    { label: 'بورصة فليكسو', icon: <TrendingUp size={20} />, path: '/stocks', color: 'text-purple-400' },
    { label: 'الهوية الضوئية', icon: <BadgeCheck size={20} />, path: '/identity', color: 'text-pink-500' },
    { label: 'مختبر الأكواد', icon: <Brain size={20} />, path: '/ai-studio', color: 'text-indigo-400' },
    { label: 'خزنة FX', icon: <Wallet size={20} />, path: '/wallet', color: 'text-pink-600' },
    { label: 'غرفة الأخبار', icon: <Newspaper size={20} />, path: '/newsroom', color: 'text-red-400' },
    { label: 'بوابات العبور', icon: <Cable size={20} />, path: '/ports', color: 'text-cyan-400' },
  ];

  return (
    <div className="relative h-screen flex flex-col overflow-hidden bg-transparent" dir="rtl">
      
      {/* Header */}
      <header className="h-24 flex items-center justify-between px-8 z-[100] relative bg-black/20 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center space-x-4 space-x-reverse">
          <button onClick={() => setIsMenuOpen(true)} className="w-12 h-12 glass-order4 rounded-2xl flex items-center justify-center active-tap border border-white/10">
            <LayoutDashboard size={24} className="text-pink-400" />
          </button>
          <button onClick={() => navigate('/nearby')} className="w-12 h-12 glass-order4 rounded-2xl flex items-center justify-center text-indigo-400 active-tap border border-white/10">
            <Radar size={22} className="animate-pulse-vibe" />
          </button>
        </div>
        
        <div className="flex items-center space-x-3 space-x-reverse cursor-pointer active-tap group" onClick={() => navigate('/')}>
          <div className="w-11 h-11 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.4)] group-hover:rotate-12 transition-all">
            <span className="text-white font-black text-xl">FX</span>
          </div>
          <h1 className="text-3xl font-black italic flixo-text-gradient tracking-tighter">FLIXO</h1>
        </div>

        <div className="flex items-center space-x-4 space-x-reverse">
          <GlobalSearch />
          <button 
            onClick={() => { navigate('/notifications'); setHasNewNotification(false); }} 
            className="relative w-12 h-12 glass-order4 rounded-2xl flex items-center justify-center text-gray-400 active-tap border border-white/10"
          >
            <Bell size={24} className={hasNewNotification ? 'animate-insane text-pink-500' : 'animate-gentle'} />
            {hasNewNotification && <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-black animate-ping"></div>}
          </button>
          <div onClick={() => navigate('/profile')} className={`w-12 h-12 rounded-2xl border-2 p-0.5 cursor-pointer active-tap ${isAdmin ? 'border-pink-500' : 'border-white/10'}`}>
            <img src={currentUser?.avatar} className="w-full h-full rounded-xl object-cover" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden">
        {children}
      </main>

      {/* Messenger Style Chat Bubble (Icon in Icon) */}
      <div className="fixed bottom-32 left-8 z-[150] flex flex-col items-center">
        {isChatOpen && (
          <div className="mb-4 bg-black/80 backdrop-blur-2xl border border-pink-500/20 rounded-[2.5rem] p-3 flex flex-col space-y-3 shadow-2xl animate-fade-in w-48">
             <button onClick={() => { navigate('/ai-buddy'); setIsChatOpen(false); }} className="flex items-center space-x-3 space-x-reverse p-3 hover:bg-white/5 rounded-2xl transition-all">
                <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400"><Cpu size={18} /></div>
                <span className="text-[10px] font-black text-white">خبير فليكسو</span>
             </button>
             <button onClick={() => { navigate('/inbox'); setIsChatOpen(false); }} className="flex items-center space-x-3 space-x-reverse p-3 hover:bg-white/5 rounded-2xl transition-all">
                <div className="w-10 h-10 bg-pink-600/20 rounded-xl flex items-center justify-center text-pink-400"><MessageCircle size={18} /></div>
                <span className="text-[10px] font-black text-white">الرسائل</span>
             </button>
          </div>
        )}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(236,72,153,0.5)] active-tap border-2 border-white/20 ${isChatOpen ? 'bg-white text-black' : 'bg-pink-500 text-white animate-bounce'}`}
        >
          <MessageCircle size={32} />
          {/* الأيقونة المدمجة (Messenger Style) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <Zap size={12} fill="currentColor" className={`transition-all duration-500 ${isChatOpen ? 'scale-0' : 'scale-100 opacity-60'}`} />
          </div>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-[340px] glass-order4 z-[120] transition-transform duration-700 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} border-r border-pink-500/20`}>
        <div className="p-10 flex flex-col h-full">
          <div className="flex justify-between items-center mb-10">
            <span className="text-[10px] font-black uppercase text-pink-500 tracking-widest flex items-center"><Sparkles size={14} className="ml-2" /> Sovereign Menu</span>
            <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
          </div>

          <nav className="space-y-1 flex-1 overflow-y-auto no-scrollbar">
            {menuItems.map((item, idx) => (
              <button 
                key={idx}
                onClick={() => { navigate(item.path); setIsMenuOpen(false); }}
                className="w-full flex items-center space-x-4 space-x-reverse p-4 rounded-2xl hover:bg-white/5 transition-all group active-tap"
              >
                <div className={`${item.color} p-2 bg-white/5 rounded-xl`}>{item.icon}</div>
                <span className="text-sm font-bold text-gray-400 group-hover:text-white">{item.label}</span>
              </button>
            ))}
          </nav>

          <button onClick={() => authService.logout()} className="mt-6 w-full py-4 rounded-2xl bg-red-500/10 text-red-500 font-black text-xs uppercase tracking-widest active-tap">End Session</button>
        </div>
      </aside>

      {/* Bottom Nav */}
      <div className="fixed bottom-10 left-0 right-0 flex justify-center z-[110] px-6">
        <nav className="h-20 glass-order4 rounded-[2.5rem] border border-pink-500/20 flex items-center justify-between px-6 shadow-2xl w-full max-w-lg">
          {[
            { id: '/', icon: <Home size={24} /> },
            { id: '/market', icon: <ShoppingBag size={24} /> },
            { id: '/create', icon: <Plus size={32} />, special: true },
            { id: '/inbox', icon: <MessageCircle size={24} /> },
            { id: '/profile', icon: <UserCircle size={24} /> }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`p-4 transition-all active-tap ${item.special ? '-mt-16 bg-pink-500 text-white rounded-[2rem] shadow-2xl scale-110' : location.pathname === item.id ? 'text-pink-400' : 'text-gray-500 hover:text-white'}`}
            >
              {item.icon}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default LayoutComponent;
