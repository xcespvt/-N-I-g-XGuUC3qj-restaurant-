"use client"

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Upload, MoreVertical, FileText, Image as ImageIcon, X, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from "@/context/useAppStore";
import { usePut, useGet } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function DigitalMenuPage() {
  const { selectedBranch } = useAppStore();
  const router = useRouter();
  const { toast } = useToast();

  const [menus, setMenus] = useState<any[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newMenuName, setNewMenuName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch existing profile data
  const { data: profileResponse, isLoading } = useGet<any>(
    ['profile', selectedBranch],
    `/api/branches/${selectedBranch}/profile`,
    undefined,
    { enabled: !!selectedBranch }
  );

  const { mutate: updateProfile, isPending } = usePut(`/api/branches/${selectedBranch}/profile`);

  useEffect(() => {
    if (profileResponse?.data?.digitalMenus) {
      setMenus(profileResponse.data.digitalMenus);
    }
  }, [profileResponse]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = (type: 'image' | 'pdf') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : '.pdf';
      fileInputRef.current.click();
    }
  };

  const handleUpload = () => {
    if (newMenuName.trim() && selectedFile) {
      const isPdf = selectedFile.type === 'application/pdf';
      // In a real app, you would upload the file to a CDN first.
      // For now, we'll simulate the URL.
      const url = URL.createObjectURL(selectedFile);
      
      const newMenu = { 
        id: Date.now().toString(), 
        name: newMenuName, 
        type: isPdf ? 'pdf' : 'image', 
        url 
      };

      const updatedMenus = [...menus, newMenu];
      setMenus(updatedMenus);
      
      setShowUploadModal(false);
      setNewMenuName('');
      setSelectedFile(null);

      // Sync with backend
      handleSync(updatedMenus);
    }
  };

  const handleDelete = (id: string | number) => {
    const updatedMenus = menus.filter(m => m.id !== id);
    setMenus(updatedMenus);
    setActiveMenuId(null);
    handleSync(updatedMenus);
  };

  const handleSync = (updatedMenus: any[]) => {
    updateProfile(
      { digitalMenus: updatedMenus },
      {
        onSuccess: () => {
          toast({
            title: "Menu Updated",
            description: "Your digital menus have been synced successfully.",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "Failed to update menus",
            variant: "destructive",
          });
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans animate-in fade-in duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 h-[56px] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => router.back()} 
            className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:scale-95 transition-transform"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[18px] font-semibold text-slate-900">Digital Menu</h1>
        </div>
        <button 
          type="button"
          onClick={() => setShowUploadModal(true)} 
          className="text-[#2563EB] font-bold text-[15px] px-2 active:opacity-70"
        >
          Add New
        </button>
      </header>

      <div className="p-4 space-y-4 w-full">
        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-100 rounded-[20px] p-5 mb-6 flex gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-blue-900 mb-1">Menu Guidelines</h4>
            <p className="text-[13px] text-blue-800/80 leading-relaxed font-medium">
              You can upload high-quality images (JPG, PNG) or PDF documents. For best readability, we recommend files under 10MB.
            </p>
          </div>
        </div>

        {/* Menu Grid/List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menus.map(menu => (
            <div key={menu.id} className="bg-white rounded-[22px] p-4 border border-[#E5E7EB] shadow-sm flex items-center gap-4 relative group transition-all hover:shadow-md">
              <div className="w-16 h-16 rounded-[16px] bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center relative">
                {menu.type === 'image' ? (
                  <img src={menu.url} alt={menu.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center">
                    <FileText size={24} className="text-red-500" />
                    <span className="text-[9px] font-bold text-red-500 mt-0.5">PDF</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[16px] font-bold text-slate-900 truncate pr-6">{menu.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${menu.type === 'image' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {menu.type}
                  </span>
                </div>
              </div>
              
              <button 
                type="button"
                onClick={() => setActiveMenuId(activeMenuId === menu.id ? null : menu.id)}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-50 active:scale-90 transition-all rounded-full"
              >
                <MoreVertical size={20} />
              </button>

              {activeMenuId === menu.id && (
                <div className="absolute right-4 top-14 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <button type="button" className="w-full px-4 py-3 text-left text-[14px] font-bold text-slate-700 hover:bg-slate-50 border-b border-slate-50 transition-colors">Edit Name</button>
                  <button type="button" className="w-full px-4 py-3 text-left text-[14px] font-bold text-slate-700 hover:bg-slate-50 border-b border-slate-50 transition-colors">Replace File</button>
                  <button 
                    type="button"
                    onClick={() => handleDelete(menu.id)} 
                    className="w-full px-4 py-3 text-left text-[14px] font-bold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete Menu
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add New Empty State */}
          {menus.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <ImageIcon size={40} />
              </div>
              <p className="text-[15px] font-bold text-slate-500">No digital menus uploaded yet</p>
              <p className="text-[13px] text-slate-400 mt-1">Upload your menus to share them with customers</p>
            </div>
          )}
        </div>

        <button 
          type="button"
          onClick={() => setShowUploadModal(true)}
          className="w-full h-[64px] bg-white border-2 border-dashed border-slate-200 text-[#2563EB] rounded-[22px] font-bold text-[16px] flex items-center justify-center gap-3 hover:border-[#2563EB] hover:bg-blue-50/30 transition-all active:scale-[0.99] mt-6"
        >
          <Plus size={22} />
          Upload New Menu
        </button>
      </div>

      {/* Mobile-Friendly Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex flex-col justify-end backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-t-[32px] p-6 pb-12 animate-in slide-in-from-bottom-full duration-300 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h2 className="text-[20px] font-black text-slate-900 tracking-tight">Upload Menu</h2>
                <p className="text-[13px] font-medium text-slate-500">Add a new menu file to your restaurant</p>
              </div>
              <button 
                type="button"
                onClick={() => { setShowUploadModal(false); setSelectedFile(null); setNewMenuName(''); }} 
                className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-full active:scale-90 transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[14px] font-bold text-slate-700 ml-1">Menu Display Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Breakfast Specialties"
                  value={newMenuName}
                  onChange={(e) => setNewMenuName(e.target.value)}
                  className="w-full h-[56px] px-5 bg-slate-50 border border-slate-200 rounded-[18px] text-[16px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all"
                />
              </div>

              <div className="pt-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  className="hidden" 
                />
                
                {!selectedFile ? (
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => handleUploadClick('image')} 
                      className="h-32 rounded-[22px] border-2 border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center gap-3 text-slate-600 hover:border-[#2563EB] hover:bg-blue-50/50 hover:text-[#2563EB] transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <ImageIcon size={24} />
                      </div>
                      <span className="text-[14px] font-bold">Image File</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleUploadClick('pdf')} 
                      className="h-32 rounded-[22px] border-2 border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center gap-3 text-slate-600 hover:border-[#2563EB] hover:bg-blue-50/50 hover:text-[#2563EB] transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <FileText size={24} />
                      </div>
                      <span className="text-[14px] font-bold">PDF Document</span>
                    </button>
                  </div>
                ) : (
                  <div className="h-28 rounded-[22px] border-2 border-[#2563EB] bg-blue-50/50 flex items-center justify-between px-6 animate-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        {selectedFile.type === 'application/pdf' ? <FileText className="text-red-500" /> : <ImageIcon className="text-[#2563EB]" />}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[15px] font-bold text-slate-900 block truncate">{selectedFile.name}</span>
                        <span className="text-[11px] font-bold text-[#2563EB] uppercase">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setSelectedFile(null)} 
                      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 bg-white rounded-full shadow-sm active:scale-90 transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>

              <button 
                type="button"
                onClick={handleUpload}
                disabled={!newMenuName.trim() || !selectedFile}
                className="w-full h-[60px] bg-[#2563EB] text-[#FFFFFF] rounded-[20px] font-bold text-[18px] flex items-center justify-center active:scale-[0.98] transition-all shadow-xl shadow-blue-200 mt-4 disabled:opacity-50 disabled:shadow-none"
              >
                Confirm & Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Status Bar (Desktop Only - Optional as we sync on upload) */}
      <div className="fixed bottom-[72px] lg:bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 z-40 w-full flex justify-center lg:hidden">
         <p className="text-[13px] font-bold text-slate-400">All changes are automatically synced</p>
      </div>
    </div>
  );
}
