
"use client"

import { useMemo, useState } from "react"
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
  Globe,
  WifiOff,
  Banknote,
  Info,
  Calendar as CalendarIcon,
} from "lucide-react"
import { useAppStore } from "@/context/useAppStore"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { DateRange } from "react-day-picker"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"


export default function EarningsPage() {
    
  const { orders, walletBalance } = useAppStore();
  const { toast } = useToast();
  const [date, setDate] = useState<DateRange | undefined>();

  const {
      deliveryRevenue,
      takeawayRevenue,
      dineInRevenue,
      bookingCharges,
      walkInRevenue,
      gstOnDelivery,
      totalRevenue,
      totalDeductions,
      netPayout,
      deliveryOrdersCount,
      takeawayOrdersCount,
      dineInOrdersCount,
      bookingOrdersCount,
      walkInOrdersCount,
      totalOrdersCount,
      totalRefundsCount,
      totalOnlineOrdersCount,
      totalOfflineOrdersCount,
      totalRefundsAmount,
  } = useMemo(() => {
    // This is a mock calculation. In a real app, you'd filter by the selected date range.
    const deliveryOrders = orders.filter(o => o.type === "Delivery");
    const onlineTakeawayOrders = orders.filter(o => o.type === 'Takeaway' && o.source !== 'Offline');
    const dineInOrders = orders.filter(o => o.type === "Dine-in" && !o.items.some(i => i.category === 'Booking'));
    const bookingOrders = orders.filter(o => o.items.some(i => i.category === 'Booking'));
    const walkInOrders = orders.filter(o => o.type === 'Takeaway' && o.source === 'Offline');

    const delivery = 25000;
    const onlineTakeaway = 12000;
    const dineIn = 35000;
    const bookings = 8000;
    const walkIn = 5000;
    
    const revenue = delivery + onlineTakeaway + dineIn + bookings; // Walk-in is often handled separately
    const gst = delivery * 0.05;
    const adsSpend = 500;
    const gstOnAds = adsSpend * 0.18;
    const refunds = 250; // Mock refunds

    const deductions = gst + adsSpend + gstOnAds + refunds + walkIn;
    const payout = revenue - deductions;

    const totalOnline = deliveryOrders.length + onlineTakeawayOrders.length + dineInOrders.length + bookingOrders.length;
    const totalOffline = walkInOrders.length;

    return {
      deliveryRevenue: 25000,
      takeawayRevenue: 12000,
      dineInRevenue: 35000,
      bookingCharges: 8000,
      walkInRevenue: 5000,
      gstOnDelivery: 1250,
      totalRevenue: revenue,
      totalDeductions: deductions,
      netPayout: payout,
      deliveryOrdersCount: deliveryOrders.length,
      takeawayOrdersCount: onlineTakeawayOrders.length,
      dineInOrdersCount: dineInOrders.length,
      bookingOrdersCount: bookingOrders.length,
      walkInOrdersCount: walkInOrders.length,
      totalOrdersCount: orders.filter(o => o.status !== 'Cancelled').length,
      totalRefundsCount: 2, // Mock
      totalOnlineOrdersCount: totalOnline,
      totalOfflineOrdersCount: totalOffline,
      totalRefundsAmount: refunds,
    }
  }, [orders])

  const revenueItems = [
    { icon: TrendingUp, label: "Delivery Revenue", amount: deliveryRevenue },
    { icon: ShoppingBag, label: "Online Takeaway Revenue", amount: takeawayRevenue },
    { icon: UtensilsCrossed, label: "Dine-in Revenue", amount: dineInRevenue },
    { icon: CalendarCheck, label: "Booking Charges", amount: bookingCharges },
    { icon: Zap, label: "Offline/Walk-in Revenue", amount: walkInRevenue },
  ];

  const deductionItems = [
    { icon: Percent, label: "GST on Delivery (5%)", amount: -gstOnDelivery },
    { icon: Receipt, label: "Refunds", amount: -totalRefundsAmount },
    { icon: TrendingUp, label: "Ads Spend", amount: -500 },
    { icon: Percent, label: "GST on Ads (18%)", amount: -90 },
    { icon: Banknote, label: "Offline Cash Payment", amount: -walkInRevenue },
  ];
  
  const todayStats = [
    { icon: IndianRupee, label: "Total Revenue", value: totalRevenue, format: 'currency', color: "text-green-600" },
    { icon: Package, label: "Total Orders", value: totalOrdersCount, color: "text-blue-600" },
    { icon: Receipt, label: "Total Refunds", value: totalRefundsAmount, format: 'currency', color: "text-red-600" },
    { icon: Globe, label: "Online Orders", value: totalOnlineOrdersCount, color: "text-indigo-600" },
    { icon: WifiOff, label: "Offline Orders", value: totalOfflineOrdersCount, color: "text-slate-600" },
  ];

  const categoryStats = [
    { icon: Bike, label: "Delivery", value: deliveryOrdersCount, revenue: deliveryRevenue, color: "text-purple-600" },
    { icon: ShoppingBag, label: "Online Takeaway", value: takeawayOrdersCount, revenue: takeawayRevenue, color: "text-orange-600" },
    { icon: UtensilsCrossed, label: "Dine-in", value: dineInOrdersCount, revenue: dineInRevenue, color: "text-cyan-600" },
    { icon: Calendar, label: "Bookings", value: bookingOrdersCount, revenue: bookingCharges, color: "text-pink-600" },
    { icon: Zap, label: "Offline Takeaway", value: walkInOrdersCount, revenue: walkInRevenue, color: "text-slate-600" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <Card className="bg-primary text-primary-foreground shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardDescription className="text-primary-foreground/80 flex items-center gap-2"><Wallet className="h-4 w-4"/> Wallet Balance</CardDescription>
              <CardTitle className="text-4xl font-bold flex items-center"><IndianRupee className="h-7 w-7"/>{netPayout.toLocaleString('en-IN')}</CardTitle>
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
                <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="font-medium">Select Period</p>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Select defaultValue="may">
                            <SelectTrigger className="w-full sm:w-[120px]">
                                <SelectValue placeholder="Select Period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="may">May</SelectItem>
                                <SelectItem value="april">April</SelectItem>
                                <SelectItem value="march">March</SelectItem>
                            </SelectContent>
                        </Select>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                "w-full sm:w-[260px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                date.to ? (
                                    <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                                ) : (
                                <span>Pick a date or date range</span>
                                )}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={1}
                            />
                            </PopoverContent>
                        </Popover>
                     </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="flex flex-col">
                    <CardHeader className="flex-row items-center justify-between bg-green-50 dark:bg-green-900/50 rounded-t-lg p-4">
                        <CardTitle className="text-lg text-green-800 dark:text-green-300">Revenue</CardTitle>
                        <p className="font-bold text-lg text-green-600 flex items-center"><IndianRupee className="h-5 w-5 mr-0.5"/>{revenueItems.reduce((acc, item) => acc + item.amount, 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3 flex-grow">
                        {revenueItems.map(item => (
                            <div key={item.label} className="flex items-center justify-between text-sm">
                                <p className="flex items-center gap-3 text-muted-foreground"><item.icon className="h-4 w-4"/> {item.label}</p>
                                <p className="font-medium flex items-center"><IndianRupee className="h-3.5 w-3.5 mr-0.5"/>{item.amount.toLocaleString('en-IN')}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card className="flex flex-col">
                    <CardHeader className="flex-row items-center justify-between bg-red-50 dark:bg-red-900/50 rounded-t-lg p-4">
                        <CardTitle className="text-lg text-red-800 dark:text-red-300">Deductions</CardTitle>
                        <p className="font-bold text-lg text-red-600 flex items-center"><IndianRupee className="h-5 w-5 mr-0.5"/>{deductionItems.reduce((acc, item) => acc + item.amount, 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3 flex-grow">
                         {deductionItems.map(item => (
                            <div key={item.label} className="flex items-center justify-between text-sm">
                                <p className="flex items-center gap-3 text-muted-foreground"><item.icon className="h-4 w-4" /> {item.label}</p>
                                <p className="font-medium flex items-center"><IndianRupee className="h-3.5 w-3.5 mr-0.5"/>{item.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Net Payout</CardTitle>
                    <CardDescription>This is the final amount that will be transferred to your account for this period.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="p-4 flex flex-col items-center justify-center text-center rounded-lg bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800">
                        <p className="font-semibold text-sm text-green-800 dark:text-green-300">Net Payout (Revenue - Deductions)</p>
                        <p className="font-extrabold text-4xl text-green-600 flex items-center"><IndianRupee className="h-8 w-8 mr-1"/>{netPayout.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full">View Full Statement</Button>
                </CardFooter>
            </Card>


            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-center">
                <CardContent className="p-6">
                    <Trophy className="h-10 w-10 text-green-600 mx-auto mb-2" />
                    <h3 className="text-lg font-bold text-green-700 dark:text-green-300">Leaderboard</h3>
                    <p className="text-sm text-green-600/80 dark:text-green-400/80 mt-1 mb-4">See how you rank against other restaurant partners in your city!</p>
                    <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => toast({ title: "Coming Soon!", description: "This feature will be available in a future update."})}>View Leaderboard</Button>
                </CardContent>
            </Card>

            <Card>
              <CardHeader>
                  <CardTitle className="text-lg">Earning & Deduction Guide</CardTitle>
                  <CardDescription>Understand the terms used in your earnings breakdown.</CardDescription>
              </CardHeader>
              <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="revenue">
                          <AccordionTrigger>Revenue Types</AccordionTrigger>
                          <AccordionContent className="space-y-2 text-muted-foreground">
                              <p><strong>Delivery Revenue:</strong> Earnings from orders delivered by Crevings.</p>
                              <p><strong>Online Takeaway Revenue:</strong> Earnings from orders placed online by customers for pickup.</p>
                              <p><strong>Dine-in Revenue:</strong> This order is processed through Crevings for dine-in and booking.</p>
                              <p><strong>Booking Charges:</strong> Fees collected for advance table reservations.</p>
                              <p><strong>Offline/Walk-in Revenue:</strong> Revenue from orders placed manually in the app for walk-in customers.</p>
                          </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="deductions">
                          <AccordionTrigger>Deduction Types</AccordionTrigger>
                          <AccordionContent className="space-y-2 text-muted-foreground">
                              <p><strong>GST on Delivery:</strong> We charge 5% GST from the customer on behalf of the restaurant.</p>
                              <p><strong>Refunds:</strong> Amount refunded to customers for order issues.</p>
                              <p><strong>Ads Spend:</strong> The budget you've allocated for running promotions.</p>
                              <p><strong>GST on Ads:</strong> Tax applicable on the advertising services.</p>
                              <p><strong>Offline Cash Payment:</strong> This is an adjustment for orders where payment was collected by you directly (cash/offline) and not through the platform's payment gateway. This amount is deducted from your online earnings before payout.</p>
                          </AccordionContent>
                      </AccordionItem>
                  </Accordion>
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
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="p-4 flex items-center gap-4 lg:col-span-3 bg-primary/5 dark:bg-primary/10 border-primary/20">
                          <div className="p-3 rounded-full bg-background border bg-primary/10">
                             <IndianRupee className={cn("h-6 w-6", "text-green-600")} />
                          </div>
                          <div>
                              <p className="text-sm text-muted-foreground">Total Revenue</p>
                              <p className={cn("text-2xl font-bold", "text-green-600")}>
                                {totalRevenue < 1000
                                    ? `₹${totalRevenue.toFixed(0)}`
                                    : `₹${(totalRevenue / 1000).toFixed(1)}k`}
                              </p>
                          </div>
                    </Card>
                    <Card className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-full bg-background border">
                            <Package className={cn("h-6 w-6", "text-blue-600")} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Orders</p>
                            <p className={cn("text-2xl font-bold", "text-blue-600")}>
                                {totalOrdersCount}
                            </p>
                        </div>
                    </Card>
                     <Card className="p-4 flex items-center gap-4">
                          <div className="p-3 rounded-full bg-background border">
                             <Receipt className={cn("h-6 w-6", "text-red-600")} />
                          </div>
                          <div>
                              <p className="text-sm text-muted-foreground">Total Refunds</p>
                              <p className={cn("text-2xl font-bold", "text-red-600")}>
                                {totalRefundsAmount < 1000
                                    ? `₹${totalRefundsAmount.toFixed(0)}`
                                    : `₹${(totalRefundsAmount / 1000).toFixed(1)}k`}
                              </p>
                          </div>
                    </Card>
                     <Card className="p-4 flex items-center gap-4">
                            <div className="p-3 rounded-full bg-background border">
                                <Globe className={cn("h-6 w-6", "text-indigo-600")} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Online Orders</p>
                                <p className={cn("text-2xl font-bold", "text-indigo-600")}>
                                    {totalOnlineOrdersCount}
                                </p>
                            </div>
                    </Card>
                    <Card className="p-4 flex items-center gap-4">
                            <div className="p-3 rounded-full bg-background border">
                                <WifiOff className={cn("h-6 w-6", "text-slate-600")} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Offline Orders</p>
                                <p className={cn("text-2xl font-bold", "text-slate-600")}>
                                    {totalOfflineOrdersCount}
                                </p>
                            </div>
                    </Card>
                </CardContent>
                <CardContent className="px-4 pb-4">
                     <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {categoryStats.map((stat, index) => (
                             <Card key={index} className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <stat.icon className={cn("h-4 w-4", stat.color)} />
                                    <p className="text-sm font-semibold">{stat.label}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-1 items-baseline">
                                  <div>
                                    <p className="text-lg font-bold">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground">Orders</p>
                                  </div>
                                  <div>
                                    <p className="text-lg font-bold flex items-center"><IndianRupee className="h-4 w-4" />{stat.revenue > 1000 ? `${(stat.revenue/1000).toFixed(1)}k` : stat.revenue.toFixed(0)}</p>
                                    <p className="text-xs text-muted-foreground">Revenue</p>
                                  </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

    


}

    
