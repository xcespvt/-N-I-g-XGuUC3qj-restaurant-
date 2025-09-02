
"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAppContext } from "@/context/AppContext"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, IndianRupee, Minus, PlusCircle, ShoppingCart, User, Ticket, CreditCard, Banknote, Landmark } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


export default function TakeawayCheckoutPage() {
    const { takeawayCart, clearTakeawayCart, addOrder } = useAppContext()
    const { toast } = useToast()
    const router = useRouter()

    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");

    const cartSubtotal = useMemo(() => {
        return takeawayCart.reduce((total, item) => total + item.price * item.quantity, 0)
    }, [takeawayCart]);

    const taxes = useMemo(() => cartSubtotal * 0.18, [cartSubtotal]);
    const total = useMemo(() => cartSubtotal + taxes, [cartSubtotal, taxes]);

    const handlePlaceOrder = () => {
        if (takeawayCart.length === 0) {
            toast({
                title: "Empty Order",
                description: "Please add items to the order before placing.",
                variant: "destructive"
            });
            return;
        }

        addOrder(takeawayCart, customerName, customerPhone);

        toast({
            title: "Order Placed!",
            description: "The offline takeaway order has been successfully created.",
        });

        clearTakeawayCart();
        router.push("/dashboard");
    }

    if (takeawayCart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                 <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4"/>
                 <h2 className="text-2xl font-semibold">Your order is empty</h2>
                 <p className="text-muted-foreground mt-2">Looks like you haven't added any items yet.</p>
                 <Button asChild className="mt-6">
                     <Link href="/takeaway">
                        <ArrowLeft className="mr-2 h-4 w-4"/>
                        Back to Menu
                     </Link>
                 </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
             <Link href="/takeaway" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
                <ArrowLeft className="h-4 w-4"/>
                Back to Menu
            </Link>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-8 items-start">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {takeawayCart.map(item => (
                                <div key={item.cartItemId} className="flex items-center justify-between gap-4">
                                     <div className="flex items-center gap-4">
                                        <Image src={item.image} alt={item.name} width={56} height={56} className="rounded-md object-cover" />
                                        <div>
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-muted-foreground flex items-center"><IndianRupee className="h-3.5 w-3.5"/>{item.price.toFixed(2)} x {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-lg flex items-center"><IndianRupee className="h-5 w-5"/>{(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="customer-name">Name (Optional)</Label>
                                <Input id="customer-name" placeholder="Walk-in Customer" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="customer-phone">Phone (Optional)</Label>
                                <Input id="customer-phone" type="tel" placeholder="Customer phone number" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:sticky lg:top-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment</CardTitle>
                            <CardDescription>All transactions are secure and encrypted.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Label>Subtotal</Label>
                                <p className="text-2xl font-bold flex items-center"><IndianRupee className="h-6 w-6"/>{cartSubtotal.toFixed(2)}</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Taxes (18% GST)</Label>
                                <p className="text-lg font-medium flex items-center"><IndianRupee className="h-4 w-4"/>{taxes.toFixed(2)}</p>
                            </div>
                             <div className="flex items-center gap-2">
                                <Input placeholder="Enter coupon code" />
                                <Button variant="outline">Apply</Button>
                            </div>
                            <Separator/>
                             <div className="flex justify-between items-center font-bold text-2xl">
                                <p>Total</p>
                                <p className="flex items-center"><IndianRupee className="h-6 w-6"/>{total.toFixed(2)}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
                        <CardContent>
                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                                <Label htmlFor="pay-cash" className="flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-accent has-[:checked]:border-primary">
                                    <span className="font-medium">Cash</span>
                                    <RadioGroupItem value="cash" id="pay-cash"/>
                                </Label>
                                <Label htmlFor="pay-card" className="flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-accent has-[:checked]:border-primary">
                                    <span className="font-medium">Card</span>
                                     <RadioGroupItem value="card" id="pay-card"/>
                                </Label>
                                <Label htmlFor="pay-upi" className="flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-accent has-[:checked]:border-primary">
                                    <span className="font-medium">UPI</span>
                                    <RadioGroupItem value="upi" id="pay-upi"/>
                                </Label>
                            </RadioGroup>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full text-lg h-12" onClick={handlePlaceOrder}>
                                Place Order
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
