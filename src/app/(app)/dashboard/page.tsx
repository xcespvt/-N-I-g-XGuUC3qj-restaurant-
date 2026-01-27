
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
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
  const discount = isBooking ? 0 : 50.0; // Mock discount
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
            Please make the burger extra spicy and no pickles.
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
          <div className="flex justify-between">
            <p className="text-muted-foreground">Discount</p>
            <p className="font-medium text-green-600 flex items-center">
              -<IndianRupee className="h-3.5 w-3.5" />
              {discount.toFixed(2)}
            </p>
          </div>
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
                Paid
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

const mockOrders: Order[] = [
  {
    id: `ORD-SIM-DEL`,
    customer: "Simran Kaur",
    time: new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    date: new Date().toISOString().split("T")[0],
    status: "New",
    type: "Delivery",
    items: [
      {
        id: 1,
        name: "Margherita Pizza",
        quantity: 1,
        price: 899,
        category: "Pizza",
      },
    ],
    prepTime: "15 min",
    total: 899,
    customerDetails: {
      name: "Simran Kaur",
      address: "Apt 101, Prestige Towers",
      phone: "9988776655",
      email: "sim@ran.com",
    },
    payment: { method: "Online", status: "Paid" },
  },
  {
    id: `ORD-SIM-DIN`,
    customer: "Rajesh Kumar",
    time: new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    date: new Date().toISOString().split("T")[0],
    status: "New",
    type: "Dine-in",
    items: [
      {
        id: 7,
        name: "Butter Chicken",
        quantity: 2,
        price: 499,
        category: "Curries",
      },
    ],
    prepTime: "20 min",
    total: 998,
    customerDetails: {
      name: "Rajesh Kumar",
      address: "Table T5",
      phone: "9988776655",
      email: "raj@esh.com",
    },
    payment: { method: "UPI", status: "Paid" },
  },
  {
    id: `ORD-SIM-TAK`,
    customer: "Walk-in",
    time: new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    date: new Date().toISOString().split("T")[0],
    status: "New",
    type: "Takeaway",
    items: [
      {
        id: 3,
        name: "Chicken Burger",
        quantity: 1,
        price: 450,
        category: "Burgers",
      },
    ],
    prepTime: "10 min",
    total: 450,
    customerDetails: {
      name: "Walk-in",
      address: "Takeaway Counter",
      phone: "N/A",
      email: "N/A",
    },
    payment: { method: "Cash", status: "Paid" },
  },
  {
    id: `ORD-SIM-BOK`,
    customer: "Anita Desai",
    time: "8:00 PM",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
    status: "New",
    type: "Dine-in",
    items: [
      {
        id: 999,
        name: "Booking for 2",
        quantity: 1,
        price: 100,
        category: "Booking",
      },
    ],
    prepTime: "N/A",
    total: 118.0,
    customerDetails: {
      name: "Anita Desai",
      address: "Table for 2",
      phone: "9988776655",
      email: "anita@desai.com",
    },
    payment: { method: "Online", status: "Paid" },
  },
];

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
    toggleBranchOnlineStatus,
  } = useAppStore();

  const [newOrder, setNewOrder] = useState<Order | null>(null);
  const [orderToAccept, setOrderToAccept] = useState<Order | null>(null);
  const [isAlertPlaying, setIsAlertPlaying] = useState<boolean>(false);
  const { toast } = useToast();
  const [alertAudio, setAlertAudio] = useState<HTMLAudioElement | null>(null);

  // Get the current branch object
  const currentBranch = branches.find(b => b.id === selectedBranch);

  // API mutation for toggling branch online status
  type ToggleOnlineVariables = { isOnline: boolean };
  type ToggleOnlineResponse = {
    success: boolean;
    message: string;
    data: {
      id: string;
      isOnline: boolean;
      name: string;
    }
  };

  const toggleOnlineMutation = useMutationRequestDynamic<
    ToggleOnlineResponse,
    ToggleOnlineVariables
  >(
    "PATCH",
    (variables) => `/api/branches/${currentBranch?.restaurantId || selectedBranch}/toggle-online`,
    undefined,
    {
      onSuccess: (response, variables) => {
        // SET the state to the exact value from API, don't toggle
        const newIsOnline = response.data.isOnline;
        setRestaurantOnline(newIsOnline);

        // Also update the branch's isOnline status in the store
        if (currentBranch) {
          const updatedBranch = { ...currentBranch, isOnline: newIsOnline };
          // Update the branches array to reflect the new status
          setBranches(branches.map(b =>
            b.id === selectedBranch ? updatedBranch : b
          ));
        }

        toast({
          title: newIsOnline ? "Branch is now Online" : "Branch is now Offline",
          description: response.message || `You are now ${newIsOnline ? 'accepting' : 'not accepting'} new orders.`,
        });

        // Handle mock order behavior
        if (newIsOnline) {
          // cycle through mock orders
          lastMockOrderIndex = (lastMockOrderIndex + 1) % mockOrders.length;
          const mockOrder = {
            ...mockOrders[lastMockOrderIndex],
            time: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          setNewOrder(mockOrder);
        } else {
          setNewOrder(null);
        }
      },
      onError: (error) => {
        toast({
          title: "Failed to update status",
          description: error.message || "Could not toggle branch online status. Please try again.",
          variant: "destructive",
        });
      },
    }
  );

  // API mutation for toggling rush hour status
  type ToggleRushHourVariables = { isRushHour: boolean };
  type ToggleRushHourResponse = {
    success: boolean;
    message: string;
    data: {
      id: string;
      isRushHour: boolean;
      name: string;
    }
  };

  const toggleRushHourMutation = useMutationRequestDynamic<
    ToggleRushHourResponse,
    ToggleRushHourVariables
  >(
    "PATCH",
    (variables) => `/api/branches/${currentBranch?.restaurantId || selectedBranch}/rush-hour`,
    undefined,
    {
      onSuccess: (response, variables) => {
        // SET the state to the exact value from API, don't toggle
        const newIsRushHour = response.data.isRushHour;
        setBusy(newIsRushHour);

        // Also update the branch's isRushHour status in the store
        if (currentBranch) {
          const updatedBranch = { ...currentBranch, isRushHour: newIsRushHour };
          // Update the branches array to reflect the new status
          setBranches(branches.map(b =>
            b.id === selectedBranch ? updatedBranch : b
          ));
        }

        toast({
          title: newIsRushHour ? "Rush Hour Enabled" : "Rush Hour Disabled",
          description: response.message || `Rush hour mode is now ${newIsRushHour ? 'enabled' : 'disabled'}.`,
        });
      },
      onError: (error) => {
        toast({
          title: "Failed to update rush hour",
          description: error.message || "Could not toggle rush hour status. Please try again.",
          variant: "destructive",
        });
      },
    }
  );


  // Initialize audio object once
  useEffect(() => {
    const sound = new Audio("/audio/NEW_ORDER_ALERT_SOUND.mp3");
    sound.loop = true;
    sound.volume = 1.0;
    sound.preload = "auto";
    setAlertAudio(sound);
  }, []);

  // Reactively play/stop when new orders appear/disappear
  useEffect(() => {
    if (!alertAudio) return;
    if (newOrder) {
      console.log(alertAudio)
      alertAudio.currentTime = 0;
      alertAudio
        .play()
        .then(() => setIsAlertPlaying(true))
        .catch((err) => {
          console.warn("New-order alert play failed:", err);
          setIsAlertPlaying(false);
        });
    } else {
      alertAudio.pause();
      alertAudio.currentTime = 0;
      setIsAlertPlaying(false);
    }
  }, [newOrder, alertAudio]);

  const handleDecline = () => {
    setNewOrder(null);
    if (alertAudio) {
      alertAudio.pause();
      alertAudio.currentTime = 0;
      setIsAlertPlaying(false);
    }
  };

  const handleAccept = (order: Order) => {
    setOrderToAccept(order);
  };

  const handleConfirmPrepTime = (time: string) => {
    if (!orderToAccept) return;

    acceptNewOrder(orderToAccept, time);

    setNewOrder(null);
    setOrderToAccept(null);

    toast({
      title: "Order Accepted!",
      description: `${orderToAccept.id} has been accepted with a prep time of ${time}.`,
    });
    if (alertAudio) {
      alertAudio.pause();
      alertAudio.currentTime = 0;
      setIsAlertPlaying(false);
    }
  };

  const handleToggleOnline = (isOnline: boolean) => {
    // Trigger the API mutation
    toggleOnlineMutation.mutate({ isOnline });
  };

  const handleToggleRushHour = (isRushHour: boolean) => {
    // Trigger the API mutation
    toggleRushHourMutation.mutate({ isRushHour });
  };

  const {
    deliveryOrders,
    takeawayOrders,
    dineInOrders,
    tableStats,
  } = useMemo(() => {
    const active = orders.filter(
      (o) => !["Delivered", "Cancelled", "Rejected"].includes(o.status)
    );

    const delivery = active.filter((o) => o.type === "Delivery");
    const takeaway = active.filter(o => o.type === 'Takeaway');
    const dineIn = active.filter(
      (o) =>
        o.type === "Dine-in" &&
        !o.items.some((item) => item.category === "Booking")
    );

    const occupiedTables = tables.filter(t => t.status === 'Occupied').length;
    const availableTables = tables.length - occupiedTables;

    return {
      deliveryOrders: delivery,
      takeawayOrders: takeaway,
      dineInOrders: dineIn,
      tableStats: {
        occupied: occupiedTables,
        available: availableTables,
        total: tables.length,
      }
    };
  }, [orders, tables]);

  return (
    <div className="flex flex-col gap-6 pb-20">
      <h1 className="text-2xl font-semibold md:text-3xl">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">You are Online</CardTitle>
              <CardDescription className="text-xs">
                {toggleOnlineMutation.isPending ? "Updating..." : "Accepting new orders"}
              </CardDescription>
              {isAlertPlaying && (
                <p className="text-xs text-primary mt-1">Playing new-order alert…</p>
              )}
            </div>
            <Switch
              checked={isRestaurantOnline}
              onCheckedChange={handleToggleOnline}
              disabled={toggleOnlineMutation.isPending}
            />
          </CardHeader>
        </Card>
        <Card
          className={cn(
            "transition-colors",
            isBusy &&
            "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800/50"
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle
                className={cn(
                  "text-base",
                  isBusy && "text-red-700 dark:text-red-300"
                )}
              >
                Rush Hour
              </CardTitle>
              <CardDescription
                className={cn(
                  "text-xs",
                  isBusy && "text-red-600/80 dark:text-red-400/80"
                )}
              >
                {toggleRushHourMutation.isPending ? "Updating..." : "Manage high order volume"}
              </CardDescription>
            </div>
            <Switch
              checked={isBusy}
              onCheckedChange={handleToggleRushHour}
              disabled={!isRestaurantOnline || toggleRushHourMutation.isPending}
            />
          </CardHeader>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <PenSquare className="h-5 w-5" />
            Manual Orders
          </CardTitle>
          <CardDescription className="text-xs mt-1">
            Manually create orders for walk-in customers or offline scenarios.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex flex-col gap-2">
          <Button asChild variant="ghost" className="w-full justify-between p-4 h-auto">
            <Link href="/takeaway?type=takeaway">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold text-base text-left">New Takeaway</p>
                  <p className="text-xs text-muted-foreground text-left">For walk-in customers</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </Button>
          <Separator />
          <Button asChild variant="ghost" className="w-full justify-between p-4 h-auto">
            <Link href="/takeaway?type=dine-in">
              <div className="flex items-center gap-3">
                <UtensilsCrossed className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold text-base text-left">New Dine-in</p>
                  <p className="text-xs text-muted-foreground text-left">For customers at a table</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users2 className="h-5 w-5" />
            Table Status
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{tableStats.occupied}</p>
            <p className="text-xs text-muted-foreground">Occupied</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{tableStats.available}</p>
            <p className="text-xs text-muted-foreground">Available</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold">{tableStats.total}</p>
            <p className="text-xs text-muted-foreground">Total Tables</p>
          </div>
        </CardContent>
        <CardContent className="px-4 pb-4">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href="/bookings">
              Go to Table Management
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {newOrder && (
        <NewIncomingOrderCard
          order={newOrder}
          onDecline={handleDecline}
          onAccept={handleAccept}
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

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Active Orders</h2>
        <Tabs defaultValue="delivery" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="delivery" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Delivery
              <Badge variant="secondary" className="ml-1">
                {deliveryOrders.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="takeaway" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Takeaway
              <Badge variant="secondary" className="ml-1">
                {takeawayOrders.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="dine-in" className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              Dine-in
              <Badge variant="secondary" className="ml-1">
                {dineInOrders.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="delivery" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {deliveryOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {deliveryOrders.length === 0 && (
                <div className="text-center py-16 text-muted-foreground col-span-full">
                  <Truck className="h-12 w-12 mx-auto mb-2" />
                  <p>No active delivery orders at the moment.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="takeaway" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {takeawayOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {takeawayOrders.length === 0 && (
                <div className="text-center py-16 text-muted-foreground col-span-full">
                  <Package className="h-12 w-12 mx-auto mb-2" />
                  <p>No active takeaway orders at the moment.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="dine-in" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {dineInOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {dineInOrders.length === 0 && (
                <div className="text-center py-16 text-muted-foreground col-span-full">
                  <UtensilsCrossed className="h-12 w-12 mx-auto mb-2" />
                  <p>No active dine-in orders at the moment.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
