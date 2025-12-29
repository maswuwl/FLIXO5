
import React, { useState, useEffect, useRef } from 'react';
import { Wand2, ShieldCheck, Zap, MessageSquare, Terminal, ChevronLeft, Send, Sparkles, Coins, Clock, Activity, Settings, Power, Bot } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const OverseerExpert: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);

  // حالة الأتمتة
  const [protocols, setProtocols] = useState({
    commentMod: false,
    autoPosting: false,
    projectBuilding: false,
    frequency: '12h'
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!isSubscribed && messages.length > 3) {
      setShowPayModal(true);
      return;
    }

    const userMsg = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const context = `أنت الآن "الخبير المشرِف" في فليكسو. مهمتك هي إدارة إمبراطورية المستخدم. 
    ناقش معه الصلاحيات التالية: 
    1. الإشراف على التعليقات (حذف المسيء).
    2. النشر التلقائي للمنشورات.
    3. بناء المشاريع برمجياً بشكل دوري.
    تأكد من معرفة التوقيت المفضل له (مثلاً كل يوم، أو كل 12 ساعة). 
    تحدث بفخامة سيادية تليق بمساعد خالد المنتصر.`;

    const result = await geminiService.askExpert(input + "\n" + context, messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })));
    setMessages(prev => [...prev, { role: 'model', text: result.text }]);
    setIsTyping(false);
  };

  const toggleProtocol = (key: keyof typeof protocols) => {
    if (!isSubscribed) {
      setShowPayModal(true);
      return;
    }
    setProtocols(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePayment = () => {
    // محاكاة دفع 500 FX
    setIsSubscribed(true);
    setShowPayModal(false);
    setMessages(prev => [...prev, { role: 'model', text: "تم تفعيل بروتوكول السيادة الكامل. أنا الآن خبيرك المشرِف الخاص، سأنفذ أوامرك كل يوم بدقة متناهية." }]);
  };

  return (
    <div className="h-full bg-[#050505] text-white flex flex-col" dir="rtl">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center space-x-3 space-x-reverse">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter flex items-center">
              الخبير <span className="text-yellow-500 mr-1">المُشرِف</span>
              <Sparkles size={14} className="mr-2 text-yellow-500 animate-pulse" />
            </h1>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">Autonomous Sovereignty Overseer</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase ${isSubscribed ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-500' : 'border-white/10 text-gray-500'}`}>
          {isSubscribed ? 'بروتوكول نشط' : 'بانتظار التفعيل'}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row relative">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col border-l border-white/5">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
                <div className="w-24 h-24 bg-yellow-500/10 rounded-[40px] flex items-center justify-center border border-yellow-500/20 animate-sovereign-spin">
                  <Wand2 size={48} className="text-yellow-500" />
                </div>
                <div className="max-w-xs">
                  <h2 className="text-2xl font-black italic mb-2">أهلاً بك يا ركن</h2>
                  <p className="text-xs text-gray-500 font-bold leading-relaxed">
                    أنا خبيرك المشرِف. ناقش معي كيف تريدني أن أدير حسابك، ما هي صلاحيات الإشراف التي تمنحني إياها؟ وكيف تريدني أن أبني مشاريعك؟
                  </p>
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end animate-slide-up'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm ${m.role === 'user' ? 'bg-white/5 border border-white/10' : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-50'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-end animate-pulse">
                <div className="bg-yellow-500/5 p-3 rounded-2xl border border-yellow-500/10 text-[10px] italic">جاري التخطيط للسيادة...</div>
              </div>
            )}
          </div>

          <div className="p-4 bg-black/80 border-t border-white/10">
            <div className="flex items-center space-x-2 space-x-reverse max-w-4xl mx-auto">
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
                placeholder="ناقش صلاحيات الخبير هنا..." 
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-yellow-500 transition-all" 
              />
              <button onClick={handleSend} className="p-4 bg-yellow-500 rounded-2xl text-black shadow-xl active:scale-95 transition-all"><Send size={20} /></button>
            </div>
          </div>
        </div>

        {/* Status Dashboard - Desktop Only Side / Mobile Toggle */}
        <div className="w-full lg:w-80 bg-black/40 backdrop-blur-2xl p-6 overflow-y-auto no-scrollbar space-y-6">
          <div className="flex items-center space-x-2 space-x-reverse mb-4">
             <Activity size={18} className="text-yellow-500" />
             <h3 className="text-xs font-black uppercase tracking-widest">لوحة التحكم بالبروتوكولات</h3>
          </div>

          <div className="space-y-3">
             {[
               { id: 'commentMod', label: 'الإشراف على التعليقات', icon: <MessageSquare size={14} />, desc: 'حذف المحتوى المسيء تلقائياً' },
               { id: 'autoPosting', label: 'النشر التلقائي الذكي', icon: <Bot size={14} />, desc: 'نشر محتوى دوري بناءً على اهتماماتك' },
               { id: 'projectBuilding', label: 'بناء المشاريع دورياً', icon: <Terminal size={14} />, desc: 'تطوير مستودعات الأكواد كل 24 ساعة' }
             ].map((p) => (
               <div key={p.id} className={`p-4 rounded-2xl border transition-all ${protocols[p.id as keyof typeof protocols] ? 'bg-yellow-500/10 border-yellow-500/30 shadow-lg' : 'bg-white/5 border-white/5'}`}>
                  <div className="flex items-center justify-between mb-2">
                     <div className="flex items-center space-x-2 space-x-reverse">
                        <div className={`${protocols[p.id as keyof typeof protocols] ? 'text-yellow-500' : 'text-gray-500'}`}>{p.icon}</div>
                        <span className="text-[10px] font-black">{p.label}</span>
                     </div>
                     <button 
                        onClick={() => toggleProtocol(p.id as any)}
                        className={`w-10 h-5 rounded-full relative transition-all ${protocols[p.id as keyof typeof protocols] ? 'bg-yellow-500' : 'bg-gray-700'}`}
                     >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${protocols[p.id as keyof typeof protocols] ? 'right-6' : 'right-1'}`}></div>
                     </button>
                  </div>
                  <p className="text-[8px] text-gray-500 font-bold">{p.desc}</p>
               </div>
             ))}
          </div>

          {/* Time Frequency */}
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-3">
             <div className="flex items-center space-x-2 space-x-reverse">
                <Clock size={14} className="text-indigo-400" />
                <span className="text-[10px] font-black">تكرار المهام</span>
             </div>
             <div className="grid grid-cols-3 gap-2">
                {['6h', '12h', '24h'].map(t => (
                  <button 
                    key={t}
                    onClick={() => isSubscribed && setProtocols(prev => ({...prev, frequency: t}))}
                    className={`py-2 rounded-lg text-[9px] font-black transition-all ${protocols.frequency === t ? 'bg-indigo-600 text-white' : 'bg-black/40 text-gray-500'}`}
                  >
                    {t === '6h' ? '6 ساعات' : t === '12h' ? '12 ساعة' : 'يومياً'}
                  </button>
                ))}
             </div>
          </div>

          <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex items-start space-x-3 space-x-reverse">
             <ShieldCheck size={16} className="text-yellow-500 mt-1 shrink-0" />
             <p className="text-[8px] text-gray-500 font-bold leading-relaxed">
               بمجرد تفعيل "البروتوكول"، سأقوم بمراجعة حسابك والقيام بالمهام كل دورة زمنية حتى تطلب مني التوقف.
             </p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 max-w-sm w-full text-center space-y-6 relative overflow-hidden shadow-[0_0_80px_rgba(236,72,153,0.1)]">
             <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 blur-3xl"></div>
             <div className="w-20 h-20 bg-yellow-500/20 rounded-3xl flex items-center justify-center mx-auto border border-yellow-500/30">
                <Coins size={36} className="text-yellow-500" />
             </div>
             <div>
                <h3 className="text-xl font-black italic mb-2">تفعيل بروتوكول الإشراف</h3>
                <p className="text-xs text-gray-400 font-bold leading-relaxed">
                  هذه الميزة تتطلب صلاحيات وصول عليا واستخدام مستمر للذكاء الاصطناعي. تفعيل الخدمة بـ 500 FX شهرياً.
                </p>
             </div>
             <div className="space-y-3">
                <button onClick={handlePayment} className="w-full py-4 flixo-gradient rounded-2xl font-black text-white text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-3 space-x-reverse">
                   <Zap size={18} />
                   <span>تأمين الدفع والتفعيل</span>
                </button>
                <button onClick={() => setShowPayModal(false)} className="text-[10px] font-black text-gray-500 uppercase tracking-widest">إلغاء الآن</button>
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
          animation: sovereign-spin 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default OverseerExpert;
