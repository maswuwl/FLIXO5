
import React, { useState } from 'react';
import { Home, Compass, Plus, MessageCircle, User, Menu, X, ShoppingBag, Info, Settings, Brain, Radar, Zap, Trophy, Gamepad2, Sparkles, Newspaper, ShieldCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppDownloadBanner from './AppDownloadBanner';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => currentPath === path;
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuItems = [
    { label: 'خبير فليكسو الشامل', icon: <Brain size={20} />, path: '/ai-studio', special: 'universal-ai' },
    { label: 'ساحة الشطرنج الملكية', icon: <Gamepad2 size={20} />, path: '/chess', special: 'game' },
    { label: 'غرفة الأخبار الملكية', icon: <Newspaper size={20} />, path: '/newsroom', special: 'news' },
    { label: 'القبو السيادي (آمن)', icon: <ShieldCheck size={20} />, path: '/vault', special: 'vault' },
    { label: 'أصدقاء الجوار', icon: <Radar size={20} />, path: '/nearby' },
    { label: 'فليكسو ماركت', icon: <ShoppingBag size={20} />, path: '/market' },
  ];

  return (
    <div className="relative h-screen bg-black text-white flex flex-col overflow-hidden" dir="rtl">
      <AppDownloadBanner />

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]" onClick={toggleMenu}></div>
      )}

      <div className={`fixed top-0 left-0 h-full w-72 bg-black/95 backdrop-blur-2xl border-r border-white/10 z-[120] transition-transform duration-500 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-10">
            <button onClick={toggleMenu} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-2xl font-black italic tracking-tighter text-white">FLIXO</span>
              <div className="w-10 h-10 flixo-gradient rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xl">FX</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4 px-2">نظام فليكسو الذكي</p>
            {menuItems.map((item, idx) => (
              <button 
                key={idx}
                onClick={() => { navigate(item.path); toggleMenu(); }}
                className={`w-full flex items-center space-x-4 space-x-reverse p-4 rounded-2xl transition-all active:scale-95 ${
                  item.special === 'universal-ai' ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-black mb-2' : 
                  item.special === 'vault' ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-black mb-2' :
                  'hover:bg-white/5 text-gray-300'
                }`}
              >
                <div className="text-current">{item.icon}</div>
                <span className="text-sm font-bold">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 opacity-50 text-center">
            <p className="text-[10px] font-bold tracking-widest text-gray-500">FLIXO OS V1.5 Gold Edition</p>
          </div>
        </div>
      </div>

      {currentPath === '/' && (
        <div className="fixed top-20 left-6 z-[90]">
           <button onClick={toggleMenu} className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl hover:bg-white/10">
             <Menu size={24} className="text-white" />
           </button>
        </div>
      )}

      <main className="flex-1 overflow-hidden relative mt-[72px]">
        {children}
      </main>

      <nav className="h-20 bg-black/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-1 z-50">
        <button onClick={() => navigate('/')} className={`flex flex-col items-center space-y-1 transition-all flex-1 ${isActive('/') ? 'text-white scale-110' : 'text-gray-500'}`}>
          <Home size={22} /><span className="text-[9px] font-bold">الرئيسية</span>
        </button>
        <button onClick={() => navigate('/explore')} className={`flex flex-col items-center space-y-1 transition-all flex-1 ${isActive('/explore') ? 'text-white scale-110' : 'text-gray-500'}`}>
          <Compass size={22} /><span className="text-[9px] font-bold">استكشف</span>
        </button>
        <button onClick={() => navigate('/create')} className="flex flex-col items-center -mt-8 flex-1 group z-50">
          <div className="w-14 h-14 flixo-gradient rounded-full flex items-center justify-center shadow-lg border-4 border-black group-active:scale-90 transition-all">
            <Plus size={32} className="text-white" strokeWidth={3} />
          </div>
          <span className="text-[9px] font-black mt-1 text-white uppercase italic">نشر</span>
        </button>
        <button onClick={() => navigate('/inbox')} className={`flex flex-col items-center space-y-1 transition-all flex-1 ${isActive('/inbox') ? 'text-white scale-110' : 'text-gray-500'}`}>
          <MessageCircle size={22} /><span className="text-[9px] font-bold">الرسائل</span>
        </button>
        <button onClick={() => navigate('/profile')} className={`flex flex-col items-center space-y-1 transition-all flex-1 ${isActive('/profile') ? 'text-white scale-110' : 'text-gray-500'}`}>
          <User size={22} /><span className="text-[9px] font-bold">حسابي</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
