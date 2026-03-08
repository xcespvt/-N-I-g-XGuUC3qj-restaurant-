"use client"

import { useState, useEffect } from "react"
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
import { ArrowLeft, Mail, Phone, ShieldCheck, User, MessageCircle, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useAppStore } from "@/context/useAppStore"
import { usePut, useGet } from "@/hooks/useApi"
import { Skeleton } from "@/components/ui/skeleton"

const DetailItem = ({ icon: Icon, label, value, isLoading }: { icon: React.ElementType, label: string, value?: string, isLoading?: boolean }) => (
    <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon className="h-4 w-4" />
            <span>{label}</span>
        </div>
        {isLoading ? (
            <Skeleton className="h-5 w-48 mt-1" />
        ) : (
            <p className="font-medium mt-1">{value || "Not provided"}</p>
        )}
    </div>
)

export default function OwnerInformationPage() {
    const { ownerInfo, updateOwnerInfo, selectedBranch } = useAppStore();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);

    // Fetch existing profile data
    const { data: profileResponse, isLoading } = useGet<any>(
        ['profile', selectedBranch],
        `/api/branches/${selectedBranch}/profile`,
        undefined,
        { enabled: !!selectedBranch }
    );

    const [formData, setFormData] = useState<any>(null);

    // Update form data and globals when data is loaded
    useEffect(() => {
        if (profileResponse?.data?.ownerInfo) {
            setFormData(profileResponse.data.ownerInfo);
            updateOwnerInfo(profileResponse.data.ownerInfo);
        }
    }, [profileResponse, updateOwnerInfo]);


    const { mutate: updateProfile, isPending } = usePut(`/api/branches/${selectedBranch}/profile`);

    const handleUpdate = () => {
        updateProfile(
            { ownerInfo: formData },
            {
                onSuccess: () => {
                    updateOwnerInfo(formData);
                    setIsEditing(false);
                    toast({
                        title: "Owner Information Updated",
                        description: "Your details have been updated successfully.",
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

    const handleCancel = () => {
        setFormData(profileResponse?.data?.ownerInfo || {});
        setIsEditing(false);
    }

    if (isLoading && !formData) {
        return (
            <div className="flex flex-col gap-6 max-w-2xl mx-auto">
                <Skeleton className="h-4 w-24" />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-full mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i}>
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-5 w-full mt-1" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
            <Link href="/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
                <ArrowLeft className="h-4 w-4" />
                Back to Profile
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-semibold md:text-3xl">Owner Information</h1>
                {!isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Contact Details</CardTitle>
                    <CardDescription>This information is for internal use and will not be shared publicly.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isEditing ? (
                        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="owner-name">Full Name</Label>
                                <Input id="owner-name" value={formData?.name || ""} onChange={(e) => setFormData((p: any) => ({ ...p, name: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="owner-email">Email Address</Label>
                                <Input id="owner-email" type="email" value={formData?.email || ""} onChange={(e) => setFormData((p: any) => ({ ...p, email: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="owner-phone">Phone Number</Label>
                                <Input id="owner-phone" value={formData?.phone || ""} onChange={(e) => setFormData((p: any) => ({ ...p, phone: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="owner-whatsapp">WhatsApp Number</Label>
                                <Input id="owner-whatsapp" type="tel" value={formData?.whatsapp || ""} onChange={(e) => setFormData((p: any) => ({ ...p, whatsapp: e.target.value }))} />
                            </div>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                            <DetailItem icon={User} label="Owner Name" value={formData?.name} />
                            <DetailItem icon={Mail} label="Email Address" value={formData?.email} />
                            <DetailItem icon={Phone} label="Mobile Number" value={formData?.phone} />
                            <DetailItem icon={Phone} label="WhatsApp Number" value={formData?.whatsapp} />
                        </div>
                    )}
                </CardContent>
                {isEditing && (
                    <CardFooter className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={handleCancel} disabled={isPending}>Cancel</Button>
                        <Button onClick={handleUpdate} disabled={isPending}>
                            {isPending ? "Updating..." : "Update Information"}
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    )
}
