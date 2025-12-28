
import React, { useState, useRef } from 'react';
import { ShieldCheck, Camera, Image as ImageIcon, X, Check, ChevronLeft, CreditCard, Sparkles, Brain, Zap, Wand2 } from 'lucide-react';
import { MOCK_USERS } from '../constants';
import CelebrityBadge from '../components/CelebrityBadge';
import ProfileGuard from '../components/ProfileGuard';
import { useNavigate } from 'react-router-dom';
import { geminiService } from '../services/geminiService';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(MOCK_USERS[0]); // خالد المنتصر
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user.celebrityTier === 0;

  const handleSovereignInsight = async () => {
    setIsAnalyzing(true);
    const prompt = `بصفتك مستشار نظام FLIXO، حلل ملف هذا المستخدم: ${user.displayName}، صاحب البايو: ${user.bio}. أعطه نصيحة واحدة ذهبية ومختصرة جداً لزيادة نفوذه وتأثيره على المنصة بأسلوب فخم.`;
    const result = await geminiService.askExpert(prompt);
    setAiInsight(result.text);
    setIsAnalyzing(false);
  };

  return (
    <div className="flex flex-col h-full bg-black overflow-y-auto pb-32 no-scrollbar" dir="rtl">
      {/* رأس الصفحة */}
      <div className="relative h-64">
        <div className="absolute top-12 right-6 z-20">
          <button onClick={() => navigate('/')} className="p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
            <ChevronLeft size={24} />
          </button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/10 via-black/40 to-black"></div>
        
        <div className="absolute bottom-0 left-1/2 translate-x-1/2 translate-y-1/2 flex flex-col items-center">
          <div className="relative cursor-pointer group" onClick={() => setShowImagePicker(true)}>
            <ProfileGuard isActive={true} size="lg" isSovereign={isAdmin}>
              <div className={`w-32 h-32 rounded-full p-1 transition-transform group-hover:scale-105 ${isAdmin ? 'bg-yellow-500 shadow-[0_0_40px_rgba(245,158,11,0.4)]' : 'liveo-gradient'}`}>
                <img src={user.avatar} className="w-full h-full rounded-full border-4 border-black object-cover" alt="Profile" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={32} className="text-white" />
                </div>
              </div>
            </ProfileGuard>
          </div>
        </div>
      </div>

      <div className="mt-20 text-center px-8">
        <div className="flex items-center justify-center space-x-2 space-x-reverse">
          <h1 className="text-3xl font-black tracking-tight">{user.displayName}</h1>
          <CelebrityBadge tier={user.celebrityTier as any} size={22} />
        </div>
        <p className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">Supreme Strategic Leader</p>
        
        {/* زر بصيرة السيادة الذكي */}
        <button 
          onClick={handleSovereignInsight}
          disabled={isAnalyzing}
          className="mt-6 w-full py-4 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-[25px] flex items-center justify-center space-x-3 space-x-reverse shadow-[0_0_30px_rgba(245,158,11,0.3)] active:scale-95 transition-all group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:-translate-x-full transition-transform duration-1000 skew-x-12"></div>
          {isAnalyzing ? (
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
          ) : (
            <>
              <Brain size={20} className="text-black" />
              <span className="text-black font-black text-xs uppercase italic">بصيرة السيادة (AI Insight)</span>
            </>
          )}
        </button>

        {aiInsight && (
          <div className="mt-4 p-5 bg-yellow-500/10 border border-yellow-500/20 rounded-[30px] animate-slide-up text-right">
            <div className="flex items-center mb-2 text-yellow-500">
               <Zap size={14} className="ml-2 animate-pulse" />
               <span className="text-[10px] font-black uppercase">رؤية فليكسو الاستراتيجية:</span>
            </div>
            <p className="text-xs text-yellow-200/90 leading-relaxed font-bold italic">{aiInsight}</p>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-4 text-right">
          <div className="p-5 bg-white/5 border border-white/5 rounded-[35px] flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-2xl">
                <ShieldCheck size={24} />
              </div>
              <div>
                <span className="block text-sm font-black text-white">درع الخصوصية الملكي</span>
                <p className="text-[10px] text-gray-500 italic">حسابك محمي من محاولات التسلل والتصوير.</p>
              </div>
            </div>
            <div className="w-2 h-2 bg-yellow-500 shadow-[0_0_10px_rgba(245,158,11,0.8)] rounded-full animate-ping"></div>
          </div>
        </div>

        <div className="flex justify-around mt-12 pb-10 border-b border-white/5">
          <div className="text-center">
            <span className="block font-black text-2xl text-white">10M</span>
            <span className="text-[9px] text-gray-500 font-black uppercase mt-1">متابع</span>
          </div>
          <div className="text-center border-x border-white/5 px-8">
            <span className="block font-black text-2xl text-white">50M</span>
            <span className="text-[9px] text-gray-500 font-black uppercase mt-1">إعجاب</span>
          </div>
          <div className="text-center">
            <span className="block font-black text-2xl text-white">0</span>
            <span className="text-[9px] text-gray-500 font-black uppercase mt-1">أتابعهم</span>
          </div>
        </div>
      </div>

      {/* نافذة اختيار الصورة */}
      {showImagePicker && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-end animate-slide-up">
          <div className="w-full bg-[#080808] rounded-t-[50px] p-8 border-t border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black italic">تحديث صورتك الشخصية</h3>
              <button onClick={() => setShowImagePicker(false)} className="p-3 bg-white/5 rounded-full"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setShowCamera(true)} className="p-8 bg-white/5 border border-white/10 rounded-[35px] flex flex-col items-center space-y-3 hover:bg-yellow-500/10 transition-colors">
                <div className="p-4 bg-yellow-500/20 rounded-2xl text-yellow-500"><Camera size={32} /></div>
                <span className="font-black text-xs uppercase">التقاط بالكاميرا</span>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="p-8 bg-white/5 border border-white/10 rounded-[35px] flex flex-col items-center space-y-3 hover:bg-blue-500/10 transition-colors">
                <div className="p-4 bg-blue-500/20 rounded-2xl text-blue-500"><ImageIcon size={32} /></div>
                <span className="font-black text-xs uppercase">من الاستوديو</span>
              </button>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
