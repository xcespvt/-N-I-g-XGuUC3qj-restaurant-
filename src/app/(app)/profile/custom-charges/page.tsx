"use client"

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2,  CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from "@/context/useAppStore";
import { usePut, useGet } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Charge {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: string;
  isActive: boolean;
}

export default function CustomChargesPage() {
  const { selectedBranch } = useAppStore();
  const router = useRouter();
  const { toast } = useToast();

  const [charges, setCharges] = useState<Charge[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch existing profile data
  const { data: profileResponse, isLoading } = useGet<any>(
    ['profile', selectedBranch],
    `/api/branches/${selectedBranch}/profile`,
    undefined,
    { enabled: !!selectedBranch }
  );

  const { mutate: updateProfile, isPending } = usePut(`/api/branches/${selectedBranch}/profile`);

  useEffect(() => {
    if (profileResponse?.data?.customCharges) {
      setCharges(profileResponse.data.customCharges);
    }
  }, [profileResponse]);

  const handleAddCharge = () => {
    setCharges([...charges, { id: Date.now().toString(), name: '', type: 'fixed', value: '', isActive: true }]);
  };

  const handleRemoveCharge = (id: string) => {
    const updatedCharges = charges.filter(c => c.id !== id);
    setCharges(updatedCharges);
  };

  const handleUpdateCharge = (id: string, field: keyof Charge, value: any) => {
    setCharges(charges.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleSave = () => {
    // Basic validation
    const invalid = charges.some(c => !c.name.trim() || !c.value);
    if (invalid) {
      toast({
        title: "Validation Error",
        description: "Please provide a name and value for all charges.",
        variant: "destructive"
      });
      return;
    }

    updateProfile(
      { customCharges: charges },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2500);
          toast({
            title: "Charges Updated",
            description: "Custom charges have been synced successfully.",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "Failed to update charges",
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
        <Skeleton className="h-20 w-full rounded-2xl" />
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
          <h1 className="text-[18px] font-semibold text-slate-900">Custom Charges</h1>
        </div>
        <button 
          type="button"
          onClick={handleSave} 
          disabled={isPending}
          className="text-[#2563EB] font-bold text-[15px] px-2 active:opacity-70 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save'}
        </button>
      </header>

      <div className="p-4 space-y-6 w-full max-w-none">
        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-[22px] p-5 flex gap-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
            <AlertCircle size={20} />
          </div>
          <p className="text-[14px] text-blue-800 font-bold leading-relaxed">
            These charges will be applied automatically to all offline orders (Dine-in & Takeaway).
          </p>
        </div>

        {/* Charges List */}
        <div className="grid grid-cols-1 gap-4">
          {charges.map((charge, index) => (
            <div key={charge.id} className="bg-white rounded-[24px] p-5 border border-slate-200 shadow-sm transition-all hover:shadow-md animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-5 px-1">
                <h3 className="text-[15px] font-black text-slate-900 uppercase tracking-wider">Charge #{index + 1}</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">{charge.isActive ? 'Active' : 'Hidden'}</span>
                    <button 
                      type="button"
                      onClick={() => handleUpdateCharge(charge.id, 'isActive', !charge.isActive)}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${charge.isActive ? 'bg-[#2563EB]' : 'bg-slate-200'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${charge.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleRemoveCharge(charge.id)} 
                    className="w-10 h-10 flex items-center justify-center text-rose-500 bg-rose-50 rounded-full active:scale-90 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">Charge Name</label>
                  <input 
                    type="text" 
                    value={charge.name}
                    onChange={(e) => handleUpdateCharge(charge.id, 'name', e.target.value)}
                    placeholder="e.g. Packaging, Service Charge"
                    className="w-full h-[56px] px-5 bg-slate-50 border border-slate-200 rounded-[18px] text-[16px] font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                    <div className="relative">
                      <select 
                        value={charge.type}
                        onChange={(e) => handleUpdateCharge(charge.id, 'type', e.target.value)}
                        className="w-full h-[56px] px-5 bg-slate-50 border border-slate-200 rounded-[18px] text-[15px] font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none"
                      >
                        <option value="fixed">Fixed (₹)</option>
                        <option value="percentage">Percent (%)</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Plus size={16} className="rotate-45" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">Value</label>
                    <input 
                      type="number" 
                      value={charge.value}
                      onChange={(e) => handleUpdateCharge(charge.id, 'value', e.target.value)}
                      placeholder="0.00"
                      className="w-full h-[56px] px-5 bg-slate-50 border border-slate-200 rounded-[18px] text-[18px] font-black text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          type="button"
          onClick={handleAddCharge}
          className="w-full h-[64px] rounded-[24px] border-2 border-dashed border-slate-300 bg-white text-slate-600 font-black text-[16px] flex items-center justify-center gap-3 hover:border-blue-300 hover:bg-blue-50/30 active:scale-[0.99] transition-all group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
            <Plus size={20} />
          </div>
          Add New Charge
        </button>

        {charges.length === 0 && !isLoading && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
           
            <p className="text-lg font-bold text-slate-500">No custom charges added</p>
            <p className="text-[14px] text-slate-400 mt-2 text-center max-w-xs">Define extra fees like packaging or service charges for your offline orders.</p>
          </div>
        )}
      </div>

      {/* Save Button for mobile */}
      <div className="fixed bottom-[72px] lg:bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 z-40 w-full flex justify-center">
        <button 
          type="button"
          onClick={handleSave} 
          disabled={isPending || charges.length === 0}
          className="w-full h-[60px] bg-[#2563EB] text-white rounded-[20px] font-black text-[18px] flex items-center justify-center active:scale-[0.98] transition-all shadow-xl shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
        >
          {isPending ? (
            <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
             
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Success Toast Overlay */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-[20px] shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 z-[200]">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
             <CheckCircle2 size={20} className="text-white" />
          </div>
          <span className="text-[15px] font-bold tracking-tight">Charges updated successfully</span>
        </div>
      )}
    </div>
  );
}
