
import React, { useState } from 'react';
import { Users, ShieldCheck, Sparkles, MessageCircle, Crown, ChevronLeft, Heart, Zap, ScrollText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_USERS } from '../constants';

const Community: React.FC = () => {
  const navigate = useNavigate();
  const [pledged, setPledged] = useState(false);
  const [isPledging, setIsPledging] = useState(false);

  const circles = [
    { id: 'c1', name: 'ديوان الحكماء', desc: 'نقاشات تقنية عميقة لمستقبل المنصة.', members: '12.4K', tier: 1 },
    { id: 'c2', name: 'ساحة المبدعين', desc: 'مشاركة الفنون والمحتوى المولد بالذكاء الاصطناعي.', members: '450K', tier: 4 },
    { id: 'c3', name: 'غرفة السيادة', desc: 'حصري لمستخدمي الرتبة الذهبية.', members: '120', tier: 0 }
  ];

  const handlePledge = () => {
    setIsPledging(true);
    setTimeout(() => {
      setIsPledging(false);
      setPledged(true);
    }, 3000);
  };

  return (
    <div className="h-full bg-black text-white flex flex-col overflow-y-auto pb-40 no-scrollbar" dir="rtl">
      {/* Header */}
      <div className="p-8 pt-16 border-b border-white/5 bg-gradient-to-b from-indigo-900/20 to-transparent">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="p-3 bg-white/5 rounded-2xl border border-white/10"><ChevronLeft size={24} /></button>
          <div className="text-center">
            <h1 className="text-3xl font-black italic tracking-tighter">مجتمع <span className="text-indigo-500">السيادة</span></h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">Circles of Power • FLIXO Universe</p>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20"><Users size={24} className="text-indigo-400" /></div>
        </div>

        {/* Loyalty Pledge Banner */}
        <div className={`p-8 rounded-[40px] border relative overflow-hidden transition-all duration-700 ${pledged ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/10'}`}>
           <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className={`p-4 rounded-full transition-transform duration-1000 ${pledged ? 'bg-yellow-500 text-black rotate-[360deg]' : 'bg-white/10 text-white'}`}>
                {pledged ? <Crown size={40} /> : <ScrollText size={40} />}
              </div>
              <h3 className="text-xl font-black italic">{pledged ? 'أنت الآن في عهد السيادة' : 'ميثاق البيعة الرقمية'}</h3>
              <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                {pledged ? 'لقد أصبحت جزءاً من النخبة السيادية. تم فتح صلاحيات الوصول الكامل للمختبرات.' : 'بصفتك عضواً في فليكسو، يمكنك توقيع ميثاق الولاء للمنصة لرفع رتبتك فوراً.'}
              </p>
              {!pledged && (
                <button 
                  onClick={handlePledge}
                  disabled={isPledging}
                  className="px-10 py-4 flixo-gradient rounded-full font-black text-xs shadow-xl active:scale-95 transition-all"
                >
                  {isPledging ? 'جاري توثيق الميثاق...' : 'توقيع ميثاق البيعة'}
                </button>
              )}
           </div>
           {isPledging && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center animate-pulse"><Zap size={48} className="text-yellow-500" /></div>}
        </div>
      </div>

      <div className="p-6 space-y-8">
        <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-widest px-2">دوائر القوة (Circles)</h4>
        <div className="space-y-4">
          {circles.map(circle => (
            <div key={circle.id} className="p-6 bg-white/5 border border-white/5 rounded-[35px] hover:bg-white/10 transition-all group">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
                      {circle.tier === 0 ? <Crown className="text-yellow-500" /> : <ShieldCheck className="text-indigo-400" />}
                    </div>
                    <div>
                      <h5 className="font-black text-white">{circle.name}</h5>
                      <span className="text-[10px] text-gray-500 font-bold">{circle.members} عضو</span>
                    </div>
                  </div>
                  <button className="p-3 bg-white/5 rounded-xl text-gray-400 group-hover:text-white"><MessageCircle size={18} /></button>
               </div>
               <p className="text-xs text-gray-400 font-medium leading-relaxed">{circle.desc}</p>
            </div>
          ))}
        </div>

        {/* Community Leaderboard Snippet */}
        <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-[40px] p-8 space-y-6">
           <div className="flex items-center space-x-3 space-x-reverse">
              <Zap size={20} className="text-indigo-400" />
              <h4 className="text-sm font-black italic">نخبة المجتمع</h4>
           </div>
           <div className="space-y-3">
              {MOCK_USERS.map((user, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded-2xl border border-white/5">
                   <div className="flex items-center space-x-3 space-x-reverse">
                      <img src={user.avatar} className="w-8 h-8 rounded-full border border-white/10" alt="avatar" />
                      <span className="text-xs font-bold">{user.displayName}</span>
                   </div>
                   <span className="text-[10px] font-black text-indigo-500">{i + 1}#</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
