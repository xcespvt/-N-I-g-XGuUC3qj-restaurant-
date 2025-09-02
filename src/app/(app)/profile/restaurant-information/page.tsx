
"use client"

import { useState } from "react"
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
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"


const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
    <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon className="h-4 w-4" />
            <span>{label}</span>
        </div>
        <p className="font-medium mt-1">{value}</p>
    </div>
)

const initialRestaurantInfo = {
    name: "The Gourmet Kitchen",
    address: "123 Foodie Lane, Flavor Town",
    city: "Bangalore",
    pincode: "560034",
    phone: "9876543210",
    email: "contact@gourmetkitchen.com",
    ownershipType: "self-owned",
    type: "Fine Dining",
    fssai: "12345678901234",
    gst: "29ABCDE1234F1Z5",
    registrationType: "Private Limited",
    legalName: "Gourmet Kitchen Pvt. Ltd.",
    cin: "U12345KA2022PTC67890",
    cuisines: "Italian, Continental, North Indian",
}

export default function RestaurantInformationPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(initialRestaurantInfo);
    const { toast } = useToast();

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    }
    
    const handleSaveChanges = () => {
        setIsEditing(false);
        toast({
            title: "Information Saved",
            description: "Your restaurant information has been updated successfully.",
        });
    }

    const handleCancel = () => {
        setFormData(initialRestaurantInfo);
        setIsEditing(false);
    }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <Link href="/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
          <ArrowLeft className="h-4 w-4"/>
          Back to Profile
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-semibold md:text-3xl">Restaurant Information</h1>
            {!isEditing && (
                <Button onClick={() => setIsEditing(true)}>
                    <Pencil className="mr-2 h-4 w-4"/> Edit Information
                </Button>
            )}
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5"/> Basic Details</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                {isEditing ? (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="res-name">Restaurant Name</Label>
                            <Input id="res-name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="res-type">Restaurant Type</Label>
                            <Select value={formData.type} onValueChange={v => handleInputChange('type', v)}>
                                <SelectTrigger id="res-type"><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Fine Dining">Fine Dining</SelectItem>
                                    <SelectItem value="Cafe">Cafe</SelectItem>
                                    <SelectItem value="Cloud Kitchen">Cloud Kitchen</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ownership-type">Ownership Type</Label>
                            <Select value={formData.ownershipType} onValueChange={v => handleInputChange('ownershipType', v)}>
                                <SelectTrigger id="ownership-type"><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="self-owned">Self-Owned</SelectItem>
                                    <SelectItem value="franchise">Franchise</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="res-address">Address</Label>
                            <Input id="res-address" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} />
                            <div className="grid grid-cols-2 gap-4">
                                <Input value={formData.city} onChange={e => handleInputChange('city', e.target.value)} />
                                <Input value={formData.pincode} onChange={e => handleInputChange('pincode', e.target.value)} />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="res-phone">Contact Phone</Label>
                            <Input id="res-phone" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="res-email">Contact Email</Label>
                            <Input id="res-email" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="res-cuisines">Cuisines</Label>
                            <Textarea id="res-cuisines" value={formData.cuisines} onChange={e => handleInputChange('cuisines', e.target.value)} placeholder="e.g. Italian, Continental, North Indian" />
                        </div>
                    </>
                ) : (
                    <>
                        <DetailItem icon={Building2} label="Restaurant Name" value={formData.name} />
                        <DetailItem icon={Utensils} label="Restaurant Type" value={formData.type} />
                        <DetailItem icon={Info} label="Ownership Type" value={formData.ownershipType === 'self-owned' ? 'Self-Owned' : 'Franchise'} />
                        <DetailItem icon={MapPin} label="Address" value={`${formData.address}, ${formData.city}, ${formData.pincode}`} />
                        <DetailItem icon={Phone} label="Contact Phone" value={formData.phone} />
                        <DetailItem icon={Mail} label="Contact Email" value={formData.email} />
                        <DetailItem icon={Hash} label="Cuisines" value={formData.cuisines} />
                    </>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/> Legal Information</CardTitle>
            </CardHeader>
             <CardContent className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                {isEditing ? (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="reg-type">Registration Type</Label>
                            <Select value={formData.registrationType} onValueChange={v => handleInputChange('registrationType', v)}>
                                <SelectTrigger id="reg-type"><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Private Limited">Private Limited</SelectItem>
                                    <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="legal-name">Legal Name</Label>
                            <Input id="legal-name" value={formData.legalName} onChange={e => handleInputChange('legalName', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="cin">CIN Number</Label>
                            <Input id="cin" value={formData.cin} onChange={e => handleInputChange('cin', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="gst">GST Number</Label>
                            <Input id="gst" value={formData.gst} onChange={e => handleInputChange('gst', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="fssai">FSSAI Number</Label>
                            <Input id="fssai" value={formData.fssai} onChange={e => handleInputChange('fssai', e.target.value)} />
                        </div>
                    </>
                ) : (
                    <>
                        <DetailItem icon={Briefcase} label="Registration Type" value={formData.registrationType} />
                        <DetailItem icon={Building2} label="Legal Name" value={formData.legalName} />
                        <DetailItem icon={FileText} label="CIN Number" value={formData.cin} />
                        <DetailItem icon={FileText} label="GST Number" value={formData.gst} />
                        <DetailItem icon={FileText} label="FSSAI Number" value={formData.fssai} />
                    </>
                )}
            </CardContent>
        </Card>
        
        {isEditing && (
            <CardFooter className="flex justify-end gap-2 p-0">
                <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardFooter>
        )}
    </div>
  )
}
