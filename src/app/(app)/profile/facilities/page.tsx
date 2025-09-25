
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
import { ArrowLeft, Sparkles, ParkingCircle, Siren, Wind, Droplet, User, Users, Accessibility, Map, GraduationCap, Sun, Car, Sofa, Building2 } from "lucide-react"
import { useAppStore } from "@/context/useAppStore"
import { useToast } from "@/hooks/use-toast"

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
    const { facilities, updateFacilities } = useAppStore();
    const { toast } = useToast();

    const handleToggleFacility = (facilityId: string) => {
        const newFacilities = facilities.includes(facilityId)
            ? facilities.filter(id => id !== facilityId)
            : [...facilities, facilityId];
        updateFacilities(newFacilities);
    };

    const handleSaveChanges = () => {
        toast({
            title: "Facilities Updated",
            description: "Your restaurant's available facilities have been saved.",
        });
    }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <Link href="/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
          <ArrowLeft className="h-4 w-4"/>
          Back to Profile
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-semibold md:text-3xl">Facilities & Amenities</h1>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5"/> Manage Facilities</CardTitle>
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
                            checked={facilities.includes(facility.id)}
                            onCheckedChange={() => handleToggleFacility(facility.id)}
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
