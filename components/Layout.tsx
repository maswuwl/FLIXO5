
import React, { useState, useEffect } from 'react';
import { Home, Plus, X, Brain, Wallet, ShieldCheck, Newspaper, LayoutDashboard, TrendingUp, BadgeCheck, Search, Bell, Sparkles, UserCircle, Zap, ShoppingBag, Radar, Cable, Scale, MessageCircle, Cpu, Sun, Moon, Wand2 } from 'lucide-react';
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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hasNewNotification, setHasNewNotification] = useState(true);
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    const handleUpdate = () => setCurrentUser(authService.getCurrentUser());
    window.addEventListener('userUpdate', handleUpdate);
    return () => window.removeEventListener('userUpdate', handleUpdate);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light-mode');
  };

  const menuItems = [
    { label: 'الخبير المشرف', icon: <Wand2 size={10} />, path: '/overseer', color: 'text-yellow-400' },
    { label: 'المخطط السيادي', icon: <Scale size={10} />, path: '/blueprint', color: 'text-pink-400' },
    { label: 'بورصة فليكسو', icon: <TrendingUp size={10} />, path: '/stocks', color: 'text-purple-400' },
    { label: 'الهوية الضوئية', icon: <BadgeCheck size={10} />, path: '/identity', color: 'text-pink-500' },
    { label: 'مختبر الأكواد', icon: <Brain size={10} />, path: '/ai-studio', color: 'text-indigo-400' },
    { label: 'غرفة الأخبار', icon: <Newspaper size={10} />, path: '/newsroom', color: 'text-red-400' },
  ];

  return (
    <div className={`relative h-screen flex flex-col overflow-hidden bg-transparent ${isDarkMode ? 'dark' : 'light'}`} dir="rtl">
      
      {/* Header - Compact */}
      <header className="h-12 flex items-center justify-between px-3 z-[100] relative bg-black/10 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center space-x-1.5 space-x-reverse">
          <button onClick={() => setIsMenuOpen(true)} className="w-7 h-7 glass-order4 rounded-lg flex items-center justify-center active-tap">
            <LayoutDashboard size={14} className="text-pink-400" />
          </button>
          <button onClick={() => navigate('/nearby')} className="w-7 h-7 glass-order4 rounded-lg flex items-center justify-center text-indigo-400 active-tap">
            <Radar size={12} className="animate-pulse" />
          </button>
        </div>
        
        <div className="flex items-center space-x-1.5 space-x-reverse cursor-pointer active-tap group" onClick={() => navigate('/')}>
          <div className="w-5 h-5 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:rotate-12 transition-all">
            <span className="text-white font-black text-[10px]">FX</span>
          </div>
          <h1 className="text-lg font-black italic flixo-text-gradient tracking-tighter">FLIXO</h1>
        </div>

        <div className="flex items-center space-x-1.5 space-x-reverse">
          <GlobalSearch />
          <button onClick={() => navigate('/notifications')} className="w-7 h-7 glass-order4 rounded-lg flex items-center justify-center text-gray-400 active-tap">
            <Bell size={14} className={hasNewNotification ? 'text-pink-500 animate-bounce' : ''} />
          </button>
          <div onClick={() => navigate('/profile')} className="w-7 h-7 rounded-lg border border-pink-500/20 p-0.5 cursor-pointer active-tap overflow-hidden">
            <img src={currentUser?.avatar} className="w-full h-full rounded-md object-cover" />
          </div>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden">
        {children}
      </main>

      {/* Floating Messenger (Left Side) - Compact */}
      <div className="fixed bottom-20 left-4 z-[150] flex flex-col items-center">
        {isChatOpen && (
          <div className="mb-2 bg-black/80 backdrop-blur-2xl border border-pink-500/20 rounded-xl p-1.5 flex flex-col space-y-1 shadow-2xl animate-fade-in w-24">
             <button onClick={() => navigate('/ai-buddy')} className="flex items-center space-x-1.5 space-x-reverse p-1.5 hover:bg-white/5 rounded-lg">
                <Cpu size={10} className="text-indigo-400" />
                <span className="text-[7px] font-black text-white">الخبير</span>
             </button>
             <button onClick={() => navigate('/inbox')} className="flex items-center space-x-1.5 space-x-reverse p-1.5 hover:bg-white/5 rounded-lg">
                <MessageCircle size={10} className="text-pink-400" />
                <span className="text-[7px] font-black text-white">الرسائل</span>
             </button>
          </div>
        )}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg active-tap border border-white/20">
          <MessageCircle size={14} />
        </button>
      </div>

      {/* Floating Overseer Quick Access (Right Side) - NEW FEATURE */}
      <div className="fixed bottom-20 right-4 z-[150] flex flex-col items-center">
         <button 
           onClick={() => navigate('/overseer')} 
           className="w-8 h-8 rounded-full bg-yellow-500 text-black flex items-center justify-center shadow-lg active-tap border border-black/10 relative"
         >
           <Wand2 size={14} />
           <div className="absolute inset-0 rounded-full border-2 border-yellow-400 animate-ping opacity-20"></div>
         </button>
      </div>

      {/* Sidebar - Compact Menu */}
      <aside className={`fixed top-0 left-0 h-full w-[200px] glass-order4 z-[120] transition-transform duration-500 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[7px] font-black uppercase text-pink-500 tracking-widest">Sovereign Menu</span>
            <button onClick={() => setIsMenuOpen(false)} className="w-5 h-5 bg-white/5 rounded-lg flex items-center justify-center text-gray-500"><X size={12} /></button>
          </div>

          <nav className="space-y-0.5 flex-1 overflow-y-auto no-scrollbar">
            {menuItems.map((item, idx) => (
              <button key={idx} onClick={() => { navigate(item.path); setIsMenuOpen(false); }} className="w-full flex items-center space-x-2 space-x-reverse p-2 rounded-lg hover:bg-white/5 transition-all group">
                <div className={`${item.color} p-1 bg-white/5 rounded-md`}>{item.icon}</div>
                <span className="text-[10px] font-bold">{item.label}</span>
              </button>
            ))}

            <div className="pt-2 mt-2 border-t border-white/5">
                <button 
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 active-tap"
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {isDarkMode ? <Sun size={12} className="text-yellow-500" /> : <Moon size={12} className="text-indigo-400" />}
                    <span className="text-[10px] font-black">{isDarkMode ? 'الوضع المشمس' : 'الوضع المظلم'}</span>
                  </div>
                  <div className={`w-6 h-3 rounded-full relative transition-all ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-400'}`}>
                    <div className={`absolute top-0.5 w-2 h-2 bg-white rounded-full transition-all ${isDarkMode ? 'right-3.5' : 'right-0.5'}`}></div>
                  </div>
                </button>
            </div>
          </nav>

          <button onClick={() => authService.logout()} className="mt-2 w-full py-2 rounded-lg bg-red-500/10 text-red-500 font-black text-[7px] uppercase tracking-widest active-tap">تسجيل خروج</button>
        </div>
      </aside>

      {/* Bottom Nav - Compact */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center z-[110] px-3">
        <nav className="h-10 glass-order4 rounded-2xl flex items-center justify-between px-3 shadow-xl w-full max-w-xs">
          {[
            { id: '/', icon: <Home size={12} /> },
            { id: '/market', icon: <ShoppingBag size={12} /> },
            { id: '/create', icon: <Plus size={14} />, special: true },
            { id: '/inbox', icon: <MessageCircle size={12} /> },
            { id: '/profile', icon: <UserCircle size={12} /> }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`p-2 transition-all active-tap ${item.special ? '-mt-6 bg-pink-500 text-white rounded-xl shadow-lg' : location.pathname === item.id ? 'text-pink-400' : 'text-gray-500'}`}
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
