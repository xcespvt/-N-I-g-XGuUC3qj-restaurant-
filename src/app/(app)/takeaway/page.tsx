"use client";

import { useState, useMemo, Suspense, useRef, useEffect } from "react";
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
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useAppStore } from "@/context/useAppStore";
import { useGet, useMutationRequestDynamic, useQueryHelpers, useInfiniteGet } from "@/hooks/useApi";
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

const MenuItemCardWrapper = ({
  item,
  takeawayCart,
  setSelectedAddonItem,
  decrementTakeawayCartItem,
  incrementTakeawayCartItem
}: {
  item: any,
  takeawayCart: any[],
  setSelectedAddonItem: (item: any) => void,
  decrementTakeawayCartItem: (id: string) => void,
  incrementTakeawayCartItem: (id: string) => void
}) => {
  const matchingItems = item.id ? takeawayCart.filter(c => c.id === item.id) : [];
  const quantity = matchingItems.reduce((sum, c) => sum + c.quantity, 0);
  const cartItem = matchingItems[0];

  return (
    <div
      className={cn(
        "relative flex flex-col p-2 rounded-[24px] border transition-all shrink-0 w-[180px] snap-start",
        quantity > 0
          ? 'border-[#1E90FF] bg-[#eff6ff] shadow-[0_4px_20px_rgba(30,144,255,0.08)]'
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
          <div className="flex items-center justify-between bg-[#1E90FF] rounded-xl h-8 px-1 min-w-[70px] shadow-sm">
            <button onClick={() => decrementTakeawayCartItem(cartItem!.cartItemId)} className="w-7 h-full flex items-center justify-center text-white active:scale-95">
              <Minus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
            <span className="text-[13px] font-bold text-white">{quantity}</span>
            <button onClick={() => setSelectedAddonItem(item)} className="w-7 h-full flex items-center justify-center text-white active:scale-95">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSelectedAddonItem(item)}
            className="px-4 h-8 rounded-xl font-black text-[11px] flex items-center justify-center bg-white text-[#1E90FF] border border-[#1E90FF]/30 hover:bg-[#eff6ff] active:scale-95 transition-all shadow-sm"
          >
            ADD
          </button>
        )}
      </div>
    </div>
  );
};

const CategorySliderRow = ({
  category,
  categoryItems,
  takeawayCart,
  setSelectedAddonItem,
  decrementTakeawayCartItem,
  incrementTakeawayCartItem
}: any) => {
  const constraintsRef = useRef(null);

  return (
    <div key={category} className="border-b border-gray-100 pb-8 last:border-0">
      <div className="flex items-center justify-between mb-6 px-2">
        <div>
          <h3 className="text-[20px] font-black text-slate-900 tracking-tight">{category}</h3>
          <p className="text-[13px] text-slate-500 font-bold mt-0.5">{categoryItems.length} ITEMS</p>
        </div>
        <ChevronDown className="w-5 h-5 text-slate-400" />
      </div>

      <div className="relative">
        {/* Mobile: Draggable Slider */}
        <div className="md:hidden -mx-6 px-6 overflow-hidden" ref={constraintsRef}>
          <motion.div
            drag="x"
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={true}
            className="flex gap-4 pb-4 cursor-grab active:cursor-grabbing"
            style={{ width: "fit-content" }}
          >
            {categoryItems.map((item: any) => (
              <div key={item.id} className="snap-start shrink-0">
                <MenuItemCardWrapper
                  item={item}
                  takeawayCart={takeawayCart}
                  setSelectedAddonItem={setSelectedAddonItem}
                  decrementTakeawayCartItem={decrementTakeawayCartItem}
                  incrementTakeawayCartItem={incrementTakeawayCartItem}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Desktop: Native Scroll */}
        <div className="hidden md:flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory no-scrollbar -mx-6 px-6">
          {categoryItems.map((item: any) => (
            <div key={item.id} className="snap-start shrink-0">
              <MenuItemCardWrapper
                item={item}
                takeawayCart={takeawayCart}
                setSelectedAddonItem={setSelectedAddonItem}
                decrementTakeawayCartItem={decrementTakeawayCartItem}
                incrementTakeawayCartItem={incrementTakeawayCartItem}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function TakeawayPageContent() {
  const { menuItems, takeawayCart, categories: storeCategories, branches, selectedBranch, addToTakeawayCart, incrementTakeawayCartItem, decrementTakeawayCartItem, removeFromTakeawayCart, addOrder, clearTakeawayCart } = useAppStore();

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);

  // Checkout State
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isRegularCustomer, setIsRegularCustomer] = useState(false);
  const [discountValue, setDiscountValue] = useState("");
  const [orderType, setOrderType] = useState<'takeaway' | 'dine-in'>('takeaway');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Card' | 'Hold' | null>(null);
  const [viewState, setViewState] = useState<'menu' | 'checkout'>('menu');
  const [confirmedOrderDetails, setConfirmedOrderDetails] = useState<any>(null);
  const { toast } = useToast();
  const [selectedAddonItem, setSelectedAddonItem] = useState<any>(null);

  // Get the current branch's restaurantId
  const currentBranch = branches.find(branch => branch.id === selectedBranch);
  const restaurantId = (currentBranch as any)?.restaurantId;

  // API call to fetch menu items from database
  const {
    data: apiMenuDataPages,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useInfiniteGet<{
    success: boolean;
    data: Array<any>;
    pagination: any;
  }>(
    ['menu-items-infinite', restaurantId || ''],
    `/api/menu/getitems/${restaurantId}`,
    { limit: 100 }, // Fetch more items for takeaway
    { enabled: !!restaurantId }
  );

  // Automatically fetch next page to load all items
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten the data
  const apiMenuData = useMemo(() => {
    if (!apiMenuDataPages) return undefined;
    return { data: apiMenuDataPages.pages.flatMap(page => page?.data || []) };
  }, [apiMenuDataPages]);

  const { invalidate } = useQueryHelpers();

  const { mutate: createOrderMutation } = useMutationRequestDynamic<any, any>(
    "POST",
    (variables) => `/api/orders/${selectedBranch}/create`,
    undefined,
    {
      onSuccess: (data) => {
        setIsPlacingOrder(false);
        setShowPaymentModal(false);
        setConfirmedOrderDetails(data.data);
        setOrderConfirmed(true);
        invalidate(['orders', selectedBranch]);
        clearTakeawayCart();
        toast({
          title: "Order Placed",
          description: "Order has been successfully created in the system.",
        });
      },
      onError: (error) => {
        setIsPlacingOrder(false);
        toast({
          title: "Order Failed",
          description: error.message || "Failed to create order. Please try again.",
          variant: "destructive",
        });
      },
    }
  );

  // Transform API data to MenuItem format
  const transformedMenuItems = useMemo(() => {
    if (!apiMenuData?.data) return menuItems;

    return apiMenuData.data.map((item, index) => ({
      id: item.itemId || item._id || item.id || `item-${index}`, // Ensure unique ID
      itemId: item.itemId || item._id,
      name: item.name || '',
      description: item.description || '',
      price: item.pricing_options?.[0]?.price || 0,
      category: item.category || 'Uncategorized',
      image: item.images?.[0] || "https://placehold.co/300x200.png",
      aiHint: (item.name || '').toLowerCase(),
      available: item.available ?? true,
      dietaryType: (item as any).dietaryType || 'Veg',
      portionOptions: item.pricing_options?.length > 1
        ? item.pricing_options.map((option: any) => ({
          name: option.label,
          price: option.price
        }))
        : undefined,
      pricing_options: item.pricing_options || [],
      allowedAddons: item.allowedAddons || [],
      allowedToppings: item.allowedToppings || []
    }));
  }, [apiMenuData, menuItems]);

  const displayMenuItems = apiMenuData?.data ? transformedMenuItems : menuItems;

  const categories = useMemo(() => {
    if (!apiMenuData?.data) return storeCategories;
    const cats = Array.from(new Set(displayMenuItems.map(item => item.category)));
    return [{ name: "All" }, ...cats.map(c => ({ name: c }))];
  }, [displayMenuItems, storeCategories, apiMenuData]);

  const filteredItems = useMemo(() => {
    return displayMenuItems.filter(item => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch = (item.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch && item.available;
    });
  }, [displayMenuItems, activeCategory, searchQuery]);

  const cartTotal = takeawayCart.reduce((total, item) => {
    const itemBasePrice = item.price * item.quantity;
    const addonsPrice = (item.addons || []).reduce((aTotal, addon) => aTotal + (addon.price * addon.quantity), 0) * item.quantity;
    return total + itemBasePrice + addonsPrice;
  }, 0);

  const discountAmount = 0;

  const subtotal = Math.max(0, cartTotal - discountAmount);
  const tax = subtotal * 0.05;
  const netTotal = subtotal + tax;

  const handlePlaceOrder = () => {
    if (!paymentMethod) return;
    setIsPlacingOrder(true);

    const now = new Date();
    
    const orderPayload = {
      customer: customerName || "Walk-in",
      time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
      date: now.toISOString().split('T')[0],
      status: 'New',
      type: 'Takeaway',
      items: takeawayCart.map(i => ({
        id: String(i.itemId || i.id),
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        portionName: i.portion || 'Regular',
        notes: '',
        addons: i.addons?.map(a => ({
          name: a.name,
          price: a.price,
          quantity: a.quantity
        }))
      })),
      subtotal: cartTotal,
      tax: tax,
      discount: discountAmount,
      total: netTotal,
      source: 'Offline',
      customerDetails: {
        name: customerName || "Walk-in",
        phone: customerPhone || "N/A",
        address: "",
        email: ""
      },
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'Hold' ? 'Pending' : 'Paid'
      }
    };

    createOrderMutation(orderPayload);
  };

  if (orderConfirmed && confirmedOrderDetails) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#1E90FF] flex flex-col items-center justify-center p-6 animate-in fade-in">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 animate-bounce shadow-2xl">
          <CheckCircle2 size={48} className="text-[#1E90FF]" />
        </div>
        <h2 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">ORDER PLACED!</h2>
        <p className="text-blue-100 mb-8 text-lg font-medium opacity-80">The kitchen has started preparing the order.</p>

        <div className="w-full max-w-sm space-y-4">
          <button className="w-full h-[64px] bg-white text-[#1E90FF] rounded-[24px] font-bold text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl hover:bg-blue-50">
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

  if (viewState === 'checkout') {
    return (
      <div className="flex flex-col h-screen bg-slate-50 font-sans animate-in slide-in-from-right duration-500">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center gap-4 sticky top-0 z-10">
          <button 
            onClick={() => setViewState('menu')}
            className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-700 active:scale-95 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Checkout</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-900 mb-4 tracking-tight flex items-center gap-2">
              <ShoppingBag size={18} className="text-[#1E90FF]" />
              Your Order
            </h3>
            <div className="space-y-6">
              {takeawayCart.map(item => (
                <div key={item.cartItemId} className="flex items-center gap-4">
                  {/* Item Image */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                    <img 
                      src={item.image || "https://placehold.co/100x100?text=" + item.name} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-1 right-1 bg-white/95 p-0.5 rounded-sm shadow-sm">
                      <div className={`w-2.5 h-2.5 border flex items-center justify-center rounded-sm ${item.dietaryType === 'Veg' ? 'border-green-600' : 'border-red-600'}`}>
                        <div className={`w-1 h-1 rounded-full ${item.dietaryType === 'Veg' ? 'bg-green-600' : 'bg-red-600'}`} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 leading-tight truncate">{item.name}</p>
                        <p className="text-[12px] text-slate-500 mt-1 leading-snug font-medium">
                          {[
                            item.portion !== 'Regular' ? item.portion : null,
                            ...(item.addons?.map(a => a.name) || [])
                          ].filter(Boolean).join(', ')}
                        </p>
                        <p className="font-black text-slate-900 mt-2">
                          ₹{((item.price + (item.addons?.reduce((sum, a) => sum + (a.price * a.quantity), 0) || 0)) * item.quantity).toFixed(0)}
                        </p>
                      </div>

                      {/* Quantity Control */}
                      <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1 border border-slate-100 shrink-0 h-9">
                        <button 
                          onClick={() => decrementTakeawayCartItem(item.cartItemId)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-colors"
                        >
                          <Minus size={12} strokeWidth={3} />
                        </button>
                        <span className="text-sm font-black w-4 text-center text-slate-900">{item.quantity}</span>
                        <button 
                          onClick={() => incrementTakeawayCartItem(item.cartItemId)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-colors"
                        >
                          <Plus size={12} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add more items button */}
              <button 
                onClick={() => setViewState('menu')}
                className="w-full py-4 mt-2 flex items-center justify-center gap-2 text-slate-600 font-bold text-sm bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors"
              >
                <Plus size={16} />
                Add more items
              </button>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-900 mb-4 tracking-tight flex items-center gap-2">
              <User size={18} className="text-[#1E90FF]" />
              Customer Details (Optional)
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  value={customerPhone}
                  maxLength={10}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 10) setCustomerPhone(val);
                  }}
                  className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-[#1E90FF] focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all font-medium"
                />
              </div>
              <input 
                type="text" 
                placeholder="Customer Name" 
                value={customerName} 
                onChange={e => setCustomerName(e.target.value)}
                className="w-full h-14 px-4 rounded-xl border border-slate-200 focus:border-[#1E90FF] focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all font-medium" 
              />
            </div>
          </div>



          {/* Billing Details */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-900 mb-4 tracking-tight">Billing Details</h3>
            <div className="space-y-3 text-sm font-medium">
              <div className="flex justify-between text-slate-500">
                <span>Item Total</span>
                <span className="text-slate-900 font-bold">₹{cartTotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>GST (5%)</span>
                <span className="text-slate-900 font-bold">₹{tax.toFixed(2)}</span>
              </div>
              <div className="pt-4 mt-2 border-t border-slate-50 flex justify-between items-center font-black text-xl text-slate-900">
                <span className="tracking-tight">Net Payable</span>
                <span className="text-[#1E90FF]">₹{netTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
          <button 
            onClick={() => setShowPaymentModal(true)}
            disabled={isPlacingOrder || takeawayCart.length === 0}
            className={cn(
              "w-full h-[64px] rounded-[20px] font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50",
              "bg-[#1E90FF] text-white shadow-blue-500/20"
            )}
          >
            <IndianRupee size={20} />
            Pay ₹{netTotal.toFixed(2)}
          </button>
        </div>

        {/* Payment Details Modal */}
        <AnimatePresence>
          {showPaymentModal && (
            <div className="fixed inset-0 z-[100] flex items-end justify-center">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPaymentModal(false)}
                className="absolute inset-0 bg-black/50" 
              />
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bg-white w-full max-w-md rounded-t-[32px] p-6 pb-10 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Payment Details</h3>
                  <button 
                    onClick={() => setShowPaymentModal(false)} 
                    className="p-2 bg-slate-100 rounded-full text-slate-600 active:scale-90 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>


                <div className="grid grid-cols-2 gap-4 mb-8">
                  {['Cash', 'UPI', 'Card', 'Hold'].map(method => (
                    <button 
                      key={method}
                      onClick={() => setPaymentMethod(method as any)}
                      className={cn(
                        "h-[72px] rounded-[20px] font-black border transition-all flex flex-col items-center justify-center gap-1",
                        paymentMethod === method 
                          ? 'bg-blue-50 border-[#1E90FF] text-[#1E90FF] shadow-sm' 
                          : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                      )}
                    >
                      <span className="text-[15px]">{method}</span>
                    </button>
                  ))}
                </div>

                <button 
                  onClick={handlePlaceOrder}
                  disabled={!paymentMethod || isPlacingOrder}
                  className={cn(
                    "w-full h-[64px] rounded-[20px] font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50",
                    paymentMethod ? 'bg-[#1E90FF] text-white shadow-blue-500/20' : 'bg-slate-200 text-slate-400'
                  )}
                >
                  {isPlacingOrder ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    'Save & Confirm Order'
                  )}
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
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
            className={cn("flex items-center gap-2 px-4 py-2 rounded-full border transition-colors shrink-0", activeCategory === 'Veg' ? 'border-[#1E90FF] bg-[#eff6ff]' : 'border-gray-200 bg-white')}
          >
            <div className="w-4 h-4 border border-green-600 flex items-center justify-center rounded-sm bg-white">
              <div className="w-2 h-2 bg-green-600 rounded-full" />
            </div>
            <span className={cn("text-[15px] font-medium", activeCategory === 'Veg' ? 'text-[#1E90FF]' : 'text-gray-700')}>Pure Veg</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white transition-colors shrink-0">
            <span className="text-[15px] font-medium text-gray-700">Ratings 4.0+</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white transition-colors shrink-0">
            <span className="text-[15px] font-medium text-gray-700">Best Seller</span>
          </button>
        </div>

        <div className="flex-1 px-4 md:px-6 bg-white overflow-y-auto no-scrollbar">
          <div className="space-y-10 pb-32 pt-2">
            {isLoading && (
              <div className="space-y-10">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-4">
                    <div className="h-8 w-40 bg-slate-100 animate-pulse rounded-lg ml-2" />
                    <div className="flex gap-4 overflow-hidden">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="w-[180px] h-[260px] bg-slate-50 animate-pulse rounded-[24px] shrink-0" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!isLoading && categories.map((categoryObj: any) => {
              const categoryName = typeof categoryObj === 'string' ? categoryObj : categoryObj.name;
              const categoryItems = filteredItems.filter(item => item.category === categoryName);
              if (categoryItems.length === 0) return null;
              return (
                <CategorySliderRow
                  key={categoryName}
                  category={categoryName}
                  categoryItems={categoryItems}
                  takeawayCart={takeawayCart}
                  setSelectedAddonItem={setSelectedAddonItem}
                  decrementTakeawayCartItem={decrementTakeawayCartItem}
                  incrementTakeawayCartItem={incrementTakeawayCartItem}
                />
              );
            })}

            {filteredItems.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Utensils size={40} className="opacity-20" />
                </div>
                <p className="font-bold text-lg text-slate-900">No dishes found</p>
                <p className="text-sm font-medium">Try searching for something else</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Cart Bar (Adapted from RestaurantDetailView) */}
      {takeawayCart.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-50">
          <div className="bg-white rounded-[32px] p-4 flex items-center justify-between text-black shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 animate-in slide-in-from-bottom-10 duration-500">
            <div className="flex items-center gap-3">
              <button
                onClick={() => clearTakeawayCart()}
                className="w-11 h-11 flex items-center justify-center bg-red-50 text-red-500 rounded-full active:scale-95 transition-transform"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <div>
                <div className="font-black text-[16px] text-slate-900 leading-none mb-1">
                  {takeawayCart.reduce((a, b) => a + b.quantity, 0)} item{takeawayCart.reduce((a, b) => a + b.quantity, 0) > 1 ? 's' : ''}
                </div>
                <div className="text-[14px] font-bold text-[#1E90FF]">Total ₹{netTotal.toFixed(2)}</div>
              </div>
            </div>
            <button
              onClick={() => setViewState('checkout')}
              className="flex items-center gap-2 font-black text-[15px] bg-[#1E90FF] text-white px-6 h-12 rounded-2xl active:scale-95 transition-all shadow-lg shadow-blue-500/20"
            >
              View Cart <ChevronRight className="w-5 h-5" />
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
              // Only nest true addons (toppings)
              const toppings = (cartItem.selectedAddons || []).map((a: any) => ({
                id: a.id || Math.floor(Math.random() * 1000000),
                name: a.name,
                price: a.price,
                quantity: a.quantity
              }));

              // Add main item with nested toppings
              addToTakeawayCart(
                cartItem.item,
                cartItem.mainQuantity,
                cartItem.variant.name,
                cartItem.variant.price,
                toppings
              );

              // Add sides (beverages etc) as separate items
              if (cartItem.selectedSides) {
                cartItem.selectedSides.forEach((side: any) => {
                  addToTakeawayCart(
                    {
                      ...side,
                      id: side.id || Math.floor(Math.random() * 1000000),
                      category: 'Beverages',
                      image: side.image || '',
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
                description: `${cartItem.item.name} added successfully.`,
                silent: true
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
