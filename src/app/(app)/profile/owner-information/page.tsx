
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Edit, User, Mail, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useAppContext } from "@/context/AppContext"

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
    <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon className="h-4 w-4" />
            <span>{label}</span>
        </div>
        <p className="font-medium mt-1">{value}</p>
    </div>
)

export default function OwnerInformationPage() {
    const { ownerInfo, updateOwnerInfo } = useAppContext();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(ownerInfo);

    const handleUpdate = () => {
        updateOwnerInfo(formData);
        setIsEditing(false);
        toast({
            title: "Owner Information Updated",
            description: "Your details have been updated successfully.",
        });
    }

    const handleCancel = () => {
        setFormData(ownerInfo);
        setIsEditing(false);
    }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <Link href="/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
          <ArrowLeft className="h-4 w-4"/>
          Back to Profile
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-semibold md:text-3xl">Owner Information</h1>
            {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4"/> Edit
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
                            <Label htmlFor="ownerName">Owner Name</Label>
                            <Input id="ownerName" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ownerEmail">Email Address</Label>
                            <Input id="ownerEmail" type="email" value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ownerPhone">Mobile Number</Label>
                            <Input id="ownerPhone" type="tel" value={formData.phone} onChange={e => setFormData(p => ({...p, phone: e.target.value}))}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ownerWhatsapp">WhatsApp Number</Label>
                            <Input id="ownerWhatsapp" type="tel" value={formData.whatsapp} onChange={e => setFormData(p => ({...p, whatsapp: e.target.value}))}/>
                        </div>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                        <DetailItem icon={User} label="Owner Name" value={formData.name} />
                        <DetailItem icon={Mail} label="Email Address" value={formData.email} />
                        <DetailItem icon={Phone} label="Mobile Number" value={formData.phone} />
                        <DetailItem icon={Phone} label="WhatsApp Number" value={formData.whatsapp} />
                    </div>
                )}
            </CardContent>
             {isEditing && (
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleUpdate}>Update Information</Button>
                </CardFooter>
            )}
        </Card>
    </div>
  )
}
