
"use client"

import { useMemo } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Wallet,
  Download,
  IndianRupee,
  UtensilsCrossed,
  ShoppingBag,
  CalendarCheck,
  Percent,
  Receipt,
  ArrowRight,
  TrendingUp,
  Trophy,
  MapPin,
  Flame,
  ChevronRight,
  Bike,
  Package,
  Calendar,
  Zap,
  History,
} from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import Link from "next/link"

export default function EarningsPage() {
    
  const { orders, walletBalance } = useAppContext();

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

  return (
    <div className="flex flex-col gap-6">
      <Card className="bg-primary text-primary-foreground shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardDescription className="text-primary-foreground/80 flex items-center gap-2"><Wallet className="h-4 w-4"/> Wallet Balance</CardDescription>
              <CardTitle className="text-4xl font-bold flex items-center"><IndianRupee className="h-7 w-7"/>{walletBalance.toLocaleString('en-IN')}</CardTitle>
              <p className="text-sm text-primary-foreground/80 !mt-2">Last payout: ₹1,200 on May 1, 2025</p>
            </div>
            <div className="flex items-center">
              <Link href="/earnings/history">
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20">
                  <History className="h-5 w-5"/>
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20">
                <Download className="h-5 w-5"/>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-0">
            <Button asChild className="w-full bg-primary-foreground text-primary font-bold hover:bg-primary-foreground/90">
                <Link href="/earnings/withdraw">Request Payout</Link>
            </Button>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="earnings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-lg">
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="earnings" className="mt-6 space-y-6">
            <Card>
                <CardContent className="p-4 flex items-center justify-between">
                    <p className="font-medium">Select Period</p>
                     <Select defaultValue="may">
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="may">May</SelectItem>
                            <SelectItem value="april">April</SelectItem>
                            <SelectItem value="march">March</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">This Month's Earning Breakdown</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-6">
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
                    <Button variant="outline" className="w-full">View Full Statement</Button>
                </CardFooter>
            </Card>

            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-center">
                <CardContent className="p-6">
                    <Trophy className="h-10 w-10 text-green-600 mx-auto mb-2" />
                    <h3 className="text-lg font-bold text-green-700 dark:text-green-300">Leaderboard</h3>
                    <p className="text-sm text-green-600/80 dark:text-green-400/80 mt-1 mb-4">See how you rank against other restaurant partners in your city!</p>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">View Leaderboard</Button>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="analysis" className="mt-6 space-y-6">
            <Card>
                <CardHeader className="flex flex-col sm:flex-row items-center justify-between">
                    <CardTitle className="text-lg">Today's Stats</CardTitle>
                    <Select defaultValue="today">
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Select Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="yesterday">Yesterday</SelectItem>
                            <SelectItem value="last7">Last 7 days</SelectItem>
                            <SelectItem value="last15">Last 15 days</SelectItem>
                            <SelectItem value="last30">Last 30 days</SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <Card className="p-4 bg-muted/50 flex flex-col items-center text-center">
                        <div className="p-2.5 bg-green-100 dark:bg-green-900/50 rounded-full mb-2">
                           <IndianRupee className="h-5 w-5 text-green-600"/>
                        </div>
                        <p className="text-2xl font-bold">4.6K</p>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                    </Card>
                     <Card className="p-4 bg-muted/50 flex flex-col items-center text-center">
                        <div className="p-2.5 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-2">
                           <Package className="h-5 w-5 text-blue-600"/>
                        </div>
                        <p className="text-2xl font-bold">42</p>
                        <p className="text-xs text-muted-foreground">Total Orders</p>
                    </Card>
                     <Card className="p-4 bg-muted/50 flex flex-col items-center text-center">
                        <div className="p-2.5 bg-red-100 dark:bg-red-900/50 rounded-full mb-2">
                           <Receipt className="h-5 w-5 text-red-600"/>
                        </div>
                        <p className="text-2xl font-bold">2</p>
                        <p className="text-xs text-muted-foreground">Refunds</p>
                    </Card>
                     <Card className="p-4 bg-muted/50 flex flex-col items-center text-center">
                        <div className="p-2.5 bg-purple-100 dark:bg-purple-900/50 rounded-full mb-2">
                           <Bike className="h-5 w-5 text-purple-600"/>
                        </div>
                        <p className="text-2xl font-bold">18</p>
                        <p className="text-xs text-muted-foreground">Delivery</p>
                    </Card>
                     <Card className="p-4 bg-muted/50 flex flex-col items-center text-center">
                        <div className="p-2.5 bg-orange-100 dark:bg-orange-900/50 rounded-full mb-2">
                           <ShoppingBag className="h-5 w-5 text-orange-600"/>
                        </div>
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-xs text-muted-foreground">Takeaway</p>
                    </Card>
                     <Card className="p-4 bg-muted/50 flex flex-col items-center text-center">
                        <div className="p-2.5 bg-cyan-100 dark:bg-cyan-900/50 rounded-full mb-2">
                           <UtensilsCrossed className="h-5 w-5 text-cyan-600"/>
                        </div>
                        <p className="text-2xl font-bold">7</p>
                        <p className="text-xs text-muted-foreground">Dine-in</p>
                    </Card>
                      <Card className="p-4 bg-muted/50 flex flex-col items-center text-center">
                        <div className="p-2.5 bg-pink-100 dark:bg-pink-900/50 rounded-full mb-2">
                           <Calendar className="h-5 w-5 text-pink-600"/>
                        </div>
                        <p className="text-2xl font-bold">5</p>
                        <p className="text-xs text-muted-foreground">Bookings</p>
                    </Card>
                     <Card className="p-4 bg-muted/50 flex flex-col items-center text-center">
                        <div className="p-2.5 bg-slate-100 dark:bg-slate-700 rounded-full mb-2">
                           <Zap className="h-5 w-5 text-slate-600"/>
                        </div>
                        <p className="text-2xl font-bold">3</p>
                        <p className="text-xs text-muted-foreground">Offline Takeaway</p>
                    </Card>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

    