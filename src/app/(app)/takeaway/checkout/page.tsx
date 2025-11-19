
"use client"

import { useMemo, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAppStore } from "@/context/useAppStore"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, IndianRupee, Minus, PlusCircle, ShoppingCart, User, Ticket, CreditCard, Banknote, Landmark, Users, Table } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

const initialOffersData = [
    {
        id: "offer-1",
        title: "Summer Special",
        description: "Get 20% off on all pizza orders above ₹500",
        couponCode: "SUMMER20",
    },
    {
        id: "offer-2",
        title: "Flat ₹50 OFF",
        description: "Flat ₹50 discount on orders above ₹300",
        couponCode: "FLAT50",
    },
    {
        id: "offer-3",
        title: "BOGO Burgers",
        description: "Buy any burger and get another burger absolutely free",
        couponCode: "BOGOSTAR",
    },
    {
        id: "offer-5",
        title: "First Order Special",
        description: "New customers get 30% off on their first order",
        couponCode: "NEW30",
    },
];


function TakeawayCheckoutContent() {
    const { takeawayCart, clearTakeawayCart, addOrder } = useAppStore()
    const { toast } = useToast()
    const router = useRouter()
    const searchParams = useSearchParams();

    const orderType = searchParams.get('type') || 'takeaway';
    const selectedTables = searchParams.get('table');
    const guestCount = searchParams.get('guests');
    const prepTime = searchParams.get('prepTime');

    const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'On Hold'>(orderType === 'dine-in' ? 'On Hold' : 'Paid');
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [customerName, setCustomerName] = useState(orderType === 'dine-in' ? (selectedTables ? `Table ${selectedTables}`: 'Dine-in Customer') : "");
    const [customerPhone, setCustomerPhone] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [isCouponsDialogOpen, setIsCouponsDialogOpen] = useState(false);


    const cartSubtotal = useMemo(() => {
        return takeawayCart.reduce((total, item) => total + item.price * item.quantity, 0)
    }, [takeawayCart]);

    const discount = useMemo(() => {
        if (couponCode === "FLAT50" && cartSubtotal >= 300) {
            return 50;
        }
        if (couponCode === "SUMMER20" && cartSubtotal >= 500) {
            return cartSubtotal * 0.20;
        }
         if (couponCode === "NEW30" && cartSubtotal >= 200) {
            return cartSubtotal * 0.30;
        }
        return 0;
    }, [cartSubtotal, couponCode]);


    const taxes = useMemo(() => (cartSubtotal - discount) * 0.18, [cartSubtotal, discount]);
    const total = useMemo(() => cartSubtotal - discount + taxes, [cartSubtotal, discount, taxes]);

    const handlePlaceOrder = () => {
        if (takeawayCart.length === 0) {
            toast({
                title: "Empty Order",
                description: "Please add items to the order before placing.",
                variant: "destructive"
            });
            return;
        }

        const finalCustomerName = customerName || (orderType === 'dine-in' ? `Table ${selectedTables}` : 'Walk-in Customer');
        addOrder(takeawayCart, finalCustomerName, customerPhone, orderType as 'takeaway' | 'dine-in', selectedTables || undefined, prepTime || '15 min', paymentStatus, paymentMethod);

        toast({
            title: "Order Placed!",
            description: `The offline ${orderType} order has been successfully created.`,
        });

        clearTakeawayCart();
        router.push("/dashboard");
    }

    const applyCoupon = (code: string) => {
        setCouponCode(code);
        setIsCouponsDialogOpen(false);
        toast({
            title: "Coupon Applied",
            description: `Coupon "${code}" has been applied.`,
        });
    }

    if (takeawayCart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                 <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4"/>
                 <h2 className="text-2xl font-semibold">Your order is empty</h2>
                 <p className="text-muted-foreground mt-2">Looks like you haven't added any items yet.</p>
                 <Button asChild className="mt-6">
                     <Link href={`/takeaway?type=${orderType}`}>
                        <ArrowLeft className="mr-2 h-4 w-4"/>
                        Back to Menu
                     </Link>
                 </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
             <Link href={`/takeaway?type=${orderType}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
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
                                        <Image src={item.image} alt={item.name} width={56} height={56} className="rounded-md object-cover" data-ai-hint={item.aiHint}/>
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
                           {orderType === 'dine-in' && (
                                <>
                                    <div className="space-y-2">
                                        <Label>Table(s)</Label>
                                        <p className="font-semibold text-lg flex items-center gap-2">
                                            <Table className="h-5 w-5 text-muted-foreground" />
                                            {selectedTables}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Guests</Label>
                                        <p className="font-semibold text-lg flex items-center gap-2">
                                            <Users className="h-5 w-5 text-muted-foreground" />
                                            {guestCount}
                                        </p>
                                    </div>
                                </>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="customer-name">Name (Optional)</Label>
                                <Input id="customer-name" placeholder={orderType === 'dine-in' ? `Customer at ${selectedTables}` : 'Walk-in Customer'} value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
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
                             <div className="flex items-center gap-2">
                                <Input 
                                    placeholder="Enter coupon code" 
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                />
                                <Dialog open={isCouponsDialogOpen} onOpenChange={setIsCouponsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline">View</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Available Coupons</DialogTitle>
                                            <DialogDescription>Select a coupon to apply to this order.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
                                            {initialOffersData.map(offer => (
                                                <div key={offer.id} className="p-3 border rounded-lg flex items-center justify-between gap-2">
                                                    <div>
                                                        <p className="font-semibold text-primary">{offer.couponCode}</p>
                                                        <p className="text-sm text-muted-foreground">{offer.title}</p>
                                                        <p className="text-xs">{offer.description}</p>
                                                    </div>
                                                    <Button size="sm" onClick={() => applyCoupon(offer.couponCode)}>Apply</Button>
                                                </div>
                                            ))}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <Separator/>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Subtotal</p>
                                    <p className="font-medium flex items-center"><IndianRupee className="h-3.5 w-3.5 mr-0.5"/>{cartSubtotal.toFixed(2)}</p>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between">
                                        <p className="text-muted-foreground">Discount ({couponCode})</p>
                                        <p className="font-medium text-green-600 flex items-center">-<IndianRupee className="h-3.5 w-3.5 mr-0.5"/>{discount.toFixed(2)}</p>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Taxes (18% GST)</p>
                                    <p className="font-medium flex items-center"><IndianRupee className="h-3.5 w-3.5 mr-0.5"/>{taxes.toFixed(2)}</p>
                                </div>
                            </div>
                             <Separator/>
                             <div className="flex justify-between items-center font-bold text-2xl">
                                <p>Total</p>
                                <p className="flex items-center"><IndianRupee className="h-6 w-6"/>{total.toFixed(2)}</p>
                            </div>
                        </CardContent>
                    </Card>
                    
                    {orderType === 'dine-in' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup value={paymentStatus} onValueChange={(v) => setPaymentStatus(v as 'Paid' | 'On Hold')} className="flex gap-4">
                                    <Label htmlFor="pay-status-paid" className="flex-1 flex items-center justify-center rounded-md border p-3 cursor-pointer hover:bg-accent has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                        <RadioGroupItem value="Paid" id="pay-status-paid" className="mr-2"/>
                                        <span className="font-medium">Paid</span>
                                    </Label>
                                    <Label htmlFor="pay-status-hold" className="flex-1 flex items-center justify-center rounded-md border p-3 cursor-pointer hover:bg-accent has-[:checked]:border-destructive has-[:checked]:bg-destructive/10">
                                        <RadioGroupItem value="On Hold" id="pay-status-hold" className="mr-2"/>
                                        <span className="font-medium">On Hold</span>
                                    </Label>
                                </RadioGroup>
                            </CardContent>
                        </Card>
                    )}

                    {paymentStatus === 'Paid' && (
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
                        </Card>
                    )}
                     <Button className="w-full text-lg h-12" onClick={handlePlaceOrder}>
                        Place Order
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default function TakeawayCheckoutPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TakeawayCheckoutContent />
        </Suspense>
    );
}
