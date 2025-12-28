
import React, { useState, useEffect, useRef } from 'react';
import { Send, Brain, ChevronLeft, Code2, Lock, Coins, Github, Globe, CheckCircle2, CloudLightning, ArrowUpRight, Terminal, FileCode, FolderTree, Sparkles } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';

interface FileSim {
  name: string;
  type: 'file' | 'folder';
  status: 'ready' | 'generating' | 'locked';
}

const AIStudio: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'chat' | 'build' | 'deploy'>('chat');
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPaymentWall, setShowPaymentWall] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [projectFiles] = useState<FileSim[]>([
    { name: 'src/components', type: 'folder', status: 'ready' },
    { name: 'App.tsx', type: 'file', status: 'ready' },
    { name: 'SovereignEngine.ts', type: 'file', status: 'ready' },
    { name: 'index.html', type: 'file', status: 'ready' },
    { name: 'package.json', type: 'file', status: 'locked' },
  ]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

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

  return (
    <div className="h-full bg-[#050505] text-white flex flex-col" dir="rtl">
      {/* Header السيادي */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center space-x-4 space-x-reverse">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter">FLIXO <span className="text-indigo-500">ENGINE</span></h1>
            <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-[0.3em]">Sovereign Build System V5.0</p>
          </div>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
          <button onClick={() => setView('chat')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${view === 'chat' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}>الدردشة</button>
          <button onClick={() => setView('build')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${view === 'build' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}>الكود</button>
          <button onClick={() => setView('deploy')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${view === 'deploy' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}>النشر</button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col relative">
        {view === 'chat' && (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
                  <div className="w-24 h-24 bg-indigo-600/10 rounded-[40px] flex items-center justify-center border border-indigo-500/20 animate-pulse relative">
                    <Brain size={48} className="text-indigo-500" />
                    <Sparkles size={20} className="absolute -top-2 -right-2 text-yellow-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black italic mb-2">مختبر بناء الأفكار</h2>
                    <p className="text-gray-500 text-xs font-bold max-w-xs mx-auto leading-relaxed">أنا العقل البرمجي لمنصة فليكسو. اطلب مني بناء أي تطبيق وسأقوم بإنتاج الكود المصدري لك فوراً.</p>
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end animate-slide-up'}`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-white/5 border border-white/10 text-gray-200' : 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-50 shadow-[0_0_20px_rgba(79,70,229,0.1)]'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-end">
                   <div className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-3xl">
                     <div className="flex space-x-1.5 space-x-reverse">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
                     </div>
                   </div>
                </div>
              )}
            </div>
            <div className="p-4 bg-black/80 border-t border-white/10 backdrop-blur-md">
              <div className="flex items-center space-x-2 space-x-reverse max-w-4xl mx-auto">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="أمر بناء: 'ابني تطبيق دردشة مشفر'..." className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all" />
                <button onClick={handleSend} className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl active:scale-95 transition-all"><Send size={20} /></button>
              </div>
            </div>
          </>
        )}

        {view === 'build' && (
          <div className="flex-1 p-6 overflow-y-auto no-scrollbar space-y-6">
            <div className="bg-[#0a0a0a] rounded-[35px] border border-white/5 p-6 shadow-2xl">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <FolderTree size={20} className="text-indigo-400" />
                    <span className="text-xs font-black uppercase tracking-widest">مستودع المشروع (Repository)</span>
                  </div>
                  <span className="text-[10px] bg-green-500/20 text-green-500 px-3 py-1 rounded-full font-black animate-pulse">محمي سيادياً</span>
               </div>
               
               <div className="space-y-2">
                  {projectFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                       <div className="flex items-center space-x-3 space-x-reverse">
                          {file.type === 'folder' ? <FolderTree size={16} className="text-indigo-400" /> : <FileCode size={16} className="text-gray-400" />}
                          <span className="text-xs font-bold text-gray-300">{file.name}</span>
                       </div>
                       {file.status === 'locked' ? <Lock size={12} className="text-yellow-500" /> : <CheckCircle2 size={12} className="text-green-500" />}
                    </div>
                  ))}
               </div>
            </div>

            <div className="text-center p-8 bg-white/5 rounded-[40px] border border-dashed border-white/20">
               <div className="w-16 h-16 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Terminal size={28} className="text-indigo-500" />
               </div>
               <h3 className="text-xl font-black italic mb-2">كود المصدر جاهز للاستخراج</h3>
               <p className="text-xs text-gray-500 font-bold mb-8">تم توليد 1,420 سطراً من الأكواد النظيفة والمتوافقة مع معايير فليكسو.</p>
               <button onClick={() => setShowPaymentWall(true)} className="w-full py-5 bg-white text-black rounded-3xl font-black text-xs flex items-center justify-center space-x-2 space-x-reverse shadow-2xl active:scale-95 transition-all">
                  <Lock size={16} />
                  <span>تحميل ملفات المشروع (مغلق)</span>
               </button>
            </div>
          </div>
        )}

        {view === 'deploy' && (
          <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
            <div className="bg-gradient-to-br from-indigo-900/20 to-black border border-white/10 rounded-[40px] p-8 text-center space-y-6">
               <div className="flex justify-center space-x-4 space-x-reverse">
                  <div className="p-5 bg-white/5 rounded-3xl border border-white/10 shadow-lg"><Github size={40} className="text-white" /></div>
                  <div className="p-5 bg-indigo-600/10 rounded-3xl border border-indigo-500/20 shadow-lg"><CloudLightning size={40} className="text-indigo-400 animate-pulse" /></div>
               </div>
               <div>
                  <h3 className="text-2xl font-black italic tracking-tighter">النشر السحابي (Cloud Deploy)</h3>
                  <p className="text-xs text-gray-500 font-bold mt-2">اربط حسابك بـ GitHub وانشر مشروعك بضغطة واحدة على خوادم فليكسو العالمية.</p>
               </div>
               <button onClick={() => setShowPaymentWall(true)} className="w-full py-5 flixo-gradient rounded-3xl font-black text-sm shadow-[0_0_30px_rgba(124,58,237,0.3)] flex items-center justify-center space-x-2 space-x-reverse active:scale-95 transition-all">
                  <ArrowUpRight size={18} />
                  <span>بدء النشر التلقائي</span>
               </button>
            </div>
          </div>
        )}
      </div>

      {/* مودال الدفع السيادي */}
      {showPaymentWall && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-[#0a0a0a] border border-yellow-500/30 rounded-[45px] p-10 max-w-sm w-full text-center shadow-[0_0_80px_rgba(245,158,11,0.2)]">
             <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-yellow-500/20">
                <Lock size={48} className="text-yellow-500" />
             </div>
             <h3 className="text-2xl font-black italic mb-3">بروتوكول التحصيل</h3>
             <p className="text-xs text-gray-400 mb-10 leading-relaxed font-bold">
                لاستخراج الكود المصدري أو تشغيل ميزة النشر السحابي خارج سيادة FLIXO، يرجى دفع رسوم الترخيص السيادية.
             </p>
             <div className="flex flex-col space-y-4">
                <button className="py-5 flixo-gradient rounded-3xl font-black text-xs text-white flex items-center justify-center space-x-2 space-x-reverse shadow-xl">
                   <Coins size={18} />
                   <span>ادفع (5,000 FX) لفك القفل</span>
                </button>
                <button onClick={() => setShowPaymentWall(false)} className="py-4 bg-white/5 rounded-3xl font-black text-[10px] text-gray-500 uppercase tracking-widest">إلغاء</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIStudio;
