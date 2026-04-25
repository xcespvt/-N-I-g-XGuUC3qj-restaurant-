"use client"

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Trash2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from "@/context/useAppStore";
import { usePut, useGet } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Banner {
  id: string;
  url: string;
  name: string;
}

export default function RestaurantBannersPage() {
  const { selectedBranch } = useAppStore();
  const router = useRouter();
  const { toast } = useToast();

  const [banners, setBanners] = useState<Banner[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing profile data
  const { data: profileResponse, isLoading } = useGet<any>(
    ['profile', selectedBranch],
    `/api/branches/${selectedBranch}/profile`,
    undefined,
    { enabled: !!selectedBranch }
  );

  const { mutate: updateProfile, isPending } = usePut(`/api/branches/${selectedBranch}/profile`);

  useEffect(() => {
    if (profileResponse?.data?.banners) {
      setBanners(profileResponse.data.banners);
    }
  }, [profileResponse]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (banners.length >= 6) {
      setError("Maximum of 6 banners allowed.");
      return;
    }

    const file = files[0];
    
    // Check file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError("File size exceeds 50MB limit.");
      return;
    }

    const url = URL.createObjectURL(file);
    
    const newBanner: Banner = {
      id: Date.now().toString(),
      url,
      name: ''
    };

    const updatedBanners = [...banners, newBanner];
    setBanners(updatedBanners);
    handleSync(updatedBanners);
  };

  const handleNameChange = (id: string, newName: string) => {
    const updatedBanners = banners.map(b => b.id === id ? { ...b, name: newName } : b);
    setBanners(updatedBanners);
  };

  const handleDelete = (id: string) => {
    const updatedBanners = banners.filter(b => b.id !== id);
    setBanners(updatedBanners);
    handleSync(updatedBanners);
  };

  const handleSync = (updatedBanners: Banner[]) => {
    updateProfile(
      { banners: updatedBanners },
      {
        onSuccess: () => {
          toast({
            title: "Banners Updated",
            description: "Your restaurant banners have been synced successfully.",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "Failed to update banners",
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
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="space-y-4">
          {[1, 2].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
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
          <h1 className="text-[18px] font-semibold text-slate-900">Upload Banners</h1>
        </div>
        <button 
          type="button"
          onClick={() => handleSync(banners)} 
          disabled={isPending}
          className="text-[#2563EB] font-bold text-[15px] px-2 active:opacity-70 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save'}
        </button>
      </header>

      <div className="p-4 space-y-6 w-full max-w-none">
        {/* Guidelines Card */}
        <div className="bg-white rounded-[22px] p-6 shadow-sm border border-slate-100">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <ImageIcon size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Banner Guidelines</h2>
              <p className="text-[14px] text-slate-500 font-medium mt-1">Upload high-quality banners to showcase your restaurant.</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="text-[14px] font-medium text-slate-600">Resolution: <span className="text-slate-900 font-bold">1000 × 1500 px</span></span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="text-[14px] font-medium text-slate-600">Maximum file size: <span className="text-slate-900 font-bold">50 MB</span></span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="text-[14px] font-medium text-slate-600">Maximum 6 banners allowed (<span className="text-slate-900 font-bold">{banners.length}/6</span> uploaded)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="text-[14px] font-medium text-slate-600">Formats: <span className="text-slate-900 font-bold">JPG, PNG, WebP</span></span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-600 text-[14px] font-bold animate-in zoom-in-95 duration-200">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <label className={`w-full h-[140px] border-2 border-dashed rounded-[22px] flex flex-col items-center justify-center gap-3 transition-all ${banners.length >= 6 ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60' : 'border-blue-200 bg-blue-50/50 hover:bg-blue-50 cursor-pointer text-blue-600 hover:scale-[1.01]'}`}>
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Upload size={24} />
            </div>
            <span className="text-[15px] font-bold tracking-tight">Tap to upload banner ({banners.length}/6)</span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={banners.length >= 6}
            />
          </label>
        </div>

        {/* List of Uploaded Banners */}
        {banners.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-base font-black text-slate-900 tracking-tight">Uploaded Banners</h3>
              <span className="text-[12px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{banners.length} of 6</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map((banner) => (
                <div key={banner.id} className="bg-white rounded-[24px] p-4 shadow-sm border border-slate-100 flex gap-5 group transition-all hover:shadow-md">
                  <div className="w-[100px] h-[140px] rounded-[18px] bg-slate-100 overflow-hidden shrink-0 border border-slate-200 shadow-sm">
                    <img src={banner.url} alt="Banner preview" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-2 min-w-0">
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Banner Name / Label</label>
                      <input 
                        type="text" 
                        value={banner.name}
                        onChange={(e) => handleNameChange(banner.id, e.target.value)}
                        placeholder="e.g. Weekend Flash Sale"
                        className="w-full h-[48px] px-4 bg-slate-50 border border-slate-200 rounded-[16px] text-[15px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all"
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleDelete(banner.id)}
                      className="self-end flex items-center gap-2 text-[14px] font-bold text-rose-500 active:scale-95 transition-all px-4 py-2 rounded-xl hover:bg-rose-50"
                    >
                      <Trash2 size={16} /> 
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {banners.length === 0 && !isLoading && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-6">
              <ImageIcon size={48} className="text-slate-300" />
            </div>
            <p className="text-lg font-bold text-slate-500">No banners uploaded yet</p>
            <p className="text-[14px] text-slate-400 mt-2 text-center max-w-xs">Upload up to 6 high-quality banners to make your restaurant stand out.</p>
          </div>
        )}
      </div>

      {/* Save Button for mobile */}
      <div className="fixed bottom-[72px] lg:bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 z-40 w-full flex justify-center">
        <button 
          type="button"
          onClick={() => handleSync(banners)} 
          disabled={isPending || banners.length === 0}
          className="w-full max-w-md h-[56px] bg-[#2563EB] text-white rounded-[18px] font-bold text-[16px] active:scale-[0.98] transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
        >
          {isPending ? 'Syncing Banners...' : 'Save All Banners'}
        </button>
      </div>
    </div>
  );
}
