
"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
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
import { ArrowLeft, IndianRupee, Landmark, Wallet, Banknote, AlertTriangle, TrendingUp, ShoppingBag, UtensilsCrossed, CalendarCheck, Zap, Percent, Receipt, Loader2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/context/AppContext"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function WithdrawPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { orders, walletBalance, initiateWithdrawal } = useAppContext();
    const [amount, setAmount] = useState("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleAmountButtonClick = (percentage: number) => {
        setAmount(Math.floor(walletBalance * percentage).toString());
    }

    const handleWithdrawClick = () => {
        const withdrawalAmount = parseFloat(amount);
        if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
            toast({
                title: "Invalid Amount",
                description: "Please enter a valid amount to withdraw.",
                variant: "destructive"
            });
            return;
        }
        if (withdrawalAmount > walletBalance) {
             toast({
                title: "Insufficient Balance",
                description: "The withdrawal amount cannot be more than your wallet balance.",
                variant: "destructive"
            });
            return;
        }
        setIsConfirmOpen(true);
    }

    const handleConfirmWithdraw = () => {
        setIsLoading(true);
        setTimeout(() => {
            const withdrawalAmount = parseFloat(amount);
            if (!isNaN(withdrawalAmount)) {
                initiateWithdrawal(withdrawalAmount);
            }
            setIsLoading(false);
            setIsConfirmOpen(false);
            toast({
                title: "Withdrawal Request Submitted!",
                description: `Your request to withdraw ₹${amount} is being processed.`
            });
            router.push("/earnings");
        }, 2000);
    }

    const {
      deliveryRevenue,
      takeawayRevenue,
      dineInRevenue,
      bookingCharges,
      walkInRevenue,
      gstOnDelivery,
      totalRevenue,
      totalDeductions,
      netPayout
  } = useMemo(() => {
    const delivery = orders.filter(o => o.type === "Delivery").reduce((sum, o) => sum + o.total, 0);
    const onlineTakeaway = orders.filter(o => o.type === 'Takeaway' && o.source !== 'Offline').reduce((sum, o) => sum + o.total, 0);
    const dineIn = orders.filter(o => o.type === "Dine-in" && !o.items.some(i => i.category === 'Booking')).reduce((sum, o) => sum + o.total, 0);
    const bookings = orders.filter(o => o.items.some(i => i.category === 'Booking')).reduce((sum, o) => sum + o.total, 0);
    const walkIn = orders.filter(o => o.type === 'Takeaway' && o.source === 'Offline').reduce((sum, o) => sum + o.total, 0);

    const revenue = delivery + onlineTakeaway + dineIn + bookings + walkIn;
    const gst = delivery * 0.05;
    const adsSpend = 500;
    const gstOnAds = adsSpend * 0.18;
    const refunds = 250;

    const deductions = gst + adsSpend + gstOnAds + refunds + walkIn;
    const payout = revenue - deductions;

    return {
      deliveryRevenue: delivery,
      takeawayRevenue: onlineTakeaway,
      dineInRevenue: dineIn,
      bookingCharges: bookings,
      walkInRevenue: walkIn,
      gstOnDelivery: gst,
      totalRevenue: revenue,
      totalDeductions: deductions,
      netPayout: payout,
    }
  }, [orders])

  const revenueItems = [
    { icon: TrendingUp, label: "Delivery", amount: deliveryRevenue },
    { icon: ShoppingBag, label: "Takeaway", amount: takeawayRevenue },
    { icon: UtensilsCrossed, label: "Dine-in", amount: dineInRevenue },
    { icon: CalendarCheck, label: "Booking Charges", amount: bookingCharges },
    { icon: Zap, label: "Walk-in Revenue", amount: walkInRevenue },
  ];

  const deductionItems = [
    { icon: Percent, label: "GST on Delivery (5%)", amount: -gstOnDelivery },
    { icon: Receipt, label: "Refunds", amount: -250 },
    { icon: TrendingUp, label: "Ads Spend", amount: -500 },
    { icon: Percent, label: "GST on Ads (18%)", amount: -90 },
    { icon: Zap, label: "Walk-in Revenue", amount: -walkInRevenue },
  ];

    const withdrawalFee = parseFloat(amount) * 0.01 || 0;
    const netPayoutAmount = parseFloat(amount) - withdrawalFee;

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <Link href="/earnings" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
          <ArrowLeft className="h-4 w-4"/>
          Back to Earnings
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-semibold md:text-3xl">Withdraw Funds</h1>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Withdrawal Request</CardTitle>
                <CardDescription>Transfer funds from your wallet to your bank account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-primary/10 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-primary/80 flex items-center gap-2"><Wallet className="h-4 w-4"/> Available Balance</p>
                        <p className="text-3xl font-bold text-primary flex items-center"><IndianRupee className="h-6 w-6"/>{walletBalance.toLocaleString('en-IN')}</p>
                    </div>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="py-2 text-sm font-semibold hover:no-underline">
                            View Earning Breakdown
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                            <Card>
                                <CardContent className="pt-6 space-y-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-4 p-3 bg-green-50 dark:bg-green-900/50 rounded-lg">
                                            <h3 className="font-semibold text-base text-green-800 dark:text-green-300">A. Revenue</h3>
                                            <p className="font-bold text-green-600 flex items-center"><IndianRupee className="h-4 w-4 mr-0.5"/>{totalRevenue.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
                                        </div>
                                        <div className="space-y-3 pl-3">
                                            {revenueItems.map(item => (
                                                <div key={item.label} className="flex items-center justify-between text-sm">
                                                    <p className="flex items-center gap-3 text-muted-foreground"><item.icon className="h-4 w-4"/> {item.label}</p>
                                                    <p className="font-medium flex items-center"><IndianRupee className="h-3.5 w-3.5 mr-0.5"/>{item.amount.toLocaleString('en-IN')}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-4 p-3 bg-red-50 dark:bg-red-900/50 rounded-lg">
                                            <h3 className="font-semibold text-base text-red-800 dark:text-red-300">B. Deductions</h3>
                                            <p className="font-bold text-red-600 flex items-center"><IndianRupee className="h-4 w-4 mr-0.5"/>{totalDeductions.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
                                        </div>
                                        <div className="space-y-3 pl-3">
                                            {deductionItems.map(item => (
                                            <div key={item.label} className="flex items-center justify-between text-sm">
                                                <p className="flex items-center gap-3 text-muted-foreground"><item.icon className="h-4 w-4" /> {item.label}</p>
                                                <p className="font-medium flex items-center"><IndianRupee className="h-3.5 w-3.5 mr-0.5"/>{item.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
                                            </div>
                                        ))}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex-col items-stretch gap-4 p-4 border-t">
                                     <div className="p-4 flex flex-col items-center justify-center text-center rounded-lg bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800">
                                        <p className="font-semibold text-sm text-green-800 dark:text-green-300">Net Payout (A - B)</p>
                                        <p className="font-extrabold text-3xl text-green-600 flex items-center"><IndianRupee className="h-7 w-7 mr-0.5"/>{netPayout.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
                                    </div>
                                </CardFooter>
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>


                <div className="space-y-2">
                    <Label htmlFor="amount">Amount to Withdraw</Label>
                    <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
                        <Input 
                            id="amount" 
                            type="number" 
                            className="pl-10 h-12 text-lg" 
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" onClick={() => handleAmountButtonClick(0.25)}>25%</Button>
                        <Button variant="outline" size="sm" onClick={() => handleAmountButtonClick(0.50)}>50%</Button>
                        <Button variant="outline" size="sm" onClick={() => handleAmountButtonClick(1)}>Max</Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Select Bank Account</Label>
                     <RadioGroup defaultValue="hdfc-1234" className="space-y-2">
                        <Label htmlFor="hdfc-1234" className="flex items-center justify-between p-4 rounded-lg border cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
                           <div className="flex items-center gap-3">
                                <Landmark className="h-5 w-5 text-primary"/>
                                <div>
                                    <p className="font-semibold">HDFC Bank</p>
                                    <p className="text-sm text-muted-foreground">A/c ending in 1234</p>
                                </div>
                           </div>
                           <RadioGroupItem value="hdfc-1234" id="hdfc-1234"/>
                        </Label>
                    </RadioGroup>
                </div>
                
                <Separator/>

                 <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                    <h3 className="font-semibold">Transaction Summary</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <p className="text-muted-foreground">Withdrawal Amount</p>
                            <p className="font-medium flex items-center"><IndianRupee className="h-3.5 w-3.5 mr-0.5"/>{parseFloat(amount || "0").toFixed(2)}</p>
                        </div>
                         <div className="flex justify-between">
                            <p className="text-muted-foreground">Transaction Fee (1%)</p>
                            <p className="font-medium text-destructive flex items-center">-<IndianRupee className="h-3.5 w-3.5 mr-0.5"/>{withdrawalFee.toFixed(2)}</p>
                        </div>
                        <Separator/>
                        <div className="flex justify-between font-bold text-base">
                            <p>Net Payout Amount</p>
                            <p className="flex items-center text-green-600"><IndianRupee className="h-4 w-4 mr-0.5"/>{netPayoutAmount > 0 ? netPayoutAmount.toFixed(2) : '0.00'}</p>
                        </div>
                    </div>
                 </div>

            </CardContent>
            <CardFooter className="flex-col gap-4">
                 <Button className="w-full text-lg h-12" onClick={handleWithdrawClick}>
                    Request Withdrawal
                </Button>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 text-xs">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0"/>
                    <p className="text-yellow-700 dark:text-yellow-400/80">
                        Withdrawals are processed within 24-48 business hours. A standard fee of 1% is applicable on all withdrawals.
                    </p>
                </div>
            </CardFooter>
        </Card>
        
        <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <AlertDialogContent side="bottom">
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Withdrawal</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are about to request a withdrawal of <span className="font-bold">₹{netPayoutAmount.toFixed(2)}</span> to your HDFC Bank account ending in 1234.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmWithdraw} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? "Processing..." : "Confirm & Continue"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  )
}
