
import React, { useState, useEffect } from 'react';
import { BarChart4, TrendingUp, ArrowUpRight, ArrowDownRight, Info, ChevronLeft, Coins, Globe, Target, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { geminiService } from '../services/geminiService';

const SovereignStocks: React.FC = () => {
  const navigate = useNavigate();
  const [sharePrice, setSharePrice] = useState(125.40);
  const [userShares, setUserShares] = useState(10);
  const [isBuying, setIsBuying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const stats = [
    { label: 'دخل جوجل السنوي', val: '$1.2B', icon: <Globe size={14} className="text-blue-400" /> },
    { label: 'نسبة الأرباح للمساهمين', val: '15%', icon: <Target size={14} className="text-green-400" /> },
    { label: 'القيمة السوقية لفليكسو', val: '500M FX', icon: <Coins size={14} className="text-yellow-500" /> }
  ];

  const handleBuy = () => {
    setIsBuying(true);
    setTimeout(() => {
      setUserShares(prev => prev + 1);
      setIsBuying(false);
    }, 1500);
  };

  const fetchAiInsight = async () => {
    setIsAnalyzing(true);
    const insight = await geminiService.generateStockInsight(userShares);
    setAiInsight(insight);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    fetchAiInsight();
  }, [userShares]);

  return (
    <div className="h-full bg-black text-white flex flex-col overflow-y-auto pb-32 no-scrollbar" dir="rtl">
      <div className="p-8 pt-16 border-b border-white/5 bg-gradient-to-b from-green-900/20 to-transparent">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate(-1)} className="p-3 bg-white/5 rounded-2xl border border-white/10"><ChevronLeft size={24} /></button>
          <div className="text-center">
            <h1 className="text-2xl font-black italic tracking-tighter">بورصة <span className="text-green-500">فليكسو</span></h1>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Google Revenue Sharing System</p>
          </div>
          <div className="p-3 bg-green-500/10 rounded-2xl border border-green-500/20"><BarChart4 size={24} className="text-green-500" /></div>
        </div>

        {/* AI Insight Section */}
        {aiInsight && (
          <div className="mb-8 p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-[35px] animate-slide-up">
            <div className="flex items-center space-x-2 space-x-reverse text-indigo-400 mb-3">
               <Sparkles size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">تحليل النواة السيادية</span>
            </div>
            <p className="text-xs text-indigo-100 font-bold italic leading-relaxed">{aiInsight}</p>
          </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 mb-8 relative overflow-hidden">
           <div className="flex justify-between items-end mb-8">
              <div>
                 <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">سعر السهم الحالي</span>
                 <div className="flex items-center space-x-2 space-x-reverse">
                    <h2 className="text-4xl font-black italic text-green-500">{sharePrice}</h2>
                    <span className="text-xs font-black text-gray-500">FX</span>
                    <div className="flex items-center text-green-500 text-[10px] font-black bg-green-500/10 px-2 py-1 rounded-lg">
                       <ArrowUpRight size={12} className="ml-1" /> +4.2%
                    </div>
                 </div>
              </div>
              <div className="h-16 w-32 flex items-end space-x-1 space-x-reverse">
                 {[40, 60, 45, 70, 55, 90, 85].map((h, i) => (
                   <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-green-500/40 rounded-t-sm animate-pulse"></div>
                 ))}
              </div>
           </div>
           <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                   <div className="flex justify-center mb-1">{s.icon}</div>
                   <p className="text-[8px] text-gray-500 font-black uppercase">{s.label}</p>
                   <p className="text-xs font-black">{s.val}</p>
                </div>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <button 
             onClick={handleBuy}
             className="py-5 bg-green-600 text-white rounded-[25px] font-black text-sm shadow-[0_20px_40px_rgba(22,163,74,0.3)] active:scale-95 transition-all"
           >
             {isBuying ? <Loader2 className="animate-spin mx-auto" /> : 'شراء أسهم'}
           </button>
           <button onClick={fetchAiInsight} className="py-5 bg-white/5 border border-white/10 text-white rounded-[25px] font-black text-sm active:scale-95 transition-all">
             {isAnalyzing ? <Loader2 className="animate-spin mx-auto" /> : 'تحديث التحليل'}
           </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
         <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-widest px-2">محفظتك الاستثمارية</h4>
         <div className="p-6 bg-white/5 border border-white/5 rounded-[35px] flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
               <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20 text-green-500">
                  <TrendingUp size={24} />
               </div>
               <div>
                  <span className="text-sm font-black text-white">{userShares} سهم مملوك</span>
                  <span className="text-[10px] text-gray-500 block">القيمة: {(userShares * sharePrice).toFixed(2)} FX</span>
               </div>
            </div>
            <div className="text-left">
               <span className="text-[10px] text-green-500 font-black block">أرباحك المحققة</span>
               <span className="text-sm font-black text-white">+254.10 FX</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SovereignStocks;
