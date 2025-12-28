
import React from 'react';
import { Cable, Terminal, Code2, Globe, ChevronLeft, ShieldCheck, Zap, Server, Database, Cloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Ports: React.FC = () => {
  const navigate = useNavigate();

  const apis = [
    { name: "Sovereign Feed API", endpoint: "/api/v1/feed", status: "stable", icon: <Server size={18} /> },
    { name: "Central Intelligence Auth", endpoint: "/api/v1/auth", status: "stable", icon: <ShieldCheck size={18} /> },
    { name: "Veo 3.1 Gateway", endpoint: "/api/v1/veo", status: "dev", icon: <Cloud size={18} /> }
  ];

  return (
    <div className="h-full bg-[#050505] text-white flex flex-col overflow-y-auto pb-32 no-scrollbar" dir="rtl">
      <div className="p-8 pt-16 flex items-center justify-between bg-black/40 border-b border-white/5">
        <div className="flex items-center space-x-4 space-x-reverse">
          <button onClick={() => navigate(-1)} className="p-3 bg-white/5 rounded-2xl"><ChevronLeft size={24} /></button>
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter">بوابات <span className="text-indigo-500">العبور</span></h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">Sovereign Ports & APIs</p>
          </div>
        </div>
        <div className="p-3 bg-indigo-500/10 rounded-2xl"><Cable className="text-indigo-500" /></div>
      </div>

      <div className="p-6 space-y-8">
        <div className="bg-gradient-to-br from-indigo-900/40 to-black p-8 rounded-[40px] border border-indigo-500/20 space-y-6">
           <div className="flex items-center space-x-3 space-x-reverse text-indigo-400">
              <Terminal size={24} />
              <h3 className="text-xl font-black italic">محطة المطورين</h3>
           </div>
           <p className="text-xs text-gray-400 leading-relaxed font-bold">
             استخدم بوابات فليكسو لدمج تطبيقاتك الخارجية مع منظومة السيادة. جميع المنافذ مشفرة ببروتوكول Khalid-Sec.
           </p>
           <div className="bg-black/60 rounded-2xl p-4 font-mono text-[10px] text-green-500 border border-white/5 overflow-x-auto ltr" dir="ltr">
             $ curl -X GET "https://api.flixo.io/v1/sovereignty" \<br/>
             &nbsp;&nbsp;-H "Authorization: Bearer YOUR_ROYAL_TOKEN"
           </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-widest px-2">المنافذ النشطة</h4>
          {apis.map((api, idx) => (
            <div key={idx} className="p-5 bg-white/5 border border-white/10 rounded-[30px] flex items-center justify-between">
               <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="p-3 bg-white/5 rounded-2xl text-indigo-400">{api.icon}</div>
                  <div>
                    <span className="block text-sm font-black text-white">{api.name}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{api.endpoint}</span>
                  </div>
               </div>
               <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase ${api.status === 'stable' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                 {api.status}
               </span>
            </div>
          ))}
        </div>

        <div className="p-8 bg-white/5 border border-white/5 rounded-[40px] text-center space-y-4">
           <Database size={32} className="text-gray-700 mx-auto" />
           <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">جميع البيانات مخزنة في عناقيد سحابية سيادية</p>
        </div>
      </div>
    </div>
  );
};

export default Ports;
