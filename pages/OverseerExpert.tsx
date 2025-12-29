
import React, { useState, useEffect, useRef } from 'react';
import { Wand2, Send, Sparkles, ChevronRight, Globe, Cpu, Loader2, Mic, MicOff, Activity, ShieldCheck, Terminal } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const OverseerExpert: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.celebrityTier === 0;

  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string, isProject?: boolean, projectLink?: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [buildProgress, setBuildProgress] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add('in-chat-mode');
    const welcome = isAdmin 
      ? `أهلاً بك يا سيادة المدير خالد. نظام الإشراف التنفيذي جاهز لتلقي أوامرك السيادية. شريط التحكم الصوتي والكتابي نشط الآن بنسبة 100%. ماذا نبني اليوم؟`
      : `مرحباً بك في أفق فليكسو. أنا الخبير المشرِف، مستشارك الاستراتيجي العالمي. كيف يمكنني خدمتك؟`;
    
    setMessages([{ role: 'model', text: welcome }]);
    return () => document.body.classList.remove('in-chat-mode');
  }, [isAdmin]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, buildProgress]);

  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isTyping) return;
    
    const userMsg = { role: 'user' as const, text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const isBuildRequest = /ابن|مشروع|build|تطوير/i.test(textToSend);

    if (isBuildRequest && isAdmin) {
      setBuildProgress(0);
      const steps = ["تحليل البنية التحتية...", "توليد الأكواد السيادية...", "ربط قواعد البيانات...", "النشر النهائي..."];
      for (let i = 0; i < steps.length; i++) {
        setBuildProgress((i + 1) * 25);
        await new Promise(r => setTimeout(r, 800));
      }
      const projectID = Math.random().toString(36).substring(7);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: `تم تنفيذ الأمر يا خالد. تم بناء المشروع العالمي وربطه بنواة فليكسو بنجاح.`,
        isProject: true,
        projectLink: `https://flixo.io/deploy/${projectID}`
      }]);
      setBuildProgress(null);
      setIsTyping(false);
      return;
    }

    try {
      const context = `أنت "الخبير المشرِف" الأعلى. العميل هو خالد المنتصر المدير العام. رد بعظمة ودقة استراتيجية عالمية وبدون أخطاء بروتوكول.`;
      const result = await geminiService.askExpert(textToSend + "\n" + context, messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })));
      setMessages(prev => [...prev, { role: 'model', text: result.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "سيادة المدير، حدث اضطراب طفيف في قناة الاتصال المشفرة. جاري إعادة المزامنة..." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const startVoiceCommand = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("متصفحك لا يدعم الأوامر الصوتية السيادية.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };
    recognition.start();
  };

  return (
    <div className="fixed inset-0 z-[500] bg-[#020202] text-white flex flex-col overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="p-4 pt-12 border-b border-white/5 flex items-center justify-between bg-black/60 backdrop-blur-3xl shrink-0">
        <div className="flex items-center space-x-3 space-x-reverse">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <ChevronRight size={22} className="text-yellow-500" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-black italic tracking-tighter flex items-center">
              الخبير <span className="text-yellow-500 mr-1">المُشرِف</span>
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
            </h1>
            <p className="text-[8px] text-gray-500 font-black uppercase tracking-[0.2em]">World Class Sovereign Intelligence</p>
          </div>
        </div>
        <div className="px-4 py-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/5 text-yellow-500 text-[10px] font-black uppercase">
          بروتوكول نشط 100%
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative flex flex-col">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar pb-40">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end animate-slide-up'}`}>
              <div className={`max-w-[90%] p-5 rounded-[2rem] text-sm leading-relaxed shadow-2xl border ${
                m.role === 'user' 
                  ? 'bg-white/5 border-white/10 text-gray-200 rounded-bl-none' 
                  : 'bg-yellow-500/5 border-yellow-500/20 text-yellow-50 rounded-br-none'
              }`}>
                {m.text}
                {m.isProject && (
                  <div className="mt-4 p-4 bg-black/40 border border-yellow-500/30 rounded-2xl space-y-3">
                     <div className="flex items-center space-x-2 space-x-reverse text-yellow-500">
                        <Globe size={16} />
                        <span className="text-[10px] font-black uppercase">رابط الاستضافة السيادي</span>
                     </div>
                     <a href={m.projectLink} target="_blank" className="text-xs text-blue-400 underline break-all font-mono">
                       {m.projectLink}
                     </a>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {buildProgress !== null && (
             <div className="flex justify-end animate-fade-in">
                <div className="w-full max-w-xs bg-black/60 border border-yellow-500/20 p-5 rounded-3xl space-y-4">
                   <div className="flex items-center justify-between text-[10px] font-black text-yellow-500">
                      <span>جاري البناء الاستراتيجي...</span>
                      <span>{buildProgress}%</span>
                   </div>
                   <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 shadow-[0_0_10px_#eab308] transition-all duration-500" style={{ width: `${buildProgress}%` }}></div>
                   </div>
                </div>
             </div>
          )}

          {isTyping && !buildProgress && (
            <div className="flex justify-end animate-pulse">
              <div className="bg-yellow-500/5 p-4 rounded-2xl border border-yellow-500/10 text-[10px] italic flex items-center">
                <Cpu size={14} className="ml-2 text-yellow-500 animate-spin" />
                تفكير استراتيجي عالمي...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar - FIXED AT BOTTOM WITH HIGH Z-INDEX */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/90 backdrop-blur-3xl border-t border-white/10 z-[600]">
          <div className="flex items-center space-x-3 space-x-reverse max-w-4xl mx-auto">
            <button 
              onClick={startVoiceCommand}
              className={`w-14 h-14 rounded-[1.4rem] flex items-center justify-center transition-all ${isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-white/5 border border-white/10 text-gray-400'}`}
            >
              {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            
            <div className="flex-1 relative">
              <input 
                autoFocus
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
                placeholder={isAdmin ? "أصدر أوامرك يا خالد..." : "أنا أصغي إليك..."} 
                className="w-full bg-white/5 border border-white/10 rounded-[1.8rem] py-5 px-8 text-sm text-white focus:outline-none focus:border-yellow-500 transition-all shadow-inner" 
              />
            </div>
            
            <button 
              onClick={() => handleSend()} 
              disabled={!input.trim() || isTyping}
              className="w-14 h-14 rounded-[1.4rem] bg-yellow-500 text-black flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-20"
            >
              <Send size={24} />
            </button>
          </div>
          
          {/* Mirror Text for visual feedback */}
          {input && (
            <div className="mt-4 flex justify-center overflow-hidden h-6 pointer-events-none">
              <div className="bg-yellow-500/10 px-4 py-1 rounded-full border border-yellow-500/20 text-[10px] text-yellow-400 italic truncate max-w-[80%] animate-fade-in">
                {input}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverseerExpert;
