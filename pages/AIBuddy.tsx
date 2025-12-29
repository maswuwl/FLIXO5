
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { Mic, PhoneOff, Cpu, Sparkles, ChevronLeft, RefreshCcw, AlertTriangle, Radio } from 'lucide-react';
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
              setTranscription(msg.serverContent.outputTranscription.text);
            }
          },
          onclose: () => {
            setIsActive(false);
            setIsConnecting(false);
          },
          onerror: (e) => {
            setIsActive(false);
            setError("اضطراب في بروتوكول الصوت. يرجى إعادة المحاولة.");
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: "أنت مساعد فليكسو العالمي. العميل هو خالد المنتصر. تحدث بذكاء اصطناعي فائق الاستراتيجية، فخامة مطلقة، وقدرة على تحليل أي فكرة بمواصفات عالمية."
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e: any) {
      setIsConnecting(false);
      setError("تعذر تفعيل بروتوكول الصوت الذكي.");
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    setIsActive(false);
    setTranscription('');
  };

  return (
    <div className="h-full bg-[#050208] flex flex-col items-center justify-center p-8 relative overflow-hidden" dir="rtl">
      {/* Background Tech Orbs */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-pink-600/5 blur-[150px] rounded-full animate-pulse delay-700"></div>

      <button onClick={() => navigate(-1)} className="absolute top-12 right-8 text-white p-4 bg-white/5 border border-white/10 rounded-2xl active:scale-90 transition-transform z-20">
        <ChevronLeft size={24} />
      </button>

      <div className="z-10 text-center space-y-12 max-w-md w-full">
        {/* Central Visualization */}
        <div className="relative">
          <div className={`w-48 h-48 rounded-full p-2 mx-auto transition-all duration-1000 ${isActive ? 'scale-110 shadow-[0_0_100px_rgba(99,102,241,0.3)]' : 'opacity-80'}`}>
            <div className={`absolute inset-0 rounded-full border-2 border-indigo-500/20 ${isActive ? 'animate-ping' : ''}`}></div>
            <div className={`absolute inset-0 rounded-full border-4 border-indigo-500/10 ${isActive ? 'animate-pulse' : ''}`}></div>
            <div className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-indigo-600 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]' : 'bg-white/5 border border-white/10'}`}>
               <Radio size={isActive ? 80 : 64} className={isActive ? 'text-white' : 'text-gray-600'} />
            </div>
            
            {/* Thinking / Processing Ring */}
            {isConnecting && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-56 h-56 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-black italic text-white tracking-tighter">فليكسو <span className="flixo-text-gradient">لايف AI</span></h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Sovereign World-Class Intelligence</p>
        </div>

        {error && (
          <div className="animate-slide-up flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-3 space-x-reverse bg-red-500/10 border border-red-500/20 p-5 rounded-3xl text-red-500 text-xs font-black">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
            <button onClick={startSession} className="text-indigo-400 font-black text-[10px] uppercase flex items-center space-x-2">
              <RefreshCcw size={14} />
              <span>إعادة المزامنة</span>
            </button>
          </div>
        )}

        {isActive && (
          <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] min-h-[160px] animate-fade-in relative backdrop-blur-xl flex flex-col justify-center">
             <div className="flex justify-center space-x-1 space-x-reverse mb-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1.5 h-8 bg-indigo-500 rounded-full animate-wave" style={{ animationDelay: `${i * 0.1}s` }}></div>
                ))}
             </div>
             <p className="text-sm text-indigo-100 font-bold italic leading-relaxed text-center">
               {transcription || "أصغي إلى أوامرك يا ركن..."}
             </p>
          </div>
        )}

        <div className="flex flex-col items-center space-y-6">
          {!isActive && !isConnecting ? (
            <button onClick={startSession} className="px-16 py-7 flixo-gradient rounded-full font-black text-xl shadow-[0_25px_70px_rgba(99,102,241,0.4)] text-white active:scale-95 transition-all flex items-center space-x-5 space-x-reverse group">
              <Mic size={32} className="group-hover:scale-110 transition-transform" />
              <span>تحدث مع الخبير</span>
            </button>
          ) : isActive ? (
            <button onClick={stopSession} className="p-10 bg-red-600 rounded-full shadow-[0_0_60px_rgba(239,68,68,0.5)] text-white active:scale-95 transition-all animate-pulse">
              <PhoneOff size={44} />
            </button>
          ) : null}
          
          {!isActive && (
            <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em]">نظام الصوت المباشر مشفر ومحمي</p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { height: 10px; }
          50% { height: 40px; }
        }
        .animate-wave {
          animation: wave 1s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AIBuddy;
