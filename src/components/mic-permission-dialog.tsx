
"use client";

import { Mic } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';

type MicPermissionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MicPermissionDialog({ open, onOpenChange }: MicPermissionDialogProps) {

  const handleAllow = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone permission granted');
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
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
          <SheetTitle>Microphone Permission</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-800">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 shadow-md animate-breathing-glow">
                    <Mic className="h-8 w-8 text-primary" />
                </div>
            </div>
          <h2 className="text-xl font-bold">Enable Microphone</h2>
          <p className="mt-2 text-gray-400">
            Allow microphone access to use voice search and other voice commands.
          </p>
          <div className="mt-6 w-full space-y-3">
             <Button 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-lg font-bold rounded-full text-primary-foreground"
                onClick={handleAllow}
            >
                Enable Microphone
            </Button>
            <Button 
                variant="ghost" 
                className="w-full h-12 text-lg font-semibold text-gray-400"
                onClick={handleDeny}
            >
                Not Now
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
