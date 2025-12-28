
import React, { useState, useEffect, useRef } from 'react';
import { Send, Brain, ChevronLeft, Code2, Lock, Coins, Github, Globe, CheckCircle2, CloudLightning, ArrowUpRight, Terminal, FileCode, FolderTree, Sparkles, Wand2, Lightbulb, Zap, AlertCircle, Wrench, RefreshCcw, Cloud, ShieldCheck, Activity, Bug, SearchCode, Database } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';

interface FileSim {
  id: string;
  name: string;
  type: 'file' | 'folder';
  status: 'ready' | 'generating' | 'locked';
  buildRatio: number; 
  errorRate: number;
  errorCode?: string; // كود الخطأ
}

const AIStudio: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'chat' | 'strategy' | 'build' | 'deploy'>('chat');
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [strategy, setStrategy] = useState<string | null>(null);
  const [fixingFile, setFixingFile] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const [projectFiles, setProjectFiles] = useState<FileSim[]>([
    { id: '1', name: 'src/components', type: 'folder', status: 'ready', buildRatio: 95, errorRate: 5, errorCode: '0xFC02' },
    { id: '2', name: 'App.tsx', type: 'file', status: 'ready', buildRatio: 82, errorRate: 18, errorCode: '0xER404' },
    { id: '3', name: 'SovereignEngine.ts', type: 'file', status: 'ready', buildRatio: 100, errorRate: 0 },
    { id: '4', name: 'index.html', type: 'file', status: 'ready', buildRatio: 100, errorRate: 0 },
    { id: '5', name: 'package.json', type: 'file', status: 'locked', buildRatio: 100, errorRate: 0 },
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

    const result = await geminiService.askExpert(input, messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })));
    setMessages(prev => [...prev, { role: 'model', text: result.text }]);
    setIsTyping(false);
  };

  const handleAutoFix = async (file: FileSim) => {
    if (file.errorRate === 0) return;
    setFixingFile(file.id);
    setIsTyping(true);
    
    // محاكاة خصم 50 FX من المحفظة مقابل الإصلاح
    const fixResult = await geminiService.fixRepositoryErrors(file.name, file.errorRate);
    
    setMessages(prev => [...prev, { 
      role: 'model', 
      text: `سيادة المدير، تم استدعاء بروتوكول الإصلاح التلقائي للملف ${file.name}. \n\nتم تحليل كود الخطأ ${file.errorCode} ومعالجته برمجياً. \n\nتقرير Gemini:\n${fixResult}` 
    }]);
    
    setProjectFiles(prev => prev.map(f => 
      f.id === file.id ? { ...f, buildRatio: 100, errorRate: 0, errorCode: undefined } : f
    ));
    
    setFixingFile(null);
    setIsTyping(false);
    setView('chat');
  };

  const handleScanRepository = async () => {
    setIsTyping(true);
    setDeployStep('جاري المسح الراداري للأكواد...');
    await new Promise(r => setTimeout(r, 2000));
    
    // تحديث عشوائي للنسب لمحاكاة المسح الحي
    setProjectFiles(prev => prev.map(f => ({
      ...f,
      buildRatio: Math.floor(Math.random() * 20) + 80,
      errorRate: Math.floor(Math.random() * 20),
      errorCode: Math.random() > 0.5 ? `0x${Math.floor(Math.random() * 1000).toString(16).toUpperCase()}` : undefined
    })));
    
    setIsTyping(false);
  };

  return (
    <div className="h-full bg-[#050505] text-white flex flex-col" dir="rtl">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center space-x-4 space-x-reverse">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter">FLIXO <span className="text-indigo-500">ENGINE</span></h1>
            <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-[0.3em]">Sovereign Debugger V6.0</p>
          </div>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 overflow-x-auto no-scrollbar max-w-[50%]">
          {['chat', 'strategy', 'build', 'deploy'].map((v) => (
            <button key={v} onClick={() => setView(v as any)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all whitespace-nowrap ${view === v ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}>
              {v === 'chat' ? 'الخبير' : v === 'strategy' ? 'الاستراتيجية' : v === 'build' ? 'المستودع' : 'النشر'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col relative">
        {view === 'chat' && (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
                  <div className="w-24 h-24 bg-indigo-600/10 rounded-[40px] flex items-center justify-center border border-indigo-500/20 animate-pulse">
                    <Brain size={48} className="text-indigo-500" />
                  </div>
                  <h2 className="text-2xl font-black italic">مختبر الأفكار السيادية</h2>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end animate-slide-up'}`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl text-sm ${m.role === 'user' ? 'bg-white/5 border border-white/10' : 'bg-indigo-600/20 border border-indigo-500/30'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-black/80 border-t border-white/10">
              <div className="flex items-center space-x-2 space-x-reverse max-w-4xl mx-auto">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="أمر برمجي جديد..." className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none" />
                <button onClick={handleSend} className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl"><Send size={20} /></button>
              </div>
            </div>
          </>
        )}

        {view === 'build' && (
          <div className="flex-1 p-6 overflow-y-auto no-scrollbar space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Database size={20} className="text-indigo-400" />
                <span className="text-xs font-black uppercase tracking-widest">مستودع الأكواد الحية</span>
              </div>
              <button onClick={handleScanRepository} className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl hover:bg-indigo-600 transition-all">
                <RefreshCcw size={16} className={isTyping ? 'animate-spin' : ''} />
              </button>
            </div>

            <div className="space-y-4">
              {projectFiles.map((file) => (
                <div key={file.id} className="p-5 bg-white/5 border border-white/5 rounded-[30px] group hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="p-3 bg-white/5 rounded-2xl">
                        {file.type === 'folder' ? <FolderTree size={18} className="text-indigo-400" /> : <FileCode size={18} className="text-gray-400" />}
                      </div>
                      <div>
                        <span className="block text-xs font-black text-white">{file.name}</span>
                        {file.errorCode && (
                          <span className="text-[10px] text-red-500 font-mono font-bold flex items-center">
                            <Bug size={10} className="ml-1" /> ERROR: {file.errorCode}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {file.errorRate > 0 ? (
                      <button 
                        onClick={() => handleAutoFix(file)}
                        disabled={fixingFile === file.id}
                        className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
                      >
                        {fixingFile === file.id ? <RefreshCcw size={16} className="animate-spin" /> : <Wrench size={16} />}
                      </button>
                    ) : (
                      <div className="p-3 bg-green-500/10 text-green-500 rounded-2xl">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                  </div>

                  {/* رادار النسب أسفل المستودع */}
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-tighter">
                        <span className="text-gray-500">البناء</span>
                        <span className="text-indigo-400">{file.buildRatio}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${file.buildRatio}%` }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-tighter">
                        <span className="text-gray-500">الأخطاء</span>
                        <span className="text-red-500">{file.errorRate}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${file.errorRate}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[40px] text-center space-y-4">
              <Terminal size={32} className="text-indigo-400 mx-auto opacity-50" />
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-relaxed">
                اضغط على زر المفتاح لإصلاح الأخطاء تلقائياً باستخدام ذكاء فليكسو المركزي. يتم تفعيل الأكواد تلقائياً بعد المعالجة.
              </p>
            </div>
          </div>
        )}

        {view === 'deploy' && (
          <div className="flex-1 p-6 overflow-y-auto no-scrollbar flex flex-col items-center justify-center text-center space-y-8">
            <div className="w-32 h-32 bg-indigo-600/10 rounded-full flex items-center justify-center border border-indigo-500/20 animate-pulse">
               <CloudLightning size={48} className="text-indigo-400" />
            </div>
            <div className="max-w-xs">
              <h3 className="text-2xl font-black italic mb-2">النشر السحابي السيادي</h3>
              <p className="text-xs text-gray-500 font-bold leading-relaxed">ارفع أكوادك إلى خوادم FLIXO الموزعة عالمياً بلمسة واحدة.</p>
            </div>
            <button onClick={() => { setIsDeploying(true); setTimeout(() => setIsDeploying(false), 3000); }} className="w-full max-w-sm py-6 flixo-gradient rounded-3xl font-black text-white shadow-2xl active:scale-95 transition-all">
              {isDeploying ? 'جاري توزيع الحزم...' : 'بدء النشر العالمي'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIStudio;
