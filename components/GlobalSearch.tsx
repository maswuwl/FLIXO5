
import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles, User, Hash, MessageSquarePlus, Settings as SettingsIcon, ExternalLink, Globe, Loader2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { MOCK_USERS, MOCK_FEED } from '../constants';
import { useNavigate } from 'react-router-dom';

const GlobalSearch: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ users: any[], tags: string[], settings: any[] }>({ users: [], tags: [], settings: [] });
  const [aiInsight, setAiInsight] = useState<{text: string, sources: any[]} | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const SETTINGS_REGISTRY = [
    { label: 'تغيير المظهر (ليلي/نهاري)', path: '/settings', icon: <SettingsIcon size={14} /> },
    { label: 'إدارة الخصوصية والأمان', path: '/settings', icon: <SettingsIcon size={14} /> },
    { label: 'إدارة العلامة المائية', path: '/create', icon: <SettingsIcon size={14} /> },
    { label: 'القبو السيادي', path: '/vault', icon: <SettingsIcon size={14} /> }
  ];

  useEffect(() => {
    if (query.trim().length > 1) {
      const filteredUsers = MOCK_USERS.filter(u => u.displayName.toLowerCase().includes(query.toLowerCase()));
      const filteredTags = Array.from(new Set(MOCK_FEED.flatMap(f => f.tags || []))).filter(t => t.toLowerCase().includes(query.toLowerCase()));
      const filteredSettings = SETTINGS_REGISTRY.filter(s => s.label.toLowerCase().includes(query.toLowerCase()));
      setResults({ users: filteredUsers, tags: filteredTags, settings: filteredSettings });
      
      if (filteredUsers.length === 0 && filteredTags.length === 0 && filteredSettings.length === 0) {
        handleAiSearch();
      } else {
        setAiInsight(null);
      }
    } else {
      setResults({ users: [], tags: [], settings: [] });
      setAiInsight(null);
    }
  }, [query]);

  const handleAiSearch = async () => {
    if (isAnalyzing || query.length < 3) return;
    setIsAnalyzing(true);
    const result = await geminiService.analyzeSearchQuery(query);
    setAiInsight(result);
    setIsAnalyzing(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)} 
        className="w-7 h-7 glass-order4 rounded-lg flex items-center justify-center text-gray-400 active-tap animate-pulse-glow"
      >
        <Search size={14} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[250] bg-black/95 backdrop-blur-2xl flex flex-col p-6 animate-fade-in" dir="rtl">
      <div className="flex items-center space-x-4 space-x-reverse mb-8">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input autoFocus type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث عن ميزة، مبدع، أو اسأل العالم..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm shadow-2xl" />
        </div>
        <button onClick={() => setIsOpen(false)} className="p-4 bg-white/5 rounded-2xl text-white hover:bg-red-500/20 transition-colors active:scale-90"><X size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar pb-10">
        {/* AI Global Web Grounding Results */}
        {aiInsight && (
          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[40px] p-6 space-y-4 animate-slide-up">
             <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 space-x-reverse text-indigo-400">
                   <Globe size={16} className="animate-spin-slow" />
                   <h4 className="text-[10px] font-black uppercase tracking-widest">نتائج البحث الويب السيادي</h4>
                </div>
                <div className="px-2 py-0.5 bg-indigo-500/20 rounded-full text-[8px] font-black text-indigo-400">LIVE GROUNDING</div>
             </div>
             <p className="text-xs text-indigo-100 font-medium leading-relaxed">{aiInsight.text}</p>
             {aiInsight.sources.length > 0 && (
               <div className="pt-4 border-t border-indigo-500/10 space-y-2">
                  <span className="text-[9px] text-gray-500 font-black uppercase block mb-2">المصادر الموثقة:</span>
                  <div className="grid grid-cols-1 gap-2">
                     {aiInsight.sources.map((s, idx) => (
                       <a key={idx} href={s.web?.uri} target="_blank" className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 hover:bg-white/5 transition-all">
                          <span className="text-[10px] text-indigo-300 truncate max-w-[200px]">{s.web?.title}</span>
                          <ExternalLink size={12} className="text-indigo-500" />
                       </a>
                     ))}
                  </div>
               </div>
             )}
          </div>
        )}

        {isAnalyzing && (
           <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-pulse">
              <Loader2 size={32} className="text-indigo-500 animate-spin" />
              <p className="text-[10px] text-indigo-400 font-black tracking-widest uppercase">جاري استدعاء البيانات من الويب العالمي...</p>
           </div>
        )}

        {results.settings.length > 0 && (
          <div>
            <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4 px-2">نظام فليكسو</h4>
            <div className="space-y-2">
              {results.settings.map((s, i) => (
                <button key={i} onClick={() => { navigate(s.path); setIsOpen(false); }} className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-indigo-500/10 transition-all group">
                   <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="p-2 bg-indigo-500/20 rounded-lg">{s.icon}</div>
                      <span className="text-xs font-bold text-gray-300 group-hover:text-white">{s.label}</span>
                   </div>
                   <Sparkles size={12} className="text-indigo-400" />
                </button>
              ))}
            </div>
          </div>
        )}
        
        {results.users.length > 0 && (
           <div>
              <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4 px-2">المبدعون السياديون</h4>
              <div className="space-y-3">
                {results.users.map(u => (
                  <div key={u.id} onClick={() => { navigate('/profile'); setIsOpen(false); }} className="flex items-center justify-between p-4 bg-white/5 rounded-[25px] border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <img src={u.avatar} className="w-10 h-10 rounded-xl object-cover border border-white/10 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-black text-white">{u.displayName}</span>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;
