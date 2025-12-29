
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ShieldCheck, ChevronLeft, BadgeCheck, Fingerprint, Rotate3d, QrCode, 
  Sparkles, CreditCard, Info, Lock, Stethoscope, HardHat, GraduationCap, 
  Briefcase, Car, Utensils, Calculator, Pill, Microscope, Trophy, 
  User, Building, Landmark, PenTool, Globe, Scale, Camera, Image as ImageIcon, 
  Download, Scan, Printer, MessageCircle, ArrowRight, UserCheck, Hammer, Wrench, Layers, X, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

// تعريف القوالب الـ 20 للهويات بمواصفات عالمية
const IDENTITY_TEMPLATES: Record<string, { name: string, icon: any, color: string, secondary: string, accent: string, pattern: string }> = {
  personal: { name: 'هوية شخصية سيادية', icon: <User size={20} />, color: 'bg-slate-900', secondary: 'text-indigo-400', accent: 'border-indigo-500/50', pattern: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)' },
  investor: { name: 'بورصة فليكسو / مستثمر', icon: <Landmark size={20} />, color: 'bg-emerald-950', secondary: 'text-yellow-500', accent: 'border-yellow-500/50', pattern: 'linear-gradient(45deg, #064e3b 25%, transparent 25%)' },
  tribal: { name: 'عضوية مجلس القبائل', icon: <ShieldCheck size={20} />, color: 'bg-amber-950', secondary: 'text-amber-500', accent: 'border-amber-600/50', pattern: 'repeating-linear-gradient(45deg, #451a03, #451a03 10px, #78350f 10px, #78350f 20px)' },
  medical: { name: 'البطاقة الصحية العالمية', icon: <Stethoscope size={20} />, color: 'bg-sky-950', secondary: 'text-cyan-400', accent: 'border-cyan-400/50', pattern: 'radial-gradient(#083344 20%, transparent 20%)' },
  engineer: { name: 'مهندس معماري معتمد', icon: <HardHat size={20} />, color: 'bg-zinc-900', secondary: 'text-orange-500', accent: 'border-orange-500/50', pattern: 'linear-gradient(90deg, #333 1px, transparent 1px)' },
  academic: { name: 'هوية أكاديمية عليا', icon: <GraduationCap size={20} />, color: 'bg-indigo-950', secondary: 'text-pink-400', accent: 'border-pink-500/50', pattern: 'dots' },
  restaurant: { name: 'قطاع الضيافة والمطاعم', icon: <Utensils size={20} />, color: 'bg-red-950', secondary: 'text-orange-300', accent: 'border-red-500/50', pattern: 'squares' },
  cashier: { name: 'محاسب مالي معتمد', icon: <Calculator size={20} />, color: 'bg-slate-800', secondary: 'text-emerald-400', accent: 'border-emerald-500/50', pattern: 'grid' },
  pharmacist: { name: 'نقابة الصيادلة', icon: <Pill size={20} />, color: 'bg-teal-950', secondary: 'text-teal-400', accent: 'border-teal-500/50', pattern: 'radial' },
  sports: { name: 'رياضي محترف', icon: <Trophy size={20} />, color: 'bg-blue-900', secondary: 'text-yellow-400', accent: 'border-yellow-400/50', pattern: 'stripes' },
  driver: { name: 'رخصة قيادة دولية', icon: <Car size={20} />, color: 'bg-stone-900', secondary: 'text-stone-300', accent: 'border-white/20', pattern: 'asphalt' },
  creative: { name: 'مصمم / مبدع فليكسو', icon: <PenTool size={20} />, color: 'bg-purple-950', secondary: 'text-fuchsia-400', accent: 'border-fuchsia-500/50', pattern: 'waves' },
  lawyer: { name: 'مستشار قانوني سيادي', icon: <Scale size={20} />, color: 'bg-neutral-950', secondary: 'text-amber-600', accent: 'border-amber-700/50', pattern: 'luxury' },
  tech: { name: 'مهندس برمجيات ونظم', icon: <Briefcase size={20} />, color: 'bg-black', secondary: 'text-green-500', accent: 'border-green-600/50', pattern: 'matrix' },
  scientist: { name: 'باحث علمي / مختبرات', icon: <Microscope size={20} />, color: 'bg-cyan-950', secondary: 'text-cyan-300', accent: 'border-cyan-400/50', pattern: 'atom' },
  sovereign: { name: 'الرتبة الذهبية (خاص)', icon: <CrownIcon />, color: 'bg-indigo-900', secondary: 'text-yellow-500', accent: 'border-yellow-500/70', pattern: 'royal' },
  worker: { name: 'هوية فني / تقني', icon: <Hammer size={20} />, color: 'bg-orange-950', secondary: 'text-amber-200', accent: 'border-amber-300/50', pattern: 'industrial' },
  security: { name: 'أمن وحماية فليكسو', icon: <Lock size={20} />, color: 'bg-blue-950', secondary: 'text-blue-400', accent: 'border-blue-500/50', pattern: 'shield' },
  marketing: { name: 'إعلامي / مؤثر معتمد', icon: <Globe size={20} />, color: 'bg-pink-950', secondary: 'text-pink-300', accent: 'border-pink-400/50', pattern: 'pulse' },
  official: { name: 'موظف حكومة فليكسو', icon: <Building size={20} />, color: 'bg-slate-700', secondary: 'text-slate-200', accent: 'border-white/30', pattern: 'classic' }
};

function CrownIcon() { return <span className="text-xl">👑</span>; }

const DigitalIdentity: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [step, setStep] = useState<'template' | 'form' | 'preview'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState('personal');
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  
  const userPhotoRef = useRef<HTMLInputElement>(null);
  const entityLogoRef = useRef<HTMLInputElement>(null);

  const isAdmin = currentUser?.celebrityTier === 0;

  const [formData, setFormData] = useState({
    fullName: currentUser?.displayName || '',
    jobTitle: '',
    signature: 'Khalid Almontaser', 
    bloodType: 'O+',
    dobDay: '01',
    dobMonth: '01',
    dobYear: '2000',
    issueDay: '20',
    issueMonth: '05',
    issueYear: '2025',
    photo: currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=khalid',
    entityLogo: '' 
  });

  const currentTheme = IDENTITY_TEMPLATES[selectedTemplate];

  const serialNumber = useMemo(() => {
    const chars = '0123456789';
    const segment = (l: number) => Array.from({length: l}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${segment(4)} ${segment(4)} ${segment(4)} ${segment(4)}`;
  }, [step, selectedTemplate]);

  // تاريخ الانتهاء تلقائياً 10 سنوات
  const expiryYear = useMemo(() => String(parseInt(formData.issueYear) + 10), [formData.issueYear]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'photo' | 'entityLogo') => {
    if (!isAdmin) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const captureFromCamera = async (field: 'photo' | 'entityLogo') => {
    if (!isAdmin) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      setFormData(prev => ({ ...prev, [field]: dataUrl }));
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      alert("تعذر الوصول للكاميرا السيادية.");
    }
  };

  const handleSendToSupport = () => {
    alert("تم إرسال طلب طباعة الهوية لفريق الدعم السيادي. سيتم تحويلها للطابعة مباشرة.");
  };

  const handleCaptureScreen = () => {
    setIsAutoRotating(false);
    alert("تم إيقاف الدوران لتصوير الشاشة السيادية.");
  };

  const IDCard = () => (
    <div className="relative w-full max-w-[340px] h-[215px] mx-auto perspective-2000 group cursor-pointer" onClick={() => setIsAutoRotating(!isAutoRotating)}>
      <div className={`relative w-full h-full transition-transform duration-[2000ms] preserve-3d ${isAutoRotating ? 'animate-sovereign-spin' : (isFlipped ? 'rotate-y-180' : '')}`}>
        
        {/* --- FRONT SIDE --- */}
        <div className={`absolute inset-0 backface-hidden rounded-[20px] overflow-hidden border border-white/20 shadow-2xl ${currentTheme.color} flex flex-col justify-between p-4 transform-gpu translate-z-[1px]`}>
            {/* Watermark Background */}
            <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center rotate-[-30deg] pointer-events-none select-none overflow-hidden">
                <div className="text-[35px] font-black whitespace-nowrap">FLIXO SOVEREIGN IDENTITY FLIXO</div>
            </div>
            
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: currentTheme.pattern.includes('gradient') ? currentTheme.pattern : 'none', backgroundSize: '15px 15px' }}></div>
            
            {/* Header */}
            <div className="relative z-10 flex justify-between items-start border-b border-white/10 pb-2">
               <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20 shadow-lg p-1">
                    <span className="font-black text-xs text-white">FX</span>
                  </div>
                  <div className="text-right">
                    <h4 className="text-[9px] font-black text-white/90 leading-tight">{currentTheme.name}</h4>
                    <p className={`text-[6px] ${currentTheme.secondary} font-bold uppercase tracking-[0.1em]`}>Official Sovereignty V6</p>
                  </div>
               </div>
               <div className="flex items-center space-x-2 space-x-reverse">
                  {formData.entityLogo && (
                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/40 bg-black shadow-xl">
                       <img src={formData.entityLogo} className="w-full h-full object-contain p-0.5" alt="logo" />
                    </div>
                  )}
                  <div className={`${currentTheme.secondary} drop-shadow-lg`}>{currentTheme.icon}</div>
               </div>
            </div>

            {/* Main Area */}
            <div className="relative z-10 flex items-center space-x-4 space-x-reverse h-full py-2">
               <div className="flex flex-col items-center">
                  <div className={`w-18 h-24 rounded-lg border-2 ${currentTheme.accent} overflow-hidden shadow-2xl bg-black/40 p-0.5`}>
                    <img src={formData.photo} className="w-full h-full object-cover grayscale-[5%]" alt="photo" />
                  </div>
                  {/* Fixed Signature FIXED under photo */}
                  <span className="mt-1 font-['Inter'] italic text-[7px] text-white/90 tracking-tighter w-20 truncate text-center" style={{ fontFamily: 'cursive' }}>
                    {formData.signature}
                  </span>
               </div>
               
               <div className="flex-1 space-y-1.5 text-right">
                  <div>
                     <span className="text-[5px] text-gray-500 block font-black uppercase tracking-widest text-right">Name</span>
                     <p className="text-[11px] font-black text-white truncate max-w-[150px] text-right">{formData.fullName}</p>
                  </div>
                  <div>
                     <span className="text-[5px] text-gray-500 block font-black uppercase tracking-widest text-right">Occupation</span>
                     <p className={`text-[9px] font-bold ${currentTheme.secondary} truncate max-w-[150px] text-right`}>{formData.jobTitle || 'Sovereign Member'}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-2 border-t border-white/5 pt-1.5">
                      <div className="text-right">
                          <span className="text-[4.5px] text-gray-500 block uppercase">Issue Date</span>
                          <span className="text-[7px] font-bold text-gray-200">{formData.issueDay}-{formData.issueMonth}-{formData.issueYear}</span>
                      </div>
                      <div className="text-right">
                          <span className="text-[4.5px] text-red-500/70 block uppercase">Expiry Date</span>
                          <span className="text-[7px] font-bold text-red-500">{formData.issueDay}-{formData.issueMonth}-{expiryYear}</span>
                      </div>
                  </div>

                  <div className="flex items-end justify-between mt-1">
                     <div className="grid grid-cols-2 gap-x-2">
                        <div className="text-right">
                            <span className="text-[5px] text-gray-500 block uppercase">DOB</span>
                            <span className="text-[8px] font-bold text-gray-200">{formData.dobDay}-{formData.dobMonth}-{formData.dobYear}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[5px] text-gray-500 block uppercase">Blood</span>
                            <span className="text-[8px] font-bold text-red-500">{formData.bloodType}</span>
                        </div>
                     </div>
                     <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden blur-[1px] opacity-40 bg-black rotate-12">
                        <img src={formData.photo} className="w-full h-full object-cover" />
                     </div>
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 flex justify-between items-center pt-2 border-t border-white/10">
               <div className="font-mono text-[7px] text-gray-400 tracking-[0.3em]">{serialNumber}</div>
               <div className="flex items-center space-x-2 space-x-reverse">
                  <div className={`w-5 h-5 rounded-full border border-white/20 flex items-center justify-center bg-white/5`}>
                    <BadgeCheck size={10} className={currentTheme.secondary} />
                  </div>
                  <span className="text-[6px] text-gray-600 font-black">VALID SECURE</span>
               </div>
            </div>
        </div>

        {/* --- BACK SIDE --- */}
        <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-[20px] overflow-hidden border border-white/20 shadow-2xl ${currentTheme.color} flex flex-col p-4 transform-gpu translate-z-[-1px]`}>
            {/* Small user photo in background */}
            <div className="absolute inset-0 opacity-[0.05] overflow-hidden pointer-events-none flex items-center justify-center">
                <img src={formData.photo} className="w-[110%] h-[110%] object-cover grayscale blur-sm" />
            </div>

            {/* Entity logo watermark in back background */}
            {formData.entityLogo && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none">
                 <img src={formData.entityLogo} className="w-40 h-40 object-contain grayscale" />
              </div>
            )}

            {/* Black stripe */}
            <div className="absolute top-6 inset-x-0 h-8 bg-black/90 border-y border-white/5"></div>
            
            <div className="relative z-10 flex-1 flex flex-col justify-end mt-12 pb-2">
                {/* Lowered QR and Small photo to avoid stripe */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-white p-0.5 rounded shadow-xl translate-y-4">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=FLIXO-ID-${currentUser?.username}`} className="w-full h-full" alt="qr" />
                        </div>
                        <span className="text-[4px] text-white/30 font-mono mt-5 translate-y-4 tracking-tighter">SECURE_HASH_V6</span>
                    </div>

                    {/* Expiry and Logo on Back Side */}
                    <div className="flex flex-col items-end translate-y-4 space-y-2">
                        {formData.entityLogo && (
                          <div className="w-8 h-8 rounded border border-white/20 bg-black/40 overflow-hidden">
                             <img src={formData.entityLogo} className="w-full h-full object-contain p-1" />
                          </div>
                        )}
                        <div className="text-right">
                           <span className="text-[5px] text-gray-500 font-black uppercase block">Card Expires</span>
                           <span className="text-[7px] font-black text-red-500">{formData.issueDay}-{formData.issueMonth}-{expiryYear}</span>
                        </div>
                        <div className="w-8 h-10 rounded border border-white/30 overflow-hidden grayscale bg-black/40">
                            <img src={formData.photo} className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                    <div className="text-right flex flex-col items-end">
                        <div className="text-[5px] text-gray-500 font-black uppercase mb-0.5 tracking-widest text-right">Approved by</div>
                        <div className="font-mono text-[9px] text-indigo-400 italic">Khalid Almontaser</div>
                    </div>
                    <div className="text-left">
                        <div className="text-[5px] text-gray-500 font-black uppercase mb-0.5 tracking-widest text-left">Digital Key</div>
                        <div className="font-mono text-[8px] text-indigo-400 italic">#{currentUser?.username || 'user'}</div>
                    </div>
                </div>
                
                <div className="bg-black/40 p-1.5 rounded-xl border border-white/5 mt-2">
                    <p className="text-[5px] text-gray-500 leading-tight text-center italic">
                        Digital ID Sovereign Document. All rights reserved © 2025 Khalid Almontaser.
                    </p>
                </div>

                <div className="flex justify-between items-center text-[5px] text-gray-600 font-mono mt-1">
                    <span>V6.0 ENGINE</span>
                    <span className={currentTheme.secondary}>CERTIFIED</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-black text-white flex flex-col overflow-y-auto pb-48 no-scrollbar" dir="rtl">
      {/* Header */}
      <div className="p-8 pt-16 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-xl z-20 border-b border-white/5">
        <button onClick={() => navigate(-1)} className="p-3 bg-white/5 rounded-2xl border border-white/10 active:scale-95 transition-all"><ChevronLeft size={24} /></button>
        <div className="text-center">
          <h1 className="text-2xl font-black italic tracking-tighter">مصنع <span className="text-indigo-500">الهوية</span></h1>
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest text-center">Sovereignty Lab V6</p>
        </div>
        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20"><ShieldCheck size={24} className="text-indigo-400" /></div>
      </div>

      <div className="px-6 space-y-8 mt-6">
        {step === 'template' && (
          <div className="space-y-6 animate-fade-in">
             <div className="text-center space-y-2">
                <h3 className="text-xl font-black italic">اختر القالب السيادي</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center">20 تخصصاً عالمياً</p>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                {Object.entries(IDENTITY_TEMPLATES).map(([key, template]) => (
                  <button 
                    key={key}
                    onClick={() => { setSelectedTemplate(key); setStep('form'); }}
                    className={`p-4 rounded-[28px] border transition-all flex flex-col items-center space-y-3 ${selectedTemplate === key ? 'bg-indigo-600 border-white/20 shadow-2xl scale-105' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                  >
                    <div className={`p-4 rounded-2xl ${template.color} text-white shadow-lg`}>{template.icon}</div>
                    <span className="text-[9px] font-black text-center">{template.name}</span>
                  </button>
                ))}
             </div>
          </div>
        )}

        {(step === 'form' || step === 'preview') && (
          <div className="space-y-6 animate-slide-up">
             <div className="flex justify-center">
                <button 
                   onClick={() => setShowTemplateMenu(true)}
                   className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center space-x-2 space-x-reverse text-indigo-400 font-black text-[11px] shadow-lg hover:bg-white/10 active:scale-95 transition-all"
                >
                   <Layers size={16} />
                   <span>قائمة الهويات</span>
                </button>
             </div>

             {step === 'form' ? (
                <form onSubmit={(e) => { e.preventDefault(); setStep('preview'); }} className="bg-white/5 border border-white/10 rounded-[45px] p-8 space-y-6 shadow-2xl pb-16">
                   <div className="flex items-center justify-between mb-4">
                      <button type="button" onClick={() => setStep('template')} className="flex items-center text-[10px] font-black text-indigo-400"><ChevronLeft size={14} className="ml-1" /> القوالب</button>
                      <div className="flex flex-col items-end">
                         <span className="text-[10px] font-black text-gray-500">{currentTheme.name}</span>
                         <span className="text-[8px] text-indigo-400 font-bold">بوابة الإدخال</span>
                      </div>
                   </div>
                   
                   <div className="bg-black/40 p-6 rounded-[35px] border border-white/5 space-y-4">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-[10px] font-black text-indigo-400 flex items-center"><UserCheck size={14} className="ml-2" /> وحدة الصور (للمسؤولين)</span>
                         {!isAdmin && <span className="text-[8px] text-red-500 font-bold italic text-left">Admin Only</span>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col items-center space-y-2">
                              <div className={`w-20 h-24 rounded-2xl overflow-hidden border-2 border-dashed ${isAdmin ? 'border-indigo-500/50' : 'border-gray-800'} bg-black/40 relative group`}>
                                  <img src={formData.photo} className={`w-full h-full object-cover ${!isAdmin ? 'opacity-30 grayscale' : ''}`} />
                                  {isAdmin && (
                                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button type="button" onClick={() => userPhotoRef.current?.click()} className="p-2 bg-indigo-500 rounded-full"><ImageIcon size={16} /></button>
                                      </div>
                                  )}
                              </div>
                              {isAdmin && (
                                <div className="flex space-x-2 space-x-reverse">
                                    <button type="button" onClick={() => userPhotoRef.current?.click()} className="p-2 bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 rounded-lg"><ImageIcon size={14} /></button>
                                    <button type="button" onClick={() => captureFromCamera('photo')} className="p-2 bg-pink-500/20 border border-pink-500/40 text-pink-400 rounded-lg"><Camera size={14} /></button>
                                </div>
                              )}
                              <span className="text-[8px] font-black text-gray-500 text-center">صورة العضو</span>
                              <input type="file" ref={userPhotoRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'photo')} />
                          </div>

                          <div className="flex flex-col items-center space-y-2">
                              <div className={`w-24 h-24 rounded-2xl overflow-hidden border-2 border-dashed ${isAdmin ? 'border-indigo-500/50' : 'border-gray-800'} bg-black/40 relative group`}>
                                  {formData.entityLogo ? <img src={formData.entityLogo} className="w-full h-full object-contain p-2" /> : <Building className="w-full h-full p-6 text-gray-700" />}
                                  {isAdmin && (
                                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button type="button" onClick={() => entityLogoRef.current?.click()} className="p-2 bg-indigo-500 rounded-full"><ImageIcon size={16} /></button>
                                      </div>
                                  )}
                              </div>
                              {isAdmin && (
                                <div className="flex space-x-2 space-x-reverse">
                                    <button type="button" onClick={() => entityLogoRef.current?.click()} className="p-2 bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 rounded-lg"><ImageIcon size={14} /></button>
                                    <button type="button" onClick={() => captureFromCamera('entityLogo')} className="p-2 bg-pink-500/20 border border-pink-500/40 text-pink-400 rounded-lg"><Camera size={14} /></button>
                                </div>
                              )}
                              <span className="text-[8px] font-black text-gray-500 text-center">شعار الجهة</span>
                              <input type="file" ref={entityLogoRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'entityLogo')} />
                          </div>
                      </div>
                   </div>

                   <div className="space-y-4 text-right">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-500 mr-2 uppercase tracking-widest text-right block">الاسم الكامل / Full Name</label>
                         <input type="text" required className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white text-right outline-none focus:border-indigo-500" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                      </div>
                      
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-500 mr-2 uppercase tracking-widest text-right block">المسمى الوظيفي / القبلي</label>
                         <input type="text" placeholder="جراح، مهندس، شيخ، مستشار.." className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white text-right outline-none focus:border-indigo-500" value={formData.jobTitle} onChange={(e) => setFormData({...formData, jobTitle: e.target.value})} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-500 mr-2 uppercase tracking-widest text-right block">فصيلة الدم</label>
                           <select className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-4 text-sm text-right appearance-none outline-none" value={formData.bloodType} onChange={(e) => setFormData({...formData, bloodType: e.target.value})}>
                              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-500 mr-2 uppercase tracking-widest text-right block">تاريخ الميلاد</label>
                           <div className="grid grid-cols-3 gap-2">
                              <select className="bg-black/60 border border-white/10 rounded-xl py-4 px-2 text-xs text-center outline-none" value={formData.dobDay} onChange={(e) => setFormData({...formData, dobDay: e.target.value})}>
                                 {Array.from({length: 31}, (_, i) => String(i+1).padStart(2, '0')).map(d => <option key={d} value={d} className="bg-slate-900">{d}</option>)}
                              </select>
                              <select className="bg-black/60 border border-white/10 rounded-xl py-4 px-2 text-xs text-center outline-none" value={formData.dobMonth} onChange={(e) => setFormData({...formData, dobMonth: e.target.value})}>
                                 {Array.from({length: 12}, (_, i) => String(i+1).padStart(2, '0')).map(m => <option key={m} value={m} className="bg-slate-900">{m}</option>)}
                              </select>
                              <select className="bg-black/60 border border-white/10 rounded-xl py-4 px-2 text-xs text-center outline-none" value={formData.dobYear} onChange={(e) => setFormData({...formData, dobYear: e.target.value})}>
                                 {Array.from({length: 100}, (_, i) => String(2025 - i)).map(y => <option key={y} value={y} className="bg-slate-900">{y}</option>)}
                              </select>
                           </div>
                        </div>
                      </div>

                      <div className="space-y-2 border-t border-white/10 pt-4">
                         <label className="text-[10px] font-black text-indigo-400 mr-2 uppercase tracking-widest text-right block">تاريخ إصدار الهوية</label>
                         <div className="grid grid-cols-3 gap-2">
                            <select className="bg-black/60 border border-white/10 rounded-xl py-4 px-2 text-xs text-center outline-none" value={formData.issueDay} onChange={(e) => setFormData({...formData, issueDay: e.target.value})}>
                               {Array.from({length: 31}, (_, i) => String(i+1).padStart(2, '0')).map(d => <option key={d} value={d} className="bg-slate-900">{d}</option>)}
                            </select>
                            <select className="bg-black/60 border border-white/10 rounded-xl py-4 px-2 text-xs text-center outline-none" value={formData.issueMonth} onChange={(e) => setFormData({...formData, issueMonth: e.target.value})}>
                               {Array.from({length: 12}, (_, i) => String(i+1).padStart(2, '0')).map(m => <option key={m} value={m} className="bg-slate-900">{m}</option>)}
                            </select>
                            <select className="bg-black/60 border border-white/10 rounded-xl py-4 px-2 text-xs text-center outline-none" value={formData.issueYear} onChange={(e) => setFormData({...formData, issueYear: e.target.value})}>
                               {[2023, 2024, 2025].map(y => <option key={y} value={String(y)} className="bg-slate-900">{y}</option>)}
                            </select>
                         </div>
                         <p className="text-[8px] text-gray-500 font-bold italic mt-2 text-center">مدة صلاحية الهوية السيادية 10 سنوات من تاريخ الإصدار.</p>
                      </div>
                   </div>
                   
                   <div className="flex flex-col space-y-3 mt-8">
                      <button type="submit" className="w-full py-5 flixo-gradient rounded-3xl font-black text-sm shadow-xl active:scale-95 transition-all">مراجعة الهوية النهائية</button>
                      <button type="button" onClick={() => navigate('/')} className="text-[11px] font-black text-gray-500 py-2 text-center">رجوع للرئيسية</button>
                   </div>
                </form>
             ) : (
                <div className="space-y-12 pb-24 animate-fade-in text-center flex flex-col items-center">
                   <div className="inline-flex items-center space-x-2 space-x-reverse px-6 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black">
                      <Sparkles size={14} className="animate-spin-slow" />
                      <span>تم الاعتماد السيادي والمطابقة الحيوية v6.0</span>
                   </div>
                   
                   <IDCard />
                   
                   <div className="w-full max-w-sm flex flex-col space-y-4 mt-6">
                      <button 
                        onClick={handleSendToSupport}
                        className="w-full py-5 flixo-gradient rounded-3xl font-black text-sm text-white flex items-center justify-center space-x-3 space-x-reverse hover:opacity-90 active:scale-95 transition-all shadow-2xl"
                      >
                         <Printer size={20} />
                         <span>إرسال لفريق الدعم للطباعة (فوري)</span>
                      </button>

                      <button 
                        onClick={() => alert("سيتم توجيهك لدردشة الدعم الفني لمتابعة حالة كرت الهوية الخاص بك.")}
                        className="w-full py-5 bg-white/10 border border-white/20 rounded-3xl font-black text-sm text-indigo-400 flex items-center justify-center space-x-3 space-x-reverse active:scale-95 transition-all"
                      >
                         <MessageCircle size={20} />
                         <span>رسالة لفريق الدعم (تواصل مباشر)</span>
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                         <button onClick={() => setStep('form')} className="py-5 bg-white/5 border border-white/10 rounded-3xl font-black text-[11px] uppercase flex items-center justify-center">
                            <Wrench size={16} className="ml-2" /> تعديل البيانات
                         </button>
                         <button onClick={() => navigate('/')} className="py-5 bg-indigo-600 rounded-3xl font-black text-[11px] uppercase shadow-2xl flex items-center justify-center">
                            <UserCheck size={16} className="ml-2" /> تفعيل نهائي
                         </button>
                      </div>
                      
                      <button onClick={handleCaptureScreen} className="py-4 bg-white/5 border border-white/5 rounded-2xl font-black text-[10px] uppercase text-gray-500 flex items-center justify-center">
                         <Scan size={14} className="ml-2" /> تهيئة لتصوير الشاشة
                      </button>
                   </div>
                </div>
             )}
          </div>
        )}
      </div>

      {showTemplateMenu && (
        <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-2xl flex flex-col p-6 animate-fade-in" dir="rtl">
           <div className="flex justify-between items-center mb-8 pt-10">
              <h2 className="text-2xl font-black italic tracking-tighter">قائمة الهويات السيادية</h2>
              <button onClick={() => setShowTemplateMenu(false)} className="p-3 bg-white/5 rounded-full border border-white/10"><X size={24} /></button>
           </div>
           
           <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-2 gap-4 pb-20">
              {Object.entries(IDENTITY_TEMPLATES).map(([key, template]) => (
                <button 
                  key={key}
                  onClick={() => { setSelectedTemplate(key); setShowTemplateMenu(false); }}
                  className={`p-4 rounded-[28px] border transition-all flex flex-col items-center space-y-3 ${selectedTemplate === key ? 'bg-indigo-600 border-white/20 shadow-2xl' : 'bg-white/5 border-white/5'}`}
                >
                  <div className={`p-4 rounded-2xl ${template.color} text-white shadow-lg`}>{template.icon}</div>
                  <span className="text-[9px] font-black text-center">{template.name}</span>
                </button>
              ))}
           </div>
        </div>
      )}

      <style>{`
        .perspective-2000 { perspective: 2000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .translate-z-1 { transform: translateZ(1px); }
        .translate-z--1 { transform: translateZ(-1px); }
        
        @keyframes sovereign-spin {
          from { transform: rotateY(0deg) rotateX(1deg); }
          to { transform: rotateY(360deg) rotateX(1deg); }
        }
        
        .animate-sovereign-spin {
          animation: sovereign-spin 12s linear infinite;
        }

        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DigitalIdentity;
