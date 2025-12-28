
import React from 'react';
import { ScrollText, ShieldCheck, Gavel, CheckCircle2, ChevronLeft, Sparkles, Scale, Lock, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Charter: React.FC = () => {
  const navigate = useNavigate();

  const rights = [
    { 
      title: "حق ملكيتك يا ركن", 
      content: "كل ما تنشره هو ملكك وحدك. فليكسو لا تملك محتواك، المطور خالد المنتصر يضمن لك السيادة الكاملة على إبداعك.",
      icon: <CheckCircle2 className="text-green-500" />
    },
    { 
      title: "خصوصيتك في وجهي", 
      content: "بياناتك مشفرة ببروتوكولات يمانية معقدة. لا أحد، ولا حتى إدارة المنصة، يمكنه التجسس على خصوصياتك.",
      icon: <Lock className="text-indigo-500" />
    },
    { 
      title: "أمانك سيادي ومقدس", 
      content: "نحن نحميك من أي تنمر أو إساءة عبر أنظمة ذكية تعمل وفق قيمنا اليمانية الأصيلة.",
      icon: <ShieldCheck className="text-blue-500" />
    },
    { 
      title: "حقك محفوظ عند خالد", 
      content: "أي مشكلة تواجهك، صوتك مسموع. يمكنك التواصل المباشر مع غرفة العمليات لضمان نيل حقك فوراً.",
      icon: <Gavel className="text-yellow-500" />
    }
  ];

  return (
    <div className="h-full bg-black text-white flex flex-col overflow-y-auto pb-40 no-scrollbar" dir="rtl">
      <div className="h-1.5 w-full flex">
         <div className="flex-1 bg-[#CE1126]"></div>
         <div className="flex-1 bg-white"></div>
         <div className="flex-1 bg-black"></div>
      </div>

      <div className="p-8 pt-16 relative overflow-hidden text-center space-y-6">
        <button onClick={() => navigate(-1)} className="absolute top-12 right-6 p-3 bg-white/5 rounded-2xl border border-white/10 active:scale-90">
          <ChevronLeft size={24} />
        </button>
        <div className="w-20 h-20 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center mx-auto shadow-2xl">
          <Scale size={40} className="text-yellow-500" />
        </div>
        <h1 className="text-3xl font-black italic tracking-tighter">ميثاق <span className="text-yellow-500">السيادة اليمانية</span></h1>
        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">FLIXO Sovereign Charter • Khalid Almontaser</p>
      </div>

      <div className="p-8 space-y-8">
        <div className="p-8 bg-white/5 border border-white/10 rounded-[45px] relative">
           <div className="flex items-center space-x-2 space-x-reverse mb-4">
              <Sparkles size={16} className="text-yellow-500" />
              <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">عهد المطور خالد المنتصر</span>
           </div>
           <p className="text-sm text-gray-300 leading-relaxed font-bold italic">
             "أنا خالد المنتصر، أتعهد أمام الله وأمامكم أن تكون هذه المنصة واحة للأمان والإبداع، وأن تظل حقوقكم ملكية مقدسة لا تُمس."
           </p>
        </div>

        <div className="space-y-4">
           {rights.map((right, i) => (
             <div key={i} className="flex space-x-4 space-x-reverse p-6 bg-white/5 border border-white/5 rounded-[30px]">
                <div className="p-3 bg-white/5 rounded-2xl h-fit border border-white/10">{right.icon}</div>
                <div className="flex-1">
                   <h4 className="text-lg font-black italic text-white">{right.title}</h4>
                   <p className="text-xs text-gray-400 leading-relaxed font-medium">{right.content}</p>
                </div>
             </div>
           ))}
        </div>

        <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[40px] flex items-start space-x-4 space-x-reverse">
           <Globe className="text-indigo-400 mt-1" size={20} />
           <div className="text-[10px] text-gray-400 font-bold leading-relaxed space-y-2">
             <p>جميع العمليات في المنصة تخضع لقانون فليكسو السيادي.</p>
             <p>حقوق الطبع والنشر والبرمجة © 2025 محفوظة حصراً للمطور خالد المنتصر.</p>
           </div>
        </div>

        <div className="pt-12 text-center border-t border-white/5">
           <div className="flex items-center justify-center space-x-2 space-x-reverse mb-4">
              <div className="w-10 h-5 bg-[#CE1126] border border-white/10"></div>
              <div className="w-10 h-5 bg-white border border-white/10"></div>
              <div className="w-10 h-5 bg-black border border-white/10"></div>
           </div>
           <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.5em]">KHALID ALMONTASER • SOVEREIGN YEMEN</p>
        </div>
      </div>
    </div>
  );
};

export default Charter;
