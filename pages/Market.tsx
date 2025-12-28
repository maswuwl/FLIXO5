
import React, { useState } from 'react';
import { ShoppingBag, Star, Download, AppWindow, Cpu, Sparkles, ChevronLeft, ArrowRight, Zap, Trophy, Gavel, Clock, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Market: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'apps' | 'auction'>('apps');

  const auctionItems = [
    { id: 'a1', name: 'اسم مستخدم ذهبي: @KHALID', currentBid: 5500, time: '02:45:10', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=gold_name' },
    { id: 'a2', name: 'شارة "المؤسس الأول" النادرة', currentBid: 12000, time: '10:12:05', image: 'https://api.dicebear.com/7.x/shapes/svg?seed=founder_badge' }
  ];

  const officialApps = [
    { id: 'live-main', name: 'FLIXO Main App', description: 'المنصة الرسمية المباشرة تحت إدارة خالد المنتصر.', icon: 'F', downloads: '50M+', rating: 4.9 }
  ];

  return (
    <div className="h-full bg-black overflow-y-auto pb-32 pt-12 px-6 no-scrollbar" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="p-3 bg-pink-500/20 border border-pink-500/30 rounded-2xl text-pink-500">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter">فليكسو ماركت</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">متجر الابتكارات والمزادات</p>
          </div>
        </div>
        <button onClick={() => navigate('/')} className="p-2 hover:bg-white/10 rounded-full"><ChevronLeft size={24} /></button>
      </div>

      <div className="flex bg-white/5 rounded-2xl p-1 mb-8">
        <button onClick={() => setActiveTab('apps')} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'apps' ? 'bg-pink-600 text-white' : 'text-gray-500'}`}>التطبيقات</button>
        <button onClick={() => setActiveTab('auction')} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'auction' ? 'bg-yellow-500 text-black' : 'text-gray-500'}`}>المزاد الملكي</button>
      </div>

      {activeTab === 'apps' ? (
        <div className="animate-fade-in">
           <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/30 rounded-[40px] p-8 border border-white/10 relative overflow-hidden mb-12 shadow-2xl group">
            <div className="relative z-10 flex flex-col items-start max-w-[70%] text-right">
              <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black text-white/80 mb-4 border border-white/10 flex items-center">
                <Sparkles size={10} className="ml-1 text-yellow-400" />
                جديد مختبر فليكسو
              </span>
              <h2 className="text-2xl font-black mb-2 italic leading-tight">ابنِ تطبيقك الخاص واعرضه هنا!</h2>
              <button onClick={() => navigate('/ai-studio')} className="mt-4 bg-white text-black px-6 py-3 rounded-2xl font-black text-xs shadow-xl transition-all">ابدأ البناء الآن</button>
            </div>
          </div>

          <section className="mb-12">
            <h3 className="text-lg font-black italic flex items-center mb-6"><Trophy className="ml-2 text-yellow-500" size={20} />تطبيقات رسمية</h3>
            {officialApps.map(app => (
              <div key={app.id} className="bg-white/5 border border-white/10 rounded-[35px] p-5 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-16 h-16 flixo-gradient rounded-3xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                    <span className="text-white font-black text-3xl">{app.icon}</span>
                  </div>
                  <div className="text-right">
                    <h4 className="font-black text-white">{app.name}</h4>
                    <p className="text-[10px] text-gray-500 font-medium">{app.downloads} تحميل</p>
                  </div>
                </div>
                <button className="p-4 bg-white/5 rounded-2xl border border-white/10 text-white"><Download size={20} /></button>
              </div>
            ))}
          </section>
        </div>
      ) : (
        <div className="animate-fade-in space-y-6">
           <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-[35px] flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                 <Coins className="text-yellow-500" size={32} />
                 <div>
                    <span className="block text-sm font-black text-white">رصيدك للمزايدة</span>
                    <span className="text-2xl font-black text-yellow-500">15,400 FX</span>
                 </div>
              </div>
              <button className="bg-yellow-500 text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase">شحن</button>
           </div>

           {auctionItems.map(item => (
             <div key={item.id} className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden group">
                <div className="relative h-48 bg-gradient-to-tr from-yellow-900/20 to-black">
                   <img src={item.image} className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform" />
                   <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center space-x-2 space-x-reverse border border-white/10">
                      <Clock size={12} className="text-yellow-500" />
                      <span className="text-[10px] font-black text-yellow-500">{item.time}</span>
                   </div>
                </div>
                <div className="p-6 text-right">
                   <h4 className="text-lg font-black mb-4">{item.name}</h4>
                   <div className="flex items-center justify-between mb-6">
                      <div>
                         <span className="text-[10px] text-gray-500 font-bold uppercase block">المزايدة الحالية</span>
                         <span className="text-xl font-black text-white">{item.currentBid.toLocaleString()} FX</span>
                      </div>
                      <Gavel className="text-yellow-500 opacity-20" size={40} />
                   </div>
                   <button className="w-full py-4 bg-yellow-500 text-black rounded-2xl font-black text-sm shadow-[0_0_30px_rgba(245,158,11,0.3)] active:scale-95 transition-all">زايد الآن</button>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default Market;
