"use client";

import { useState, useMemo, Suspense, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Mic,
  Plus,
  Minus,
  ArrowLeft,
  Star,
  Sparkles,
  CheckCircle2,
  Printer,
  Receipt,
  Loader2,
  Trash2,
  User,
  Phone,
  ShoppingBag,
  IndianRupee,
  Utensils,
  X,
  CreditCard,
  Wallet,
  Coins
} from "lucide-react";
import { useAppStore } from "@/context/useAppStore";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { VoiceSearchModal } from "@/components/voice-search-modal";

// --- Helpers ---

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'pizza': return '🍕';
    case 'sides': return '🍟';
    case 'beverages': return '🥤';
    case 'combos': return '🍱';
    case 'desserts': return '🍰';
    default: return '🍴';
  }
};

// --- Components ---

const MenuItemCard = ({ item }: { item: any }) => {
  const { takeawayCart, addToTakeawayCart, incrementTakeawayCartItem, decrementTakeawayCartItem } = useAppStore();

  const cartItem = takeawayCart.find(c => c.id === item.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="rounded-[24px] p-2 border border-[#E5E7EB] flex flex-col gap-3 transition-all duration-300 bg-white hover:shadow-xl hover:border-blue-100 group">
      {/* Image Section */}
      <div className="relative w-full h-[140px] rounded-[18px] overflow-hidden bg-slate-50 shrink-0">
        <img 
          src={item.image || "https://placehold.co/300x200?text=" + item.name} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        
        {/* Veg/Non-Veg Icon */}
        <div className="absolute top-3 left-3 bg-white p-1 rounded-md shadow-sm">
          <div className={`w-3 h-3 rounded-sm border flex items-center justify-center ${item.dietaryType === 'Veg' ? 'border-green-500' : 'border-red-500'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${item.dietaryType === 'Veg' ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-slate-900 px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <span className="text-[10px] font-bold">⭐ 4.3</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 px-2 pb-2">
        <div className="flex items-start justify-between gap-1 mb-2">
          <h3 className="text-[15px] font-bold text-slate-900 leading-tight flex-1 line-clamp-1">{item.name}</h3>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[17px] font-extrabold text-slate-900">₹{item.price}</span>
          
          {quantity > 0 ? (
            <div className="h-[36px] bg-blue-50 rounded-xl flex items-center justify-between px-1 border border-blue-100 min-w-[90px]">
              <button 
                onClick={() => decrementTakeawayCartItem(cartItem!.cartItemId)}
                className="w-7 h-7 flex items-center justify-center text-[#1E90FF] hover:bg-white rounded-lg transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="text-[14px] font-bold text-[#1E90FF] mx-2">{quantity}</span>
              <button 
                onClick={() => incrementTakeawayCartItem(cartItem!.cartItemId)}
                className="w-7 h-7 flex items-center justify-center text-[#1E90FF] hover:bg-white rounded-lg transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => addToTakeawayCart(item, 1, "Full", item.price)}
              className="px-4 h-[36px] bg-white border border-[#E5E7EB] text-[#1E90FF] rounded-xl font-bold text-[13px] flex items-center justify-center active:scale-[0.98] transition-all hover:bg-[#1E90FF] hover:text-white hover:border-[#1E90FF] shadow-sm"
            >
              ADD +
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function TakeawayPageContent() {
  const { menuItems, takeawayCart, categories, incrementTakeawayCartItem, decrementTakeawayCartItem, removeFromTakeawayCart, addOrder } = useAppStore();
  
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  
  // Checkout State
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isRegularCustomer, setIsRegularCustomer] = useState(false);
  const [appliedOffer, setAppliedOffer] = useState<string | null>(null);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed' | null>(null);
  const [discountValue, setDiscountValue] = useState("");
  const [orderType, setOrderType] = useState<'takeaway' | 'dine-in'>('takeaway');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch && item.available;
    });
  }, [menuItems, activeCategory, searchQuery]);

  const cartTotal = takeawayCart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  let discountAmount = 0;
  if (appliedOffer === 'OFFLINE10') discountAmount = cartTotal * 0.1;
  else if (appliedOffer === 'FLAT50') discountAmount = 50;
  else if (discountType === 'percentage') discountAmount = cartTotal * (Number(discountValue) / 100);
  else if (discountType === 'fixed') discountAmount = Number(discountValue);

  const subtotal = Math.max(0, cartTotal - discountAmount);
  const tax = subtotal * 0.05;
  const netTotal = subtotal + tax;

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true);
    setTimeout(() => {
      addOrder(
        takeawayCart,
        customerName || "Walk-in",
        customerPhone,
        orderType,
        undefined,
        "15 min",
        "Paid",
        "Cash"
      );
      setIsPlacingOrder(false);
      setOrderConfirmed(true);
    }, 1500);
  };

  if (orderConfirmed) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#1E90FF] flex flex-col items-center justify-center p-6 animate-in fade-in">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 animate-bounce shadow-2xl">
          <CheckCircle2 size={48} className="text-[#1E90FF]" />
        </div>
        <h2 className="text-4xl font-black text-white mb-2 tracking-tight">ORDER PLACED!</h2>
        <p className="text-blue-100 mb-8 text-lg font-medium opacity-80">The kitchen has started preparing the order.</p>
        
        <div className="w-full max-w-sm space-y-4">
          <button className="w-full h-[64px] bg-white text-[#1E90FF] rounded-[20px] font-bold text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl hover:bg-blue-50">
            <Printer size={24} />
            Print KOT
          </button>
          <button className="w-full h-[64px] bg-blue-700 text-white border border-blue-500 rounded-[20px] font-bold text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl hover:bg-blue-800">
            <Receipt size={24} />
            Print Invoice
          </button>
          <Link 
            href="/dashboard"
            className="w-full h-[64px] bg-transparent text-white rounded-[20px] font-bold text-lg flex items-center justify-center mt-4 hover:bg-white/10 transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8F9FB] overflow-hidden">
      {/* Left Column: Menu */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Order</h1>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
               <button 
                onClick={() => setOrderType('takeaway')}
                className={cn("px-6 py-2 rounded-lg text-sm font-bold transition-all", orderType === 'takeaway' ? "bg-white text-[#1E90FF] shadow-sm" : "text-slate-500 hover:text-slate-700")}
               >
                 Takeaway
               </button>
               <button 
                onClick={() => setOrderType('dine-in')}
                className={cn("px-6 py-2 rounded-lg text-sm font-bold transition-all", orderType === 'dine-in' ? "bg-white text-[#1E90FF] shadow-sm" : "text-slate-500 hover:text-slate-700")}
               >
                 Dine-in
               </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search for dishes, codes..." 
              className="w-full h-[56px] bg-slate-50 border border-slate-200 rounded-[18px] pl-12 pr-12 focus:outline-none focus:border-[#1E90FF] focus:ring-4 focus:ring-blue-50 transition-all font-medium text-slate-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              onClick={() => setShowVoiceSearch(true)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#1E90FF] bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
            >
              <Mic size={18} />
            </button>
          </div>

          <VoiceSearchModal 
            isOpen={showVoiceSearch} 
            onClose={() => setShowVoiceSearch(false)} 
            onResult={(text) => setSearchQuery(text)}
          />

          {/* Categories */}
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex items-center gap-3 pb-2">
              {["All", ...categories.filter(c => c !== "All")].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "h-10 px-6 rounded-full text-sm font-bold border transition-all flex items-center gap-2",
                    activeCategory === cat 
                      ? "bg-blue-50 border-[#1E90FF] text-[#1E90FF] shadow-sm" 
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  )}
                >
                  <span className="text-lg">{getCategoryIcon(cat)}</span>
                  {cat}
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Menu Grid */}
        <ScrollArea className="flex-1 p-6 bg-[#F8F9FB]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
            {filteredItems.map(item => (
              <MenuItemCard key={item.id} item={item} />
            ))}
            {filteredItems.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Utensils size={40} className="opacity-20" />
                </div>
                <p className="font-bold text-lg">No dishes found</p>
                <p className="text-sm">Try searching for something else</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Column: Checkout */}
      <div className="w-[420px] bg-white border-l border-slate-100 flex flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-[#1E90FF]" size={24} />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Order Details</h2>
          </div>
          <span className="bg-blue-50 text-[#1E90FF] text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            {takeawayCart.reduce((a, b) => a + b.quantity, 0)} Items
          </span>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-8">
            {/* Cart Items */}
            <div className="space-y-4">
              {takeawayCart.length > 0 ? (
                takeawayCart.map(item => (
                  <div key={item.cartItemId} className="flex justify-between items-start group">
                    <div className="flex-1 pr-4">
                      <p className="font-bold text-slate-800 text-[15px]">{item.name}</p>
                      <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-tight">₹{item.price} x {item.quantity}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-black text-slate-900">₹{item.price * item.quantity}</p>
                      <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1 border border-slate-200">
                        <button onClick={() => decrementTakeawayCartItem(item.cartItemId)} className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-white rounded transition-colors"><Minus size={12}/></button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => incrementTakeawayCartItem(item.cartItemId)} className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-white rounded transition-colors"><Plus size={12}/></button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                   <p className="text-slate-400 font-bold">Your cart is empty</p>
                </div>
              )}
            </div>

            {/* Customer Details */}
            <div className="bg-[#F8F9FB] rounded-[24px] p-5 space-y-4 border border-slate-100">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <User size={16} className="text-[#1E90FF]" />
                Customer Details
              </h3>
              <div className="space-y-3">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="w-full h-12 bg-white border border-slate-200 rounded-xl pl-10 pr-4 focus:outline-none focus:border-[#1E90FF] transition-all font-bold text-slate-900 placeholder:text-slate-400"
                    value={customerPhone}
                    maxLength={10}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setCustomerPhone(val);
                      if (val === '9876543210') {
                        setIsRegularCustomer(true);
                        setCustomerName('John Doe');
                      } else if (val.length === 10) {
                        setIsRegularCustomer(false);
                      }
                    }}
                  />
                </div>
                {customerPhone.length === 10 && (
                  <div className="animate-in slide-in-from-top-2">
                    {isRegularCustomer ? (
                      <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Star className="text-[#1E90FF] fill-[#1E90FF]" size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-blue-900 uppercase">Regular Customer</p>
                          <p className="text-sm font-bold text-slate-700">{customerName}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-50/50 p-3 rounded-xl border border-green-100 flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Sparkles className="text-green-600" size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-green-900 uppercase">New Customer</p>
                          <p className="text-sm font-bold text-slate-700">First time visit</p>
                        </div>
                      </div>
                    )}
                    <input 
                      type="text" 
                      placeholder="Customer Name" 
                      className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 focus:outline-none focus:border-[#1E90FF] transition-all font-bold text-slate-900"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Offers & Discounts */}
            <div className="space-y-4">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <TagIcon size={16} className="text-[#1E90FF]" />
                Offers & Discounts
              </h3>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {['OFFLINE10', 'FLAT50'].map(code => (
                  <button 
                    key={code}
                    onClick={() => {
                      setAppliedOffer(appliedOffer === code ? null : code);
                      setDiscountType(null);
                    }}
                    className={cn(
                      "shrink-0 px-4 py-2 rounded-xl border font-bold text-xs transition-all",
                      appliedOffer === code 
                        ? "bg-green-50 border-green-500 text-green-700 shadow-sm" 
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    )}
                  >
                    {code}
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setDiscountType(discountType === 'percentage' ? null : 'percentage');
                    setAppliedOffer(null);
                  }}
                  className={cn(
                    "h-10 rounded-xl font-bold border text-xs transition-all",
                    discountType === 'percentage' ? "bg-blue-50 border-[#1E90FF] text-[#1E90FF]" : "bg-white border-slate-200 text-slate-500"
                  )}
                >
                  Percentage (%)
                </button>
                <button
                  onClick={() => {
                    setDiscountType(discountType === 'fixed' ? null : 'fixed');
                    setAppliedOffer(null);
                  }}
                  className={cn(
                    "h-10 rounded-xl font-bold border text-xs transition-all",
                    discountType === 'fixed' ? "bg-blue-50 border-[#1E90FF] text-[#1E90FF]" : "bg-white border-slate-200 text-slate-500"
                  )}
                >
                  Fixed Amount (₹)
                </button>
              </div>
              {discountType && (
                <div className="animate-in slide-in-from-top-2">
                  <input
                    type="number"
                    placeholder={discountType === 'percentage' ? "Enter percentage" : "Enter amount"}
                    className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 focus:outline-none focus:border-[#1E90FF] font-bold text-slate-900"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Footer: Billing & Pay */}
        <div className="p-6 border-t border-slate-100 space-y-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-bold text-slate-500">
              <span>Item Total</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                <span>Total Discount</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-slate-500">
              <span>Tax (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Payable Amount</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">₹{netTotal.toFixed(2)}</h3>
            </div>
            <button 
              disabled={takeawayCart.length === 0 || isPlacingOrder}
              onClick={handlePlaceOrder}
              className={cn(
                "h-16 px-10 rounded-[22px] font-black text-lg transition-all active:scale-95 flex items-center gap-3 shadow-xl",
                takeawayCart.length > 0 
                  ? "bg-[#1E90FF] text-white hover:brightness-110 shadow-blue-500/30" 
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              )}
            >
              {isPlacingOrder ? <Loader2 className="animate-spin" size={24} /> : "PAY NOW"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const TagIcon = ({ size, className }: { size: number, className: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
  </svg>
);

export default function TakeawayPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-[#1E90FF] animate-spin" />
          <p className="font-bold text-slate-400 animate-pulse uppercase tracking-widest">Loading POS...</p>
        </div>
      </div>
    }>
      <TakeawayPageContent />
    </Suspense>
  );
}
