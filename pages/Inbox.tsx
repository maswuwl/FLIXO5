
import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Languages, Send, X, Shield, Clock, Sparkles, Cpu, ChevronRight } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { MOCK_USERS } from '../constants';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Inbox: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [ephemeralMessages, setEphemeralMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [chats] = useState([
    { id: 1, sender: MOCK_USERS[0], text: 'Hey! Did you see the new challenge?', time: '10:30 AM', avatar: MOCK_USERS[0].avatar, translated: '' },
    { id: 2, sender: MOCK_USERS[1], text: 'Merci pour le cadeau hier! 🎉', time: 'Yesterday', avatar: MOCK_USERS[1].avatar, translated: '' }
  ]);

  useEffect(() => {
    if (selectedChat) {
      document.body.classList.add('in-chat-mode');
    } else {
      document.body.classList.remove('in-chat-mode');
      setEphemeralMessages([]); 
    }
    return () => document.body.classList.remove('in-chat-mode');
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Date.now(),
      senderId: 'current-user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setEphemeralMessages([...ephemeralMessages, newMsg]);
    setInputText('');
  };

  const handleTranslate = async (id: number, text: string) => {
    const translated = await geminiService.translateMessage(text);
    setEphemeralMessages(prev => prev.map(m => m.id === id ? { ...m, translatedText: translated } : m));
  };

  if (selectedChat) {
    return (
      <div className="fixed inset-0 z-[500] bg-black flex flex-col animate-fade-in" dir="rtl">
        <div className="p-4 pt-12 border-b border-white/10 flex items-center justify-between bg-black/80 backdrop-blur-2xl">
          <div className="flex items-center">
            <button onClick={() => setSelectedChat(null)} className="ml-4 p-2 hover:bg-white/5 rounded-full transition-colors">
              <ChevronRight size={24} className="text-pink-500" />
            </button>
            <div className="flex items-center">
              <img src={selectedChat.avatar} className="w-10 h-10 rounded-full ml-3 border border-pink-500/20" alt="avatar" />
              <div>
                <p className="font-black text-sm text-white">{selectedChat.sender.displayName}</p>
                <div className="flex items-center text-[8px] text-pink-500 font-bold uppercase tracking-widest">
                  <Shield size={10} className="ml-1" /> بروتوكول التشفير السيادي
                </div>
              </div>
            </div>
          </div>
          <button className="p-2 hover:bg-white/5 rounded-full text-gray-400">
            <MoreVertical size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-32">
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Clock size={20} className="text-gray-500" />
            </div>
            <p className="text-[10px] text-gray-500 font-bold max-w-[220px] leading-relaxed">
              هذه الدردشة محمية بنظام "التلاشي السيادي". تختفي الرسائل فور الخروج من الغرفة.
            </p>
          </div>

          {ephemeralMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.senderId === 'current-user' ? 'items-start' : 'items-end'} animate-slide-up`}
            >
              <div className="flex items-center space-x-2 space-x-reverse mb-1">
                 {msg.senderId === 'current-user' && <img src={currentUser?.avatar} className="w-4 h-4 rounded-full border border-pink-500/30" />}
              </div>
              <div className={`max-w-[85%] p-4 rounded-3xl text-xs font-bold leading-relaxed shadow-xl ${
                msg.senderId === 'current-user' ? 'bg-pink-600 text-white rounded-tl-none border border-white/10' : 'bg-white/10 text-white rounded-tr-none border border-white/5'
              }`}>
                {msg.text}
                {msg.translatedText && (
                  <div className="mt-3 pt-3 border-t border-white/20 text-[10px] text-pink-200 italic">
                    {msg.translatedText}
                  </div>
                )}
              </div>
              <div className="flex items-center mt-1.5 px-1 space-x-2 space-x-reverse">
                <span className="text-[9px] text-gray-600 font-black">{msg.timestamp}</span>
                {msg.senderId !== 'current-user' && !msg.translatedText && (
                  <button onClick={() => handleTranslate(msg.id, msg.text)} className="text-[9px] text-pink-500 font-black hover:underline transition-all">ترجمة سيادية</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur-3xl border-t border-white/10 z-[600]">
          <div className="flex items-center space-x-2 space-x-reverse max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <input 
                autoFocus
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="اكتب رسالة سيادية..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-pink-500 transition-all placeholder:text-gray-600 shadow-inner"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full overflow-hidden border border-white/20">
                 <img src={currentUser?.avatar} className="w-full h-full object-cover" />
              </div>
            </div>
            <button 
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="w-12 h-12 rounded-2xl flixo-gradient text-white flex items-center justify-center shadow-lg shadow-pink-500/30 active:scale-90 transition-all disabled:opacity-30"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black animate-fade-in" dir="rtl">
      <div className="p-4 pt-12 border-b border-white/10 flex items-center justify-between sticky top-0 bg-black/50 backdrop-blur-xl z-50">
        <h1 className="text-2xl font-black italic tracking-tighter flixo-text-gradient">الرسائل</h1>
        <div className="flex items-center space-x-4 space-x-reverse">
           <Shield size={20} className="text-pink-500" />
           <MoreVertical className="text-gray-400" />
        </div>
      </div>

      <div className="p-4">
        <div className="relative mb-4 group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="بحث في المحفوظات الرقمية" 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pr-12 pl-4 text-xs font-bold focus:outline-none focus:border-pink-500 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <div 
          onClick={() => navigate('/ai-studio')}
          className="flex items-center p-5 bg-pink-500/5 border-b border-pink-500/10 hover:bg-pink-500/10 transition-colors cursor-pointer group"
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl ml-4 p-1 flixo-gradient flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:rotate-6 transition-transform">
              <Cpu size={28} className="text-white animate-pulse" />
            </div>
            <div className="absolute bottom-[-2px] right-3 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
          </div>
          <div className="flex-1 text-right">
            <div className="flex justify-between items-center mb-1">
              <span className="font-black text-[11px] text-white flex items-center">
                خبير فليكسو الذكي
                <Sparkles size={12} className="mr-1 text-yellow-400" />
              </span>
              <span className="text-[8px] bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Online</span>
            </div>
            <p className="text-[10px] text-gray-500 font-bold truncate">
              جاهز لإصلاح الأكواد وتطوير الرؤى البرمجية لسيادتك...
            </p>
          </div>
        </div>

        {chats.map((chat) => (
          <div 
            key={chat.id} 
            onClick={() => setSelectedChat(chat)}
            className="flex items-center p-5 hover:bg-white/5 transition-all cursor-pointer border-b border-white/5 group active:bg-white/10"
          >
            <div className="relative">
              <img src={chat.avatar} className="w-14 h-14 rounded-2xl ml-4 object-cover border border-white/10 group-hover:scale-105 transition-transform" alt="avatar" />
              <div className="absolute bottom-[-2px] right-3 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
            <div className="flex-1 text-right">
              <div className="flex justify-between items-center mb-1">
                <span className="font-black text-xs text-white">{chat.sender.displayName}</span>
                <span className="text-[9px] text-gray-600 font-black">{chat.time}</span>
              </div>
              <p className="text-[10px] text-gray-500 font-bold truncate flex items-center">
                <Shield size={10} className="ml-1 text-pink-500" />
                دردشة سيادية مؤقتة
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inbox;
