
"use client";

import { Bell } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';

type NotificationPermissionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function NotificationPermissionDialog({ open, onOpenChange }: NotificationPermissionDialogProps) {

  const handleAllow = async () => {
    try {
      const permission = await Notification.requestPermission();
      console.log('Notification permission status:', permission);
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
    onOpenChange(false);
  };
  
  const handleDeny = () => {
    onOpenChange(false);
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="w-full rounded-t-2xl p-6 pb-8 bg-[#1A1A1A] text-white border-gray-800"
        hideCloseButton={true}
       >
        <SheetHeader className="sr-only">
          <SheetTitle>Notification Permission</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-800">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 shadow-md animate-breathing-glow">
                    <Bell className="h-8 w-8 text-primary" />
                </div>
            </div>
          <h2 className="text-xl font-bold">Enable Notifications</h2>
          <p className="mt-2 text-gray-400">
            Get updates on your order status, new offers, and more.
          </p>
          <div className="mt-6 w-full space-y-3">
             <Button 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-lg font-bold rounded-full text-primary-foreground"
                onClick={handleAllow}
            >
                Allow Notifications
            </Button>
            <Button 
                variant="ghost" 
                className="w-full h-12 text-lg font-semibold text-gray-400"
                onClick={handleDeny}
            >
                Maybe Later
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
