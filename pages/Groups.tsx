
import React, { useState } from 'react';
import { Users, ShieldCheck, Plus, Search, Globe, Lock, Crown, Star, ChevronLeft, MoreHorizontal, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_GROUPS } from '../constants';

const Groups: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const getVerificationBadge = (type: string) => {
    switch(type) {
      case 'royal': return <Crown size={12} className="text-yellow-500" />;
      case 'community': return <ShieldCheck size={12} className="text-blue-500" />;
      case 'creative': return <Star size={12} className="text-purple-500" />;
      default: return null;
    }
  };

  const filteredGroups = MOCK_GROUPS.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-full bg-black text-white flex flex-col overflow-y-auto pb-32 no-scrollbar" dir="rtl">
      {/* Header */}
      <div className="p-6 pt-12 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-xl z-20 border-b border-white/10">
        <div className="flex items-center space-x-3 space-x-reverse">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter">مجتمعات <span className="text-blue-400">فليكسو</span></h1>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest text-center">Sovereign Groups Hub</p>
          </div>
        </div>
        <button className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
          <Plus size={24} />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="بحث عن مجموعات سيادية..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-4 text-sm focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        {/* Categories / Tabs */}
        <div className="flex space-x-3 space-x-reverse overflow-x-auto no-scrollbar pb-2">
           {['مجموعاتك', 'استكشاف', 'الأكثر تفاعلاً', 'الموثقة'].map((tab, i) => (
             <button key={i} className={`shrink-0 px-6 py-3 rounded-2xl text-[10px] font-black border transition-all ${i === 0 ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-500'}`}>
               {tab}
             </button>
           ))}
        </div>

        {/* Groups List */}
        <div className="space-y-6">
          <h3 className="text-[10px] text-gray-500 font-black uppercase tracking-widest px-2">مجموعات مقترحة لك</h3>
          {filteredGroups.map(group => (
            <div key={group.id} className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden group hover:border-blue-500/30 transition-all shadow-2xl">
               <div className="relative h-40">
                  <img src={group.cover} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 right-4 flex items-center space-x-2 space-x-reverse">
                     <div className="p-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/20">
                        <Users size={16} className="text-blue-400" />
                     </div>
                     <span className="text-xs font-black text-white">{group.membersCount.toLocaleString()} عضو</span>
                  </div>
               </div>
               
               <div className="p-6 text-right">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <div className="flex items-center space-x-2 space-x-reverse mb-1">
                           <h4 className="text-xl font-black">{group.name}</h4>
                           {group.isVerified && getVerificationBadge(group.verificationType)}
                        </div>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-sm">{group.description}</p>
                     </div>
                     <button className="p-2 bg-white/5 rounded-xl text-gray-500 hover:text-white"><MoreHorizontal size={20} /></button>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                     <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="flex -space-x-3 space-x-reverse">
                           {[1,2,3].map(i => <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=u${i}`} className="w-8 h-8 rounded-full border-2 border-[#140a1e]" />)}
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold">أصدقاء مشتركون</span>
                     </div>
                     <button className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all">انضمام</button>
                  </div>
               </div>
            </div>
          ))}
        </div>
        
        {/* Info Box */}
        <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-[40px] space-y-4">
           <div className="flex items-center space-x-3 space-x-reverse text-blue-400">
              <ShieldCheck size={20} />
              <h4 className="text-sm font-black italic">نظام التوثيق السيادي للمجتمعات</h4>
           </div>
           <ul className="space-y-2 text-[10px] text-gray-500 font-bold leading-relaxed">
              <li className="flex items-center"><Crown size={10} className="ml-2 text-yellow-500" /> العلامة الذهبية: للمجموعات الرسمية والمؤسسية الكبرى.</li>
              <li className="flex items-center"><ShieldCheck size={10} className="ml-2 text-blue-500" /> العلامة الزرقاء: للمجتمعات العامة الموثقة والنشطة.</li>
              <li className="flex items-center"><Star size={10} className="ml-2 text-purple-500" /> العلامة البنفسجية: لمجموعات المبدعين والفنانين.</li>
           </ul>
        </div>
      </div>
    </div>
  );
};

export default Groups;
