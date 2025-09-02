
"use client"

import { Suspense, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { IndianRupee, CreditCard, Lock, ArrowLeft, Landmark, User, Mail, Phone, Home, Pencil, Banknote } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { useAppContext } from "@/context/AppContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const restaurantProfile = {
  name: "Spice Garden Restaurant",
  contactPerson: "Rahul Sharma",
  address: "123 Food Street, Koramangala",
  cityStateZip: "Bangalore, Karnataka - 560034",
  email: "contact@spicegarden.com",
  phone: "+91 80 1234 5678",
};

const popularBanks = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Punjab National Bank"];

// Simple SVG icons for UPI apps
const GPayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.7,12.5c0-3.6,2.9-6.5,6.5-6.5h0c3,0,5.6,2,6.3,4.7l-6.3,0V12.5z M10.2,14.2V22c5.3-1,9.3-5.5,9.3-11.2h-9.3V14.2z M8.5,14.2v7.2c-4.9-1-8.5-5.5-8.5-10.8C0,5.5,3.6,1,8.5,1s8.5,4.5,8.5,10.2h-8.5V14.2z"/></svg>;
const PhonePeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.7,21.8c-2.4,1.4-5.3,1.8-8,1.1c-2.8-0.7-5.1-2.6-6.5-5.2C-0.3,15,0,11.5,1.9,8.7c2.4-3.5,6.5-5.4,10.6-4.6 c4.4,0.8,7.9,4.2,8.7,8.6c0.4,2.3,0.1,4.7-0.9,6.8L15.7,21.8z M13.8,11.3c0.6-0.6,1.4-0.9,2.3-0.9c0.9,0,1.7,0.3,2.3,0.9 c0.6,0.6,0.9,1.4,0.9,2.3s-0.3,1.7-0.9,2.3c-0.6,0.6-1.4,0.9-2.3,0.9c-0.9,0-1.7-0.3-2.3-0.9c-0.6-0.6-0.9-1.4-0.9-2.3 S13.1,11.9,13.8,11.3z"/></svg>;
const PaytmIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.4,22.2l-6.9-6.9C-0.4,12.4-0.4,7.6,2.5,4.7l6.9-6.9l6.9,6.9c2.9,2.9,2.9,7.7,0,10.6L9.4,22.2z M9.4,16.3l-4-4 c-0.8-0.8-0.8-2,0-2.8l4-4l4,4c0.8,0.8,0.8,2,0,2.8L9.4,16.3z"/></svg>;


function CheckoutContent() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSubscriptionPlan } = useAppContext();

  const [paymentMethod, setPaymentMethod] = useState("card");

  const billingCycle = searchParams.get('billing') || 'monthly';
  const isAnnual = billingCycle === 'annual';

  const proMonthlyPrice = 349;
  const proAnnualPriceMonthly = Math.round(proMonthlyPrice * 0.8);
  
  const pricePerMonth = isAnnual ? proAnnualPriceMonthly : proMonthlyPrice;
  const months = isAnnual ? 12 : 1;
  const subtotal = pricePerMonth * months;
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleConfirmPayment = () => {
    setSubscriptionPlan('Pro');
    toast({
      title: "Payment Successful!",
      description: "You have successfully upgraded to the Crevings Pro Partner plan.",
    });
    setTimeout(() => {
      router.push('/subscription');
    }, 1500);
  }

  const getButtonText = () => {
    switch (paymentMethod) {
        case 'upi': return 'Pay with UPI';
        case 'netbanking': return 'Pay with Net Banking';
        default: return 'Pay with Card';
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4 sm:p-6">
        <Link href="/subscription" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
            <ArrowLeft className="h-4 w-4"/>
            Back to Subscription Plans
        </Link>
        <h1 className="text-3xl font-bold">Complete Your Upgrade</h1>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Billing Information</CardTitle>
                            <CardDescription>This information will appear on your invoice.</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm"><Pencil className="mr-2 h-4 w-4"/>Edit</Button>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                       <p className="font-semibold text-base">{restaurantProfile.name}</p>
                        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 text-muted-foreground">
                            <div className="flex items-start gap-3">
                                <Home className="h-4 w-4 mt-1 flex-shrink-0" />
                                <span>{restaurantProfile.address}, {restaurantProfile.cityStateZip}</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <User className="h-4 w-4 mt-1 flex-shrink-0" />
                                <span>{restaurantProfile.contactPerson}</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail className="h-4 w-4 mt-1 flex-shrink-0" />
                                <span>{restaurantProfile.email}</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="h-4 w-4 mt-1 flex-shrink-0" />
                                <span>{restaurantProfile.phone}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                        <CardDescription>Select a secure payment method</CardDescription>
                    </CardHeader>
                    <CardContent className="min-h-[300px]">
                        <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="card"><CreditCard className="mr-2 h-4 w-4"/>Card</TabsTrigger>
                                <TabsTrigger value="upi"><Banknote className="mr-2 h-4 w-4"/>UPI</TabsTrigger>
                                <TabsTrigger value="netbanking"><Landmark className="mr-2 h-4 w-4"/>Net Banking</TabsTrigger>
                            </TabsList>
                            <TabsContent value="card" className="mt-6 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="card-name">Name on Card</Label>
                                    <Input id="card-name" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="card-number">Card Number</Label>
                                    <div className="relative">
                                        <Input id="card-number" placeholder="1234 5678 9012 3456" className="pr-10" />
                                        <CreditCard className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expiry-date">Expiry Date</Label>
                                        <Input id="expiry-date" placeholder="MM / YY" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cvc">CVC</Label>
                                        <Input id="cvc" placeholder="123" />
                                    </div>
                                </div>
                            </TabsContent>
                             <TabsContent value="upi" className="mt-6 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="upi-id">Enter UPI ID</Label>
                                    <Input id="upi-id" placeholder="yourname@bank" />
                                </div>
                                <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">
                                            Or pay with
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-center gap-4">
                                    <Button variant="outline" className="flex-col h-auto p-3 gap-2"><GPayIcon /> <span className="text-xs">GPay</span></Button>
                                    <Button variant="outline" className="flex-col h-auto p-3 gap-2"><PhonePeIcon /> <span className="text-xs">PhonePe</span></Button>
                                    <Button variant="outline" className="flex-col h-auto p-3 gap-2"><PaytmIcon /> <span className="text-xs">Paytm</span></Button>
                                </div>
                            </TabsContent>
                             <TabsContent value="netbanking" className="mt-6 space-y-4">
                                 <div className="space-y-2">
                                    <Label htmlFor="bank">Select your bank</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a bank" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {popularBanks.map(bank => (
                                                <SelectItem key={bank} value={bank.toLowerCase().replace(/\s/g, '-')}>{bank}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6 lg:sticky lg:top-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold">Crevings Pro Partner</p>
                            <p className="text-sm text-muted-foreground capitalize">{billingCycle} Plan</p>
                        </div>
                        <Separator/>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <p className="text-muted-foreground">Subtotal ({isAnnual ? `₹${pricePerMonth.toFixed(2)} x 12 months` : `₹${pricePerMonth.toFixed(2)} x 1 month`})</p>
                                <p className="font-medium flex items-center"><IndianRupee className="h-3.5 w-3.5 mr-0.5"/>{subtotal.toFixed(2)}</p>
                            </div>
                             <div className="flex justify-between">
                                <p className="text-muted-foreground">GST (18%)</p>
                                <p className="font-medium flex items-center"><IndianRupee className="h-3.5 w-3.5 mr-0.5"/>{tax.toFixed(2)}</p>
                            </div>
                        </div>
                        <Separator/>
                         <div className="flex justify-between items-center font-bold text-lg">
                            <p>Total</p>
                            <p className="flex items-center"><IndianRupee className="h-5 w-5 mr-1"/>{total.toFixed(2)}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                         <Button className="w-full text-lg h-12" onClick={handleConfirmPayment}>
                            <Lock className="mr-2 h-4 w-4"/> {getButtonText()}
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">By clicking, you agree to our <Link href="#" className="underline">Terms of Service</Link>.</p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
