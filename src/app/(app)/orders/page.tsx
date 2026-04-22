
"use client"

import { useState, useMemo } from "react";
import { Search, Mic, ShoppingBag, UtensilsCrossed, Calendar } from "lucide-react";
import { useAppStore } from "@/context/useAppStore";
import { OrderCard } from "@/components/order-card";
import { VoiceSearchModal } from "@/components/voice-search-modal";

export default function OrdersPage() {
  const { orders } = useAppStore();
  const [activeOrderTab, setActiveOrderTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);

  const orderTypes = ['All', 'Delivery', 'Offline Orders', 'Dine-in', 'Bookings', 'Preparing', 'Ready to hand over'];

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      // Logic for tabs matches OrdersView.tsx logic
      const matchesTab = activeOrderTab === 'All' 
        ? !["Delivered", "Cancelled", "Rejected"].includes(o.status)
        : activeOrderTab === 'Bookings' 
          ? o.items.some(item => item.category === 'Booking')
          : activeOrderTab === 'Offline Orders'
            ? o.source === 'Offline'
            : activeOrderTab === 'Ready to hand over'
              ? o.status === 'Ready'
              : o.type === activeOrderTab || o.status === activeOrderTab;

      const matchesSearch = 
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        o.customer.toLowerCase().includes(searchQuery.toLowerCase());
        
      return matchesTab && matchesSearch;
    });
  }, [orders, activeOrderTab, searchQuery]);

  return (
    <div className="flex flex-col pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold md:text-3xl">Orders</h1>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
        <input 
          type="text" 
          placeholder="Search Order ID or Customer..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-[52px] bg-white border border-[#E5E7EB] text-[#111827] py-4 pl-12 pr-12 rounded-[16px] focus:outline-none focus:border-[#2563EB] text-[15px] font-medium transition-all shadow-sm"
        />
        <Mic 
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2563EB] cursor-pointer" 
          size={20} 
          onClick={() => setShowVoiceSearch(true)}
        />
      </div>

      <VoiceSearchModal 
        isOpen={showVoiceSearch} 
        onClose={() => setShowVoiceSearch(false)} 
        onResult={(text) => setSearchQuery(text)}
      />

      {/* Category Filter Chips */}
      <div className="flex gap-[8px] overflow-x-auto no-scrollbar mb-6 -mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-wrap">
        {orderTypes.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveOrderTab(tab)}
            className={`h-[36px] px-[14px] rounded-[18px] text-[14px] font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 flex items-center gap-1.5 ${
              activeOrderTab === tab 
                ? 'bg-[#EFF6FF] text-[#2563EB] border-[#EFF6FF]' 
                : 'bg-white border border-[#E5E7EB] text-[#374151]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard 
              key={order.id}
              order={order}
            />
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-[32px] border border-slate-100 border-dashed col-span-full">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                <ShoppingBag size={24} />
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No matching orders</p>
            <p className="text-[10px] font-medium text-slate-300 mt-1">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
