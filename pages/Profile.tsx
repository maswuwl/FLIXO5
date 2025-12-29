
import React, { useState, useRef, useMemo } from 'react';
import { ShieldCheck, Camera, ChevronLeft, Save, Globe, Plus, Trash2, Key, Zap, DollarSign, Edit3, User, Brain, ShieldAlert, Link as LinkIcon, Image as ImageIcon, Layout, Grid, FileText, Heart, X, Check, Loader2 } from 'lucide-react';
import { MOCK_USERS, MOCK_FEED } from '../constants';
import CelebrityBadge from '../components/CelebrityBadge';
import ProfileGuard from '../components/ProfileGuard';
import SovereignPanorama from '../components/SovereignPanorama';
import PostCard from '../components/PostCard';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { ExternalAsset, ContentItem } from '../types';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(() => authService.getCurrentUser() || MOCK_USERS[0]);
  const [activeTab, setActiveTab] = useState<'posts' | 'assets'>('posts');
  
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const isAdmin = user.celebrityTier === 0;

  const userPosts = useMemo(() => {
    return MOCK_FEED.filter(post => post.author.id === user.id);
  }, [user.id]);

  const handleAvatarClick = () => {
    if (isEditing) avatarInputRef.current?.click();
  };

  const handleCoverUploadClick = () => {
    coverInputRef.current?.click();
  };

  const handleCaptureCover = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: 1280, height: 720 } });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();
      
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      const dataUrl = canvas.toDataURL('image/jpeg');
      setUser(prev => ({ ...prev, cover: dataUrl }));
      setHasChanges(true);
      setIsEditing(true); // تفعيل وضع الحفظ عند التقاط صورة
      
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      alert("تعذر الوصول للكاميرا السيادية.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({ ...prev, [field]: reader.result as string }));
        setHasChanges(true);
        setIsEditing(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      authService.updateUser(user);
      setIsSaving(false);
      setHasChanges(false);
      setIsEditing(false);
    }, 1200);
  };

  const cancelChanges = () => {
    setUser(authService.getCurrentUser() || user);
    setHasChanges(false);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col h-full bg-black overflow-y-auto pb-48 no-scrollbar" dir="rtl">
      
      {/* Facebook Style Cover Options Bar */}
      {hasChanges && (
        <div className="fixed top-0 left-0 right-0 z-[200] bg-black/80 backdrop-blur-2xl border-b border-white/10 p-4 flex items-center justify-between animate-slide-down">
           <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                 <Check size={16} className="text-white" />
              </div>
              <span className="text-xs font-black text-white">تعديل الغلاف السيادي</span>
           </div>
           <div className="flex space-x-2 space-x-reverse">
              <button onClick={cancelChanges} className="px-5 py-2 bg-white/5 rounded-xl text-[10px] font-black hover:bg-white/10 transition-all">إلغاء</button>
              <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 flixo-gradient rounded-xl text-[10px] font-black text-white shadow-lg flex items-center">
                 {isSaving ? <Loader2 size={12} className="animate-spin ml-2" /> : 'حفظ الغلاف'}
              </button>
           </div>
        </div>
      )}

      {/* Cover Section */}
      <div className="relative h-72 shrink-0 group">
        <SovereignPanorama imageUrl={user.cover} isEditing={isEditing} />
        
        <div className="absolute top-12 left-0 right-0 px-6 flex items-center justify-between z-40">
          <button onClick={() => navigate('/')} className="p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white active:scale-90 transition-transform">
            <ChevronLeft size={24} />
          </button>
        </div>

        {/* Cover Action Menu */}
        <div className="absolute bottom-4 left-4 z-40 flex space-x-2 space-x-reverse">
          <div className="relative group/menu">
            <button className="p-3 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/20 text-white shadow-xl hover:scale-105 active:scale-95 transition-all">
              <Camera size={18} />
            </button>
            <div className="absolute bottom-full left-0 mb-3 hidden group-hover/menu:flex flex-col bg-black/90 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden min-w-[160px] shadow-2xl animate-scale-in">
               <button onClick={handleCoverUploadClick} className="flex items-center space-x-3 space-x-reverse p-4 hover:bg-white/5 text-right transition-all border-b border-white/5">
                  <ImageIcon size={14} className="text-indigo-400" />
                  <span className="text-[10px] font-black">تحميل من الاستوديو</span>
               </button>
               <button onClick={handleCaptureCover} className="flex items-center space-x-3 space-x-reverse p-4 hover:bg-white/5 text-right transition-all">
                  <Camera size={14} className="text-pink-400" />
                  <span className="text-[10px] font-black">التقاط صورة حية</span>
               </button>
            </div>
          </div>
          <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />
        </div>
        
        {/* Avatar Section */}
        <div className="absolute bottom-0 left-1/2 translate-x-1/2 translate-y-1/2 flex flex-col items-center z-30">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <ProfileGuard isActive={true} size="lg" isSovereign={isAdmin}>
              <div className={`w-36 h-36 rounded-full p-1.5 transition-all duration-500 ${isAdmin ? 'bg-yellow-500 shadow-2xl shadow-yellow-500/20' : 'flixo-gradient'}`}>
                <img src={user.avatar} className="w-full h-full rounded-full border-4 border-black object-cover" alt="Profile" />
                <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all">
                  <Camera size={24} className="text-white mb-1" />
                  <span className="text-[7px] font-black text-white uppercase">تغيير</span>
                </div>
              </div>
            </ProfileGuard>
            <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
          </div>
        </div>
      </div>

      <div className="mt-24 px-4 sm:px-8 space-y-8">
         <div className="text-center space-y-4">
            <div className="space-y-1">
               <div className="flex items-center justify-center space-x-2 space-x-reverse">
                  <h1 className="text-3xl font-black tracking-tight text-white">{user.displayName}</h1>
                  <CelebrityBadge tier={user.celebrityTier as any} size={22} />
               </div>
               <p className="text-indigo-400 text-sm font-black uppercase tracking-[0.2em]">@{user.username}</p>
            </div>
            
            <p className="text-gray-400 text-xs font-bold leading-relaxed max-w-sm mx-auto">{user.bio}</p>

            <div className="flex justify-center space-x-6 space-x-reverse border-y border-white/5 py-4 my-6">
               <div className="text-center">
                  <span className="block text-lg font-black text-white">{user.followers.toLocaleString()}</span>
                  <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">متابع</span>
               </div>
               <div className="text-center">
                  <span className="block text-lg font-black text-white">{user.following.toLocaleString()}</span>
                  <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">يتبع</span>
               </div>
               <div className="text-center">
                  <span className="block text-lg font-black text-white">{user.likes.toLocaleString()}</span>
                  <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">إعجاب</span>
               </div>
            </div>

            <div className="flex space-x-3 space-x-reverse">
              <button onClick={() => setIsEditing(true)} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs text-white hover:bg-white/10 transition-all">
                تعديل الملف الشخصي
              </button>
              <button className="flex-1 py-4 bg-indigo-600 rounded-2xl font-black text-xs text-white shadow-lg active:scale-95 transition-all">
                مشاركة الحساب
              </button>
            </div>
         </div>

         {/* Content Tabs */}
         <div className="space-y-6">
            <div className="flex border-b border-white/10">
               <button onClick={() => setActiveTab('posts')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'posts' ? 'text-pink-500' : 'text-gray-500 hover:text-white'}`}>
                 المنشورات السيادية
                 {activeTab === 'posts' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 animate-slide-up"></div>}
               </button>
               <button onClick={() => setActiveTab('assets')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'assets' ? 'text-indigo-400' : 'text-gray-500 hover:text-white'}`}>
                 الأصول الرقمية
                 {activeTab === 'assets' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 animate-slide-up"></div>}
               </button>
            </div>

            <div className="space-y-6 animate-fade-in">
               {activeTab === 'posts' ? (
                  userPosts.map(post => <PostCard key={post.id} item={post} />)
               ) : (
                  <div className="py-20 text-center text-gray-500 text-[10px] font-black uppercase tracking-widest">لا توجد أصول مرتبطة حالياً</div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;
