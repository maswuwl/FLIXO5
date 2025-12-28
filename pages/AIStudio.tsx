
import React, { useState, useEffect } from 'react';
import { Send, Brain, ChevronLeft, Code2, Lock, Coins, Github, Globe, CheckCircle2, CloudLightning, ArrowUpRight } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';

interface FileSim {
  name: string;
  type: 'file' | 'folder';
  content?: string;
}

const AIStudio: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'chat' | 'build' | 'deploy'>('chat');
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPaymentWall, setShowPaymentWall] = useState(false);
  const [deployStatus, setDeployStatus] = useState<'idle' | 'pushing' | 'success'>('idle');

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const result = await geminiService.askExpert(input, history);
    setMessages(prev => [...prev, { role: 'model', text: result.text }]);
    setIsTyping(false);
  };

  const simulateDeploy = () => {
    setDeployStatus('pushing');
    setTimeout(() => setDeployStatus('success'), 3000);
  };

  return (
    <div className="h-full bg-[#050505] text-white flex flex-col" dir="rtl">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/60 backdrop-blur-xl">
        <div className="flex items-center space-x-4 space-x-reverse">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-xl">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter">FLIXO <span className="text-indigo-500">ENGINE</span></h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">نظام بناء المشاريع السيادي</p>
          </div>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl">
          <button onClick={() => setView('chat')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${view === 'chat' ? 'bg-indigo-600 text-white' : 'text-gray-500'}`}>المحادثة</button>
          <button onClick={() => setView('build')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${view === 'build' ? 'bg-indigo-600 text-white' : 'text-gray-500'}`}>الكود</button>
          <button onClick={() => setView('deploy')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${view === 'deploy' ? 'bg-indigo-600 text-white' : 'text-gray-500'}`}>النشر</button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {view === 'chat' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
                  <div className="w-20 h-20 bg-indigo-600/20 rounded-3xl flex items-center justify-center border border-indigo-500/30 animate-pulse">
                    <Brain size={40} className="text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-black italic">ماذا سنبني اليوم؟</h2>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl text-sm ${m.role === 'user' ? 'bg-white/5 border border-white/10' : 'bg-indigo-600/20 border border-indigo-500/30'}`}>{m.text}</div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-black/60 border-t border-white/10">
              <div className="flex items-center space-x-2 space-x-reverse">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="أمر بناء المشروع..." className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none" />
                <button onClick={handleSend} className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg"><Send size={20} /></button>
              </div>
            </div>
          </>
        )}

        {view === 'build' && (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 bg-indigo-600/10 rounded-[40px] flex items-center justify-center border border-indigo-500/20">
              <Code2 size={48} className="text-indigo-400" />
            </div>
            <h2 className="text-2xl font-black italic">كود المصدر جاهز</h2>
            <p className="text-gray-500 text-xs font-bold max-w-xs leading-relaxed">تم بناء المشروع برمجياً بنسبة 100%. يمكنك معاينة الملفات هنا، ولكن التحميل يتطلب ترخيص الاستخراج.</p>
            <button onClick={() => setShowPaymentWall(true)} className="w-full max-w-xs py-5 bg-white/5 border border-white/10 rounded-[25px] font-black text-xs flex items-center justify-center space-x-2 space-x-reverse group hover:bg-white hover:text-black transition-all">
              <Lock size={16} />
              <span>تحميل المستودع (مغلق)</span>
            </button>
          </div>
        )}

        {view === 'deploy' && (
          <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 text-center space-y-6">
               <div className="flex justify-center space-x-4 space-x-reverse">
                  <div className="p-5 bg-white/5 rounded-3xl border border-white/10">
                    <Github size={40} className="text-white" />
                  </div>
                  <div className="p-5 bg-indigo-600/10 rounded-3xl border border-indigo-500/20">
                    <CloudLightning size={40} className="text-indigo-400" />
                  </div>
               </div>
               <div>
                  <h3 className="text-2xl font-black italic">نشر GitHub التلقائي</h3>
                  <p className="text-xs text-gray-500 font-bold mt-2">سيقوم الخبير برفع المشروع إلى GitHub ونشره على استضافة خارجية بضغطة واحدة.</p>
               </div>

               <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                     <div className="flex items-center space-x-3 space-x-reverse">
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span className="text-[10px] font-black text-gray-300">توافق الكود المصدري</span>
                     </div>
                     <span className="text-[10px] text-green-500 font-bold">100% جاهز</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                     <div className="flex items-center space-x-3 space-x-reverse">
                        <Globe size={16} className="text-indigo-400" />
                        <span className="text-[10px] font-black text-gray-300">تجهيز بيئة الاستضافة</span>
                     </div>
                     <span className="text-[10px] text-indigo-400 font-bold">في انتظار الترخيص</span>
                  </div>
               </div>

               <button onClick={() => setShowPaymentWall(true)} className="w-full py-5 flixo-gradient rounded-[25px] font-black text-sm shadow-[0_0_30px_rgba(124,58,237,0.3)] flex items-center justify-center space-x-2 space-x-reverse">
                  <ArrowUpRight size={18} />
                  <span>نشر المشروع إلى GitHub</span>
               </button>
            </div>

            <div className="p-6 border border-yellow-500/20 bg-yellow-500/5 rounded-[30px]">
               <h4 className="text-xs font-black text-yellow-500 mb-2 italic">ملاحظة للمدير:</h4>
               <p className="text-[10px] text-yellow-200/60 leading-relaxed font-bold">
                  بمجرد النشر، سيعمل المشروع على أي استضافة تدعم Node.js. ستحتاج فقط لإضافة مفتاح API_KEY الخاص بك في لوحة تحكم الاستضافة ليعمل الذكاء الاصطناعي.
               </p>
            </div>
          </div>
        )}
      </div>

      {/* Payment Wall */}
      {showPaymentWall && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-[#0a0a0a] border border-yellow-500/30 rounded-[40px] p-8 max-w-sm w-full text-center">
             <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock size={40} className="text-yellow-500" />
             </div>
             <h3 className="text-2xl font-black italic mb-2">ترخيص الاستخراج</h3>
             <p className="text-xs text-gray-400 mb-8 leading-relaxed">يتطلب استخراج الكود المصدري أو النشر التلقائي إلى GitHub دفع رسوم السيادة (5,000 FX).</p>
             <div className="flex flex-col space-y-3">
                <button className="py-4 flixo-gradient rounded-2xl font-black text-xs text-white">ادفع الآن (5,000 FX)</button>
                <button onClick={() => setShowPaymentWall(false)} className="py-4 bg-white/5 rounded-2xl font-black text-xs text-gray-500">إلغاء</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIStudio;
