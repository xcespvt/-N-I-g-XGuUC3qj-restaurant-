
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, User, IndianRupee, Package, Bike, UtensilsCrossed, Zap, Calendar, Users2, Table } from "lucide-react";
import type { Order, OrderStatus } from "@/context/AppContext";
import { useAppStore } from "@/context/useAppStore";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { DeliveryOrderDetails } from "./delivery-order-details";
import { TakeawayDineinOrderDetails } from "./takeaway-dinein-order-details";
import { Separator } from "@/components/ui/separator";


const statusConfig: Record<string, { color: string; label: string; icon: React.ElementType }> = {
  Ready: { color: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300", label: "Ready", icon: Clock },
  Incoming: { color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300", label: "Incoming", icon: Clock },
  New: { color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300", label: "Incoming", icon: Clock },
  Preparing: { color: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300", label: "Preparing", icon: Clock },
};

const typeConfig: Record<string, { color: string; icon: React.ElementType }> = {
    Delivery: { color: "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300", icon: Bike },
    Takeaway: { color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-300", icon: Package },
    "Dine-in": { color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-300", icon: UtensilsCrossed },
    Booking: { color: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300", icon: Calendar },
}

const parseTime = (timeStr: string, date: Date): Date => {
    const time = timeStr.match(/(\d+):(\d+)\s*([APM]+)/i);
    if (!time) return date;
    
    let hours = parseInt(time[1], 10);
    const minutes = parseInt(time[2], 10);
    const ampm = time[3].toUpperCase();

    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
};

const DetailsSheet = ({ order, children }: { order: Order, children: React.ReactNode }) => {
    const isDelivery = order.type === 'Delivery';
    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className="p-0 flex flex-col" side="bottom">
                {isDelivery ? <DeliveryOrderDetails order={order} /> : <TakeawayDineinOrderDetails order={order} />}
            </SheetContent>
        </Sheet>
    );
};


export const OrderCard = ({ order }: { order: Order; }) => {
    const { updateOrderStatus } = useAppStore();
    const status = statusConfig[order.status];
    const [remainingTime, setRemainingTime] = React.useState("00:00");

    React.useEffect(() => {
        const calculateRemainingTime = () => {
            const prepTimeMinutes = parseInt(order.prepTime.split(' ')[0], 10);
            if (isNaN(prepTimeMinutes) || order.status !== 'Preparing') {
                setRemainingTime("00:00");
                return;
            };

            const totalPrepSeconds = prepTimeMinutes * 60;
            const startTime = parseTime(order.time, new Date(order.date));
            const now = new Date();
            
            const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
            const remainingSeconds = Math.max(0, totalPrepSeconds - elapsedSeconds);

            const minutes = Math.floor(remainingSeconds / 60);
            const seconds = remainingSeconds % 60;
            
            setRemainingTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        };

        calculateRemainingTime();
        const interval = setInterval(calculateRemainingTime, 1000);

        return () => clearInterval(interval);
    }, [order.prepTime, order.time, order.date, order.status]);

    const isBooking = order.items.some(item => item.category === 'Booking');
    const orderType = isBooking ? 'Booking' : order.type;
    const type = typeConfig[orderType];
    
    const guestCount = isBooking ? order.items[0].name.match(/\d+/)?.[0] : null;
    const tableInfo = isBooking || order.type === 'Dine-in' ? order.customerDetails.address.replace('Tables: ', '').replace('Table ', '') : null;


    const getNextAction = () => {
        switch (order.status) {
            case "New":
            case "Incoming":
                return { label: "Mark as 'Preparing'", newStatus: "Preparing" as OrderStatus };
            case "Preparing":
                return { label: "Mark as 'Ready for Pickup'", newStatus: "Ready" as OrderStatus };
            case "Ready":
                return { label: "Mark as 'Completed'", newStatus: "Delivered" as OrderStatus };
            default:
                return null;
        }
    };

    const nextAction = getNextAction();

    return (
       <Card className="shadow-sm hover:shadow-md transition-shadow flex flex-col">
        <CardContent className="p-0 flex-grow flex flex-col">
          <div className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                    {status && (
                    <Badge variant="secondary" className={cn("flex items-center gap-1.5 font-semibold text-xs", status.color)}>
                        <status.icon className="h-3 w-3" />
                        {status.label}
                    </Badge>
                    )}
                    {type && (
                    <Badge variant="secondary" className={cn("flex items-center gap-1.5 font-semibold text-xs", type.color)}>
                        <type.icon className="h-3 w-3" />
                        {orderType}
                    </Badge>
                    )}
                    {order.source === 'Offline' && (
                    <Badge variant="secondary" className="flex items-center gap-1.5 font-semibold text-xs bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        <Zap className="h-3 w-3"/>
                        Offline
                    </Badge>
                    )}
                </div>
                 <div className="text-right flex-shrink-0">
                  <p className="font-bold text-lg flex items-center justify-end">
                    <IndianRupee className="h-4 w-4"/>{order.total.toFixed(2)}
                  </p>
                   <p className="text-xs text-muted-foreground -mt-1">Total</p>
                </div>
              </div>
          
              <Separator className="my-3" />

              <div className="flex items-end justify-between">
                <div className="flex-1 min-w-0">
                     <p className="font-semibold text-base truncate">{order.id}</p>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <User className="h-4 w-4" />
                        <span className="truncate">{order.customer}</span>
                    </div>
                    {isBooking || order.type === 'Dine-in' ? (
                       <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                            {guestCount && (
                                <div className="flex items-center gap-1.5">
                                    <Users2 className="h-3.5 w-3.5" />
                                    <span>{guestCount} Guests</span>
                                </div>
                            )}
                            {tableInfo && (
                                <div className="flex items-center gap-1.5">
                                    <Table className="h-3.5 w-3.5" />
                                    <span>{tableInfo}</span>
                                </div>
                            )}
                       </div>
                    ) : (
                         <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Package className="h-3.5 w-3.5" />
                            <span>{order.items.length} {order.items.length > 1 ? 'items' : 'item'}</span>
                        </div>
                    )}
                </div>
                 <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {order.status === 'Preparing' && (
                        <div className="text-right">
                            <p className="font-bold text-lg text-primary">{remainingTime}</p>
                            <p className="text-xs text-muted-foreground -mt-1">Time Left</p>
                        </div>
                    )}
                     <DetailsSheet order={order}>
                        <Button variant="ghost" size="sm" className="text-muted-foreground flex items-center gap-1 h-auto p-1">
                            View Details
                        </Button>
                    </DetailsSheet>
                 </div>
              </div>
          </div>
        </CardContent>
         {nextAction && (
          <div className="border-t">
            <Button 
              size="sm"
              className="h-9 w-full rounded-t-none"
              onClick={() => updateOrderStatus(order.id, nextAction.newStatus)}
            >
              {nextAction.label}
            </Button>
          </div>
        )}
      </Card>
    );
};
