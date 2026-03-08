
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
import { ArrowLeft, Building2, Clock, MapPin, Pencil, Phone, Utensils, Hash, Mail, Image as ImageIcon, FileText, Briefcase, Info } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/context/useAppStore"
import { usePut, useGet } from "@/hooks/useApi"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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

export default function RestaurantInformationPage() {
    const { selectedBranch } = useAppStore();
    const [isEditing, setIsEditing] = useState(false);
    const { toast } = useToast();

    // Fetch existing profile data
    const { data: profileResponse, isLoading } = useGet<any>(
        ['profile', selectedBranch],
        `/api/branches/${selectedBranch}/profile`,
        undefined,
        { enabled: !!selectedBranch }
    );

    const [formData, setFormData] = useState<any>(null);

    // Update form data when data is loaded
    useEffect(() => {
        if (profileResponse?.data?.restaurantInfo) {
            setFormData(profileResponse.data.restaurantInfo);
        }
    }, [profileResponse]);


    const { mutate: updateProfile, isPending } = usePut(`/api/branches/${selectedBranch}/profile`);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    }

    const handleSaveChanges = () => {
        updateProfile(
            { restaurantInfo: formData },
            {
                onSuccess: () => {
                    setIsEditing(false);
                    toast({
                        title: "Information Saved",
                        description: "Your restaurant information has been updated successfully.",
                    });
                },
                onError: (error: any) => {
                    toast({
                        title: "Error",
                        description: error.message || "Failed to update information",
                        variant: "destructive",
                    });
                }
            }
        );
    }

    const handleCancel = () => {
        setFormData(profileResponse?.data?.restaurantInfo || {});
        setIsEditing(false);
    }

    if (isLoading && !formData) {
        return (
            <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                <Skeleton className="h-4 w-24" />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-5 w-full" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            <Link href="/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
                <ArrowLeft className="h-4 w-4" />
                Back to Profile
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-semibold md:text-3xl">Restaurant Information</h1>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit Information
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> Basic Details</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                    {isEditing ? (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="res-name">Restaurant Name</Label>
                                <Input id="res-name" value={formData?.name || ""} onChange={e => handleInputChange('name', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="res-type">Restaurant Type</Label>
                                <Select value={formData?.type || ""} onValueChange={v => handleInputChange('type', v)}>
                                    <SelectTrigger id="res-type"><SelectValue placeholder="Select type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Fine Dining">Fine Dining</SelectItem>
                                        <SelectItem value="Cafe">Cafe</SelectItem>
                                        <SelectItem value="Cloud Kitchen">Cloud Kitchen</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ownership-type">Ownership Type</Label>
                                <Select value={formData?.ownershipType || ""} onValueChange={v => handleInputChange('ownershipType', v)}>
                                    <SelectTrigger id="ownership-type"><SelectValue placeholder="Select ownership" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="self-owned">Self-Owned</SelectItem>
                                        <SelectItem value="franchise">Franchise</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="res-address">Address</Label>
                                <Input id="res-address" value={formData?.address || ""} onChange={e => handleInputChange('address', e.target.value)} />
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <Input value={formData?.city || ""} onChange={e => handleInputChange('city', e.target.value)} placeholder="City" />
                                    <Input value={formData?.pincode || ""} onChange={e => handleInputChange('pincode', e.target.value)} placeholder="Pincode" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="res-phone">Contact Phone</Label>
                                <Input id="res-phone" value={formData?.phone || ""} onChange={e => handleInputChange('phone', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="res-email">Contact Email</Label>
                                <Input id="res-email" type="email" value={formData?.email || ""} onChange={e => handleInputChange('email', e.target.value)} />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="res-cuisines">Cuisines</Label>
                                <Textarea id="res-cuisines" value={formData?.cuisines || ""} onChange={e => handleInputChange('cuisines', e.target.value)} placeholder="e.g. Italian, Continental, North Indian" />
                            </div>
                        </>
                    ) : (
                        <>
                            <DetailItem icon={Building2} label="Restaurant Name" value={formData?.name} />
                            <DetailItem icon={Utensils} label="Restaurant Type" value={formData?.type} />
                            <DetailItem icon={Info} label="Ownership Type" value={formData?.ownershipType === 'self-owned' ? 'Self-Owned' : (formData?.ownershipType === 'franchise' ? 'Franchise' : formData?.ownershipType)} />
                            <DetailItem icon={MapPin} label="Address" value={formData?.address ? `${formData.address}, ${formData.city}, ${formData.pincode}` : undefined} />
                            <DetailItem icon={Phone} label="Contact Phone" value={formData?.phone} />
                            <DetailItem icon={Mail} label="Contact Email" value={formData?.email} />
                            <DetailItem icon={Hash} label="Cuisines" value={formData?.cuisines} />
                        </>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Legal Information</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                    {isEditing ? (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="reg-type">Registration Type</Label>
                                <Select value={formData?.registrationType || ""} onValueChange={v => handleInputChange('registrationType', v)}>
                                    <SelectTrigger id="reg-type"><SelectValue placeholder="Select registration type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Private Limited">Private Limited</SelectItem>
                                        <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="legal-name">Legal Name</Label>
                                <Input id="legal-name" value={formData?.legalName || ""} onChange={e => handleInputChange('legalName', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cin">CIN Number</Label>
                                <Input id="cin" value={formData?.cin || ""} onChange={e => handleInputChange('cin', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gst">GST Number</Label>
                                <Input id="gst" value={formData?.gst || ""} onChange={e => handleInputChange('gst', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fssai">FSSAI Number</Label>
                                <Input id="fssai" value={formData?.fssai || ""} onChange={e => handleInputChange('fssai', e.target.value)} />
                            </div>
                        </>
                    ) : (
                        <>
                            <DetailItem icon={Briefcase} label="Registration Type" value={formData?.registrationType} />
                            <DetailItem icon={Building2} label="Legal Name" value={formData?.legalName} />
                            <DetailItem icon={FileText} label="CIN Number" value={formData?.cin} />
                            <DetailItem icon={FileText} label="GST Number" value={formData?.gst} />
                            <DetailItem icon={FileText} label="FSSAI Number" value={formData?.fssai} />
                        </>
                    )}
                </CardContent>
            </Card>

            {isEditing && (
                <CardFooter className="flex justify-end gap-2 p-0">
                    <Button variant="ghost" onClick={handleCancel} disabled={isPending}>Cancel</Button>
                    <Button onClick={handleSaveChanges} disabled={isPending}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </CardFooter>
            )}
        </div>
    )
}
