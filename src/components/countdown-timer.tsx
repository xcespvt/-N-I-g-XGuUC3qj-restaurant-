
"use client"

import { useState, useEffect } from "react"
import type { Order } from "@/context/AppContext"
import { Progress } from "./ui/progress"
import { Clock, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/context/useAppStore"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"


const DelayTimeDialog = ({
  isOpen,
  onOpenChange,
  orderId,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  orderId: string
}) => {
  const { updateOrderPrepTime } = useAppStore()
  const delayOptions = [5, 10, 15]

  const handleAddTime = (minutes: number) => {
    updateOrderPrepTime(orderId, minutes)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Delay to Order</DialogTitle>
          <DialogDescription>
            Select how much extra time you need to prepare this order. The customer will be notified.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 grid grid-cols-3 gap-4">
          {delayOptions.map(time => (
            <Button
              key={time}
              variant="outline"
              className="h-20 flex-col gap-1"
              onClick={() => handleAddTime(time)}
            >
              <span className="text-2xl font-bold">{time}</span>
              <span className="text-xs">minutes</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// A helper function to parse time like "10:30 AM" into a Date object for a given date
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


export const CountdownTimer = ({ order }: { order: Order }) => {
    const [remainingTime, setRemainingTime] = useState({ minutes: 0, seconds: 0 });
    const [progress, setProgress] = useState(100);
    const [isDelayDialogOpen, setIsDelayDialogOpen] = useState(false);

    useEffect(() => {
        const calculateRemainingTime = () => {
            const prepTimeMinutes = parseInt(order.prepTime.split(' ')[0], 10);
            if (isNaN(prepTimeMinutes)) return;

            const totalPrepSeconds = prepTimeMinutes * 60;
            const startTime = parseTime(order.time, new Date(order.date));
            const now = new Date();
            
            const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
            const remainingSeconds = Math.max(0, totalPrepSeconds - elapsedSeconds);

            const minutes = Math.floor(remainingSeconds / 60);
            const seconds = remainingSeconds % 60;
            
            setRemainingTime({ minutes, seconds });
            
            const newProgress = totalPrepSeconds > 0 ? (remainingSeconds / totalPrepSeconds) * 100 : 0;
            setProgress(newProgress);
        };

        calculateRemainingTime();
        const interval = setInterval(calculateRemainingTime, 1000);

        return () => clearInterval(interval);
    }, [order.prepTime, order.time, order.date]);

    const isTimeUp = remainingTime.minutes === 0 && remainingTime.seconds === 0;

    return (
        <>
            <div className="border rounded-lg p-3 space-y-3 bg-background">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="h-4 w-4" />
                        <span>Time Left</span>
                    </div>
                    <div className={cn("font-bold text-lg", isTimeUp ? "text-red-500" : "text-primary")}>
                        {isTimeUp ? "Time's up!" : `${remainingTime.minutes.toString().padStart(2, '0')}:${remainingTime.seconds.toString().padStart(2, '0')}`}
                    </div>
                </div>
                <Progress value={progress} className="h-2" />
                <Button variant="outline" size="sm" className="w-full" onClick={() => setIsDelayDialogOpen(true)} disabled={isTimeUp}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Delay
                </Button>
            </div>
             <DelayTimeDialog
                isOpen={isDelayDialogOpen}
                onOpenChange={setIsDelayDialogOpen}
                orderId={order.id}
            />
        </>
    );
};
