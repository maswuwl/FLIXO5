
import React, { useState } from 'react';
import { authService } from '../services/authService';
import { ShieldCheck, UserPlus, LogIn, Chrome, Lock, Sparkles, KeyRound, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({ username: '', displayName: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    setTimeout(() => {
      const user = mode === 'login' 
        ? authService.login(formData.username, formData.password)
        : authService.register(formData);
        
      if (!user && mode === 'login') {
        setError("خطأ في بيانات السيادة، يرجى التحقق من المفتاح.");
        setIsLoading(false);
      } else if (user) {
        onLoginSuccess();
      }
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      authService.googleLogin();
      onLoginSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-6 overflow-hidden" dir="rtl">
      {/* Dynamic Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-pink-600/10 blur-[150px] rounded-full animate-pulse delay-700"></div>

      <div className="w-full max-w-md relative z-10 space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="w-24 h-24 flixo-gradient rounded-[2.8rem] flex items-center justify-center mx-auto mb-6 rotate-12 shadow-[0_0_80px_rgba(124,58,237,0.5)] border border-white/20 active-tap transition-transform">
            <span className="text-white font-black text-4xl">FX</span>
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter text-white">FLIXO</h1>
          <p className="text-gray-500 font-bold text-[9px] uppercase tracking-[0.4em] mt-2">خالد المنتصر • بوابة السيادة اليمانية</p>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[45px] p-8 shadow-2xl space-y-6">
          <div className="flex bg-white/5 p-1 rounded-2xl mb-2">
            <button 
              onClick={() => { setMode('login'); setError(null); }} 
              className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all active-tap ${mode === 'login' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}
            >
              دخول سيادي
            </button>
            <button 
              onClick={() => { setMode('register'); setError(null); }} 
              className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all active-tap ${mode === 'register' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}
            >
              تأسيس هوية
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
                {mode === 'register' && (
                  <input 
                    type="text" 
                    placeholder="الاسم المعروض للهوية" 
                    required 
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all text-right" 
                    value={formData.displayName} 
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})} 
                  />
                )}
                <div className="relative group">
                  <input 
                      type="text" 
                      placeholder="اسم المستخدم" 
                      required 
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pr-12 pl-6 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all text-right" 
                      value={formData.username} 
                      onChange={(e) => setFormData({...formData, username: e.target.value})} 
                  />
                  <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                </div>
                
                <div className="relative group">
                  <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="مفتاح السيادة (كلمة المرور)" 
                      required 
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pr-12 pl-12 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all text-right" 
                      value={formData.password} 
                      onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  />
                  <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  
                  {/* زر إظهار وإخفاء كلمة المرور */}
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors active-tap p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
            </div>

            {error && <p className="text-[10px] text-red-500 font-black text-center animate-bounce">{error}</p>}

            <button type="submit" disabled={isLoading} className="w-full py-5 flixo-gradient rounded-[28px] text-white font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center">
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div> : 
                <><LogIn size={18} className="ml-2" /> {mode === 'login' ? 'فتح بوابة السيادة' : 'تأسيس الهوية الآن'}</>
              }
            </button>

            <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-4 text-[9px] text-gray-600 font-black uppercase tracking-widest">عبر السحابة السيادية</span>
                <div className="flex-grow border-t border-white/5"></div>
            </div>

            <button 
                type="button" 
                onClick={handleGoogleLogin}
                className="w-full py-4 bg-white text-black rounded-[25px] font-black text-xs flex items-center justify-center space-x-3 space-x-reverse hover:bg-gray-100 active-tap shadow-lg transition-all"
            >
                <Chrome size={18} className="text-red-500" />
                <span>دخول سريع عبر Google</span>
            </button>
          </form>
        </div>
        
        <div className="flex flex-col items-center space-y-4 opacity-40">
           <div className="flex items-center space-x-2 space-x-reverse">
             <ShieldCheck size={12} className="text-green-500" />
             <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">تشفير KHALID-SEC V6 نشط</span>
           </div>
           <p className="text-[7px] text-gray-600 font-bold uppercase tracking-[0.4em] text-center">ابتكار يماني أصيل • جميع الحقوق محفوظة لسيادة خالد المنتصر</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
