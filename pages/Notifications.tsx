
import React, { useState } from 'react';
import { Bell, Heart, MessageSquare, UserPlus, Star, ShieldCheck, ChevronLeft, Trash2, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'system' | 'gift';
  sender: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  isRead: boolean;
}

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'system',
      sender: { name: 'فريق فليكسو', avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=flixo' },
      content: 'مرحباً بك في الإصدار الجديد V5.2 GOLD! تم تفعيل محرك Veo 3.1 لتوليد الفيديوهات.',
      timestamp: 'الآن',
      isRead: false
    },
    {
      id: '2',
      type: 'gift',
      sender: { name: 'سارة أحمد', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara' },
      content: 'أرسلت لك هدية "تاج الذهب" في ساحة الشطرنج! 👑',
      timestamp: 'منذ 5 دقائق',
      isRead: false
    },
    {
      id: '3',
      type: 'like',
      sender: { name: 'فهد العتيبي', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fahad' },
      content: 'أعجب بمذكرتك السيادية الأخيرة.',
      timestamp: 'منذ ساعة',
      isRead: true
    }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart size={16} className="text-pink-500" fill="currentColor" />;
      case 'comment': return <MessageSquare size={16} className="text-blue-500" />;
      case 'follow': return <UserPlus size={16} className="text-indigo-500" />;
      case 'system': return <ShieldCheck size={16} className="text-yellow-500" />;
      case 'gift': return <Star size={16} className="text-yellow-500" fill="currentColor" />;
      default: return <Bell size={16} />;
    }
  };

  return (
    <div className="h-full bg-black text-white flex flex-col p-6 pt-12 overflow-y-auto pb-32 no-scrollbar" dir="rtl">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-4 space-x-reverse">
          <button onClick={() => navigate(-1)} className="p-3 bg-white/5 rounded-2xl"><ChevronLeft size={24} /></button>
          <h1 className="text-2xl font-black italic tracking-tighter">التنبيهات</h1>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <button onClick={markAllRead} className="text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-widest">تحديد كقرؤ</button>
          <button className="p-3 bg-white/5 rounded-2xl text-gray-400"><Settings size={20} /></button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center opacity-20"><Bell size={40} /></div>
            <p className="text-gray-500 text-xs font-bold">لا توجد تنبيهات جديدة حالياً.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div 
              key={n.id} 
              className={`p-5 rounded-[30px] border transition-all flex items-start space-x-4 space-x-reverse ${
                n.isRead ? 'bg-white/5 border-white/5' : 'bg-white/10 border-indigo-500/30 shadow-[0_0_20px_rgba(79,70,229,0.1)]'
              }`}
            >
              <div className="relative">
                <img src={n.sender.avatar} className="w-12 h-12 rounded-full border border-white/10 object-cover" alt="avatar" />
                <div className="absolute -bottom-1 -right-1 p-1.5 bg-black rounded-full border border-white/10">
                  {getIcon(n.type)}
                </div>
              </div>
              <div className="flex-1 text-right">
                <div className="flex justify-between items-start">
                  <span className="font-black text-xs text-white">{n.sender.name}</span>
                  <span className="text-[9px] text-gray-600 font-bold">{n.timestamp}</span>
                </div>
                <p className={`text-xs mt-1 leading-relaxed ${n.isRead ? 'text-gray-400' : 'text-gray-200 font-medium'}`}>{n.content}</p>
              </div>
              {!n.isRead && (
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,1)] mt-2"></div>
              )}
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <button 
          onClick={() => setNotifications([])}
          className="mt-10 w-full py-4 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-2 space-x-reverse hover:bg-red-500/5 transition-colors"
        >
          <Trash2 size={14} />
          <span>مسح جميع التنبيهات</span>
        </button>
      )}
    </div>
  );
};

export default Notifications;
