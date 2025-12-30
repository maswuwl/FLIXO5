
import React, { useState } from 'react';
import { authService } from '../services/authService';
import { ShieldCheck, ArrowLeft, Eye, EyeOff, Chrome, Fingerprint, Lock, Phone, Mail, User as UserIcon, Calendar, VenusMars, CheckCircle2 } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [regStep, setRegStep] = useState(1);
  const [useEmail, setUseEmail] = useState(true);
  
  const [formData, setFormData] = useState({ 
    username: '', 
    displayName: '', 
    email: '', 
    phone: '', 
    password: '',
    birthDay: '1',
    birthMonth: '1',
    birthYear: '2000',
    gender: 'male'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [biometricScanning, setBiometricScanning] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register' && regStep === 1) {
       setRegStep(2);
       return;
    }

    setError(null);
    setIsLoading(true);
    
    setTimeout(() => {
      const user = mode === 'login' 
        ? authService.login(useEmail ? (formData.email || formData.username) : (formData.phone || formData.username), formData.password)
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
    setTimeout(() => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setBiometricScanning(false);
        onLoginSuccess();
      } else {
        setError("لم يتم العثور على سجل بيومتري سيادي.");
        setBiometricScanning(false);
      }
    }, 2000);
  };

  // Fix: Added missing handleGoogleLogin function to process Google authentication
  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      authService.googleLogin();
      onLoginSuccess();
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-[#f0f2f5] dark:bg-[#050208] flex flex-col items-center justify-center p-4 overflow-y-auto no-scrollbar" dir="rtl">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/20 blur-[120px] rounded-full"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 z-10">
        
        <div className="hidden md:flex flex-col text-right max-w-lg space-y-4 animate-fade-in">
          <h1 className="text-7xl font-black italic tracking-tighter flixo-text-gradient mb-2">FLIXO</h1>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
            تواصل مع الأصدقاء والعالم من حولك عبر المنصة السيادية الأولى.
          </p>
          <div className="flex items-center space-x-3 space-x-reverse pt-6">
             <div className="p-3 bg-green-500/10 rounded-2xl border border-green-500/20">
                <ShieldCheck size={24} className="text-green-500" />
             </div>
             <span className="text-sm font-black text-gray-500">نظام خالد المنتصر للحماية البيومترية V7</span>
          </div>
        </div>

        <div className="w-full max-w-md animate-slide-up">
          <div className="bg-white dark:bg-[#11081a] border border-gray-200 dark:border-white/5 rounded-[3rem] p-8 shadow-2xl space-y-6 relative overflow-hidden">
            
            {biometricScanning ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-8 animate-fade-in">
                 <div className="relative">
                    <div className="w-28 h-28 rounded-full border-4 border-indigo-500/10 flex items-center justify-center">
                       <Fingerprint size={56} className="text-indigo-500 animate-pulse" />
                    </div>
                    <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                 </div>
                 <div className="text-center space-y-2">
                    <h3 className="text-xl font-black text-white">التعرف البيومتري...</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">Sovereign Identity Scan</p>
                 </div>
                 <button onClick={() => setBiometricScanning(false)} className="text-xs font-black text-gray-500 hover:text-white">إلغاء</button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                   <div>
                      <h2 className="text-2xl font-black text-gray-800 dark:text-white">
                        {mode === 'login' ? 'مرحباً بعودتك' : (regStep === 1 ? 'تأسيس حساب' : 'التحقق السيادي')}
                      </h2>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Sovereign Onboarding</p>
                   </div>
                   {mode === 'login' && (
                     <button onClick={handleBiometricLogin} className="p-4 bg-indigo-500/10 text-indigo-400 rounded-[1.5rem] border border-indigo-500/20 active:scale-90 transition-all">
                       <Fingerprint size={24} />
                     </button>
                   )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'register' && regStep === 1 && (
                    <div className="grid grid-cols-2 gap-3">
                       <input type="text" placeholder="الاسم الكامل" required className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl py-4 px-5 text-sm dark:text-white focus:outline-none" value={formData.displayName} onChange={(e) => setFormData({...formData, displayName: e.target.value})} />
                       <input type="text" placeholder="اسم المستخدم" required className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl py-4 px-5 text-sm dark:text-white focus:outline-none" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
                    </div>
                  )}

                  <div className="relative group">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors">
                       {mode === 'login' ? <UserIcon size={18} /> : (useEmail ? <Mail size={18} /> : <Phone size={18} />)}
                    </div>
                    <input 
                      type={mode === 'register' && !useEmail ? "tel" : "text"} 
                      placeholder={mode === 'login' ? "اسم المستخدم أو البريد أو الهاتف" : (useEmail ? "البريد الإلكتروني" : "رقم الهاتف")} 
                      required 
                      className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl py-4 pr-12 pl-5 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" 
                      value={mode === 'login' ? formData.username : (useEmail ? formData.email : formData.phone)} 
                      onChange={(e) => mode === 'login' ? setFormData({...formData, username: e.target.value}) : (useEmail ? setFormData({...formData, email: e.target.value}) : setFormData({...formData, phone: e.target.value}))} 
                    />
                    {mode === 'register' && (
                      <button type="button" onClick={() => setUseEmail(!useEmail)} className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-1 rounded-lg">
                        {useEmail ? "استخدم الهاتف" : "استخدم البريد"}
                      </button>
                    )}
                  </div>

                  <div className="relative group">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500">
                       <Lock size={18} />
                    </div>
                    <input type={showPassword ? "text" : "password"} placeholder="كلمة السر السيادية" required className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl py-4 pr-12 pl-12 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>

                  {mode === 'register' && regStep === 1 && (
                    <div className="space-y-4 pt-2">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 mr-2 flex items-center"><Calendar size={12} className="ml-1" /> تاريخ الميلاد</label>
                          <div className="grid grid-cols-3 gap-2">
                             <select className="bg-gray-50 dark:bg-black/40 border border-white/5 rounded-xl py-3 px-2 text-xs text-white outline-none" value={formData.birthDay} onChange={(e) => setFormData({...formData, birthDay: e.target.value})}>
                                {Array.from({length: 31}, (_, i) => String(i+1)).map(d => <option key={d} value={d}>{d}</option>)}
                             </select>
                             <select className="bg-gray-50 dark:bg-black/40 border border-white/5 rounded-xl py-3 px-2 text-xs text-white outline-none" value={formData.birthMonth} onChange={(e) => setFormData({...formData, birthMonth: e.target.value})}>
                                {Array.from({length: 12}, (_, i) => String(i+1)).map(m => <option key={m} value={m}>{m}</option>)}
                             </select>
                             <select className="bg-gray-50 dark:bg-black/40 border border-white/5 rounded-xl py-3 px-2 text-xs text-white outline-none" value={formData.birthYear} onChange={(e) => setFormData({...formData, birthYear: e.target.value})}>
                                {Array.from({length: 100}, (_, i) => String(2025 - i)).map(y => <option key={y} value={y}>{y}</option>)}
                             </select>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 mr-2 flex items-center"><VenusMars size={12} className="ml-1" /> الجنس</label>
                          <div className="grid grid-cols-2 gap-2">
                             <button type="button" onClick={() => setFormData({...formData, gender: 'male'})} className={`py-3 rounded-xl text-[10px] font-black border transition-all ${formData.gender === 'male' ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500'}`}>ذكر</button>
                             <button type="button" onClick={() => setFormData({...formData, gender: 'female'})} className={`py-3 rounded-xl text-[10px] font-black border transition-all ${formData.gender === 'female' ? 'bg-pink-600 border-pink-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-gray-500'}`}>أنثى</button>
                          </div>
                       </div>
                    </div>
                  )}

                  {mode === 'register' && regStep === 2 && (
                    <div className="py-6 text-center space-y-6 animate-fade-in">
                       <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                          <CheckCircle2 size={40} className="text-green-500" />
                       </div>
                       <div className="space-y-2">
                          <h4 className="font-black text-white">تأكيد السيادة الرقمية</h4>
                          <p className="text-[10px] text-gray-500 font-bold leading-relaxed px-4">أدخل كود التحقق المرسل إلى {useEmail ? formData.email : formData.phone}</p>
                       </div>
                       <input type="text" maxLength={6} placeholder="0 0 0 0 0 0" className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 text-center text-2xl font-black tracking-[0.5em] text-indigo-400 outline-none focus:border-indigo-500" />
                       <button type="button" onClick={() => setRegStep(1)} className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:underline">تعديل البيانات</button>
                    </div>
                  )}

                  <button type="submit" disabled={isLoading} className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-[1.5rem] shadow-xl transition-all flex items-center justify-center group">
                    {isLoading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                      <>
                        <span>{mode === 'login' ? 'تسجيل الدخول' : (regStep === 1 ? 'المتابعة' : 'تأكيد الحساب')}</span>
                        <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between px-2 pt-2">
                     <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setRegStep(1); setError(null); }} className="text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline">
                        {mode === 'login' ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب؟ ادخل'}
                     </button>
                     {mode === 'login' && <span className="text-gray-500 text-[10px] font-black cursor-pointer hover:text-white">نسيت كلمة السر؟</span>}
                  </div>
                </form>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-gray-200 dark:border-white/5"></div>
                  <span className="flex-shrink mx-4 text-xs text-gray-400 font-bold">أو</span>
                  <div className="flex-grow border-t border-gray-200 dark:border-white/5"></div>
                </div>

                <button onClick={handleGoogleLogin} className="w-full py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[1.5rem] text-xs font-black text-gray-600 dark:text-white flex items-center justify-center space-x-3 space-x-reverse active:scale-95 transition-all">
                   <Chrome size={20} className="text-red-500" />
                   <span>المتابعة عبر Google</span>
                </button>
              </>
            )}

            {error && <p className="text-xs text-red-500 font-black text-center animate-bounce pt-4">{error}</p>}
            
            <p className="text-[8px] text-gray-500 text-center font-bold uppercase tracking-[0.2em] pt-4">By continuing, you agree to the Sovereign Charter</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
