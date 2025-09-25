"use client";

import type { Order } from "@/context/useAppStore";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Printer, IndianRupee } from "lucide-react";

export function OrderDetailsDialog({ order }: { order: Order }) {
  const subtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const taxes = subtotal * 0.18; // Example tax rate
  const grandTotal = subtotal + taxes;

  return (
    <>
      <DialogHeader className="p-6 border-b bg-muted/50">
        <DialogTitle className="text-2xl flex justify-between items-center">
          <span>Invoice</span>
          <span className="text-base font-medium text-muted-foreground">
            {order.id}
          </span>
        </DialogTitle>
        <DialogDescription>
          Date:{" "}
          {new Date(order.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          at {order.time}
        </DialogDescription>
      </DialogHeader>
      <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Billed To
            </h3>
            <p className="font-semibold text-base">
              {order.customerDetails.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {order.customerDetails.address}
              <br />
              {order.customerDetails.email}
              <br />
              {order.customerDetails.phone}
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2 text-primary">Order Summary</h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[100px]">#</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-center">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-0.5">
                      <IndianRupee className="h-3.5 w-3.5" />
                      {item.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium flex items-center justify-end gap-0.5">
                      <IndianRupee className="h-3.5 w-3.5" />
                      {(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="w-full flex justify-end mt-4">
            <div className="w-full max-w-sm space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium flex items-center">
                  <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                  {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Taxes & Fees (18%)
                </span>
                <span className="font-medium flex items-center">
                  <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                  {taxes.toFixed(2)}
                </span>
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between font-bold text-base">
                <span>Grand Total</span>
                <span className="flex items-center text-primary">
                  <IndianRupee className="h-4 w-4 mr-0.5" />
                  {grandTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground pt-2">
                <span>Payment Method:</span>
                <span className="font-medium">{order.payment.method}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Payment Status:</span>
                <span className="font-medium text-green-600">
                  {order.payment.status}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground mt-8">
          Thank you for your business!
        </div>
      </div>
      <DialogFooter className="bg-muted p-4 border-t">
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Print Invoice
        </Button>
      </DialogFooter>
    </>
  );
}
