
import React, { useState, useRef } from 'react';
import { ShieldCheck, Camera, X, ChevronLeft, Save, CheckCircle2, MapPin, Calendar, Link as LinkIcon, Edit3, User, Brain, ShieldAlert, BadgeCheck } from 'lucide-react';
import { MOCK_USERS } from '../constants';
import CelebrityBadge from '../components/CelebrityBadge';
import ProfileGuard from '../components/ProfileGuard';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(() => authService.getCurrentUser() || MOCK_USERS[0]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const isAdmin = user.celebrityTier === 0;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      authService.updateUser(user);
      setIsSaving(false);
      setHasChanges(false);
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-black overflow-y-auto pb-48 no-scrollbar" dir="rtl">
      <div className="relative h-64 bg-gradient-to-b from-indigo-900/40 to-black shrink-0">
        <div className="absolute top-12 right-6 z-20">
          <button onClick={() => navigate('/')} className="p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white active:scale-90 transition-transform">
            <ChevronLeft size={24} />
          </button>
        </div>
        
        <div className="absolute bottom-0 left-1/2 translate-x-1/2 translate-y-1/2 flex flex-col items-center">
          <div className="relative">
            <ProfileGuard isActive={true} size="lg" isSovereign={isAdmin}>
              <div className={`w-36 h-36 rounded-full p-1.5 ${isAdmin ? 'bg-yellow-500 shadow-2xl shadow-yellow-500/20' : 'flixo-gradient'}`}>
                <img src={user.avatar} className="w-full h-full rounded-full border-4 border-black object-cover" alt="Profile" />
              </div>
            </ProfileGuard>
            {!isEditing && (
              <div className="absolute -bottom-2 -right-2 bg-indigo-600 p-2 rounded-full border-2 border-black shadow-lg">
                <BadgeCheck size={18} className="text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-24 px-8 space-y-8">
        {!isEditing ? (
          <div className="text-center space-y-6 animate-fade-in">
             <div className="space-y-1">
                <div className="flex items-center justify-center space-x-2 space-x-reverse">
                   <h1 className="text-3xl font-black tracking-tight text-white">{user.displayName}</h1>
                   <CelebrityBadge tier={user.celebrityTier as any} size={22} />
                </div>
                <p className="text-indigo-400 text-sm font-black uppercase tracking-[0.2em]">@{user.username}</p>
             </div>
             
             {user.bio && (
               <div className="bg-white/5 p-6 rounded-[35px] border border-white/5 relative overflow-hidden">
                 <p className="text-xs text-gray-300 font-bold leading-relaxed">{user.bio}</p>
               </div>
             )}

             <div className="flex items-center justify-center space-x-8 space-x-reverse text-gray-500">
                <div className="flex flex-col items-center">
                   <MapPin size={14} className="text-indigo-400 mb-1" />
                   <span className="text-[10px] font-black">{user.location || 'غير محدد'}</span>
                </div>
                <div className="w-px h-6 bg-white/10"></div>
                <div className="flex flex-col items-center">
                   <Calendar size={14} className="text-indigo-400 mb-1" />
                   <span className="text-[10px] font-black">{user.birthDate || '2025/01/01'}</span>
                </div>
             </div>

             <button 
               onClick={() => setIsEditing(true)}
               className="w-full py-5 bg-white/5 border border-white/10 rounded-[30px] font-black text-xs text-white flex items-center justify-center space-x-3 space-x-reverse hover:bg-white/10 transition-all shadow-xl"
             >
               <Edit3 size={18} className="text-indigo-400" />
               <span>تعديل السجلات والبيانات</span>
             </button>
          </div>
        ) : (
          <div className="space-y-8 animate-slide-up">
             <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black italic text-indigo-400">تحديث الهوية</h3>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full font-black">الوضع الآمن</span>
             </div>
             
             <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 space-y-6 shadow-2xl">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-500 uppercase mr-4 tracking-widest flex items-center"><User size={12} className="ml-2" /> الاسم المعروض</label>
                   <input type="text" value={user.displayName} onChange={(e) => { setUser({...user, displayName: e.target.value}); setHasChanges(true); }} className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
                
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-500 uppercase mr-4 tracking-widest flex items-center"><Brain size={12} className="ml-2" /> السيرة الذاتية (Bio)</label>
                   <textarea value={user.bio} onChange={(e) => { setUser({...user, bio: e.target.value}); setHasChanges(true); }} className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-indigo-500 min-h-[120px]" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase mr-4 tracking-widest flex items-center"><MapPin size={12} className="ml-2" /> الموقع</label>
                      <input type="text" value={user.location} onChange={(e) => { setUser({...user, location: e.target.value}); setHasChanges(true); }} placeholder="اليمن، تعز.." className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-4 text-xs text-white focus:outline-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase mr-4 tracking-widest flex items-center"><Calendar size={12} className="ml-2" /> الميلاد</label>
                      <input type="date" value={user.birthDate} onChange={(e) => { setUser({...user, birthDate: e.target.value}); setHasChanges(true); }} className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-4 text-xs text-white focus:outline-none" />
                   </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-white/5">
                   <label className="text-[10px] font-black text-gray-500 uppercase mr-4 tracking-widest flex items-center"><LinkIcon size={12} className="ml-2" /> الرابط الشخصي</label>
                   <input type="text" value={user.socialLinks?.website} onChange={(e) => { setUser({...user, socialLinks: {...user.socialLinks, website: e.target.value}}); setHasChanges(true); }} placeholder="https://yourwebsite.com" className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-sm text-indigo-400 focus:outline-none" />
                </div>
             </div>

             <div className="flex space-x-4 space-x-reverse">
                <button 
                  onClick={handleSave}
                  disabled={isSaving || !hasChanges}
                  className="flex-1 py-6 flixo-gradient rounded-[30px] font-black text-white text-lg shadow-2xl active:scale-95 transition-all flex items-center justify-center space-x-3 space-x-reverse disabled:opacity-50"
                >
                  {isSaving ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Save size={20} /> <span>حفظ السجلات</span></>}
                </button>
                <button onClick={() => setIsEditing(false)} className="px-10 py-6 bg-white/5 border border-white/10 rounded-[30px] font-black text-xs text-gray-500">إلغاء</button>
             </div>
          </div>
        )}

        {showSuccess && (
          <div className="flex items-center justify-center space-x-3 space-x-reverse text-green-500 animate-bounce py-2">
            <CheckCircle2 size={18} />
            <span className="text-sm font-black">تم تأمين وتحديث بياناتك السيادية</span>
          </div>
        )}

        <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[40px] flex items-start space-x-4 space-x-reverse">
           <ShieldAlert className="text-indigo-500 mt-1 shrink-0" size={20} />
           <div>
              <h4 className="text-sm font-black text-indigo-400 mb-1">حماية الهوية السيادية</h4>
              <p className="text-[10px] text-gray-500 font-bold leading-relaxed">
                بياناتك محفوظة في قبو فليكسو المشفر (Khalid-Sec V6). يمكنك العودة واستعادة بياناتك في أي وقت حتى من أجهزة أخرى.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
