
"use client"

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context/AppContext";
import { OrderCard } from "@/components/order-card";
import { UtensilsCrossed, Calendar } from "lucide-react";

export default function OrdersPage() {
  const { orders } = useAppContext();
  
  const { activeOrders, bookingOrders } = useMemo(() => {
    const allActive = orders.filter(o => !["Delivered", "Cancelled", "Rejected"].includes(o.status));
    
    const bookings = allActive.filter(o => o.items.some(item => item.category === 'Booking'));
    const otherOrders = allActive.filter(o => !o.items.some(item => item.category === 'Booking'));
    
    return { activeOrders: otherOrders, bookingOrders: bookings };
  }, [orders]);


  return (
    <div className="flex flex-col">
      <Tabs defaultValue="active-orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active-orders">Active Orders</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="active-orders">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 mt-4">
            {activeOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
            {activeOrders.length === 0 && (
              <div className="text-center py-16 text-muted-foreground col-span-full">
                <UtensilsCrossed className="h-12 w-12 mx-auto mb-2"/>
                <p>No active orders at the moment.</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="bookings">
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 mt-4">
            {bookingOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
            {bookingOrders.length === 0 && (
              <div className="text-center py-16 text-muted-foreground col-span-full">
                <Calendar className="h-12 w-12 mx-auto mb-2"/>
                <p>No active bookings at the moment.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
