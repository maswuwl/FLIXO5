
import React, { useState, useEffect } from 'react';
import { Newspaper, Zap, Brain, Globe, ChevronLeft, Sparkles, TrendingUp, Search, Volume2, Mic2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';

const Newsroom: React.FC = () => {
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState<string | null>(null);
  const [news, setNews] = useState([
    { id: '1', title: 'ثورة في عالم الذكاء الاصطناعي التوليدي', category: 'تكنولوجيا', summary: 'إطلاق نماذج جديدة قادرة على فهم المشاعر البشرية بعمق، مما يفتح آفاقاً جديدة في التفاعل بين الإنسان والآلة.', timestamp: 'منذ ساعتين' },
    { id: '2', title: 'النمو الاقتصادي الرقمي يتجاوز التوقعات', category: 'اقتصاد', summary: 'ارتفاع كبير في قيمة الأصول الرقمية وصناعة المحتوى، حيث أصبحت المنصات الترفيهية المحرك الأول للاقتصاد الحديث.', timestamp: 'منذ 4 ساعات' }
  ]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Record<string, string>>({});

  const handleAnalyze = async (id: string, topic: string) => {
    setAnalyzing(id);
    const result = await geminiService.analyzeNews(topic);
    setSelectedAnalysis(prev => ({ ...prev, [id]: result }));
    setAnalyzing(null);
  };

  const handleBroadcast = async (item: typeof news[0]) => {
    setIsBroadcasting(item.id);
    await geminiService.speakNews(`${item.title}. ${item.summary}`);
    setTimeout(() => setIsBroadcasting(null), 3000); // UI indicator reset
  };

  return (
    <div className="h-full bg-black text-white flex flex-col p-6 pt-12 overflow-y-auto pb-32 no-scrollbar" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => window.history.back()} className="p-3 bg-white/5 rounded-2xl border border-white/10"><ChevronLeft size={24} /></button>
        <div className="text-center">
          <h1 className="text-2xl font-black italic tracking-tighter">غرفة الأخبار <span className="flixo-text-gradient">الملكية</span></h1>
          <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">Sovereign Strategic Intelligence</p>
        </div>
        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
          <Globe size={24} />
        </div>
      </div>

      <div className="space-y-6">
        {news.map((item) => (
          <div key={item.id} className="bg-white/5 border border-white/10 rounded-[35px] p-6 hover:border-indigo-500/30 transition-all relative overflow-hidden group">
            {isBroadcasting === item.id && (
              <div className="absolute top-0 right-0 left-0 h-1 bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,1)] animate-pulse"></div>
            )}
            
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full font-black uppercase tracking-widest">{item.category}</span>
              <div className="flex items-center space-x-3 space-x-reverse">
                <button 
                  onClick={() => handleBroadcast(item)}
                  className={`p-2 rounded-xl border transition-all ${isBroadcasting === item.id ? 'bg-indigo-500 border-indigo-500 text-white animate-pulse' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
                >
                  <Volume2 size={16} />
                </button>
                <span className="text-[10px] text-gray-500 font-bold">{item.timestamp}</span>
              </div>
            </div>
            
            <h3 className="text-lg font-black mb-3 leading-tight">{item.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">{item.summary}</p>
            
            {selectedAnalysis[item.id] ? (
              <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl animate-slide-up">
                <div className="flex items-center mb-2 text-indigo-400">
                  <Brain size={14} className="ml-2 animate-pulse" />
                  <span className="text-[10px] font-black uppercase italic">تحليل فليكسو السيادي:</span>
                </div>
                <p className="text-xs text-indigo-100 font-bold italic leading-relaxed">{selectedAnalysis[item.id]}</p>
              </div>
            ) : (
              <button 
                onClick={() => handleAnalyze(item.id, item.title)}
                disabled={analyzing === item.id}
                className="w-full py-4 bg-indigo-600 rounded-2xl flex items-center justify-center space-x-2 space-x-reverse font-black text-xs shadow-xl active:scale-95 transition-all"
              >
                {analyzing === item.id ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Zap size={16} />
                    <span>احصل على الرؤية الاستراتيجية</span>
                  </>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-12 p-8 bg-gradient-to-r from-yellow-900/20 to-black border border-yellow-500/20 rounded-[40px] text-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[url('https://api.dicebear.com/7.x/shapes/svg?seed=news_bg')] bg-cover"></div>
         <Sparkles className="text-yellow-500 mx-auto mb-4 relative z-10" size={32} />
         <h4 className="text-xl font-black italic mb-2 text-yellow-500 relative z-10">البث الصوتي المباشر</h4>
         <p className="text-xs text-gray-400 font-bold relative z-10">اضغط على أيقونة الصوت لسماع الخبر بصوت مذيعنا الذكي "Kore".</p>
      </div>
    </div>
  );
};

export default Newsroom;
