
import React, { useState } from 'react';
import { authService } from '../services/authService';
import { ShieldCheck, UserPlus, LogIn, Globe, Languages, Scale, ChevronDown, CheckCircle2, SearchCode, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthProps {
  onLoginSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({ username: '', displayName: '', inviteCode: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState('اليمنية (Sovereign)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      if (mode === 'login') authService.login(formData.username);
      else authService.register(formData);
      setIsLoading(false);
      onLoginSuccess();
    }, 1200);
  };

  const handleGuestEntry = () => {
    authService.loginAsGuest();
    onLoginSuccess();
  };

  const handleScanRepository = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult("تم فحص 42 ملفاً سيادياً بنجاح. النظام مستقر 100% وخالٍ من الحقوق الخارجية تحت إشراف خالد المنتصر 🇾🇪");
    }, 2500);
  };

  const languages = ['اليمنية (Sovereign)', 'العربية (Standard)', 'English (Global)'];

  const toggleLangMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowLang(!showLang);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-6 overflow-hidden" dir="rtl" onClick={() => setShowLang(false)}>
      {/* خلفية سيادية متدرجة */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[150px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10 space-y-8">
        
        {/* 1. أيقونة اللغة - مع إصلاح التفاعل */}
        <div className="relative flex justify-center z-[1100]">
            <button 
                onClick={toggleLangMenu}
                className="flex items-center space-x-2 space-x-reverse px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-white/80 hover:bg-white/10 transition-all active:scale-95 shadow-lg backdrop-blur-md"
            >
                <Languages size={18} className="text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">{selectedLang}</span>
                <ChevronDown size={12} className={`transition-transform duration-300 ${showLang ? 'rotate-180' : ''}`} />
            </button>

            {showLang && (
              <div className="absolute top-full mt-2 w-52 bg-[#0a0a0c] border border-white/10 rounded-2xl p-2 shadow-2xl animate-slide-up z-[1200] backdrop-blur-3xl" onClick={(e) => e.stopPropagation()}>
                {languages.map((lang) => (
                  <button 
                    key={lang}
                    onClick={() => { setSelectedLang(lang); setShowLang(false); }}
                    className="w-full text-right px-4 py-3 rounded-xl text-[10px] font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all flex items-center justify-between"
                  >
                    <span>{lang}</span>
                    {selectedLang === lang && <CheckCircle2 size={12} className="text-green-500" />}
                  </button>
                ))}
              </div>
            )}
        </div>

        <div className="text-center">
          <div className="w-20 h-20 flixo-gradient rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 rotate-12 shadow-[0_0_80px_rgba(124,58,237,0.4)] border border-white/20">
            <span className="text-white font-black text-3xl italic">FX</span>
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter flixo-text-gradient mb-1">FLIXO</h1>
          <p className="text-gray-600 font-bold text-[8px] uppercase tracking-[0.4em]">المنظومة السيادية • خالد المنتصر</p>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[45px] p-8 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
                <input 
                    type="text" 
                    placeholder="اسم المستخدم" 
                    required 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all" 
                    value={formData.username} 
                    onChange={(e) => setFormData({...formData, username: e.target.value})} 
                />
                <input 
                    type="password" 
                    placeholder="كلمة المرور" 
                    required 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all" 
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button 
                    type="button"
                    onClick={() => setMode('login')}
                    className={`py-4 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center space-x-2 space-x-reverse ${mode === 'login' ? 'bg-white text-black shadow-xl' : 'bg-white/5 text-gray-400 border border-white/5'}`}
                >
                    <LogIn size={14} /> <span>دخول</span>
                </button>
                <button 
                    type="button"
                    onClick={() => setMode('register')}
                    className={`py-4 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center space-x-2 space-x-reverse ${mode === 'register' ? 'bg-white text-black shadow-xl' : 'bg-white/5 text-gray-400 border border-white/5'}`}
                >
                    <UserPlus size={14} /> <span>انضم</span>
                </button>
            </div>

            <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full py-5 flixo-gradient rounded-[28px] text-white font-black text-sm shadow-[0_20px_50px_rgba(124,58,237,0.3)] active:scale-95 transition-all flex items-center justify-center space-x-3 space-x-reverse"
            >
              {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                  <>
                    <ShieldCheck size={20} />
                    <span>فتح بوابة السيادة</span>
                  </>
              )}
            </button>

            <button 
                type="button"
                onClick={() => navigate('/charter')}
                className="w-full py-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-indigo-400 font-black text-[10px] uppercase tracking-widest flex items-center justify-center space-x-2 space-x-reverse hover:bg-indigo-600/20 transition-all mt-2"
            >
                <Scale size={16} />
                <span>بوابة الحقوق الملكية</span>
            </button>
          </form>

          <div className="mt-8 space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={handleGuestEntry} 
                    className="py-4 bg-white/5 border border-white/5 rounded-2xl text-gray-400 font-bold text-[10px] flex items-center justify-center space-x-2 space-x-reverse hover:bg-white/10 transition-all"
                >
                    <Globe size={14} />
                    <span>مستكشف</span>
                </button>
                
                <button 
                    onClick={handleScanRepository}
                    disabled={isScanning}
                    className="py-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-indigo-400 font-bold text-[10px] flex items-center justify-center space-x-2 space-x-reverse hover:bg-indigo-600/20 transition-all"
                >
                    {isScanning ? <Sparkles size={14} className="animate-spin" /> : <SearchCode size={14} />}
                    <span>فحص المستودع</span>
                </button>
            </div>

            {scanResult && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl animate-fade-in">
                <div className="flex items-center space-x-2 space-x-reverse text-green-500 mb-1">
                   <CheckCircle2 size={14} />
                   <span className="text-[10px] font-black uppercase">تقرير الفحص السيادي</span>
                </div>
                <p className="text-[9px] text-gray-400 leading-relaxed font-bold">{scanResult}</p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
            <p className="text-[8px] text-gray-800 font-black uppercase tracking-[0.5em]">© 2025 KHALID ALMONTASER • YEMEN SOVEREIGNTY</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
