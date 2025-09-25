"use client";

import type { Order } from "@/context/useAppStore";
import { SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Printer,
  IndianRupee,
  ArrowLeft,
  User,
  Clock,
  Wallet,
  Phone,
  Bike,
  FileText,
  Star,
  KeyRound,
  Ticket,
  MoreVertical,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "./ui/card";
import { useAppStore } from "@/context/useAppStore";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KotDialog } from "./kot-dialog";
import { OrderDetailsDialog } from "./order-details-dialog";
import { CountdownTimer } from "./countdown-timer";

const DetailItem = ({
  icon: Icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClass?: string;
}) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
    <span className={`font-semibold ${valueClass}`}>{value}</span>
  </div>
);

export function DeliveryOrderDetails({ order }: { order: Order }) {
  const { updateOrderStatus } = useAppStore();
  const subtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const commission = subtotal * 0.12;
  const discount = 5.0; // Mock data
  const total = subtotal - discount + commission;

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
                  <Bike className="h-3 w-3" /> Delivery
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <DetailItem
                icon={User}
                label="Customer"
                value={order.customerDetails.name}
                valueClass="flex items-center gap-1.5 text-yellow-500"
              />
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
              <Button variant="outline" className="w-full">
                <Phone className="mr-2 h-4 w-4" /> Call Customer
              </Button>
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
                <p className="text-muted-foreground">Discount</p>
                <p className="font-medium text-green-600 flex items-center">
                  -<IndianRupee className="h-3.5 w-3.5" />
                  {discount.toFixed(2)}
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
            <Separator />
            <div>
              <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
                <FileText className="h-4 w-4" /> Special Note
              </h4>
              <p className="text-sm text-muted-foreground">
                Extra spicy please, and no onions.
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

        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Bike className="h-5 w-5" /> Delivery Partner
            </h3>
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16">
                <AvatarImage src={order.deliveryPartner?.avatar} />
                <AvatarFallback>
                  {order.deliveryPartner?.avatarFallback}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-lg">
                  {order.deliveryPartner?.name}
                </p>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-semibold">
                    {order.deliveryPartner?.rating} Rating
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
            >
              <Phone className="mr-2 h-4 w-4" /> Call Partner
            </Button>
          </CardContent>
        </Card>

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
              Share this OTP with the delivery partner upon pickup.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
