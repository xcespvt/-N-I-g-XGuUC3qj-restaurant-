
"use client";

import { useRouter } from 'next/navigation';
import { MapPinOff, Search } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';

type LocationPermissionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LocationPermissionDialog({ open, onOpenChange }: LocationPermissionDialogProps) {
  const router = useRouter();

  const handleContinue = () => {
    // Logic to request location permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Latitude: " + position.coords.latitude);
          console.log("Longitude: " + position.coords.longitude);
          onOpenChange(false);
        },
        (error) => {
          console.error("Error getting location: ", error);
          // Handle error, maybe show another message
          onOpenChange(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      onOpenChange(false);
    }
  };
  
  const handleSearchLocation = () => {
    onOpenChange(false);
    router.push('/location');
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="w-full rounded-t-2xl p-6 pb-8 bg-[#1A1A1A] text-white border-gray-800"
        hideCloseButton={true}
       >
        <SheetHeader className="sr-only">
          <SheetTitle>Location Permission</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-800">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 shadow-md animate-breathing-glow">
                    <MapPinOff className="h-8 w-8 text-primary" />
                </div>
            </div>
          <h2 className="text-xl font-bold">Location permission is off</h2>
          <p className="mt-2 text-gray-400">
            Please enable location permission for a better delivery experience
          </p>
          <div className="mt-6 w-full space-y-3">
             <Button 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-lg font-bold rounded-full text-primary-foreground"
                onClick={handleContinue}
            >
                Continue
            </Button>
            <Button 
                variant="ghost" 
                className="w-full h-12 text-lg font-semibold text-gray-400"
                onClick={handleSearchLocation}
            >
                <Search className="mr-2 h-5 w-5" />
                Search your location
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
