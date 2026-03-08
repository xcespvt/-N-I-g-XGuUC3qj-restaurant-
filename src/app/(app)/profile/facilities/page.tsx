
"use client"

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
import { ArrowLeft, Sparkles, ParkingCircle, Siren, Wind, Droplet, User, Users, Accessibility, Map, GraduationCap, Sun, Car, Sofa, Building2 } from "lucide-react"
import { useAppStore } from "@/context/useAppStore"
import { useToast } from "@/hooks/use-toast"
import { usePut, useGet } from "@/hooks/useApi"
import { Skeleton } from "@/components/ui/skeleton"

const allFacilities = [
    { id: 'ac', label: 'Air Conditioning', icon: Wind },
    { id: 'washroom', label: 'Washroom', icon: Droplet },
    { id: 'parking', label: 'Parking Spaces', icon: ParkingCircle },
    { id: 'outdoor-seating', label: 'Outdoor Seating', icon: Sun },
    { id: 'familyFriendly', label: 'Family Friendly', icon: Users },
    { id: 'womenSafety', label: 'Women Safety', icon: Siren },
    { id: 'lgbtq', label: 'LGBTQ+ Friendly', icon: User },
    { id: 'groups', label: 'Good for Groups', icon: Users },
    { id: 'students', label: 'University Students', icon: GraduationCap },
    { id: 'tourists', label: 'Good for Tourists', icon: Map },
    { id: 'wheelchair-seating', label: 'Wheelchair-accessible Seating', icon: Accessibility },
    { id: 'wheelchair-toilet', label: 'Wheelchair-accessible Toilet', icon: Accessibility },
    { id: 'kerbside-pickup', label: 'Kerbside Pickup', icon: Car },
    { id: 'drive-through', label: 'Drive-through', icon: Building2 },
];


export default function FacilitiesPage() {
    const { updateFacilities, selectedBranch } = useAppStore();
    const { toast } = useToast();

    // Fetch existing profile data
    const { data: profileResponse, isLoading } = useGet<any>(
        ['profile', selectedBranch],
        `/api/branches/${selectedBranch}/profile`,
        undefined,
        { enabled: !!selectedBranch }
    );

    // Local state to keep track of changes before saving
    const [localFacilities, setLocalFacilities] = useState<string[]>([]);
    const [hasLoaded, setHasLoaded] = useState(false);

    // Update data when profile is loaded
    useEffect(() => {
        if (profileResponse?.data?.facilities) {
            setLocalFacilities(profileResponse.data.facilities);
            updateFacilities(profileResponse.data.facilities);
            setHasLoaded(true);
        }
    }, [profileResponse, updateFacilities]);


    const { mutate: updateProfile, isPending } = usePut(`/api/branches/${selectedBranch}/profile`);

    const handleToggleFacility = (facilityId: string) => {
        const newFacilities = localFacilities.includes(facilityId)
            ? localFacilities.filter(id => id !== facilityId)
            : [...localFacilities, facilityId];
        setLocalFacilities(newFacilities);
    };

    const handleSaveChanges = () => {
        updateProfile(
            { facilities: localFacilities },
            {
                onSuccess: () => {
                    updateFacilities(localFacilities);
                    toast({
                        title: "Facilities Updated",
                        description: "Your restaurant's available facilities have been saved.",
                    });
                },
                onError: (error) => {
                    toast({
                        title: "Error",
                        description: error.message || "Failed to update facilities",
                        variant: "destructive",
                    });
                }
            }
        );
    }

    if (isLoading && !hasLoaded) {
        return (
            <div className="flex flex-col gap-6 max-w-3xl mx-auto">
                <Skeleton className="h-4 w-24" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-full mt-2" />
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <Skeleton key={i} className="h-16 w-full rounded-lg" />
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
                <h1 className="text-2xl font-semibold md:text-3xl">Facilities & Amenities</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5" /> Manage Facilities</CardTitle>
                    <CardDescription>Select all the facilities available at your restaurant. This information will be visible to customers.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allFacilities.map((facility) => (
                        <Label key={facility.id} htmlFor={`facility-${facility.id}`} className="flex items-center justify-between p-4 rounded-lg border cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
                            <div className="flex items-center gap-3">
                                <facility.icon className="h-5 w-5 text-primary" />
                                <span className="font-medium">{facility.label}</span>
                            </div>
                            <Switch
                                id={`facility-${facility.id}`}
                                checked={localFacilities.includes(facility.id)}
                                onCheckedChange={() => handleToggleFacility(facility.id)}
                                disabled={isPending}
                            />
                        </Label>
                    ))}
                    {!isLoading && allFacilities.length === 0 && (
                        <p className="col-span-full text-center text-muted-foreground py-4">No facilities available to configure.</p>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-6">
                    <Button onClick={handleSaveChanges} disabled={isPending}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
