
import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Languages, Send, X, Shield, Clock, Sparkles, Cpu } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { MOCK_USERS } from '../constants';
import { useNavigate } from 'react-router-dom';

const Inbox: React.FC = () => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [ephemeralMessages, setEphemeralMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [chats] = useState([
    { id: 1, sender: MOCK_USERS[0], text: 'Hey! Did you see the new challenge?', time: '10:30 AM', avatar: MOCK_USERS[0].avatar, translated: '' },
    { id: 2, sender: MOCK_USERS[1], text: 'Merci pour le cadeau hier! 🎉', time: 'Yesterday', avatar: MOCK_USERS[1].avatar, translated: '' }
  ]);

  // Handle closing of ephemeral chat
  useEffect(() => {
    if (!selectedChat) {
      setEphemeralMessages([]); // Clear history when exiting chat
    }
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
      <div className="flex flex-col h-full bg-black animate-slide-in" dir="rtl">
        {/* Chat Header */}
        <div className="p-4 pt-12 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center">
            <button onClick={() => setSelectedChat(null)} className="ml-4">
              <X size={24} />
            </button>
            <div className="flex items-center">
              <img src={selectedChat.avatar} className="w-10 h-10 rounded-full ml-3 border border-white/10" alt="avatar" />
              <div>
                <p className="font-bold text-sm">{selectedChat.sender.displayName}</p>
                <div className="flex items-center text-[10px] text-pink-500">
                  <Shield size={10} className="ml-1" /> وضع الدردشة المؤقتة نشط
                </div>
              </div>
            </div>
          </div>
          <MoreVertical className="text-gray-400" />
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="p-3 rounded-full bg-white/5 mb-2">
              <Clock size={24} className="text-gray-500" />
            </div>
            <p className="text-xs text-gray-500 max-w-[200px]">
              تختفي الرسائل تلقائيًا عند مغادرة هذه الدردشة أو إغلاق التطبيق.
            </p>
          </div>

          {ephemeralMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.senderId === 'current-user' ? 'items-start' : 'items-end'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.senderId === 'current-user' ? 'bg-pink-600 text-white rounded-tl-none' : 'bg-white/10 text-white rounded-tr-none'
              }`}>
                {msg.text}
                {msg.translatedText && (
                  <div className="mt-2 pt-2 border-t border-white/20 text-[10px] text-pink-200 italic">
                    {msg.translatedText}
                  </div>
                )}
              </div>
              <div className="flex items-center mt-1 space-x-2 space-x-reverse">
                <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                {msg.senderId !== 'current-user' && !msg.translatedText && (
                  <button onClick={() => handleTranslate(msg.id, msg.text)} className="text-[10px] text-pink-500 font-bold">ترجمة</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/5 border-t border-white/10">
          <div className="flex items-center space-x-2 space-x-reverse">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="اكتب رسالة ستختفي..." 
              className="flex-1 bg-white/10 border border-white/10 rounded-full py-3 px-6 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
            <button 
              onClick={handleSendMessage}
              className="p-3 rounded-full flixo-gradient text-white active:scale-95 transition-transform"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black" dir="rtl">
      <div className="p-4 pt-12 border-b border-white/10 flex items-center justify-between">
        <h1 className="text-2xl font-black italic tracking-tighter">الرسائل</h1>
        <div className="flex items-center space-x-4 space-x-reverse">
           <Shield size={20} className="text-pink-500" />
           <MoreVertical className="text-gray-400" />
        </div>
      </div>

      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="بحث في المحادثات" 
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pr-10 pl-4 text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* FLIXO AI Expert Sticky Row */}
        <div 
          onClick={() => navigate('/ai-studio')}
          className="flex items-center p-5 bg-pink-500/5 border-b border-pink-500/20 hover:bg-pink-500/10 transition-colors cursor-pointer group"
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-full ml-4 p-1 flixo-gradient flex items-center justify-center shadow-lg shadow-pink-500/30">
              <Cpu size={28} className="text-white animate-pulse" />
            </div>
            <div className="absolute bottom-0 right-4 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
          </div>
          <div className="flex-1 text-right">
            <div className="flex justify-between items-center mb-1">
              <span className="font-black text-white flex items-center">
                خبير فليكسو الذكي
                <Sparkles size={14} className="mr-1 text-yellow-400" />
              </span>
              <span className="text-[10px] bg-pink-500 text-white px-2 py-0.5 rounded-full font-bold">نشط</span>
            </div>
            <p className="text-xs text-pink-400/80 font-medium truncate">
              جاهز لبناء أفكارك، إصلاح الأكواد، ومساعدتك تقنياً...
            </p>
          </div>
          <div className="mr-4">
            <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]"></div>
          </div>
        </div>

        {/* Regular Chats */}
        {chats.map((chat) => (
          <div 
            key={chat.id} 
            onClick={() => setSelectedChat(chat)}
            className="flex items-center p-4 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 group"
          >
            <div className="relative">
              <img src={chat.avatar} className="w-14 h-14 rounded-full ml-4 object-cover border border-white/10" alt="avatar" />
              <div className="absolute bottom-0 right-4 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
            <div className="flex-1 text-right">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold">{chat.sender.displayName}</span>
                <span className="text-xs text-gray-500">{chat.time}</span>
              </div>
              <p className="text-sm text-gray-400 truncate flex items-center">
                <Shield size={10} className="ml-1 text-pink-500" />
                دردشة مؤقتة
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inbox;
