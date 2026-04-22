"use client"

import React, { useState } from 'react';
import { 
  ChevronLeft,
  Search,
  Clock,
  RotateCcw,
  CheckCircle2,
  X,
  Info
} from 'lucide-react';
import Link from 'next/link';

export default function EarningsHistoryPage() {
  const [payoutSearchQuery, setPayoutSearchQuery] = useState('');
  const [payoutFilter, setPayoutFilter] = useState<'All' | 'Completed' | 'Pending' | 'Failed'>('All');
  const [selectedPayout, setSelectedPayout] = useState<any | null>(null);

  const allPayoutsData = [
    { id: 'PO-1042', amount: '₹ 1,200', date: 'Today, 10:00 AM', status: 'Pending', type: 'Manual', restaurant: 'Burger King', account: '**** 4567', created: '13 Mar 2026, 09:45 AM', notice: 'Your payout is currently being processed by our banking partner.' },
    { id: 'PO-1041', amount: '₹ 15,450', date: 'May 1, 2025', status: 'Completed', type: 'Auto', restaurant: 'Burger King', account: '**** 4567', created: '01 May 2025, 02:00 AM', notice: 'Payout successfully transferred to your bank account.' },
    { id: 'PO-1040', amount: '₹ 8,900', date: 'Apr 24, 2025', status: 'Completed', type: 'Auto', restaurant: 'Burger King', account: '**** 4567', created: '24 Apr 2025, 02:00 AM', notice: 'Payout successfully transferred to your bank account.' },
    { id: 'PO-1039', amount: '₹ 4,200', date: 'Apr 15, 2025', status: 'Failed', type: 'Manual', restaurant: 'Burger King', account: '**** 4567', created: '15 Apr 2025, 11:30 AM', notice: 'Failed due to invalid IFSC code. Please update your bank details.' },
    { id: 'PO-1038', amount: '₹ 12,100', date: 'Apr 02, 2025', status: 'Completed', type: 'Auto', restaurant: 'Burger King', account: '**** 4567', created: '02 Apr 2025, 02:00 AM', notice: 'Payout successfully transferred to your bank account.' },
  ];

  const filteredPayouts = allPayoutsData.filter(p => {
    const matchesSearch = p.id.toLowerCase().includes(payoutSearchQuery.toLowerCase()) || p.amount.includes(payoutSearchQuery);
    const matchesFilter = payoutFilter === 'All' || p.status === payoutFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="pb-32 px-4 pt-6 animate-in fade-in slide-in-from-right-4 duration-300 bg-slate-50 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <Link 
          href="/earnings"
          className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-50"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-slate-900">All Payouts</h1>
      </div>

      <div className="relative mb-4">
        <input 
          type="text" 
          placeholder="Search by ID or amount..." 
          value={payoutSearchQuery}
          onChange={(e) => setPayoutSearchQuery(e.target.value)}
          className="w-full h-12 bg-white border border-slate-200 rounded-2xl pl-11 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 -mx-4 px-4">
        {['All', 'Completed', 'Pending', 'Failed'].map((filter) => (
          <button
            key={filter}
            onClick={() => setPayoutFilter(filter as any)}
            className={`h-9 px-4 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              payoutFilter === filter
                ? 'bg-slate-900 text-white' 
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredPayouts.map((payout, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  payout.status === 'Pending' ? 'bg-amber-50 text-amber-500' : 
                  payout.status === 'Failed' ? 'bg-rose-50 text-rose-500' :
                  'bg-emerald-50 text-emerald-500'
                }`}>
                  {payout.status === 'Pending' ? <Clock size={18} /> : 
                   payout.status === 'Failed' ? <RotateCcw size={18} /> :
                   <CheckCircle2 size={18} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{payout.amount}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{payout.date} • {payout.id}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                payout.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                payout.status === 'Failed' ? 'bg-rose-100 text-rose-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>
                {payout.status}
              </span>
            </div>
            <button 
              onClick={() => setSelectedPayout(payout)}
              className="w-full h-10 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-xl transition-colors"
            >
              View Details
            </button>
          </div>
        ))}
        {filteredPayouts.length === 0 && (
          <div className="text-center py-10 text-slate-500 text-sm">
            No payouts found matching your criteria.
          </div>
        )}
      </div>

      {/* Payout Details Modal */}
      {selectedPayout && (
        <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center bg-black/50 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-md rounded-t-[24px] sm:rounded-[24px] p-6 shadow-xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Payout Details</h3>
              <button 
                onClick={() => setSelectedPayout(null)}
                className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center py-4 mb-6 border-b border-slate-100">
              <p className="text-sm text-slate-500 mb-1">Amount</p>
              <h2 className="text-3xl font-bold text-slate-900">{selectedPayout.amount}</h2>
              <span className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                selectedPayout.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                selectedPayout.status === 'Failed' ? 'bg-rose-100 text-rose-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>
                {selectedPayout.status}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Transaction ID</span>
                <span className="text-sm font-medium text-slate-900">{selectedPayout.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Type</span>
                <span className="text-sm font-medium text-slate-900">{selectedPayout.type} Withdrawal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Restaurant</span>
                <span className="text-sm font-medium text-slate-900">{selectedPayout.restaurant}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Account</span>
                <span className="text-sm font-medium text-slate-900">{selectedPayout.account}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Requested On</span>
                <span className="text-sm font-medium text-slate-900">{selectedPayout.created}</span>
              </div>
            </div>

            <div className={`p-4 rounded-xl text-sm leading-relaxed ${
              selectedPayout.status === 'Pending' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 
              selectedPayout.status === 'Failed' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
              'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              <div className="flex gap-2 items-start">
                <Info size={16} className="mt-0.5 flex-shrink-0" />
                <p>{selectedPayout.notice}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
