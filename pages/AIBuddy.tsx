
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { Mic, PhoneOff, Cpu, Sparkles, ChevronLeft, Radio, Gamepad2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

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
  const currentUser = authService.getCurrentUser();
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const startSession = async () => {
    setIsConnecting(true);
    setError(null);
    nextStartTimeRef.current = 0;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputAudioContextRef.current = outputCtx;

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
            // معالجة الصوت المولد (Model Turn)
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              const bytes = decode(audioData);
              const dataInt16 = new Int16Array(bytes.buffer);
              const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
              const channelData = buffer.getChannelData(0);
              for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            // التعامل مع المقاطعة (Interrupted)
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch(e){} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            if (msg.serverContent?.outputTranscription) {
              setTranscription(msg.serverContent.outputTranscription.text);
            }
          },
          onclose: () => { setIsActive(false); setIsConnecting(false); },
          onerror: (e) => { console.error(e); setError("فشل الاتصال بالذكاء السيادي."); }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: `أنت مساعد فليكسو. تتحدث مع المالك خالد المنتصر. رد بذكاء وقوة.`
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e: any) {
      setIsConnecting(false);
      setError("تعذر الوصول للميكروفون أو السيرفر.");
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
  };

  return (
    <div className="h-full bg-[#050208] flex flex-col items-center justify-center p-8 relative overflow-hidden" dir="rtl">
      <div className="absolute inset-0 bg-indigo-600/5 blur-[150px] rounded-full"></div>
      
      <button onClick={() => {stopSession(); navigate(-1);}} className="absolute top-12 right-8 text-white p-4 bg-white/5 border border-white/10 rounded-2xl active:scale-90 transition-transform z-20">
        <ChevronLeft size={24} />
      </button>

      <div className="z-10 text-center space-y-12 max-w-md w-full">
        <div className="relative">
          <div className={`w-56 h-56 rounded-full p-1 mx-auto transition-all duration-700 ${isActive ? 'scale-110' : ''}`}>
            <div className={`absolute inset-0 rounded-full border-2 border-indigo-500/20 ${isActive ? 'animate-ping' : ''}`}></div>
            <div className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden border-4 ${isActive ? 'border-indigo-500 shadow-[0_0_50px_rgba(99,102,241,0.4)]' : 'border-white/10 bg-white/5'}`}>
               <div className="relative w-full h-full">
                  <img src={currentUser?.avatar} className={`w-full h-full object-cover ${isActive ? 'opacity-40' : 'opacity-20 grayscale'}`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                     {isActive ? <Radio size={64} className="text-white animate-pulse" /> : <Mic size={48} className="text-gray-600" />}
                  </div>
               </div>
            </div>
            {isConnecting && (
              <div className="absolute inset-[-10px] border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            )}
          </div>
          <div className="mt-8">
             <h2 className="text-2xl font-black italic">{currentUser?.displayName} <span className="text-indigo-400">&</span> <span className="text-white">FLIXO LIVE</span></h2>
          </div>
        </div>

        {isActive && (
          <div className="bg-white/5 border border-white/10 p-6 rounded-[35px] min-h-[100px] backdrop-blur-xl animate-fade-in flex items-center justify-center">
             <p className="text-sm text-indigo-100 font-bold italic leading-relaxed">
               {transcription || "أنا أصغي إليك يا سيادة المدير.."}
             </p>
          </div>
        )}

        <div className="flex flex-col items-center space-y-6">
          {!isActive && !isConnecting ? (
            <button onClick={startSession} className="w-full py-6 flixo-gradient rounded-full font-black text-lg shadow-2xl text-white flex items-center justify-center space-x-4 space-x-reverse active:scale-95 transition-all">
              <Mic size={28} />
              <span>بدء المحادثة السيادية</span>
            </button>
          ) : isActive ? (
            <button onClick={stopSession} className="p-8 bg-red-600 rounded-full shadow-[0_0_50px_rgba(239,68,68,0.4)] text-white animate-pulse">
              <PhoneOff size={32} />
            </button>
          ) : (
             <div className="flex items-center space-x-3 text-indigo-400 animate-pulse">
                <Loader2 size={24} className="animate-spin" />
                <span className="text-xs font-black uppercase tracking-widest">جاري تأمين الخط السيادي...</span>
             </div>
          )}
          
          <p className="text-[8px] text-gray-700 font-black uppercase tracking-[0.4em]">Sovereign Live Protocol V7</p>
        </div>
      </div>
    </div>
  );
};

export default AIBuddy;
