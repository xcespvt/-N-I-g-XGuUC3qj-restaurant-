"use client";

import { useState } from "react";
import type { Order } from "@/context/useAppStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";

interface PrepTimeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
  onConfirm: (time: string) => void;
}

const timeOptions = ["10", "15", "20", "25", "30", "45"];

export function PrepTimeDialog({
  isOpen,
  onOpenChange,
  order,
  onConfirm,
}: PrepTimeDialogProps) {
  const [customTime, setCustomTime] = useState("");

  const handleConfirm = (time?: string) => {
    const prepTime = time || customTime;
    if (prepTime) {
      onConfirm(`${prepTime} min`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Preparation Time</DialogTitle>
          <DialogDescription>
            Estimate how long it will take to prepare order {order.id}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="grid grid-cols-3 gap-2">
            {timeOptions.map((time) => (
              <Button
                key={time}
                variant="outline"
                onClick={() => handleConfirm(time)}
              >
                {time} min
              </Button>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or enter manually
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="e.g. 12"
                className="pl-9"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
              />
            </div>
            <p className="text-sm font-medium">minutes</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => handleConfirm()} disabled={!customTime}>
            Confirm & Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
