
import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles, User, Hash, MessageSquarePlus, Settings as SettingsIcon } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { MOCK_USERS, MOCK_FEED } from '../constants';
import { useNavigate } from 'react-router-dom';

const GlobalSearch: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ users: any[], tags: string[], settings: any[] }>({ users: [], tags: [], settings: [] });
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const SETTINGS_REGISTRY = [
    { label: 'تغيير المظهر (ليلي/نهاري)', path: '/settings', icon: <SettingsIcon size={14} /> },
    { label: 'إدارة الخصوصية والأمان', path: '/settings', icon: <SettingsIcon size={14} /> },
    { label: 'إزالة العلامة المائية', path: '/create', icon: <SettingsIcon size={14} /> },
    { label: 'القبو السيادي', path: '/vault', icon: <SettingsIcon size={14} /> }
  ];

  useEffect(() => {
    if (query.trim().length > 1) {
      const filteredUsers = MOCK_USERS.filter(u => u.displayName.toLowerCase().includes(query.toLowerCase()));
      const filteredTags = Array.from(new Set(MOCK_FEED.flatMap(f => f.tags || []))).filter(t => t.toLowerCase().includes(query.toLowerCase()));
      const filteredSettings = SETTINGS_REGISTRY.filter(s => s.label.toLowerCase().includes(query.toLowerCase()));

      setResults({ users: filteredUsers, tags: filteredTags, settings: filteredSettings });

      if (filteredUsers.length === 0 && filteredTags.length === 0 && filteredSettings.length === 0) {
        handleNoResults();
      } else {
        setAiInsight(null);
      }
    } else {
      setResults({ users: [], tags: [], settings: [] });
      setAiInsight(null);
    }
  }, [query]);

  const handleNoResults = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    const insight = await geminiService.analyzeSearchQuery(query);
    setAiInsight(insight);
    setIsAnalyzing(false);
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all active:scale-90">
        <Search size={20} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[250] bg-black/95 backdrop-blur-2xl flex flex-col p-6 animate-fade-in" dir="rtl">
      <div className="flex items-center space-x-4 space-x-reverse mb-8">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input autoFocus type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث عن ميزة، مبدع، أو إعداد..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm" />
        </div>
        <button onClick={() => setIsOpen(false)} className="p-4 bg-white/5 rounded-2xl text-white"><X size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar pb-10">
        {results.settings.length > 0 && (
          <div>
            <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4 px-2">الإعدادات والواجهات</h4>
            <div className="space-y-2">
              {results.settings.map((s, i) => (
                <button key={i} onClick={() => { navigate(s.path); setIsOpen(false); }} className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                   <div className="flex items-center space-x-3 space-x-reverse">
                      {s.icon} <span className="text-xs font-bold text-gray-300">{s.label}</span>
                   </div>
                   <Sparkles size={12} className="text-indigo-400" />
                </button>
              ))}
            </div>
          </div>
        )}
        
        {results.users.length > 0 && (
           <div>
              <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4 px-2">المبدعون</h4>
              <div className="space-y-3">
                {results.users.map(u => (
                  <div key={u.id} className="flex items-center justify-between p-4 bg-white/5 rounded-[25px] border border-white/5">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <img src={u.avatar} className="w-10 h-10 rounded-full object-cover" />
                      <span className="text-sm font-black text-white">{u.displayName}</span>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        )}

        {query.length > 1 && results.users.length === 0 && results.tags.length === 0 && results.settings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-20 h-20 bg-indigo-600/10 rounded-full flex items-center justify-center animate-pulse"><Sparkles size={40} className="text-indigo-500" /></div>
            {isAnalyzing ? <p className="text-xs text-gray-500">جاري تحليل النقص عبر الذكاء السيادي...</p> : (
              <div className="space-y-4 max-w-sm">
                <p className="text-sm font-black italic text-indigo-400 leading-relaxed">{aiInsight}</p>
                <button onClick={() => { navigate('/settings', { state: { suggestion: `طلب إضافة ميزة: ${query}` } }); setIsOpen(false); }} className="px-8 py-4 flixo-gradient rounded-2xl font-black text-xs text-white shadow-xl">اطلب ميزة سيادية بناءً على بحثك</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;
