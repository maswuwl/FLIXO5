
import React, { useState } from 'react';
import { authService } from '../services/authService';
import { ShieldCheck, ArrowLeft, Eye, EyeOff, Chrome, Fingerprint, Lock } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({ username: '', displayName: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [biometricScanning, setBiometricScanning] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    setTimeout(() => {
      const user = mode === 'login' 
        ? authService.login(formData.username, formData.password)
        : authService.register(formData);
        
      if (!user && mode === 'login') {
        setError("خطأ في بيانات الدخول، يرجى التحقق من المفتاح.");
        setIsLoading(false);
      } else if (user) {
        onLoginSuccess();
      }
    }, 1200);
  };

  const handleBiometricLogin = () => {
    setBiometricScanning(true);
    // محاكاة التحقق البيومتري السيادي
    setTimeout(() => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setBiometricScanning(false);
        onLoginSuccess();
      } else {
        setError("لم يتم العثور على سجل بيومتري. يرجى تسجيل الدخول يدوياً أولاً.");
        setBiometricScanning(false);
      }
    }, 2000);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      authService.googleLogin();
      onLoginSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-[#f0f2f5] dark:bg-[#050208] flex flex-col items-center justify-center p-4 overflow-y-auto no-scrollbar" dir="rtl">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 z-10">
        
        <div className="hidden md:flex flex-col text-right max-w-lg space-y-4 animate-fade-in">
          <h1 className="text-6xl font-black italic tracking-tighter flixo-text-gradient">FLIXO</h1>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 leading-tight">
            فليكسو يساعدك على التواصل مع المبدعين ومشاركة لحظاتك السيادية مع العالم.
          </p>
          <div className="flex items-center space-x-2 space-x-reverse pt-4 text-gray-500">
             <ShieldCheck size={20} className="text-green-500" />
             <span className="text-sm font-black">نظام خالد المنتصر للأمان العالمي</span>
          </div>
        </div>

        <div className="w-full max-w-md animate-slide-up">
          <div className="bg-white dark:bg-[#140a1e] border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
            
            {biometricScanning ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-8 animate-fade-in">
                 <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 flex items-center justify-center">
                       <Fingerprint size={48} className="text-indigo-500 animate-pulse" />
                    </div>
                    <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                 </div>
                 <div className="text-center space-y-2">
                    <h3 className="text-lg font-black text-white">جاري التعرف البيومتري...</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Sovereign Identity Scan V6</p>
                 </div>
                 <button onClick={() => setBiometricScanning(false)} className="text-xs font-black text-gray-500 hover:text-white transition-all">إلغاء المسح</button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                   <h2 className="text-xl font-black text-gray-800 dark:text-white">{mode === 'login' ? 'الدخول السيادي' : 'تأسيس حساب'}</h2>
                   {mode === 'login' && (
                     <button onClick={handleBiometricLogin} className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all">
                       <Fingerprint size={20} />
                     </button>
                   )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'register' && (
                    <input type="text" placeholder="الاسم المعروض" required className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl py-4 px-5 text-sm dark:text-white focus:outline-none" value={formData.displayName} onChange={(e) => setFormData({...formData, displayName: e.target.value})} />
                  )}
                  <input type="text" placeholder="اسم المستخدم" required className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl py-4 px-5 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} placeholder="كلمة السر" required className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl py-4 px-5 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>

                  <button type="submit" disabled={isLoading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-2xl shadow-xl transition-all flex items-center justify-center">
                    {isLoading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : (mode === 'login' ? 'تسجيل الدخول' : 'تأسيس الحساب')}
                  </button>

                  <div className="flex items-center justify-between px-2">
                     <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }} className="text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline">
                        {mode === 'login' ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب بالفعل؟ ادخل'}
                     </button>
                     {mode === 'login' && <span className="text-gray-500 text-[10px] font-black cursor-pointer">نسيت المفتاح؟</span>}
                  </div>
                </form>

                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
                  <span className="flex-shrink mx-4 text-xs text-gray-400 font-bold">أو</span>
                  <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
                </div>

                <button onClick={handleGoogleLogin} className="w-full py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs font-black text-gray-600 dark:text-white flex items-center justify-center space-x-2 space-x-reverse">
                   <Chrome size={18} className="text-red-500" />
                   <span>المتابعة عبر Google</span>
                </button>
              </>
            )}

            {error && <p className="text-xs text-red-500 font-black text-center animate-bounce">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
