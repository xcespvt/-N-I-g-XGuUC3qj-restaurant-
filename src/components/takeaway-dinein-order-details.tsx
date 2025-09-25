"use client";

import type { Order } from "@/context/useAppStore";
import { SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Printer,
  IndianRupee,
  ArrowLeft,
  User,
  Clock,
  Wallet,
  Phone,
  FileText,
  Star,
  KeyRound,
  Package,
  Ticket,
  Users2,
  Table,
  MoreVertical,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "./ui/card";
import { useAppStore } from "@/context/useAppStore";
import { KotDialog } from "./kot-dialog";
import { OrderDetailsDialog } from "./order-details-dialog";
import { CountdownTimer } from "./countdown-timer";

const DetailItem = ({
  icon: Icon,
  label,
  value,
  valueClass,
  children,
}: {
  icon: React.ElementType;
  label: string;
  value: string | React.ReactNode;
  valueClass?: string;
  children?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
    <div className={`font-semibold flex items-center gap-1 ${valueClass}`}>
      {value}
      {children}
    </div>
  </div>
);

export function TakeawayDineinOrderDetails({ order }: { order: Order }) {
  const { updateOrderStatus } = useAppStore();
  const subtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const commission = subtotal * 0.12;
  const total = subtotal + commission;

  const isBooking = order.items.some((item) => item.category === "Booking");
  const guestCount = isBooking ? order.items[0].name.match(/\d+/)?.[0] : null;
  const tableInfo =
    isBooking || order.type === "Dine-in"
      ? order.customerDetails.address
          .replace("Tables: ", "")
          .replace("Table ", "")
      : null;

  return (
    <>
      <SheetHeader className="p-4 border-b text-left flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SheetClose asChild>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </SheetClose>
          <SheetTitle className="text-lg">Order Details</SheetTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Report Issue</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SheetHeader>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-muted/50">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <h2 className="font-bold text-xl">{order.id}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className="bg-orange-100 text-orange-700 border-orange-200"
                >
                  Ready for Pickup
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1.5">
                  <Package className="h-3 w-3" /> {order.type}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <DetailItem
                icon={User}
                label="Customer"
                value={order.customerDetails.name}
              >
                {order.source !== "Offline" && (
                  <>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 ml-1" />{" "}
                    4.2
                  </>
                )}
              </DetailItem>
              {guestCount && (
                <DetailItem icon={Users2} label="Guests" value={guestCount} />
              )}
              {tableInfo && (
                <DetailItem icon={Table} label="Table(s)" value={tableInfo} />
              )}
              <DetailItem
                icon={Clock}
                label="Order Time"
                value={`${new Date(order.date).toLocaleDateString()}, ${
                  order.time
                }`}
              />
              <DetailItem
                icon={Wallet}
                label="Payment"
                value={order.payment.status}
                valueClass={
                  order.payment.status === "Paid"
                    ? "text-green-600"
                    : "text-red-500"
                }
              />
            </div>
            <CountdownTimer order={order} />
            <div className="flex flex-col gap-2">
              {order.source !== "Offline" && (
                <Button variant="outline" className="w-full">
                  <Phone className="mr-2 h-4 w-4" /> Call Customer
                </Button>
              )}
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => updateOrderStatus(order.id, "Delivered")}
              >
                Mark as "Completed"
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="w-full">
                    <Printer className="mr-2 h-4 w-4" /> KOT
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xs p-0">
                  <KotDialog order={order} />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="w-full">
                    <FileText className="mr-2 h-4 w-4" /> Invoice
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md p-0">
                  <OrderDetailsDialog order={order} />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold">Order Summary</h3>
            <div className="space-y-1 text-sm">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <p>
                    {item.quantity} x {item.name}
                  </p>
                  <p className="font-medium flex items-center">
                    <IndianRupee className="h-3.5 w-3.5" />
                    {item.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <p className="text-muted-foreground">Item Subtotal</p>
                <p className="font-medium flex items-center">
                  <IndianRupee className="h-3.5 w-3.5" />
                  {subtotal.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground">Commission (12%)</p>
                <p className="font-medium flex items-center">
                  <IndianRupee className="h-3.5 w-3.5" />
                  {commission.toFixed(2)}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg">Total Amount</p>
              <p className="font-bold text-lg flex items-center">
                <IndianRupee className="h-5 w-5" />
                {total.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        {order.offer && (
          <Card>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold flex items-center gap-2 text-primary">
                <Ticket className="h-5 w-5" /> Offer Applied
              </h3>
              <div className="text-sm bg-primary/10 p-3 rounded-lg">
                <p className="font-bold text-base">{order.offer.code}</p>
                <p className="text-muted-foreground">
                  Type: {order.offer.type}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {order.type !== "Dine-in" && order.source !== "Offline" && (
          <Card>
            <CardContent className="p-4 text-center space-y-2">
              <p className="text-sm font-semibold flex items-center justify-center gap-2 text-muted-foreground">
                <KeyRound className="h-4 w-4" /> PICKUP OTP
              </p>
              <div className="flex justify-center items-center gap-2 text-3xl font-bold text-primary">
                {order.pickupOtp?.split("").map((digit, index) => (
                  <span key={index}>{digit}</span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Share this OTP with the customer upon pickup.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
