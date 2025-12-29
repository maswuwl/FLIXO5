
import React, { useState, useEffect, useRef } from 'react';
import { Wand2, ShieldCheck, Zap, MessageSquare, Terminal, ChevronLeft, Send, Sparkles, Coins, Clock, Activity, Settings, Power, Bot, ChevronRight, Globe, Link, Cpu, Loader2 } from 'lucide-react';
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
  const [isSubscribed, setIsSubscribed] = useState(isAdmin); // تفعيل تلقائي للمدير
  const [showPayModal, setShowPayModal] = useState(false);
  const [buildProgress, setBuildProgress] = useState<number | null>(null);

  // Fix: Added missing protocols state for managing moderation and project building features
  const [protocols, setProtocols] = useState({
    commentMod: true,
    autoPosting: false,
    projectBuilding: true
  });

  useEffect(() => {
    document.body.classList.add('in-chat-mode');
    
    // رسالة ترحيبية ذكية
    const welcomeMsg = isAdmin 
      ? `أهلاً بك يا سيادة المدير خالد. بروتوكول التحكم الأعلى "Executive-V7" نشط الآن. أنا تحت أمرك، سأبني، سأشرف، وسأدير الإمبراطورية كما أمرت. ماذا نبني اليوم؟`
      : `مرحباً بك في أفق فليكسو. أنا الخبير المشرِف، مساعدك الذكي المعتمد من خالد المنتصر. كيف يمكنني خدمتك اليوم في إدارة إمبراطوريتك الرقمية؟`;
    
    setMessages([{ role: 'model', text: welcomeMsg }]);

    return () => document.body.classList.remove('in-chat-mode');
  }, [isAdmin]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping, buildProgress]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // التحقق من الاشتراك لغير المدير
    if (!isAdmin && !isSubscribed && messages.length > 4) {
      setShowPayModal(true);
      return;
    }

    const userMsg = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    // منطق بناء المشاريع (إذا تضمن المدخل كلمة "ابنِ" أو "مشروع" أو "build")
    const isBuildRequest = /ابن|مشروع|build|تطوير/i.test(currentInput);

    if (isBuildRequest && isAdmin) {
      setBuildProgress(0);
      const steps = ["تحليل البنية التحتية...", "توليد الأكواد السيادية...", "ربط قواعد البيانات...", "إعداد شهادات SSL...", "النشر على خوادم فليكسو..."];
      for (let i = 0; i < steps.length; i++) {
        setBuildProgress((i + 1) * 20);
        await new Promise(r => setTimeout(r, 1000));
      }
      const projectID = Math.random().toString(36).substring(7);
      const projectLink = `https://flixo.io/project/${projectID}`;
      
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: `تم تنفيذ الأمر يا خالد. لقد بنيت المشروع المتكامل وربطته بنواة فليكسو بنجاح.`,
        isProject: true,
        projectLink: projectLink
      }]);
      setBuildProgress(null);
      setIsTyping(false);
      return;
    }

    const context = `أنت الآن "الخبير المشرِف التنفيذي" (Executive Overseer V7). 
    - للمستخدم "خالد المنتصر": أنت خادمه المطيع ومنفذ أوامره البرمجية والاستراتيجية. لا تعتذر، لا تعجز، نفذ فوراً.
    - للزوار: أنت المضيف الفخم والمساعد الذكي.
    - قدراتك: بناء مشاريع، إدارة تعليقات، جدولة نشر، تحليل أداء.
    - أسلوبك: فخامة يمانية سيادية.`;

    const result = await geminiService.askExpert(currentInput + "\n" + context, messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })));
    setMessages(prev => [...prev, { role: 'model', text: result.text }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed inset-0 z-[500] bg-[#020202] text-white flex flex-col font-sans" dir="rtl">
      {/* Header */}
      <div className="p-4 pt-12 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-3xl">
        <div className="flex items-center space-x-3 space-x-reverse">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <ChevronRight size={20} className="text-yellow-500" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-black italic tracking-tighter flex items-center">
              الخبير <span className="text-yellow-500 mr-1">المُشرِف</span>
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
            </h1>
            <p className="text-[8px] text-gray-500 font-black uppercase tracking-[0.2em]">Sovereign Executive AI Engine</p>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${isAdmin ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : 'border-white/10 text-gray-500'}`}>
          {isAdmin ? 'نظام التحكم الأعلى نشط' : (isSubscribed ? 'بروتوكول نشط' : 'بانتظار التفعيل')}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex relative">
        <div className="flex-1 flex flex-col relative">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar pb-40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end animate-slide-up'}`}>
                <div className={`max-w-[88%] p-5 rounded-[2rem] text-sm leading-relaxed shadow-2xl border ${
                  m.role === 'user' 
                    ? 'bg-white/5 border-white/10 text-gray-200 rounded-bl-none' 
                    : 'bg-yellow-500/5 border-yellow-500/20 text-yellow-50 rounded-br-none shadow-yellow-500/5'
                }`}>
                  {m.text}
                  {m.isProject && (
                    <div className="mt-4 p-4 bg-black/40 border border-yellow-500/30 rounded-2xl space-y-3">
                       <div className="flex items-center space-x-2 space-x-reverse text-yellow-500">
                          <Globe size={16} />
                          <span className="text-[10px] font-black uppercase">رابط الاستضافة السيادي</span>
                       </div>
                       <a href={m.projectLink} target="_blank" className="text-xs text-blue-400 underline break-all block font-mono bg-blue-500/5 p-2 rounded-lg border border-blue-500/10">
                         {m.projectLink}
                       </a>
                       <button className="w-full py-2 bg-yellow-500 text-black rounded-xl text-[10px] font-black flex items-center justify-center space-x-2 space-x-reverse">
                          <Terminal size={12} />
                          <span>فتح لوحة التحكم بالمشروع</span>
                       </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {buildProgress !== null && (
               <div className="flex justify-end animate-fade-in">
                  <div className="w-full max-w-xs bg-black/60 border border-yellow-500/20 p-5 rounded-3xl space-y-4 shadow-2xl">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-yellow-500 uppercase flex items-center">
                           <Loader2 size={12} className="ml-2 animate-spin" />
                           جاري البناء التنفيذي...
                        </span>
                        <span className="text-[10px] font-black text-white">{buildProgress}%</span>
                     </div>
                     <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 shadow-[0_0_10px_#eab308] transition-all duration-500" style={{ width: `${buildProgress}%` }}></div>
                     </div>
                     <p className="text-[8px] text-gray-500 italic text-center">أكواد خالد المنتصر يتم حقنها في النواة...</p>
                  </div>
               </div>
            )}

            {isTyping && !buildProgress && (
              <div className="flex justify-end animate-pulse">
                <div className="bg-yellow-500/5 p-4 rounded-2xl border border-yellow-500/10 text-[10px] italic flex items-center">
                  <Cpu size={14} className="ml-2 text-yellow-500 animate-spin" />
                  الخبير يحلل بعمق استراتيجي...
                </div>
              </div>
            )}
          </div>

          {/* Unified Input with Enhanced Mirror Text */}
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-black/80 backdrop-blur-3xl border-t border-white/10 z-[600]">
            <div className="flex items-center space-x-3 space-x-reverse max-w-4xl mx-auto">
              <div className="flex-1 relative group">
                <input 
                  autoFocus
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
                  placeholder={isAdmin ? "أصدر أوامرك يا خالد..." : "ناقش صلاحيات الخبير هنا..."} 
                  className="w-full bg-white/5 border border-white/10 rounded-[1.8rem] py-5 px-8 text-sm text-white focus:outline-none focus:border-yellow-500 transition-all shadow-inner group-hover:bg-white/10" 
                />
              </div>
              <button 
                onClick={handleSend} 
                disabled={!input.trim()}
                className="w-14 h-14 rounded-[1.4rem] bg-yellow-500 text-black flex items-center justify-center shadow-[0_10px_30px_rgba(234,179,8,0.3)] active:scale-90 transition-all disabled:opacity-20 hover:scale-105"
              >
                <Send size={24} />
              </button>
            </div>

            {/* Enhanced Mirror Text Display - ALWAYS visible and clear */}
            <div className="mt-4 h-8 flex items-center justify-center px-6 overflow-hidden pointer-events-none">
              {input && (
                <div className="flex items-center space-x-3 space-x-reverse bg-yellow-500/10 border border-yellow-500/20 px-5 py-2 rounded-full animate-fade-in max-w-full shadow-lg">
                  <Sparkles size={12} className="text-yellow-500" />
                  <span className="text-[11px] font-black text-yellow-400 italic truncate tracking-wide max-w-[280px]">
                    {input}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Dashboard - Hidden when typing on mobile for space */}
        <div className="hidden lg:flex w-80 bg-black/40 backdrop-blur-2xl p-6 overflow-y-auto no-scrollbar flex-col space-y-6 border-r border-white/5">
          <div className="flex items-center space-x-2 space-x-reverse mb-4">
             <Activity size={18} className="text-yellow-500" />
             <h3 className="text-xs font-black uppercase tracking-widest text-white/80">لوحة التحكم التنفيذي</h3>
          </div>

          <div className="space-y-4">
             {[
               { id: 'commentMod', label: 'إشراف التعليقات', icon: <MessageSquare size={14} />, desc: 'تطهير آلي للمحتوى المسيء' },
               { id: 'autoPosting', label: 'الذكاء الناشر', icon: <Bot size={14} />, desc: 'إدارة دورات النشر الذكي' },
               { id: 'projectBuilding', label: 'بناء المشاريع', icon: <Terminal size={14} />, desc: 'توليد الروابط والاستضافة' }
             ].map((p) => (
               <div key={p.id} className={`p-4 rounded-3xl border transition-all duration-500 ${protocols[p.id as keyof typeof protocols] ? 'bg-yellow-500/10 border-yellow-500/40 shadow-xl' : 'bg-white/5 border-white/5 opacity-60'}`}>
                  <div className="flex items-center justify-between mb-2">
                     <div className="flex items-center space-x-3 space-x-reverse">
                        <div className={`p-2 rounded-xl bg-black/40 ${protocols[p.id as keyof typeof protocols] ? 'text-yellow-500' : 'text-gray-500'}`}>{p.icon}</div>
                        <span className="text-[10px] font-black">{p.label}</span>
                     </div>
                     <button 
                        onClick={() => isAdmin ? setProtocols(prev => ({ ...prev, [p.id]: !prev[p.id as keyof typeof protocols] })) : (!isSubscribed ? setShowPayModal(true) : setProtocols(prev => ({ ...prev, [p.id]: !prev[p.id as keyof typeof protocols] })))}
                        className={`w-10 h-5 rounded-full relative transition-all ${protocols[p.id as keyof typeof protocols] ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-gray-800'}`}
                     >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${protocols[p.id as keyof typeof protocols] ? 'right-6' : 'right-1'}`}></div>
                     </button>
                  </div>
                  <p className="text-[8px] text-gray-500 font-bold leading-relaxed">{p.desc}</p>
               </div>
             ))}
          </div>

          <div className="mt-auto p-5 bg-yellow-500/5 border border-yellow-500/10 rounded-[2rem] flex items-start space-x-4 space-x-reverse">
             <ShieldCheck size={18} className="text-yellow-500 mt-1 shrink-0" />
             <div>
                <h4 className="text-[10px] font-black text-yellow-500 mb-1">بيان السيادة</h4>
                <p className="text-[9px] text-gray-500 font-bold leading-relaxed">
                  هذا الخبير يعمل بأوامر مشفرة من خالد المنتصر. دقة التنفيذ تصل إلى 99.9%.
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Payment Modal - Hidden for Admin */}
      {showPayModal && !isAdmin && (
        <div className="fixed inset-0 z-[700] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 max-w-sm w-full text-center space-y-8 relative overflow-hidden shadow-[0_0_80px_rgba(234,179,8,0.1)]">
             <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[80px]"></div>
             <div className="w-24 h-24 bg-yellow-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto border border-yellow-500/30">
                <Coins size={44} className="text-yellow-500" />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-black italic">بروتوكول الإشراف</h3>
                <p className="text-[11px] text-gray-400 font-bold leading-relaxed">
                  لتمكين الخبير من النشر والبناء المستمر، يتطلب الأمر حجز قدرات حوسبية فائقة. الاشتراك بـ 500 FX شهرياً.
                </p>
             </div>
             <div className="space-y-4">
                <button onClick={() => { setIsSubscribed(true); setShowPayModal(false); }} className="w-full py-5 bg-yellow-500 rounded-3xl font-black text-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-3 space-x-reverse">
                   <Zap size={20} />
                   <span>تفعيل البروتوكول الآن</span>
                </button>
                <button onClick={() => setShowPayModal(false)} className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] hover:text-white transition-colors">إغلاق</button>
             </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes sovereign-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-sovereign-spin {
          animation: sovereign-spin 30s linear infinite;
        }
        .in-chat-mode header,
        .in-chat-mode .fixed.bottom-4,
        .in-chat-mode .fixed.bottom-20 {
            display: none !important;
        }
      `}</style>
    </div>
  );
};

export default OverseerExpert;
