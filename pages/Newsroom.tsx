
import React, { useState, useEffect } from 'react';
import { Newspaper, Zap, Brain, Globe, ChevronLeft, Sparkles, TrendingUp, Search } from 'lucide-react';
import { geminiService } from '../services/geminiService';

const Newsroom: React.FC = () => {
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [news, setNews] = useState([
    { id: '1', title: 'ثورة في عالم الذكاء الاصطناعي التوليدي', category: 'تكنولوجيا', summary: 'إطلاق نماذج جديدة قادرة على فهم المشاعر البشرية بعمق.', timestamp: 'منذ ساعتين' },
    { id: '2', title: 'النمو الاقتصادي الرقمي يتجاوز التوقعات', category: 'اقتصاد', summary: 'ارتفاع كبير في قيمة الأصول الرقمية وصناعة المحتوى.', timestamp: 'منذ 4 ساعات' }
  ]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Record<string, string>>({});

  const handleAnalyze = async (id: string, topic: string) => {
    setAnalyzing(id);
    const result = await geminiService.analyzeNews(topic);
    setSelectedAnalysis(prev => ({ ...prev, [id]: result }));
    setAnalyzing(null);
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
          <div key={item.id} className="bg-white/5 border border-white/10 rounded-[35px] p-6 hover:border-indigo-500/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full font-black uppercase tracking-widest">{item.category}</span>
              <span className="text-[10px] text-gray-500 font-bold">{item.timestamp}</span>
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
      
      <div className="mt-12 p-8 bg-gradient-to-r from-yellow-900/20 to-black border border-yellow-500/20 rounded-[40px] text-center">
         <Sparkles className="text-yellow-500 mx-auto mb-4" size={32} />
         <h4 className="text-xl font-black italic mb-2 text-yellow-500">ميزة قادمة للمبدعين</h4>
         <p className="text-xs text-gray-400 font-bold">بث مباشر للأخبار العالمية مع تعليق "خبير فليكسو" الصوتي فوراً.</p>
      </div>
    </div>
  );
};

export default Newsroom;
