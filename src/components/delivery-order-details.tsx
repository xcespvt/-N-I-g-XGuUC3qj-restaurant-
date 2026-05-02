import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Phone,
  Clock,
  AlertTriangle,
  Headset,
  X,
  FileText,
  Receipt,
  Printer,
  Tag,
  Plus,
  MoreVertical,
  Star,
  Bike,
} from "lucide-react";
import type { Order } from "@/context/useAppStore";
import { useAppStore } from "@/context/useAppStore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { KotDialog } from "./kot-dialog";
import { OrderDetailsDialog } from "./order-details-dialog";
import { SheetClose } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePatch, useQueryHelpers } from "@/hooks/useApi";

interface OrderDetailViewProps {
  order: Order;
  onBack?: () => void;
}

export function DeliveryOrderDetails({ order }: OrderDetailViewProps) {
  const { updateOrderStatus, selectedBranch } = useAppStore();
  const [showDelayModal, setShowDelayModal] = useState(false);
  const { invalidate } = useQueryHelpers();

  // Timer logic
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalPrepTime, setTotalPrepTime] = useState(0);

  useEffect(() => {
    const calculateTime = () => {
      const prepMinutes = parseInt(order.prepTime.split(" ")[0], 10) || 15;
      setTotalPrepTime(prepMinutes * 60);

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
      const remaining = Math.max(0, prepMinutes * 60 - elapsed);
      setTimeLeft(remaining);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [order.prepTime, order.time, order.date]);

  const targetTime = useMemo(() => {
    const timeParts = order.time.match(/(\d+):(\d+)\s*([APM]+)/i);
    if (!timeParts) return "";

    let hours = parseInt(timeParts[1], 10);
    const minutes = parseInt(timeParts[2], 10);
    const ampm = timeParts[3].toUpperCase();

    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    const prepMinutes = parseInt(order.prepTime.split(" ")[0], 10) || 15;
    const date = new Date(order.date);
    date.setHours(hours, minutes + prepMinutes, 0, 0);

    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }, [order.time, order.prepTime, order.date]);

  const { mutate: requestMoreTime, isPending: isRequestingTime } = usePatch(
    `/api/orders/${selectedBranch}/${order.id}/prep-time`,
    {
      onSuccess: (response: any) => {
        if (response.success && response.data) {
          const updatedOrder = { 
            ...order, 
            prepTime: response.data.prepTime,
          };
          useAppStore.setState((state) => ({
            orders: state.orders.map(o => o.id === order.id ? updatedOrder : o)
          }));
          
          // Refetch instantly
          invalidate(['orders', selectedBranch]);
          
          useAppStore.getState().showToast("Time Added", `${response.data.prepTime} is the new target.`);
        }
      },
      onError: (error: any) => {
        useAppStore.getState().showToast("Error", "Failed to update prep time", "destructive");
      }
    }
  );

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const getTimerColor = (current: number, total: number) => {
    if (total === 0) return "hsl(120, 85%, 45%)";
    const percentage = Math.max(0, current / total);
    const hue = Math.floor(percentage * 120);
    return `hsl(${hue}, 85%, 45%)`;
  };

  const subtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.05;
  const totalAmount = subtotal + tax;

  const handleUpdateStatus = () => {
    let nextStatus = order.status;
    if (order.status === "Incoming" || order.status === "New")
      nextStatus = "Preparing";
    else if (order.status === "Preparing") nextStatus = "Ready";
    else if (order.status === "Ready") nextStatus = "Delivered";

    updateOrderStatus(order.id, nextStatus as any);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <SheetClose asChild>
            <button className="p-2 -ml-2 text-slate-600 active:bg-slate-50 rounded-full">
              <ArrowLeft size={20} />
            </button>
          </SheetClose>
          <div>
            <h1 className="text-[18px] font-semibold text-slate-900">
              {order.id}
            </h1>
            <div className="flex items-center gap-2 text-xs mt-0.5">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md font-medium">
                {order.type}
              </span>
              <span className="text-slate-500">{order.time}</span>
            </div>
          </div>
        </div>
        <button className="p-2 text-slate-400">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="p-4 space-y-[14px]">
        {/* Customer Info Card */}
        <div className="bg-white rounded-[16px] p-4 border border-[#E5E7EB]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {order.customerDetails.name}
              </h2>
              <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-medium rounded mt-1">
                {order.source === "Offline" ? "WALK-IN" : "ONLINE"}
              </span>
            </div>
            <a
              href={`tel:${order.customerDetails.phone}`}
              className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"
            >
              <Phone size={18} />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div>
              <p className="text-slate-500 text-xs mb-0.5">Channel</p>
              <p className="font-medium text-slate-900">
                {order.source || "Crevings"}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-0.5">Order Type</p>
              <p className="font-medium text-slate-900">{order.type}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-0.5">Order Date</p>
              <p className="font-medium text-slate-900">
                {new Date(order.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-0.5">Order Time</p>
              <p className="font-medium text-slate-900">{order.time}</p>
            </div>
          </div>
        </div>

        {/* Print Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <button className="group h-[56px] rounded-[16px] bg-white border border-slate-200 shadow-sm flex items-center justify-center gap-3 active:bg-slate-50 transition-all">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center group-active:scale-95 transition-transform">
                  <Printer size={16} className="text-indigo-600" />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  Print KOT
                </span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xs p-0">
              <KotDialog order={order} />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <button className="group h-[56px] rounded-[16px] bg-white border border-slate-200 shadow-sm flex items-center justify-center gap-3 active:bg-slate-50 transition-all">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-active:scale-95 transition-transform">
                  <Receipt size={16} className="text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  Invoice
                </span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-0">
              <OrderDetailsDialog order={order} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Preparation Timing Card */}
        {order.status === "Preparing" && (
          <div className="bg-white rounded-[16px] p-5 border border-[#E5E7EB] shadow-sm relative overflow-hidden">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 h-1.5 bg-slate-100 w-full">
              <div
                className="h-full transition-all duration-1000 ease-linear"
                style={{
                  width: `${(timeLeft / totalPrepTime) * 100}%`,
                  backgroundColor: getTimerColor(timeLeft, totalPrepTime),
                }}
              />
            </div>

            <div className="flex items-center justify-between mb-4 mt-1">
              <h2 className="text-base font-semibold text-slate-900">
                Preparation Time
              </h2>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
                <Clock size={14} className="text-slate-500" />
                <span className="text-xs font-medium text-slate-600">
                  Target: {targetTime}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-5 mb-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div
                className="text-[46px] leading-none font-mono font-bold tracking-tighter transition-colors duration-1000"
                style={{ color: getTimerColor(timeLeft, totalPrepTime) }}
              >
                {formatTime(timeLeft)}
              </div>
              <p className="text-[11px] font-semibold text-slate-500 mt-2 uppercase tracking-widest">
                Minutes Remaining
              </p>
            </div>

            <button
              onClick={() => setShowDelayModal(true)}
              className="w-full h-12 rounded-xl border-2 border-dashed border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              disabled={isRequestingTime}
            >
              <AlertTriangle size={16} />
              {isRequestingTime ? "Requesting..." : "Request More Time"}
            </button>
          </div>
        )}

        {/* Offer Applied Card */}
        {order.offer && (
          <div className="bg-white rounded-[16px] p-4 border border-[#E5E7EB] shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Tag size={12} className="text-emerald-600" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                Offer Applied
              </h2>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
              <p className="text-sm font-semibold text-emerald-800">
                {order.offer.code}
              </p>
              <p className="text-xs text-emerald-600 mt-0.5">
                {order.offer.type} applied to this order.
              </p>
            </div>
          </div>
        )}

        {/* Order Details Card */}
        <div className="bg-white rounded-[16px] p-4 border border-[#E5E7EB]">
          <h2 className="text-base font-semibold text-slate-900 mb-4">
            Order Details
          </h2>

          <div className="space-y-4 mb-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border border-green-600 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    </div>
                    <p className="text-sm font-medium text-slate-900">
                      {item.name}
                    </p>
                  </div>
                  {item.addons && item.addons.length > 0 && (
                    <div className="ml-6 mt-1">
                      {item.addons.map((addon, aIdx) => (
                        <p key={aIdx} className="text-[11px] text-slate-500">
                          + {addon.name} (x{addon.quantity})
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-900">
                  × {item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium text-slate-900">
                ₹{subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tax (5%)</span>
              <span className="font-medium text-slate-900">
                ₹{tax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold pt-3 border-t border-slate-100">
              <span className="text-slate-900">Total Amount</span>
              <span className="text-slate-900">₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-sm text-slate-500">Payment Status</span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-md ${
                    order.payment.status === "Paid"
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-amber-600 bg-amber-50"
                  }`}
                >
                  {order.payment.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Partner Card */}
        {order.deliveryPartner && (
          <div className="bg-white rounded-[16px] p-4 border border-[#E5E7EB]">
            <h2 className="text-base font-semibold text-slate-900 mb-4">
              Delivery Partner
            </h2>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={order.deliveryPartner.avatar} />
                  <AvatarFallback>
                    {order.deliveryPartner.avatarFallback}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {order.deliveryPartner.name}
                  </p>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-xs font-semibold">
                      {order.deliveryPartner.rating} Rating
                    </span>
                  </div>
                </div>
              </div>
              <a 
                href={`tel:${order.deliveryPartner.phone || ''}`}
                className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>
        )}

        {/* Pickup OTP Box */}
        {order.pickupOtp && (
          <div className="bg-white rounded-[16px] p-4 border border-[#E5E7EB]">
            <h2 className="text-base font-semibold text-slate-900 mb-2">
              Pickup OTP
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Share this OTP with the delivery partner upon pickup.
            </p>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">OTP</span>
              <span className="text-lg font-bold tracking-widest text-slate-900">
                {order.pickupOtp}
              </span>
            </div>
          </div>
        )}

        {/* Update Status Button */}
        {order.status !== "Delivered" &&
          order.status !== "Cancelled" &&
          order.status !== "Rejected" && (
            <button
              onClick={handleUpdateStatus}
              className="w-full h-14 bg-[#2563EB] text-white rounded-[16px] font-bold text-[16px] flex items-center justify-center active:scale-[0.98] transition-all mt-4"
            >
              {order.status === "Incoming" || order.status === "New"
                ? "Accept Order"
                : order.status === "Preparing"
                ? "Mark as Ready"
                : "Complete Order"}
            </button>
          )}
      </div>

      {/* Floating Support Icon */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40">
        <Headset size={24} />
      </button>

      {/* Delay Modal */}
      {showDelayModal && (
        <DelayModal
          onClose={() => setShowDelayModal(false)}
          orderId={order.id}
          onAddDelay={(mins) => requestMoreTime({ extraMinutes: mins })}
        />
      )}
    </div>
  );
}

const DelayModal = ({
  onClose,
  orderId,
  onAddDelay,
}: {
  onClose: () => void;
  orderId: string;
  onAddDelay: (mins: number) => void;
}) => {
  const [selectedDelay, setSelectedDelay] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-end sm:items-center justify-center animate-in fade-in">
      <div className="bg-white w-full sm:w-[400px] rounded-t-2xl sm:rounded-2xl p-4 pb-8 sm:pb-4 animate-in slide-in-from-bottom-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Delay Order</h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 active:bg-slate-50 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[5, 10, 15, 20].map((mins) => (
            <button
              key={mins}
              onClick={() => setSelectedDelay(mins)}
              className={`h-12 rounded-xl border font-medium text-sm transition-colors ${
                selectedDelay === mins
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-slate-200 text-slate-700 active:bg-slate-50"
              }`}
            >
              {mins} Minutes
            </button>
          ))}
        </div>

        <button
          className="w-full h-12 bg-blue-600 text-white rounded-xl font-medium text-sm active:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={!selectedDelay}
          onClick={() => {
            if (selectedDelay) {
              onAddDelay(selectedDelay);
              onClose();
            }
          }}
        >
          Confirm Delay
        </button>
      </div>
    </div>
  );
}

