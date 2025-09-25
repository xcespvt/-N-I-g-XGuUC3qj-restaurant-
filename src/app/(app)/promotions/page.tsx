
"use client"

import { useState } from "react"
import {
  ArrowUpRight,
  BarChart as BarChartIcon,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Edit,
  Eye,
  FileText,
  Filter,
  Lightbulb,
  MoreHorizontal,
  MousePointerClick,
  Percent,
  PlusCircle,
  Search,
  Target,
  Users,
  Download,
  IndianRupee,
  Upload,
  ArrowRight,
  User,
  Ticket,
  Gift,
  History,
  TrendingUp,
  Activity,
  Wallet,
} from "lucide-react"
import {
  Bar,
  BarChart,
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  ChartContainer
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle as AlertDialogTitleComponent,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProFeatureWrapper } from "@/components/pro-feature-wrapper"
import { useAppStore } from "@/context/useAppStore"
import { useToast } from "@/hooks/use-toast"


const dashboardPerformanceData = [
  { date: "Jan 1", views: 2200, clicks: 1300, conversions: 800 },
  { date: "Jan 8", views: 3000, clicks: 1800, conversions: 1100 },
  { date: "Jan 15", views: 2500, clicks: 1500, conversions: 950 },
  { date: "Jan 22", views: 3200, clicks: 2000, conversions: 1300 },
  { date: "Jan 29", views: 3500, clicks: 2200, conversions: 1450 },
  { date: "Feb 5", views: 2800, clicks: 1700, conversions: 1000 },
  { date: "Feb 12", views: 3800, clicks: 2500, conversions: 1600 },
];

const dashboardChartConfig = {
  views: { label: "Views", color: "hsl(var(--chart-1))" },
  clicks: { label: "Clicks", color: "hsl(var(--chart-2))" },
  conversions: { label: "Conversions", color: "hsl(var(--chart-3))" },
} as const;

const topPromotions = [
    { title: "First Order Discount", description: "15% off on your first order", views: "3,200", clicks: "980", conversions: "320", status: "Inactive" },
    { title: "Happy Hour", description: "Buy one get one free on all drinks from 4-7 PM", views: "2,150", clicks: "542", conversions: "178", status: "Active" },
    { title: "Summer Special", description: "Get 20% off on all summer menu items", views: "1,245", clicks: "338", conversions: "98", status: "Active" },
]

const recentActivity = [
    { icon: <ArrowUpRight className="h-5 w-5 text-green-500" />, title: "Summer Special promotion is performing well", description: "Conversion rate increased by 12% in the last week", time: "2 hours ago", color: "bg-green-100 dark:bg-green-900/50" },
    { icon: <CalendarIcon className="h-5 w-5 text-blue-500" />, title: "Weekend Brunch promotion scheduled", description: "Will start on June 1, 2024", time: "1 day ago", color: "bg-blue-100 dark:bg-blue-900/50" },
    { icon: <FileText className="h-5 w-5 text-red-500" />, title: "First Order Discount promotion ended", description: "Generated ₹4,800 in revenue from 320 orders", time: "3 days ago", color: "bg-red-100 dark:bg-red-900/50" },
]

const promotionTips = [
    { icon: <Target className="h-5 w-5 text-purple-500" />, title: "Target your audience", description: "Promotions targeted to specific customer segments perform 30% better.", color: "bg-purple-100 dark:bg-purple-900/50" },
    { icon: <Eye className="h-5 w-5 text-orange-500" />, title: "Use high-quality images", description: "Promotions with appealing visuals get 2x more engagement.", color: "bg-orange-100 dark:bg-orange-900/50" },
    { icon: <Lightbulb className="h-5 w-5 text-yellow-500" />, title: "Limited-time offers", description: "Creating a sense of urgency can increase conversion rates by up to 25%.", color: "bg-yellow-100 dark:bg-yellow-900/50" },
]

type PromotionStatus = 'Active' | 'Scheduled' | 'Ended';

const promotionsData = [
  {
    id: "promo1",
    title: "Happy Hour",
    status: "Active" as PromotionStatus,
    description: "Buy one get one free on all drinks from 4-7 PM",
    type: "Bogo",
    value: "BOGO",
    audience: "Returning",
    budget: "₹750",
    dateRange: "5/15/2023 - 12/31/2023",
    isActive: true,
    views: "2,150 views",
    image: "https://placehold.co/100x100.png"
  },
  {
    id: "promo2",
    title: "First Order Discount",
    status: "Ended" as PromotionStatus,
    description: "15% off on your first order",
    type: "Discount",
    value: "15%",
    audience: "New",
    budget: "₹1000",
    dateRange: "4/1/2023 - 5/31/2023",
    isActive: false,
    views: "3,200 views",
    image: "https://placehold.co/100x100.png"
  },
  {
    id: "promo3",
    title: "Summer Special",
    status: "Active" as PromotionStatus,
    description: "Get 20% off on all summer menu items",
    type: "Discount",
    value: "20%",
    audience: "All",
    budget: "₹500",
    dateRange: "6/1/2023 - 8/31/2023",
    isActive: true,
    views: "1,245 views",
    image: "https://placehold.co/100x100.png"
  },
  {
    id: "promo4",
    title: "Weekend Brunch",
    status: "Scheduled" as PromotionStatus,
    description: "Special brunch menu with complimentary mimosa",
    type: "Special",
    value: "Special Menu",
    audience: "New",
    budget: "₹600",
    dateRange: "6/1/2023 - 12/31/2023",
    isActive: false,
    views: "0 views",
    image: "https://placehold.co/100x100.png"
  },
];

const statusBadgeStyles: Record<PromotionStatus, string> = {
    Active: "bg-green-100 text-green-700 border-green-200",
    Scheduled: "bg-blue-100 text-blue-700 border-blue-200",
    Ended: "bg-gray-100 text-gray-700 border-gray-200",
}

const analyticsPerformanceData = [
  { date: "Jan 1", views: 1200, clicks: 300, conversions: 150, revenue: 12000 },
  { date: "Jan 8", views: 2200, clicks: 800, conversions: 400, revenue: 32000 },
  { date: "Jan 15", views: 1800, clicks: 600, conversions: 300, revenue: 24000 },
  { date: "Jan 22", views: 2500, clicks: 700, conversions: 350, revenue: 28000 },
  { date: "Jan 29", views: 3500, clicks: 1200, conversions: 600, revenue: 48000 },
  { date: "Feb 5", views: 3200, clicks: 1100, conversions: 550, revenue: 44000 },
  { date: "Feb 12", views: 3800, clicks: 1500, conversions: 750, revenue: 60000 },
];
const analyticsChartConfig = {
  views: { label: "Views", color: "hsl(var(--chart-1))" },
  clicks: { label: "Clicks", color: "hsl(var(--chart-2))" },
  conversions: { label: "Conversions", color: "hsl(var(--chart-4))" },
  revenue: { label: "Revenue", color: "hsl(var(--chart-5))" },
} as const;

const topPerformingPromotions = [
    { title: "Happy Hour", clicks: 542, conversions: 178, revenue: 3560, conversionRate: "32.8%" },
    { title: "First Order Discount", clicks: 980, conversions: 320, revenue: 4800, conversionRate: "32.7%" },
    { title: "Summer Special", clicks: 1245, conversions: 98, revenue: 1960, conversionRate: "27.1%" },
];

const audienceInsightsData = {
    newCustomers: { percentage: 32, label: "32% of conversions" },
    returningCustomers: { percentage: 68, label: "68% of conversions" },
    averageSpend: { new: 24.50, returning: 36.75 },
};

const staffPermissionsData = [
  {
    name: "John Smith",
    email: "john@example.com",
    role: "Manager",
    avatar: "https://placehold.co/100x100.png",
    avatarFallback: "JS",
    permissions: { view: true, create: true, edit: true, delete: true },
  },
  {
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "Staff",
    avatar: "https://placehold.co/101x101.png",
    avatarFallback: "SJ",
    permissions: { view: true, create: false, edit: true, delete: false },
  },
  {
    name: "Michael Brown",
    email: "michael@example.com",
    role: "Staff",
    avatar: "https://placehold.co/102x102.png",
    avatarFallback: "MB",
    permissions: { view: true, create: false, edit: false, delete: false },
  },
];

const permissionLevels = [
    {
        icon: User,
        title: "Manager",
        description: "Managers have full access to all promotion features. They can create, edit, view, and delete promotions. They can also manage staff permissions."
    },
    {
        icon: Users,
        title: "Staff",
        description: "Staff members have customizable permissions. By default, they can only view promotions, but you can grant them additional permissions as needed."
    },
    {
        icon: Lightbulb,
        title: "Best Practices",
        description: "Only grant edit and delete permissions to trusted staff members. Consider limiting create permissions to managers and senior staff to maintain consistency in your promotions."
    }
]

const AnalyticsCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-background border rounded-lg shadow-xl text-sm w-48">
          <p className="font-bold mb-2">{label}</p>
          <div className="space-y-1">
             {payload.map((pld: any) => (
                <div key={pld.dataKey} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: analyticsChartConfig[pld.dataKey as keyof typeof analyticsChartConfig].color}}></div>
                        <span>{analyticsChartConfig[pld.dataKey as keyof typeof analyticsChartConfig].label}</span>
                    </div>
                    <span>{pld.dataKey === 'revenue' && '₹'}{pld.value.toLocaleString()}</span>
                </div>
             ))}
          </div>
        </div>
      );
    }
    return null;
};

export default function PromotionsPage() {
  const { menuItems } = useAppStore();
  const { toast } = useToast();
  const [promotions, setPromotions] = useState(promotionsData);
  const [staffPermissions, setStaffPermissions] = useState(staffPermissionsData);
  
  const [activeDateRange, setActiveDateRange] = useState("Last 30 days");
  const [analyticsChartTab, setAnalyticsChartTab] = useState("performance");

  const [activePromotionTab, setActivePromotionTab] = useState("All");
  const [mainTab, setMainTab] = useState("dashboard");
  const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [isWalletConfirmOpen, setIsWalletConfirmOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<(typeof promotions)[0] | null>(null);
  const [date, setDate] = useState<DateRange | undefined>();
  const [walletBalance, setWalletBalance] = useState(2500);
  const [amountToAdd, setAmountToAdd] = useState(0);

  const filteredPromotions = promotions.filter(promo => {
      if (activePromotionTab === "All") return true;
      return promo.status === activePromotionTab;
  });

  const handleCreateClick = () => {
    setEditingPromotion(null);
    setDate(undefined);
    setIsPromotionDialogOpen(true);
  }

  const handleEditClick = (promo: (typeof promotions)[0]) => {
    setEditingPromotion(promo);
    const [startStr, endStr] = promo.dateRange.split(' - ');
    setDate({ from: new Date(startStr), to: new Date(endStr) });
    setIsPromotionDialogOpen(true);
  };
  
  const handleTogglePromotionStatus = (promoId: string) => {
    setPromotions(currentPromos => currentPromos.map(p => p.id === promoId ? { ...p, isActive: !p.isActive } : p));
  };
  
  const handlePermissionChange = (email: string, permission: keyof (typeof staffPermissionsData)[0]['permissions'], value: boolean) => {
    setStaffPermissions(currentStaff => currentStaff.map(staff =>
      staff.email === email
        ? { ...staff, permissions: { ...staff.permissions, [permission]: value } }
        : staff
    ));
  };

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  const handleAddFunds = () => {
    if (amountToAdd <= 0) return;

    setWalletBalance(prev => prev + amountToAdd);
    setIsWalletDialogOpen(false);
    setAmountToAdd(0);
    toast({
        title: "Funds Added",
        description: `₹${amountToAdd} has been added to your marketing wallet.`
    })
  }

  const handlePayFromWallet = () => {
     if (amountToAdd <= 0) {
        toast({
            title: "Invalid Amount",
            description: "Please enter a valid amount to add.",
            variant: "destructive"
        })
        return;
    }
    setIsWalletConfirmOpen(true);
  }

  const confirmPayFromWallet = () => {
    const totalDeduction = amountToAdd * 1.18; // amount + 18% commission
    setWalletBalance(prev => prev + amountToAdd);
    setIsWalletConfirmOpen(false);
    setIsWalletDialogOpen(false);
    setAmountToAdd(0);
    toast({
        title: "Funds Deducted",
        description: `₹${totalDeduction.toFixed(2)} has been deducted from your earnings and added to your marketing wallet.`
    })
  }


  return (
    <ProFeatureWrapper
        featureName="Marketing"
        featureDescription="create and manage targeted promotions to boost sales and customer engagement."
    >
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold md:text-3xl flex items-center gap-2"><Percent className="h-6 w-6"/> Marketing</h1>
                    <p className="text-muted-foreground">Create and manage your restaurant promotions</p>
                </div>
                <Button onClick={handleCreateClick}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Promotion
                </Button>
            </div>
            
            <Tabs value={mainTab} onValueChange={setMainTab}>
                <div className="flex flex-col sm:flex-row items-center justify-between flex-wrap gap-4">
                    <div className="sm:hidden w-full">
                        <Select value={mainTab} onValueChange={setMainTab}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select tab" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dashboard">Dashboard</SelectItem>
                                <SelectItem value="all">All Promotions</SelectItem>
                                <SelectItem value="analytics">Analytics</SelectItem>
                                <SelectItem value="permissions">Permissions</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <TabsList className="hidden sm:grid w-full grid-cols-2 sm:w-auto sm:grid-cols-4">
                        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                        <TabsTrigger value="all">All Promotions</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="permissions">Permissions</TabsTrigger>
                    </TabsList>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                                {activeDateRange}
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setActiveDateRange('Last 7 days')}>Last 7 days</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setActiveDateRange('Last 30 days')}>Last 30 days</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setActiveDateRange('Last 90 days')}>Last 90 days</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setActiveDateRange('This Year')}>This Year</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <TabsContent value="dashboard" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-1">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base"><Wallet className="h-5 w-5"/> Marketing Wallet</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold flex items-center"><IndianRupee className="h-7 w-7"/>{walletBalance.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground mt-1">Available Budget</p>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={() => setIsWalletDialogOpen(true)} className="w-full">Add Funds</Button>
                            </CardFooter>
                        </Card>
                         <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Promotions Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                                <Card className="p-3 bg-muted/50">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2"><Activity className="h-4 w-4"/>Active</div>
                                    <p className="text-3xl font-bold text-green-600">2</p>
                                    <p className="text-xs text-muted-foreground">1 scheduled</p>
                                </Card>
                                <Card className="p-3 bg-muted/50">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2"><MousePointerClick className="h-4 w-4"/>CTR</div>
                                    <p className="text-3xl font-bold text-green-600">27.5%</p>
                                    <p className="text-xs text-muted-foreground">7.4k views</p>
                                </Card>
                                <Card className="p-3 bg-muted/50">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2"><CheckCircle2 className="h-4 w-4"/>Conversion</div>
                                    <p className="text-3xl font-bold text-green-600">30.7%</p>
                                    <p className="text-xs text-muted-foreground">832 orders</p>
                                </Card>
                                <Card className="p-3 bg-muted/50">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2"><TrendingUp className="h-4 w-4"/>Revenue</div>
                                    <p className="text-3xl font-bold text-green-600 flex items-center"><IndianRupee className="h-6 w-6"/>11.6K</p>
                                    <p className="text-xs text-muted-foreground">from 832 orders</p>
                                </Card>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6 mt-6">
                        <Card className="lg:col-span-1">
                            <CardHeader>
                                <CardTitle>Top Performing Promotions</CardTitle>
                                <CardDescription>Based on conversion rate</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {topPromotions.map((promo, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-center">
                                            <p className="font-medium">{promo.title}</p>
                                            <Badge variant={promo.status === 'Active' ? 'secondary' : 'outline'} className={cn(promo.status === 'Active' ? "bg-primary/20 text-primary border-primary/20" : "")}>{promo.status}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{promo.description}</p>
                                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                            <span>Views: {promo.views}</span>
                                            <span>Clicks: {promo.clicks}</span>
                                            <span>Conversions: {promo.conversions}</span>
                                        </div>
                                        {index < topPromotions.length -1 && <Separator className="my-4"/>}
                                    </div>
                                ))}
                                <Button variant="ghost" className="w-full justify-start text-primary p-2 h-auto" onClick={handleCreateClick}>
                                    <PlusCircle className="mr-2 h-4 w-4"/> Create New Promotion
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="lg:col-span-1">
                            <Tabs defaultValue="activity" className="h-full flex flex-col">
                                <CardHeader className="p-4 border-b">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                                        <TabsTrigger value="tips">Promotion Tips</TabsTrigger>
                                    </TabsList>
                                </CardHeader>
                                <TabsContent value="activity" className="flex-grow">
                                    <CardContent className="p-6 space-y-4">
                                        {recentActivity.map((activity, index) => (
                                            <div key={index} className="flex items-start gap-4">
                                                <div className={cn("p-2 rounded-full flex-shrink-0", activity.color)}>
                                                    {activity.icon}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{activity.title}</p>
                                                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </TabsContent>
                                <TabsContent value="tips" className="flex-grow">
                                    <CardContent className="p-6 space-y-4">
                                        {promotionTips.map((tip, index) => (
                                            <div key={index} className="flex items-start gap-4">
                                                <div className={cn("p-2 rounded-full flex-shrink-0", tip.color)}>
                                                    {tip.icon}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{tip.title}</p>
                                                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <Button variant="outline" className="w-full mt-4">
                                            View All Tips
                                        </Button>
                                    </CardContent>
                                </TabsContent>
                            </Tabs>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="all" className="mt-6">
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search promotions..." className="pl-9 w-full" />
                            </div>
                            <Button variant="outline" className="w-full sm:w-auto"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                        </div>
                        
                        <Tabs value={activePromotionTab} onValueChange={setActivePromotionTab} className="w-full">
                            <div className="sm:hidden w-full">
                                <Select value={activePromotionTab} onValueChange={setActivePromotionTab}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All</SelectItem>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                                        <SelectItem value="Ended">Ended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <TabsList className="hidden sm:grid bg-muted p-1 rounded-lg w-full sm:w-auto grid-cols-4">
                                <TabsTrigger value="All">All</TabsTrigger>
                                <TabsTrigger value="Active">Active</TabsTrigger>
                                <TabsTrigger value="Scheduled">Scheduled</TabsTrigger>
                                <TabsTrigger value="Ended">Ended</TabsTrigger>
                            </TabsList>
                            
                            <div className="mt-6 space-y-4">
                                {filteredPromotions.map((promo) => (
                                    <Card key={promo.id}>
                                        <CardContent className="p-6 flex flex-col md:flex-row gap-6">
                                            <div className="flex-shrink-0 w-24 h-24 bg-muted rounded-md flex items-center justify-center">
                                                <Image src={promo.image} alt={promo.title} width={96} height={96} data-ai-hint="promotion abstract" className="rounded-md object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="text-lg font-semibold">{promo.title}</h3>
                                                            <Badge className={cn("text-xs", statusBadgeStyles[promo.status])}>{promo.status}</Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mt-1">{promo.description}</p>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1"><MoreHorizontal className="h-4 w-4" /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                                            <DropdownMenuItem>View Analytics</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                                                    <div>
                                                        <p className="text-muted-foreground">Type</p>
                                                        <p className="font-medium">{promo.type}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground">Value</p>
                                                        <p className="font-medium">{promo.value}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground">Audience</p>
                                                        <p className="font-medium flex items-center gap-1"><Users className="h-4 w-4" /> {promo.audience}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground">Budget</p>
                                                        <p className="font-medium">{promo.budget}</p>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1"><CalendarIcon className="h-3 w-3"/>{promo.dateRange}</p>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="bg-muted/50 p-4 flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <Switch id={`active-${promo.id}`} checked={promo.isActive} onCheckedChange={() => handleTogglePromotionStatus(promo.id)} disabled={promo.status === 'Ended'}/>
                                                <Label htmlFor={`active-${promo.id}`} className="text-sm font-medium">Active</Label>
                                                {promo.views && promo.status !== "Scheduled" && <p className="text-sm text-muted-foreground">{promo.views}</p>}
                                            </div>
                                            <Button variant="outline" onClick={() => handleEditClick(promo)}><Edit className="mr-2 h-4 w-4"/> Edit</Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                                {filteredPromotions.length === 0 && (
                                    <div className="text-center py-16 text-muted-foreground col-span-full">
                                        <p>No {activePromotionTab.toLowerCase()} promotions to show.</p>
                                    </div>
                                )}
                            </div>
                        </Tabs>
                    </div>
                </TabsContent>
                <TabsContent value="analytics" className="mt-6 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold">Promotions Analytics</h2>
                            <p className="text-muted-foreground">Track and analyze your promotion performance</p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Click-through Rate</CardDescription>
                            <CardTitle className="text-4xl">27.5%</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-green-500 flex items-center"><ArrowUpRight className="h-4 w-4"/>+2.5%</div>
                            <p className="text-xs text-muted-foreground mt-1">7,485 views, 2,060 clicks</p>
                        </CardContent>
                        </Card>
                        <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Conversion Rate</CardDescription>
                            <CardTitle className="text-4xl">30.7%</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-green-500 flex items-center"><ArrowUpRight className="h-4 w-4"/>+1.8%</div>
                            <p className="text-xs text-muted-foreground mt-1">2,060 clicks, 632 conversions</p>
                        </CardContent>
                        </Card>
                        <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Average Order Value</CardDescription>
                            <CardTitle className="text-4xl flex items-center"><IndianRupee className="h-7 w-7"/>18.35</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-green-500 flex items-center"><ArrowUpRight className="h-4 w-4" />+₹3.20</div>
                            <p className="text-xs text-muted-foreground mt-1">₹11,600 from 632 orders</p>
                        </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                            <CardTitle>Promotion Performance</CardTitle>
                            <CardDescription>Analyze your promotion metrics over time</CardDescription>
                            </div>
                            <Tabs value={analyticsChartTab} onValueChange={setAnalyticsChartTab} className="w-full sm:w-auto">
                            <TabsList className="grid w-full grid-cols-3 h-8 text-xs">
                                <TabsTrigger value="performance" className="h-6 px-2">Performance</TabsTrigger>
                                <TabsTrigger value="conversion" className="h-6 px-2">Conversion</TabsTrigger>
                                <TabsTrigger value="comparison" className="h-6 px-2">Comparison</TabsTrigger>
                            </TabsList>
                            </Tabs>
                        </div>
                        </CardHeader>
                        <CardContent>
                        <div className="p-4 bg-blue-100/20 rounded-md text-center text-blue-700 dark:text-blue-300 border border-blue-200/50 mb-4">
                            <p className="font-semibold text-sm">
                                Showing <span className="capitalize">{analyticsChartTab}</span> data for <span className="lowercase">{activeDateRange}</span>.
                            </p>
                             <p className="text-xs mt-1 text-blue-600/80 dark:text-blue-300/80">(Chart data is currently static for demonstration purposes)</p>
                        </div>
                        <ChartContainer config={analyticsChartConfig} className="h-[300px] w-full">
                            <LineChart data={analyticsPerformanceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tickLine={false} axisLine={true} />
                            <YAxis tickLine={false} axisLine={true} domain={[0, 3600]} ticks={[0, 900, 1800, 2700, 3600]} />
                            <Tooltip content={<AnalyticsCustomTooltip />} />
                            <Legend/>
                            <Line type="monotone" dataKey="views" stroke="var(--color-views)" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="clicks" stroke="var(--color-clicks)" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="conversions" stroke="var(--color-conversions)" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ChartContainer>
                        </CardContent>
                    </Card>

                    <div className="grid lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Top Performing Promotions</CardTitle>
                                <CardDescription>Ranked by conversion rate</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {topPerformingPromotions.map((promo, index) => (
                                <div key={promo.title}>
                                    <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <span className="text-muted-foreground font-medium">{index + 1}</span>
                                        <div>
                                        <p className="font-semibold">{promo.title}</p>
                                        <div className="text-xs text-muted-foreground flex flex-wrap gap-4">
                                            <span>Clicks: {promo.clicks}</span>
                                            <span>Conversions: {promo.conversions}</span>
                                            <span className="flex items-center">Revenue: <IndianRupee className="h-3 w-3 inline-flex mx-0.5"/>{promo.revenue.toLocaleString()}</span>
                                        </div>
                                        </div>
                                    </div>
                                    <p className="font-semibold">{promo.conversionRate}</p>
                                    </div>
                                    {index < topPerformingPromotions.length - 1 && <Separator className="my-4"/>}
                                </div>
                            ))}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Audience Insights</CardTitle>
                                <CardDescription>Performance by customer segment</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium">New Customers</span>
                                            <span className="text-muted-foreground">{audienceInsightsData.newCustomers.label}</span>
                                        </div>
                                        <Progress value={audienceInsightsData.newCustomers.percentage} className="h-2 [&>div]:bg-green-500" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium">Returning Customers</span>
                                            <span className="text-muted-foreground">{audienceInsightsData.returningCustomers.label}</span>
                                        </div>
                                        <Progress value={audienceInsightsData.returningCustomers.percentage} className="h-2" />
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium">Average Spend</span>
                                        <span className="text-muted-foreground">New vs. Returning</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2 flex">
                                        <div className="bg-green-500 rounded-l-full" style={{ width: `${(audienceInsightsData.averageSpend.new / (audienceInsightsData.averageSpend.new + audienceInsightsData.averageSpend.returning)) * 100}%` }}></div>
                                        <div className="bg-primary rounded-r-full" style={{ width: `${(audienceInsightsData.averageSpend.returning / (audienceInsightsData.averageSpend.new + audienceInsightsData.averageSpend.returning)) * 100}%` }}></div>
                                    </div>
                                    <div className="flex justify-between text-xs mt-1">
                                        <span className="font-medium flex items-center"><IndianRupee className="h-3 w-3"/>{audienceInsightsData.averageSpend.new.toFixed(2)}</span>
                                        <span className="font-medium flex items-center"><IndianRupee className="h-3 w-3"/>{audienceInsightsData.averageSpend.returning.toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="permissions" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle>Staff Permissions</CardTitle>
                                <CardDescription>Manage who can create and edit promotions</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add Staff</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                           <div className="overflow-x-auto">
                                <div className="border rounded-lg min-w-[800px]">
                                    <div className="grid grid-cols-10 gap-4 px-4 py-3 font-medium text-muted-foreground bg-muted/50 border-b">
                                        <div className="col-span-6">Staff Member</div>
                                        <div className="text-center">View</div>
                                        <div className="text-center">Create</div>
                                        <div className="text-center">Edit</div>
                                        <div className="text-center">Delete</div>
                                    </div>
                                    <div className="divide-y divide-border">
                                        {staffPermissions.map((staff) => (
                                            <div key={staff.email} className="grid grid-cols-10 gap-4 items-center p-4">
                                                <div className="col-span-6 flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={staff.avatar} alt={staff.name} />
                                                        <AvatarFallback>{staff.avatarFallback}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <p className="font-medium">{staff.name}</p>
                                                        <p className="text-sm text-muted-foreground">{staff.email}</p>
                                                    </div>
                                                    <Badge variant="outline">{staff.role}</Badge>
                                                </div>
                                                <div className="flex justify-center"><Switch checked={staff.permissions.view} onCheckedChange={(val) => handlePermissionChange(staff.email, 'view', val)} /></div>
                                                <div className="flex justify-center"><Switch checked={staff.permissions.create} onCheckedChange={(val) => handlePermissionChange(staff.email, 'create', val)} /></div>
                                                <div className="flex justify-center"><Switch checked={staff.permissions.edit} onCheckedChange={(val) => handlePermissionChange(staff.email, 'edit', val)} /></div>
                                                <div className="flex justify-center"><Switch checked={staff.permissions.delete} onCheckedChange={(val) => handlePermissionChange(staff.email, 'delete', val)} /></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Permission Levels</CardTitle>
                            <CardDescription>Understanding staff permission levels.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {permissionLevels.map(level => (
                                <div key={level.title} className="flex items-start gap-4">
                                    <div className="p-2 bg-muted rounded-full">
                                        <level.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{level.title}</p>
                                        <p className="text-sm text-muted-foreground">{level.description}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={isPromotionDialogOpen} onOpenChange={setIsPromotionDialogOpen}>
                <DialogContent className="sm:max-w-2xl p-0">
                    <DialogHeader className="p-6 pb-0">
                    <DialogTitle>{editingPromotion ? 'Edit Promotion' : 'Create Promotion'}</DialogTitle>
                    <DialogDescription>
                       {editingPromotion ? 'Update the details of your promotion.' : 'Fill in the details to create a new promotion.'}
                    </DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="basic" className="w-full">
                        <div className="px-6 border-b">
                            <TabsList>
                                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                                <TabsTrigger value="type">Promotion Type</TabsTrigger>
                                <TabsTrigger value="targeting">Targeting</TabsTrigger>
                                <TabsTrigger value="preview">Preview</TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="basic" className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="promo-name">Promotion Name</Label>
                                <Input id="promo-name" defaultValue={editingPromotion?.title} placeholder="e.g. Weekend Bonanza" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="promo-desc">Description</Label>
                                <Textarea id="promo-desc" defaultValue={editingPromotion?.description} placeholder="A short description of the promotion." />
                            </div>
                            <div className="space-y-2">
                                <Label>Date Range</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                        id="date"
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
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
                                            <span>Pick a date range</span>
                                        )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            selected={date}
                                            onSelect={setDate}
                                            numberOfMonths={2}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label>Promotion Image</Label>
                                <div className="flex items-center gap-4">
                                    <div className="h-24 w-24 bg-muted rounded-md flex items-center justify-center">
                                        <Image src={editingPromotion?.image || 'https://placehold.co/100x100.png'} alt="promotion image" width={96} height={96} data-ai-hint="promotion abstract" className="rounded-md object-cover"/>
                                    </div>
                                    <Button variant="outline"><Upload className="mr-2 h-4 w-4"/> Upload Image</Button>
                                </div>
                                <p className="text-xs text-muted-foreground">Recommended size: 800x400px. Max file size: 2MB</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="type" className="p-6 space-y-4">
                            <RadioGroup defaultValue="discount" className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div>
                                    <RadioGroupItem value="discount" id="type-discount" className="peer sr-only" />
                                    <Label htmlFor="type-discount" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                        <Percent className="mb-3 h-6 w-6" />
                                        Discount
                                    </Label>
                                </div>
                                 <div>
                                    <RadioGroupItem value="bogo" id="type-bogo" className="peer sr-only" />
                                    <Label htmlFor="type-bogo" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                        <Gift className="mb-3 h-6 w-6" />
                                        BOGO
                                    </Label>
                                </div>
                                 <div>
                                    <RadioGroupItem value="free-item" id="type-free-item" className="peer sr-only" />
                                    <Label htmlFor="type-free-item" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                        <Ticket className="mb-3 h-6 w-6" />
                                        Free Item
                                    </Label>
                                </div>
                            </RadioGroup>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="discount-type">Discount Type</Label>
                                    <Select defaultValue="percentage">
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="percentage">Percentage</SelectItem>
                                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="discount-value">Value</Label>
                                    <Input id="discount-value" type="number" placeholder="e.g. 15 for 15%" />
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="targeting" className="p-6 space-y-6">
                            <div>
                               <Label className="text-base font-semibold">Customer Segment</Label>
                               <p className="text-sm text-muted-foreground">Choose which customers are eligible for this promotion.</p>
                               <RadioGroup defaultValue="all" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                    <Label htmlFor="target-all" className="flex items-center gap-2 rounded-md border p-3 cursor-pointer hover:bg-accent has-[:checked]:border-primary">
                                        <RadioGroupItem value="all" id="target-all"/> All Customers
                                    </Label>
                                    <Label htmlFor="target-new" className="flex items-center gap-2 rounded-md border p-3 cursor-pointer hover:bg-accent has-[:checked]:border-primary">
                                        <RadioGroupItem value="new" id="target-new"/> New Customers
                                    </Label>
                                    <Label htmlFor="target-returning" className="flex items-center gap-2 rounded-md border p-3 cursor-pointer hover:bg-accent has-[:checked]:border-primary">
                                        <RadioGroupItem value="returning" id="target-returning"/> Returning Customers
                                    </Label>
                               </RadioGroup>
                            </div>
                             <div>
                               <Label className="text-base font-semibold">Conditions</Label>
                               <p className="text-sm text-muted-foreground">Set conditions that must be met for the promotion to apply.</p>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="min-order">Minimum Order Value</Label>
                                        <Input id="min-order" type="number" placeholder="e.g. 500" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="max-discount">Maximum Discount</Label>
                                        <Input id="max-discount" type="number" placeholder="e.g. 100" />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="preview" className="p-6">
                            <div className="bg-muted aspect-[9/16] w-full max-w-sm mx-auto rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg">
                                <Gift className="h-16 w-16 text-primary mb-4"/>
                                <h3 className="text-xl font-bold">Weekend Bonanza</h3>
                                <p className="text-muted-foreground mt-2">Get 20% off on all orders above ₹500 this weekend!</p>
                                <Button className="mt-6">Avail Offer</Button>
                            </div>
                            <p className="text-center text-xs text-muted-foreground mt-4">This is a preview of how your promotion will appear to customers.</p>
                        </TabsContent>
                    </Tabs>
                    <DialogFooter className="p-6 border-t bg-muted/50">
                        <Button variant="outline" onClick={() => setIsPromotionDialogOpen(false)}>Cancel</Button>
                        <Button>{editingPromotion ? 'Save Changes' : 'Create &amp; Activate'} <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={isWalletDialogOpen} onOpenChange={(isOpen) => { if (!isOpen) setAmountToAdd(0); setIsWalletDialogOpen(isOpen); }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Funds to Wallet</DialogTitle>
                        <DialogDescription>
                            Select or enter an amount to add to your marketing budget.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                            {[500, 1000, 2500].map(amount => (
                                <Button key={amount} variant="outline" onClick={() => setAmountToAdd(amount)}>
                                    ₹{amount}
                                </Button>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="custom-amount">Or enter a custom amount</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                                <Input 
                                    id="custom-amount" 
                                    type="number" 
                                    className="pl-6" 
                                    value={amountToAdd || ""}
                                    onChange={(e) => setAmountToAdd(parseInt(e.target.value) || 0)}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        {amountToAdd > 0 && (
                            <div className="p-3 bg-muted rounded-lg space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <p>Amount</p>
                                    <p className="font-medium">₹{amountToAdd.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>GST (18%)</p>
                                    <p className="font-medium">₹{(amountToAdd * 0.18).toFixed(2)}</p>
                                </div>
                                <Separator/>
                                <div className="flex justify-between font-bold">
                                    <p>Total Payable</p>
                                    <p>₹{(amountToAdd * 1.18).toFixed(2)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="flex-col gap-2">
                         <Button className="w-full" onClick={handleAddFunds} disabled={amountToAdd <= 0}>
                            Proceed to Pay
                         </Button>
                         <Button variant="secondary" className="w-full" onClick={handlePayFromWallet} disabled={amountToAdd <= 0}>
                            Pay with App Wallet
                         </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isWalletConfirmOpen} onOpenChange={setIsWalletConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitleComponent>Confirm Payment from Wallet</AlertDialogTitleComponent>
                        <AlertDialogDescription>
                            Are you sure you want to deduct ₹{(amountToAdd * 1.18).toFixed(2)} (₹{amountToAdd} + 18% commission) from your app earnings? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmPayFromWallet}>Confirm & Pay</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    </ProFeatureWrapper>
  )
}
