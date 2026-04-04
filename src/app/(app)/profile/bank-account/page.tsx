
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
import { CheckCircle, AlertTriangle, ArrowLeft, Edit, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useAppStore } from "@/context/useAppStore"
import { usePut, useGet } from "@/hooks/useApi"
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function BankAccountPage() {
    const { selectedBranch } = useAppStore();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [showAccountNo, setShowAccountNo] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

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
        if (profileResponse?.data?.bankAccount) {
            setFormData(profileResponse.data.bankAccount);
        }
    }, [profileResponse]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData?.accountHolder?.trim()) newErrors.accountHolder = "Account holder name is required";
        if (!formData?.accountNumber?.trim()) {
            newErrors.accountNumber = "Account number is required";
        } else if (!/^\d{9,18}$/.test(formData.accountNumber)) {
            newErrors.accountNumber = "Invalid account number (9-18 digits)";
        }
        if (!formData?.ifsc?.trim()) {
            newErrors.ifsc = "IFSC code is required";
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc.toUpperCase())) {
            newErrors.ifsc = "Invalid IFSC format (e.g. HDFC0001234)";
        }
        if (!formData?.bankName?.trim()) newErrors.bankName = "Bank name is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const fetchBankDetails = async (ifsc: string) => {
        if (ifsc.length === 11) {
            try {
                const res = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData((p: any) => ({ ...p, bankName: data.BANK }));
                    setErrors(prev => ({ ...prev, ifsc: "", bankName: "" }));
                }
            } catch (err) {
                console.error("Failed to fetch bank details", err);
            }
        }
    };

    const handleInputChange = (field: string, value: string) => {
        if (errors[field]) {
            setErrors(prev => {
                const newErrs = { ...prev };
                delete newErrs[field];
                return newErrs;
            });
        }
        setFormData((prev: any) => ({ ...prev, [field]: value }));
        
        if (field === 'ifsc') {
            fetchBankDetails(value.toUpperCase());
        }
    };

    const { mutate: updateProfile, isPending } = usePut(`/api/branches/${selectedBranch}/profile`);

    const handleUpdate = () => {
        if (!validate()) return;

        updateProfile(
            { bankAccount: formData },
            {
                onSuccess: () => {
                    setIsEditing(false);
                    toast({
                        title: "Bank Account Updated",
                        description: "Your payout details have been updated successfully. Please allow 24 hours for verification.",
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

    if (isLoading && !formData) {
        return (
            <div className="flex flex-col gap-6 max-w-2xl mx-auto">
                <Skeleton className="h-4 w-24" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-full mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
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
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isEditing ? (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="acc-holder">Account Holder Name</Label>
                                <Input id="acc-holder" value={formData?.accountHolder || ""} onChange={e => handleInputChange('accountHolder', e.target.value)} />
                                {errors.accountHolder && <p className="text-xs text-destructive">{errors.accountHolder}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="acc-number">Account Number</Label>
                                <div className="relative">
                                    <Input
                                        id="acc-number"
                                        inputMode="numeric"
                                        type={showAccountNo ? "text" : "password"}
                                        value={formData?.accountNumber || ""}
                                        onChange={e => handleInputChange('accountNumber', e.target.value.replace(/\D/g, ''))}
                                        className="pr-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 text-muted-foreground"
                                        onClick={() => setShowAccountNo(!showAccountNo)}
                                    >
                                        {showAccountNo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                                {errors.accountNumber && <p className="text-xs text-destructive">{errors.accountNumber}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ifsc">IFSC Code</Label>
                                <Input id="ifsc" value={formData?.ifsc || ""} onChange={e => handleInputChange('ifsc', e.target.value.toUpperCase())} className="uppercase" placeholder="HDFC0001234" />
                                {errors.ifsc && <p className="text-xs text-destructive">{errors.ifsc}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bank-name">Bank Name</Label>
                                <Input id="bank-name" value={formData?.bankName || ""} onChange={e => handleInputChange('bankName', e.target.value)} />
                                {errors.bankName && <p className="text-xs text-destructive">{errors.bankName}</p>}
                            </div>
                        </>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-muted-foreground">Account Holder Name</span>
                                <span className="font-semibold">{formData?.accountHolder || "Not provided"}</span>
                            </div>
                            <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-muted-foreground">Account Number</span>
                                <span className="font-semibold">{formData?.accountNumber || "Not provided"}</span>
                            </div>
                            <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-muted-foreground">IFSC Code</span>
                                <span className="font-semibold">{formData?.ifsc || "Not provided"}</span>
                            </div>
                            <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-muted-foreground">Bank Name</span>
                                <span className="font-semibold">{formData?.bankName || "Not provided"}</span>
                            </div>
                        </div>
                    )}
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                        <div>
                            <p className="font-semibold text-green-800 dark:text-green-300">Verified Account</p>
                            <p className="text-xs text-green-700 dark:text-green-400/80">Payouts are active for this account.</p>
                        </div>
                    </div>
                </CardContent>
                {isEditing && (
                    <CardFooter className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => { setIsEditing(false); setErrors({}); }} disabled={isPending}>Cancel</Button>
                        <Button onClick={handleUpdate} disabled={isPending}>
                            {isPending ? "Updating..." : "Update Account"}
                        </Button>
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
