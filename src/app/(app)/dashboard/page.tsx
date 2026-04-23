
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  IndianRupee,
  ShoppingBag,
  Calendar,
  UtensilsCrossed,
  User,
  MapPin,
  FileText,
  Truck,
  Flame,
  X,
  ChevronRight,
  Package,
  Bike,
  Users2,
  Table,
  PlusCircle,
  PenSquare,
  Store,
  Wallet,
  RefreshCw,
  Globe,
  ArrowRight,
  Plus,
  BellRing,
  CheckCircle2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/context/useAppStore";
import { OrderCard } from "@/components/order-card";
import type { Order, OrderStatus } from "@/context/useAppStore";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { PrepTimeDialog } from "@/components/prep-time-dialog";
import { useMutationRequestDynamic } from "@/hooks/useApi";
// Use API-served audio to avoid bundler asset import issues

const NewIncomingOrderCard = ({
  order,
  onDecline,
  onAccept,
}: {
  order: Order;
  onDecline: (id: string) => void;
  onAccept: (order: Order) => void;
}) => {
  if (!order) return null;

  const isBooking = order.items.some((i) => i.category === "Booking");
  const subtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discount = order.discount || 0; 
  const gst = (subtotal - discount) * 0.05; // 5% GST
  const grandTotal = subtotal - discount + gst;

  return (
    <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/50 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg text-primary">
            {isBooking ? "New Booking!" : "New Incoming Order!"}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 -mt-2 -mr-2"
            onClick={() => onDecline(order.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="flex flex-col items-start gap-2 pt-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{order.customer}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{order.customerDetails.address}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2 flex items-center justify-between">
            <span>ORDER DETAILS</span>
            <Badge
              variant="outline"
              className="capitalize flex items-center gap-1.5"
            >
              <Truck className="h-3 w-3" /> {order.type}
            </Badge>
          </h4>
          <div className="space-y-1 text-sm">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <p>
                  {item.quantity} x {item.name}
                </p>
                <p className="flex items-center">
                  <IndianRupee className="h-3.5 w-3.5" />
                  {item.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" /> Special Note
          </h4>
          <p className="text-sm text-muted-foreground">
            {order.note || "No special instructions."}
          </p>
        </div>
        <div className="space-y-2 pt-2 border-t text-sm">
          <div className="flex justify-between">
            <p className="text-muted-foreground">Subtotal</p>
            <p className="font-medium flex items-center">
              <IndianRupee className="h-3.5 w-3.5" />
              {subtotal.toFixed(2)}
            </p>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
                <p className="text-muted-foreground">Discount</p>
                <p className="font-medium text-green-600 flex items-center">
                -<IndianRupee className="h-3.5 w-3.5" />
                {discount.toFixed(2)}
                </p>
            </div>
          )}
          <div className="flex justify-between">
            <p className="text-muted-foreground">GST (5%)</p>
            <p className="font-medium flex items-center">
              <IndianRupee className="h-3.5 w-3.5" />
              {gst.toFixed(2)}
            </p>
          </div>
          <Separator />
          <div className="flex items-center justify-between font-bold text-lg">
            <div className="flex items-center gap-2">
              <p>Grand Total</p>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 text-xs"
              >
                {order.payment?.status || "Paid"}
              </Badge>
            </div>
            <p className="flex items-center">
              <IndianRupee className="h-5 w-5" />
              {grandTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
      <CardHeader className="flex flex-row gap-4 pt-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onDecline(order.id)}
        >
          Decline
        </Button>
        <Button className="w-full" onClick={() => onAccept(order)}>
          Accept
        </Button>
      </CardHeader>
    </Card>
  );
};

const OrderCategory = ({
  title,
  orders,
}: {
  title: string;
  orders: Order[];
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-semibold text-lg">{title}</h3>
      <Badge variant="secondary">{orders.length}</Badge>
    </div>
    <div className="space-y-4">
      {orders.length > 0 ? (
        orders.map((o) => <OrderCard key={o.id} order={o} />)
      ) : (
        <p className="text-muted-foreground text-sm text-center py-4">
          No active {title.toLowerCase()} orders.
        </p>
      )}
    </div>
  </div>
);

// No mock orders in production, rely on real API data
const mockOrders: Order[] = [];
let lastMockOrderIndex = -1;

export default function Dashboard() {
  const {
    isRestaurantOnline,
    setRestaurantOnline,
    isBusy,
    setBusy,
    orders,
    tables,
    updateOrderStatus,
    acceptNewOrder,
    selectedBranch,
    branches,
    setBranches,
    refunds,
  } = useAppStore();

  const [newOrder, setNewOrder] = useState<Order | null>(null);
  const [orderToAccept, setOrderToAccept] = useState<Order | null>(null);
  const [isAlertPlaying, setIsAlertPlaying] = useState<boolean>(false);
  const { toast } = useToast();
  const [alertAudio, setAlertAudio] = useState<HTMLAudioElement | null>(null);
  const [activeOrderTab, setActiveOrderTab] = useState<'Delivery' | 'Dine-in' | 'Takeaway'>('Delivery');
  const router = useRouter();

  const currentBranch = branches.find(b => b.id === selectedBranch);

  // API mutations (restored from previous implementation)
  const toggleOnlineMutation = useMutationRequestDynamic<any, any>(
    "PATCH",
    () => `/api/branches/${currentBranch?.restaurantId || selectedBranch}/toggle-online`,
    undefined,
    {
      onSuccess: (response) => {
        const newIsOnline = response.data.isOnline;
        setRestaurantOnline(newIsOnline);
        if (currentBranch) {
          setBranches(branches.map(b => b.id === selectedBranch ? { ...b, isOnline: newIsOnline } : b));
        }
        toast({ title: newIsOnline ? "Branch is now Online" : "Branch is now Offline" });
      }
    }
  );

  const toggleRushHourMutation = useMutationRequestDynamic<any, any>(
    "PATCH",
    () => `/api/branches/${currentBranch?.restaurantId || selectedBranch}/rush-hour`,
    undefined,
    {
      onSuccess: (response) => {
        const newIsRushHour = response.data.isRushHour;
        setBusy(newIsRushHour);
        if (currentBranch) {
          setBranches(branches.map(b => b.id === selectedBranch ? { ...b, isRushHour: newIsRushHour } : b));
        }
        toast({ title: newIsRushHour ? "Rush Hour Enabled" : "Rush Hour Disabled" });
      }
    }
  );

  useEffect(() => {
    const sound = new Audio("/audio/NEW_ORDER_ALERT_SOUND.mp3");
    sound.loop = true;
    sound.volume = 1.0;
    setAlertAudio(sound);
  }, []);

  useEffect(() => {
    if (!alertAudio) return;
    if (newOrder) {
      alertAudio.play().then(() => setIsAlertPlaying(true)).catch(() => setIsAlertPlaying(false));
    } else {
      alertAudio.pause();
      alertAudio.currentTime = 0;
      setIsAlertPlaying(false);
    }
  }, [newOrder, alertAudio]);

  const activeOrders = useMemo(() => {
    return orders.filter(o => 
      !["Delivered", "Cancelled", "Rejected"].includes(o.status) && 
      (activeOrderTab === 'Dine-in' ? (o.type === 'Dine-in') : o.type === activeOrderTab)
    );
  }, [orders, activeOrderTab]);

  const stats = useMemo(() => {
    const revenue = orders.reduce((acc, o) => acc + o.total, 0);
    const online = orders.filter(o => o.source === 'Online').length;
    const offline = orders.filter(o => o.source === 'Offline').length;
    return [
      { label: 'REVENUE', val: `₹${revenue.toLocaleString()}`, color: 'text-blue-500', bg: 'bg-rose-50', icon: Wallet },
      { label: 'REFUNDS', val: `₹${refunds.reduce((acc, r) => acc + r.amount, 0)}`, color: 'text-red-500', bg: 'bg-red-50', icon: RefreshCw },
      { label: 'TOTAL ORDERS', val: orders.length.toString(), color: 'text-indigo-500', bg: 'bg-emerald-50', icon: ShoppingBag },
      { label: 'ONLINE ORDERS', val: online.toString(), color: 'text-blue-500', bg: 'bg-blue-50', icon: Globe },
      { label: 'OFFLINE ORDERS', val: offline.toString(), color: 'text-amber-500', bg: 'bg-amber-50', icon: Store }
    ];
  }, [orders, refunds]);

  const tableStats = useMemo(() => {
    const occupied = tables.filter(t => t.status === 'Occupied').length;
    return { occupied, available: tables.length - occupied };
  }, [tables]);

  const handleConfirmPrepTime = (time: string) => {
    if (!orderToAccept) return;

    acceptNewOrder(orderToAccept, time);

    setNewOrder(null);
    setOrderToAccept(null);

    toast({
      title: "Order Accepted!",
      description: `${orderToAccept.id} has been accepted with a prep time of ${time}.`,
    });
  };

  return (
    <div className="pb-44 space-y-10 animate-in fade-in duration-700 bg-white md:bg-transparent lg:pb-10">
      


      <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 lg:gap-8 lg:space-y-0 gap-10">
        <div className="lg:col-span-8 space-y-10">
          
          {/* Active Orders Section */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[14px] font-black text-slate-900 tracking-tighter uppercase">Active Orders</h3>
              <Link href="/order-history" className="text-[10px] font-bold text-[#1E90FF] uppercase tracking-widest hover:opacity-80 transition-opacity">View All</Link>
            </div>

            <div className="flex p-1 bg-[#F3F4F6] rounded-full mb-8">
               {(['Delivery', 'Dine-in', 'Takeaway'] as const).map(tab => (
                 <button 
                  key={tab}
                  onClick={() => setActiveOrderTab(tab)}
                  className={`flex-1 py-3 rounded-full text-[13px] font-bold transition-all duration-300 ${
                    activeOrderTab === tab 
                    ? 'bg-white text-[#1E90FF] shadow-sm scale-[1.02]' 
                    : 'text-[#6B7280] hover:text-slate-900'
                  }`}
                 >
                    {tab}
                 </button>
               ))}
            </div>

            {activeOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center bg-slate-50/50 rounded-[32px] border border-slate-200 border-dashed">
                 <div className="w-14 h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
                    <ShoppingBag size={24} />
                 </div>
                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">No Active {activeOrderTab} Orders</p>
                 <p className="text-[10px] font-bold text-slate-300 mt-2 tracking-wide">New incoming orders will appear here automatically</p>
              </div>
            )}
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          
          {/* Operational Controls (Added to Dashboard for easy access) */}
          <div className="grid grid-cols-2 gap-4">
            <Card className={cn("border-none shadow-sm", isRestaurantOnline ? "bg-blue-50/50" : "bg-slate-50")}>
              <CardHeader className="p-4 space-y-0 flex flex-row items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Status</p>
                  <p className={cn("text-xs font-bold", isRestaurantOnline ? "text-[#1E90FF]" : "text-slate-500")}>
                    {isRestaurantOnline ? "Online" : "Offline"}
                  </p>
                </div>
                <Switch 
                  checked={isRestaurantOnline} 
                  onCheckedChange={(val) => toggleOnlineMutation.mutate({ isOnline: val })}
                  disabled={toggleOnlineMutation.isPending}
                />
              </CardHeader>
            </Card>
            <Card className={cn("border-none shadow-sm", isBusy ? "bg-rose-50/50" : "bg-slate-50")}>
              <CardHeader className="p-4 space-y-0 flex flex-row items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Rush Hour</p>
                  <p className={cn("text-xs font-bold", isBusy ? "text-rose-600" : "text-slate-500")}>
                    {isBusy ? "Active" : "Normal"}
                  </p>
                </div>
                <Switch 
                  checked={isBusy} 
                  onCheckedChange={(val) => toggleRushHourMutation.mutate({ isRushHour: val })}
                  disabled={toggleRushHourMutation.isPending}
                />
              </CardHeader>
            </Card>
          </div>

          {/* Table Management Section */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-[14px] font-black text-slate-900 tracking-tighter uppercase">Table Status</h3>
               <Link href="/bookings" className="text-[10px] font-bold text-[#1E90FF] uppercase tracking-widest">Manage</Link>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                  <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest mb-1">Available</p>
                  <p className="text-3xl font-black text-emerald-600">{tableStats.available}</p>
               </div>
               <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                  <p className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest mb-1">Occupied</p>
                  <p className="text-3xl font-black text-blue-600">{tableStats.occupied}</p>
               </div>
            </div>
          </section>

          {/* Quick Stats (Desktop) */}
          <section className="hidden lg:block bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
             <h3 className="text-[14px] font-black text-slate-900 tracking-tighter uppercase">Market Overview</h3>
             <div className="space-y-4">
               {stats.map((stat, idx) => {
                 const Icon = stat.icon;
                 return (
                  <div key={idx} className="flex items-center gap-4 p-3.5 rounded-2xl border border-slate-50 bg-slate-50/30 transition-all hover:bg-slate-50">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm", stat.bg)}>
                      <Icon size={20} className={stat.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
                      <p className="text-[20px] font-black text-slate-900 leading-none">{stat.val}</p>
                    </div>
                    <ArrowRight size={16} className="text-slate-300" />
                  </div>
                 );
               })}
             </div>
          </section>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-24 right-6 flex flex-col gap-4 z-50">
        <button 
          onClick={() => {
            const orderId = `ORD-${Math.floor(Math.random() * 1000)}`;
            setNewOrder({
              id: orderId,
              customer: "Test Customer",
              status: "New",
              type: "Delivery",
              total: 549,
              items: [{ id: 1, name: "Test Pizza", quantity: 1, price: 549, category: "Pizza" }],
              customerDetails: { name: "Test", address: "HSR Layout", phone: "123", email: "a@b.com" },
              payment: { method: "Online", status: "Paid" },
              date: new Date().toISOString(),
              time: new Date().toLocaleTimeString(),
              prepTime: "20 min"
            });
          }}
          className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-slate-900/40 active:scale-95 transition-all"
        >
          <BellRing size={24} />
        </button>
        <button 
          onClick={() => router.push("/takeaway")}
          className="h-14 bg-[#1E90FF] text-white rounded-2xl px-6 flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/40 active:scale-95 transition-all"
        >
          <Plus size={24} />
          <span className="text-[14px] font-black uppercase tracking-widest">Create Order</span>
        </button>
      </div>

      {newOrder && (
        <NewIncomingOrderCard
          order={newOrder}
          onDecline={() => setNewOrder(null)}
          onAccept={(order) => setOrderToAccept(order)}
        />
      )}

      {orderToAccept && (
        <PrepTimeDialog
          isOpen={!!orderToAccept}
          onOpenChange={(isOpen) => !isOpen && setOrderToAccept(null)}
          order={orderToAccept}
          onConfirm={handleConfirmPrepTime}
        />
      )}


    </div>
  );
}
