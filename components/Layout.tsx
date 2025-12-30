
import React, { useState } from 'react';
import { 
  Home, Users, Play, Store, LayoutGrid, Search, Bell, MessageCircle, 
  Menu, UserCircle, Settings, LogOut, ChevronDown, Flag, Clock, Bookmark, 
  Calendar, CreditCard, Cpu
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { id: '/', icon: <Home size={26} />, label: 'الرئيسية' },
    { id: '/groups', icon: <Users size={26} />, label: 'المجموعات' },
    { id: '/video', icon: <Play size={26} />, label: 'فيديو' },
    { id: '/market', icon: <Store size={26} />, label: 'المتجر' },
    { id: '/ai-studio', icon: <Cpu size={26} />, label: 'النواة' },
  ];

  return (
    <div className="h-screen bg-[#0a0a0c] text-white flex flex-col overflow-hidden" dir="rtl">
      {/* Top Navigation Bar */}
      <header className="h-14 bg-[#18191a] border-b border-white/5 flex items-center justify-between px-4 z-[200] shrink-0">
        <div className="flex items-center space-x-2 space-x-reverse flex-1">
          <div 
            onClick={() => navigate('/')}
            className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
          >
            <span className="text-white font-black text-xl italic">F</span>
          </div>
          <div className="relative hidden md:block w-full max-w-xs">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              placeholder="البحث في فليكسو..." 
              className="w-full bg-[#3a3b3c] border-none rounded-full py-2.5 pr-10 pl-4 text-sm focus:outline-none" 
            />
          </div>
        </div>

        <nav className="hidden lg:flex items-center justify-center flex-1 space-x-2 space-x-reverse h-full">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`h-full px-10 border-b-4 transition-all ${
                location.pathname === item.id 
                  ? 'border-indigo-500 text-indigo-500' 
                  : 'border-transparent text-gray-400 hover:bg-white/5'
              }`}
            >
              {item.icon}
            </button>
          ))}
        </nav>

        <div className="flex items-center justify-end space-x-2 space-x-reverse flex-1">
          <div className="hidden md:flex items-center space-x-2 space-x-reverse ml-2 px-2 py-1 hover:bg-white/5 rounded-full cursor-pointer" onClick={() => navigate('/profile')}>
            <img src={user?.avatar} className="w-8 h-8 rounded-full object-cover" />
            <span className="text-sm font-bold">{user?.displayName.split(' ')[0]}</span>
          </div>
          {[
            { icon: <LayoutGrid size={20} />, label: 'القائمة' },
            { icon: <MessageCircle size={20} />, label: 'الرسائل', path: '/inbox' },
            { icon: <Bell size={20} />, label: 'الإشعارات', path: '/notifications' }
          ].map((btn, i) => (
            <button 
              key={i}
              onClick={() => btn.path && navigate(btn.path)}
              className="w-10 h-10 bg-[#3a3b3c] hover:bg-[#4e4f50] rounded-full flex items-center justify-center transition-colors"
            >
              {btn.icon}
            </button>
          ))}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 bg-[#3a3b3c] hover:bg-[#4e4f50] rounded-full flex items-center justify-center"
            >
              <ChevronDown size={20} />
            </button>
            {showUserMenu && (
              <div className="absolute left-0 mt-2 w-72 bg-[#242526] border border-white/10 rounded-xl shadow-2xl p-2 z-[300] animate-scale-in">
                <div 
                  className="flex items-center space-x-3 space-x-reverse p-3 hover:bg-white/5 rounded-lg cursor-pointer mb-2"
                  onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                >
                  <img src={user?.avatar} className="w-12 h-12 rounded-full border border-white/10" />
                  <div className="text-right">
                    <p className="font-bold">{user?.displayName}</p>
                    <p className="text-xs text-gray-400">عرض ملفك الشخصي</p>
                  </div>
                </div>
                <hr className="border-white/5 my-2" />
                <button onClick={() => navigate('/settings')} className="w-full flex items-center space-x-3 space-x-reverse p-3 hover:bg-white/5 rounded-lg">
                  <Settings size={20} /> <span className="text-sm font-bold">الإعدادات والخصوصية</span>
                </button>
                <button onClick={() => authService.logout()} className="w-full flex items-center space-x-3 space-x-reverse p-3 hover:bg-white/5 rounded-lg text-red-400">
                  <LogOut size={20} /> <span className="text-sm font-bold">تسجيل الخروج</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Shortcuts) */}
        <aside className="hidden xl:flex w-72 flex-col p-2 overflow-y-auto no-scrollbar">
          {[
            { icon: <img src={user?.avatar} className="w-9 h-9 rounded-full object-cover" />, label: user?.displayName, path: '/profile' },
            { icon: <Users size={24} className="text-indigo-400" />, label: 'الأصدقاء', path: '/friends' },
            { icon: <Flag size={24} className="text-orange-500" />, label: 'الصفحات', path: '/pages' },
            { icon: <Clock size={24} className="text-blue-400" />, label: 'الذكريات', path: '/memories' },
            { icon: <Bookmark size={24} className="text-purple-400" />, label: 'العناصر المحفوظة', path: '/saved' },
            { icon: <Store size={24} className="text-indigo-500" />, label: 'المتجر', path: '/market' },
            { icon: <Play size={24} className="text-red-500" />, label: 'فيديو', path: '/video' },
            { icon: <Calendar size={24} className="text-pink-500" />, label: 'المناسبات', path: '/events' },
            { icon: <CreditCard size={24} className="text-green-500" />, label: 'الطلبات والمدفوعات', path: '/wallet' },
          ].map((item, i) => (
            <button 
              key={i}
              onClick={() => navigate(item.path)}
              className="flex items-center space-x-3 space-x-reverse p-3 hover:bg-white/5 rounded-xl transition-all"
            >
              <div className="w-9 h-9 flex items-center justify-center">{item.icon}</div>
              <span className="text-[14px] font-medium">{item.label}</span>
            </button>
          ))}
          <hr className="border-white/5 my-4 mx-2" />
          <p className="text-[12px] text-gray-500 px-3 font-bold">اختصاراتك السيادية</p>
          <div className="mt-2 space-y-1">
             {/* Dynamic shortcuts could go here */}
          </div>
        </aside>

        {/* Feed Area */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0c] no-scrollbar">
          <div className="max-w-[740px] mx-auto py-6 px-4">
            {children}
          </div>
        </main>

        {/* Right Sidebar (Contacts) */}
        <aside className="hidden lg:flex w-72 flex-col p-4 border-r border-white/5 overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center mb-4">
             <span className="text-gray-500 font-bold">جهات الاتصال</span>
             <div className="flex space-x-2 space-x-reverse">
                <Search size={16} className="text-gray-500 cursor-pointer" />
                <Menu size={16} className="text-gray-500 cursor-pointer" />
             </div>
          </div>
          <div className="space-y-2">
             {/* Mock Online Friends */}
             {[1, 2, 3, 4, 5].map(i => (
               <div key={i} className="flex items-center space-x-3 space-x-reverse p-2 hover:bg-white/5 rounded-xl cursor-pointer">
                  <div className="relative">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=friend${i}`} className="w-9 h-9 rounded-full bg-white/10" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#18191a] rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">مبدع فليكسو {i}</span>
               </div>
             ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Layout;
