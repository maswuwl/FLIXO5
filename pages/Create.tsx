
import React, { useState, useRef } from 'react';
import { Wand2, Sparkles, X, RefreshCcw, Camera, Download, Smile, FileCode, Box, Layers, Coins, Video, Play, AlertCircle, Info } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { authService } from '../services/authService';

const Create: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [morphedImage, setMorphedImage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [labView, setLabView] = useState<'video' | 'morph' | 'analysis'>('video');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [loadingStep, setLoadingStep] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = authService.getCurrentUser();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleMorph = async (type: string) => {
    if (!selectedImage) return;
    setIsProcessing(true);
    const result = await geminiService.morphFace(selectedImage, type);
    if (result) setMorphedImage(result);
    setIsProcessing(false);
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) return;

    // Veo check requirement
    if (typeof (window as any).aistudio?.hasSelectedApiKey === 'function') {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
      }
    }

    setIsProcessing(true);
    setLoadingStep('جاري تهيئة خوارزميات Veo 3.1 السيادية...');
    
    const steps = [
      'جاري تحليل الرؤية الفنية...',
      'توليد الإطارات المفتاحية بدقة عالية...',
      'تنسيق الحركة والعمق البصري...',
      'اللمسات النهائية للسيادة...'
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setLoadingStep(steps[stepIdx]);
        stepIdx++;
      }
    }, 15000);

    try {
      const url = await geminiService.generateSovereignVideo(videoPrompt);
      setVideoUrl(url);
    } catch (error) {
      alert("تعذر توليد الفيديو حالياً. يرجى التأكد من رصيد API.");
    } finally {
      clearInterval(interval);
      setIsProcessing(false);
      setLoadingStep('');
    }
  };

  const handleRemoveWatermark = () => {
     alert("بصفتك سيادياً، يمكنك إزالة العلامة المائية مقابل 500 FX (محاكاة)");
  };

  return (
    <div className="relative h-full bg-black flex flex-col items-center p-6 pt-12 overflow-y-auto pb-32 no-scrollbar" dir="rtl">
      <div className="absolute top-12 left-6">
        <X size={28} className="text-white cursor-pointer" onClick={() => window.history.back()} />
      </div>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-black italic tracking-tighter mb-2">مختبر <span className="flixo-text-gradient uppercase tracking-widest">المبدعين</span></h1>
        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Sovereign Innovation Lab • Khalid Almontaser</p>
      </div>

      <div className="flex bg-white/5 rounded-2xl p-1 mb-8 w-full max-w-md border border-white/5 overflow-x-auto no-scrollbar">
         <button onClick={() => setLabView('video')} className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black transition-all whitespace-nowrap ${labView === 'video' ? 'bg-white text-black shadow-lg' : 'text-gray-500'}`}>توليد فيديو (Veo)</button>
         <button onClick={() => setLabView('morph')} className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black transition-all whitespace-nowrap ${labView === 'morph' ? 'bg-white text-black shadow-lg' : 'text-gray-500'}`}>المسخ الذكي (Morph)</button>
         <button onClick={() => setLabView('analysis')} className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black transition-all whitespace-nowrap ${labView === 'analysis' ? 'bg-white text-black shadow-lg' : 'text-gray-500'}`}>تحليل الملفات</button>
      </div>

      {labView === 'video' && (
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          {videoUrl ? (
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-6 shadow-2xl">
              <video src={videoUrl} controls autoPlay loop className="w-full rounded-3xl mb-6 shadow-2xl border border-white/10" />
              <div className="flex flex-col space-y-3">
                <button className="w-full py-5 flixo-gradient text-white rounded-2xl font-black text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-2 space-x-reverse">
                  <Play size={18} /> <span>نشر في الخلاصات</span>
                </button>
                <button onClick={() => setVideoUrl(null)} className="w-full py-4 bg-white/5 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest">توليد فيديو جديد</button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-indigo-900/20 to-black border border-white/10 rounded-[40px] p-8 text-center space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Video size={120} />
              </div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-indigo-600/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border border-indigo-500/30">
                  <Video size={32} className="text-indigo-400" />
                </div>
                <h3 className="text-xl font-black italic mb-2">توليد فيديو بالذكاء السيادي</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">استخدم محرك Veo 3.1 لتحويل وصفك النصي إلى ملحمة بصرية عالية الدقة.</p>
              </div>

              <div className="space-y-4">
                <textarea 
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder="اصف المشهد السيادي.. مثلاً: 'رجل بزي ملكي ذهبي يمشي في مدينة مستقبلية فوق السحاب'"
                  className="w-full bg-black/40 border border-white/10 rounded-3xl p-6 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[120px]"
                />
                
                <div className="bg-yellow-500/5 border border-yellow-500/10 p-4 rounded-2xl flex items-start space-x-3 space-x-reverse text-right">
                  <Info size={16} className="text-yellow-500 mt-1 shrink-0" />
                  <p className="text-[9px] text-gray-400 font-bold leading-relaxed">
                    ملاحظة: توليد الفيديو يتطلب اشتراكاً سيادياً وقد يستغرق بضع دقائق لضمان أقصى جودة بصرية.
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-yellow-500 mr-1 underline">تفاصيل الفوترة</a>
                  </p>
                </div>

                <button 
                  onClick={handleGenerateVideo}
                  disabled={isProcessing || !videoPrompt.trim()}
                  className="w-full py-5 flixo-gradient text-white rounded-2xl font-black text-sm shadow-2xl active:scale-95 transition-all flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-xs">{loadingStep}</span>
                    </div>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      <span>بدء التوليد السيادي</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {labView === 'morph' && (
        <div className="w-full max-w-md bg-gradient-to-tr from-yellow-900/20 via-black to-pink-900/20 border border-white/10 rounded-[40px] p-6 shadow-2xl animate-fade-in">
           {morphedImage ? (
             <div className="relative rounded-3xl overflow-hidden aspect-square bg-black border border-yellow-500/30 mb-4 animate-fade-in shadow-2xl">
                <img src={morphedImage} className="w-full h-full object-cover" alt="Morphed" />
                <div className="absolute top-4 right-4 flex space-x-2 space-x-reverse">
                  <button onClick={() => setMorphedImage(null)} className="p-3 bg-black/60 rounded-full text-white backdrop-blur-md border border-white/10 active:scale-90 transition-transform"><RefreshCcw size={16} /></button>
                </div>
                <div className="absolute bottom-4 inset-x-4 flex flex-col space-y-2">
                   <button onClick={handleRemoveWatermark} className="w-full py-4 bg-indigo-600/90 text-white rounded-2xl font-black text-[10px] flex items-center justify-center space-x-2 space-x-reverse border border-indigo-400/30">
                      <Coins size={14} /> <span>إزالة العلامة المائية (500 FX)</span>
                   </button>
                   <button className="w-full py-4 bg-yellow-500 text-black rounded-2xl font-black text-xs flex items-center justify-center space-x-2 space-x-reverse">
                      <Download size={18} /> <span>نشر المذكرة السيادية</span>
                   </button>
                </div>
             </div>
           ) : (
             <div className="space-y-6">
                <div onClick={() => fileInputRef.current?.click()} className="relative aspect-video rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden group hover:border-yellow-500/50 transition-all cursor-pointer bg-white/5">
                   {selectedImage ? <img src={selectedImage} className="w-full h-full object-cover opacity-60" /> : (
                     <div className="flex flex-col items-center text-gray-500 group-hover:text-yellow-500 transition-colors">
                        <Camera size={32} className="mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest">اختر صورة للبدء</span>
                     </div>
                   )}
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
                <div className="grid grid-cols-2 gap-3">
                   <button onClick={() => handleMorph('realistic funny monkey')} disabled={isProcessing || !selectedImage} className="py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-wider flex flex-col items-center justify-center space-y-2 hover:bg-white/10 active:scale-95 transition-all">
                      <span className="text-2xl">🐒</span> <span>مسخ القرد</span>
                   </button>
                   <button onClick={() => handleMorph('cute pixel art character')} disabled={isProcessing || !selectedImage} className="py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-wider flex flex-col items-center justify-center space-y-2 hover:bg-white/10 active:scale-95 transition-all">
                      <span className="text-2xl">👾</span> <span>تحويل لبكسل</span>
                   </button>
                </div>
                {isProcessing && <div className="text-center py-4 text-[10px] font-black text-yellow-500 animate-pulse">جاري تشكيل الملامح السيادية...</div>}
             </div>
           )}
        </div>
      )}

      {labView === 'analysis' && (
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-[40px] p-8 text-center space-y-8 animate-fade-in">
           <div className="w-20 h-20 bg-indigo-600/10 rounded-[2rem] flex items-center justify-center mx-auto border border-indigo-500/20">
              <Layers size={40} className="text-indigo-400" />
           </div>
           <div>
              <h3 className="text-xl font-black italic mb-2">محرك معالجة الملفات</h3>
              <p className="text-xs text-gray-500 font-medium">ارفع أي ملف (فيديو، صورة، كود) وسأقوم بتحليله وتطويره فوراً باستخدام ذكاء فليكسو المركزي.</p>
           </div>
           <button className="w-full py-5 bg-indigo-600 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 space-x-reverse shadow-xl active:scale-95 transition-all">
              <Box size={18} /> <span>بدء تحليل ملف سيادي</span>
           </button>
           <p className="text-[8px] text-gray-700 uppercase font-black tracking-widest">Sovereign Encryption Active • V5.1</p>
        </div>
      )}
    </div>
  );
};

export default Create;
