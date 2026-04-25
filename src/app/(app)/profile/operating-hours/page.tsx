"use client"

import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from "@/context/useAppStore";
import { usePut, useGet } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function OperatingHoursPage() {
  const { selectedBranch } = useAppStore();
  const router = useRouter();
  const { toast } = useToast();

  const [hours, setHours] = useState<Record<string, { isOpen: boolean; open: string; close: string }>>(
    DAYS.reduce((acc, day) => ({
      ...acc,
      [day]: { isOpen: true, open: '10:00', close: '23:00' }
    }), {})
  );

  const [autoOnline, setAutoOnline] = useState(false);

  // Fetch existing profile data
  const { data: profileResponse, isLoading } = useGet<any>(
    ['profile', selectedBranch],
    `/api/branches/${selectedBranch}/profile`,
    undefined,
    { enabled: !!selectedBranch }
  );

  const { mutate: updateProfile, isPending } = usePut(`/api/branches/${selectedBranch}/profile`);

  useEffect(() => {
    if (profileResponse?.data?.operatingHours && profileResponse.data.operatingHours.length > 0) {
      const hoursMap: any = {};
      profileResponse.data.operatingHours.forEach((item: any) => {
        hoursMap[item.day] = {
          isOpen: item.open,
          open: item.opening || '10:00',
          close: item.closing || '23:00'
        };
      });
      setHours(prev => ({ ...prev, ...hoursMap }));
    }
    if (profileResponse?.data?.autoOnline !== undefined) {
      setAutoOnline(profileResponse.data.autoOnline);
    }
  }, [profileResponse]);

  const toggleDay = (day: string) => {
    setHours(prev => ({
      ...prev,
      [day]: { ...prev[day], isOpen: !prev[day].isOpen }
    }));
  };

  const updateTime = (day: string, type: 'open' | 'close', time: string) => {
    setHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [type]: time }
    }));
  };

  const handleSaveChanges = () => {
    const formattedHours = DAYS.map(day => ({
      day,
      open: hours[day].isOpen,
      opening: hours[day].open,
      closing: hours[day].close
    }));

    updateProfile(
      { 
        operatingHours: formattedHours,
        autoOnline 
      },
      {
        onSuccess: () => {
          toast({
            title: "Settings Saved",
            description: "Your operating hours have been updated successfully.",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "Failed to update profile",
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
        <div className="space-y-3">
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
          <h1 className="text-[18px] font-semibold text-slate-900">Operating Hours</h1>
        </div>
        <button 
          type="button"
          onClick={handleSaveChanges} 
          disabled={isPending}
          className="text-[#2563EB] font-semibold text-[15px] px-2 active:opacity-70 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save'}
        </button>
      </header>

      <div className="p-4 space-y-4 w-full max-w-none">
        {/* Weekly Schedule Section */}
        <div className="space-y-3 w-full">
          {DAYS.map(day => (
            <div key={day} className="bg-white rounded-[18px] p-4 border border-[#E5E7EB] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[16px] font-semibold text-slate-900">{day}</span>
                <div className="flex items-center gap-3">
                  <span className={`text-[13px] font-medium ${hours[day].isOpen ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {hours[day].isOpen ? 'Open' : 'Closed'}
                  </span>
                  <div 
                    role="button"
                    onClick={() => toggleDay(day)}
                    className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out cursor-pointer ${hours[day].isOpen ? 'bg-[#2563EB]' : 'bg-slate-200'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ease-in-out ${hours[day].isOpen ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>
              
              {hours[day].isOpen ? (
                <div className="mt-4 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase mb-1 block px-1">Opening Time</label>
                    <input 
                      type="time" 
                      value={hours[day].open}
                      onChange={(e) => updateTime(day, 'open', e.target.value)}
                      className="w-full h-[48px] px-3 bg-slate-50 border border-slate-200 rounded-xl text-[15px] font-medium text-slate-900 focus:outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="h-8 mt-5 border-l border-slate-200 hidden sm:block"></div>
                  <div className="flex-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase mb-1 block px-1">Closing Time</label>
                    <input 
                      type="time" 
                      value={hours[day].close}
                      onChange={(e) => updateTime(day, 'close', e.target.value)}
                      className="w-full h-[48px] px-3 bg-slate-50 border border-slate-200 rounded-xl text-[15px] font-medium text-slate-900 focus:outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-4 h-[48px] bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                  <span className="text-[14px] font-medium text-slate-500 italic">Outlet is closed for orders on this day</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Automatic Online Feature */}
        <div className="bg-white rounded-[18px] p-5 border border-[#E5E7EB] shadow-sm mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="space-y-0.5">
              <h3 className="text-[16px] font-bold text-slate-900">Auto Online Mode</h3>
              <p className="text-[13px] text-slate-500 font-medium">
                Sync status with operating hours
              </p>
            </div>
            <div 
              role="button"
              onClick={() => setAutoOnline(!autoOnline)}
              className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out cursor-pointer ${autoOnline ? 'bg-[#2563EB]' : 'bg-slate-200'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ease-in-out ${autoOnline ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </div>
            <p className="text-[13px] text-blue-800 font-medium leading-relaxed">
              When enabled, your restaurant will automatically switch online/offline based on your selected timings. Manual overrides are still possible.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-[72px] lg:bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 z-40 w-full flex justify-center">
        <button 
          type="button"
          onClick={handleSaveChanges} 
          disabled={isPending}
          className="w-full max-w-md h-[56px] bg-[#2563EB] text-white rounded-[16px] font-bold text-[16px] active:scale-[0.98] transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
        >
          {isPending ? 'Saving Schedule...' : 'Save Schedule'}
        </button>
      </div>
    </div>
  );
}
