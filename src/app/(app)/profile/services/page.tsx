
"use client"

import { usePut, useGet } from "@/hooks/useApi"
import { useState, useEffect } from "react"
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
import { Skeleton } from "@/components/ui/skeleton"

const allServices = [
    { id: 'delivery', label: 'Delivery', description: 'Offer delivery to customers via Crevings delivery partners.', icon: Truck },
    { id: 'takeaway', label: 'Takeaway', description: 'Allow customers to place orders for pickup.', icon: ShoppingBag },
    { id: 'dineIn', label: 'Dine-In', description: 'Enable QR code-based ordering for dine-in customers.', icon: UtensilsCrossed },
    { id: 'booking', label: 'Online Booking', description: 'Accept table reservations through the app.', icon: Calendar },
];


export default function ServicesPage() {
    const { updateServiceSetting, selectedBranch } = useAppStore();
    const { toast } = useToast();

    // Fetch existing profile data
    const { data: profileResponse, isLoading } = useGet<any>(
        ['profile', selectedBranch],
        `/api/branches/${selectedBranch}/profile`,
        undefined,
        { enabled: !!selectedBranch }
    );

    const [localServices, setLocalServices] = useState<any>(null);

    // Update settings when data is loaded
    useEffect(() => {
        if (profileResponse?.data?.services) {
            setLocalServices(profileResponse.data.services);
            // Also update the app store to keep them in sync
            Object.entries(profileResponse.data.services).forEach(([key, value]) => {
                if (typeof value === "boolean") {
                    updateServiceSetting(key as any, value);
                }
            });
        }
    }, [profileResponse, updateServiceSetting]);


    const { mutate: updateProfile, isPending } = usePut(`/api/branches/${selectedBranch}/profile`);

    const handleToggleService = (serviceId: string, value: boolean) => {
        setLocalServices((prev: any) => ({ ...prev, [serviceId]: value }));
    };

    const handleSaveChanges = () => {
        updateProfile(
            { services: localServices },
            {
                onSuccess: () => {
                    Object.keys(localServices).forEach(key => {
                        updateServiceSetting(key as any, localServices[key]);
                    });
                    toast({
                        title: "Services Updated",
                        description: "Your available services have been saved.",
                    });
                },
                onError: (error: any) => {
                    toast({
                        title: "Error",
                        description: error.message || "Failed to update services",
                        variant: "destructive",
                    });
                }
            }
        );
    }

    if (isLoading && !localServices) {
        return (
            <div className="flex flex-col gap-6 max-w-3xl mx-auto">
                <Skeleton className="h-4 w-24" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-full mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-24 w-full rounded-lg" />
                        ))}
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
            <Link href="/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
                <ArrowLeft className="h-4 w-4" />
                Back to Profile
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-semibold md:text-3xl">Your Services</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Wrench className="h-5 w-5" /> Manage Services</CardTitle>
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
                                checked={localServices?.[service.id] || false}
                                onCheckedChange={(checked) => handleToggleService(service.id, checked)}
                                disabled={isPending}
                            />
                        </Label>
                    ))}
                    {!isLoading && allServices.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">No services available to configure.</p>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-6">
                    <Button onClick={handleSaveChanges} disabled={isPending || !localServices}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
