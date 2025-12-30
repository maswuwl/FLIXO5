
import React, { useState, useEffect, useRef } from 'react';
import { Send, Brain, ChevronLeft, Zap, Camera, Server, Activity, ShieldCheck, Terminal, Settings, Cpu, Layers, Loader2, Code, Database, Search } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';

const AIStudio: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string, type?: 'text' | 'action' }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [logs, setLogs] = useState<string[]>(["Kernel initialized...", "Establishing sovereign link...", "Ready for execution."]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, logs]);

  const addLog = (log: string) => {
    setLogs(prev => [...prev.slice(-10), `[${new Date().toLocaleTimeString()}] ${log}`]);
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);
    addLog(`Command issued: ${userText.substring(0, 20)}...`);

    let fullResponse = "";
    const stream = geminiService.askExpertStream(userText);
    setMessages(prev => [...prev, { role: 'model', text: '' }]);

    for await (const chunk of stream) {
      fullResponse += chunk;
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].text = fullResponse;
        return updated;
      });
    }
    setIsTyping(false);
    addLog("Execution complete.");
  };

  return (
    <div className="h-full bg-[#050208] text-white flex flex-col md:flex-row overflow-hidden" dir="rtl">
      {/* Right Sidebar: Terminal Logs */}
      <div className="hidden md:flex w-72 border-l border-white/5 bg-black/40 flex-col p-4 shrink-0 font-mono">
        <div className="flex items-center space-x-2 space-x-reverse mb-6 border-b border-white/5 pb-4">
           <Terminal size={14} className="text-indigo-400" />
           <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Live Kernel Logs</span>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
           {logs.map((log, i) => (
             <div key={i} className="text-[9px] text-gray-500 animate-fade-in break-words">
                <span className="text-indigo-500/50 mr-1">>>></span> {log}
             </div>
           ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/5">
           <div className="flex items-center justify-between mb-2">
              <span className="text-[8px] font-black uppercase text-gray-600">CPU LOAD</span>
              <span className="text-[8px] font-black text-indigo-500">24%</span>
           </div>
           <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[24%] animate-pulse"></div>
           </div>
        </div>
      </div>

      {/* Main Command Center */}
      <div className="flex-1 flex flex-col relative">
        <div className="p-6 border-b border-white/5 bg-black/60 backdrop-blur-3xl flex items-center justify-between z-20">
          <div className="flex items-center space-x-4 space-x-reverse">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-xl transition-all active:scale-90"><ChevronLeft size={24} /></button>
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Cpu size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black italic">نواة التنفيذ <span className="text-indigo-400 text-sm uppercase">Command</span></h1>
                <p className="text-[8px] text-gray-500 font-black uppercase tracking-[0.4em]">Sovereign Operational Interface</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-[9px] font-black uppercase text-green-500">Stable Node</span>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-40">
           {messages.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                <Layers size={80} className="text-indigo-500 animate-bounce" />
                <div className="space-y-2">
                  <h3 className="text-2xl font-black italic">مركز القيادة الرقمية</h3>
                  <p className="text-[10px] font-bold max-w-xs mx-auto uppercase tracking-widest leading-loose">أهلاً بك يا سيادة المدير خالد المنتصر. النواة جاهزة لتلقي أوامرك التنفيذية.</p>
                </div>
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                   <button onClick={() => setInput("فحص أمان النظام...")} className="p-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase hover:bg-indigo-500/10 transition-all">SYSTEM AUDIT</button>
                   <button onClick={() => setInput("توليد تقرير أداء...")} className="p-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase hover:bg-indigo-500/10 transition-all">PERFORMANCE REPORT</button>
                </div>
             </div>
           )}

           {messages.map((m, i) => (
             <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'} animate-fade-in`}>
                <div className={`max-w-[85%] p-6 rounded-[35px] ${
                  m.role === 'user' ? 'bg-white/5 border border-white/10' : 'bg-[#1a1a2e]/60 backdrop-blur-xl border border-indigo-500/20 shadow-xl'
                }`}>
                   <div className="flex items-center space-x-2 space-x-reverse mb-3">
                      {m.role === 'user' ? <Search size={14} className="text-gray-500" /> : <Code size={14} className="text-indigo-400" />}
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{m.role === 'user' ? 'Input Command' : 'Kernel Output'}</span>
                   </div>
                   <p className="text-[13px] leading-relaxed font-medium whitespace-pre-wrap text-indigo-50">{m.text}</p>
                </div>
             </div>
           ))}
           {isTyping && (
             <div className="flex justify-end">
                <div className="flex items-center space-x-3 space-x-reverse text-indigo-400 px-6 py-4 bg-indigo-600/5 rounded-full border border-indigo-500/20 shadow-inner">
                   <Loader2 size={16} className="animate-spin" />
                   <span className="text-[11px] font-black italic animate-pulse">جاري معالجة البيانات السيادية...</span>
                </div>
             </div>
           )}
        </div>

        {/* Console-style Input */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#050208] to-transparent">
           <div className="max-w-4xl mx-auto flex items-center space-x-4 space-x-reverse bg-black/60 backdrop-blur-3xl border border-white/10 p-2 rounded-[2.5rem] shadow-2xl">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-indigo-400">
                 <Terminal size={20} />
              </div>
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="أدخل أمراً برمجياً أو استفساراً للنواة..."
                className="flex-1 bg-transparent border-none focus:outline-none px-4 text-sm text-white placeholder:text-gray-600 font-mono"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${input.trim() ? 'bg-indigo-600 text-white shadow-lg scale-110 rotate-[-45deg]' : 'bg-white/5 text-gray-600'}`}
              >
                <Send size={20} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIStudio;
