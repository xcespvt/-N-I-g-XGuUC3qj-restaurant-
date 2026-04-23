"use client";

import { useState, useMemo, Suspense, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  Coins,
  SlidersHorizontal,
  ChevronDown
} from "lucide-react";
import { useAppStore } from "@/context/useAppStore";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { VoiceSearchModal } from "@/components/voice-search-modal";
import { useToast } from "@/hooks/use-toast";
import { CustomizationBottomSheet } from "@/components/customization-bottom-sheet";

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
              onClick={() => {
                // If this component was used, it would need access to setSelectedAddonItem
                // For now, I'll update the logic to be consistent with the rest of the page
                if (typeof window !== 'undefined') {
                   // This is a placeholder since we aren't using this component currently
                }
              }}
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
  const { menuItems, takeawayCart, categories, addToTakeawayCart, incrementTakeawayCartItem, decrementTakeawayCartItem, removeFromTakeawayCart, addOrder } = useAppStore();
  
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
  const [selectedAddonItem, setSelectedAddonItem] = useState<any>(null);
  const { toast } = useToast();

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
    <div className="flex h-full bg-[#F8F9FB] overflow-hidden">
      {/* Left Column: Menu */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Search Bar (Adapted from RestaurantDetailView) */}
        <div className="px-4 md:px-6 pt-4 md:pt-6 mb-4 md:mb-6">
          <div className="flex items-center gap-2 relative z-10">
            <div className="flex-1 flex items-center justify-between px-4 py-1.5 bg-white border border-slate-200 rounded-[1.25rem] shadow-sm transition-all focus-within:border-slate-300">
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-5 h-5 text-slate-900 stroke-[2.5] shrink-0" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for dishes" 
                  className="w-full py-2 bg-transparent text-slate-700 font-medium text-base focus:outline-none placeholder:text-slate-500"
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

        {/* Filters (Adapted from RestaurantDetailView) */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-4 md:mb-8 px-4 md:px-6 pb-1">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white transition-colors shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-gray-700" />
            <span className="text-[15px] font-medium text-gray-700">Sort</span>
          </button>
          
          <button 
            onClick={() => setActiveCategory(activeCategory === 'Veg' ? 'All' : 'Veg')}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-full border transition-colors shrink-0", activeCategory === 'Veg' ? 'border-[#00bd6f] bg-[#e6fcf1]' : 'border-gray-200 bg-white')}
          >
            <div className="w-4 h-4 border border-green-600 flex items-center justify-center rounded-sm bg-white">
              <div className="w-2 h-2 bg-green-600 rounded-full" />
            </div>
            <span className={cn("text-[15px] font-medium", activeCategory === 'Veg' ? 'text-[#00bd6f]' : 'text-gray-700')}>Pure Veg</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white transition-colors shrink-0">
            <span className="text-[15px] font-medium text-gray-700">Ratings 4.0+</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white transition-colors shrink-0">
            <span className="text-[15px] font-medium text-gray-700">Best Seller</span>
          </button>
        </div>

        {/* Menu Grid (Adapted from RestaurantDetailView) */}
        <ScrollArea className="flex-1 px-4 md:px-6 bg-white">
          <div className="space-y-10 pb-32">
            {categories.map((category) => {
              const categoryItems = filteredItems.filter(item => item.category === category);
              if (categoryItems.length === 0) return null;
              return (
                <div key={category} className="border-b border-gray-100 pb-8 last:border-0">
                   <div className="flex items-center justify-between mb-6 px-2">
                      <div>
                        <h3 className="text-[20px] font-black text-slate-900 tracking-tight">{category}</h3>
                        <p className="text-[13px] text-slate-500 font-bold mt-0.5">{categoryItems.length} ITEMS</p>
                      </div>
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                   </div>

                    <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory no-scrollbar -mx-6 px-6">
                      {categoryItems.map((item) => {
                        const cartItem = takeawayCart.find(c => c.id === item.id);
                        const quantity = cartItem?.quantity || 0;
                        
                        return (
                          <div 
                            key={item.id} 
                            className={cn(
                              "relative flex flex-col p-2 rounded-[24px] border transition-all shrink-0 w-[180px] snap-start",
                              quantity > 0 
                                ? 'border-[#00bd6f] bg-[#f4fdf8] shadow-[0_4px_20px_rgba(0,189,111,0.08)]' 
                                : 'border-slate-100 bg-white shadow-sm hover:shadow-md'
                            )}
                          >
                            {/* Image Section */}
                            <div className="relative w-full aspect-[4/3] rounded-[18px] overflow-hidden bg-slate-50 mb-3">
                              <img src={item.image || "https://placehold.co/300x200?text=" + item.name} alt={item.name} className="w-full h-full object-cover" />
                              <div className="absolute top-2 left-2 bg-white/95 p-1 rounded-md shadow-sm">
                                <div className={`w-3 h-3 border flex items-center justify-center rounded-sm ${item.dietaryType === 'Veg' ? 'border-green-600' : 'border-red-600'}`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${item.dietaryType === 'Veg' ? 'bg-green-600' : 'bg-red-600'}`} />
                                </div>
                              </div>
                              <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg text-slate-900 shadow-sm">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-[11px] font-bold">4.3</span>
                              </div>
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 mb-3 px-1">
                              <h4 className="text-[15px] font-black text-slate-900 leading-tight mb-1 line-clamp-1">{item.name}</h4>
                              <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug font-medium">Delicious freshly prepared {item.name.toLowerCase()}.</p>
                            </div>

                            {/* Action Section */}
                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50 px-1 pb-1">
                              <span className="text-[16px] font-black text-slate-900">₹{item.price}</span>
                              
                              {quantity > 0 ? (
                                <div className="flex items-center justify-between bg-[#00bd6f] rounded-xl h-8 px-1 min-w-[70px] shadow-sm">
                                  <button onClick={() => decrementTakeawayCartItem(cartItem!.cartItemId)} className="w-7 h-full flex items-center justify-center text-white active:scale-95">
                                    <Minus className="w-3.5 h-3.5 stroke-[3]" />
                                  </button>
                                  <span className="text-[13px] font-bold text-white">{quantity}</span>
                                  <button onClick={() => incrementTakeawayCartItem(cartItem!.cartItemId)} className="w-7 h-full flex items-center justify-center text-white active:scale-95">
                                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => setSelectedAddonItem(item)}
                                  className="px-4 h-8 rounded-xl font-black text-[11px] flex items-center justify-center bg-white text-[#00bd6f] border border-[#00bd6f]/30 hover:bg-[#f4fdf8] active:scale-95 transition-all shadow-sm"
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

      {/* Floating Bottom Cart Bar */}
      {takeawayCart.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-50">
          <div className="bg-slate-900 rounded-[28px] p-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-800 animate-in slide-in-from-bottom-10 duration-500">
            <div className="flex items-center gap-4 pl-2">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <ShoppingBag size={22} />
              </div>
              <div>
                <div className="text-[15px] font-black text-white leading-tight">
                  {takeawayCart.reduce((a, b) => a + b.quantity, 0)} Items
                </div>
                <div className="text-[13px] font-bold text-blue-400">Total ₹{netTotal.toFixed(2)}</div>
              </div>
            </div>
            
            <button 
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="bg-white text-slate-900 px-8 h-12 rounded-full font-black text-[14px] flex items-center gap-2 hover:bg-blue-50 transition-colors active:scale-95 shadow-xl"
            >
              {isPlacingOrder ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  PLACE ORDER
                  <ArrowLeft className="rotate-180 w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Customization Overlay */}
      <AnimatePresence>
        {selectedAddonItem && (
          <CustomizationBottomSheet 
            item={selectedAddonItem}
            onClose={() => setSelectedAddonItem(null)}
            onAddToCart={(cartItem: any) => {
              // Add main item with variant
              addToTakeawayCart(
                cartItem.item, 
                cartItem.mainQuantity, 
                cartItem.variant.name, 
                cartItem.variant.price
              );
              
              // Add selected addons/sides if any
              if (cartItem.selectedAddons) {
                cartItem.selectedAddons.forEach((addon: any) => {
                  addToTakeawayCart(
                    { 
                      ...addon, 
                      id: Math.floor(Math.random() * 1000000), // Numeric ID
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
                      id: Math.floor(Math.random() * 1000000), // Numeric ID
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
