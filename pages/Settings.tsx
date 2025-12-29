
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Sparkles, ShieldCheck, Moon, Sun, Bell, Lock, User, Info, MessageSquareCode, Palette, Zap, History, EyeOff, Shield, Users } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { geminiService } from '../services/geminiService';
import { authService } from '../services/authService';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = authService.getCurrentUser();
  const [suggestion, setSuggestion] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [uiConfig, setUiConfig] = useState({
    theme: 'gold-sovereign',
    animations: true,
    compactMode: false
  });

  const [privacy, setPrivacy] = useState({
    hiddenProfile: false,
    directMessages: 'everyone',
    activeStatus: true,
    dataSaving: false
  });

  useEffect(() => {
    if (location.state && (location.state as any).suggestion) {
      setSuggestion((location.state as any).suggestion);
    }
  }, [location.state]);

  const handleSendSuggestion = async () => {
    if (!suggestion.trim()) return;
    setIsSending(true);
    const analysis = await geminiService.analyzeSuggestion(suggestion);
    const newMemo = {
      id: Date.now().toString(),
      senderId: currentUser?.id || 'unknown',
      senderName: currentUser?.displayName || 'Unknown',
      content: suggestion,
      category: analysis.category,
      status: 'pending',
      aiAnalysis: analysis.analysis,
      priority: analysis.priority,
      timestamp: new Date().toISOString()
    };
    const saved = JSON.parse(localStorage.getItem('flixo_memos') || '[]');
    localStorage.setItem('flixo_memos', JSON.stringify([...saved, newMemo]));
    setTimeout(() => { setIsSending(false); setSuggestion(''); setShowSuccess(true); setTimeout(() => setShowSuccess(false), 3000); }, 1500);
  };

  return (
    <div className="h-full bg-black text-white flex flex-col overflow-y-auto pb-32 no-scrollbar" dir="rtl">
      <div className="p-6 pt-12 border-b border-white/10 flex items-center space-x-4 space-x-reverse sticky top-0 bg-black/80 backdrop-blur-xl z-20">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-xl"><ChevronLeft size={24} /></button>
        <h1 className="text-2xl font-black italic tracking-tighter">الإعدادات والخصوصية</h1>
      </div>

      <div className="p-6 space-y-8">
        {/* Privacy Section */}
        <div className="space-y-4">
           <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-widest px-2">مركز الخصوصية والسيادة</h4>
           <div className="bg-white/5 border border-white/10 rounded-[35px] overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                 <div className="flex items-center space-x-4 space-x-reverse">
                    <EyeOff size={18} className="text-indigo-400" />
                    <div className="text-right">
                       <span className="text-sm font-bold block">الحساب الخاص</span>
                       <span className="text-[8px] text-gray-500">لا يمكن لغير المتابعين رؤية محتواك</span>
                    </div>
                 </div>
                 <button onClick={() => setPrivacy({...privacy, hiddenProfile: !privacy.hiddenProfile})} className={`w-10 h-5 rounded-full relative transition-colors ${privacy.hiddenProfile ? 'bg-indigo-600' : 'bg-gray-700'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${privacy.hiddenProfile ? 'right-6' : 'right-1'}`}></div>
                 </button>
              </div>
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                 <div className="flex items-center space-x-4 space-x-reverse">
                    <Users size={18} className="text-indigo-400" />
                    <div className="text-right">
                       <span className="text-sm font-bold block">حالة النشاط</span>
                       <span className="text-[8px] text-gray-500">عرض متى كنت متصلاً آخر مرة</span>
                    </div>
                 </div>
                 <button onClick={() => setPrivacy({...privacy, activeStatus: !privacy.activeStatus})} className={`w-10 h-5 rounded-full relative transition-colors ${privacy.activeStatus ? 'bg-indigo-600' : 'bg-gray-700'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${privacy.activeStatus ? 'right-6' : 'right-1'}`}></div>
                 </button>
              </div>
              <div className="p-5 flex items-center justify-between">
                 <div className="flex items-center space-x-4 space-x-reverse">
                    <Shield size={18} className="text-green-500" />
                    <span className="text-sm font-bold">تشفير الرسائل السيادي</span>
                 </div>
                 <span className="text-[9px] font-black text-green-500 uppercase">مفعل</span>
              </div>
           </div>
        </div>

        {/* UI Customization */}
        <div className="space-y-4">
           <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-widest px-2">تخصيص الواجهة</h4>
           <div className="bg-white/5 border border-white/10 rounded-[35px] overflow-hidden">
              <button className="w-full flex items-center justify-between p-5 border-b border-white/5 hover:bg-white/10 transition-all">
                 <div className="flex items-center space-x-4 space-x-reverse">
                    <Palette size={18} className="text-yellow-500" />
                    <span className="text-sm font-bold">سمة الواجهة: Gold Sovereign</span>
                 </div>
                 <Zap size={14} className="text-yellow-500 animate-pulse" />
              </button>
              <div className="flex items-center justify-between p-5">
                 <div className="flex items-center space-x-4 space-x-reverse">
                    <Sun size={18} className="text-blue-400" />
                    <span className="text-sm font-bold">الأنيميشن السلس</span>
                 </div>
                 <button onClick={() => setUiConfig({...uiConfig, animations: !uiConfig.animations})} className={`w-10 h-5 rounded-full relative transition-colors ${uiConfig.animations ? 'bg-indigo-600' : 'bg-gray-700'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${uiConfig.animations ? 'right-6' : 'right-1'}`}></div>
                 </button>
              </div>
           </div>
        </div>

        {/* Suggestion Box */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-black border border-indigo-500/20 rounded-[35px] p-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center space-x-3 space-x-reverse mb-6">
            <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400"><MessageSquareCode size={24} /></div>
            <div>
              <h3 className="text-lg font-black italic leading-tight">صندوق الاقتراحات السيادي</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">شارك برؤيتك لتطوير إمبراطورية فليكسو</p>
            </div>
          </div>
          <textarea value={suggestion} onChange={(e) => setSuggestion(e.target.value)} placeholder="اكتب فكرتك.. سيقوم الخبير الذكي بتحليل طلبك ومناقشته مع المسؤول خالد المنتصر." className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[120px] mb-4 text-white" />
          <button onClick={handleSendSuggestion} disabled={isSending || !suggestion.trim()} className="w-full py-4 flixo-gradient rounded-2xl font-black text-xs flex items-center justify-center space-x-3 shadow-xl active:scale-95 transition-all">
            {isSending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Sparkles size={16} /><span>إرسال الاقتراح ذكياً</span></>}
          </button>
        </div>

        <div className="pt-10 text-center">
          <button onClick={() => authService.logout()} className="text-red-500 font-black text-xs uppercase tracking-widest border border-red-500/20 px-10 py-4 rounded-full hover:bg-red-500/5 transition-colors">تسجيل الخروج الآمن</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
