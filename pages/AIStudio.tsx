
import React, { useState, useEffect, useRef } from 'react';
import { Send, Brain, ChevronLeft, Code2, Lock, Coins, Github, Globe, CheckCircle2, CloudLightning, ArrowUpRight, Terminal, FileCode, FolderTree, Sparkles, Wand2, Lightbulb, Zap, AlertCircle, Wrench, RefreshCcw, Cloud, ShieldCheck, Activity, Bug, SearchCode, Database, Camera } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';

interface FileSim {
  id: string;
  name: string;
  type: 'file' | 'folder';
  status: 'ready' | 'generating' | 'locked';
  buildRatio: number; 
  errorRate: number;
  errorCode?: string;
}

const AIStudio: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'chat' | 'build' | 'deploy'>('chat');
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [fixingFile, setFixingFile] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [projectFiles, setProjectFiles] = useState<FileSim[]>([
    { id: '1', name: 'src/components', type: 'folder', status: 'ready', buildRatio: 95, errorRate: 5, errorCode: '0xFC02' },
    { id: '2', name: 'App.tsx', type: 'file', status: 'ready', buildRatio: 82, errorRate: 18, errorCode: '0xER404' },
    { id: '3', name: 'SovereignEngine.ts', type: 'file', status: 'ready', buildRatio: 100, errorRate: 0 },
  ]);

  const handleVisionAnalysis = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsTyping(true);
    setView('chat');
    setMessages(prev => [...prev, { role: 'user', text: "جاري تحليل لقطة شاشة الخطأ..." }]);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const result = await geminiService.analyzeErrorCode(base64, "حلل هذا الخطأ البرمجي في فليكسو.");
        setMessages(prev => [...prev, { role: 'model', text: result }]);
      } catch (err) {
        setMessages(prev => [...prev, { role: 'model', text: "فشل تحليل الرؤية البرمجية." }]);
      } finally {
        setIsTyping(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAutoFix = async (file: FileSim) => {
    setFixingFile(file.id);
    setIsTyping(true);
    try {
      const fixResult = await geminiService.fixRepositoryErrors(file.name, file.errorRate);
      setMessages(prev => [...prev, { role: 'model', text: `تم إصلاح ${file.name} بنجاح. الحل: ${fixResult}` }]);
      setProjectFiles(prev => prev.map(f => f.id === file.id ? { ...f, buildRatio: 100, errorRate: 0, errorCode: undefined } : f));
    } catch (err) {
      alert("فشل بروتوكول الإصلاح.");
    } finally {
      setFixingFile(null);
      setIsTyping(false);
      setView('chat');
    }
  };

  return (
    <div className="h-full bg-[#050505] text-white flex flex-col" dir="rtl">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center space-x-4 space-x-reverse">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-xl"><ChevronLeft size={20} /></button>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter">AI <span className="text-indigo-500">STUDIO</span></h1>
            <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-[0.3em]">Vision Code Analysis Active</p>
          </div>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl">
          {['chat', 'build', 'deploy'].map((v) => (
            <button key={v} onClick={() => setView(v as any)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${view === v ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}>
              {v === 'chat' ? 'المحلل' : v === 'build' ? 'المستودع' : 'النشر'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {view === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
               {messages.map((m, i) => (
                 <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] p-4 rounded-3xl text-xs font-bold ${m.role === 'user' ? 'bg-white/5 border border-white/10' : 'bg-indigo-600/20 border border-indigo-500/30'}`}>
                      {m.text}
                    </div>
                 </div>
               ))}
               {isTyping && <div className="text-[10px] text-indigo-400 animate-pulse italic">جاري التفكير البرمجي...</div>}
            </div>
            <div className="p-4 bg-black/80 border-t border-white/10 flex items-center space-x-2 space-x-reverse">
               <button onClick={() => fileInputRef.current?.click()} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-indigo-400 transition-all">
                  <Camera size={20} />
               </button>
               <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="أمر برمجي ذكي..." className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-indigo-500" />
               <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleVisionAnalysis} />
            </div>
          </div>
        )}

        {view === 'build' && (
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
             {projectFiles.map(file => (
               <div key={file.id} className="p-5 bg-white/5 border border-white/5 rounded-[30px] flex items-center justify-between group">
                  <div className="flex items-center space-x-4 space-x-reverse">
                     <div className="p-3 bg-white/5 rounded-2xl">
                        {file.type === 'folder' ? <FolderTree size={18} className="text-indigo-400" /> : <FileCode size={18} className="text-gray-400" />}
                     </div>
                     <div>
                        <span className="block text-xs font-black text-white">{file.name}</span>
                        {file.errorCode && <span className="text-[10px] text-red-500 font-mono">Bug: {file.errorCode}</span>}
                     </div>
                  </div>
                  <button 
                    onClick={() => handleAutoFix(file)}
                    disabled={fixingFile === file.id || file.errorRate === 0}
                    className={`p-3 rounded-2xl transition-all ${file.errorRate > 0 ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white shadow-lg' : 'bg-green-500/10 text-green-500'}`}
                  >
                    {fixingFile === file.id ? <RefreshCcw size={16} className="animate-spin" /> : file.errorRate > 0 ? <Wrench size={16} /> : <CheckCircle2 size={16} />}
                  </button>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIStudio;
