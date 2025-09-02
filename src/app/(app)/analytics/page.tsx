
"use client"

import { useMemo, useState } from "react"
import {
  ArrowUpRight,
  Download,
  IndianRupee,
  Star,
  ShoppingBag,
  MessageSquare,
  ThumbsUp,
  LineChart as LineChartIcon,
  BarChart2,
  ChevronDown,
  Users,
  Receipt,
  Calendar as CalendarIcon,
  Gift,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  ChartContainer
} from "@/components/ui/chart"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { ProFeatureWrapper } from "@/components/pro-feature-wrapper"
import { useAppContext } from "@/context/AppContext"
import type { OrderItem } from "@/context/AppContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"


const weeklySalesData = [
  { day: "Mon", sales: 8500 },
  { day: "Tue", sales: 9200 },
  { day: "Wed", sales: 11000 },
  { day: "Thu", sales: 10500 },
  { day: "Fri", sales: 14000 },
  { day: "Sat", sales: 18500 },
  { day: "Sun", sales: 16000 },
];
const monthlySalesData = [
    { week: "Week 1", sales: 45000 },
    { week: "Week 2", sales: 52000 },
    { week: "Week 3", sales: 48000 },
    { week: "Week 4", sales: 61000 },
];
const yearlySalesData = [
    { month: "Jan", sales: 250000 },
    { month: "Feb", sales: 230000 },
    { month: "Mar", sales: 280000 },
    { month: "Apr", sales: 260000 },
    { month: "May", sales: 310000 },
    { month: "Jun", sales: 330000 },
    { month: "Jul", sales: 350000 },
    { month: "Aug", sales: 340000 },
    { month: "Sep", sales: 380000 },
    { month: "Oct", sales: 420000 },
    { month: "Nov", sales: 450000 },
    { month: "Dec", sales: 480000 },
];

const ordersByDayData = [
    { day: "Mon", orders: 25 }, { day: "Tue", orders: 31 }, { day: "Wed", orders: 35 },
    { day: "Thu", orders: 32 }, { day: "Fri", orders: 45 }, { day: "Sat", orders: 58 },
    { day: "Sun", orders: 52 },
]
const ordersChartConfig = { orders: { label: "Orders", color: "hsl(var(--chart-2))" } };


const ratingChartConfig = { count: { label: "Reviews", color: "hsl(var(--chart-4))" } };


export default function AnalyticsPage() {
    const [salesTimeRange, setSalesTimeRange] = useState("month");
    const [activeTab, setActiveTab] = useState("sales");
    const { toast } = useToast();
    const { orders, feedback } = useAppContext();
    const [date, setDate] = useState<DateRange | undefined>()

    const handleExport = () => {
        toast({
            title: "Exporting Data",
            description: "Your analytics report is being generated and will be downloaded shortly.",
        });
    };

    const { salesData, salesKey } = useMemo(() => {
        let data, key;
        switch (salesTimeRange) {
            case "week":
                data = weeklySalesData;
                key = "day";
                break;
            case "year":
                data = yearlySalesData;
                key = "month";
                break;
            case "month":
            default:
                data = monthlySalesData;
                key = "week";
        }
        return { salesData: data, salesKey: key };
    }, [salesTimeRange]);
    
    const maxSales = useMemo(() => Math.max(...salesData.map(d => d.sales)), [salesData]);

    const { totalRevenue, totalOrders } = useMemo(() => {
        const revenue = orders.reduce((sum, order) => sum + order.total, 0);
        return {
            totalRevenue: revenue,
            totalOrders: orders.length,
        };
    }, [orders]);

    const { topCategoriesData, salesByTimeData, revenueContributionData, promotionImpactData } = useMemo(() => {
        const allItems = orders.flatMap(o => o.items);
        const categorySales: Record<string, { sales: number }> = {};
        const timeSales: Record<string, { sales: number }> = {
            "Lunch (11am-2pm)": { sales: 0 },
            "Dinner (6pm-9pm)": { sales: 0 },
            "Other times": { sales: 0 },
        };
        
        const revenueContributions: Record<string, { sales: number }> = {
            "Delivery": { sales: 0 },
            "Takeaway": { sales: 0 },
            "Dine-in": { sales: 0 },
            "Bookings": { sales: 0 },
        }
        
        const promotionImpacts: Record<string, { sales: number }> = {
            "Summer Special": { sales: 2500 },
            "Flat 50 OFF": { sales: 1200 },
            "BOGO Burgers": { sales: 850 },
            "First Order Special": { sales: 3100 },
        }

        orders.forEach(order => {
            const sale = order.total;
            const hour = parseInt(order.time.split(":")[0]);
            const isPM = order.time.includes("PM");
            const hour24 = isPM && hour !== 12 ? hour + 12 : hour;

            if (hour24 >= 11 && hour24 < 14) {
                timeSales["Lunch (11am-2pm)"].sales += sale;
            } else if (hour24 >= 18 && hour24 < 21) {
                timeSales["Dinner (6pm-9pm)"].sales += sale;
            } else {
                timeSales["Other times"].sales += sale;
            }

            order.items.forEach(item => {
                 if (!categorySales[item.category]) {
                    categorySales[item.category] = { sales: 0 };
                 }
                 categorySales[item.category].sales += item.price * item.quantity;
            });
            
            if (order.items.some(i => i.category === 'Booking')) {
                revenueContributions['Bookings'].sales += order.total;
            } else {
                revenueContributions[order.type].sales += order.total;
            }
        });

        const totalCategorySales = Object.values(categorySales).reduce((sum, cat) => sum + cat.sales, 0);

        const topCategories = Object.entries(categorySales)
            .map(([name, data]) => ({
                name,
                sales: data.sales,
                percentage: totalCategorySales > 0 ? Math.round((data.sales / totalCategorySales) * 100) : 0,
            }))
            .sort((a,b) => b.sales - a.sales)
            .slice(0, 3)
            .map((cat, i) => ({ ...cat, color: ["bg-primary", "bg-sky-500", "bg-green-500"][i] }));
        
        const totalTimeSales = Object.values(timeSales).reduce((sum, time) => sum + time.sales, 0);
        const salesByTime = Object.entries(timeSales)
            .map(([name, data]) => ({
                name,
                sales: data.sales,
                percentage: totalTimeSales > 0 ? Math.round((data.sales / totalTimeSales) * 100) : 0,
            }))
            .map((time, i) => ({ ...time, color: ["bg-yellow-400", "bg-purple-500", "bg-red-500"][i]}));

        const totalContribution = Object.values(revenueContributions).reduce((sum, r) => sum + r.sales, 0);
        const revenueContribution = Object.entries(revenueContributions)
            .map(([name, data]) => ({
                name,
                sales: data.sales,
                percentage: totalContribution > 0 ? Math.round((data.sales / totalContribution) * 100) : 0,
            }))
            .sort((a,b) => b.sales - a.sales)
            .map((c, i) => ({ ...c, color: ["bg-purple-500", "bg-blue-500", "bg-green-500", "bg-orange-500"][i]}));

        const totalPromotionImpact = Object.values(promotionImpacts).reduce((sum, r) => sum + r.sales, 0);
        const promotionImpact = Object.entries(promotionImpacts)
            .map(([name, data]) => ({
                name,
                sales: data.sales,
                percentage: totalPromotionImpact > 0 ? Math.round((data.sales / totalPromotionImpact) * 100) : 0,
            }))
            .sort((a,b) => b.sales - a.sales)
            .map((c, i) => ({ ...c, color: ["bg-teal-500", "bg-amber-500", "bg-indigo-500", "bg-pink-500"][i]}));

        return { topCategoriesData: topCategories, salesByTimeData: salesByTime, revenueContributionData: revenueContribution, promotionImpactData: promotionImpact };

    }, [orders]);
    
    const menuRevenueData = useMemo(() => {
        const itemRevenue: Record<string, { revenue: number, quantity: number }> = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                if (item.category !== 'Booking') {
                    if (!itemRevenue[item.name]) {
                        itemRevenue[item.name] = { revenue: 0, quantity: 0 };
                    }
                    itemRevenue[item.name].revenue += item.price * item.quantity;
                    itemRevenue[item.name].quantity += item.quantity;
                }
            });
        });

        return Object.entries(itemRevenue)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);
    }, [orders]);

    const maxMenuRevenue = useMemo(() => Math.max(...menuRevenueData.map(d => d.revenue)), [menuRevenueData]);

    const orderTypeData = useMemo(() => {
        const counts = orders.reduce((acc, order) => {
            acc[order.type] = (acc[order.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return [
            { name: 'Dine-in', value: counts['Dine-in'] || 0, fill: 'hsl(var(--chart-1))' },
            { name: 'Delivery', value: counts['Delivery'] || 0, fill: 'hsl(var(--chart-2))' },
            { name: 'Takeaway', value: counts['Takeaway'] || 0, fill: 'hsl(var(--chart-3))' },
        ];
    }, [orders]);

    const { averageRating, ratingDistributionData } = useMemo(() => {
        if (feedback.length === 0) {
            return { averageRating: 0, ratingDistributionData: [] };
        }
        const totalRating = feedback.reduce((sum, f) => sum + f.rating, 0);
        const avgRating = totalRating / feedback.length;

        const distribution = feedback.reduce((acc, f) => {
            acc[f.rating] = (acc[f.rating] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);

        const ratingData = [
            { rating: 5, count: distribution[5] || 0 },
            { rating: 4, count: distribution[4] || 0 },
            { rating: 3, count: distribution[3] || 0 },
            { rating: 2, count: distribution[2] || 0 },
            { rating: 1, count: distribution[1] || 0 },
        ];

        return { averageRating: avgRating, ratingDistributionData: ratingData };

    }, [feedback]);
    
    const popularItemsData = useMemo(() => {
        const itemStats: Record<number, { name: string; sales: number; revenue: number }> = {};

        orders.flatMap(o => o.items).forEach((item: OrderItem) => {
            if (!itemStats[item.id]) {
                itemStats[item.id] = { name: item.name, sales: 0, revenue: 0 };
            }
            itemStats[item.id].sales += item.quantity;
            itemStats[item.id].revenue += item.quantity * item.price;
        });

        return Object.values(itemStats).sort((a,b) => b.sales - a.sales).slice(0, 5);
    }, [orders]);
    
  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}k`;
    }
    return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };


  return (
    <ProFeatureWrapper
        featureName="Advanced Analytics"
        featureDescription="get deeper insights into your sales, customers, and popular items to make data-driven decisions."
    >
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-semibold md:text-3xl">Analytics</h1>
                <Button onClick={handleExport} className="w-full sm:w-auto">
                    <Download className="mr-2 h-4 w-4" /> Export
                </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
                <Select>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Last 30 days" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="15">Last 15 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="60">Last 60 days</SelectItem>
                        <SelectItem value="90">Last 90 days</SelectItem>
                        <SelectItem value="150">Last 150 days</SelectItem>
                        <SelectItem value="365">One year</SelectItem>
                    </SelectContent>
                </Select>
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                        "w-full sm:w-[300px] justify-start text-left font-normal",
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
                        <span>Pick a date</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={1}
                    />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardDescription className="flex items-center gap-2 text-muted-foreground"><IndianRupee className="h-4 w-4"/>Total Revenue</CardDescription>
                        <CardTitle className="text-4xl flex items-center text-green-600">{formatCurrency(totalRevenue)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <ArrowUpRight className="h-4 w-4" /> +20.1% from last period
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardDescription className="flex items-center gap-2 text-muted-foreground"><ShoppingBag className="h-4 w-4"/>Orders</CardDescription>
                        <CardTitle className="text-4xl text-green-600">{totalOrders}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <ArrowUpRight className="h-4 w-4" /> +8.2% from last period
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardDescription className="flex items-center gap-2 text-muted-foreground"><Receipt className="h-4 w-4"/>Refunds</CardDescription>
                        <CardTitle className="text-4xl text-green-600">0</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground flex items-center">
                           No refunds this period
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardDescription className="flex items-center gap-2 text-muted-foreground"><Users className="h-4 w-4"/>Avg. Order Value</CardDescription>
                        <CardTitle className="text-4xl text-green-600">{formatCurrency(totalOrders > 0 ? totalRevenue / totalOrders : 0)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground flex items-center">
                            <ArrowUpRight className="h-4 w-4" /> +5.3% from last period
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="sm:hidden">
                    <Select value={activeTab} onValueChange={setActiveTab}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="popular">Popular</SelectItem>
                            <SelectItem value="menu-revenue">Menu Revenue</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <TabsList className="hidden sm:grid bg-muted p-1 rounded-lg w-full grid-cols-5">
                    <TabsTrigger value="sales">Sales</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="feedback">Feedback</TabsTrigger>
                    <TabsTrigger value="popular">Popular</TabsTrigger>
                    <TabsTrigger value="menu-revenue">Menu Revenue</TabsTrigger>
                </TabsList>

                <TabsContent value="sales" className="mt-6">
                    <Card>
                        <CardHeader className="flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <CardTitle>Sales Trends</CardTitle>
                            <div className="sm:hidden w-full">
                                <Select value={salesTimeRange} onValueChange={setSalesTimeRange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select time range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="week">This Week</SelectItem>
                                        <SelectItem value="month">This Month</SelectItem>
                                        <SelectItem value="year">This Year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="hidden sm:block">
                                <Tabs value={salesTimeRange} onValueChange={(value) => setSalesTimeRange(value)} className="w-auto">
                                    <TabsList className="grid grid-cols-3 h-8">
                                        <TabsTrigger value="week" className="text-xs px-2 h-6">Week</TabsTrigger>
                                        <TabsTrigger value="month" className="text-xs px-2 h-6">Month</TabsTrigger>
                                        <TabsTrigger value="year" className="text-xs px-2 h-6">Year</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             {salesData.map((d, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between items-center text-sm">
                                        <p className="font-medium capitalize">{d[salesKey as keyof typeof d]}</p>
                                        <p className="font-semibold text-primary flex items-center">
                                            {formatCurrency(d.sales)}
                                        </p>
                                    </div>
                                    <Progress value={(d.sales / maxSales) * 100} className="h-2" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
                        <Card>
                            <CardHeader><CardTitle>Top Selling Categories</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                {topCategoriesData.map((item) => (
                                    <div key={item.name} className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("h-8 w-1.5 rounded-sm", item.color)}></div>
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">{item.percentage}% of sales</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold flex items-center">{formatCurrency(item.sales)}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>Revenue Contribution</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                {revenueContributionData.map((item) => (
                                    <div key={item.name} className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("h-8 w-1.5 rounded-sm", item.color)}></div>
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">{item.percentage}% of revenue</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold flex items-center">{formatCurrency(item.sales)}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>Sales by Time</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                {salesByTimeData.map((item) => (
                                    <div key={item.name} className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("h-8 w-1.5 rounded-sm", item.color)}></div>
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">{item.percentage}% of sales</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold flex items-center">{formatCurrency(item.sales)}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Promotion Impact</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                {promotionImpactData.map((item) => (
                                    <div key={item.name} className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("h-8 w-1.5 rounded-sm", item.color)}></div>
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">{item.percentage}% of promo sales</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold flex items-center">{formatCurrency(item.sales)}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="orders" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Orders this Week</CardTitle>
                            <CardDescription>A look at your daily order volume.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={ordersChartConfig} className="h-[250px] w-full">
                               <BarChart data={ordersByDayData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                 <XAxis dataKey="day" tickLine={false} axisLine={true} dy={10} />
                                 <YAxis tickLine={false} axisLine={false} domain={[0, 60]}/>
                                 <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
                                 <Bar dataKey="orders" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                               </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><CardTitle>Orders by Type</CardTitle></CardHeader>
                            <CardContent>
                                <ChartContainer config={{}} className="h-56">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={orderTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                                const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                                const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                                return (<text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">{(percent * 100).toFixed(0)}%</text>);
                                            }}>
                                                {orderTypeData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}
                                            </Pie>
                                            <Legend iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Key Metrics</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p>Average Order Value</p>
                                    <p className="font-bold text-lg flex items-center">{formatCurrency(totalOrders > 0 ? totalRevenue / totalOrders : 0)}</p>
                                </div>
                                 <div className="flex items-center justify-between">
                                    <p>Peak Hours</p>
                                    <p className="font-bold text-lg">7pm - 9pm</p>
                                </div>
                                 <div className="flex items-center justify-between">
                                    <p>Repeat Customer Rate</p>
                                    <p className="font-bold text-lg">35%</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                 <TabsContent value="feedback" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="flex flex-col justify-center items-center text-center">
                            <CardHeader><CardTitle>Average Rating</CardTitle></CardHeader>
                            <CardContent>
                                <p className="text-5xl font-bold flex items-center gap-2">{averageRating.toFixed(1)} <Star className="h-9 w-9 text-yellow-400 fill-yellow-400"/></p>
                                <p className="text-sm text-muted-foreground mt-2">from {feedback.length} reviews</p>
                            </CardContent>
                        </Card>
                        <Card className="md:col-span-2">
                            <CardHeader><CardTitle>Rating Distribution</CardTitle></CardHeader>
                            <CardContent>
                                <ChartContainer config={ratingChartConfig} className="h-[200px] w-full">
                                   <BarChart data={ratingDistributionData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: -20 }}>
                                     <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                     <XAxis type="number" hide />
                                     <YAxis dataKey="rating" type="category" tickLine={false} axisLine={false} tick={({y, payload}) => <g transform={`translate(0,${y})`}><foreignObject x="0" y="-10" width="40" height="20"><div className="flex items-center gap-1 text-sm">{payload.value}<Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /></div></foreignObject></g>} />
                                     <Bar dataKey="count" fill="hsl(var(--chart-4))" radius={[0, 4, 4, 0]} />
                                   </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>
                     <Card>
                        <CardHeader><CardTitle>Common Feedback Themes</CardTitle></CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {["fast delivery", "great taste", "friendly staff", "good packaging", "value for money", "spicy", "fresh ingredients"].map(theme => (
                                <div key={theme} className="flex items-center gap-2 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-sm px-3 py-1 rounded-full">
                                    <ThumbsUp className="h-4 w-4" /> {theme}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="popular" className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader><CardTitle>Top Items by Sales</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            {popularItemsData.sort((a,b) => b.sales - a.sales).map(item => (
                                <div key={item.name}>
                                    <div className="flex justify-between items-center mb-1 text-sm">
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-muted-foreground">{item.sales} sold</p>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full">
                                        <div className="h-2 rounded-full bg-primary" style={{ width: `${(item.sales / Math.max(...popularItemsData.map(i => i.sales))) * 100}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>Top Items by Revenue</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             {popularItemsData.sort((a,b) => b.revenue - a.revenue).map(item => (
                                <div key={item.name} className="flex justify-between items-center text-sm">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="font-semibold text-green-600 flex items-center">{formatCurrency(item.revenue)}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="menu-revenue" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Menu Revenue Breakdown</CardTitle>
                            <CardDescription>
                                Revenue generated by each menu item.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {menuRevenueData.map((item, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between items-center text-sm">
                                        <p className="font-medium capitalize">{item.name}</p>
                                        <p className="font-semibold text-primary flex items-center">
                                            {formatCurrency(item.revenue)}
                                        </p>
                                    </div>
                                    <Progress value={(item.revenue / maxMenuRevenue) * 100} className="h-2" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    </ProFeatureWrapper>
  )
}
