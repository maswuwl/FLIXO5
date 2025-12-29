
import React, { useState } from 'react';
import { authService } from '../services/authService';
import { ShieldCheck, UserPlus, LogIn, Chrome, Lock, Sparkles, KeyRound, ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-[1000] bg-[#f0f2f5] dark:bg-[#050208] flex flex-col items-center justify-center p-4 md:p-12 overflow-y-auto no-scrollbar" dir="rtl">
      {/* Background Orbs (Dark Mode Only) */}
      <div className="hidden dark:block absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="hidden dark:block absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 z-10">
        
        {/* Left Side: Branding (Desktop) */}
        <div className="hidden md:flex flex-col text-right max-w-lg space-y-4 animate-fade-in">
          <h1 className="text-6xl font-black italic tracking-tighter flixo-text-gradient">FLIXO</h1>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 leading-tight">
            فليكسو يساعدك على التواصل مع المبدعين ومشاركة لحظاتك السيادية مع العالم.
          </p>
          <div className="flex items-center space-x-2 space-x-reverse pt-4 text-gray-500">
             <ShieldCheck size={20} className="text-green-500" />
             <span className="text-sm font-black">نظام خالد المنتصر للأمان الرقمي</span>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile Logo */}
          <div className="md:hidden text-center mb-8">
            <h1 className="text-5xl font-black italic tracking-tighter flixo-text-gradient">FLIXO</h1>
            <p className="text-gray-500 font-bold text-xs mt-2">بوابة السيادة اليمانية</p>
          </div>

          <div className="bg-white dark:bg-[#140a1e] border border-gray-200 dark:border-white/10 rounded-[2rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] space-y-6">
            
            {mode === 'login' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                  type="text" 
                  placeholder="اسم المستخدم أو البريد السيادي" 
                  required 
                  className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl py-4 px-5 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" 
                  value={formData.username} 
                  onChange={(e) => setFormData({...formData, username: e.target.value})} 
                />
                
                <div className="relative group">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="كلمة السر" 
                    required 
                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl py-4 px-5 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" 
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center"
                >
                  {isLoading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : 'تسجيل الدخول'}
                </button>

                <div className="text-center">
                  <button type="button" className="text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline">هل نسيت كلمة السر؟</button>
                </div>

                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
                  <span className="flex-shrink mx-4 text-xs text-gray-400 font-bold uppercase tracking-widest">أو</span>
                  <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
                </div>

                {/* Create Account Button - Facebook Style */}
                <div className="text-center pt-2">
                  <button 
                    type="button"
                    onClick={() => { setMode('register'); setError(null); }}
                    className="px-8 py-4 bg-[#42b72a] hover:bg-[#36a420] text-white font-black text-sm rounded-2xl shadow-xl shadow-green-500/10 active:scale-95 transition-all"
                  >
                    إنشاء حساب جديد في فليكسو
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center mb-2">
                   <h2 className="text-xl font-black text-gray-800 dark:text-white">انضم للإمبراطورية</h2>
                   <button type="button" onClick={() => setMode('login')} className="text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center">
                     <ArrowLeft size={14} className="ml-1" /> العودة للدخول
                   </button>
                </div>
                
                <input 
                  type="text" 
                  placeholder="الاسم الكامل" 
                  required 
                  className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl py-4 px-5 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" 
                  value={formData.displayName} 
                  onChange={(e) => setFormData({...formData, displayName: e.target.value})} 
                />
                
                <input 
                  type="text" 
                  placeholder="اسم المستخدم الفريد" 
                  required 
                  className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl py-4 px-5 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" 
                  value={formData.username} 
                  onChange={(e) => setFormData({...formData, username: e.target.value})} 
                />
                
                <input 
                  type="password" 
                  placeholder="كلمة السر الجديدة" 
                  required 
                  className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl py-4 px-5 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" 
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />

                <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl text-[10px] text-gray-500 leading-relaxed font-bold">
                  بالنقر على "تسجيل"، فإنك توافق على شروطنا وسياسة البيانات وسياسة ملفات تعريف الارتباط. قد تتلقى إشعارات سيادية منا عبر البريد.
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-4 bg-[#42b72a] hover:bg-[#36a420] text-white font-black text-lg rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center"
                >
                  {isLoading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : 'تسجيل في فليكسو'}
                </button>
              </form>
            )}

            {error && <p className="text-xs text-red-500 font-black text-center animate-bounce">{error}</p>}

            <div className="pt-4 flex flex-col items-center space-y-4">
              <button 
                type="button" 
                onClick={handleGoogleLogin}
                className="w-full py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs font-black text-gray-600 dark:text-white flex items-center justify-center space-x-2 space-x-reverse hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
              >
                <Chrome size={18} className="text-red-500" />
                <span>المتابعة عبر Google</span>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest space-y-2">
            <p>خالد المنتصر • بوابة السيادة اليمانية V6.2</p>
            <div className="flex justify-center space-x-4 space-x-reverse opacity-60">
              <button className="hover:underline">عن فليكسو</button>
              <button className="hover:underline">المساعدة</button>
              <button className="hover:underline">المطورين</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
