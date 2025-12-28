
import React, { useState, useMemo, useEffect } from 'react';
import { Contact2, CreditCard, ShieldCheck, ChevronLeft, User, QrCode, Sparkles, BadgeCheck, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const DigitalIdentity: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [step, setStep] = useState<'payment' | 'form' | 'preview'>('payment');
  
  const [day, setDay] = useState('01');
  const [month, setMonth] = useState('01');
  const [year, setYear] = useState('2000');

  const [formData, setFormData] = useState({
    fullName: currentUser?.displayName || '',
    address: 'الجمهورية اليمنية',
    phone: '',
    gender: 'ذكر',
    bloodType: 'O+',
    dob: '2000-01-01',
    photo: currentUser?.avatar || ''
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, dob: `${year}-${month}-${day}` }));
  }, [day, month, year]);

  const serialNumber = useMemo(() => {
    const chars = '0123456789ABCDEF';
    const segment = () => Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `YEM-${segment()}-${segment()}`;
  }, [step]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('preview');
  };

  const IDCard = () => (
    <div className="space-y-12 animate-fade-in w-full max-w-sm mx-auto">
      {/* وجه البطاقة */}
      <div className="relative w-full aspect-[1.586/1] rounded-[30px] overflow-hidden border border-white/20 shadow-2xl bg-[#0a0a0c]">
        {/* علم اليمن خلفية علوية */}
        <div className="absolute top-0 left-0 w-full h-1.5 flex z-30">
          <div className="flex-1 bg-[#CE1126]"></div>
          <div className="flex-1 bg-white"></div>
          <div className="flex-1 bg-black"></div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0c] via-[#1a1a1f] to-[#0a0a0c]"></div>
        
        <div className="relative z-10 p-5 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-10 h-10 flixo-gradient rounded-xl flex items-center justify-center border border-white/30 shadow-2xl">
                  <span className="font-black text-lg text-white">FX</span>
                </div>
                <div className="text-right">
                  <h4 className="text-[10px] font-black text-white">بطاقة هوية فليكسو</h4>
                  <p className="text-[6px] text-indigo-400 font-bold uppercase tracking-[0.2em]">Sovereign Yemen Identity</p>
                </div>
             </div>
             <BadgeCheck size={28} className="text-yellow-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
          </div>

          <div className="flex space-x-4 space-x-reverse items-end mb-2">
             <div className="w-20 h-24 rounded-xl border-2 border-indigo-500/40 overflow-hidden shadow-2xl bg-black/40">
                <img src={formData.photo} className="w-full h-full object-cover brightness-110" />
             </div>
             
             <div className="flex-1 space-y-2 text-right">
                <div className="border-b border-white/10 pb-1">
                   <span className="text-[6px] text-gray-500 block font-black uppercase">الاسم</span>
                   <p className="text-xs font-black text-white">{formData.fullName}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                   <div>
                      <span className="text-[5px] text-gray-500 block uppercase">تاريخ الميلاد</span>
                      <span className="text-[8px] font-bold text-gray-200">{formData.dob}</span>
                   </div>
                   <div>
                      <span className="text-[5px] text-gray-500 block uppercase">الرقم السري</span>
                      <span className="text-[8px] font-bold text-indigo-400">{serialNumber}</span>
                   </div>
                   <div className="col-span-2">
                      <span className="text-[5px] text-gray-500 block uppercase">العنوان</span>
                      <span className="text-[8px] font-bold text-gray-200">{formData.address}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* ظهر البطاقة */}
      <div className="relative w-full aspect-[1.586/1] rounded-[30px] overflow-hidden border border-white/10 shadow-2xl bg-[#050505]">
        <div className="p-6 h-full flex flex-col justify-between">
           <div className="space-y-4 text-center">
              <div className="flex items-center justify-center space-x-2 space-x-reverse mb-2">
                 <div className="w-3 h-3 bg-[#CE1126]"></div>
                 <div className="w-3 h-3 bg-white"></div>
                 <div className="w-3 h-3 bg-black"></div>
              </div>
              <p className="text-[7px] text-gray-500 leading-relaxed font-bold italic">
                هذه البطاقة وثيقة رقمية رسمية صادرة من المطور خالد المنتصر. جميع البيانات مشفرة ولا يحق تداولها خارج منظومة فليكسو.
              </p>
           </div>
           
           <div className="flex justify-between items-end">
              <QrCode size={40} className="text-white/20" />
              <div className="text-left">
                 <span className="text-[7px] font-black text-white uppercase tracking-widest block">KHALID ALMONTASER</span>
                 <p className="text-[6px] text-gray-800 font-black uppercase tracking-[0.5em]">YEMEN SOVEREIGNTY</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-black text-white flex flex-col overflow-y-auto pb-40 no-scrollbar" dir="rtl">
      <div className="p-8 pt-16 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-3 bg-white/5 rounded-2xl border border-white/10"><ChevronLeft size={24} /></button>
        <div className="text-center">
          <h1 className="text-2xl font-black italic tracking-tighter">وثيقة <span className="text-indigo-500">السيادة</span></h1>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Identity Hub</p>
        </div>
        <div className="p-3 bg-indigo-500/10 rounded-2xl"><ShieldCheck size={24} className="text-indigo-400" /></div>
      </div>

      <div className="px-6 space-y-8">
        {step === 'payment' && (
          <div className="bg-white/5 border border-white/10 rounded-[45px] p-8 text-center space-y-8 shadow-2xl">
             <div className="w-20 h-20 bg-yellow-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-yellow-500/20">
                <CreditCard size={32} className="text-yellow-500" />
             </div>
             <div>
                <h3 className="text-xl font-black italic mb-2">إصدار الهوية الرقمية</h3>
                <p className="text-xs text-gray-500 font-medium">وثق هويتك اليمانية في فليكسو واحصل على الشريط البراقد للحماية.</p>
             </div>
             <button onClick={() => setStep('form')} className="w-full py-5 flixo-gradient rounded-[28px] font-black text-sm shadow-xl active:scale-95 transition-all">تأكيد الدفع والبدء</button>
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={handleFormSubmit} className="bg-white/5 border border-white/10 rounded-[45px] p-8 space-y-6 animate-slide-up">
             <div className="space-y-5 text-right">
                <div className="space-y-1.5">
                   <label className="text-[9px] font-black text-gray-500 mr-2 uppercase">الاسم الكامل</label>
                   <input type="text" required className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[9px] font-black text-gray-500 mr-2 uppercase">العنوان في اليمن</label>
                   <input type="text" required className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[9px] font-black text-gray-500 mr-2 uppercase">رقم الجوال</label>
                   <input type="tel" required className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
             </div>
             <button type="submit" className="w-full py-5 flixo-gradient rounded-[28px] font-black text-sm">توليد الهوية السيادية</button>
          </form>
        )}

        {step === 'preview' && (
          <div className="space-y-10 pb-20">
             <IDCard />
             <button className="w-full py-5 bg-white text-black rounded-[28px] font-black text-sm active:scale-95 transition-all">حفظ في القبو السيادي</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalIdentity;
