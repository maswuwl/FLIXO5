
import React, { useState, useRef, useMemo } from 'react';
import { ShieldCheck, Camera, ChevronLeft, Save, Globe, Plus, Trash2, Key, Zap, DollarSign, Edit3, User, Brain, ShieldAlert, Link as LinkIcon, Image as ImageIcon, Layout, Grid, FileText, Heart } from 'lucide-react';
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

  const [newAssetUrl, setNewAssetUrl] = useState('');
  const [newAssetLabel, setNewAssetLabel] = useState('');
  const [newAssetType, setNewAssetType] = useState<ExternalAsset['type']>('website');

  const isAdmin = user.celebrityTier === 0;

  // تصفية منشورات المستخدم من الموجز العام
  const userPosts = useMemo(() => {
    return MOCK_FEED.filter(post => post.author.id === user.id);
  }, [user.id]);

  const handleAvatarClick = () => {
    if (isEditing) avatarInputRef.current?.click();
  };

  const handleCoverClick = () => {
    if (isEditing) coverInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({ ...prev, [field]: reader.result as string }));
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAsset = () => {
    if (!newAssetUrl || !newAssetLabel) return;
    const asset: ExternalAsset = {
      id: Date.now().toString(),
      type: newAssetType,
      url: newAssetUrl.startsWith('http') ? newAssetUrl : `https://${newAssetUrl}`,
      label: newAssetLabel,
      isVerified: false,
      publishingPermitted: true,
      incomeTrackingEnabled: newAssetType === 'adsense' || newAssetType === 'store'
    };
    
    const updatedAssets = [...(user.socialLinks?.linkedAssets || []), asset];
    setUser({
      ...user,
      socialLinks: {
        ...(user.socialLinks || { linkedAssets: [] }),
        linkedAssets: updatedAssets
      }
    });
    setNewAssetUrl('');
    setNewAssetLabel('');
    setHasChanges(true);
  };

  const handleRemoveAsset = (id: string) => {
    const updatedAssets = (user.socialLinks?.linkedAssets || []).filter(a => a.id !== id);
    setUser({
      ...user,
      socialLinks: {
        ...(user.socialLinks || { linkedAssets: [] }),
        linkedAssets: updatedAssets
      }
    });
    setHasChanges(true);
  };

  const toggleAssetPermission = (id: string, field: 'publishingPermitted' | 'incomeTrackingEnabled') => {
    const updatedAssets = (user.socialLinks?.linkedAssets || []).map(a => 
      a.id === id ? { ...a, [field]: !a[field] } : a
    );
    setUser({
      ...user,
      socialLinks: {
        ...(user.socialLinks || { linkedAssets: [] }),
        linkedAssets: updatedAssets
      }
    });
    setHasChanges(true);
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

  return (
    <div className="flex flex-col h-full bg-black overflow-y-auto pb-48 no-scrollbar" dir="rtl">
      {/* Cover Section with 360 Panorama */}
      <div className="relative h-72 shrink-0 group">
        <SovereignPanorama imageUrl={user.cover} isEditing={isEditing} />
        
        <div className="absolute top-12 right-6 z-20">
          <button onClick={() => navigate('/')} className="p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white active:scale-90 transition-transform">
            <ChevronLeft size={24} />
          </button>
        </div>

        {isEditing && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <button 
              onClick={handleCoverClick}
              className="px-6 py-3 bg-indigo-600/80 backdrop-blur-xl rounded-2xl text-white font-black text-xs flex items-center space-x-3 space-x-reverse shadow-2xl border border-white/20 animate-pulse"
            >
              <ImageIcon size={18} />
              <span>تعديل الأفق البانورامي</span>
            </button>
            <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />
          </div>
        )}
        
        <div className="absolute bottom-0 left-1/2 translate-x-1/2 translate-y-1/2 flex flex-col items-center z-30">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <ProfileGuard isActive={true} size="lg" isSovereign={isAdmin}>
              <div className={`w-36 h-36 rounded-full p-1.5 transition-all duration-500 ${isAdmin ? 'bg-yellow-500 shadow-2xl shadow-yellow-500/20' : 'flixo-gradient'} ${isEditing ? 'ring-4 ring-indigo-500 ring-offset-4 ring-offset-black scale-105' : ''}`}>
                <img src={user.avatar} className="w-full h-full rounded-full border-4 border-black object-cover" alt="Profile" />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center backdrop-blur-[2px] border-4 border-dashed border-white/30">
                    <Camera size={32} className="text-white mb-1" />
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">تغيير الصورة</span>
                  </div>
                )}
              </div>
            </ProfileGuard>
            <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
          </div>
        </div>
      </div>

      <div className="mt-24 px-4 sm:px-8 space-y-8">
        {!isEditing ? (
          <div className="animate-fade-in space-y-8">
             <div className="text-center space-y-4">
                <div className="space-y-1">
                   <div className="flex items-center justify-center space-x-2 space-x-reverse">
                      <h1 className="text-3xl font-black tracking-tight text-white">{user.displayName}</h1>
                      <CelebrityBadge tier={user.celebrityTier as any} size={22} />
                   </div>
                   <p className="text-indigo-400 text-sm font-black uppercase tracking-[0.2em]">@{user.username}</p>
                </div>
                
                <p className="text-gray-400 text-xs font-bold leading-relaxed max-w-sm mx-auto">
                  {user.bio}
                </p>

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
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex-1 py-4 bg-indigo-600 rounded-2xl font-black text-xs text-white shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
                  >
                    تعديل الملف الشخصي
                  </button>
                  <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs text-white hover:bg-white/10 transition-all">
                    مشاركة الحساب
                  </button>
                </div>
             </div>

             {/* تبويبات عرض المحتوى */}
             <div className="space-y-6">
                <div className="flex border-b border-white/10">
                   <button 
                     onClick={() => setActiveTab('posts')}
                     className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'posts' ? 'text-pink-500' : 'text-gray-500 hover:text-white'}`}
                   >
                     المنشورات السيادية
                     {activeTab === 'posts' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 animate-slide-up"></div>}
                   </button>
                   <button 
                     onClick={() => setActiveTab('assets')}
                     className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'assets' ? 'text-indigo-400' : 'text-gray-500 hover:text-white'}`}
                   >
                     الأصول الرقمية
                     {activeTab === 'assets' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 animate-slide-up"></div>}
                   </button>
                </div>

                {activeTab === 'posts' ? (
                   <div className="space-y-6 animate-fade-in">
                      {userPosts.length > 0 ? (
                        userPosts.map(post => (
                          <PostCard key={post.id} item={post} />
                        ))
                      ) : (
                        <div className="py-20 text-center space-y-4">
                           <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-700">
                              <FileText size={32} />
                           </div>
                           <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">لا توجد منشورات حتى الآن</p>
                        </div>
                      )}
                   </div>
                ) : (
                   <div className="space-y-4 animate-fade-in">
                      {user.socialLinks?.linkedAssets && user.socialLinks.linkedAssets.length > 0 ? (
                        user.socialLinks.linkedAssets.map(asset => (
                          <div key={asset.id} className="p-5 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between group hover:bg-white/10 transition-all">
                            <div className="flex items-center space-x-4 space-x-reverse">
                              <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
                                {asset.type === 'adsense' ? <DollarSign size={20} /> : <Globe size={20} />}
                              </div>
                              <div className="text-right">
                                <span className="block text-sm font-black text-white">{asset.label}</span>
                                <span className="text-[9px] text-gray-500 font-mono truncate max-w-[150px] block">{asset.url}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                               {asset.publishingPermitted && <Zap size={14} className="text-yellow-500 animate-pulse" />}
                               <a href={asset.url} target="_blank" className="p-3 bg-black/40 rounded-xl text-gray-400 hover:text-white"><LinkIcon size={16} /></a>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-20 text-center space-y-4">
                           <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-700">
                              <Globe size={32} />
                           </div>
                           <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">لا توجد أصول مرتبطة</p>
                        </div>
                      )}
                   </div>
                )}
             </div>
          </div>
        ) : (
          <div className="space-y-8 animate-slide-up pb-32">
             {/* مركز الربط السيادي */}
             <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 space-y-6 shadow-2xl">
                <h3 className="text-xl font-black italic text-indigo-400 flex items-center">
                  <Key size={20} className="ml-2" /> 
                  مركز الربط والسيادة الرقمية
                </h3>
                
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                   <p className="text-[9px] text-gray-400 font-bold leading-relaxed text-right">
                     اربط موقعك الشخصي، مدونتك، أو حساب AdSense بنواة فليكسو. سيمكنك هذا من النشر التلقائي ومراقبة الدخل العالمي من مكان واحد.
                   </p>
                </div>

                {/* إضافة أصل جديد */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                   <div className="grid grid-cols-2 gap-4">
                     <input type="text" placeholder="اسم الأصل (مثلاً: متجري)" className="bg-black/40 border border-white/10 rounded-2xl py-3 px-4 text-xs text-right outline-none focus:border-indigo-500" value={newAssetLabel} onChange={e => setNewAssetLabel(e.target.value)} />
                     <input type="text" placeholder="الرابط (URL)" className="bg-black/40 border border-white/10 rounded-2xl py-3 px-4 text-xs font-mono text-left outline-none focus:border-indigo-500" value={newAssetUrl} onChange={e => setNewAssetUrl(e.target.value)} />
                   </div>
                   <div className="flex space-x-2 space-x-reverse">
                     {(['website', 'store', 'adsense', 'youtube'] as const).map(type => (
                       <button key={type} onClick={() => setNewAssetType(type)} className={`flex-1 py-2 rounded-xl text-[8px] font-black uppercase border ${newAssetType === type ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-gray-500'}`}>{type}</button>
                     ))}
                   </div>
                   <button onClick={handleAddAsset} type="button" className="w-full py-3 bg-indigo-600 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center space-x-2 space-x-reverse active:scale-95">
                      <Plus size={14} />
                      <span>ربط الأصل الرقمي بنواة فليكسو</span>
                   </button>
                </div>

                {/* قائمة الأصول */}
                <div className="space-y-4">
                  {user.socialLinks?.linkedAssets?.map(asset => (
                    <div key={asset.id} className="p-5 bg-black/40 border border-white/5 rounded-3xl space-y-4">
                       <div className="flex justify-between items-center">
                          <div className="flex flex-col text-right">
                             <span className="text-xs font-black text-white">{asset.label}</span>
                             <span className="text-[8px] text-gray-500 uppercase">{asset.type}</span>
                          </div>
                          <button onClick={() => handleRemoveAsset(asset.id)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={16} /></button>
                       </div>
                       
                       <div className="flex items-center justify-between border-t border-white/5 pt-4">
                          <div className="flex items-center space-x-4 space-x-reverse">
                             <div className="flex items-center space-x-1.5 space-x-reverse">
                                <button onClick={() => toggleAssetPermission(asset.id, 'publishingPermitted')} className={`w-10 h-5 rounded-full relative transition-colors ${asset.publishingPermitted ? 'bg-yellow-500' : 'bg-gray-700'}`}>
                                   <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${asset.publishingPermitted ? 'right-6' : 'right-1'}`}></div>
                                </button>
                                <span className="text-[8px] font-black text-gray-500">سماح بالنشر</span>
                             </div>
                             <div className="flex items-center space-x-1.5 space-x-reverse">
                                <button onClick={() => toggleAssetPermission(asset.id, 'incomeTrackingEnabled')} className={`w-10 h-5 rounded-full relative transition-colors ${asset.incomeTrackingEnabled ? 'bg-green-500' : 'bg-gray-700'}`}>
                                   <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${asset.incomeTrackingEnabled ? 'right-6' : 'right-1'}`}></div>
                                </button>
                                <span className="text-[8px] font-black text-gray-500">تتبع الدخل</span>
                             </div>
                          </div>
                          <span className={`text-[7px] font-black uppercase ${asset.isVerified ? 'text-green-500' : 'text-yellow-500'}`}>
                            {asset.isVerified ? 'تم التحقق' : 'قيد المراجعة'}
                          </span>
                       </div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-500 uppercase mr-4 tracking-widest flex items-center justify-end"><User size={12} className="ml-2" /> الاسم المعروض</label>
                   <input type="text" value={user.displayName} onChange={(e) => { setUser({...user, displayName: e.target.value}); setHasChanges(true); }} className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white text-right outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-500 uppercase mr-4 tracking-widest flex items-center justify-end"><Brain size={12} className="ml-2" /> السيرة الذاتية (Bio)</label>
                   <textarea value={user.bio} onChange={(e) => { setUser({...user, bio: e.target.value}); setHasChanges(true); }} className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white text-right outline-none focus:border-indigo-500 min-h-[100px]" />
                </div>
             </div>

             <div className="flex space-x-4 space-x-reverse sticky bottom-4 z-50">
                <button 
                  onClick={handleSave}
                  disabled={isSaving || !hasChanges}
                  className="flex-1 py-6 flixo-gradient rounded-[30px] font-black text-white text-lg shadow-2xl active:scale-95 transition-all flex items-center justify-center space-x-3 space-x-reverse disabled:opacity-50"
                >
                  {isSaving ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Save size={20} /> <span>حفظ وتأمين السجلات</span></>}
                </button>
                <button onClick={() => { setIsEditing(false); setUser(authService.getCurrentUser() || user); }} className="px-10 py-6 bg-white/10 border border-white/20 rounded-[30px] font-black text-xs text-gray-400">إلغاء</button>
             </div>
          </div>
        )}

        <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[40px] flex items-start space-x-4 space-x-reverse">
           <ShieldAlert className="text-indigo-500 mt-1 shrink-0" size={20} />
           <div className="text-right">
              <h4 className="text-sm font-black text-indigo-400 mb-1">تشفير الأصول والأرباح</h4>
              <p className="text-[10px] text-gray-500 font-bold leading-relaxed">
                جميع مواقعك وأصولك الرقمية مشفرة برمجياً بمعايير "خالد المنتصر" الأمنية. ربط الأرباح يتم عبر قنوات آمنة لا يمكن اختراقها، مما يضمن لك مراقبة استثماراتك بخصوصية سيادية كاملة.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
