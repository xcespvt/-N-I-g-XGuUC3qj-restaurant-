"use client";

import * as React from "react";
import { Clock, ShoppingBag, User, Package, Users2, Table } from "lucide-react";
import type { Order, OrderStatus } from "@/context/useAppStore";
import { useAppStore } from "@/context/useAppStore";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DeliveryOrderDetails } from "./delivery-order-details";
import { TakeawayDineinOrderDetails } from "./takeaway-dinein-order-details";
import { useIsMobile } from "@/hooks/use-mobile";

const DetailsSheet = ({
  order,
  children,
}: {
  order: Order;
  children: React.ReactNode;
}) => {
  const isDelivery = order.type === "Delivery";
  const isMobile = useIsMobile();
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="p-0 flex flex-col sm:max-w-md" side={isMobile ? "bottom" : "right"} hideCloseButton>
        {isDelivery ? (
          <DeliveryOrderDetails order={order} />
        ) : (
          <TakeawayDineinOrderDetails order={order} />
        )}
      </SheetContent>
    </Sheet>
  );
};

export const OrderCard = ({ order }: { order: Order }) => {
  const { updateOrderStatus } = useAppStore();
  const [remainingTime, setRemainingTime] = React.useState("00:00");
  const [isLate, setIsLate] = React.useState(false);

  // Timer Logic
  React.useEffect(() => {
    const calculateTime = () => {
      const prepMinutes = parseInt(order.prepTime.split(" ")[0], 10) || 15;
      const timeParts = order.time.match(/(\d+):(\d+)\s*([APM]+)/i);
      if (!timeParts) return;

      let hours = parseInt(timeParts[1], 10);
      const minutes = parseInt(timeParts[2], 10);
      const ampm = timeParts[3].toUpperCase();

      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;

      const startTime = new Date(order.date);
      startTime.setHours(hours, minutes, 0, 0);

      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      const remaining = prepMinutes * 60 - elapsed;
      
      setIsLate(remaining < 0);
      
      const absRemaining = Math.abs(remaining);
      const m = Math.floor(absRemaining / 60).toString().padStart(2, "0");
      const s = (absRemaining % 60).toString().padStart(2, "0");
      setRemainingTime(`${remaining < 0 ? '-' : ''}${m}:${s}`);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [order.prepTime, order.time, order.date]);

  const isHighPriority = !isLate && parseInt(remainingTime.split(':')[0]) < 5 && order.status === 'Preparing';

  const btnText = order.status === 'Incoming' || order.status === 'New' ? 'Accept Order' : 
                  order.status === 'Preparing' ? 'Mark as Ready' : 
                  'Handover Order';
                  
  const btnBg = order.status === 'Incoming' || order.status === 'New' ? 'bg-[#2563EB]' : 
                order.status === 'Preparing' ? 'bg-[#22C55E]' : 
                'bg-[#6366F1]';

  const handleUpdateStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    let nextStatus: OrderStatus = order.status;
    if (order.status === 'Incoming' || order.status === 'New') nextStatus = 'Preparing';
    else if (order.status === 'Preparing') nextStatus = 'Ready';
    else if (order.status === 'Ready') nextStatus = 'Delivered';
    
    updateOrderStatus(order.id, nextStatus);
  };

  const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);
  const isBooking = order.items.some((item) => item.category === "Booking");
  const guestCount = isBooking ? order.items[0].name.match(/\d+/)?.[0] : null;
  const tableInfo =
    isBooking || order.type === "Dine-in"
      ? order.customerDetails.address
          .replace("Tables: ", "")
          .replace("Table ", "")
      : null;

  return (
    <DetailsSheet order={order}>
      <div className="bg-[#FFFFFF] rounded-[20px] border border-[#E5E7EB] shadow-sm p-[22px] min-h-[260px] cursor-pointer active:scale-[0.98] transition-all flex flex-col hover:shadow-md">
        {/* Top Section */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[18px] font-bold text-slate-900">{order.id}</h3>
              {isLate && order.status === 'Preparing' && <span className="text-[12px] font-bold text-red-600">⚡ Rush Order</span>}
              {isHighPriority && <span className="text-[12px] font-bold text-orange-600">🔥 High Priority</span>}
            </div>
            <p className="text-[13px] text-[#6B7280]">Today • {order.time}</p>
          </div>
          
          <div className={`h-[36px] px-[12px] rounded-full flex items-center gap-1.5 ${isLate && order.status === 'Preparing' ? 'bg-red-50 text-red-600' : 'bg-[#EFF6FF] text-[#2563EB]'}`}>
            <Clock size={16} />
            <span className="font-semibold text-[14px]">{remainingTime}</span>
          </div>
        </div>

        {/* Status Row */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`h-[28px] px-[10px] rounded-full flex items-center text-[12px] font-medium ${
            order.status === 'Preparing' ? 'bg-[#FEF3C7] text-[#92400E]' : 
            order.status === 'Ready' ? 'bg-[#D1FAE5] text-[#065F46]' :
            'bg-slate-100 text-slate-700'
          }`}>
            {order.status}
          </div>
          <div className="h-[28px] px-[10px] rounded-full flex items-center text-[12px] font-medium bg-[#DBEAFE] text-[#2563EB]">
            {order.type}
          </div>
        </div>

        {/* Customer + Amount Row */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-[15px] font-medium text-slate-900 truncate mr-4">{order.customer}</span>
          <span className="text-[16px] font-bold text-slate-900">₹{order.total.toFixed(2)}</span>
        </div>

        {/* Booking/Dine-in Info */}
        {(isBooking || order.type === "Dine-in") && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
            {guestCount && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users2 className="h-3.5 w-3.5" />
                <span>{guestCount} Guests</span>
              </div>
            )}
            {tableInfo && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Table className="h-3.5 w-3.5" />
                <span>{tableInfo}</span>
              </div>
            )}
          </div>
        )}

        {/* Items Section */}
        <div className="mb-4">
          <p className="text-[13px] text-[#6B7280] mb-2">Items • {itemCount}</p>
          <div className="space-y-[8px]">
            {order.items.slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <p className="text-[14px] text-slate-800 leading-snug">
                  {item.name} ×{item.quantity}
                </p>
              </div>
            ))}
            {order.items.length > 2 && (
              <p className="text-[12px] text-slate-400 ml-3.5">+ {order.items.length - 2} more items</p>
            )}
          </div>
        </div>

        {/* Source Section */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[13px] text-[#6B7280]">Source</span>
          <span className="text-[13px] font-medium text-slate-700">{order.source}</span>
        </div>

        {/* CTA Button */}
        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
          <button 
            onClick={handleUpdateStatus}
            className={`w-full h-[48px] rounded-[14px] text-white font-semibold text-[15px] flex items-center justify-center active:scale-[0.98] transition-all mt-auto ${btnBg}`}
          >
            {btnText}
          </button>
        )}
      </div>
    </DetailsSheet>
  );
};
