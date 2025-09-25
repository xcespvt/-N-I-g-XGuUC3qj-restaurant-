"use client";

import type { Order } from "@/context/useAppStore";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Printer } from "lucide-react";

export function KotDialog({ order }: { order: Order }) {
  return (
    <>
      <DialogHeader className="p-4 border-b text-center">
        <DialogTitle className="text-2xl font-bold font-mono uppercase tracking-widest">
          K.O.T
        </DialogTitle>
      </DialogHeader>
      <div className="p-4 font-mono">
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="font-semibold">Order ID: {order.id}</p>
            <p>Date: {order.date}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Time: {order.time}</p>
            <p>Type: {order.type}</p>
          </div>
        </div>
        {order.type === "Dine-in" && (
          <div className="text-center bg-foreground text-background font-bold text-2xl py-2 rounded-md mb-4">
            TABLE: {order.customerDetails.address.split(" ").pop()}
          </div>
        )}

        <Separator className="my-2 border-dashed border-foreground" />

        <div className="space-y-2 py-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-start text-xl leading-tight">
              <p className="font-bold w-10">{item.quantity}x</p>
              <p className="font-semibold">{item.name}</p>
            </div>
          ))}
        </div>

        <Separator className="my-2 border-dashed border-foreground" />

        <div className="text-center text-xs pt-2">--- End of Order ---</div>
      </div>
      <DialogFooter className="bg-muted p-4 border-t">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.print()}
        >
          <Printer className="mr-2 h-4 w-4" />
          Print KOT
        </Button>
      </DialogFooter>
    </>
  );
}
