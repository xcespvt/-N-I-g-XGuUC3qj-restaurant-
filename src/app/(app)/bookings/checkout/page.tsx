
"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAppContext } from "@/context/AppContext"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, IndianRupee, Users, Calendar, Clock, CreditCard, Lock, Banknote, Landmark } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


export default function BookingCheckoutPage() {
    const { pendingBooking, addBooking, resetPendingBooking } = useAppContext()
    const { toast } = useToast()
    const router = useRouter()
    
    const [paymentMethod, setPaymentMethod] = useState("card");

    const bookingFee = 100; // Example booking fee
    const taxes = bookingFee * 0.18;
    const total = bookingFee + taxes;

    const handleConfirmBooking = () => {
        if (!pendingBooking) {
            toast({ title: "Booking details not found.", variant: "destructive" });
            router.push('/bookings');
            return;
        }

        addBooking(pendingBooking, bookingFee);
        
        toast({
          title: "Booking Confirmed!",
          description: `Reservation for ${pendingBooking.name} has been confirmed.`,
        });

        resetPendingBooking();
        router.push('/dashboard');
    }

    if (!pendingBooking) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                 <h2 className="text-2xl font-semibold">No pending booking found</h2>
                 <p className="text-muted-foreground mt-2">Please start a new booking.</p>
                 <Button asChild className="mt-6">
                     <Link href="/bookings">
                        <ArrowLeft className="mr-2 h-4 w-4"/>
                        Back to Table Management
                     </Link>
                 </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
             <Link href="/bookings" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
                <ArrowLeft className="h-4 w-4"/>
                Back to Table Management
            </Link>
            <h1 className="text-3xl font-bold">Booking Checkout</h1>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-8 items-start">
                <div className="space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Booking Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Customer</p>
                                    <p className="font-semibold">{pendingBooking.name}</p>
                                </div>
                                 <div>
                                    <p className="text-muted-foreground">Phone</p>
                                    <p className="font-semibold">{pendingBooking.phone}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground"/>
                                    <span className="font-semibold">{new Date(pendingBooking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                 <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground"/>
                                    <span className="font-semibold">{pendingBooking.time}</span>
                                </div>
                                 <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground"/>
                                    <span className="font-semibold">{pendingBooking.partySize} Guests</span>
                                </div>
                            </div>
                            <Separator/>
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Selected Tables</p>
                                <div className="flex flex-wrap gap-2">
                                    {pendingBooking.tables.map(t => (
                                        <Badge key={t.id} variant="secondary" className="text-base px-3 py-1">{t.name}</Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                            <CardDescription>Select a secure payment method for the booking fee.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                                <Label htmlFor="pay-card" className="flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-accent has-[:checked]:border-primary">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5"/>
                                        <span className="font-medium">Card</span>
                                    </div>
                                    <RadioGroupItem value="card" id="pay-card"/>
                                </Label>
                                <Label htmlFor="pay-upi" className="flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-accent has-[:checked]:border-primary">
                                     <div className="flex items-center gap-2">
                                        <Banknote className="h-5 w-5"/>
                                        <span className="font-medium">UPI</span>
                                    </div>
                                    <RadioGroupItem value="upi" id="pay-upi"/>
                                </Label>
                                 <Label htmlFor="pay-netbanking" className="flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-accent has-[:checked]:border-primary">
                                    <div className="flex items-center gap-2">
                                        <Landmark className="h-5 w-5"/>
                                        <span className="font-medium">Net Banking</span>
                                    </div>
                                    <RadioGroupItem value="netbanking" id="pay-netbanking"/>
                                </Label>
                            </RadioGroup>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:sticky lg:top-6">
                    <Card>
                         <CardHeader>
                            <CardTitle>Fee Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Booking Fee</p>
                                    <p className="font-medium flex items-center"><IndianRupee className="h-3.5 w-3.5 mr-0.5"/>{bookingFee.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Taxes & Charges (18%)</p>
                                    <p className="font-medium flex items-center"><IndianRupee className="h-3.5 w-3.5 mr-0.5"/>{taxes.toFixed(2)}</p>
                                </div>
                            </div>
                            <Separator/>
                            <div className="flex justify-between items-center font-bold text-lg">
                                <p>Total Amount</p>
                                <p className="flex items-center"><IndianRupee className="h-5 w-5 mr-1"/>{total.toFixed(2)}</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                             <Button className="w-full text-lg h-12" onClick={handleConfirmBooking}>
                                <Lock className="mr-2 h-4 w-4"/> Confirm & Pay
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
