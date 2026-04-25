"use client"

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Upload, Building2, User, X, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from "@/context/useAppStore";
import { usePut, useGet } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const ChangeAccountFlow = ({ type, currentVal, onCancel }: { type: 'Email' | 'Phone Number', currentVal: string, onCancel: () => void }) => {
  const [step, setStep] = useState(1);
  const [oldVal, setOldVal] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newVal, setNewVal] = useState('');
  const [error, setError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validatePhone = (p: string) => /^\d{10}$/.test(p.replace(/\D/g, ''));

  const handleStep1 = () => {
    if (type === 'Email' && !validateEmail(oldVal)) {
      setError('Invalid email format'); return;
    }
    if (type === 'Phone Number' && !validatePhone(oldVal)) {
      setError('Phone number must be 10 digits'); return;
    }
    if (oldVal !== currentVal) {
      setError(`Does not match registered ${type.toLowerCase()}`); return;
    }
    setError(''); setStep(2);
  };

  const handleOtpChange = (val: string, index: number) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);
    if (val && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleStep2 = () => {
    if (otp.join('').length !== 6) {
      setError('OTP must be 6 digits'); return;
    }
    setError(''); setStep(3);
  };

  const handleStep3 = () => {
    if (type === 'Email' && !validateEmail(newVal)) {
      setError('Invalid email format'); return;
    }
    if (type === 'Phone Number' && !validatePhone(newVal)) {
      setError('Phone number must be 10 digits'); return;
    }
    setError(''); setStep(4);
  };

  return (
    <div className="space-y-4 mt-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-900">Step 1 — Enter registered {type.toLowerCase()}</p>
          <input 
            type={type === 'Email' ? 'email' : 'tel'} 
            placeholder={`Registered ${type}`} 
            value={oldVal}
            onChange={e => { setOldVal(e.target.value); setError(''); }}
            className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB]"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={handleStep1} className="flex-1 h-[52px] bg-[#2563EB] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Continue</button>
            <button type="button" onClick={onCancel} className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Cancel</button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-900">Step 2 — OTP Verification</p>
          <div className="flex justify-between gap-2">
            {otp.map((digit, i) => (
              <input 
                key={i}
                ref={el => otpRefs.current[i] = el}
                type="tel"
                maxLength={1}
                value={digit}
                onChange={e => { handleOtpChange(e.target.value, i); setError(''); }}
                onKeyDown={e => handleOtpKeyDown(e, i)}
                className="w-10 sm:w-12 h-14 text-center text-lg font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-[#2563EB]"
              />
            ))}
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={handleStep2} className="flex-1 h-[52px] bg-[#2563EB] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Verify OTP</button>
            <button type="button" onClick={onCancel} className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Cancel</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-900">Step 3 — Enter new {type.toLowerCase()}</p>
          <input 
            type={type === 'Email' ? 'email' : 'tel'} 
            placeholder={`New ${type}`} 
            value={newVal}
            onChange={e => { setNewVal(e.target.value); setError(''); }}
            className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB]"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={handleStep3} className="flex-1 h-[52px] bg-[#2563EB] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Continue</button>
            <button type="button" onClick={onCancel} className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all">Cancel</button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="space-y-4 flex flex-col items-center justify-center py-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-2">
            <Check size={24} />
          </div>
          <p className="text-sm font-medium text-slate-900 text-center">{type} updated successfully</p>
          <button type="button" onClick={onCancel} className="w-full h-[52px] bg-[#2563EB] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all mt-2">Done</button>
        </div>
      )}
    </div>
  );
};

const InputField = ({ label, placeholder = "", type = "text", value, onChange, showChangeBtn, changingField, setChangingField }: any) => (
  <div className="space-y-1.5 mb-4">
    <div className="flex items-center justify-between">
      <label className="text-[13px] font-medium text-slate-600">{label}</label>
      {showChangeBtn && (
        <button 
          type="button"
          onClick={() => setChangingField(label)}
          className="text-[12px] font-semibold text-[#2563EB] active:opacity-70"
        >
          Change
        </button>
      )}
    </div>
    <input 
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={showChangeBtn}
      className={`w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[15px] text-slate-900 focus:outline-none focus:border-[#2563EB] transition-colors ${showChangeBtn ? 'opacity-70 cursor-not-allowed' : 'focus:bg-white'}`}
    />
    {changingField === label && (
      <ChangeAccountFlow 
        type={label as 'Email' | 'Phone Number'} 
        currentVal={value} 
        onCancel={() => setChangingField(null)} 
      />
    )}
  </div>
);

export default function OwnerInformationPage() {
  const { selectedBranch } = useAppStore();
  const router = useRouter();
  const { toast } = useToast();

  const [ownerType, setOwnerType] = useState<'individual' | 'company'>('individual');
  const [changingField, setChangingField] = useState<'Email' | 'Phone Number' | null>(null);

  // Fetch existing profile data
  const { data: profileResponse, isLoading } = useGet<any>(
    ['profile', selectedBranch],
    `/api/branches/${selectedBranch}/profile`,
    undefined,
    { enabled: !!selectedBranch }
  );

  const { mutate: updateProfile, isPending } = usePut(`/api/branches/${selectedBranch}/profile`);

  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    phone: '',
    pan: '',
    companyName: '',
    companyPan: '',
    brandName: '',
    corporateEmail: '',
    corporatePhone: '',
    address: '',
    managerName: '',
    managerPhone: '',
    managerEmail: ''
  });

  useEffect(() => {
    if (profileResponse?.data?.ownerInfo) {
      setFormData({
        ...formData,
        ...profileResponse.data.ownerInfo
      });
      if (profileResponse.data.ownerInfo.type) {
        setOwnerType(profileResponse.data.ownerInfo.type);
      }
    }
  }, [profileResponse]);

  const handleUpdate = () => {
    updateProfile(
      { 
        ownerInfo: { 
          ...formData, 
          type: ownerType 
        } 
      },
      {
        onSuccess: () => {
          toast({
            title: "Owner Information Updated",
            description: "Your details have been updated successfully.",
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

  const Card = ({ title, children }: { title?: string, children: React.ReactNode }) => (
    <div className="bg-white rounded-[18px] p-4 border border-[#E5E7EB] shadow-sm mb-4">
      {title && <h3 className="text-[16px] font-bold text-slate-900 mb-4">{title}</h3>}
      {children}
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-60 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans animate-in fade-in duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 h-[56px] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-700 active:scale-95 transition-transform">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[18px] font-semibold text-slate-900">Owner Info</h1>
        </div>
        <button type="button" onClick={handleUpdate} disabled={isPending} className="text-[#2563EB] font-semibold text-[15px] px-2 active:opacity-70 disabled:opacity-50">
          {isPending ? 'Saving...' : 'Save'}
        </button>
      </header>

      <div className="p-4 space-y-4 w-full">
        {/* Owner Type Selection */}
        <div className="flex p-1 bg-[#F3F4F6] rounded-full mb-6">
          <div
            role="button"
            className={`flex-1 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              ownerType === 'individual' 
              ? 'bg-white text-[#2563EB] shadow-sm' 
              : 'text-[#6B7280] hover:text-slate-900'
            }`}
            onClick={() => setOwnerType('individual')}
          >
            <User size={16} />
            Individual
          </div>
          <div
            role="button"
            className={`flex-1 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              ownerType === 'company' 
              ? 'bg-white text-[#2563EB] shadow-sm' 
              : 'text-[#6B7280] hover:text-slate-900'
            }`}
            onClick={() => setOwnerType('company')}
          >
            <Building2 size={16} />
            Company
          </div>
        </div>

        {/* Form Fields */}
        <Card title={ownerType === 'individual' ? "Individual Details" : "Company Details"}>
          {ownerType === 'individual' ? (
            <>
              <InputField label="Owner Name" placeholder="e.g. Amit Sharma" value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} />
              <InputField label="PAN Card Number" placeholder="10-digit PAN number" value={formData.pan} onChange={(v: string) => setFormData({...formData, pan: v})} />
              <InputField label="Phone Number" placeholder="10-digit mobile number" type="tel" value={formData.phone} onChange={(v: string) => setFormData({...formData, phone: v})} showChangeBtn changingField={changingField} setChangingField={setChangingField} />
              <InputField label="Email" placeholder="amit@example.com" type="email" value={formData.email} onChange={(v: string) => setFormData({...formData, email: v})} showChangeBtn changingField={changingField} setChangingField={setChangingField} />
              
              <div className="mt-6">
                <label className="text-[13px] font-medium text-slate-600 mb-2 block">Government ID (Optional)</label>
                <div 
                  role="button"
                  className="w-full h-12 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Upload size={18} />
                  <span className="text-[14px] font-medium">Upload ID Proof</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <InputField label="Company Name" placeholder="e.g. Gourmet Foods Pvt Ltd" value={formData.companyName} onChange={(v: string) => setFormData({...formData, companyName: v})} />
              <InputField label="Company PAN" placeholder="10-digit PAN number" value={formData.companyPan} onChange={(v: string) => setFormData({...formData, companyPan: v})} />
              <InputField label="Brand Name" placeholder="e.g. Domino's" value={formData.brandName} onChange={(v: string) => setFormData({...formData, brandName: v})} />
              <InputField label="Corporate Email" placeholder="contact@company.com" type="email" value={formData.corporateEmail} onChange={(v: string) => setFormData({...formData, corporateEmail: v})} showChangeBtn changingField={changingField} setChangingField={setChangingField} />
              <InputField label="Corporate Phone" placeholder="10-digit mobile number" type="tel" value={formData.corporatePhone} onChange={(v: string) => setFormData({...formData, corporatePhone: v})} showChangeBtn changingField={changingField} setChangingField={setChangingField} />
              <InputField label="Head Office Address" placeholder="Full address" value={formData.address} onChange={(v: string) => setFormData({...formData, address: v})} />
              
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h4 className="text-[15px] font-bold text-slate-900 mb-4">Authorized Manager</h4>
                <InputField label="Manager Name" placeholder="e.g. Rahul Verma" value={formData.managerName} onChange={(v: string) => setFormData({...formData, managerName: v})} />
                <InputField label="Phone Number" placeholder="10-digit mobile number" type="tel" value={formData.managerPhone} onChange={(v: string) => setFormData({...formData, managerPhone: v})} showChangeBtn changingField={changingField} setChangingField={setChangingField} />
                <InputField label="Email" placeholder="manager@company.com" type="email" value={formData.managerEmail} onChange={(v: string) => setFormData({...formData, managerEmail: v})} showChangeBtn changingField={changingField} setChangingField={setChangingField} />
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <h4 className="text-[15px] font-bold text-slate-900 mb-4">Documents (Optional)</h4>
                <div className="space-y-3">
                  <div 
                    role="button"
                    className="w-full h-12 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Upload size={18} />
                    <span className="text-[14px] font-medium">Upload Company Registration</span>
                  </div>
                  <div 
                    role="button"
                    className="w-full h-12 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Upload size={18} />
                    <span className="text-[14px] font-medium">Upload ID Proof</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-[72px] lg:bottom-0 left-0 right-0 p-4 border-t border-slate-100 z-40 w-full flex justify-center">
        <button 
          type="button" 
          onClick={handleUpdate} 
          disabled={isPending}
          className="w-full max-w-md h-[52px] bg-[#2563EB] text-[#FFFFFF] rounded-[14px] font-semibold text-[16px] active:scale-[0.98] transition-all shadow-sm disabled:opacity-50"
        >
          {isPending ? 'Saving Details...' : 'Save Details'}
        </button>
      </div>
    </div>
  );
}
