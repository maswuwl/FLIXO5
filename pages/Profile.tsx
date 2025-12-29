
import React, { useState, useRef } from 'react';
import { ShieldCheck, Camera, ChevronLeft, Save, Globe, Plus, Trash2, Key, Zap, DollarSign, Edit3, User, Brain, ShieldAlert, Link as LinkIcon } from 'lucide-react';
import { MOCK_USERS } from '../constants';
import CelebrityBadge from '../components/CelebrityBadge';
import ProfileGuard from '../components/ProfileGuard';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { ExternalAsset } from '../types';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(() => authService.getCurrentUser() || MOCK_USERS[0]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [newAssetUrl, setNewAssetUrl] = useState('');
  const [newAssetLabel, setNewAssetLabel] = useState('');
  const [newAssetType, setNewAssetType] = useState<ExternalAsset['type']>('website');

  const isAdmin = user.celebrityTier === 0;

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
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
      <div className="relative h-64 bg-gradient-to-b from-indigo-900/40 to-black shrink-0">
        <div className="absolute top-12 right-6 z-20">
          <button onClick={() => navigate('/')} className="p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white active:scale-90 transition-transform">
            <ChevronLeft size={24} />
          </button>
        </div>
        
        <div className="absolute bottom-0 left-1/2 translate-x-1/2 translate-y-1/2 flex flex-col items-center">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <ProfileGuard isActive={true} size="lg" isSovereign={isAdmin}>
              <div className={`w-36 h-36 rounded-full p-1.5 transition-all duration-500 ${isAdmin ? 'bg-yellow-500 shadow-2xl shadow-yellow-500/20' : 'flixo-gradient'} ${isEditing ? 'ring-4 ring-indigo-500 ring-offset-4 ring-offset-black scale-105' : ''}`}>
                <img src={user.avatar} className="w-full h-full rounded-full border-4 border-black object-cover" alt="Profile" />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center backdrop-blur-[2px] border-4 border-dashed border-white/30 animate-pulse">
                    <Camera size={32} className="text-white mb-1" />
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">تغيير الصورة</span>
                  </div>
                )}
              </div>
            </ProfileGuard>
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

             {/* أصول السيادة الرقمية */}
             <div className="grid grid-cols-1 gap-4">
               {user.socialLinks?.linkedAssets && user.socialLinks.linkedAssets.length > 0 ? (
                 user.socialLinks.linkedAssets.map(asset => (
                   <div key={asset.id} className="p-4 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-between group">
                     <div className="flex items-center space-x-3 space-x-reverse">
                       <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                         {asset.type === 'adsense' ? <DollarSign size={18} /> : <Globe size={18} />}
                       </div>
                       <div className="text-right">
                         <span className="block text-xs font-black text-white">{asset.label}</span>
                         <span className="text-[8px] text-gray-500 font-mono truncate max-w-[150px] block">{asset.url}</span>
                       </div>
                     </div>
                     <div className="flex items-center space-x-2 space-x-reverse">
                        {asset.publishingPermitted && <Zap size={14} className="text-yellow-500" title="نشر مفعل" />}
                        {asset.incomeTrackingEnabled && <DollarSign size={14} className="text-green-500" title="تتبع الدخل مفعل" />}
                        <a href={asset.url} target="_blank" className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white"><LinkIcon size={14} /></a>
                     </div>
                   </div>
                 ))
               ) : (
                 <p className="text-[10px] text-gray-600 font-bold italic">لا توجد أصول رقمية مرتبطة حالياً.</p>
               )}
             </div>
             
             <button 
               onClick={() => setIsEditing(true)}
               className="w-full py-5 bg-white/5 border border-white/10 rounded-[30px] font-black text-xs text-white flex items-center justify-center space-x-3 space-x-reverse hover:bg-white/10 transition-all"
             >
               <Edit3 size={18} className="text-indigo-400" />
               <span>إدارة المواقع والربح الرقمي</span>
             </button>
          </div>
        ) : (
          <div className="space-y-8 animate-slide-up">
             {/* مركز الربط السيادي */}
             <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 space-y-6 shadow-2xl">
                <h3 className="text-xl font-black italic text-indigo-400 flex items-center">
                  <Key size={20} className="ml-2" /> 
                  مركز الربط والسيادة الرقمية
                </h3>
                
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                   <p className="text-[9px] text-gray-400 font-bold leading-relaxed">
                     اربط موقعك الشخصي، مدونتك، أو حساب AdSense بنواة فليكسو. سيمكنك هذا من النشر التلقائي ومراقبة الدخل العالمي من مكان واحد.
                   </p>
                </div>

                {/* إضافة أصل جديد */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                   <div className="grid grid-cols-2 gap-4">
                     <input type="text" placeholder="اسم الأصل (مثلاً: متجري)" className="bg-black/40 border border-white/10 rounded-2xl py-3 px-4 text-xs" value={newAssetLabel} onChange={e => setNewAssetLabel(e.target.value)} />
                     <input type="text" placeholder="الرابط (URL)" className="bg-black/40 border border-white/10 rounded-2xl py-3 px-4 text-xs font-mono" value={newAssetUrl} onChange={e => setNewAssetUrl(e.target.value)} />
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
                          <div className="flex flex-col">
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
                   <label className="text-[10px] font-black text-gray-500 uppercase mr-4 tracking-widest flex items-center"><User size={12} className="ml-2" /> الاسم المعروض</label>
                   <input type="text" value={user.displayName} onChange={(e) => { setUser({...user, displayName: e.target.value}); setHasChanges(true); }} className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-500 uppercase mr-4 tracking-widest flex items-center"><Brain size={12} className="ml-2" /> السيرة الذاتية (Bio)</label>
                   <textarea value={user.bio} onChange={(e) => { setUser({...user, bio: e.target.value}); setHasChanges(true); }} className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none min-h-[100px]" />
                </div>
             </div>

             <div className="flex space-x-4 space-x-reverse">
                <button 
                  onClick={handleSave}
                  disabled={isSaving || !hasChanges}
                  className="flex-1 py-6 flixo-gradient rounded-[30px] font-black text-white text-lg shadow-2xl active:scale-95 transition-all flex items-center justify-center space-x-3 space-x-reverse disabled:opacity-50"
                >
                  {isSaving ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Save size={20} /> <span>حفظ وتأمين السجلات</span></>}
                </button>
                <button onClick={() => { setIsEditing(false); setUser(authService.getCurrentUser() || user); }} className="px-10 py-6 bg-white/5 border border-white/10 rounded-[30px] font-black text-xs text-gray-500">إلغاء</button>
             </div>
          </div>
        )}

        <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[40px] flex items-start space-x-4 space-x-reverse">
           <ShieldAlert className="text-indigo-500 mt-1 shrink-0" size={20} />
           <div>
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
