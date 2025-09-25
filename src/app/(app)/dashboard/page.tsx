
"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
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
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/context/useAppStore"
import { OrderCard } from "@/components/order-card"
import type { Order, OrderStatus } from "@/context/AppContext"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { PrepTimeDialog } from "@/components/prep-time-dialog"

const NewIncomingOrderCard = ({ order, onDecline, onAccept }: { order: Order; onDecline: (id: string) => void; onAccept: (order: Order) => void; }) => {
    if (!order) return null;

    const isBooking = order.items.some(i => i.category === 'Booking');
    const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discount = isBooking ? 0 : 50.00; // Mock discount
    const gst = (subtotal - discount) * 0.05; // 5% GST
    const grandTotal = subtotal - discount + gst;


    return (
        <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/50 shadow-lg">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-primary">{isBooking ? 'New Booking!' : 'New Incoming Order!'}</CardTitle>
                    <Button variant="ghost" size="icon" className="h-6 w-6 -mt-2 -mr-2" onClick={() => onDecline(order.id)}>
                        <X className="h-4 w-4"/>
                    </Button>
                </div>
                <CardDescription className="flex flex-col items-start gap-2 pt-2">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4"/>
                        <span>{order.customer}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4"/>
                        <span>{order.customerDetails.address}</span>
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center justify-between">
                        <span>ORDER DETAILS</span>
                        <Badge variant="outline" className="capitalize flex items-center gap-1.5"><Truck className="h-3 w-3"/> {order.type}</Badge>
                    </h4>
                    <div className="space-y-1 text-sm">
                        {order.items.map(item => (
                            <div key={item.id} className="flex justify-between">
                                <p>{item.quantity} x {item.name}</p>
                                <p className="flex items-center"><IndianRupee className="h-3.5 w-3.5"/>{item.price.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><FileText className="h-4 w-4"/> Special Note</h4>
                    <p className="text-sm text-muted-foreground">Please make the burger extra spicy and no pickles.</p>
                </div>
                 <div className="space-y-2 pt-2 border-t text-sm">
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Subtotal</p>
                      <p className="font-medium flex items-center"><IndianRupee className="h-3.5 w-3.5"/>{subtotal.toFixed(2)}</p>
                    </div>
                     <div className="flex justify-between">
                      <p className="text-muted-foreground">Discount</p>
                      <p className="font-medium text-green-600 flex items-center">-<IndianRupee className="h-3.5 w-3.5"/>{discount.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">GST (5%)</p>
                      <p className="font-medium flex items-center"><IndianRupee className="h-3.5 w-3.5"/>{gst.toFixed(2)}</p>
                    </div>
                    <Separator/>
                     <div className="flex items-center justify-between font-bold text-lg">
                      <div className="flex items-center gap-2">
                          <p>Grand Total</p>
                          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">Paid</Badge>
                      </div>
                      <p className="flex items-center"><IndianRupee className="h-5 w-5"/>{grandTotal.toFixed(2)}</p>
                   </div>
                 </div>
            </CardContent>
            <CardHeader className="flex flex-row gap-4 pt-2">
                <Button variant="outline" className="w-full" onClick={() => onDecline(order.id)}>Decline</Button>
                <Button className="w-full" onClick={() => onAccept(order)}>Accept</Button>
            </CardHeader>
        </Card>
    )
}

const OrderCategory = ({ title, orders }: { title: string, orders: Order[] }) => (
    <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">{title}</h3>
            <Badge variant="secondary">{orders.length}</Badge>
        </div>
        <div className="space-y-4">
        {orders.length > 0 ? (
            orders.map(o => <OrderCard key={o.id} order={o} />)
        ) : (
            <p className="text-muted-foreground text-sm text-center py-4">No active {title.toLowerCase()} orders.</p>
        )}
        </div>
    </div>
);


const mockOrders: Order[] = [
    { 
        id: `ORD-SIM-DEL`,
        customer: "Simran Kaur",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().split('T')[0],
        status: "New",
        type: "Delivery",
        items: [{ id: 1, name: "Margherita Pizza", quantity: 1, price: 899, category: "Pizza" }],
        prepTime: "15 min",
        total: 899,
        customerDetails: { name: "Simran Kaur", address: "Apt 101, Prestige Towers", phone: "9988776655", email: "sim@ran.com" },
        payment: { method: "Online", status: "Paid" }
    },
    { 
        id: `ORD-SIM-DIN`,
        customer: "Rajesh Kumar",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().split('T')[0],
        status: "New",
        type: "Dine-in",
        items: [{ id: 7, name: "Butter Chicken", quantity: 2, price: 499, category: "Curries" }],
        prepTime: "20 min",
        total: 998,
        customerDetails: { name: "Rajesh Kumar", address: "Table T5", phone: "9988776655", email: "raj@esh.com" },
        payment: { method: "UPI", status: "Paid" }
    },
    { 
        id: `ORD-SIM-TAK`,
        customer: "Walk-in",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().split('T')[0],
        status: "New",
        type: "Takeaway",
        items: [{ id: 3, name: "Chicken Burger", quantity: 1, price: 450, category: "Burgers" }],
        prepTime: "10 min",
        total: 450,
        customerDetails: { name: "Walk-in", address: "Takeaway Counter", phone: "N/A", email: "N/A" },
        payment: { method: "Cash", status: "Paid" }
    },
    {
        id: `ORD-SIM-BOK`,
        customer: "Anita Desai",
        time: "8:00 PM",
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        status: 'New',
        type: 'Dine-in',
        items: [{ id: 999, name: 'Booking for 2', quantity: 1, price: 100, category: 'Booking' }],
        prepTime: 'N/A',
        total: 118.00,
        customerDetails: { name: "Anita Desai", address: "Table for 2", phone: "9988776655", email: "anita@desai.com" },
        payment: { method: "Online", status: 'Paid' }
    }
];

let lastMockOrderIndex = -1;

export default function Dashboard() {
  const { 
    isRestaurantOnline, 
    setRestaurantOnline,
    isBusy,
    setBusy,
    orders,
    updateOrderStatus,
    acceptNewOrder,
  } = useAppStore();
  
  const [newOrder, setNewOrder] = useState<Order | null>(null);
  const [orderToAccept, setOrderToAccept] = useState<Order | null>(null);
  const { toast } = useToast();

  const handleDecline = () => {
    setNewOrder(null);
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
        description: `${orderToAccept.id} has been accepted with a prep time of ${time}.`
    });
  }

  const handleToggleOnline = (isOnline: boolean) => {
    setRestaurantOnline(isOnline);
    if(isOnline) {
      // cycle through mock orders
      lastMockOrderIndex = (lastMockOrderIndex + 1) % mockOrders.length;
      const mockOrder = { ...mockOrders[lastMockOrderIndex], time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
      setNewOrder(mockOrder);
    } else {
        setNewOrder(null);
    }
  }
  
  const {
      activeOrders,
      deliveryOrders,
      takeawayOrders,
      dineInOrders,
      totalRevenue,
      totalOrders,
      deliveryRevenue,
      takeawayRevenue,
      dineInRevenue
  } = useMemo(() => {
    const active = orders.filter(o => !["Delivered", "Cancelled", "Rejected"].includes(o.status));
    
    const delivery = active.filter(o => o.type === "Delivery");
    const takeaway = active.filter(o => o.type === "Takeaway");
    const dineIn = active.filter(o => o.type === "Dine-in" && !o.items.some(item => item.category === 'Booking'));

    const revenue = active.reduce((sum, order) => sum + order.total, 0);

    return {
        activeOrders: active.filter(o => !o.items.some(item => item.category === 'Booking')),
        deliveryOrders: delivery,
        takeawayOrders: takeaway,
        dineInOrders: dineIn,
        totalRevenue: revenue,
        totalOrders: active.length,
        deliveryRevenue: delivery.reduce((sum, order) => sum + order.total, 0),
        takeawayRevenue: takeaway.reduce((sum, order) => sum + order.total, 0),
        dineInRevenue: dineIn.reduce((sum, order) => sum + order.total, 0),
    };
  }, [orders]);
  
  return (
    <div className="flex flex-col gap-6 pb-20">
      <h1 className="text-2xl font-semibold md:text-3xl">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">You are Online</CardTitle>
              <CardDescription className="text-xs">Accepting new orders</CardDescription>
            </div>
            <Switch checked={isRestaurantOnline} onCheckedChange={handleToggleOnline} />
          </CardHeader>
        </Card>
        <Card className={cn(
            "transition-colors",
            isBusy && "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800/50"
        )}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className={cn("text-base", isBusy && "text-red-700 dark:text-red-300")}>Rush Hour</CardTitle>
              <CardDescription className={cn("text-xs", isBusy && "text-red-600/80 dark:text-red-400/80")}>Manage high order volume</CardDescription>
            </div>
            <Switch checked={isBusy} onCheckedChange={setBusy} disabled={!isRestaurantOnline}/>
          </CardHeader>
        </Card>
      </div>
      <Card>
        <CardContent className="p-0">
          <Link href="/takeaway" className="block p-4 hover:bg-accent transition-colors rounded-lg">
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-base">For Offline Orders</CardTitle>
                    <CardDescription className="text-xs mt-1">Manually create a takeaway order</CardDescription>
                </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-primary"/>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground"/>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>

      {newOrder && <NewIncomingOrderCard order={newOrder} onDecline={handleDecline} onAccept={handleAccept} />}
      
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
              <Badge variant="secondary" className="ml-1">{deliveryOrders.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="takeaway" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Takeaway
              <Badge variant="secondary" className="ml-1">{takeawayOrders.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="dine-in" className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              Dine-in
              <Badge variant="secondary" className="ml-1">{dineInOrders.length}</Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="delivery" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {deliveryOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
              {deliveryOrders.length === 0 && (
                <div className="text-center py-16 text-muted-foreground col-span-full">
                  <Truck className="h-12 w-12 mx-auto mb-2"/>
                  <p>No active delivery orders at the moment.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="takeaway" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {takeawayOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
              {takeawayOrders.length === 0 && (
                <div className="text-center py-16 text-muted-foreground col-span-full">
                  <Package className="h-12 w-12 mx-auto mb-2"/>
                  <p>No active takeaway orders at the moment.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="dine-in" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {dineInOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
              {dineInOrders.length === 0 && (
                <div className="text-center py-16 text-muted-foreground col-span-full">
                  <UtensilsCrossed className="h-12 w-12 mx-auto mb-2"/>
                  <p>No active dine-in orders at the moment.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
