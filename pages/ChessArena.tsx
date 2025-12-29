
import React, { useState, useEffect } from 'react';
import { Trophy, Users, Send, Gift, MessageSquare, ShieldCheck, Zap, Share2, Sparkles, UserPlus, Brain, ChevronLeft, Palette, User, Gamepad2 } from 'lucide-react';
import { MOCK_USERS, MOCK_GIFTS } from '../constants';
import GiftsOverlay from '../components/GiftsOverlay';
import { geminiService } from '../services/geminiService';
import { authService } from '../services/authService';

const ChessArena: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const [showGifts, setShowGifts] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [spectatorCount, setSpectatorCount] = useState(1250);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [gameMode, setGameMode] = useState<'system' | 'friend'>('system');
  const [pieceColor, setPieceColor] = useState<string>('text-yellow-500');
  
  const [messages, setMessages] = useState([
    { user: 'نظام_الذكاء', text: `مرحباً بك يا ${currentUser?.displayName.split(' ')[0]}. هل أنت مستعد لتحدي السيادة؟`, color: 'text-indigo-400' },
  ]);

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
    if (gameMode === 'system') {
      setIsAiThinking(true);
      setTimeout(() => {
        setIsAiThinking(false);
        setMessages(prev => [...prev, { user: 'نظام_الذكاء', text: 'حركة مثيرة للاهتمام.. جاري الرد الاستراتيجي.', color: 'text-indigo-400' }]);
      }, 1500);
    }
  };

  const colors = [
    { label: 'ذهبي سيادي', class: 'text-yellow-500', hex: '#EAB308' },
    { label: 'أرجواني ملكي', class: 'text-purple-500', hex: '#A855F7' },
    { label: 'أزرق فليكسو', class: 'text-blue-400', hex: '#60A5FA' }
  ];

  return (
    <div className="h-full bg-[#050505] text-white flex flex-col md:flex-row overflow-hidden no-scrollbar" dir="rtl">
      
      <div className="flex-1 flex flex-col p-4 pt-12 overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => window.history.back()} className="p-3 bg-white/5 rounded-2xl border border-white/10"><ChevronLeft size={24} /></button>
          <div className="text-center">
            <h1 className="text-2xl font-black italic tracking-tighter">ساحة <span className="flixo-text-gradient">الذكاء السيادي</span></h1>
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">FLIXO AI ARENA V6</p>
          </div>
          <div className="flex items-center bg-indigo-600/20 px-4 py-2 rounded-2xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <Gamepad2 size={16} className="text-indigo-500 ml-2" />
            <span className="text-xs font-black">اللعب مع النظام</span>
          </div>
        </div>

        {/* اللاعبين - مع ظهور صورة المستخدم الحالية */}
        <div className="flex justify-between items-center mb-8 px-4">
          <div className="flex flex-col items-center space-y-3">
             <div className="relative">
                <div className="w-16 h-16 rounded-3xl border-2 border-yellow-500 p-1 shadow-[0_0_20px_rgba(245,158,11,0.3)] bg-black overflow-hidden rotate-3">
                   <img src={currentUser?.avatar} className="w-full h-full rounded-2xl object-cover" alt="player" />
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-black p-1 rounded-lg">
                   <Trophy size={10} />
                </div>
             </div>
             <div className="text-center">
               <span className="block font-black text-[10px] text-white uppercase">{currentUser?.displayName.split(' ')[0]}</span>
               <span className="text-[7px] text-yellow-500 font-bold tracking-widest uppercase">السيادة</span>
             </div>
          </div>
          
          <div className="flex flex-col items-center">
             <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group">
                <Zap size={24} className="text-indigo-500 group-hover:scale-125 transition-transform" />
             </div>
             <span className="text-[9px] font-black mt-2 text-gray-500">VS</span>
          </div>

          <div className="flex flex-col items-center space-y-3">
             <div className="relative">
                <div className="w-16 h-16 rounded-3xl border-2 border-indigo-500 p-1 shadow-[0_0_20px_rgba(99,102,241,0.3)] bg-black flex items-center justify-center -rotate-3">
                   <Brain size={32} className="text-indigo-400 animate-pulse" />
                </div>
             </div>
             <div className="text-center">
               <span className="block font-black text-[10px] text-indigo-400 uppercase tracking-tighter">FLIXO SYSTEM</span>
               <span className="text-[7px] text-gray-600 font-bold uppercase">الذكاء المركزي</span>
             </div>
          </div>
        </div>

        {/* لوحة اللعب */}
        <div className="aspect-square w-full max-w-[480px] mx-auto grid grid-cols-8 grid-rows-8 border-4 border-indigo-500/20 rounded-2xl overflow-hidden shadow-2xl relative">
          {initialBoard.map((row, rIdx) => (
            row.map((piece, cIdx) => (
              <div 
                key={`${rIdx}-${cIdx}`}
                onClick={() => handlePieceClick(piece)}
                className={`flex items-center justify-center text-4xl cursor-pointer transition-all active:scale-95 ${
                  (rIdx + cIdx) % 2 === 0 ? 'bg-zinc-900' : 'bg-black'
                } ${selectedPiece === piece && piece !== '' ? 'bg-indigo-500/20' : ''}`}
              >
                <span className={`
                  ${rIdx < 2 ? 'text-indigo-400' : pieceColor}
                  font-serif hover:scale-110 transition-transform drop-shadow-lg
                `}>
                  {piece}
                </span>
              </div>
            ))
          ))}
          
          {isAiThinking && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-20 animate-fade-in">
               <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Brain size={24} className="text-indigo-400 animate-bounce" />
                    </div>
                  </div>
                  <span className="mt-6 font-black italic text-indigo-400 animate-pulse uppercase text-[10px] tracking-[0.3em]">تحليل المسارات العصبية...</span>
               </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center space-x-4 space-x-reverse px-4">
           <button onClick={() => setShowGifts(true)} className="flex-1 py-4 bg-yellow-500 rounded-2xl flex flex-col items-center space-y-1 shadow-xl active:scale-95 transition-all">
              <Gift size={20} className="text-black" />
              <span className="text-[8px] font-black text-black uppercase">دعم اللاعب</span>
           </button>
           <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center space-y-1 hover:bg-white/10 transition-all">
              <Share2 size={20} className="text-indigo-400" />
              <span className="text-[8px] font-black uppercase">مشاركة المباراة</span>
           </button>
        </div>
      </div>

      {/* غرفة التعليقات مع صور المستخدم */}
      <div className="w-full md:w-80 bg-black/60 backdrop-blur-3xl border-r border-white/10 flex flex-col h-[350px] md:h-full shrink-0">
         <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2 space-x-reverse">
              <MessageSquare size={16} className="text-gray-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">تفاعلات الساحة</span>
            </div>
            <div className="w-8 h-8 rounded-full border border-yellow-500/30 overflow-hidden bg-black p-0.5">
               <img src={currentUser?.avatar} className="w-full h-full rounded-full object-cover" />
            </div>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className="flex space-x-3 space-x-reverse animate-slide-up">
                 <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                    {m.user === 'نظام_الذكاء' ? <Brain size={12} className="text-indigo-400" /> : <img src={currentUser?.avatar} className="w-full h-full rounded-lg object-cover" />}
                 </div>
                 <div className="text-right">
                    <span className={`font-black text-[9px] block ${m.color}`}>@{m.user}</span>
                    <span className="text-[11px] text-gray-400 font-medium leading-relaxed">{m.text}</span>
                 </div>
              </div>
            ))}
         </div>
         <div className="p-4 bg-white/5 border-t border-white/10">
            <div className="flex items-center space-x-2 space-x-reverse">
               <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder="قل شيئاً للمنافسين..." 
                    className="w-full bg-black/60 border border-white/10 rounded-xl py-3 px-5 text-[10px] focus:outline-none focus:border-yellow-500 transition-all text-white"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full overflow-hidden opacity-50">
                     <img src={currentUser?.avatar} className="w-full h-full object-cover" />
                  </div>
               </div>
               <button className="p-3 bg-yellow-500 rounded-xl text-black shadow-lg hover:rotate-6 transition-transform"><Send size={14} /></button>
            </div>
         </div>
      </div>

      {showGifts && <GiftsOverlay onClose={() => setShowGifts(false)} onSend={(gift) => {
        setMessages(prev => [...prev, { user: currentUser?.displayName || 'مبدع', text: `أرسل ${gift.icon} تشجيعاً لنفسه! 🚀`, color: 'text-yellow-500' }]);
        setShowGifts(false);
      }} />}
    </div>
  );
};

export default ChessArena;
