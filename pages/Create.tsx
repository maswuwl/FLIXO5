
import React, { useState, useRef } from 'react';
import { Video, Zap, Sparkles, X, Wand2, Palette, Film, Hash, Type, Camera, RefreshCcw, Smile, Ghost, UserCircle2, Download, Baby } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { GoogleGenAI } from "@google/genai";

const Create: React.FC = () => {
  const [rawCaption, setRawCaption] = useState('');
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [aiLabResults, setAiLabResults] = useState<{ hashtags: string[], caption: string } | null>(null);

  // Morph State
  const [isMorphing, setIsMorphing] = useState(false);
  const [morphedImage, setMorphedImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setIsMorphing(true);
    const result = await geminiService.morphFace(selectedImage, type);
    if (result) {
      setMorphedImage(result);
    } else {
      alert("تعذر تنفيذ المسخ.. تأكد من وضوح الوجوه!");
    }
    setIsMorphing(false);
  };

  const handleAILab = async () => {
    if (!rawCaption) return;
    setIsGeneratingTags(true);
    const ideas = await geminiService.suggestContent([rawCaption]);
    if (ideas && ideas.length > 0) {
      setAiLabResults({
        hashtags: ideas[0].hashtags || ['#FLIXO', '#Trend'],
        caption: ideas[0].title + ": " + ideas[0].description
      });
    }
    setIsGeneratingTags(false);
  };

  return (
    <div className="relative h-full bg-black flex flex-col items-center p-6 pt-12 overflow-y-auto pb-32 no-scrollbar" dir="rtl">
      <div className="absolute top-12 left-6">
        <X size={28} className="text-white cursor-pointer" onClick={() => window.history.back()} />
      </div>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-black italic tracking-tighter mb-2">مختبر <span className="flixo-text-gradient uppercase tracking-widest">المبدعين</span></h1>
        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">تكنولوجيا السيادة الذهبية - خالد المنتصر</p>
      </div>

      {/* FLIXO Morph (المسخ الذكي) */}
      <div className="w-full max-w-md bg-gradient-to-tr from-yellow-900/20 via-black to-pink-900/20 border border-white/10 rounded-[40px] p-6 mb-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 space-x-reverse text-yellow-500">
            <Smile size={20} className="animate-bounce" />
            <h3 className="font-black text-sm uppercase tracking-widest italic">FLIXO AI Morph (المسخ الفكاهي)</h3>
          </div>
          <span className="text-[8px] bg-yellow-500 text-black px-2 py-0.5 rounded-full font-black animate-pulse">جديد</span>
        </div>

        {morphedImage ? (
          <div className="relative rounded-3xl overflow-hidden aspect-square bg-black border border-yellow-500/30 mb-4 animate-fade-in shadow-2xl">
            <img src={morphedImage} className="w-full h-full object-cover" alt="Morphed" />
            <div className="absolute top-4 right-4 flex space-x-2 space-x-reverse">
              <button onClick={() => setMorphedImage(null)} className="p-3 bg-black/60 rounded-full text-white backdrop-blur-md border border-white/10 active:scale-90 transition-transform"><RefreshCcw size={16} /></button>
              <button onClick={() => setMorphedImage(null)} className="p-3 bg-black/60 rounded-full text-white backdrop-blur-md border border-white/10 active:scale-90 transition-transform"><X size={16} /></button>
            </div>
            <div className="absolute bottom-4 inset-x-4">
              <button className="w-full py-4 bg-yellow-500 text-black rounded-2xl font-black text-xs flex items-center justify-center space-x-2 space-x-reverse shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                <Download size={18} />
                <span>نشر النتيجة المضحكة</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-video rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden group hover:border-yellow-500/50 transition-all cursor-pointer bg-white/5"
            >
              {selectedImage ? (
                <img src={selectedImage} className="w-full h-full object-cover opacity-60" />
              ) : (
                <div className="flex flex-col items-center text-gray-500 group-hover:text-yellow-500 transition-colors">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-3">
                    <Camera size={32} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">التقط صورة لتبدأ المسخ</span>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleMorph('a funny realistic monkey with human-like expressions and large ears')}
                disabled={isMorphing || !selectedImage}
                className="py-5 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-2xl text-[10px] font-black uppercase tracking-wider flex flex-col items-center justify-center space-y-2 hover:from-yellow-600/30 hover:to-orange-600/30 transition-all active:scale-95"
              >
                <div className="text-2xl">🐒</div>
                <span>مسخ القرد المضحك</span>
              </button>
              <button 
                onClick={() => handleMorph('funny wide-mouthed space alien with glowing eyes')}
                disabled={isMorphing || !selectedImage}
                className="py-5 bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30 rounded-2xl text-[10px] font-black uppercase tracking-wider flex flex-col items-center justify-center space-y-2 hover:from-pink-600/30 hover:to-purple-600/30 transition-all active:scale-95"
              >
                <div className="text-2xl">👽</div>
                <span>كائن فضائي فكاهي</span>
              </button>
              <button 
                onClick={() => handleMorph('cute baby face with giant sparkling eyes')}
                disabled={isMorphing || !selectedImage}
                className="py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-wider flex flex-col items-center justify-center space-y-2 hover:bg-white/10 transition-all active:scale-95"
              >
                <div className="text-2xl">👶</div>
                <span>وجه الطفل اللطيف</span>
              </button>
              <button 
                onClick={() => handleMorph('funny exaggerated goat face')}
                disabled={isMorphing || !selectedImage}
                className="py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-wider flex flex-col items-center justify-center space-y-2 hover:bg-white/10 transition-all active:scale-95"
              >
                <div className="text-2xl">🐐</div>
                <span>مسخ الماعز الغريب</span>
              </button>
            </div>

            {isMorphing && (
              <div className="flex flex-col items-center space-y-3 py-6">
                <div className="relative w-16 h-16">
                   <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-full"></div>
                   <div className="absolute inset-0 border-4 border-t-yellow-500 rounded-full animate-spin"></div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest animate-pulse">جاري سحب الملامح...</span>
                  <p className="text-[8px] text-gray-500 mt-1 italic">FLIXO Morph Engine V2.0 Active</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* مساعد المحتوى */}
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-[40px] p-6 mb-8">
        <div className="flex items-center space-x-2 space-x-reverse mb-6 text-pink-400">
          <Wand2 size={20} />
          <h3 className="font-black text-sm uppercase tracking-widest italic">مساعد المحتوى الذكي</h3>
        </div>
        <textarea value={rawCaption} onChange={(e) => setRawCaption(e.target.value)} placeholder="صف فكرتك وسأحولها لعنوان وهاشتاقات ترند..." className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 min-h-[80px] text-white" />
        <button onClick={handleAILab} disabled={isGeneratingTags || !rawCaption} className="w-full mt-4 py-5 rounded-2xl font-black text-xs flex items-center justify-center space-x-2 space-x-reverse bg-white text-black active:scale-95 shadow-xl transition-all">
          {isGeneratingTags ? <div className="w-4 h-4 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div> : <><Sparkles size={16} /><span>تحسين المنشور بذكاء FLIXO</span></>}
        </button>
      </div>
    </div>
  );
};

export default Create;
