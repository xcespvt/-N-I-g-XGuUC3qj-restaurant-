
"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Building, ChevronLeft, ChevronRight, FileText, PiggyBank, Briefcase, Camera, Clock, Upload, Check, User, Mail, Phone, Home, UtensilsCrossed, MapPin, IndianRupee } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

const stepDetails = [
    { title: "Owner Information", icon: User },
    { title: "Restaurant Details", icon: Building },
    { title: "Service & Facility Info", icon: UtensilsCrossed },
    { title: "Bank Information", icon: PiggyBank },
    { title: "Pricing & Benefits", icon: FileText },
    { title: "Final Submission", icon: Check },
];

export default function RegisterPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = stepDetails.length;

    // Form State
    const [formData, setFormData] = useState({
        // Step 1
        firstName: "",
        lastName: "",
        mobileNumber: "",
        mobileOtp: "",
        email: "",
        pan: "",
        aadhar: "",
        aadharOtp: "",
        // Step 2
        restaurantName: "",
        ownershipType: "",
        restaurantType: "",
        legalStatus: "",
        legalName: "",
        address1: "",
        restaurantPhone: "",
        restaurantEmail: "",
        fssai: "",
        gst: "",
        cin: "",
        // Step 3
        offerings: [] as string[],
        cuisines: "",
        openingHours: [
            { day: "Monday", opening: "11:00", closing: "23:00", open: true },
            { day: "Tuesday", opening: "11:00", closing: "23:00", open: true },
            { day: "Wednesday", opening: "11:00", closing: "23:00", open: true },
            { day: "Thursday", opening: "11:00", closing: "23:00", open: true },
            { day: "Friday", opening: "11:00", closing: "23:00", open: true },
            { day: "Saturday", opening: "11:00", closing: "23:00", open: true },
            { day: "Sunday", opening: "11:00", closing: "23:00", open: true },
        ],
        facilities: [] as string[],
        // Step 4
        bankName: "",
        accountHolder: "",
        accountNumber: "",
        reAccountNumber: "",
        ifsc: "",
    });

    const [showMobileOtp, setShowMobileOtp] = useState(false);
    const [showAadharOtp, setShowAadharOtp] = useState(false);

    const handleInputChange = (field: keyof typeof formData, value: string | string[] | typeof formData.openingHours) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleOpeningHoursChange = (index: number, field: 'opening' | 'closing' | 'open', value: string | boolean) => {
        const newOpeningHours = [...formData.openingHours];
        (newOpeningHours[index] as any)[field] = value;
        handleInputChange('openingHours', newOpeningHours);
    };

    const handleNumericInputChange = (field: keyof typeof formData, value: string, maxLength: number) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue.length <= maxLength) {
            handleInputChange(field, numericValue);
        }
    };

    const handleCheckboxChange = (field: 'offerings' | 'facilities', value: string, checked: boolean) => {
        setFormData(prev => {
            const currentValues = prev[field];
            const newValues = checked
                ? [...currentValues, value]
                : currentValues.filter(v => v !== value);
            return { ...prev, [field]: newValues as [] };
        });
    }

    const isStepValid = useMemo(() => {
        // Temporarily disabled for testing
        return true;

    }, [currentStep, formData, showMobileOtp, showAadharOtp]);


    const nextStep = () => {
        if (isStepValid && currentStep < totalSteps) {
            setCurrentStep(step => step + 1);
        } else if (!isStepValid) {
            toast({
                title: "Incomplete Information",
                description: "Please fill out all the mandatory fields before proceeding.",
                variant: "destructive"
            });
        }
    };
    
    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(step => step - 1);
        }
    };


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        toast({
            title: "Application Submitted!",
            description: "Your restaurant details are under review. We'll notify you soon.",
        })
        setTimeout(() => {
            router.push("/")
        }, 1500)
    }

    const handleSendMobileOtp = () => {
        if(formData.mobileNumber.length === 10) {
            setShowMobileOtp(true);
            toast({ title: "OTP Sent!", description: "An OTP has been sent to your mobile number." });
        } else {
            toast({ title: "Error", description: "Please enter a valid 10-digit mobile number.", variant: "destructive" });
        }
    }

    const handleSendAadharOtp = () => {
        if(formData.aadhar.length === 12) {
            setShowAadharOtp(true);
            toast({ title: "OTP Sent!", description: "An OTP has been sent for Aadhar verification." });
        } else {
             toast({ title: "Error", description: "Please enter a valid 12-digit Aadhar number.", variant: "destructive" });
        }
    }

    const legalNameConfig = useMemo(() => {
        switch (formData.legalStatus) {
            case 'pvt-ltd':
                return { label: 'Legal Name', placeholder: 'e.g., XCES Pvt Ltd' };
            case 'sole-prop':
                return { label: 'Name as on GST Certificate', placeholder: 'Enter name' };
            case 'not-registered':
                return { label: 'Owner Name', placeholder: 'Enter owner full name' };
            default:
                return null;
        }
    }, [formData.legalStatus]);


    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Owner Information
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first-name">First Name</Label>
                                <Input id="first-name" placeholder="John" value={formData.firstName} onChange={e => handleInputChange('firstName', e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last-name">Last Name</Label>
                                <Input id="last-name" placeholder="Doe" value={formData.lastName} onChange={e => handleInputChange('lastName', e.target.value)} required />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="contact-number">Mobile Number</Label>
                            <div className="flex gap-2">
                                <Input id="contact-number" type="tel" placeholder="9876543210" value={formData.mobileNumber} onChange={e => handleNumericInputChange('mobileNumber', e.target.value, 10)} required />
                                <Button type="button" variant="outline" onClick={handleSendMobileOtp}>Verify OTP</Button>
                            </div>
                        </div>
                        {showMobileOtp && (
                             <div className="space-y-2">
                                <Label htmlFor="mobile-otp">Enter Mobile OTP</Label>
                                <Input id="mobile-otp" type="text" inputMode="numeric" placeholder="______" maxLength={6} className="tracking-[0.5em] text-center font-semibold" value={formData.mobileOtp} onChange={e => handleNumericInputChange('mobileOtp', e.target.value, 6)} required />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="contact@yourbrand.com" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} required />
                        </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pan-card">PAN Card Number</Label>
                                <Input id="pan-card" placeholder="Enter PAN number" value={formData.pan} onChange={e => handleInputChange('pan', e.target.value)} required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="aadhar-card">Aadhar Card Number</Label>
                                 <div className="flex gap-2">
                                    <Input id="aadhar-card" type="text" placeholder="Enter Aadhar number" value={formData.aadhar} onChange={e => handleNumericInputChange('aadhar', e.target.value, 12)} required />
                                    <Button type="button" variant="outline" onClick={handleSendAadharOtp}>Verify</Button>
                                </div>
                            </div>
                        </div>
                        {showAadharOtp && (
                             <div className="space-y-2">
                                <Label htmlFor="aadhar-otp">Enter Aadhar OTP</Label>
                                <Input id="aadhar-otp" type="text" inputMode="numeric" placeholder="______" maxLength={6} className="tracking-[0.5em] text-center font-semibold" value={formData.aadharOtp} onChange={e => handleNumericInputChange('aadharOtp', e.target.value, 6)} required />
                            </div>
                        )}
                    </div>
                );
            case 2: // Restaurant Info
                return (
                     <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="restaurant-name">Restaurant Name</Label>
                                <Input id="restaurant-name" placeholder="As registered" value={formData.restaurantName} onChange={e => handleInputChange('restaurantName', e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="logo">Upload Logo</Label>
                                 <Button variant="outline" type="button" className="w-full justify-start text-muted-foreground font-normal"><Upload className="mr-2 h-4 w-4" /> Choose File</Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Ownership Type</Label>
                                <Select value={formData.ownershipType} onValueChange={v => handleInputChange('ownershipType', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="franchise">Franchise</SelectItem>
                                        <SelectItem value="self-owned">Self-Owned</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Restaurant Type</Label>
                                <Select value={formData.restaurantType} onValueChange={v => handleInputChange('restaurantType', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="restaurant">Restaurant</SelectItem>
                                        <SelectItem value="cafe">Cafe</SelectItem>
                                        <SelectItem value="sweet-shop">Sweet Shop</SelectItem>
                                        <SelectItem value="bakery">Bakery</SelectItem>
                                        <SelectItem value="cloud-kitchen">Cloud Kitchen</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Legal Status</Label>
                            <Select value={formData.legalStatus} onValueChange={v => handleInputChange('legalStatus', v)}>
                                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pvt-ltd">Pvt Ltd</SelectItem>
                                    <SelectItem value="sole-prop">Sole Proprietor</SelectItem>
                                    <SelectItem value="not-registered">Not Registered</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {legalNameConfig && (
                            <div className="space-y-2">
                                <Label htmlFor="legal-name">{legalNameConfig.label}</Label>
                                <Input
                                    id="legal-name"
                                    placeholder={legalNameConfig.placeholder}
                                    value={formData.legalName}
                                    onChange={e => handleInputChange('legalName', e.target.value)}
                                    required
                                />
                            </div>
                        )}
                         <div className="space-y-2">
                            <Label htmlFor="address-1">Address</Label>
                             <Input id="address-1" placeholder="Shop/Building No, Floor/Tower, Area/Locality" value={formData.address1} onChange={e => handleInputChange('address1', e.target.value)} required />
                             <Input id="address-2" placeholder="Address Line 2 (optional)" />
                             <Input id="landmark" placeholder="Landmark (optional)" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="contact-phone">Restaurant Phone</Label>
                                <Input id="contact-phone" type="tel" placeholder="Contact number" value={formData.restaurantPhone} onChange={e => handleNumericInputChange('restaurantPhone', e.target.value, 10)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact-email">Restaurant Email</Label>
                                <Input id="contact-email" type="email" placeholder="Contact email" value={formData.restaurantEmail} onChange={e => handleInputChange('restaurantEmail', e.target.value)} required />
                            </div>
                        </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="fssai">FSSAI License (Mandatory)</Label>
                                <Input id="fssai" placeholder="14-digit number" value={formData.fssai} onChange={e => handleInputChange('fssai', e.target.value)} required/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gst">GST Number (Optional)</Label>
                                <Input id="gst" placeholder="15-digit number" value={formData.gst} onChange={e => handleInputChange('gst', e.target.value)} />
                            </div>
                        </div>
                        {formData.legalStatus === 'pvt-ltd' && (
                            <div className="space-y-2">
                                <Label htmlFor="cin">CIN Number (Optional)</Label>
                                <Input id="cin" placeholder="21-digit number" value={formData.cin} onChange={e => handleInputChange('cin', e.target.value)} />
                            </div>
                        )}
                         <div className="space-y-2">
                            <Label>Upload Photos</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <Button variant="outline" type="button" className="w-full justify-start text-muted-foreground font-normal"><Camera className="mr-2 h-4 w-4" /> Inside</Button>
                                <Button variant="outline" type="button" className="w-full justify-start text-muted-foreground font-normal"><Camera className="mr-2 h-4 w-4" /> Outside</Button>
                                <Button variant="outline" type="button" className="w-full justify-start text-muted-foreground font-normal"><Camera className="mr-2 h-4 w-4" /> Kitchen</Button>
                            </div>
                        </div>
                    </div>
                );
            case 3: // Service & Facility Info
                return (
                    <div className="space-y-8">
                        <div>
                            <Label className="text-base font-semibold">What do you offer? (Select at least one)</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 mt-3">
                                {["Dine-in", "Takeaway", "Delivery"].map(offer => (
                                    <div key={offer} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`offer-${offer.toLowerCase()}`}
                                            checked={formData.offerings.includes(offer)}
                                            onCheckedChange={(checked) => handleCheckboxChange('offerings', offer, !!checked)}
                                        />
                                        <Label htmlFor={`offer-${offer.toLowerCase()}`} className="font-normal">{offer}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-base font-semibold" htmlFor="cuisines">Cuisines (Max 4)</Label>
                            <Input id="cuisines" placeholder="e.g. North Indian, Chinese, Italian" value={formData.cuisines} onChange={e => handleInputChange('cuisines', e.target.value)} required />
                        </div>
                        <div>
                            <Label className="text-base font-semibold">Opening/Closing Timings</Label>
                             <div className="grid grid-cols-1 gap-y-3 mt-4">
                                <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 items-center px-2 text-sm text-muted-foreground">
                                    <span></span>
                                    <Label>Opening Time</Label>
                                    <Label>Closing Time</Label>
                                </div>
                                {formData.openingHours.map((item, index) => (
                                    <div key={item.day} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 p-2 rounded-lg hover:bg-muted">
                                        <Label htmlFor={`open-${item.day}`} className="font-medium">{item.day}</Label>
                                        <Input
                                            id={`open-${item.day}`}
                                            type="time"
                                            className="w-32"
                                            value={item.opening}
                                            onChange={(e) => handleOpeningHoursChange(index, 'opening', e.target.value)}
                                        />
                                        <Input
                                            type="time"
                                            className="w-32"
                                            value={item.closing}
                                            onChange={(e) => handleOpeningHoursChange(index, 'closing', e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Label className="text-base font-semibold">Facilities (Select at least one)</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 mt-3">
                                {["Washroom", "AC", "Parking", "Women Safety", "LGBTQ+ Friendly", "Family Friendly", "Wheelchair Access", "Drive-through"].map(facility => (
                                     <div key={facility} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`facility-${facility.toLowerCase().replace(/\s/g, '-')}`}
                                            checked={formData.facilities.includes(facility)}
                                            onCheckedChange={(checked) => handleCheckboxChange('facilities', facility, !!checked)}
                                        />
                                        <Label htmlFor={`facility-${facility.toLowerCase().replace(/\s/g, '-')}`} className="font-normal">{facility}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 4: // Bank Details
                return (
                     <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="bank-name">Bank Name</Label>
                            <Input id="bank-name" placeholder="Enter bank name" value={formData.bankName} onChange={e => handleInputChange('bankName', e.target.value)} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="account-holder">Account Holder Name</Label>
                            <Input id="account-holder" placeholder="As per bank records" value={formData.accountHolder} onChange={e => handleInputChange('accountHolder', e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="account-number">Account Number</Label>
                            <Input id="account-number" placeholder="Enter account number" value={formData.accountNumber} onChange={e => handleInputChange('accountNumber', e.target.value)} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="re-account-number">Re-enter Account Number</Label>
                            <Input id="re-account-number" placeholder="Confirm account number" value={formData.reAccountNumber} onChange={e => handleInputChange('reAccountNumber', e.target.value)} required />
                            {formData.accountNumber && formData.reAccountNumber && formData.accountNumber !== formData.reAccountNumber && (
                                <p className="text-sm text-destructive">Account numbers do not match.</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ifsc">IFSC Code</Label>
                            <Input id="ifsc" placeholder="Enter IFSC code" value={formData.ifsc} onChange={e => handleInputChange('ifsc', e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="upi-id">UPI ID (Optional)</Label>
                            <Input id="upi-id" placeholder="yourname@bank" />
                        </div>
                    </div>
                );
             case 5: // Pricing & Benefits
                return (
                    <div className="space-y-6">
                        <div className="text-center p-6 rounded-lg bg-primary/10">
                            <p className="text-muted-foreground">Subscription</p>
                            <p className="text-4xl font-bold flex items-center justify-center"><IndianRupee className="h-8 w-8"/>349<span className="text-xl font-normal text-muted-foreground">/month</span></p>
                            <p className="font-semibold text-primary mt-2">2 Months Free! 🎁</p>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">Your Benefits</h3>
                            <ul className="space-y-2">
                                {[
                                    "2 months free subscription plan",
                                    "Access to local customer data & insights",
                                    "Promotional support from XCES team",
                                    "Free packaging material to get started",
                                    "Assistance with legal & branding needs"
                                ].map(benefit => (
                                    <li key={benefit} className="flex items-center gap-2 text-sm">
                                        <Check className="h-4 w-4 text-green-500" />
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-1 text-sm">
                            <p><strong>Commission:</strong> 12% on customer side</p>
                            <p><strong>Fees:</strong> No onboarding fee, no per-km or hidden charges.</p>
                        </div>
                    </div>
                );
            case 6: // Final Submission
                 return (
                     <div className="space-y-6 text-center flex flex-col items-center justify-center h-full">
                         <div className="p-6 bg-green-100 dark:bg-green-900/50 rounded-full">
                            <Check className="h-16 w-16 text-green-600 dark:text-green-400" />
                         </div>
                         <h2 className="text-2xl font-bold">You've completed onboarding!</h2>
                         <p className="text-muted-foreground max-w-md">
                            Your application is under review. You will be notified via email and SMS once we verify all your details. Sit tight — we'll get back to you soon!
                         </p>
                    </div>
                );
            default:
                return null;
        }
    }

    const { title, icon: Icon } = stepDetails[currentStep - 1];

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-muted/40 p-4 sm:p-6">
            <div className="w-full max-w-3xl">
                <div className="mb-6">
                    <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
                </div>
                <form onSubmit={handleSubmit}>
                    <Card className="flex flex-col">
                        <CardHeader className="relative">
                            {currentStep > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-4 left-4"
                                    onClick={prevStep}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                    <span className="sr-only">Previous Step</span>
                                </Button>
                            )}
                            <div className="flex items-center gap-3 text-center mx-auto">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardDescription>Step {currentStep} of {totalSteps}</CardDescription>
                                    <CardTitle className="text-2xl">{title}</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="py-6 flex-grow min-h-[450px]">
                            {renderStepContent()}
                        </CardContent>
                        <CardFooter className="border-t p-6 flex justify-center">
                            {currentStep < totalSteps -1 ? (
                                <Button type="button" onClick={nextStep} disabled={!isStepValid}>
                                    Next <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : currentStep === totalSteps - 1 ? (
                                <Button type="button" onClick={nextStep} disabled={!isStepValid}>
                                    Agree & Continue <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button type="submit">
                                    Go to Homepage
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </div>
    )
}
