
import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Camera, Image as ImageIcon, X, ChevronLeft, Brain, Save, CheckCircle2, Sparkles, Wand2 } from 'lucide-react';
import { MOCK_USERS } from '../constants';
import CelebrityBadge from '../components/CelebrityBadge';
import ProfileGuard from '../components/ProfileGuard';
import { useNavigate } from 'react-router-dom';
import { geminiService } from '../services/geminiService';
import { authService } from '../services/authService';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    return authService.getCurrentUser() || MOCK_USERS[0];
  });
  
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user.celebrityTier === 0;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setUser(prev => ({ ...prev, avatar: base64 }));
        setHasChanges(true);
        setShowImagePicker(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfileChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      authService.updateUser(user);
      setIsSaving(false);
      setHasChanges(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  const handleSovereignInsight = async () => {
    setIsAnalyzing(true);
    const prompt = `بصفتك مستشار نظام FLIXO، حلل ملف هذا المستخدم: ${user.displayName}. أعطه نصيحة واحدة فخمة لزيادة نفوذه وتفاعله بناءً على استراتيجيات السيادة.`;
    const result = await geminiService.askExpert(prompt);
    setAiInsight(result.text);
    setIsAnalyzing(false);
  };

  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    const newBio = await geminiService.generateSovereignBio(user);
    if (newBio) {
      setUser(prev => ({ ...prev, bio: newBio }));
      setHasChanges(true);
    }
    setIsGeneratingBio(false);
  };

  return (
    <div className="flex flex-col h-full bg-inherit overflow-y-auto pb-40 no-scrollbar" dir="rtl">
      <div className="relative h-64">
        <div className="absolute top-12 right-6 z-20">
          <button onClick={() => navigate('/')} className="p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white active:scale-90 transition-transform">
            <ChevronLeft size={24} />
          </button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 via-transparent to-black"></div>
        
        <div className="absolute bottom-0 left-1/2 translate-x-1/2 translate-y-1/2 flex flex-col items-center">
          <div className="relative cursor-pointer group" onClick={() => setShowImagePicker(true)}>
            <ProfileGuard isActive={true} size="lg" isSovereign={isAdmin}>
              <div className={`w-32 h-32 rounded-full p-1 transition-transform group-hover:scale-105 duration-500 ${isAdmin ? 'bg-yellow-500 shadow-[0_0_50px_rgba(245,158,11,0.5)]' : 'flixo-gradient'}`}>
                <img src={user.avatar} className="w-full h-full rounded-full border-4 border-black object-cover" alt="Profile" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={32} className="text-white animate-pulse" />
                </div>
              </div>
            </ProfileGuard>
          </div>
        </div>
      </div>

      <div className="mt-20 text-center px-8 space-y-4">
        <div className="flex items-center justify-center space-x-2 space-x-reverse">
          <h1 className="text-3xl font-black tracking-tight text-white">{user.displayName}</h1>
          <CelebrityBadge tier={user.celebrityTier as any} size={22} />
        </div>
        <p className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] italic">Strategic Sovereign Leader</p>
        
        {user.bio && (
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <p className="text-xs text-gray-300 font-bold leading-relaxed">{user.bio}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleSovereignInsight}
            disabled={isAnalyzing}
            className="py-5 flixo-gradient rounded-[25px] flex items-center justify-center space-x-2 space-x-reverse shadow-xl active:scale-95 transition-all"
          >
            {isAnalyzing ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Brain size={16} className="text-white" />
                <span className="text-white font-black text-[10px]">بصيرة السيادة</span>
              </>
            )}
          </button>

          <button 
            onClick={handleGenerateBio}
            disabled={isGeneratingBio}
            className="py-5 bg-white/5 border border-white/10 rounded-[25px] flex items-center justify-center space-x-2 space-x-reverse shadow-xl active:scale-95 transition-all"
          >
            {isGeneratingBio ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Wand2 size={16} className="text-yellow-500" />
                <span className="text-white font-black text-[10px]">توليد Bio فخم</span>
              </>
            )}
          </button>
        </div>

        {aiInsight && (
          <div className="mt-4 p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-[30px] animate-slide-up text-right relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1 h-full bg-indigo-500"></div>
            <p className="text-xs text-indigo-200 font-bold italic leading-relaxed">{aiInsight}</p>
          </div>
        )}

        {hasChanges && (
          <button 
            onClick={saveProfileChanges}
            disabled={isSaving}
            className="w-full py-5 bg-yellow-500 text-black rounded-[25px] flex items-center justify-center space-x-3 space-x-reverse shadow-[0_20px_50px_rgba(245,158,11,0.4)] active:scale-95 transition-all font-black text-sm uppercase italic"
          >
            {isSaving ? <div className="w-5 h-5 border-3 border-black/30 border-t-black rounded-full animate-spin"></div> : <span>حفظ التغييرات السيادية</span>}
          </button>
        )}

        {showSuccess && (
          <div className="flex items-center justify-center space-x-2 space-x-reverse text-green-500 animate-pulse py-2">
            <CheckCircle2 size={16} />
            <span className="text-xs font-black">تم تحديث السجلات السيادية بنجاح</span>
          </div>
        )}

        <div className="mt-12 flex justify-around pb-10 border-b border-white/5">
          <div className="text-center">
            <span className="block font-black text-2xl text-white">10M</span>
            <span className="text-[9px] text-gray-500 font-black uppercase">متابع</span>
          </div>
          <div className="text-center border-x border-white/5 px-8">
            <span className="block font-black text-2xl text-white">50M</span>
            <span className="text-[9px] text-gray-500 font-black uppercase">إعجاب</span>
          </div>
          <div className="text-center">
            <span className="block font-black text-2xl text-white">0</span>
            <span className="text-[9px] text-gray-500 font-black uppercase">أتابعهم</span>
          </div>
        </div>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
    </div>
  );
};

export default Profile;
