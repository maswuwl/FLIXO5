
import React, { useState, useEffect } from 'react';
import { Trophy, Users, Send, Gift, MessageSquare, ShieldCheck, Zap, Share2, Sparkles, UserPlus, Brain, ChevronLeft } from 'lucide-react';
import { MOCK_USERS, MOCK_GIFTS } from '../constants';
import GiftsOverlay from '../components/GiftsOverlay';
import { geminiService } from '../services/geminiService';

const ChessArena: React.FC = () => {
  const [showGifts, setShowGifts] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [spectatorCount, setSpectatorCount] = useState(1250);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [messages, setMessages] = useState([
    { user: 'سارة_فليكسو', text: 'يا إلهي! حركة ذكية جداً من خالد 🔥', color: 'text-pink-400' },
    { user: 'نظام_الذكاء', text: 'جاري تحليل الثغرات في دفاع الخصم...', color: 'text-indigo-400' },
  ]);

  // محاكاة رقعة شطرنج (تبسيط للتصميم)
  const initialBoard = [
    ['♜','♞','♝','♛','♚','♝','♞','♜'],
    ['♟','♟','♟','♟','♟','♟','♟','♟'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['♙','♙','♙','♙','♙','♙','♙','♙'],
    ['♖','♘','♗','♕','♔','♗','♘','♖'],
  ];

  const handlePieceClick = (piece: string) => {
    if (piece) setSelectedPiece(piece);
  };

  const inviteFollowers = () => {
    alert("تم إرسال دعوة لجميع متابعيك لمشاهدة الملحمة!");
  };

  return (
    <div className="h-full bg-[#050505] text-white flex flex-col md:flex-row overflow-hidden no-scrollbar" dir="rtl">
      
      {/* القسم الرئيسي: الرقعة والمعلومات */}
      <div className="flex-1 flex flex-col p-4 pt-12 overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => window.history.back()} className="p-3 bg-white/5 rounded-2xl"><ChevronLeft size={24} /></button>
          <div className="text-center">
            <h1 className="text-2xl font-black italic tracking-tighter">ساحة <span className="flixo-text-gradient">السيادة</span></h1>
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">FLIXO CHESS EMPIRE</p>
          </div>
          <div className="flex items-center bg-pink-600/20 px-4 py-2 rounded-2xl border border-pink-500/30">
            <Users size={16} className="text-pink-500 ml-2" />
            <span className="text-xs font-black">{spectatorCount.toLocaleString()}</span>
          </div>
        </div>

        {/* معلومات اللاعبين */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3 space-x-reverse">
             <div className="w-14 h-14 rounded-2xl border-2 border-yellow-500 p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                <img src={MOCK_USERS[0].avatar} className="w-full h-full rounded-2xl object-cover" />
             </div>
             <div>
               <span className="block font-black text-sm">خالد المنتصر</span>
               <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">المصنف الأول 👑</span>
             </div>
          </div>
          
          <div className="flex flex-col items-center">
             <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <Zap size={20} className="text-yellow-500 animate-pulse" />
             </div>
             <span className="text-[8px] font-black mt-1">VS</span>
          </div>

          <div className="flex items-center space-x-3 space-x-reverse">
             <div className="text-left">
               <span className="block font-black text-sm">نظام فليكسو AI</span>
               <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">خبير استراتيجي</span>
             </div>
             <div className="w-14 h-14 rounded-2xl border-2 border-indigo-500 p-0.5 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center">
                   <Brain size={28} className="text-indigo-400" />
                </div>
             </div>
          </div>
        </div>

        {/* رقعة الشطرنج الفخمة */}
        <div className="aspect-square w-full max-w-[500px] mx-auto grid grid-cols-8 grid-rows-8 border-4 border-yellow-500/20 rounded-xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)] relative">
          {initialBoard.map((row, rIdx) => (
            row.map((piece, cIdx) => (
              <div 
                key={`${rIdx}-${cIdx}`}
                onClick={() => handlePieceClick(piece)}
                className={`flex items-center justify-center text-4xl cursor-pointer transition-all active:scale-90 ${
                  (rIdx + cIdx) % 2 === 0 ? 'bg-[#1a1a1a]' : 'bg-[#0a0a0a]'
                } ${selectedPiece === piece && piece !== '' ? 'bg-yellow-500/20' : ''}`}
              >
                {/* تمثيل القطع كأيقونات ذهبية لامعة */}
                <span className={`
                  ${rIdx < 2 ? 'text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]' : 'text-yellow-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]'}
                  font-serif hover:scale-125 transition-transform
                `}>
                  {piece}
                </span>
              </div>
            ))
          ))}
          
          {isAiThinking && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
               <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="mt-4 font-black italic text-indigo-400 animate-pulse">فليكسو AI يحلل حركتك...</span>
               </div>
            </div>
          )}
        </div>

        {/* أزرار التحكم والجمهور */}
        <div className="mt-8 grid grid-cols-3 gap-4">
           <button onClick={inviteFollowers} className="py-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center space-y-2 hover:bg-white/10 transition-all active:scale-95">
              <Share2 size={20} className="text-blue-400" />
              <span className="text-[9px] font-black uppercase">دعوة المتابعين</span>
           </button>
           <button onClick={() => setShowGifts(true)} className="py-4 bg-yellow-500 rounded-2xl flex flex-col items-center space-y-2 shadow-lg active:scale-95 transition-all">
              <Gift size={20} className="text-black" />
              <span className="text-[9px] font-black text-black uppercase">إرسال هدية حية</span>
           </button>
           <button className="py-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center space-y-2 hover:bg-white/10 transition-all active:scale-95">
              <Sparkles size={20} className="text-pink-500" />
              <span className="text-[9px] font-black uppercase">مؤثرات بصرية</span>
           </button>
        </div>
      </div>

      {/* الشريط الجانبي: التعليقات والجمهور */}
      <div className="w-full md:w-80 bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col h-[400px] md:h-full mt-auto md:mt-0">
         <div className="p-5 border-b border-white/10 flex items-center space-x-2 space-x-reverse">
            <MessageSquare size={18} className="text-gray-500" />
            <span className="text-xs font-black uppercase tracking-widest">غرفة التعليقات الملكية</span>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className="animate-slide-up">
                 <span className={`font-black text-[10px] ${m.color}`}>@{m.user}: </span>
                 <span className="text-xs text-gray-300 font-medium leading-relaxed">{m.text}</span>
              </div>
            ))}
         </div>
         <div className="p-4 bg-white/5 border-t border-white/10">
            <div className="flex items-center space-x-2 space-x-reverse">
               <input 
                  type="text" 
                  placeholder="قل شيئاً للمبدعين..." 
                  className="flex-1 bg-black/40 border border-white/10 rounded-full py-2.5 px-5 text-[11px] focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all"
               />
               <button className="p-2.5 bg-yellow-500 rounded-full text-black shadow-lg"><Send size={16} /></button>
            </div>
         </div>
      </div>

      {showGifts && <GiftsOverlay onClose={() => setShowGifts(false)} onSend={(gift) => {
        setMessages(prev => [...prev, { user: 'داعم_فليكسو', text: `أرسل ${gift.icon} للاعب! 🚀`, color: 'text-yellow-500' }]);
        setShowGifts(false);
      }} />}
    </div>
  );
};

export default ChessArena;
