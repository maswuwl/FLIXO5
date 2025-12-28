
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, Brain, MessageSquare, CheckCircle2, AlertTriangle, Terminal, BarChart3, Settings as SettingsIcon, Play, Square, History, ChevronLeft, Sparkles, Gavel, Users, UserMinus, PlusSquare, FileText, Activity, Clock, Trash2 } from 'lucide-react';
import { Memo, PlatformStats, Project, SystemLog } from '../types';
import { geminiService } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';
import { MOCK_USERS } from '../constants';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'memos' | 'control' | 'projects' | 'users' | 'logs'>('memos');
  const [memos, setMemos] = useState<Memo[]>([]);
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null);
  const [isDiscussing, setIsDiscussing] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  
  const [projects, setProjects] = useState<Project[]>([
    { 
      id: 'p1', 
      name: 'نظام الواقع المعزز (AR)', 
      description: 'إضافة فلاتر تعتمد على الموقع الجغرافي.', 
      status: 'in-progress', 
      aiFeedback: 'فكرة ممتازة لزيادة التفاعل المحلي.',
      createdAt: '2025-05-10',
      // Fix: Added missing buildRatio and errorRate properties required by the Project interface
      buildRatio: 65,
      errorRate: 5,
      timeline: [
        { stage: 'التخطيط', date: '10 مايو', completed: true },
        { stage: 'التطوير الأولي', date: '15 مايو', completed: true },
        { stage: 'اختبار الاستقرار', date: '20 مايو', completed: false }
      ]
    }
  ]);

  const [toggles, setToggles] = useState({
    aiModeration: true,
    autoUpdatePause: true,
    biometricVault: true,
    encryptedChat: true
  });

  useEffect(() => {
    const saved = localStorage.getItem('flixo_memos');
    if (saved) setMemos(JSON.parse(saved).reverse());
    
    // تنظيف المذكرات القديمة (محاكاة حذف المشاريع غير المنفذة بعد فترة)
    const cleanupMemos = () => {
       const now = new Date();
       const filtered = memos.filter(m => {
          const mDate = new Date(m.timestamp);
          const diffDays = (now.getTime() - mDate.getTime()) / (1000 * 3600 * 24);
          return diffDays < 30; // حذف بعد 30 يوم
       });
       if (filtered.length !== memos.length) {
         setMemos(filtered);
         localStorage.setItem('flixo_memos', JSON.stringify(filtered));
       }
    };
    cleanupMemos();
  }, [memos.length]);

  const handleDiscussWithAI = async (memo: Memo) => {
    setIsDiscussing(true);
    const result = await geminiService.askExpert(`حلل الجدوى الاقتصادية لهذا المشروع المقترح: "${memo.content}"`);
    setAiResponse(result.text || "");
    setIsDiscussing(false);
  };

  return (
    <div className="h-full bg-[#050505] text-white flex flex-col overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="p-6 pt-12 border-b border-white/10 flex items-center justify-between bg-black/80 backdrop-blur-xl z-20">
        <div className="flex items-center space-x-4 space-x-reverse">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-xl"><ChevronLeft size={24} /></button>
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter">غرفة <span className="text-yellow-500">السيادة</span></h1>
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.3em]">Operational Command • V5.2 GOLD</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-full border border-green-500/20 bg-green-500/10 text-green-500">
          <Activity size={12} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase">النظام محمي ومستقر</span>
        </div>
      </div>

      {/* Nav */}
      <div className="flex overflow-x-auto bg-black p-2 border-b border-white/5 no-scrollbar shrink-0">
        {[
          { id: 'memos', label: 'المذكرات', icon: <History size={14} /> },
          { id: 'projects', label: 'مخطط المشاريع', icon: <BarChart3 size={14} /> },
          { id: 'control', label: 'مركز التحكم', icon: <Terminal size={14} /> },
          { id: 'users', label: 'المستخدمين', icon: <Users size={14} /> },
          { id: 'logs', label: 'سجل النظام', icon: <Activity size={14} /> }
        ].map(tab => (
          <button key={tab.id} onClick={() => setView(tab.id as any)} className={`flex-none px-6 py-4 rounded-2xl text-[10px] font-black transition-all flex items-center space-x-2 space-x-reverse ml-2 ${view === tab.id ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>
            {tab.icon} <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar relative p-6">
        {view === 'memos' && (
          <div className="space-y-4">
             {memos.map(m => (
               <div key={m.id} className="p-6 bg-white/5 border border-white/10 rounded-[35px] flex items-center justify-between group">
                  <div className="flex-1 ml-4">
                     <div className="flex items-center space-x-2 space-x-reverse mb-2">
                        <span className={`text-[8px] px-2 py-1 rounded-full font-black ${m.priority === 'high' ? 'bg-red-500' : 'bg-gray-700'}`}>{m.priority}</span>
                        <span className="text-[10px] text-gray-500 font-bold">{m.senderName}</span>
                     </div>
                     <p className="text-sm font-bold">{m.content}</p>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                     <button onClick={() => handleDiscussWithAI(m)} className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl hover:bg-indigo-600/40 transition-colors"><Brain size={18} /></button>
                     <button className="p-3 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18} /></button>
                  </div>
               </div>
             ))}
             {aiResponse && (
               <div className="p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-[40px] animate-slide-up">
                  <h4 className="text-indigo-400 font-black text-xs mb-4 flex items-center"><Sparkles size={14} className="ml-2" /> رؤية الذكاء الاصطناعي السيادية:</h4>
                  <p className="text-sm italic font-medium leading-relaxed">{aiResponse}</p>
               </div>
             )}
          </div>
        )}

        {view === 'projects' && (
          <div className="space-y-8">
             {projects.map(p => (
               <div key={p.id} className="bg-white/5 border border-white/10 rounded-[40px] p-8 space-y-6">
                  <div className="flex justify-between items-center">
                     <h3 className="text-xl font-black italic">{p.name}</h3>
                     <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black">{p.status}</span>
                  </div>
                  <div className="space-y-4">
                     <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">المخطط الزمني للتنفيذ</p>
                     <div className="relative pt-4 pb-8 pr-6 border-r border-white/10 space-y-8">
                        {p.timeline.map((step, i) => (
                          <div key={i} className="relative">
                             <div className={`absolute top-1.5 -right-[27px] w-3 h-3 rounded-full ${step.completed ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-700'}`}></div>
                             <div className="flex flex-col">
                                <span className={`text-xs font-bold ${step.completed ? 'text-white' : 'text-gray-500'}`}>{step.stage}</span>
                                <span className="text-[10px] text-gray-600">{step.date}</span>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                  <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs hover:scale-[1.02] transition-transform">تحديث وتدشين المرحلة التالية</button>
               </div>
             ))}
          </div>
        )}

        {view === 'control' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] space-y-6">
                 <h3 className="text-lg font-black italic text-gray-300">نظام الإشراف السيادي (AutoMod)</h3>
                 <div className="space-y-4">
                    {Object.entries(toggles).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                        <span className="text-xs font-bold capitalize text-gray-400">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <button onClick={() => setToggles({...toggles, [key]: !val})} className={`w-12 h-6 rounded-full relative transition-all ${val ? 'bg-indigo-600' : 'bg-gray-700'}`}>
                           <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${val ? 'right-7' : 'right-1'}`}></div>
                        </button>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-[40px] space-y-6">
                 <h3 className="text-lg font-black italic text-red-500">حماية النظام الأساسي</h3>
                 <p className="text-xs text-gray-500">في حال اكتشاف AutoMod لأي خلل في الكود أو مشكلة أمنية، سيتم إيقاف التحديثات تلقائياً.</p>
                 <div className="p-4 bg-black/60 rounded-2xl flex items-center justify-between">
                    <span className="text-[10px] font-black text-red-400">إيقاف التحديث التلقائي عند الخطر</span>
                    <CheckCircle2 size={16} className="text-green-500" />
                 </div>
                 <button className="w-full py-5 bg-red-600 rounded-3xl font-black text-xs shadow-xl active:scale-95 transition-all">إيقاف كلي للطوارئ</button>
              </div>
           </div>
        )}
      </div>
      
      <div className="p-4 bg-black/60 border-t border-white/5 text-center shrink-0">
         <p className="text-[8px] font-black text-gray-800 uppercase tracking-[1em]">Sovereign OS Kernel V5.2.1 Stable</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
