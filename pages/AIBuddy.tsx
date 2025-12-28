
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { Mic, MicOff, PhoneOff, Sparkles, Cpu, Volume2 } from 'lucide-react';

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const AIBuddy: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcription, setTranscription] = useState('');
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sessionRef = useRef<any>(null);

  const startSession = async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    audioContextRef.current = outputCtx;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          setIsActive(true);
          const source = inputCtx.createMediaStreamSource(stream);
          const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            sessionPromise.then(s => {
              if (isMuted) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const base64 = encode(new Uint8Array(int16.buffer));
              s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
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
            const frameCount = dataInt16.length;
            const buffer = outputCtx.createBuffer(1, frameCount, 24000);
            const channelData = buffer.getChannelData(0);
            for (let i = 0; i < frameCount; i++) {
              channelData[i] = dataInt16[i] / 32768.0;
            }
            const source = outputCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(outputCtx.destination);
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
          }
          if (msg.serverContent?.outputTranscription) {
            setTranscription(prev => prev + ' ' + msg.serverContent.outputTranscription.text);
          }
        },
        onclose: () => setIsActive(false),
        onerror: () => setIsActive(false)
      },
      config: {
        responseModalities: [Modality.AUDIO],
        outputAudioTranscription: {},
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
        },
        systemInstruction: "أنت رفيق ذكي مرح لمنصة LIVE. ساعد المستخدمين وتحدث معهم بلهجة عربية ودودة ومرحة. أنت تحت قيادة خالد المنتصر."
      }
    });
    sessionRef.current = await sessionPromise;
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    setIsActive(false);
    setTranscription('');
  };

  return (
    <div className="h-full bg-black flex flex-col items-center justify-center p-8 relative overflow-hidden text-right" dir="rtl">
      <div className="z-10 text-center space-y-8 max-w-md w-full">
        <div className="relative inline-block">
          <div className={`w-32 h-32 rounded-full p-1 transition-all duration-700 ${isActive ? 'flixo-gradient scale-110' : 'bg-white/10'}`}>
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
               <Cpu size={isActive ? 64 : 48} className={isActive ? 'text-pink-500' : 'text-gray-500'} />
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter mb-2">رفيق <span className="flixo-text-gradient">LIVE</span> الذكي</h1>
          <p className="text-gray-400 text-sm font-medium">أنا أسمعك سيادة المسؤول.. كيف أخدمك اليوم؟</p>
        </div>
        {isActive && (
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl min-h-[120px] max-h-[200px] overflow-y-auto">
             <p className="text-sm text-pink-400 font-bold mb-2 flex items-center">
               <Sparkles size={14} className="ml-2" /> استجابة لايف:
             </p>
             <p className="text-xs text-white/80 leading-relaxed italic">{transcription || "..."}</p>
          </div>
        )}
        <div className="flex items-center justify-center space-x-6 space-x-reverse">
          {!isActive ? (
            <button onClick={startSession} className="px-10 py-5 flixo-gradient rounded-full font-black text-lg shadow-2xl flex items-center space-x-3 space-x-reverse">
              <Mic size={24} />
              <span>ابدأ التوجيه الصوتي</span>
            </button>
          ) : (
            <>
              <button onClick={() => setIsMuted(!isMuted)} className={`p-6 rounded-full ${isMuted ? 'bg-orange-500' : 'bg-white/10'}`}>
                <Mic size={28} />
              </button>
              <button onClick={stopSession} className="p-6 bg-red-500 rounded-full shadow-xl">
                <PhoneOff size={28} />
              </button>
            </>
          )}
        </div>
      </div>
      <button onClick={() => window.history.back()} className="absolute top-12 right-8 text-gray-500">إغلاق</button>
    </div>
  );
};

export default AIBuddy;
