
import React, { useState, useEffect, useRef } from 'react';
import { Brain, Send, ChevronLeft, Terminal, FileCode, Cpu, Sparkles, Layout, Database, CheckCircle2, Zap, Layers, Image as ImageIcon, Download, Copy, Code, Eye, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { geminiService } from '../services/geminiService';

const ExpertMind: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [viewingFile, setViewingFile] = useState<{name: string, content: string} | null>(null);
  
  const [builtFiles, setBuiltFiles] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('flixo_expert_files');
    return saved ? JSON.parse(saved) : {};
  });
  const [currentProject, setCurrentProject] = useState<string | null>(() => localStorage.getItem('flixo_current_project'));
  const [builtAssets, setBuiltAssets] = useState<string[]>(() => {
    const saved = localStorage.getItem('flixo_expert_assets');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('flixo_expert_files', JSON.stringify(builtFiles));
    localStorage.setItem('flixo_current_project', currentProject || '');
    localStorage.setItem('flixo_expert_assets', JSON.stringify(builtAssets));
  }, [builtFiles, currentProject, builtAssets]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;
    
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsThinking(true);

    const stream = geminiService.expertMindStream(userText);
    let modelMsg = { role: 'model', content: '', actions: [] as any[] };
    setMessages(prev => [...prev, modelMsg]);

    for await (const chunk of stream) {
      if (chunk.type === 'text') {
        modelMsg.content += chunk.content;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...modelMsg };
          return updated;
        });
      } else if (chunk.type === 'action') {
        if (chunk.name === 'writeProjectFile') {
          setBuiltFiles(prev => ({ ...prev, [chunk.args.filename]: chunk.args.content }));
        }
        if (chunk.name === 'createSovereignProject') {
          setCurrentProject(chunk.args.projectName);
        }
        if (chunk.name === 'generateProjectAsset') {
          const imageUrl = await geminiService.generateSovereignImage(chunk.args.prompt);
          if (imageUrl) setBuiltAssets(prev => [...prev, imageUrl]);
        }
        
        modelMsg.actions.push(chunk);
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...modelMsg };
          return updated;
        });
      }
    }
    setIsThinking(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("تم نسخ الكود السيادي إلى الحافظة.");
  };

  const downloadFile = (name: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
  };

  return (
    <div className="h-full bg-[#030205] text-white flex flex-col md:flex-row overflow-hidden" dir="rtl">
      {/* Left: Project Explorer */}
      <div className="hidden md:flex w-80 border-l border-white/5 bg-black/40 flex-col shrink-0">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <Layers className="text-indigo-500" size={18} />
            <h2 className="text-xs font-black uppercase tracking-widest">مستكشف المشروع</h2>
          </div>
          <button onClick={() => {if(confirm("مسح؟")){setBuiltFiles({}); setBuiltAssets([]); setCurrentProject(null);}}} className="text-[8px] font-black text-red-500 uppercase hover:underline">إعادة تهيئة</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
          {currentProject && (
            <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[8px] text-indigo-400 font-black block uppercase mb-1">المشروع الحالي</span>
                <span className="text-xs font-bold">{currentProject}</span>
              </div>
              <Cpu size={14} className="text-indigo-400 animate-pulse" />
            </div>
          )}
          
          <div className="space-y-1.5">
            <span className="text-[9px] text-gray-500 font-black uppercase px-2 mb-2 block">ملفات الكود ({Object.keys(builtFiles).length})</span>
            {/* Fix: Added explicit type cast to ensure name and content are strings */}
            {Object.entries(builtFiles).map(([name, content]: [string, any]) => (
              <div key={name} className="group p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between hover:bg-white/10 transition-all">
                <div className="flex items-center space-x-3 space-x-reverse cursor-pointer" onClick={() => setViewingFile({name, content: String(content)})}>
                  <FileCode size={14} className="text-gray-400 group-hover:text-indigo-400" />
                  <span className="text-[11px] font-medium truncate max-w-[120px]">{name}</span>
                </div>
                <div className="flex space-x-1.5 space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => copyToClipboard(String(content))} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400"><Copy size={12} /></button>
                  <button onClick={() => downloadFile(name, String(content))} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400"><Download size={12} /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <span className="text-[9px] text-gray-500 font-black uppercase px-2 mb-2 block">الأصول البصرية ({builtAssets.length})</span>
            <div className="grid grid-cols-2 gap-2">
               {builtAssets.map((asset, i) => (
                 <div key={i} className="aspect-square rounded-xl overflow-hidden border border-white/10 group relative cursor-pointer" onClick={() => window.open(asset, '_blank')}>
                    <img src={asset} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                       <Eye size={16} className="text-white" />
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <div className="p-6 border-b border-white/5 bg-black/60 backdrop-blur-xl flex items-center justify-between z-20">
          <div className="flex items-center space-x-4 space-x-reverse">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-xl transition-all"><ChevronLeft size={24} /></button>
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg">
                <Brain size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black italic text-white">خبير المعرفة <span className="text-indigo-400">EXPERT</span></h1>
                <p className="text-[8px] text-gray-500 font-black uppercase tracking-[0.4em]">Sovereign AI Kernel • V10</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
             <div className="px-4 py-1.5 bg-indigo-900/20 border border-indigo-500/30 rounded-full flex items-center space-x-2 space-x-reverse">
                <Zap size={12} className="text-yellow-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase text-indigo-400">Kernel Online</span>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-40">
           {messages.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                <Brain size={80} className="text-indigo-500" />
                <div className="space-y-2">
                  <h3 className="text-2xl font-black italic">نواة المعرفة الرقمية</h3>
                  <p className="text-[10px] font-bold max-w-xs mx-auto uppercase tracking-widest">أنا مهندسك السيادي الخاص. اطلب مني بناء أي تطبيق الآن.</p>
                </div>
             </div>
           )}

           {messages.map((m, i) => (
             <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'} animate-fade-in`}>
                <div className={`max-w-[90%] p-6 rounded-[35px] ${m.role === 'user' ? 'bg-white/5 border border-white/10' : 'bg-transparent text-gray-100'}`}>
                   {m.content && <p className="text-[13px] leading-relaxed font-medium mb-4 whitespace-pre-wrap">{m.content}</p>}
                   
                   <div className="space-y-2">
                     {m.actions?.map((action: any, aIdx: number) => (
                       <div key={aIdx} className="bg-black/60 border border-white/5 rounded-2xl p-4 flex items-center justify-between animate-slide-up">
                          <div className="flex items-center space-x-3 space-x-reverse">
                             {action.name === 'generateProjectAsset' ? <ImageIcon size={14} className="text-pink-400" /> : <Terminal size={14} className="text-indigo-400" />}
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{action.name === 'generateProjectAsset' ? 'توليد أصل بصري' : `تنفيذ: ${action.name}`}</span>
                          </div>
                          <span className="text-[9px] text-green-500 font-black">COMPLETED</span>
                       </div>
                     ))}
                   </div>
                </div>
             </div>
           ))}
           {isThinking && (
             <div className="flex justify-end">
                <div className="flex items-center space-x-3 space-x-reverse text-indigo-400 px-6 py-4 bg-indigo-600/5 rounded-full border border-indigo-500/20">
                   <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                   <span className="text-[11px] font-black italic animate-pulse">خبير المعرفة يحلل الأبعاد البرمجية...</span>
                </div>
             </div>
           )}
        </div>

        {/* Floating Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#030205] via-[#030205]/90 to-transparent">
           <div className="max-w-3xl mx-auto flex items-center space-x-4 space-x-reverse bg-[#1a1a2e]/80 backdrop-blur-3xl border border-white/10 p-2 rounded-[2.5rem] shadow-2xl">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="تحدث مع خبير المعرفة للبناء والتطوير..."
                className="flex-1 bg-transparent border-none focus:outline-none px-6 text-sm text-white placeholder:text-gray-600"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${input.trim() ? 'bg-white text-black shadow-xl scale-110' : 'bg-white/5 text-gray-600'}`}
              >
                <Send size={20} />
              </button>
           </div>
        </div>
      </div>

      {/* Code Viewer Modal */}
      {viewingFile && (
        <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-fade-in" dir="ltr">
           <div className="w-full max-w-4xl bg-[#0a0a1a] border border-white/10 rounded-[40px] flex flex-col h-[80vh] overflow-hidden shadow-2xl relative">
              <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full"></div>
              
              <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10 bg-black/40">
                 <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
                       <Code size={20} className="text-indigo-400" />
                    </div>
                    <div>
                       <h3 className="text-lg font-black text-white">{viewingFile.name}</h3>
                       <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Sovereign Source Code</span>
                    </div>
                 </div>
                 <div className="flex items-center space-x-3">
                    <button onClick={() => copyToClipboard(viewingFile.content)} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 text-gray-400 transition-all"><Copy size={18} /></button>
                    <button onClick={() => setViewingFile(null)} className="p-3 bg-red-500/10 rounded-2xl hover:bg-red-500/20 text-red-500 transition-all"><X size={18} /></button>
                 </div>
              </div>

              <div className="flex-1 overflow-auto p-8 font-mono text-[13px] leading-relaxed text-indigo-100/90 no-scrollbar relative z-10 bg-[#050510]/50">
                 <pre className="whitespace-pre-wrap">{viewingFile.content}</pre>
              </div>

              <div className="p-6 border-t border-white/5 bg-black/40 flex justify-end relative z-10">
                 <button onClick={() => downloadFile(viewingFile.name, viewingFile.content)} className="px-8 py-3 bg-indigo-600 rounded-2xl text-white font-black text-xs flex items-center space-x-2">
                    <Download size={14} />
                    <span>تحميل الملف</span>
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ExpertMind;
