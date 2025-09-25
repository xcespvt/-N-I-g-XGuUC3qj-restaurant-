
"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Wrench, Truck, ShoppingBag, UtensilsCrossed, Calendar } from "lucide-react"
import { useAppStore } from "@/context/useAppStore"
import { useToast } from "@/hooks/use-toast"

const allServices = [
  { id: 'delivery', label: 'Delivery', description: 'Offer delivery to customers via Crevings delivery partners.', icon: Truck },
  { id: 'takeaway', label: 'Takeaway', description: 'Allow customers to place orders for pickup.', icon: ShoppingBag },
  { id: 'dineIn', label: 'Dine-In', description: 'Enable QR code-based ordering for dine-in customers.', icon: UtensilsCrossed },
  { id: 'booking', label: 'Online Booking', description: 'Accept table reservations through the app.', icon: Calendar },
];


export default function ServicesPage() {
    const { serviceSettings, updateServiceSetting } = useAppStore();
    const { toast } = useToast();

    const handleSaveChanges = () => {
        toast({
            title: "Services Updated",
            description: "Your available services have been saved.",
        });
    }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <Link href="/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
          <ArrowLeft className="h-4 w-4"/>
          Back to Profile
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-semibold md:text-3xl">Your Services</h1>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wrench className="h-5 w-5"/> Manage Services</CardTitle>
                <CardDescription>Enable or disable the services you offer. This will affect how customers can order from you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {allServices.map((service) => (
                    <Label key={service.id} htmlFor={`service-${service.id}`} className="flex items-start justify-between p-4 rounded-lg border cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
                        <div className="flex items-start gap-4">
                            <service.icon className="h-5 w-5 text-primary mt-1" />
                            <div>
                                <span className="font-semibold text-base">{service.label}</span>
                                <p className="text-sm text-muted-foreground">{service.description}</p>
                            </div>
                        </div>
                        <Switch
                            id={`service-${service.id}`}
                            checked={serviceSettings[service.id as keyof typeof serviceSettings]}
                            onCheckedChange={(checked) => updateServiceSetting(service.id as keyof typeof serviceSettings, checked)}
                        />
                    </Label>
                ))}
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-6">
                <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
        </Card>
    </div>
  )
}
