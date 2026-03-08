
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { useAppStore } from "@/context/useAppStore"
import { usePut, useGet } from "@/hooks/useApi"
import { Skeleton } from "@/components/ui/skeleton"

export default function OperatingHoursPage() {
    const { selectedBranch } = useAppStore();
    const { toast } = useToast();

    // Fetch existing profile data
    const { data: profileResponse, isLoading } = useGet<any>(
        ['profile', selectedBranch],
        `/api/branches/${selectedBranch}/profile`,
        undefined,
        { enabled: !!selectedBranch }
    );

    const [operatingHours, setOperatingHours] = useState<any[]>([]);

    // Update data when profile is loaded
    useEffect(() => {
        if (profileResponse?.data?.operatingHours && profileResponse.data.operatingHours.length > 0) {
            setOperatingHours(profileResponse.data.operatingHours);
        }
    }, [profileResponse]);


    const { mutate: updateProfile, isPending } = usePut(`/api/branches/${selectedBranch}/profile`);

    const handleHoursChange = (index: number, field: 'opening' | 'closing', value: string) => {
        const newHours = [...operatingHours];
        newHours[index][field] = value;
        setOperatingHours(newHours);
    };

    const handleOpenChange = (index: number, open: boolean) => {
        const newHours = [...operatingHours];
        newHours[index].open = open;
        setOperatingHours(newHours);
    };

    const handleSaveChanges = () => {
        updateProfile(
            { operatingHours },
            {
                onSuccess: () => {
                    toast({
                        title: "Settings Saved",
                        description: "Your operating hours have been updated successfully.",
                    });
                },
                onError: (error) => {
                    toast({
                        title: "Error",
                        description: error.message || "Failed to update profile",
                        variant: "destructive",
                    });
                }
            }
        );
    }

    if (isLoading && operatingHours.length === 0) {
        return (
            <div className="flex flex-col gap-6 max-w-3xl mx-auto">
                <Skeleton className="h-4 w-24" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-full mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div key={i} className="flex items-center justify-between py-2">
                                <Skeleton className="h-6 w-24" />
                                <div className="flex gap-4">
                                    <Skeleton className="h-10 w-32" />
                                    <Skeleton className="h-10 w-32" />
                                </div>
                            </div>
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
                <h1 className="text-2xl font-semibold md:text-3xl">Operating Hours</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Weekly Schedule</CardTitle>
                    <CardDescription>Set your restaurant's opening and closing times for each day.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="hidden sm:grid grid-cols-[1fr_auto_auto] gap-x-4 px-2 text-sm font-medium text-muted-foreground">
                        <span>Day</span>
                        <span>Opening Time</span>
                        <span>Closing Time</span>
                    </div>
                    {operatingHours.map((item, index) => (
                        <div key={item.day} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] items-center gap-x-4 gap-y-2 p-2 rounded-lg hover:bg-muted/50">
                            <div className="flex items-center justify-between sm:justify-start gap-4">
                                <Label className="font-semibold text-base col-span-1">{item.day}</Label>
                                <Switch
                                    id={`open-${item.day}`}
                                    checked={item.open}
                                    onCheckedChange={(checked) => handleOpenChange(index, checked)}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`opening-${item.day}`} className="text-xs text-muted-foreground sm:hidden">Opening</Label>
                                <Input
                                    id={`opening-${item.day}`}
                                    type="time"
                                    className="w-full sm:w-32"
                                    value={item.opening}
                                    onChange={(e) => handleHoursChange(index, 'opening', e.target.value)}
                                    disabled={!item.open}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`closing-${item.day}`} className="text-xs text-muted-foreground sm:hidden">Closing</Label>
                                <Input
                                    id={`closing-${item.day}`}
                                    type="time"
                                    className="w-full sm:w-32"
                                    value={item.closing}
                                    onChange={(e) => handleHoursChange(index, 'closing', e.target.value)}
                                    disabled={!item.open}
                                />
                            </div>
                        </div>
                    ))}
                    {!isLoading && operatingHours.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">No operating hours data found.</p>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-6">
                    <Button onClick={handleSaveChanges} disabled={isPending || operatingHours.length === 0}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
