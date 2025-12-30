
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
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
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
    alert("سيتم إرسال هويتك السيادية إلى فريق الدعم الفني للطباعة. سيتم التواصل معك فور الجاهزية.");
  };

  const handleCaptureScreen = () => {
    alert("جاري تهيئة الهوية للالتقاط.. يرجى أخذ لقطة شاشة (Screenshot) الآن لحفظها في جهازك كملف سيادي.");
  };

  const IDCard = () => (
    <div className="relative w-full max-w-[340px] h-[215px] mx-auto perspective-2000 group cursor-pointer" onClick={() => setIsAutoRotating(!isAutoRotating)}>
      <div className={`relative w-full h-full transition-transform duration-[2000ms] preserve-3d ${isAutoRotating ? 'animate-sovereign-spin' : (isFlipped ? 'rotate-y-180' : '')}`}>
        
        {/* --- FRONT SIDE --- */}
        <div className={`absolute inset-0 backface-hidden rounded-[20px] overflow-hidden border border-white/20 shadow-2xl ${currentTheme.color} flex flex-col justify-between p-4 transform-gpu translate-z-[1px]`}>
            {/* Background Watermark - Removed Khalid name from here as requested */}
            <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center rotate-[-30deg] pointer-events-none select-none overflow-hidden text-center px-4">
                <div className="text-[25px] font-black whitespace-nowrap uppercase tracking-tighter">FLIXO SOVEREIGN IDENTITY SYSTEM FLIXO</div>
            </div>
            
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: currentTheme.pattern.includes('gradient') ? currentTheme.pattern : 'none', backgroundSize: '15px 15px' }}></div>
            
            {/* Header */}
            <div className="relative z-10 flex justify-between items-start border-b border-white/10 pb-2">
               <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-10