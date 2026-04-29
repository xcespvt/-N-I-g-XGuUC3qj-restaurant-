"use client"

import React, { useState } from 'react';
import { 
  ChevronLeft,
  Wallet,
  CheckCircle2,
  Loader2,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/context/useAppStore';
import { useRouter } from 'next/navigation';

export default function WithdrawPage() {
  const { } = useAppStore();
  const walletBalance = 0; // Default to 0 as wallet state was removed
  const router = useRouter();
  const [withdrawStep, setWithdrawStep] = useState<'input' | 'confirm' | 'loading' | 'success'>('input');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const handleWithdraw = () => {
    setWithdrawStep('loading');
    setTimeout(() => {
    //   setWalletBalance(walletBalance - Number(withdrawAmount)); // Assuming setWalletBalance exists or just local state for demo
      setWithdrawStep('success');
    }, 2000);
  };

  return (
    <div className="pb-32 px-4 pt-6 animate-in fade-in slide-in-from-right-4 duration-300 bg-slate-50 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-50"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-slate-900">Withdraw Funds</h1>
      </div>

      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-200">
        {withdrawStep === 'input' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Enter Amount</h3>
              <p className="text-sm text-slate-500 mt-1">Available Balance: ₹{walletBalance.toLocaleString('en-IN')}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Withdrawal Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
                <input 
                  type="number" 
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full h-[52px] bg-slate-50 border border-slate-200 rounded-[16px] pl-8 pr-4 text-slate-900 font-medium focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="bg-slate-50 rounded-[16px] p-4 space-y-3 border border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Bank Name</span>
                <span className="font-medium text-slate-900">HDFC Bank (**** 1234)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">TDS (2%)</span>
                <span className="font-medium text-rose-500">- ₹{withdrawAmount ? (Number(withdrawAmount) * 0.02).toFixed(2) : '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Processing Fee</span>
                <span className="font-medium text-rose-500">- ₹10.00</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between">
                <span className="font-semibold text-slate-900">You will get</span>
                <span className="font-bold text-emerald-600">
                  ₹{withdrawAmount ? Math.max(0, Number(withdrawAmount) - (Number(withdrawAmount) * 0.02) - 10).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setWithdrawStep('confirm')}
              disabled={!withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > walletBalance}
              className="w-full h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Step
            </button>
          </div>
        )}

        {withdrawStep === 'confirm' && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Wallet size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Confirm Withdrawal</h3>
              <p className="text-slate-500 mt-2 leading-relaxed text-sm">
                Are you sure you want to withdraw ₹{Number(withdrawAmount).toLocaleString('en-IN')} to your bank account?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setWithdrawStep('input')}
                className="h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all"
              >
                Back
              </button>
              <button 
                onClick={handleWithdraw}
                className="h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        )}

        {withdrawStep === 'loading' && (
          <div className="space-y-6 text-center py-8">
            <Loader2 size={48} className="text-blue-600 animate-spin mx-auto" />
            <div>
              <h3 className="text-xl font-bold text-slate-900">Processing Request</h3>
              <p className="text-slate-500 mt-2">Please wait while we process your withdrawal...</p>
            </div>
          </div>
        )}

        {withdrawStep === 'success' && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Request Sent</h3>
              <p className="text-slate-500 mt-2 leading-relaxed text-sm">
                Success! Your withdrawal request has been received and will be processed within 24 hours.
              </p>
            </div>
            <button 
              onClick={() => router.push('/earnings')}
              className="w-full h-[52px] bg-slate-900 text-white rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all"
            >
              Back to Earnings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
