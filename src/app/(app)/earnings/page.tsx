"use client"

import React, { useState, useMemo } from 'react';
import { 
  Wallet, 
  ShoppingBag, 
  Utensils, 
  Bike, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Banknote,
  Receipt,
  Megaphone,
  RotateCcw,
  Filter,
  Info,
  HelpCircle,
  IndianRupee,
  ArrowDownRight
} from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/context/useAppStore';

export default function EarningsPage() {
  const { orders } = useAppStore();
  const walletBalance = 0; // Default to 0 since walletBalance state was removed
  const [selectedFilter, setSelectedFilter] = useState('Last month');
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(2026, 1, 1)); 
  const [isAutoWithdrawalEnabled, setIsAutoWithdrawalEnabled] = useState(true);
  const [showAutoWithdrawConfirm, setShowAutoWithdrawConfirm] = useState(false);
  const [pendingAutoWithdrawState, setPendingAutoWithdrawState] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Business Logic from existing page
  const stats = useMemo(() => {
    const activeOrders = orders.filter(o => o.status !== 'Cancelled');
    const deliveryOrders = activeOrders.filter(o => o.type === "Delivery");
    const onlineTakeawayOrders = activeOrders.filter(o => o.type === 'Takeaway' && o.source !== 'Offline');
    const dineInOrders = activeOrders.filter(o => o.type === "Dine-in" && !o.items.some(i => i.category === 'Booking'));
    const bookingOrders = activeOrders.filter(o => o.items.some(i => i.category === 'Booking'));
    const walkInOrders = activeOrders.filter(o => o.type === 'Takeaway' && o.source === 'Offline');

    const calculateTotal = (list: typeof orders) => list.reduce((acc, o) => acc + (o.total || 0), 0);

    const delivery = calculateTotal(deliveryOrders);
    const onlineTakeaway = calculateTotal(onlineTakeawayOrders);
    const dineIn = calculateTotal(dineInOrders);
    const bookings = calculateTotal(bookingOrders);
    const walkIn = calculateTotal(walkInOrders);
    
    // Revenue for breakdown
    const breakdown = [
      { label: 'Dine-in', icon: Utensils, percent: `${((dineIn / (delivery + onlineTakeaway + dineIn + bookings || 1)) * 100).toFixed(0)}%`, amount: `₹ ${dineIn.toLocaleString('en-IN')}`, color: 'bg-blue-100 text-blue-600' },
      { label: 'Delivery', icon: Bike, percent: `${((delivery / (delivery + onlineTakeaway + dineIn + bookings || 1)) * 100).toFixed(0)}%`, amount: `₹ ${delivery.toLocaleString('en-IN')}`, color: 'bg-emerald-100 text-emerald-600' },
      { label: 'Online Takeaway', icon: ShoppingBag, percent: `${((onlineTakeaway / (delivery + onlineTakeaway + dineIn + bookings || 1)) * 100).toFixed(0)}%`, amount: `₹ ${onlineTakeaway.toLocaleString('en-IN')}`, color: 'bg-amber-100 text-amber-600' },
      { label: 'Booking Charges', icon: Calendar, percent: `${((bookings / (delivery + onlineTakeaway + dineIn + bookings || 1)) * 100).toFixed(0)}%`, amount: `₹ ${bookings.toLocaleString('en-IN')}`, color: 'bg-purple-100 text-purple-600' },
      { label: 'Walk-In Sales', icon: ShoppingBag, percent: 'N/A', amount: `₹ ${walkIn.toLocaleString('en-IN')}`, color: 'bg-indigo-100 text-indigo-600' },
    ];

    const gst = delivery * 0.05;
    const refunds = orders.filter(o => o.status === 'Cancelled').reduce((acc, o) => acc + (o.total || 0), 0);

    const deductions = [
      { label: 'Offline Cash', icon: Banknote, sub: 'Collected at counter', amount: `- ₹ ${walkIn.toLocaleString('en-IN')}` },
      { label: 'GST (Delivery)', icon: Receipt, sub: '5% on delivery orders', amount: `- ₹ ${gst.toLocaleString('en-IN')}` },

      { label: 'Refunds', icon: RotateCcw, sub: `${orders.filter(o => o.status === 'Cancelled').length} Order(s)`, amount: `- ₹ ${refunds.toLocaleString('en-IN')}` },
    ];

    return {
        totalEarningsMonth: delivery + onlineTakeaway + dineIn + bookings,
        totalOrdersMonth: activeOrders.length,
        totalOrdersToday: orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length,
        breakdown,
        deductions,
        totalRevenue: delivery + onlineTakeaway + dineIn + bookings,
        totalDeductions: gst + refunds + walkIn
    };
  }, [orders]);

  const handlePrevMonth = () => {
    setCurrentMonthDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const faqData = [
    { question: 'How does the payout system work?', answer: 'Our payout system automatically calculates your earnings from online orders, deducts any applicable fees or refunds, and transfers the remaining balance to your registered bank account. You can choose between daily auto-withdrawals or manual requests.' },
    { question: 'How are platform fees calculated?', answer: 'Platform fees are calculated as a fixed percentage of each online order\'s subtotal. This fee covers payment processing, platform maintenance, and customer support. Taxes and delivery charges are not subject to platform fees.' },
    { question: 'Why did my payout fail?', answer: 'Payouts typically fail due to incorrect bank account details, issues with the receiving bank, or temporary network errors. If a payout fails, the funds will be returned to your available balance, and you can initiate a new withdrawal request.' },
    { question: 'When will I receive my funds?', answer: 'For auto-withdrawals, funds are processed daily and typically arrive within 24 hours (T+1 settlement cycle). Manual withdrawals are processed within 1-2 business days depending on your bank.' },
  ];

  const recentPayouts = [
    { amount: '₹ 1,200', date: 'Today, 10:00 AM', status: 'Processing' },
    { amount: '₹ 15,450', date: 'May 1, 2025', status: 'Paid' },
  ];

  return (
    <div className="pb-32 px-4 pt-6 animate-in fade-in duration-500 bg-slate-50 min-h-screen space-y-6 lg:bg-transparent lg:px-0 lg:pt-0 lg:pb-10 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
      
      {/* Wallet Section */}
      <div className="space-y-4 lg:col-span-1">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">PERIOD - 1 TO {new Date(2026, currentMonthDate.getMonth() + 1, 0).getDate()} {formatMonthYear(currentMonthDate).toUpperCase()}</p>
        </div>
        <div className="grid grid-cols-2 gap-[12px]">
          {/* Card 1 */}
          <div className="relative overflow-hidden bg-[#FFFFFF] rounded-[16px] p-[16px] border border-[#E5E7EB] h-[110px] flex flex-col justify-between">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="text-[14px] font-bold text-[#111827] leading-tight">Total Orders</h3>
              <p className="text-[13px] text-[#9CA3AF] mt-0.5">complete This Month</p>
            </div>
            <p className="relative z-10 text-[26px] font-bold text-[#111827] leading-none">{stats.totalOrdersMonth > 1000 ? `${(stats.totalOrdersMonth/1000).toFixed(1)}k` : stats.totalOrdersMonth}</p>
          </div>
          
          {/* Card 2 */}
          <div className="relative overflow-hidden bg-[#FFFFFF] rounded-[16px] p-[16px] border border-[#E5E7EB] h-[110px] flex flex-col justify-between">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="text-[14px] font-bold text-[#111827] leading-tight">Total Orders</h3>
              <p className="text-[13px] text-[#9CA3AF] mt-0.5">complete today</p>
            </div>
            <p className="relative z-10 text-[26px] font-bold text-[#111827] leading-none">{stats.totalOrdersToday}</p>
          </div>
          
          {/* Card 3 */}
          <div className="relative overflow-hidden bg-[#FFFFFF] rounded-[16px] p-[16px] border border-[#E5E7EB] h-[110px] flex flex-col justify-between">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="text-[14px] font-bold text-[#111827] leading-tight">Total Earnings</h3>
              <p className="text-[13px] text-[#9CA3AF] mt-0.5">This Month</p>
            </div>
            <p className="relative z-10 text-[26px] font-bold text-[#111827] leading-none">₹{stats.totalEarningsMonth.toLocaleString('en-IN')}</p>
          </div>
          
          {/* Card 4 */}
          <div className="relative overflow-hidden bg-[#FFFFFF] rounded-[16px] p-[16px] border border-[#E5E7EB] h-[110px] flex flex-col justify-between">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="text-[14px] font-bold text-[#111827] leading-tight">Available Funds</h3>
              <p className="text-[13px] text-[#9CA3AF] mt-0.5">For Withdrawal</p>
            </div>
            <p className="relative z-10 text-[26px] font-bold text-[#111827] leading-none">₹{walletBalance.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <Link href="/earnings/withdraw" className="block">
          <button 
            className="w-full h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all"
          >
            Withdraw Funds
          </button>
        </Link>

        {/* Upcoming Payout Section */}
        <div className="relative overflow-hidden bg-white rounded-[16px] p-5 border border-slate-200 shadow-sm">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">Next Payout</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">₹18,420</h3>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-emerald-600">Arrives Tomorrow</p>
              <p className="text-xs text-slate-500 mt-1">Settlement cycle: T+1</p>
            </div>
          </div>
          
          <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Auto Withdrawal</p>
              <p className="text-xs text-slate-500 mt-0.5 max-w-[200px]">
                Daily automatic transfers to your bank account
              </p>
            </div>
            <button 
              onClick={() => {
                setPendingAutoWithdrawState(!isAutoWithdrawalEnabled);
                setShowAutoWithdrawConfirm(true);
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAutoWithdrawalEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAutoWithdrawalEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <div className="bg-[#FFF7ED] rounded-[14px] p-[16px] border border-[#FED7AA] flex items-start gap-[12px]">
          <Info className="text-[#7C2D12] shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-[14px] font-semibold text-[#7C2D12] leading-tight">Notice</h4>
            <p className="text-[13px] text-[#7C2D12] mt-1 leading-snug">
              These funds and others include only payments and orders from online orders processed through the Crevings platform.
              <br/><br/>
              Offline orders payments are settled directly with customers.
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Month Selector */}
      <div className="space-y-4 lg:col-span-1">
        {/* Month Selector */}
        <div className="bg-white rounded-[16px] p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <button 
            onClick={handlePrevMonth}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-blue-600" />
              <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {formatMonthYear(currentMonthDate)}
              </span>
            </div>
            <span className="text-xs text-slate-500 mt-1">
              Sales & Deductions Report
            </span>
          </div>
          <button 
            onClick={handleNextMonth}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-[8px] overflow-x-auto no-scrollbar -mx-4 px-4">
          {['Last 3 days', 'Last 7 days', 'Last 14 days', 'Last month'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`h-[36px] px-[14px] rounded-[18px] text-[14px] font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 flex items-center gap-1.5 font-sans ${
                selectedFilter === filter
                  ? 'bg-[#E6F4FF] text-[#1E90FF]' 
                  : 'bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Revenue Breakdown</h3>
            <p className="text-xs text-slate-500 mt-0.5">Where your money comes from</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <Filter size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {stats.breakdown.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.color}`}>
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.percent} of total</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-900">{item.amount}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">Gross Revenue</span>
          <span className="text-lg font-bold text-slate-900">₹ {stats.totalRevenue.toLocaleString('en-IN')}.00</span>
        </div>
      </div>

      {/* Deductions */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Deductions</h3>
            <p className="text-xs text-slate-500 mt-0.5">Taxes, fees, and refunds</p>
          </div>
          <div className="flex items-center gap-1 text-rose-500 bg-rose-50 px-2 py-1 rounded-md text-xs font-medium">
            <ArrowDownRight size={14} />
            <span>8%</span>
          </div>
        </div>

        <div className="space-y-4">
          {stats.deductions.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100">
                  <item.icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.sub}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-rose-500">{item.amount}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">Total Deductions</span>
          <span className="text-lg font-bold text-rose-500">- ₹ {stats.totalDeductions.toLocaleString('en-IN')}.00</span>
        </div>
      </div>

      {/* Recent Payouts */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-semibold text-slate-900">Recent Payouts</h3>
          <Link href="/earnings/history" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {recentPayouts.map((payout, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  payout.status === 'Processing' 
                    ? 'bg-amber-50 text-amber-500' 
                    : 'bg-emerald-50 text-emerald-500'
                }`}>
                  {payout.status === 'Processing' ? <Clock size={18} /> : <CheckCircle2 size={18} />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{payout.amount}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{payout.date}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                payout.status === 'Processing'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}>
                {payout.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle size={20} className="text-blue-600" />
          <h3 className="text-base font-semibold text-slate-900">Frequently Asked Questions</h3>
        </div>
        <div className="space-y-3">
          {faqData.map((faq, index) => (
            <div key={index} className="border border-slate-100 rounded-2xl overflow-hidden">
              <button 
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <span className="text-sm font-semibold text-slate-800 text-left pr-4">{faq.question}</span>
                {expandedFaq === index ? <ChevronUp size={18} className="text-slate-500 flex-shrink-0" /> : <ChevronDown size={18} className="text-slate-500 flex-shrink-0" />}
              </button>
              {expandedFaq === index && (
                <div className="p-4 bg-white text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Auto Withdrawal Confirm Modal */}
      {showAutoWithdrawConfirm && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] w-[90%] max-w-sm rounded-[24px] p-[24px] shadow-xl animate-in zoom-in-95 duration-200">
            <h3 className="text-[20px] font-bold text-[#111827] mb-2">
              {pendingAutoWithdrawState ? 'Enable' : 'Disable'} Auto Withdrawal?
            </h3>
            <p className="text-[14px] text-[#6B7280] mb-6 leading-relaxed">
              {pendingAutoWithdrawState 
                ? 'Our team will automatically transfer your available funds to your bank account each day.' 
                : 'You will need to manually send withdrawal requests to transfer funds to your bank account.'}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAutoWithdrawConfirm(false)}
                className="flex-1 h-[52px] bg-slate-50 text-slate-700 rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setIsAutoWithdrawalEnabled(pendingAutoWithdrawState);
                  setShowAutoWithdrawConfirm(false);
                }}
                className="flex-1 h-[52px] bg-[#1E90FF] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
