
import React, { useState, useEffect } from 'react';
import { Home, Compass, Plus, MessageCircle, User, Menu, X, ShoppingBag, Brain, Radar, Gamepad2, Newspaper, ShieldCheck, Sun, Moon, LogOut, Settings, LayoutDashboard, Wallet, Mic, Layout, Users, Cable, Scale, BarChart4, Contact2, TrendingUp, IdCard, BadgeCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppDownloadBanner from './AppDownloadBanner';
import { authService } from '../services/authService';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutComponent: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    const handleUpdate = () => {
      setCurrentUser(authService.getCurrentUser());
    };
    window.addEventListener('userUpdate', handleUpdate);
    return () => window.removeEventListener('userUpdate', handleUpdate);
  }, []);

  const isActive = (path: string) => currentPath === path;
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light-mode');
  };

  const handleLogout = () => {
    authService.logout();
  };

  const menuItems = [
    { label: 'المخطط السيادي', icon: <Layout size={20} />, path: '/blueprint', special: 'blueprint' },
    { label: 'بورصة فليكسو', icon: <TrendingUp size={20} />, path: '/stocks', special: 'stocks' },
    { label: 'الهوية السيادية', icon: <BadgeCheck size={20} />, path: '/identity', special: 'identity' },
    { label: 'خبير فليكسو الشامل', icon: <Brain size={20} />, path: '/ai-studio', special: 'universal-ai' },
    { label: 'مجتمع فليكسو', icon: <Users size={20} />, path: '/community', special: 'community' },
    { label: 'المحفظة السيادية', icon: <Wallet size={20} />, path: '/wallet', special: 'wallet' },
    { label: 'بوابات العبور (API)', icon: <Cable size={20} />, path: '/ports' },
    { label: 'ميثاق السيادة', icon: <Scale size={20} />, path: '/charter' },
    { label: 'ساحة الشطرنج الملكية', icon: <Gamepad2 size={20} />, path: '/chess' },
    { label: 'غرفة الأخبار الملكية', icon: <Newspaper size={20} />, path: '/newsroom' },
    { label: 'القبو السيادي (آمن)', icon: <ShieldCheck size={20} />, path: '/vault', special: 'vault' },
    { label: 'أصدقاء الجوار', icon: <Radar size={20} />, path: '/nearby' },
    { label: 'فليكسو ماركت', icon: <ShoppingBag size={20} />, path: '/market' },
  ];

  const bottomLinks = [
    { label: 'الإعدادات', icon: <Settings size={20} />, path: '/settings' },
  ];

  if (currentUser?.celebrityTier === 0) {
    bottomLinks.unshift({ label: 'غرفة العمليات', icon: <LayoutDashboard size={20} />, path: '/admin' });
  }

  return (
    <div className={`relative h-screen flex flex-col overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-transparent text-white' : 'bg-slate-50/80 text-slate-900'}`} dir="rtl">
      <AppDownloadBanner />

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110]" onClick={toggleMenu}></div>
      )}

      {/* Sidebar Trigger Hidden Button for Global reference */}
      <button id="sidebar-toggle-btn" onClick={toggleMenu} className="hidden"></button>

      {/* Sidebar Menu */}
      <div className={`fixed top-0 left-0 h-full w-80 border-r z-[120] transition-transform duration-500 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl ${isDarkMode ? 'bg-[#0a0a0c]/95 border-white/10' : 'bg-white border-black/5'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-10">
            <button onClick={toggleMenu} className={`p-2.5 rounded-2xl transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}><X size={24} /></button>
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className={`text-2xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-black'}`}>FLIXO</span>
              <div className="w-10 h-10 flixo-gradient rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xl">FX</span>
              </div>
            </div>
          </div>

          <div className="mb-8 p-5 bg-white/5 rounded-[30px] border border-white/10 flex items-center space-x-4 space-x-reverse relative overflow-hidden group">
            <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <img src={currentUser?.avatar} className="w-12 h-12 rounded-full border-2 border-pink-500 object-cover relative z-10" />
            <div className="overflow-hidden relative z-10">
               <p className="font-black text-sm truncate text-white">{currentUser?.displayName}</p>
               <p className="text-[10px] text-gray-500 font-bold truncate">@{currentUser?.username}</p>
            </div>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar pr-1">
            <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] mb-4 px-2">نظام فليكسو المركزي</p>
            {menuItems.map((item, idx) => (
              <button 
                key={idx}
                onClick={() => { navigate(item.path); toggleMenu(); }}
                className={`w-full flex items-center space-x-4 space-x-reverse p-4 rounded-2xl transition-all active:scale-95 ${
                  item.special === 'blueprint' ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-black mb-2 shadow-lg' :
                  item.special === 'stocks' ? 'bg-green-500/10 border border-green-500/20 text-green-500 font-black mb-2' :
                  item.special === 'identity' ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-black mb-2 shadow-xl' :
                  item.special === 'universal-ai' ? 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-black mb-2' : 
                  item.special === 'community' ? 'bg-blue-500/10 border border-blue-500/20 text-blue-500 font-black mb-2' :
                  item.special === 'wallet' ? 'bg-pink-500/10 border border-pink-500/20 text-pink-500 font-black mb-2' :
                  isDarkMode ? 'hover:bg-white/5 text-gray-400 hover:text-white' : 'hover:bg-black/5 text-gray-700'
                }`}
              >
                <div className="text-current">{item.icon}</div>
                <span className="text-[11px] font-black tracking-tight">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 space-y-2">
            <button 
              onClick={toggleTheme}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all active:scale-95 ${isDarkMode ? 'bg-white/5 text-yellow-500' : 'bg-black/5 text-indigo-600'}`}
            >
              <div className="flex items-center space-x-4 space-x-reverse">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                <span className="text-[11px] font-black">تبديل الوضع</span>
              </div>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-4 space-x-reverse p-4 rounded-2xl transition-all text-red-500 hover:bg-red-500/10 font-black text-[11px]"
            >
              <LogOut size={18} />
              <span>خروج سيادي</span>
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-hidden relative bg-transparent">
        {children}
      </main>

      <nav className={`h-20 backdrop-blur-3xl border-t flex items-center justify-around px-2 z-50 transition-colors ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-white/90 border-black/5'}`}>
        <button onClick={() => navigate('/')} className={`flex flex-col items-center space-y-1 transition-all flex-1 ${isActive('/') ? (isDarkMode ? 'text-white scale-110' : 'text-black scale-110 font-black') : 'text-gray-600'}`}>
          <Home size={22} /><span className="text-[9px] font-black uppercase">الرئيسية</span>
        </button>
        <button onClick={() => navigate('/community')} className={`flex flex-col items-center space-y-1 transition-all flex-1 ${isActive('/community') ? 'text-indigo-500 scale-110' : 'text-gray-600'}`}>
          <Users size={22} /><span className="text-[9px] font-black uppercase">المجتمع</span>
        </button>
        <button onClick={() => navigate('/create')} className="flex flex-col items-center -mt-8 flex-1 group z-50">
          <div className="w-14 h-14 flixo-gradient rounded-full flex items-center justify-center shadow-2xl border-4 border-black group-active:scale-90 transition-all">
            <Plus size={30} className="text-white" strokeWidth={3} />
          </div>
        </button>
        <button onClick={() => navigate('/wallet')} className={`flex flex-col items-center space-y-1 transition-all flex-1 ${isActive('/wallet') ? (isDarkMode ? 'text-yellow-500 scale-110' : 'text-yellow-600 scale-110 font-black') : 'text-gray-600'}`}>
          <Wallet size={22} /><span className="text-[9px] font-black uppercase">المحفظة</span>
        </button>
        <button onClick={() => navigate('/profile')} className={`flex flex-col items-center space-y-1 transition-all flex-1 ${isActive('/profile') ? (isDarkMode ? 'text-white scale-110' : 'text-black scale-110 font-black') : 'text-gray-600'}`}>
          <User size={22} /><span className="text-[9px] font-black uppercase">حسابي</span>
        </button>
      </nav>
    </div>
  );
};

export default LayoutComponent;
