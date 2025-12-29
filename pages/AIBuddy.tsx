
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { Mic, PhoneOff, Cpu, Sparkles, ChevronLeft, RefreshCcw, AlertTriangle, Radio, Gamepad2, User } from 'lucide-react';
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
          onclose: () => setIsActive(false),
          onerror: () => setError("اضطراب في بروتوكول الصوت.")
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: `أنت مساعد فليكسو العالمي. تتحدث مع ${currentUser?.displayName}. رد بذكاء فائق واستراتيجية عالمية. شجعه على الإبداع واللعب.`
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e: any) {
      setIsConnecting(false);
      setError("تعذر تفعيل بروتوكول الصوت الذكي.");
    }
  };

  return (
    <div className="h-full bg-[#050208] flex flex-col items-center justify-center p-8 relative overflow-hidden" dir="rtl">
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-600/10 blur-[150px] rounded-full"></div>
      
      <button onClick={() => navigate(-1)} className="absolute top-12 right-8 text-white p-4 bg-white/5 border border-white/10 rounded-2xl active:scale-90 transition-transform z-20">
        <ChevronLeft size={24} />
      </button>

      <div className="z-10 text-center space-y-10 max-w-md w-full">
        {/* العرض المركزي للهوية والذكاء */}
        <div className="relative">
          <div className={`w-48 h-48 rounded-full p-2 mx-auto transition-all duration-1000 ${isActive ? 'scale-110 shadow-[0_0_100px_rgba(99,102,241,0.3)]' : 'opacity-80'}`}>
            <div className={`absolute inset-0 rounded-full border-2 border-indigo-500/20 ${isActive ? 'animate-ping' : ''}`}></div>
            
            <div className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden border-4 ${isActive ? 'border-indigo-500' : 'border-white/10 bg-white/5'}`}>
               {isActive ? (
                 <div className="relative w-full h-full">
                    <img src={currentUser?.avatar} className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Radio size={48} className="text-white animate-pulse" />
                    </div>
                 </div>
               ) : (
                 <img src={currentUser?.avatar} className="w-full h-full object-cover grayscale opacity-30" />
               )}
            </div>
            
            {isConnecting && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-56 h-56 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          <div className="mt-6">
             <h2 className="text-xl font-black italic tracking-tighter">{currentUser?.displayName} <span className="text-gray-500 mx-2">&</span> <span className="text-indigo-400">FLIXO AI</span></h2>
          </div>
        </div>

        {isActive && (
          <div className="bg-white/5 border border-white/10 p-6 rounded-[35px] min-h-[120px] backdrop-blur-xl animate-fade-in">
             <p className="text-sm text-indigo-100 font-bold italic leading-relaxed">
               {transcription || "أنا أصغي إليك.. جرب أن تقول 'هيا نلعب الشطرنج'"}
             </p>
          </div>
        )}

        <div className="flex flex-col items-center space-y-6">
          {!isActive && !isConnecting ? (
            <div className="space-y-4 w-full">
              <button onClick={startSession} className="w-full py-6 flixo-gradient rounded-full font-black text-lg shadow-2xl text-white flex items-center justify-center space-x-4 space-x-reverse group active:scale-95 transition-all">
                <Mic size={28} />
                <span>تفعيل الاتصال السيادي</span>
              </button>
              
              <button onClick={() => navigate('/chess')} className="w-full py-5 bg-indigo-600/10 border border-indigo-500/20 rounded-full font-black text-sm text-indigo-400 flex items-center justify-center space-x-3 space-x-reverse hover:bg-indigo-600/20 active:scale-95 transition-all">
                <Gamepad2 size={20} />
                <span>اللعب مع النظام في الساحة</span>
              </button>
            </div>
          ) : isActive ? (
            <button onClick={() => { if(sessionRef.current) sessionRef.current.close(); setIsActive(false); }} className="p-8 bg-red-600 rounded-full shadow-[0_0_50px_rgba(239,68,68,0.4)] text-white animate-pulse">
              <PhoneOff size={32} />
            </button>
          ) : null}
          
          <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.4em]">Sovereign Identity Protection Active</p>
        </div>
      </div>
    </div>
  );
};

export default AIBuddy;
