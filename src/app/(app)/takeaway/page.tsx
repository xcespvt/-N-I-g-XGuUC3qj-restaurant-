"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Mic,
  Plus,
  Minus,
  ArrowLeft,
  Star,
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
  Coins,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  MapPin
} from "lucide-react";
import { useAppStore } from "@/context/useAppStore";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { VoiceSearchModal } from "@/components/voice-search-modal";
import { useToast } from "@/hooks/use-toast";
import { CustomizationBottomSheet } from "@/components/customization-bottom-sheet";

// --- Components ---

function TakeawayPageContent() {
  const { menuItems, takeawayCart, categories, addToTakeawayCart, incrementTakeawayCartItem, decrementTakeawayCartItem, removeFromTakeawayCart, addOrder } = useAppStore();
  
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [showCart, setShowCart] = useState(false);
  
  // Checkout State
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [appliedOffer, setAppliedOffer] = useState<string | null>(null);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed' | null>(null);
  const [discountValue, setDiscountValue] = useState("");
  const [orderType, setOrderType] = useState<'takeaway' | 'dine-in'>('takeaway');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [selectedAddonItem, setSelectedAddonItem] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const { toast } = useToast();

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVeg = activeCategory === 'Veg' ? item.dietaryType === 'Veg' : true;
      return matchesCategory && matchesSearch && matchesVeg && item.available;
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

  // Order Confirmation Overlay
  if (orderConfirmed) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#1E90FF] flex flex-col items-center justify-center p-6 animate-in fade-in">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mb-6 animate-bounce shadow-2xl">
          <CheckCircle2 size={40} className="md:w-12 md:h-12 text-[#1E90FF]" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight text-center">ORDER PLACED!</h2>
        <p className="text-blue-100 mb-8 text-base md:text-lg font-medium opacity-80 text-center">The kitchen has started preparing the order.</p>
        
        <div className="w-full max-w-sm space-y-3 md:space-y-4">
          <button className="w-full h-[56px] md:h-[64px] bg-white text-[#1E90FF] rounded-[16px] md:rounded-[20px] font-bold text-base md:text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl hover:bg-blue-50">
            <Printer size={20} className="md:w-6 md:h-6" />
            Print KOT
          </button>
          <button className="w-full h-[56px] md:h-[64px] bg-blue-700 text-white border border-blue-500 rounded-[16px] md:rounded-[20px] font-bold text-base md:text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl hover:bg-blue-800">
            <Receipt size={20} className="md:w-6 md:h-6" />
            Print Invoice
          </button>
          <Link 
            href="/dashboard"
            className="w-full h-[56px] md:h-[64px] bg-transparent text-white rounded-[16px] md:rounded-[20px] font-bold text-base md:text-lg flex items-center justify-center mt-4 hover:bg-white/10 transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#F8F9FB] overflow-hidden">
      {/* Left Column: Menu */}
      <div className="flex-1 flex flex-col min-w-0 bg-white lg:rounded-r-2xl lg:shadow-sm lg:mr-4 lg:my-4 lg:ml-4 overflow-hidden">
        {/* Header */}
        <div className="px-4 md:px-6 pt-4 md:pt-6 pb-2 md:pb-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">New Order</h1>
            <p className="text-xs md:text-sm font-bold text-slate-400 mt-0.5">{orderType === 'takeaway' ? 'Takeaway' : 'Dine-in'} • {new Date().toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setOrderType(orderType === 'takeaway' ? 'dine-in' : 'takeaway')}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {orderType === 'takeaway' ? '📦 Takeaway' : '🍽️ Dine-in'}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 md:px-6 mb-3 md:mb-4 shrink-0">
          <div className="flex items-center gap-2 relative z-10">
            <div className="flex-1 flex items-center justify-between px-4 py-1.5 bg-white border border-slate-200 rounded-[1.25rem] shadow-sm transition-all focus-within:border-slate-300 focus-within:shadow-md">
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-5 h-5 text-slate-900 stroke-[2.5] shrink-0" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for dishes..." 
                  className="w-full py-2 bg-transparent text-slate-700 font-medium text-base focus:outline-none placeholder:text-slate-400"
                />
              </div>
              <button 
                onClick={() => setShowVoiceSearch(true)}
                className="p-1 -mr-1 text-blue-600 hover:bg-blue-50 rounded-full transition-all active:scale-90"
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar mb-3 md:mb-6 px-4 md:px-6 pb-1 shrink-0">
          <button className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full border border-gray-200 bg-white transition-colors shrink-0 hover:bg-slate-50">
            <SlidersHorizontal className="w-4 h-4 text-gray-700" />
            <span className="text-[13px] md:text-[15px] font-medium text-gray-700">Sort</span>
          </button>
          
          <button 
            onClick={() => setActiveCategory(activeCategory === 'Veg' ? 'All' : 'Veg')}
            className={cn("flex items-center gap-2 px-3 md:px-4 py-2 rounded-full border transition-colors shrink-0", activeCategory === 'Veg' ? 'border-[#00bd6f] bg-[#e6fcf1]' : 'border-gray-200 bg-white hover:bg-slate-50')}
          >
            <div className="w-4 h-4 border border-green-600 flex items-center justify-center rounded-sm bg-white">
              <div className="w-2 h-2 bg-green-600 rounded-full" />
            </div>
            <span className={cn("text-[13px] md:text-[15px] font-medium", activeCategory === 'Veg' ? 'text-[#00bd6f]' : 'text-gray-700')}>Pure Veg</span>
          </button>

          <button className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full border border-gray-200 bg-white transition-colors shrink-0 hover:bg-slate-50">
            <span className="text-[13px] md:text-[15px] font-medium text-gray-700">Ratings 4.0+</span>
          </button>

          <button className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full border border-gray-200 bg-white transition-colors shrink-0 hover:bg-slate-50">
            <span className="text-[13px] md:text-[15px] font-medium text-gray-700">Best Seller</span>
          </button>
        </div>

        {/* Category Pills - Mobile Only */}
        <div className="flex md:hidden items-center gap-2 overflow-x-auto no-scrollbar px-4 pb-3 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                const el = document.getElementById(`category-${cat}`);
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={cn(
                "px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all border",
                activeCategory === cat 
                  ? 'bg-[#1E90FF] text-white border-[#1E90FF] shadow-md shadow-blue-500/20' 
                  : 'bg-white text-slate-600 border-slate-200'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <ScrollArea className="flex-1 px-4 md:px-6 bg-white">
          <div className="space-y-8 md:space-y-10 pb-32 md:pb-8">
            {categories.map((category) => {
              const categoryItems = filteredItems.filter(item => item.category === category);
              if (categoryItems.length === 0) return null;

              return (
                <div key={category} id={`category-${category}`} className="border-b border-gray-100 pb-6 md:pb-8 last:border-0">
                   <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
                      <div>
                        <h3 className="text-lg md:text-[20px] font-black text-slate-900 tracking-tight">{category}</h3>
                        <p className="text-xs md:text-[13px] text-slate-500 font-bold mt-0.5">{categoryItems.length} ITEMS</p>
                      </div>
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                   </div>

                   {/* Mobile: Horizontal scroll cards */}
                   <div className="flex overflow-x-auto gap-3 md:gap-4 pb-4 snap-x snap-mandatory no-scrollbar -mx-4 md:-mx-6 px-4 md:px-6 md:hidden">
                      {categoryItems.map((item) => {
                        const cartItem = takeawayCart.find(c => c.id === item.id);
                        const quantity = cartItem?.quantity || 0;
                        
                        return (
                          <div 
                            key={item.id} 
                            className={cn(
                              "relative flex flex-col p-2 rounded-[20px] border transition-all shrink-0 w-[150px] snap-start",
                              quantity > 0 
                                ? 'border-[#00bd6f] bg-[#f4fdf8] shadow-[0_4px_20px_rgba(0,189,111,0.08)]' 
                                : 'border-slate-100 bg-white shadow-sm'
                            )}
                          >
                            <div className="relative w-full aspect-[4/3] rounded-[14px] overflow-hidden bg-slate-50 mb-2">
                              <img src={item.image || "https://placehold.co/300x200?text=" + item.name} alt={item.name} className="w-full h-full object-cover" />
                              <div className="absolute top-2 left-2 bg-white/95 p-1 rounded-md shadow-sm">
                                <div className={`w-3 h-3 border flex items-center justify-center rounded-sm ${item.dietaryType === 'Veg' ? 'border-green-600' : 'border-red-600'}`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${item.dietaryType === 'Veg' ? 'bg-green-600' : 'bg-red-600'}`} />
                                </div>
                              </div>
                              <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg text-slate-900 shadow-sm">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-[10px] font-bold">4.3</span>
                              </div>
                            </div>

                            <div className="flex-1 mb-2 px-1">
                              <h4 className="text-[13px] font-black text-slate-900 leading-tight mb-0.5 line-clamp-1">{item.name}</h4>
                              <p className="text-[10px] text-slate-500 line-clamp-2 leading-snug font-medium">Freshly prepared</p>
                            </div>

                            <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50 px-1 pb-1">
                              <span className="text-[14px] font-black text-slate-900">₹{item.price}</span>
                              
                              {quantity > 0 ? (
                                <div className="flex items-center justify-between bg-[#00bd6f] rounded-xl h-7 px-0.5 min-w-[64px] shadow-sm">
                                  <button onClick={() => decrementTakeawayCartItem(cartItem!.cartItemId)} className="w-6 h-full flex items-center justify-center text-white active:scale-95">
                                    <Minus className="w-3 h-3 stroke-[3]" />
                                  </button>
                                  <span className="text-[12px] font-bold text-white">{quantity}</span>
                                  <button onClick={() => incrementTakeawayCartItem(cartItem!.cartItemId)} className="w-6 h-full flex items-center justify-center text-white active:scale-95">
                                    <Plus className="w-3 h-3 stroke-[3]" />
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => setSelectedAddonItem(item)}
                                  className="px-3 h-7 rounded-xl font-black text-[10px] flex items-center justify-center bg-white text-[#00bd6f] border border-[#00bd6f]/30 hover:bg-[#f4fdf8] active:scale-95 transition-all shadow-sm"
                                >
                                  ADD
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                   </div>

                   {/* Desktop: Grid cards */}
                   <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryItems.map((item) => {
                        const cartItem = takeawayCart.find(c => c.id === item.id);
                        const quantity = cartItem?.quantity || 0;
                        
                        return (
                          <div 
                            key={item.id} 
                            className={cn(
                              "relative flex flex-col p-3 rounded-[24px] border transition-all",
                              quantity > 0 
                                ? 'border-[#00bd6f] bg-[#f4fdf8] shadow-[0_4px_20px_rgba(0,189,111,0.08)]' 
                                : 'border-slate-100 bg-white shadow-sm hover:shadow-md'
                            )}
                          >
                            <div className="relative w-full aspect-[16/10] rounded-[18px] overflow-hidden bg-slate-50 mb-3">
                              <img src={item.image || "https://placehold.co/300x200?text=" + item.name} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                              <div className="absolute top-3 left-3 bg-white/95 p-1.5 rounded-lg shadow-sm">
                                <div className={`w-4 h-4 border flex items-center justify-center rounded-sm ${item.dietaryType === 'Veg' ? 'border-green-600' : 'border-red-600'}`}>
                                  <div className={`w-2 h-2 rounded-full ${item.dietaryType === 'Veg' ? 'bg-green-600' : 'bg-red-600'}`} />
                                </div>
                              </div>
                              <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-slate-900 shadow-sm">
                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-bold">4.3</span>
                              </div>
                            </div>

                            <div className="flex-1 mb-3 px-1">
                              <h4 className="text-[15px] font-black text-slate-900 leading-tight mb-1">{item.name}</h4>
                              <p className="text-xs text-slate-500 line-clamp-2 leading-snug font-medium">Freshly prepared {item.name.toLowerCase()} with premium ingredients.</p>
                            </div>

                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50 px-1 pb-1">
                              <span className="text-[17px] font-black text-slate-900">₹{item.price}</span>
                              
                              {quantity > 0 ? (
                                <div className="flex items-center justify-between bg-[#00bd6f] rounded-xl h-9 px-1 min-w-[80px] shadow-sm">
                                  <button onClick={() => decrementTakeawayCartItem(cartItem!.cartItemId)} className="w-8 h-full flex items-center justify-center text-white active:scale-95 hover:bg-white/20 rounded-lg transition-colors">
                                    <Minus className="w-3.5 h-3.5 stroke-[3]" />
                                  </button>
                                  <span className="text-[13px] font-bold text-white">{quantity}</span>
                                  <button onClick={() => incrementTakeawayCartItem(cartItem!.cartItemId)} className="w-8 h-full flex items-center justify-center text-white active:scale-95 hover:bg-white/20 rounded-lg transition-colors">
                                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => setSelectedAddonItem(item)}
                                  className="px-5 h-9 rounded-xl font-black text-[12px] flex items-center justify-center bg-white text-[#00bd6f] border border-[#00bd6f]/30 hover:bg-[#f4fdf8] active:scale-95 transition-all shadow-sm"
                                >
                                  ADD
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                   </div>
                </div>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Utensils size={40} className="opacity-20" />
                </div>
                <p className="font-bold text-lg text-slate-900">No dishes found</p>
                <p className="text-sm font-medium">Try searching for something else</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Column: Cart Sidebar - Desktop */}
      <div className={cn(
        "hidden lg:flex flex-col w-[420px] bg-white border-l border-slate-100 shrink-0",
        "lg:rounded-l-2xl lg:shadow-sm lg:my-4 lg:mr-4 overflow-hidden"
      )}>
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Order Summary</h2>
          <p className="text-xs font-bold text-slate-400 mt-0.5">{takeawayCart.length} items in cart</p>
        </div>

        <ScrollArea className="flex-1 px-6">
          <div className="py-4 space-y-4">
            {takeawayCart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <ShoppingBag size={48} className="opacity-20 mb-3" />
                <p className="font-bold text-sm">Your cart is empty</p>
                <p className="text-xs">Add items to get started</p>
              </div>
            ) : (
              takeawayCart.map((item) => (
                <div key={item.cartItemId} className="flex gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-100 overflow-hidden shrink-0">
                    <img src={item.image || "https://placehold.co/100x100?text=" + item.name} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                    <p className="text-xs text-slate-500">{item.variant || 'Regular'}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-black text-slate-900">₹{item.price * item.quantity}</span>
                      <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-1">
                        <button onClick={() => decrementTakeawayCartItem(item.cartItemId)} className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-[#00bd6f]">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => incrementTakeawayCartItem(item.cartItemId)} className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-[#00bd6f]">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromTakeawayCart(item.cartItemId)}
                    className="text-slate-300 hover:text-red-500 transition-colors self-start"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Cart Footer - Desktop */}
        {takeawayCart.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
            {/* Customer Details */}
            <div className="space-y-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer Name"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/10 transition-all"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="tel" 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/10 transition-all"
                />
              </div>
            </div>

            {/* Bill Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold">₹{cartTotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>GST (5%)</span>
                <span className="font-bold">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span>₹{netTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="w-full h-14 bg-[#1E90FF] text-white rounded-2xl font-black text-base flex items-center justify-center gap-3 hover:bg-blue-600 active:scale-95 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
            >
              {isPlacingOrder ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  PLACE ORDER
                  <ArrowLeft className="rotate-180 w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Cart Bottom Sheet */}
      <AnimatePresence>
        {showCart && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setShowCart(false)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
              </div>
              
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Order Summary</h2>
                  <p className="text-xs font-bold text-slate-400">{takeawayCart.length} items</p>
                </div>
                <button onClick={() => setShowCart(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              <ScrollArea className="flex-1 px-6 py-4">
                <div className="space-y-4">
                  {takeawayCart.map((item) => (
                    <div key={item.cartItemId} className="flex gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-14 h-14 rounded-xl bg-white border border-slate-100 overflow-hidden shrink-0">
                        <img src={item.image || "https://placehold.co/100x100?text=" + item.name} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                        <p className="text-[11px] text-slate-500">{item.variant || 'Regular'}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-black text-slate-900">₹{item.price * item.quantity}</span>
                          <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-1">
                            <button onClick={() => decrementTakeawayCartItem(item.cartItemId)} className="w-6 h-6 flex items-center justify-center text-slate-600 active:scale-95">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => incrementTakeawayCartItem(item.cartItemId)} className="w-6 h-6 flex items-center justify-center text-slate-600 active:scale-95">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromTakeawayCart(item.cartItemId)}
                        className="text-slate-300 hover:text-red-500 transition-colors self-start"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Mobile Cart Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Customer Name"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:border-[#1E90FF] transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="tel" 
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Phone Number"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:border-[#1E90FF] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-bold">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>GST (5%)</span>
                    <span className="font-bold">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total</span>
                    <span>₹{netTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="w-full h-14 bg-[#1E90FF] text-white rounded-2xl font-black text-base flex items-center justify-center gap-3 hover:bg-blue-600 active:scale-95 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
                >
                  {isPlacingOrder ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      PLACE ORDER
                      <ArrowLeft className="rotate-180 w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Floating Cart Bar */}
      {takeawayCart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-50 lg:hidden">
          <button 
            onClick={() => setShowCart(true)}
            className="w-full bg-slate-900 rounded-[24px] p-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-800 animate-in slide-in-from-bottom-10 duration-500"
          >
            <div className="flex items-center gap-3 pl-1">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <ShoppingBag size={20} />
              </div>
              <div>
                <div className="text-[13px] font-black text-white leading-tight">
                  {takeawayCart.reduce((a, b) => a + b.quantity, 0)} Items
                </div>
                <div className="text-[11px] font-bold text-blue-400">Total ₹{netTotal.toFixed(2)}</div>
              </div>
            </div>
            
            <div className="bg-white text-slate-900 px-5 h-10 rounded-full font-black text-[12px] flex items-center gap-2 shadow-xl">
              VIEW CART
              <ArrowLeft className="rotate-180 w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Customization Overlay */}
      <AnimatePresence>
        {selectedAddonItem && (
          <CustomizationBottomSheet 
            item={selectedAddonItem}
            onClose={() => setSelectedAddonItem(null)}
            onAddToCart={(cartItem: any) => {
              addToTakeawayCart(
                cartItem.item, 
                cartItem.mainQuantity, 
                cartItem.variant.name, 
                cartItem.variant.price
              );
              
              if (cartItem.selectedAddons) {
                cartItem.selectedAddons.forEach((addon: any) => {
                  addToTakeawayCart(
                    { 
                      ...addon, 
                      id: Math.floor(Math.random() * 1000000),
                      category: 'Add-ons', 
                      image: '', 
                      dietaryType: 'Veg',
                      description: addon.description || '',
                      aiHint: addon.name.toLowerCase()
                    } as any, 
                    addon.quantity,
                    'Regular',
                    addon.price
                  );
                });
              }

              if (cartItem.selectedSides) {
                cartItem.selectedSides.forEach((side: any) => {
                  addToTakeawayCart(
                    { 
                      ...side, 
                      id: Math.floor(Math.random() * 1000000),
                      category: 'Beverages', 
                      image: '', 
                      dietaryType: 'Veg',
                      description: side.description || '',
                      aiHint: side.name.toLowerCase()
                    } as any, 
                    side.quantity,
                    'Regular',
                    side.price
                  );
                });
              }

              setSelectedAddonItem(null);
              toast({
                title: "Added to Cart",
                description: `${cartItem.item.name} added successfully.`
              });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

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