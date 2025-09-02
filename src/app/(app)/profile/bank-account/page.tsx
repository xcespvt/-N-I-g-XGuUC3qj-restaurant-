
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
import { CheckCircle, AlertTriangle, ArrowLeft, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function BankAccountPage() {
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        accountHolder: "The Gourmet Kitchen",
        accountNumber: "**********1234",
        ifsc: "HDFC0001234",
        bankName: "HDFC Bank",
    });

    const handleUpdate = () => {
        setIsEditing(false);
        toast({
            title: "Bank Account Updated",
            description: "Your payout details have been updated successfully. Please allow 24 hours for verification.",
        });
    }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <Link href="/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
          <ArrowLeft className="h-4 w-4"/>
          Back to Profile
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-semibold md:text-3xl">Bank Account Details</h1>
        </div>
        
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Payout Information</CardTitle>
                        <CardDescription>This account will be used for all your earnings payouts.</CardDescription>
                    </div>
                    {!isEditing && (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                            <Edit className="mr-2 h-4 w-4"/> Edit
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {isEditing ? (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="accountHolder">Account Holder Name</Label>
                            <Input id="accountHolder" value={formData.accountHolder} onChange={e => setFormData(p => ({...p, accountHolder: e.target.value}))}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="accountNumber">Account Number</Label>
                            <Input id="accountNumber" placeholder="Enter new account number" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ifsc">IFSC Code</Label>
                            <Input id="ifsc" value={formData.ifsc} onChange={e => setFormData(p => ({...p, ifsc: e.target.value}))}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bankName">Bank Name</Label>
                            <Input id="bankName" value={formData.bankName} onChange={e => setFormData(p => ({...p, bankName: e.target.value}))}/>
                        </div>
                    </>
                ) : (
                    <div className="space-y-3">
                         <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                            <span className="text-muted-foreground">Account Holder Name</span>
                            <span className="font-semibold">{formData.accountHolder}</span>
                         </div>
                         <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                            <span className="text-muted-foreground">Account Number</span>
                            <span className="font-semibold">{formData.accountNumber}</span>
                         </div>
                         <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                            <span className="text-muted-foreground">IFSC Code</span>
                            <span className="font-semibold">{formData.ifsc}</span>
                         </div>
                         <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                            <span className="text-muted-foreground">Bank Name</span>
                            <span className="font-semibold">{formData.bankName}</span>
                         </div>
                    </div>
                )}
                 <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5"/>
                    <div>
                        <p className="font-semibold text-green-800 dark:text-green-300">Verified Account</p>
                        <p className="text-xs text-green-700 dark:text-green-400/80">Payouts are active for this account.</p>
                    </div>
                </div>
            </CardContent>
             {isEditing && (
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={handleUpdate}>Update Account</Button>
                </CardFooter>
            )}
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Important Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0 text-yellow-500" />
                    <p>Any changes to your bank account details will require re-verification and may pause your payouts for up to 48 hours.</p>
                </div>
                <div className="flex items-start gap-3">
                     <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0 text-yellow-500" />
                    <p>Ensure the account holder's name matches the name on your PAN card and restaurant registration documents to avoid payout failures.</p>
                </div>
                <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0 text-yellow-500" />
                    <p>Payouts are processed weekly every Tuesday. Any changes made after Monday 6 PM will apply from the next payout cycle.</p>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
