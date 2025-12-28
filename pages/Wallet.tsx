
import React, { useState } from 'react';
import { Wallet as WalletIcon, TrendingUp, ArrowUpRight, ArrowDownLeft, Sparkles, ChevronLeft, CreditCard, History, Zap, ShieldCheck, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Wallet: React.FC = () => {
  const navigate = useNavigate();
  const [balance] = useState(15420);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [wealthInsight, setWealthInsight] = useState<string | null>(null);

  const transactions = [
    { id: 1, type: 'gift', title: 'هدية من متابع', amount: 500, date: 'اليوم', status: 'received' },
    { id: 2, type: 'ads', title: 'عائدات إعلانية', amount: 1200, date: 'أمس', status: 'received' },
    { id: 3, type: 'repair', title: 'إصلاح كود سيادي', amount: -200, date: 'منذ يومين', status: 'spent' },
  ];

  const getWealthInsight = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setWealthInsight("سيادة المدير، نمو ثروتك الرقمية يتجاوز المعدل بنسبة 15%. ننصح باستثمار 2000 FX في 'ساحة الشطرنج' لرفع مستوى السيادة.");
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="h-full bg-black text-white flex flex-col overflow-y-auto pb-32 no-scrollbar" dir="rtl">
      {/* Header */}
      <div className="p-6 pt-12 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-xl z-20 border-b border-white/5">
        <div className="flex items-center space-x-4 space-x-reverse">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-black italic tracking-tighter">المحفظة <span className="text-yellow-500">السيادية</span></h1>
        </div>
        <div className="p-2 bg-yellow-500/10 rounded-xl">
          <ShieldCheck className="text-yellow-500" size={20} />
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Holographic Card */}
        <div className="relative h-56 w-full rounded-[40px] p-8 overflow-hidden group">
          <div className="absolute inset-0 flixo-gradient opacity-90 group-hover:rotate-1 transition-transform duration-700"></div>
          <div className="absolute inset-0 bg-[url('https://api.dicebear.com/7.x/shapes/svg?seed=wallet_bg')] bg-cover opacity-20 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/20 via-transparent to-black/40"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Sovereign Balance</p>
                <div className="flex items-baseline space-x-2 space-x-reverse">
                  <h2 className="text-4xl font-black italic tracking-tighter">{balance.toLocaleString()}</h2>
                  <span className="text-sm font-black text-yellow-300">FX</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                <span className="font-black italic text-xl">FX</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase opacity-60">Account Holder</p>
                <p className="text-xs font-black tracking-widest">KHALID ALMONTASER</p>
              </div>
              <div className="flex -space-x-3 space-x-reverse">
                <div className="w-8 h-8 rounded-full bg-yellow-500/80 border border-white/20"></div>
                <div className="w-8 h-8 rounded-full bg-pink-500/80 border border-white/20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'شحن', icon: <ArrowDownLeft size={20} />, color: 'bg-green-500' },
            { label: 'تحويل', icon: <ArrowUpRight size={20} />, color: 'bg-indigo-500' },
            { label: 'سحب', icon: <CreditCard size={20} />, color: 'bg-yellow-500' },
            { label: 'تحليل', icon: <PieChart size={20} />, color: 'bg-pink-500' }
          ].map((action, i) => (
            <button key={i} className="flex flex-col items-center space-y-2 group">
              <div className={`w-14 h-14 ${action.color}/10 rounded-[22px] flex items-center justify-center border border-${action.color}/20 group-active:scale-90 transition-all`}>
                <div className={`text-${action.color.split('-')[1]}-500`}>{action.icon}</div>
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase">{action.label}</span>
            </button>
          ))}
        </div>

        {/* AI Insight Section */}
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-3xl"></div>
          <div className="flex items-center space-x-4 space-x-reverse mb-6">
            <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black italic">مستشار الثروة الذكي</h3>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">AI Wealth Analysis</p>
            </div>
          </div>

          {!wealthInsight ? (
            <button 
              onClick={getWealthInsight}
              disabled={isAnalyzing}
              className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black flex items-center justify-center space-x-3 space-x-reverse hover:bg-white/10 transition-all"
            >
              {isAnalyzing ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Zap size={16} className="text-yellow-500" />
                  <span>تحليل استراتيجية الثروة</span>
                </>
              )}
            </button>
          ) : (
            <div className="p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl animate-slide-up">
              <p className="text-xs text-indigo-200 font-bold italic leading-relaxed text-right">{wealthInsight}</p>
            </div>
          )}
        </div>

        {/* History */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-widest">السجل الأخير</h4>
            <History size={14} className="text-gray-600" />
          </div>
          <div className="space-y-2">
            {transactions.map(t => (
              <div key={t.id} className="p-5 bg-white/5 border border-white/5 rounded-[30px] flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className={`p-3 rounded-2xl ${t.amount > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {t.amount > 0 ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>
                  <div>
                    <span className="block text-xs font-black">{t.title}</span>
                    <span className="text-[10px] text-gray-500 font-bold">{t.date}</span>
                  </div>
                </div>
                <div className={`text-sm font-black ${t.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {t.amount > 0 ? '+' : ''}{t.amount} FX
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
