
import React, { useState, useRef } from 'react';
import { Sparkles, X, Camera, Share2, Facebook, Twitter, Instagram, Globe, Zap, Loader2, Monitor, ShieldCheck } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { authService } from '../services/authService';

const Create: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [content, setContent] = useState('');
  
  const currentUser = authService.getCurrentUser();

  // نظام الجسر الاجتماعي والويب السيادي
  const [socialBridge, setSocialBridge] = useState({
    facebook: false,
    twitter: false,
    instagram: false
  });

  // تتبع المواقع الشخصية المختارة للنشر
  const [selectedWebsites, setSelectedWebsites] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleWebsiteSelection = (id: string) => {
    setSelectedWebsites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handlePublish = () => {
    if (!content.trim()) return;
    setIsProcessing(true);
    
    // محاكاة النشر الموحد
    setTimeout(() => {
      const activePlatforms = Object.entries(socialBridge).filter(([_,v]) => v).map(([k]) => k);
      const activeWebsites = currentUser?.socialLinks?.linkedAssets?.filter(a => selectedWebsites.includes(a.id)).map(a => a.label) || [];
      
      let message = "تم النشر بنجاح على FLIXO!";
      
      if (activePlatforms.length > 0 || activeWebsites.length > 0) {
        message += `\n\nتم تفعيل جسر السيادة الموحد:`;
        if (activePlatforms.length > 0) message += `\n✅ المنصات الاجتماعية: ${activePlatforms.join(', ')}`;
        if (activeWebsites.length > 0) message += `\n✅ مواقعك الشخصية: ${activeWebsites.join(', ')}`;
        message += `\n✅ تم إرفاق الرابط الخلفي (Backlink) لتعزيز الـ SEO.`;
      }
      
      alert(message);
      setIsProcessing(false);
      window.history.back();
    }, 2000);
  };

  return (
    <div className="relative h-full bg-black flex flex-col items-center p-6 pt-12 overflow-y-auto pb-32 no-scrollbar" dir="rtl">
      <div className="absolute top-12 left-6">
        <X size={28} className="text-white cursor-pointer hover:rotate-90 transition-transform" onClick={() => window.history.back()} />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-black italic tracking-tighter mb-2 uppercase">تأسيس <span className="flixo-text-gradient">محتوى سيادي</span></h1>
        <p className="text-gray-500 font-bold text-[8px] uppercase tracking-widest">Sovereign Content Bridge & Web Sync</p>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Social Bridge - الجسر الاجتماعي */}
        <div className="bg-white/5 border border-white/10 rounded-[35px] p-6 shadow-2xl">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 space-x-reverse text-indigo-400">
                <Share2 size={16} />
                <h3 className="text-[10px] font-black uppercase tracking-widest">جسر النشر الاجتماعي</h3>
              </div>
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
        </div>

        {/* Web Assets Bridge - جسر المواقع المرتبطة */}
        {currentUser?.socialLinks?.linkedAssets && currentUser.socialLinks.linkedAssets.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-[35px] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 space-x-reverse text-yellow-500">
                  <Monitor size={16} />
                  <h3 className="text-[10px] font-black uppercase tracking-widest">جسر المواقع الشخصية</h3>
                </div>
            </div>
            
            <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
               {currentUser.socialLinks.linkedAssets.filter(a => a.publishingPermitted).map(asset => (
                 <button 
                    key={asset.id}
                    onClick={() => toggleWebsiteSelection(asset.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${selectedWebsites.includes(asset.id) ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500' : 'bg-white/5 border-white/5 text-gray-500'}`}
                 >
                   <div className="flex items-center space-x-3 space-x-reverse">
                      <Globe size={14} />
                      <span className="text-[10px] font-black">{asset.label}</span>
                   </div>
                   {selectedWebsites.includes(asset.id) && <ShieldCheck size={14} />}
                 </button>
               ))}
            </div>
            <p className="text-[7px] text-gray-500 font-bold mt-3 text-center italic">سيتم النشر كتدوينة أو منشور تلقائي في المواقع المختارة.</p>
          </div>
        )}

        {/* منطقة الكتابة */}
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-6 space-y-6">
           <textarea 
             value={content}
             onChange={(e) => setContent(e.target.value)}
             placeholder="اكتب فكرتك السيادية.. سيتكفل فليكسو بنشرها في إمبراطوريتك الرقمية."
             className="w-full bg-black/40 border border-white/5 rounded-3xl p-6 text-sm focus:outline-none focus:border-indigo-500 min-h-[140px] text-right text-white"
           />
           
           <div className="grid grid-cols-2 gap-4">
              <button onClick={() => fileInputRef.current?.click()} className="py-4 bg-white/5 border border-white/5 rounded-[25px] flex items-center justify-center space-x-3 space-x-reverse text-gray-400 active:scale-95 transition-all">
                <Camera size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">وسائط</span>
              </button>
              <button className="py-4 bg-indigo-600/10 border border-indigo-500/30 rounded-[25px] flex items-center justify-center space-x-3 space-x-reverse text-indigo-400 active:scale-95 transition-all">
                <Sparkles size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">ذكاء Veo</span>
              </button>
           </div>
           <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" />
        </div>

        <button 
          onClick={handlePublish}
          disabled={isProcessing || !content.trim()}
          className="w-full py-6 flixo-gradient rounded-[35px] text-white font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center space-x-4 space-x-reverse disabled:opacity-50"
        >
          {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <><Zap size={24} fill="white" /> <span>نشر سيادي ومزامنة شاملة</span></>}
        </button>
      </div>
    </div>
  );
};

export default Create;
