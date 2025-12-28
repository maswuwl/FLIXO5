
import React from 'react';
import { 
  Video, Wallet, Lock, ChevronLeft, Code2, Coins, Mic, Brain, HelpCircle, Eye, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Blueprint: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    {
      category: "مركز الذكاء (كيف تستخدم فليكسو؟)",
      features: [
        { name: "خبير فليكسو - حاكه بصوتك", desc: "اضغط المايك وكلم الذكاء كأنك تكلم صاحبك. اطلب منه يكتب لك قصائد أو يبرمج لك اللي في بالك.", icon: <Mic size={14} /> },
        { name: "استوديو البناء - شغل يدك", desc: "هنا تقدر تحط روابط شغلك وتصلح الأخطاء بضغطة زر عبر ذكاء Gemini المتطور.", icon: <Code2 size={14} /> },
        { name: "توليد الفيديو - خيالك حقيقة", desc: "اكتب وصف للمشهد اللي في راسك، ومحرك Veo بيسويه لك فيديو حالي قوي.", icon: <Video size={14} /> }
      ]
    },
    {
      category: "الفلوس والأرباح (رزقك عندنا)",
      features: [
        { name: "محفظة FX - خبي قرشك", desc: "هنا تدير عملاتك الرقمية. تجمعها من الهدايا أو من أرباحك في الأسهم.", icon: <Wallet size={14} /> },
        { name: "البورصة اليمانية", desc: "كن شريك معنا. امتلك أسهم في فليكسو وخذ أرباحك كل أسبوع وانت مرتاح.", icon: <Coins size={14} /> }
      ]
    }
  ];

  return (
    <div className="h-full bg-black text-white flex flex-col overflow-y-auto pb-40 no-scrollbar" dir="rtl">
      <div className="p-8 pt-16 text-center space-y-6">
        <button onClick={() => navigate(-1)} className="absolute top-12 right-6 p-3 bg-white/5 rounded-2xl">
          <ChevronLeft size={24} />
        </button>
        <div className="w-20 h-20 bg-indigo-600/20 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl">
          <HelpCircle size={40} className="text-indigo-500" />
        </div>
        <h1 className="text-3xl font-black italic tracking-tighter">دليل <span className="text-indigo-500">التعليمات</span> اليماني</h1>
        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.4em]">Official Instruction Manual • Yemen Edition</p>
      </div>

      <div className="px-6 space-y-12">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-6">
            <h2 className="text-xl font-black italic text-white border-r-4 border-indigo-500 pr-4">{cat.category}</h2>
            <div className="grid grid-cols-1 gap-4">
              {cat.features.map((feat, fIdx) => (
                <div key={fIdx} className="bg-white/5 border border-white/5 rounded-[30px] p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-center space-x-3 space-x-reverse mb-3">
                    <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">{feat.icon}</div>
                    <h3 className="font-black text-sm">{feat.name}</h3>
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 p-12 text-center bg-white/5 border-t border-white/5">
        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.5em] mb-2">حقوق الملكية للمطور خالد المنتصر</p>
        <p className="text-[8px] text-gray-800 font-bold italic">جميع الميزات تعمل بذكاء Gemini 3.0 Pro المخصص لليمن.</p>
      </div>
    </div>
  );
};

export default Blueprint;
