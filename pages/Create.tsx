
import React, { useState, useRef } from 'react';
import { Sparkles, X, Camera, Share2, Facebook, Twitter, Instagram, Globe, Zap, Loader2, Monitor, ShieldCheck, Send, Image as ImageIcon } from 'lucide-react';
import { authService } from '../services/authService';

const Create: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isPublishable = content.trim().length > 0 || selectedImage !== null;

  const handlePublish = () => {
    if (!isPublishable) return;
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
      {/* Header Bar */}
      <div className="absolute top-12 left-0 right-0 px-6 flex items-center justify-between z-50">
        <button 
          onClick={() => window.history.back()}
          className="p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all active:scale-90"
        >
          <X size={24} />
        </button>

        {isPublishable && (
          <button 
            onClick={handlePublish}
            disabled={isProcessing}
            className="flex items-center space-x-2 space-x-reverse bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 rounded-2xl text-white font-black text-xs shadow-xl shadow-pink-500/20 animate-fade-in active:scale-95 transition-all disabled:opacity-50"
          >
            {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> <span>نشر الآن</span></>}
          </button>
        )}
      </div>

      <div className="text-center mb-8 mt-12">
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

        {/* منطقة الكتابة والمعاينة */}
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-6 space-y-6">
           <textarea 
             value={content}
             onChange={(e) => setContent(e.target.value)}
             placeholder="اكتب فكرتك السيادية.. سيتكفل فليكسو بنشرها في إمبراطوريتك الرقمية."
             className="w-full bg-black/40 border border-white/5 rounded-3xl p-6 text-sm focus:outline-none focus:border-indigo-500 min-h-[140px] text-right text-white"
           />

           {selectedImage && (
             <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 animate-scale-in">
               <img src={selectedImage} className="w-full h-full object-cover" alt="preview" />
               <button 
                 onClick={() => setSelectedImage(null)}
                 className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-full text-white"
               >
                 <X size={16} />
               </button>
               <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                 <span className="text-[8px] font-black text-white uppercase tracking-widest">صورة مختارة</span>
               </div>
             </div>
           )}
           
           <div className="grid grid-cols-2 gap-4">
              <button onClick={() => fileInputRef.current?.click()} className="py-4 bg-white/5 border border-white/5 rounded-[25px] flex items-center justify-center space-x-3 space-x-reverse text-gray-400 active:scale-95 transition-all hover:bg-white/10">
                <Camera size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">وسائط</span>
              </button>
              <button className="py-4 bg-indigo-600/10 border border-indigo-500/30 rounded-[25px] flex items-center justify-center space-x-3 space-x-reverse text-indigo-400 active:scale-95 transition-all hover:bg-indigo-600/20">
                <Sparkles size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">ذكاء Veo</span>
              </button>
           </div>
           <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
        </div>

        {/* Bottom Primary Button */}
        <button 
          onClick={handlePublish}
          disabled={isProcessing || !isPublishable}
          className="w-full py-6 flixo-gradient rounded-[35px] text-white font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center space-x-4 space-x-reverse disabled:opacity-50"
        >
          {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <><Zap size={24} fill="white" /> <span>نشر سيادي وشامل</span></>}
        </button>
      </div>
    </div>
  );
};

export default Create;
