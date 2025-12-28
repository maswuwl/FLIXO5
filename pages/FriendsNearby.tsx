
import React, { useState, useEffect } from 'react';
import { Radar, MapPin, LocateFixed, MessageCircle, UserPlus, Sparkles, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_USERS } from '../constants';

const FriendsNearby: React.FC = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(true);
  const [nearbyUsers, setNearbyUsers] = useState<any[]>([]);

  useEffect(() => {
    // محاكاة عملية المسح الجغرافي
    const timer = setTimeout(() => {
      setIsScanning(false);
      setNearbyUsers([
        { ...MOCK_USERS[1], distance: '250 متر', online: true },
        { ...MOCK_USERS[2], distance: '1.2 كم', online: false },
        { id: 'u4', displayName: 'سارة أحمد', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara', distance: '500 متر', online: true },
        { id: 'u5', displayName: 'فهد العتيبي', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fahad', distance: '2 كم', online: true },
      ]);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#050505] text-white overflow-y-auto pb-32 pt-12" dir="rtl">
      <div className="px-6 flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="p-3 bg-pink-500/20 rounded-2xl border border-pink-500/30 text-pink-500">
            <Radar size={24} className={isScanning ? 'animate-spin' : ''} />
          </div>
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter">أصدقاء الجوار</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">تواصل مع من حولك الآن</p>
          </div>
        </div>
        <button onClick={() => navigate('/')} className="p-2 hover:bg-white/5 rounded-full"><ChevronLeft size={24} /></button>
      </div>

      <div className="relative h-64 flex items-center justify-center mb-10 overflow-hidden">
        {/* تأثير الرادار */}
        <div className="absolute w-80 h-80 border border-pink-500/20 rounded-full animate-ping opacity-20"></div>
        <div className="absolute w-60 h-60 border border-pink-500/30 rounded-full animate-ping delay-75 opacity-20"></div>
        <div className="absolute w-40 h-40 border border-pink-500/40 rounded-full animate-pulse opacity-20"></div>
        
        <div className="relative z-10 p-4 bg-pink-600 rounded-full shadow-[0_0_50px_rgba(236,72,153,0.4)]">
          <LocateFixed size={48} className="text-white" />
        </div>
        
        <p className="absolute bottom-4 text-[10px] font-black text-pink-400 uppercase tracking-widest animate-pulse">
          {isScanning ? 'جاري المسح الجغرافي...' : 'تم العثور على مبدعين في محيطك'}
        </p>
      </div>

      <div className="px-6 space-y-4">
        {isScanning ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-white/5 rounded-[25px] animate-pulse"></div>
            ))}
          </div>
        ) : (
          nearbyUsers.map((user) => (
            <div key={user.id} className="p-4 bg-white/5 border border-white/5 rounded-[30px] flex items-center justify-between hover:bg-white/10 transition-all group">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="relative">
                  <img src={user.avatar} className="w-14 h-14 rounded-full border-2 border-pink-500/30 object-cover" alt={user.displayName} />
                  {user.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>}
                </div>
                <div className="text-right">
                  <h4 className="font-black text-sm text-white flex items-center">
                    {user.displayName}
                    <Sparkles size={12} className="mr-1 text-yellow-500" />
                  </h4>
                  <div className="flex items-center text-[10px] text-gray-500 mt-1">
                    <MapPin size={10} className="ml-1" />
                    <span>يبعد عنك {user.distance}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <button className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-pink-500 transition-colors">
                  <MessageCircle size={18} />
                </button>
                <button className="p-3 bg-pink-600 rounded-xl text-white shadow-lg active:scale-95 transition-all">
                  <UserPlus size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {!isScanning && (
        <div className="p-10 text-center">
          <p className="text-xs text-gray-500 leading-relaxed italic">
            "تواصل بمسؤولية واحترم خصوصية الآخرين في مجتمع لايفو."
          </p>
        </div>
      )}
    </div>
  );
};

export default FriendsNearby;
