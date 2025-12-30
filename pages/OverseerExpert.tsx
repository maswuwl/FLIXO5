
import React, { useState, useEffect, useRef } from 'react';
import { Wand2, Send, Sparkles, ChevronRight, Globe, Cpu, Loader2, Mic, MicOff, Activity, ShieldCheck, Terminal, Brain, Zap, User } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const OverseerExpert: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.celebrityTier === 0;

  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string, isStreaming?: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add('in-chat-mode');
    const welcome = `أهلاً بك يا ${currentUser?.displayName.split(' ')[0]}. أنا الخبير السيادي المشرِف. محرك Gemini 3 Pro نشط الآن، جاهز لتحليل رؤاك الاستراتيجية وبناء مستقبلك الرقمي.`;
    setMessages([{ role: 'model', text: welcome }]);
    return () => document.body.classList.remove('in-chat-mode');
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    // إضافة رسالة فارغة للمودل سيمتلئ فيها الـ Stream
    setMessages(prev => [...prev, { role: 'model', text: '', isStreaming: true }]);

    try {
      let fullResponse = '';
      const stream = geminiService.askExpertStream(userText, messages);
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg.role === 'model') {
            lastMsg.text = fullResponse;
          }
          return [...newMessages];
        });
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "عذراً، حدث اضطراب في بروتوكول الذكاء. جاري إعادة المحاولة." }]);
    } finally {
      setIsTyping(false);
      setMessages(prev => prev.map(m => ({ ...m, isStreaming: false })));
    }
  };

  return (
    <div className="fixed inset-0 z-[500] bg-[#050208] text-white flex flex-col overflow-hidden font-sans" dir="rtl">
      {/* Header - ChatGPT Style Ultra Slim */}
      <div className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-black/40 backdrop-blur-3xl shrink-0">
        <div className="flex items-center space-x-3 space-x-reverse">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-xl transition-all">
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <div className="flex items-center space-x-2 space-x-reverse">
             <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Brain size={18} className="text-white" />
             </div>
             <div className="flex flex-col">
                <span className="text-sm font-black italic tracking-tighter">FLIXO <span className="text-indigo-400">EXPERT</span></span>
                <span className="text-[7px] text-green-500 font-bold uppercase tracking-[0.2em] animate-pulse">Sovereign Mode Active</span>
             </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
           <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center space-x-1.5 space-x-reverse">
              <Zap size={10} className="text-yellow-500" />
              <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Gemini 3 Pro</span>
           </div>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-8 pb-40">
        <div className="max-w-2xl mx-auto space-y-8">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'} animate-fade-in`}>
              <div className={`flex items-start space-x-3 space-x-reverse max-w-[92%] ${m.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-md ${m.role === 'user' ? 'bg-white/5 border border-white/10' : 'bg-indigo-600 text-white'}`}>
                  {m.role === 'user' ? <User size={14} className="text-gray-400" /> : <Sparkles size={14} />}
                </div>
                <div className={`p-4 rounded-2xl text-[13px] leading-relaxed font-medium ${m.role === 'user' ? 'bg-white/5 text-gray-200' : 'bg-transparent text-gray-100'}`}>
                  {m.text || (m.isStreaming && <Loader2 size={16} className="animate-spin text-indigo-400" />)}
                  {m.isStreaming && <span className="inline-block w-1 h-4 bg-indigo-500 ml-1 animate-pulse align-middle"></span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input - ChatGPT Style */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#050208] via-[#050208]/95 to-transparent">
        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-0 bg-indigo-500/5 blur-xl group-focus-within:bg-indigo-500/10 transition-all rounded-full"></div>
          <div className="relative bg-[#1a1a2e] border border-white/10 rounded-[2rem] p-1.5 flex items-center shadow-2xl focus-within:border-indigo-500/50 transition-all">
            <button 
              onClick={() => {}} 
              className="w-11 h-11 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-all hover:bg-white/5"
            >
              <Mic size={20} />
            </button>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اسأل الخبير السيادي عن أي شيء..."
              className="flex-1 bg-transparent border-none focus:outline-none px-4 text-sm text-white placeholder:text-gray-600"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${input.trim() ? 'bg-white text-black shadow-lg' : 'bg-white/5 text-gray-600'}`}
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-center text-[8px] text-gray-600 mt-3 font-black uppercase tracking-[0.3em]">
            Powered by Gemini 3 Pro & Sovereign Engine V7
          </p>
        </div>
      </div>
    </div>
  );
};

export default OverseerExpert;
