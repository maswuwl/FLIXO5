
import React, { useState } from 'react';
import { authService } from '../services/authService';
import { ShieldCheck, UserPlus, LogIn, Chrome, Lock, Sparkles, KeyRound } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({ username: '', displayName: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    setTimeout(() => {
      let user;
      if (mode === 'login') {
        user = authService.login(formData.username, formData.password);
        if (!user) setError("خطأ في البيانات أو المستخدم غير موجود سيادياً.");
      } else {
        user = authService.register(formData);
      }
      
      setIsLoading(false);
      if (user) onLoginSuccess();
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      authService.googleLogin();
      setIsLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-6 overflow-hidden" dir="rtl">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10 space-y-8">
        <div className="text-center">
          <div className="w-24 h-24 flixo-gradient rounded-[2.8rem] flex items-center justify-center mx-auto mb-6 rotate-12 shadow-[0_0_80px_rgba(124,58,237,0.5)] border border-white/20">
            <span className="text-white font-black text-4xl">FX</span>
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter text-white">FLIXO</h1>
          <p className="text-gray-500 font-bold text-[9px] uppercase tracking-[0.4em] mt-2">خالد المنتصر • بوابة السيادة اليمانية</p>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[45px] p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
                {mode === 'register' && (
                  <input 
                    type="text" 
                    placeholder="الاسم المعروض" 
                    required 
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all" 
                    value={formData.displayName} 
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})} 
                  />
                )}
                <input 
                    type="text" 
                    placeholder="اسم المستخدم" 
                    required 
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-indigo-500" 
                    value={formData.username} 
                    onChange={(e) => setFormData({...formData, username: e.target.value})} 
                />
                <div className="relative">
                  <input 
                      type="password" 
                      placeholder="كلمة المرور المشفرة" 
                      required 
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-indigo-500" 
                      value={formData.password} 
                      onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  />
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                </div>
            </div>

            {error && <p className="text-[10px] text-red-500 font-black text-center">{error}</p>}

            <button type="submit" disabled={isLoading} className="w-full py-5 flixo-gradient rounded-[28px] text-white font-black text-sm shadow-xl active:scale-95 transition-all">
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div> : 
                <span>{mode === 'login' ? 'فتح بوابة السيادة' : 'تأسيس حساب سيادي'}</span>
              }
            </button>

            <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-4 text-[9px] text-gray-600 font-black uppercase">أو التوثيق عبر</span>
                <div className="flex-grow border-t border-white/5"></div>
            </div>

            <button 
                type="button" 
                onClick={handleGoogleLogin}
                className="w-full py-4 bg-white text-black rounded-[25px] font-black text-xs flex items-center justify-center space-x-3 space-x-reverse hover:bg-gray-100 active:scale-95 shadow-lg"
            >
                <Chrome size={18} className="text-red-500" />
                <span>تسجيل عبر Google (سيادي)</span>
            </button>
          </form>

          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="w-full mt-6 text-indigo-400 font-black text-xs">
            {mode === 'login' ? 'لا تملك حساباً؟ انضم للمنظومة' : 'لديك حساب سيادي؟ سجل دخولك'}
          </button>
        </div>
        
        <div className="flex items-center justify-center space-x-2 space-x-reverse opacity-40">
           <ShieldCheck size={12} className="text-green-500" />
           <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">تشفير KHALID-SEC V6 نشط</span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
