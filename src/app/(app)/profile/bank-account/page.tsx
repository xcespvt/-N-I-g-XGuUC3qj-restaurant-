"use client"

import React, { useState, useEffect } from 'react';
import { ArrowLeft, MoreVertical, Plus, ShieldCheck, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from "@/context/useAppStore";
import { usePut, useGet } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface BankAccount {
  id: string | number;
  bankName: string;
  holderName: string;
  accountNumber: string;
  ifscCode: string;
  isPrimary: boolean;
}

export default function BankAccountPage() {
  const { selectedBranch } = useAppStore();
  const router = useRouter();
  const { toast } = useToast();

  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | number | null>(null);
  
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState({
    bankName: '',
    holderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch existing profile data
  const { data: profileResponse, isLoading } = useGet<any>(
    ['profile', selectedBranch],
    `/api/branches/${selectedBranch}/profile`,
    undefined,
    { enabled: !!selectedBranch }
  );

  const { mutate: updateProfile, isPending } = usePut(`/api/branches/${selectedBranch}/profile`);

  useEffect(() => {
    if (profileResponse?.data?.bankAccounts) {
      setAccounts(profileResponse.data.bankAccounts);
    }
  }, [profileResponse]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ bankName: '', holderName: '', accountNumber: '', confirmAccountNumber: '', ifscCode: '' });
    setErrors({});
    setShowAddModal(true);
  };

  const handleOpenEdit = (account: BankAccount) => {
    setEditingId(account.id);
    setFormData({
      bankName: account.bankName,
      holderName: account.holderName,
      accountNumber: account.accountNumber,
      confirmAccountNumber: account.accountNumber,
      ifscCode: account.ifscCode
    });
    setErrors({});
    setActiveMenuId(null);
    setShowAddModal(true);
  };

  const handleDeleteClick = (id: string | number) => {
    setShowDeleteConfirm(id);
    setActiveMenuId(null);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm !== null) {
      const updatedAccounts = accounts.filter(a => a.id !== showDeleteConfirm);
      setAccounts(updatedAccounts);
      setShowDeleteConfirm(null);
      handleSync(updatedAccounts);
    }
  };

  const handleSetPrimary = (id: string | number) => {
    const updatedAccounts = accounts.map(a => ({ ...a, isPrimary: a.id === id }));
    setAccounts(updatedAccounts);
    setActiveMenuId(null);
    handleSync(updatedAccounts);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.bankName.trim()) newErrors.bankName = 'Bank Name is required';
    if (!formData.holderName.trim()) newErrors.holderName = 'Account Holder Name is required';
    if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account Number is required';
    if (!formData.confirmAccountNumber.trim()) newErrors.confirmAccountNumber = 'Please re-enter account number';
    if (formData.accountNumber !== formData.confirmAccountNumber) {
      newErrors.confirmAccountNumber = 'Account numbers do not match';
    }
    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC Code is required';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.toUpperCase())) {
      newErrors.ifscCode = 'Invalid IFSC Code format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      let updatedAccounts;
      if (editingId !== null) {
        updatedAccounts = accounts.map(a => a.id === editingId ? {
          ...a,
          bankName: formData.bankName,
          holderName: formData.holderName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode.toUpperCase()
        } : a);
      } else {
        updatedAccounts = [...accounts, {
          id: Date.now().toString(),
          bankName: formData.bankName,
          holderName: formData.holderName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode.toUpperCase(),
          isPrimary: accounts.length === 0
        }];
      }
      setAccounts(updatedAccounts);
      setShowAddModal(false);
      handleSync(updatedAccounts);
    }
  };

  const handleSync = (updatedAccounts: BankAccount[]) => {
    updateProfile(
      { bankAccounts: updatedAccounts },
      {
        onSuccess: () => {
          toast({
            title: "Bank Details Updated",
            description: "Your bank account settings have been synced.",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "Failed to update bank details",
            variant: "destructive",
          });
        }
      }
    );
  };

  const maskAccountNumber = (accNum: string) => {
    if (accNum.length <= 4) return accNum;
    return `**** **** ${accNum.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="space-y-4">
          {[1, 2].map(i => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
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
          <h1 className="text-[18px] font-semibold text-slate-900">Bank Accounts</h1>
        </div>
        <button 
          type="button"
          onClick={handleOpenAdd} 
          className="w-10 h-10 flex items-center justify-center -mr-2 text-[#2563EB] active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="p-4 space-y-4 w-full">
        {/* Security Indicator */}
        <div className="flex items-center justify-center gap-3 py-3 bg-white rounded-[20px] border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ShieldCheck size={22} />
          </div>
          <p className="text-[13px] font-bold text-slate-600 leading-tight">
            Your bank details are securely<br />stored and encrypted
          </p>
        </div>

        {/* Bank Accounts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map(account => (
            <div key={account.id} className="bg-white rounded-[24px] p-6 border border-[#E5E7EB] shadow-sm relative transition-all hover:shadow-md">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-[18px] font-black text-slate-900 tracking-tight">{account.bankName}</h3>
                  {account.isPrimary && (
                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-black uppercase tracking-wider">
                      Primary Account
                    </div>
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => setActiveMenuId(activeMenuId === account.id ? null : account.id)}
                  className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-50 active:scale-90 transition-all rounded-full -mr-2 -mt-2"
                >
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mb-1 px-1">Account Holder Name</p>
                  <p className="text-[16px] font-bold text-slate-900">{account.holderName}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mb-1 px-1">Account Number</p>
                  <p className="text-[18px] font-mono font-bold text-slate-900 tracking-widest bg-slate-50 px-3 py-2 rounded-xl inline-block w-full text-center">
                    {maskAccountNumber(account.accountNumber)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mb-1 px-1">IFSC Code</p>
                  <p className="text-[16px] font-bold text-slate-900">{account.ifscCode}</p>
                </div>
              </div>

              {/* 3-Dot Menu Dropdown */}
              {activeMenuId === account.id && (
                <div className="absolute right-4 top-14 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <button type="button" onClick={() => handleOpenEdit(account)} className="w-full px-4 py-3 text-left text-[14px] font-bold text-slate-700 hover:bg-slate-50 border-b border-slate-50 transition-colors">
                    Edit Details
                  </button>
                  {!account.isPrimary && (
                    <button type="button" onClick={() => handleSetPrimary(account.id)} className="w-full px-4 py-3 text-left text-[14px] font-bold text-emerald-600 hover:bg-emerald-50 border-b border-slate-50 transition-colors">
                      Set as Primary
                    </button>
                  )}
                  <button type="button" onClick={() => handleDeleteClick(account.id)} className="w-full px-4 py-3 text-left text-[14px] font-bold text-rose-600 hover:bg-rose-50 transition-colors">
                    Delete Account
                  </button>
                </div>
              )}
            </div>
          ))}

          {accounts.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 bg-white rounded-[24px] border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <Plus size={32} className="text-slate-300" />
              </div>
              <p className="text-[16px] font-bold text-slate-500">No bank accounts added</p>
              <button 
                onClick={handleOpenAdd}
                className="mt-4 text-[#2563EB] font-bold text-[15px] hover:underline"
              >
                Add your first account
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Bank Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex flex-col justify-end backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-t-[32px] p-6 pb-12 animate-in slide-in-from-bottom-full duration-300 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-8 sticky top-0 bg-white z-10 py-2">
              <div className="space-y-1">
                <h2 className="text-[20px] font-black text-slate-900 tracking-tight">
                  {editingId ? 'Edit Bank Details' : 'Add Bank Account'}
                </h2>
                <p className="text-[13px] font-medium text-slate-500">Provide accurate details for settlements</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)} 
                className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-full active:scale-90 transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[14px] font-bold text-slate-700 ml-1">Bank Name</label>
                <input 
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                  className={`w-full h-[56px] px-5 bg-slate-50 border ${errors.bankName ? 'border-red-500' : 'border-slate-200'} rounded-[18px] text-[16px] font-medium text-slate-900 focus:outline-none focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all`}
                  placeholder="e.g. HDFC Bank"
                />
                {errors.bankName && <p className="text-red-500 text-[12px] font-bold ml-2 mt-1">{errors.bankName}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[14px] font-bold text-slate-700 ml-1">Account Holder Name</label>
                <input 
                  type="text"
                  value={formData.holderName}
                  onChange={(e) => setFormData({...formData, holderName: e.target.value})}
                  className={`w-full h-[56px] px-5 bg-slate-50 border ${errors.holderName ? 'border-red-500' : 'border-slate-200'} rounded-[18px] text-[16px] font-medium text-slate-900 focus:outline-none focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all`}
                  placeholder="Exact name as per passbook"
                />
                {errors.holderName && <p className="text-red-500 text-[12px] font-bold ml-2 mt-1">{errors.holderName}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[14px] font-bold text-slate-700 ml-1">Account Number</label>
                <input 
                  type="password"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                  className={`w-full h-[56px] px-5 bg-slate-50 border ${errors.accountNumber ? 'border-red-500' : 'border-slate-200'} rounded-[18px] text-[16px] font-medium text-slate-900 focus:outline-none focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all tracking-widest`}
                  placeholder="•••• •••• ••••"
                />
                {errors.accountNumber && <p className="text-red-500 text-[12px] font-bold ml-2 mt-1">{errors.accountNumber}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[14px] font-bold text-slate-700 ml-1">Re-enter Account Number</label>
                <input 
                  type="text"
                  value={formData.confirmAccountNumber}
                  onChange={(e) => setFormData({...formData, confirmAccountNumber: e.target.value})}
                  className={`w-full h-[56px] px-5 bg-slate-50 border ${errors.confirmAccountNumber ? 'border-red-500' : 'border-slate-200'} rounded-[18px] text-[16px] font-medium text-slate-900 focus:outline-none focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all`}
                  placeholder="Double check for accuracy"
                />
                {errors.confirmAccountNumber && <p className="text-red-500 text-[12px] font-bold ml-2 mt-1">{errors.confirmAccountNumber}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[14px] font-bold text-slate-700 ml-1">IFSC Code</label>
                <input 
                  type="text"
                  value={formData.ifscCode}
                  onChange={(e) => setFormData({...formData, ifscCode: e.target.value.toUpperCase()})}
                  className={`w-full h-[56px] px-5 bg-slate-50 border ${errors.ifscCode ? 'border-red-500' : 'border-slate-200'} rounded-[18px] text-[16px] font-medium text-slate-900 focus:outline-none focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all uppercase`}
                  placeholder="e.g. HDFC0001234"
                />
                {errors.ifscCode && <p className="text-red-500 text-[12px] font-bold ml-2 mt-1">{errors.ifscCode}</p>}
              </div>

              <div className="pt-6">
                <button 
                  type="button"
                  onClick={handleSave}
                  disabled={isPending}
                  className="w-full h-[60px] bg-[#2563EB] text-white rounded-[20px] font-bold text-[18px] flex items-center justify-center active:scale-[0.98] transition-all shadow-xl shadow-blue-200 disabled:opacity-50"
                >
                  {isPending ? 'Syncing...' : (editingId ? 'Update Account' : 'Confirm & Save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 z-[110] bg-black/70 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-sm animate-in zoom-in-95 duration-200 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-6">
              <X size={32} />
            </div>
            <h3 className="text-[22px] font-black text-slate-900 tracking-tight mb-2">Delete Account?</h3>
            <p className="text-[15px] font-medium text-slate-500 mb-8 leading-relaxed">
              Are you sure you want to remove this bank account? This action cannot be undone.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                type="button"
                onClick={confirmDelete}
                className="w-full h-[56px] bg-rose-600 text-white rounded-[18px] font-bold text-[16px] active:scale-95 transition-all shadow-lg shadow-rose-200"
              >
                Yes, Delete Account
              </button>
              <button 
                type="button"
                onClick={() => setShowDeleteConfirm(null)}
                className="w-full h-[56px] bg-slate-100 text-slate-700 rounded-[18px] font-bold text-[16px] active:bg-slate-200 transition-all"
              >
                No, Keep it
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile-only status bar */}
      <div className="fixed bottom-[72px] lg:hidden left-0 right-0 p-4 flex justify-center z-30 pointer-events-none">
        <div className="bg-white/80 backdrop-blur shadow-sm border border-slate-100 px-4 py-2 rounded-full pointer-events-auto">
           <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Secure Settlements</p>
        </div>
      </div>
    </div>
  );
}
