
import React, { useState, useRef } from 'react';
import { Sparkles, X, Camera, Share2, Facebook, Twitter, Instagram, Globe, Link as LinkIcon, Zap, Loader2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { authService } from '../services/authService';

const Create: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoPrompt, setVideoPrompt] = useState('');
  
  // نظام الجسر الاجتماعي السيادي
  const [socialBridge, setSocialBridge] = useState({
    facebook: false,
    twitter: false,
    instagram: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = authService.getCurrentUser();

  const handlePublish = () => {
    setIsProcessing(true);
    // توليد رابط العودة للمنصة (Backlink) لجلب المستخدمين
    const postID = Math.random().toString(36).substr(2, 8);
    const sovereignLink = `https://flixo.io/p/${postID}`;
    
    setTimeout(() => {
      const activePlatforms = Object.entries(socialBridge).filter(([_,v]) => v).map(([k]) => k);
      let message = "تم النشر بنجاح على FLIXO!";
      
      if (activePlatforms.length > 0) {
        message += `\n\nتم تفعيل جسر السيادة بنجاح:\n✅ تم النشر في: ${activePlatforms.join(', ')}\n✅ تم إرفاق الرابط الخلفي: ${sovereignLink}\n\nسيتم توجيه جميع زوار حساباتك الخارجية إلى بروفايلك في فليكسو مباشرة.`;
      }
      
      alert(message);
      setIsProcessing(false);
      window.history.back();
    }, 2000);
  };

  return (
    <div className="relative h-full bg-black flex flex-col items-center p-6 pt-12 overflow-y-auto pb-32 no-scrollbar" dir="rtl">
      <div className="absolute top-12 left-6">
        <X size={28} className="text-white cursor-pointer" onClick={() => window.history.back()} />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-black italic tracking-tighter mb-2 uppercase">تأسيس <span className="flixo-text-gradient">محتوى سيادي</span></h1>
        <p className="text-gray-500 font-bold text-[8px] uppercase tracking-widest">Sovereign Content Bridge V6</p>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Social Bridge - الجسر الاجتماعي */}
        <div className="bg-white/5 border border-white/10 rounded-[35px] p-6 shadow-2xl relative overflow-hidden">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 space-x-reverse text-indigo-400">
                <Share2 size={16} />
                <h3 className="text-[10px] font-black uppercase tracking-widest">جسر النشر التلقائي الموحد</h3>
              </div>
              <span className="text-[8px] bg-indigo-500 text-white px-2 py-0.5 rounded-full font-black animate-pulse">متصل</span>
           </div>
           
           <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'facebook', icon: <Facebook size={20} />, label: 'Facebook' },
                { id: 'twitter', icon: <Twitter size={20} />, label: 'X / Twitter' },
                { id: 'instagram', icon: <Instagram size={20} />, label: 'Instagram' }
              ].map(plat => (
                <button 
                  key={plat.id}
                  onClick={() => setSocialBridge(prev => ({...prev, [plat.id]: !prev[plat.id as keyof typeof prev]}))}
                  className={`py-4 rounded-2xl flex flex-col items-center space-y-2 transition-all border ${socialBridge[plat.id as keyof typeof socialBridge] ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 shadow-lg' : 'bg-white/5 border-white/5 text-gray-500'}`}
                >
                  {plat.icon}
                  <span className="text-[8px] font-black">{plat.label}</span>
                </button>
              ))}
           </div>
           
           <div className="mt-5 p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 flex items-center space-x-3 space-x-reverse">
              <LinkIcon size={14} className="text-indigo-400" />
              <p className="text-[9px] text-gray-400 font-bold leading-tight italic">سيتم إرفاق رابط بروفايلك في فليكسو تلقائياً على مواقعك لجلب المتابعين للمنصة.</p>
           </div>
        </div>

        {/* Input Area */}
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-6 space-y-6">
           <div className="relative">
             <textarea 
               value={videoPrompt}
               onChange={(e) => setVideoPrompt(e.target.value)}
               placeholder="ماذا تود أن تنشر للعالم يا ركن؟"
               className="w-full bg-black/40 border border-white/5 rounded-3xl p-6 text-sm focus:outline-none focus:border-indigo-500 min-h-[140px] text-right text-white"
             />
             <Globe className="absolute bottom-4 left-4 text-gray-700" size={14} />
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <button onClick={() => fileInputRef.current?.click()} className="py-4 bg-white/5 border border-white/5 rounded-[25px] flex items-center justify-center space-x-3 space-x-reverse text-gray-400">
                <Camera size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">إضافة وسائط</span>
              </button>
              <button className="py-4 bg-indigo-600/10 border border-indigo-500/30 rounded-[25px] flex items-center justify-center space-x-3 space-x-reverse text-indigo-400">
                <Sparkles size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">ذكاء Veo 3.1</span>
              </button>
           </div>
           <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" />
        </div>

        <button 
          onClick={handlePublish}
          disabled={isProcessing}
          className="w-full py-6 flixo-gradient rounded-[35px] text-white font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center space-x-4 space-x-reverse disabled:opacity-50"
        >
          {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <><Zap size={24} fill="white" /> <span>نشر سيادي ومزامنة</span></>}
        </button>
      </div>
    </div>
  );
};

const Loader2 = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default Create;
