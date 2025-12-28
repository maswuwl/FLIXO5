
import React, { useState } from 'react';
import { ShieldCheck, Lock, Unlock, Fingerprint, Eye, EyeOff, X, FileText, Image as ImageIcon, Video, ChevronLeft, ShieldAlert } from 'lucide-react';

const Vault: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsUnlocked(true);
    }, 2500);
  };

  const categories = [
    { name: 'أفكار استراتيجية', count: 12, icon: <FileText className="text-blue-400" /> },
    { name: 'صور خاصة', count: 156, icon: <ImageIcon className="text-pink-400" /> },
    { name: 'مقاطع حصرية', count: 4, icon: <Video className="text-yellow-400" /> }
  ];

  return (
    <div className="h-full bg-[#030303] text-white p-6 pt-12 flex flex-col overflow-hidden no-scrollbar" dir="rtl">
      <div className="flex items-center justify-between mb-12">
        <button onClick={() => window.history.back()} className="p-3 bg-white/5 rounded-2xl"><ChevronLeft size={24} /></button>
        <div className="text-center">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">القبو <span className="text-yellow-500">السيادي</span></h1>
          <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">Maximum Security Vault</p>
        </div>
        <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center">
           <ShieldCheck className="text-yellow-500" />
        </div>
      </div>

      {!isUnlocked ? (
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
          <div className="relative mb-12">
            <div className={`w-64 h-64 rounded-full border-4 ${isScanning ? 'border-yellow-500 animate-pulse' : 'border-white/10'} flex items-center justify-center transition-all duration-500`}>
               <Fingerprint size={120} className={`${isScanning ? 'text-yellow-500 scale-110' : 'text-gray-700'} transition-all duration-700`} />
               {isScanning && (
                 <div className="absolute inset-0 bg-yellow-500/10 rounded-full animate-ping"></div>
               )}
            </div>
            {isScanning && (
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500 shadow-[0_0_15px_rgba(245,158,11,1)] animate-[scan_2s_ease-in-out_infinite] rounded-full"></div>
            )}
          </div>
          
          <h2 className="text-2xl font-black italic mb-2 tracking-tight">مطلوب التحقق من الهوية</h2>
          <p className="text-gray-500 text-sm mb-12 font-bold uppercase tracking-widest text-center">بروتوكول خالد المنتصر الأمني - V4.0</p>
          
          <button 
            onClick={startScan}
            disabled={isScanning}
            className="w-full max-w-xs py-6 bg-white text-black rounded-[30px] font-black text-lg flex items-center justify-center space-x-4 space-x-reverse shadow-2xl active:scale-95 transition-all"
          >
            {isScanning ? (
              <span className="animate-pulse">جاري المسح البيومتري...</span>
            ) : (
              <>
                <Lock size={24} />
                <span>افتح القبو الآن</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="flex-1 animate-slide-up space-y-8 overflow-y-auto no-scrollbar pb-10">
          <div className="grid grid-cols-1 gap-4">
             {categories.map((cat, i) => (
               <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-[35px] flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex items-center space-x-4 space-x-reverse">
                     <div className="p-4 bg-white/5 rounded-2xl">{cat.icon}</div>
                     <div>
                        <span className="block font-black text-sm">{cat.name}</span>
                        <span className="text-[10px] text-gray-500 font-bold">{cat.count} عنصر محمي</span>
                     </div>
                  </div>
                  <Unlock size={18} className="text-green-500" />
               </div>
             ))}
          </div>
          
          <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-[40px] flex items-start space-x-4 space-x-reverse">
             <ShieldAlert className="text-red-500 mt-1" size={20} />
             <div>
                <h4 className="text-sm font-black text-red-400 mb-1">تنبيه أمني</h4>
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">سيتم إغلاق القبو تلقائياً عند مغادرة الصفحة أو قفل الشاشة لحماية بياناتك السيادية.</p>
             </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }
      `}</style>
    </div>
  );
};

export default Vault;
