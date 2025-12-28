
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { Mic, PhoneOff, Cpu, Sparkles, ChevronLeft, RefreshCcw, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

const AIBuddy: React.FC = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sessionRef = useRef<any>(null);

  const startSession = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key is missing in the system.");

      const ai = new GoogleGenAI({ apiKey });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              sessionPromise.then(s => {
                const inputData = e.inputBuffer.getChannelData(0);
                const int16 = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
                s.sendRealtimeInput({ media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const bytes = decode(audioData);
              const dataInt16 = new Int16Array(bytes.buffer);
              const buffer = outputCtx.createBuffer(1, dataInt16.length, 24000);
              buffer.getChannelData(0).set(Array.from(dataInt16).map(v => v / 32768.0));
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
            }
            if (msg.serverContent?.outputTranscription) {
              setTranscription(prev => (prev + ' ' + msg.serverContent.outputTranscription.text).slice(-150));
            }
          },
          onclose: () => {
            setIsActive(false);
            setIsConnecting(false);
          },
          onerror: (e) => {
            console.error(e);
            setIsActive(false);
            setIsConnecting(false);
            setError("عذراً، نظام المحادثة الحية غير متاح حالياً.");
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: "أنت مساعد فليكسو الصوتي الذكي. تحدث بهدوء وفخامة. ساعد المستخدم في أي شيء يحتاجه."
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e: any) {
      setIsConnecting(false);
      setError(e.message.includes("permission") ? "يرجى منح إذن الميكروفون للتحدث." : "تعذر الاتصال بخادم الصوت الذكي.");
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    setIsActive(false);
    setTranscription('');
  };

  return (
    <div className="h-full bg-[#050505] flex flex-col items-center justify-center p-8 relative overflow-hidden" dir="rtl">
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/10 via-transparent to-black pointer-events-none"></div>
      
      <button onClick={() => navigate(-1)} className="absolute top-12 right-8 text-white p-4 bg-white/5 rounded-2xl active:scale-90 transition-transform z-20">
        <ChevronLeft size={24} />
      </button>

      <div className="z-10 text-center space-y-10 max-w-md w-full">
        <div className={`relative w-40 h-40 rounded-full p-1 mx-auto transition-all duration-1000 ${isActive ? 'scale-110 shadow-[0_0_80px_rgba(124,58,237,0.4)]' : 'opacity-80'}`}>
          <div className={`absolute inset-0 rounded-full border-2 border-indigo-500/20 ${isActive ? 'animate-ping' : ''}`}></div>
          <div className={`w-full h-full rounded-full flex items-center justify-center transition-colors duration-500 ${isActive ? 'bg-indigo-600' : 'bg-white/5 border border-white/10'}`}>
             <Cpu size={isActive ? 80 : 64} className={isActive ? 'text-white' : 'text-gray-500'} />
          </div>
          {isConnecting && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <div>
          <h1 className="text-4xl font-black italic text-white tracking-tighter mb-2">مساعد فليكسو <span className="flixo-text-gradient">لايف</span></h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">Sovereign Voice Assistant</p>
        </div>

        {error && (
          <div className="flex flex-col items-center space-y-4 animate-slide-up">
            <div className="flex items-center space-x-3 space-x-reverse bg-red-500/10 border border-red-500/20 p-5 rounded-2xl text-red-500 text-xs font-bold">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
            <button onClick={startSession} className="flex items-center space-x-2 space-x-reverse text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
              <RefreshCcw size={14} />
              <span>إعادة المحاولة</span>
            </button>
          </div>
        )}

        {isActive && (
          <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] min-h-[140px] animate-fade-in relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-pulse"></div>
             <p className="text-[10px] text-indigo-400 font-black mb-4 flex items-center justify-center italic uppercase tracking-widest">
               <Sparkles size={12} className="ml-2" /> الذكاء يصغي إليك الآن
             </p>
             <p className="text-sm text-white/90 leading-relaxed font-bold italic h-full flex items-center justify-center">
               {transcription || "..."}
             </p>
          </div>
        )}

        <div className="flex items-center justify-center">
          {!isActive && !isConnecting ? (
            <button onClick={startSession} className="px-14 py-6 flixo-gradient rounded-full font-black text-lg shadow-[0_20px_60px_rgba(236,72,153,0.3)] text-white active:scale-95 transition-all flex items-center space-x-4 space-x-reverse group">
              <Mic size={28} className="group-hover:scale-110 transition-transform" />
              <span>ابدأ التحدث</span>
            </button>
          ) : isActive ? (
            <button onClick={stopSession} className="p-10 bg-red-600 rounded-full shadow-[0_0_50px_rgba(239,68,68,0.4)] text-white active:scale-95 transition-all animate-pulse">
              <PhoneOff size={40} />
            </button>
          ) : null}
        </div>
      </div>
      
      <p className="absolute bottom-12 text-[9px] text-gray-700 font-black uppercase tracking-[0.4em]">Flixo Engine V5.0 Ready</p>
    </div>
  );
};

export default AIBuddy;
