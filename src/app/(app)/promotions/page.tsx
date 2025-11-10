"use client"

import { useState, useMemo, useEffect } from "react"
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
    Wand2,
    PowerOff,
    Power,
    Trash2,
    Check,
    ChevronsUpDown,
    BadgePercent,
    Mail,
    Clock,
    Sparkles,
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
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
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
import { format, differenceInDays } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProFeatureWrapper } from "@/components/pro-feature-wrapper"
import { useAppStore } from "@/context/useAppStore"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { DialogContent, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useGet, usePost, usePut, useQueryHelpers } from "@/hooks/useApi"
import { PaginationControls } from "@/components/pagination/PaginationControls"
import { apiClient } from "@/lib/apiClient"


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

type PromotionStatus = 'Active' | 'Scheduled' | 'Paused' | 'Ended';
type PromotionType = "Percentage" | "Flat" | "BOGO" | "Free Item" | "Happy Hour" | "Special";

const promotionsData = [
    {
        id: "promo1",
        title: "Happy Hour",
        status: "Active" as PromotionStatus,
        shortDescription: "Double the delight with our happy hour special.",
        description: "Buy one get one free on all drinks from 4-7 PM",
        type: "BOGO" as PromotionType,
        value: "BOGO",
        audience: "Returning",
        budget: "₹750",
        dateRange: "2024-05-15 - 2024-12-31",
        isActive: true,
        usage: 178,
        total: 250,
        image: "https://picsum.photos/seed/promo1/400/300",
        couponCode: "HAPPYBOGO",
        objective: "Drive traffic to outlet"
    },
    {
        id: "promo2",
        title: "First Order Discount",
        status: "Ended" as PromotionStatus,
        shortDescription: "A special welcome for our new customers.",
        description: "15% off on your first order",
        type: "Percentage" as PromotionType,
        value: "15%",
        audience: "New",
        budget: "₹1000",
        dateRange: "2024-04-01 - 2024-05-31",
        isActive: false,
        usage: 320,
        total: 400,
        image: "https://picsum.photos/seed/promo2/400/300",
        couponCode: "NEW15",
        objective: "Boost orders"
    },
    {
        id: "promo3",
        title: "Summer Special",
        status: "Active" as PromotionStatus,
        shortDescription: "Sizzling summer savings on our new menu.",
        description: "Get 20% off on all summer menu items",
        type: "Percentage" as PromotionType,
        value: "20%",
        audience: "All",
        budget: "₹500",
        dateRange: "2024-06-01 - 2024-08-31",
        isActive: true,
        usage: 98,
        total: 200,
        image: "https://picsum.photos/seed/promo3/400/300",
        couponCode: "SUMMER20",
        objective: "Promote new dish/menu"
    },
    {
        id: "promo4",
        title: "Weekend Brunch",
        status: "Scheduled" as PromotionStatus,
        shortDescription: "The perfect weekend treat for you.",
        description: "Special brunch menu with complimentary mimosa",
        type: "Special" as PromotionType,
        value: "Special Menu",
        audience: "New",
        budget: "₹600",
        dateRange: "2024-06-01 - 2024-12-31",
        isActive: false,
        usage: 0,
        total: 150,
        image: "https://picsum.photos/seed/promo4/400/300",
        couponCode: "WKNDBRUNCH",
        objective: "Drive traffic to outlet"
    },
];

const statusBadgeStyles: Record<PromotionStatus, string> = {
    Active: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border-green-200",
    Scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200",
    Paused: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200",
    Ended: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300",
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
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: analyticsChartConfig[pld.dataKey as keyof typeof analyticsChartConfig].color }}></div>
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

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);

const MultiOfferSelect = ({
    offers,
    selectedOfferIds,
    onSelectionChange,
}: {
    offers: typeof promotionsData;
    selectedOfferIds: string[];
    onSelectionChange: (offerIds: string[]) => void;
}) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (offerId: string) => {
        const newSelection = selectedOfferIds.includes(offerId)
            ? selectedOfferIds.filter((id) => id !== offerId)
            : [...selectedOfferIds, offerId];
        onSelectionChange(newSelection);
    };

    const selectedOffersText =
        selectedOfferIds.length > 0
            ? `${selectedOfferIds.length} offer${selectedOfferIds.length > 1 ? "s" : ""
            } selected`
            : "Choose existing offers...";

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal"
                >
                    <span className="truncate">{selectedOffersText}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder="Search offers..." />
                    <CommandList>
                        <CommandEmpty>No offers found.</CommandEmpty>
                        <CommandGroup>
                            {offers.filter(o => o.status === 'Active').map((offer) => (
                                <CommandItem
                                    key={offer.id}
                                    value={offer.title}
                                    onSelect={() => handleSelect(offer.id)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedOfferIds.includes(offer.id)
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {offer.title}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};


export default function PromotionsPage() {
    const { menuItems, branches, selectedBranch } = useAppStore();
    const { toast } = useToast();
    const [promotions, setPromotions] = useState(promotionsData);
    const [staffPermissions, setStaffPermissions] = useState(staffPermissionsData);

    const [activeDateRange, setActiveDateRange] = useState("Last 30 days");
    const [analyticsChartTab, setAnalyticsChartTab] = useState("performance");

    const [activePromotionTab, setActivePromotionTab] = useState("All");
    const [mainTab, setMainTab] = useState("dashboard");
    const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false);
    const [isWpCampaignSheetOpen, setIsWpCampaignSheetOpen] = useState(false);
    const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
    const [isWalletConfirmOpen, setIsWalletConfirmOpen] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState<(typeof promotions)[0] | null>(null);
    
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [duration, setDuration] = useState<number | null>(null);

    const [objective, setObjective] = useState("boost-orders");
    const objectiveLabels: { [key: string]: string } = {
        "boost-orders": "Boost orders",
        "promote-dish": "Promote new dish/menu",
        "drive-traffic": "Drive traffic to outlet",
        "highlight-discounts": "Highlight discounts/offers",
        "brand-awareness": "Brand awareness",
    };

    // Creation form state
    const [createTab, setCreateTab] = useState<'basic' | 'targeting' | 'preview'>('basic');
    const [campaignTitle, setCampaignTitle] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [selectedService, setSelectedService] = useState<string>("");
    const [selectedSegment, setSelectedSegment] = useState<string>("all");


    const [walletBalance, setWalletBalance] = useState(2500);
    const [amountToAdd, setAmountToAdd] = useState(0);
    const [isCrevingsStudioDialogOpen, setIsCrevingsStudioDialogOpen] = useState(false);

    const [wpCampaignName, setWpCampaignName] = useState("");
    const [wpDescription, setWpDescription] = useState("");
    const [wpOffer, setWpOffer] = useState("");
    const [wpBudget, setWpBudget] = useState<number | string>("");
    const [adBudget, setAdBudget] = useState<number | string>("");
    const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
    
    const [selectedPlacements, setSelectedPlacements] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    // Resolve restaurantId for API call, fallback to provided sample id
    const currentBranch = branches.find(b => b.id === selectedBranch);
    const restaurantId = currentBranch?.restaurantId ?? "b1a2c3d4-e5f6-7890-1234-56789abcdefg";

    // Live promotions API typing
    type PromotionApiItem = {
      restaurantId: string;
      promotionId: string;
      campaignTitle: string;
      shortDescription: string;
      couponCode?: string;
      adBudget?: number;
      estimatedImpressions?: number;
      objective?: string;
      offers?: Array<{ offerId: string; offerTitle: string; _id?: string }>;
      startDate?: string;
      endDate?: string;
      placementOptions?: any;
      totalCost?: number;
      service?: string;
      customerSegment?: "NEW" | "RETURNING" | "ALL";
      promotionStatus?: "Active" | "Scheduled" | "Paused" | "Ended";
      createdAt?: string;
      updatedAt?: string;
    };

    type PromotionApiResponse = {
      success: boolean;
      message: string;
      data: PromotionApiItem[];
      pagination: {
        currentPage: number;
        itemsPerPage: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
      };
    };

    // Fetch promotions from backend
    const { data: promotionsApi, error: promotionsError, isLoading: promotionsLoading } = useGet<PromotionApiResponse>(
      ["promotions", restaurantId],
      `https://backend.crevings.com/api/promotions/promotions/${restaurantId}`,
      { page: currentPage, limit: 10 },
      { enabled: !!restaurantId }
    );

    function mapStatus(status?: string): PromotionStatus {
      switch (status) {
        case "Active": return "Active";
        case "Scheduled": return "Scheduled";
        case "Paused":
        case "Pause": return "Paused";
        default: return "Ended";
      }
    }

    function mapAudience(seg?: string) {
      if (seg === "NEW") return "New";
      if (seg === "RETURNING") return "Returning";
      return "All";
    }

    function toDateRange(start?: string, end?: string) {
      const s = start ? format(new Date(start), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
      const e = end ? format(new Date(end), "yyyy-MM-dd") : s;
      return `${s} - ${e}`;
    }

    function transformPromotions(items: PromotionApiItem[]): typeof promotionsData {
      return items.map((p) => {
        const firstOfferTitle = p.offers?.[0]?.offerTitle ?? "Special";
        const imageSeed = p.promotionId ?? Math.random().toString(36).slice(2);
        return {
          id: p.promotionId ?? imageSeed,
          title: p.campaignTitle ?? firstOfferTitle,
          status: mapStatus(p.promotionStatus),
          shortDescription: p.shortDescription ?? "",
          description: p.shortDescription ?? "",
          type: firstOfferTitle.includes("BOGO") ? "BOGO" : firstOfferTitle.includes("%") ? "Percentage" : firstOfferTitle.includes("Happy Hour") ? "Happy Hour" : "Special",
          value: firstOfferTitle,
          audience: mapAudience(p.customerSegment),
          budget: typeof p.adBudget === "number" ? `₹${p.adBudget}` : "₹0",
          dateRange: toDateRange(p.startDate, p.endDate),
          isActive: p.promotionStatus === "Active",
          usage: Math.min( (p.estimatedImpressions ?? 0) * 0.3, p.estimatedImpressions ?? 0),
          total: p.estimatedImpressions ?? 0,
          image: `https://picsum.photos/seed/${imageSeed}/400/300`,
          couponCode: p.couponCode ?? "",
          objective: p.objective ?? "Highlight discounts/offers",
        };
      });
    }

    useEffect(() => {
      if (promotionsApi?.success && Array.isArray(promotionsApi.data)) {
        const mapped = transformPromotions(promotionsApi.data);
        setPromotions(mapped.length ? mapped : promotionsData);
      } else if (promotionsError) {
        toast({
          title: "Failed to fetch promotions",
          description: "Showing local sample data.",
          variant: "destructive",
        });
      }
    }, [promotionsApi, promotionsError]);

    // Add Promotion: mutation setup and helpers
    const { invalidate } = useQueryHelpers();

    type AddPromotionPayload = {
      restaurantId: string;
      campaignTitle: string;
      shortDescription: string;
      couponCode?: string;
      adBudget: number;
      estimatedImpressions: number;
      objective: string;
      offers: { offerId: string; offerTitle: string }[];
      startDate: string;
      endDate: string;
      placementOptions: Record<string, { isEnabled: boolean; price: number; tags: string[] }>;
      totalCost: number;
      service: "DELIVERY" | "TAKEAWAY" | "OFFLINE_TAKEAWAY" | "DINEIN" | "BOOKING";
      customerSegment: "ALL" | "NEW" | "RETURNING";
    };

    const placementKeyMap: Record<string, string> = {
      "homepage-banner": "homepageBanner",
      "search-boost": "searchResultBoost",
      "category-highlight": "categoryHighlight",
      "offer-section": "offerSection",
      "push-notification": "pushNotification",
      alert: "alert",
    };

    function buildPlacementPayload() {
      const payload: Record<string, { isEnabled: boolean; price: number; tags: string[] }> = {};
      for (const p of placementOptions) {
        const key = placementKeyMap[p.id] || p.id;
        payload[key] = {
          isEnabled: selectedPlacements.includes(p.id),
          price: p.cost,
          tags: p.tags,
        };
      }
      return payload;
    }

    function mapService(service: string): AddPromotionPayload["service"] {
      switch (service) {
        case "Delivery": return "DELIVERY";
        case "Takeaway": return "TAKEAWAY";
        case "Offline Takeaway": return "OFFLINE_TAKEAWAY";
        case "Dine-in": return "DINEIN";
        case "Booking": return "BOOKING";
        default: return "DELIVERY";
      }
    }

    function segmentToApi(seg: string): AddPromotionPayload["customerSegment"] {
      if (seg === "new") return "NEW";
      if (seg === "returning") return "RETURNING";
      return "ALL";
    }

    function resetCreateForm() {
      setCampaignTitle("");
      setShortDescription("");
      setCouponCode("");
      setAdBudget("");
      setSelectedOffers([]);
      setStartDate(undefined);
      setEndDate(undefined);
      setSelectedPlacements([]);
      setSelectedService("");
      setSelectedSegment("all");
      setObjective("boost-orders");
    }

    const addPromotionMutation = usePost<any, AddPromotionPayload>(
      "https://backend.crevings.com/api/promotions/promotions/add",
      {
        onSuccess: (_data, variables) => {
          invalidate(["promotions", restaurantId, { page: currentPage, limit: 10 }]);
          toast({ title: "Promotion created", description: `"${variables.campaignTitle}" added.` });
          setIsPromotionDialogOpen(false);
          setCreateTab("basic");
          resetCreateForm();
        },
        onError: (_error) => {
          toast({ variant: "destructive", title: "Couldn’t create promotion", description: "Please try again." });
        },
      }
    );

    function handleCreatePromotion() {
      if (!restaurantId) {
        toast({ variant: "destructive", title: "Restaurant ID Missing", description: "Please select a valid branch with restaurant ID." });
        return;
      }

      const numericBudget = typeof adBudget === 'number' ? adBudget : Number(adBudget || 0);
      const estImpressions = numericBudget * 20;
      const offersPayload = selectedOffers.map(id => {
        const offer = promotions.find(p => p.id === id);
        return { offerId: id, offerTitle: offer?.title || "Offer" };
      });

      const payload: AddPromotionPayload = {
        restaurantId,
        campaignTitle: campaignTitle || "Untitled Campaign",
        shortDescription: shortDescription || "",
        couponCode: couponCode || undefined,
        adBudget: numericBudget,
        estimatedImpressions: estImpressions,
        objective: objectiveLabels[objective] || "Boost orders",
        offers: offersPayload,
        startDate: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : new Date().toISOString(),
        placementOptions: buildPlacementPayload(),
        totalCost: finalPayable,
        service: mapService(selectedService || "Delivery"),
        customerSegment: segmentToApi(selectedSegment || "all"),
      };

      addPromotionMutation.mutate(payload);
    }

    // Edit Promotion: payload, helpers, and mutation
    type EditPromotionPayload = {
      campaignTitle: string;
      shortDescription: string;
      couponCode?: string;
      adBudget: number;
      estimatedImpressions: number;
      objective: string;
      offers: { offerId: string; offerTitle: string }[];
      startDate: string;
      endDate: string;
      placementOptions: Record<string, { isEnabled: boolean; price: number; tags: string[] }>;
      service: "DELIVERY" | "TAKEAWAY" | "OFFLINE_TAKEAWAY" | "DINEIN" | "BOOKING";
      customerSegment: "ALL" | "NEW" | "RETURNING";
      promotionStatus: "Active" | "Scheduled" | "Ended";
    };

    function objectiveKeyFromLabel(label: string) {
      const entry = Object.entries(objectiveLabels).find(([k, v]) => v === label);
      return entry?.[0] ?? "highlight-discounts";
    }

    const placementKeyReverseMap: Record<string, string> = {
      homepageBanner: "homepage-banner",
      searchResultBoost: "search-boost",
      categoryHighlight: "category-highlight",
      offerSection: "offer-section",
      pushNotification: "push-notification",
      alert: "alert",
      alertNotification: "alert",
    };

    function serviceLabelFromApi(s?: string) {
      switch (s) {
        case "DELIVERY": return "Delivery";
        case "TAKEAWAY": return "Takeaway";
        case "OFFLINE_TAKEAWAY": return "Offline Takeaway";
        case "DINEIN": return "Dine-in";
        case "BOOKING": return "Booking";
        default: return "";
      }
    }

    function segmentUiFromApi(seg?: string) {
      if (seg === "NEW") return "new";
      if (seg === "RETURNING") return "returning";
      return "all";
    }

    useEffect(() => {
      if (!editingPromotion) return;
      const apiItem = promotionsApi?.data?.find(i => i.promotionId === editingPromotion.id);
      if (!apiItem) return;
      setCampaignTitle(apiItem.campaignTitle || editingPromotion.title || "");
      setShortDescription(apiItem.shortDescription || editingPromotion.shortDescription || "");
      setCouponCode(apiItem.couponCode || "");
      setAdBudget(typeof apiItem.adBudget === "number" ? apiItem.adBudget : Number((editingPromotion.budget || "").replace(/[^\d]/g, "")) || "");
      setObjective(objectiveKeyFromLabel(apiItem.objective || editingPromotion.objective || objectiveLabels["highlight-discounts"]));
      setSelectedOffers((apiItem.offers || []).map(o => o.offerId));
      const enabledKeys = Object.entries(apiItem.placementOptions || {}).filter(([_, v]: any) => (v as any)?.isEnabled).map(([k]) => k);
      setSelectedPlacements(enabledKeys.map(k => placementKeyReverseMap[k]).filter(Boolean));
      setSelectedService(serviceLabelFromApi(apiItem.service));
      setSelectedSegment(segmentUiFromApi(apiItem.customerSegment));
      setCreateTab("basic");
    }, [editingPromotion]);

    const updatePromotionMutation = usePut<any, EditPromotionPayload>(
      `https://backend.crevings.com/api/promotions/promotions/update/${restaurantId}/${editingPromotion?.id}`,
      {
        onSuccess: () => {
          invalidate(["promotions", restaurantId, { page: currentPage, limit: 10 }]);
          toast({ title: "Promotion updated", description: "Changes saved successfully." });
          setIsPromotionDialogOpen(false);
          setEditingPromotion(null);
          setCreateTab("basic");
        },
        onError: () => {
          toast({ variant: "destructive", title: "Couldn’t update promotion", description: "Please try again." });
        },
      }
    );

    function handleUpdatePromotion() {
      if (!restaurantId || !editingPromotion?.id) {
        toast({ variant: "destructive", title: "Update failed", description: "Missing restaurant or promotion ID." });
        return;
      }
      const numericBudget = typeof adBudget === 'number' ? adBudget : Number(adBudget || 0);
      const estImpressions = numericBudget * 20;
      const offersPayload = selectedOffers.map(id => {
        const offer = promotions.find(p => p.id === id);
        return { offerId: id, offerTitle: offer?.title || "Offer" };
      });
      const payload: EditPromotionPayload = {
        campaignTitle: campaignTitle || "Untitled Campaign",
        shortDescription: shortDescription || "",
        couponCode: couponCode || undefined,
        adBudget: numericBudget,
        estimatedImpressions: estImpressions,
        objective: objectiveLabels[objective] || "Boost orders",
        offers: offersPayload,
        startDate: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : new Date().toISOString(),
        placementOptions: buildPlacementPayload(),
        service: mapService(selectedService || "Delivery"),
        customerSegment: segmentToApi(selectedSegment || "all"),
        promotionStatus: (promotionsApi?.data?.find(i => i.promotionId === editingPromotion.id)?.promotionStatus as any) || (editingPromotion.status as any) || "Scheduled",
      };
      updatePromotionMutation.mutate(payload);
    }

    const impressions = typeof adBudget === 'number' ? adBudget * 20 : 0;
    const wpImpressions = typeof wpBudget === 'number' ? wpBudget * 20 : 0;
    
    const placementOptions = [
        { id: "homepage-banner", label: "Homepage Banner", cost: 100, tags: ["High Visibility"] },
        { id: "search-boost", label: "Search Result Boost", cost: 75, tags: ["High Potential"] },
        { id: "category-highlight", label: "Category Highlight", cost: 50, tags: [] },
        { id: "offer-section", label: "Offer Section", cost: 40, tags: [] },
        { id: "push-notification", label: "Push Notification", cost: 150, tags: ["High Engagement"] },
        { id: "alert", label: "Alert", cost: 120, tags: [] }
    ];

    const handlePlacementChange = (placementId: string) => {
        setSelectedPlacements(prev =>
            prev.includes(placementId)
                ? prev.filter(id => id !== placementId)
                : [...prev, placementId]
        );
    };

    const totalPlacementCost = useMemo(() => {
        return selectedPlacements.reduce((total, id) => {
            const placement = placementOptions.find(p => p.id === id);
            return total + (placement ? placement.cost : 0);
        }, 0);
    }, [selectedPlacements]);

    const finalPayable = useMemo(() => {
        const baseBudget = typeof adBudget === 'number' ? adBudget : 0;
        return baseBudget + totalPlacementCost;
    }, [adBudget, totalPlacementCost]);


    useEffect(() => {
        if (startDate && endDate && endDate > startDate) {
            setDuration(differenceInDays(endDate, startDate) + 1);
        } else {
            setDuration(null);
        }
    }, [startDate, endDate]);

    const filteredPromotions = promotions.filter(promo => {
        if (activePromotionTab === "All") return true;
        return promo.status === activePromotionTab;
    });

    const itemsPerPage = promotionsApi?.pagination?.itemsPerPage ?? 10;
    const isFiltering = activePromotionTab !== "All";

    let pageItems = promotions as typeof promotions;
    let computedTotalItems = (promotionsApi?.pagination?.totalItems ?? promotions.length);
    let computedTotalPages = Math.max(1, Math.ceil((computedTotalItems || 0) / itemsPerPage));

    if (isFiltering) {
        const totalItems = filteredPromotions.length;
        computedTotalItems = totalItems;
        computedTotalPages = Math.max(1, Math.ceil((totalItems || 0) / itemsPerPage));
        const startIndex = Math.min((currentPage - 1) * itemsPerPage, Math.max(0, totalItems - 1));
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        pageItems = filteredPromotions.slice(startIndex, endIndex);
    } else {
        pageItems = promotions;
    }

    useEffect(() => {
        setCurrentPage(1);
    }, [activePromotionTab]);

    const handleCreateClick = () => {
        setEditingPromotion(null);
        setStartDate(undefined);
        setEndDate(undefined);
        setSelectedPlacements([]);
        setIsPromotionDialogOpen(true);
    }

    const handleEditClick = (promo: (typeof promotions)[0]) => {
        setEditingPromotion(promo);
        const [startStr, endStr] = promo.dateRange.split(' - ');
        setStartDate(new Date(startStr));
        setEndDate(new Date(endStr));
        setSelectedPlacements([]); // Assuming placements are not saved in this mock data
        setIsPromotionDialogOpen(true);
    };
    
    const handleTogglePromotionStatus = async (promoId: string) => {
        const current = promotions.find(p => p.id === promoId);
        const nextAction = current?.isActive ? "Pause" : "Activate";
        // Optimistic update
        setPromotions(curr => curr.map(p => p.id === promoId ? { ...p, isActive: !p.isActive } : p));
        try {
            await apiClient<any>(`https://backend.crevings.com/api/promotions/promotions/toggle/${restaurantId}/${promoId}`, {
                method: "PUT",
                body: JSON.stringify({ status: nextAction }),
            });
            toast({ title: `Promotion ${nextAction === 'Activate' ? 'activated' : 'paused'}`, description: `Status updated successfully.` });
            invalidate(["promotions", restaurantId, { page: currentPage, limit: 10 }]);
        } catch (e) {
            // Revert on error
            setPromotions(curr => curr.map(p => p.id === promoId ? { ...p, isActive: current?.isActive ?? false } : p));
            toast({ variant: "destructive", title: "Failed to update status", description: "Please try again." });
        }
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
    
    const handleSubmitDesignRequest = () => {
        toast({
            title: "Request Submitted",
            description: "Our design team will contact you shortly to create your campaign visuals.",
        });
        setIsCrevingsStudioDialogOpen(false);
    };

    const handleLaunchWpCampaign = () => {
        if (!wpCampaignName || !wpBudget) {
            toast({
                title: "Missing Information",
                description: "Please provide a campaign name and budget.",
                variant: "destructive"
            });
            return;
        }
        
        const newPromo = {
            id: `promo-${Date.now()}`,
            title: wpCampaignName,
            status: "Scheduled" as PromotionStatus,
            shortDescription: "Exclusive WhatsApp Offer",
            description: wpDescription || "WhatsApp Campaign",
            type: "Special" as PromotionType,
            value: "WP",
            audience: "All",
            budget: `₹${wpBudget}`,
            dateRange: `${format(new Date(), 'M/d/yyyy')} - ${format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'M/d/yyyy')}`,
            isActive: false,
            usage: 0,
            total: 100, // default
            image: "https://placehold.co/400/300",
            couponCode: `WP${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            objective: "Boost orders"
        };
        
        setPromotions(prev => [newPromo, ...prev]);
        
        toast({
            title: "Campaign Launched!",
            description: `"${wpCampaignName}" is under review and will go live soon.`
        });

        // Reset form and close sheet
        setIsWpCampaignSheetOpen(false);
        setWpCampaignName("");
        setWpDescription("");
        setWpOffer("");
        setWpBudget("");
    };


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
                        <h1 className="text-2xl font-semibold md:text-3xl flex items-center gap-2"><Percent className="h-6 w-6" /> Marketing</h1>
                        <p className="text-muted-foreground">Create and manage your restaurant promotions</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:w-auto">
                        <Button onClick={handleCreateClick} className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" /> Create Promotion
                        </Button>
                        <Button variant="outline" onClick={() => toast({ title: "Coming Soon!", description: "This feature will be available in a future update."})} className="w-full">
                            <WhatsappIcon className="mr-2 h-4 w-4"/> Create WP Campaign
                        </Button>
                        <Button variant="outline" onClick={() => toast({ title: "Coming Soon!", description: "Email campaigns will be available in a future update."})} className="w-full">
                            <Mail className="mr-2 h-4 w-4"/> Create Email Campaign
                        </Button>
                    </div>
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
                                    <SelectItem value="analytics">Analytics</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <TabsList className="hidden sm:grid w-full grid-cols-2 sm:w-auto sm:grid-cols-2">
                            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                            <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                                    <CardTitle className="flex items-center gap-2 text-base"><Wallet className="h-5 w-5" /> Marketing Wallet</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-4xl font-bold flex items-center"><IndianRupee className="h-7 w-7" />{walletBalance.toLocaleString()}</p>
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
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2"><Activity className="h-4 w-4" />Active</div>
                                        <p className="text-3xl font-bold text-green-600">2</p>
                                        <p className="text-xs text-muted-foreground">1 scheduled</p>
                                    </Card>
                                    <Card className="p-3 bg-muted/50">
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2"><MousePointerClick className="h-4 w-4" />CTR</div>
                                        <p className="text-3xl font-bold text-green-600">27.5%</p>
                                        <p className="text-xs text-muted-foreground">7.4k views</p>
                                    </Card>
                                    <Card className="p-3 bg-muted/50">
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2"><CheckCircle2 className="h-4 w-4" />Conversion</div>
                                        <p className="text-3xl font-bold text-green-600">30.7%</p>
                                        <p className="text-xs text-muted-foreground">832 orders</p>
                                    </Card>
                                    <Card className="p-3 bg-muted/50">
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2"><TrendingUp className="h-4 w-4" />Revenue</div>
                                        <p className="text-3xl font-bold text-green-600 flex items-center"><IndianRupee className="h-6 w-6" />11.6K</p>
                                        <p className="text-xs text-muted-foreground">from 832 orders</p>
                                    </Card>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="mt-6">
                            <div className="mb-4">
                                <h2 className="text-xl font-semibold">All Campaigns</h2>
                                <p className="text-muted-foreground text-sm">An overview of all your promotional campaigns.</p>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pageItems.map((promo) => (
                                    <Card
                                    key={promo.id}
                                    className="flex flex-col shadow-sm hover:shadow-lg transition-shadow"
                                    >
                                    <CardContent className="p-4 flex-grow space-y-2">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg pr-4">
                                                {promo.title}
                                            </h3>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "capitalize font-medium text-xs",
                                                    statusBadgeStyles[promo.status]
                                                )}
                                            >
                                                {promo.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {promo.shortDescription}
                                        </p>

                                        <div className="space-y-1 text-sm pt-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-muted-foreground">Offer</span>
                                                <span className="font-semibold text-base text-primary">{promo.value}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-muted-foreground">Budget</span>
                                                <span className="font-semibold">{promo.budget}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-muted-foreground">Expires</span>
                                                <span className="font-semibold">{format(new Date(promo.dateRange.split(' - ')[1]), "MMM d, yyyy")}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-muted-foreground">Coupon</span>
                                                <Badge variant="secondary">{promo.couponCode}</Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-muted/50 p-2 flex justify-end">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                Actions <MoreHorizontal className="ml-2 h-4 w-4" />
                                            </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => handleTogglePromotionStatus(promo.id)}
                                                disabled={promo.status === 'Ended'}
                                            >
                                                {promo.isActive ? (
                                                <PowerOff className="mr-2 h-4 w-4" />
                                                ) : (
                                                <Power className="mr-2 h-4 w-4" />
                                                )}
                                                {promo.isActive ? "Pause" : "Activate"}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleEditClick(promo)}
                                            >
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardFooter>
                                    </Card>
                                ))}
                                {filteredPromotions.length === 0 && (
                                    <div className="text-center py-16 text-muted-foreground col-span-full">
                                        <p>No {activePromotionTab.toLowerCase()} promotions to show.</p>
                                    </div>
                                )}
                            </div>
                            {computedTotalItems > 0 && computedTotalPages > 1 && (
                              <PaginationControls
                                currentPage={currentPage}
                                totalPages={computedTotalPages}
                                onPageChange={setCurrentPage}
                                className="mt-8"
                              />
                            )}
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
                                    <div className="text-xs text-green-500 flex items-center"><ArrowUpRight className="h-4 w-4" />+2.5%</div>
                                    <p className="text-xs text-muted-foreground mt-1">7,485 views, 2,060 clicks</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardDescription>Conversion Rate</CardDescription>
                                    <CardTitle className="text-4xl">30.7%</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xs text-green-500 flex items-center"><ArrowUpRight className="h-4 w-4" />+1.8%</div>
                                    <p className="text-xs text-muted-foreground mt-1">2,060 clicks, 632 conversions</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardDescription>Average Order Value</CardDescription>
                                    <CardTitle className="text-4xl flex items-center"><IndianRupee className="h-7 w-7" />18.35</CardTitle>
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
                                        <Legend />
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
                                                            <span className="flex items-center">Revenue: <IndianRupee className="h-3 w-3 inline-flex mx-0.5" />{promo.revenue.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="font-semibold">{promo.conversionRate}</p>
                                            </div>
                                            {index < topPerformingPromotions.length - 1 && <Separator className="my-4" />}
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
                                            <span className="font-medium flex items-center"><IndianRupee className="h-3 w-3" />{audienceInsightsData.averageSpend.new.toFixed(2)}</span>
                                            <span className="font-medium flex items-center"><IndianRupee className="h-3 w-3" />{audienceInsightsData.averageSpend.returning.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                <Sheet open={isPromotionDialogOpen} onOpenChange={setIsPromotionDialogOpen}>
                    <SheetContent
                        side="bottom"
                        className="sm:max-w-3xl mx-auto p-0 flex flex-col h-full max-h-[90vh]"
                    >
                        <SheetHeader className="p-6 pb-4 border-b">
                            <SheetTitle>{editingPromotion ? 'Edit Promotion' : 'Create Promotion'}</SheetTitle>
                            <SheetDescription>
                                {editingPromotion ? 'Update the details of your promotion.' : 'Fill in the details to create a new promotion.'}
                            </SheetDescription>
                        </SheetHeader>
                        <form className="flex-1 flex flex-col overflow-hidden">
                            <Tabs value={createTab} onValueChange={(v) => setCreateTab(v as any)} className="flex-1 flex flex-col overflow-hidden">
                                <div className="px-6 border-b py-2">
                                    <TabsList className="grid w-full grid-cols-3 h-8">
                                        <TabsTrigger value="basic" className="text-xs px-2 h-6">Basic Info</TabsTrigger>
                                        <TabsTrigger value="targeting" className="text-xs px-2 h-6">Targeting</TabsTrigger>
                                        <TabsTrigger value="preview" className="text-xs px-2 h-6">Preview</TabsTrigger>
                                    </TabsList>
                                </div>
                                <TabsContent value="basic" className="p-6 space-y-4 overflow-y-auto flex-1">
                                    <div className="space-y-2">
                                        <Label htmlFor="promo-name">Campaign Title</Label>
                                        <Input id="promo-name" value={campaignTitle} onChange={(e) => setCampaignTitle(e.target.value)} placeholder="e.g. Weekend Bonanza" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="short-description">Short Description</Label>
                                        <Input 
                                            id="short-description" 
                                            value={shortDescription}
                                            onChange={(e) => setShortDescription(e.target.value)}
                                            placeholder="e.g. Amazing weekend deals!" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="couponCode">Coupon Code</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="couponCode"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                placeholder="e.g. WEEKEND20"
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    const code = `CRV${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
                                                    setCouponCode(code);
                                                }}
                                            >
                                                <Sparkles className="mr-2 h-4 w-4" />
                                                Generate
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ad-budget">Ad Budget</Label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                            id="ad-budget"
                                            type="number"
                                            placeholder="e.g. 500"
                                            className="pl-8"
                                            value={adBudget}
                                            onChange={(e) => setAdBudget(e.target.value === '' ? '' : Number(e.target.value))}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Estimated impressions: <span className="font-semibold text-primary">{impressions.toLocaleString()}</span>
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-base font-semibold">Objective</Label>
                                        <RadioGroup value={objective} onValueChange={setObjective} className="grid grid-cols-1 gap-3">
                                            {[
                                                { value: "boost-orders", label: "Boost orders" },
                                                { value: "promote-dish", label: "Promote new dish/menu" },
                                                { value: "drive-traffic", label: "Drive traffic to outlet" },
                                                { value: "highlight-discounts", label: "Highlight discounts/offers" },
                                                { value: "brand-awareness", label: "Brand awareness" },
                                            ].map(({value, label}) => (
                                                <div key={value} className="flex items-center gap-2 rounded-md border p-3 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                                    <RadioGroupItem value={value} id={`objective-${value}`} />
                                                    <Label htmlFor={`objective-${value}`} className="font-normal flex-1 cursor-pointer">{label}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Select Offer(s)</Label>
                                         <MultiOfferSelect
                                            offers={promotionsData}
                                            selectedOfferIds={selectedOffers}
                                            onSelectionChange={setSelectedOffers}
                                        />
                                        <p className="text-xs text-muted-foreground">Select one or more active offers to use for this promotion. This offer will be used to promote your business.</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Start Date</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !startDate && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>End Date</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        disabled={!startDate}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !endDate && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                    {duration !== null && (
                                        <div className="text-sm text-center text-muted-foreground p-2 bg-muted rounded-md">
                                            Total duration: <span className="font-semibold text-primary">{duration} day{duration !== 1 && 's'}</span>
                                        </div>
                                    )}
                                   <div className="space-y-4">
                                        <Label className="text-base font-semibold">Placement Options</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Choose where your promotion will be displayed. Each placement is an add-on and may affect the cost.
                                        </p>
                                        <div className="space-y-3">
                                            {placementOptions.map((placement) => (
                                                <div key={placement.id} className="flex items-center gap-2 rounded-md border p-3 justify-between">
                                                    <div className="flex items-start gap-3">
                                                        <Checkbox id={placement.id} checked={selectedPlacements.includes(placement.id)} onCheckedChange={() => handlePlacementChange(placement.id)} className="mt-1" />
                                                        <div>
                                                            <Label htmlFor={placement.id} className="text-sm font-medium leading-none">{placement.label}</Label>
                                                            <div className="flex items-center gap-1.5 mt-1.5">
                                                                {placement.tags.map(tag => (
                                                                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold flex items-center"><IndianRupee className="h-3.5 w-3.5" />{placement.cost}</p>
                                                        <p className="text-xs text-muted-foreground">Add-on</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <Card className="bg-muted/50">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Campaign Summary</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3 text-sm">
                                                <div className="flex justify-between">
                                                    <p className="text-muted-foreground">Base Ad Budget</p>
                                                    <p className="font-medium flex items-center"><IndianRupee className="h-3.5 w-3.5 mr-0.5"/>{(typeof adBudget === 'number' ? adBudget : 0).toFixed(2)}</p>
                                                </div>
                                                <div className="flex justify-between">
                                                    <p className="text-muted-foreground">Add-ons Cost</p>
                                                    <p className="font-medium flex items-center"><IndianRupee className="h-3.5 w-3.5 mr-0.5"/>{totalPlacementCost.toFixed(2)}</p>
                                                </div>
                                                <Separator/>
                                                <div className="flex justify-between font-bold text-base">
                                                    <p>Total Payable</p>
                                                    <p className="flex items-center text-primary"><IndianRupee className="h-4 w-4 mr-0.5"/>{finalPayable.toFixed(2)}</p>
                                                </div>
                                            </CardContent>
                                            <CardFooter>
                                                <p className="text-xs text-muted-foreground">Note: The total payable amount will be deducted from your ad wallet. If your wallet has insufficient funds, please add money first.</p>
                                            </CardFooter>
                                        </Card>
                                    </div>
                                </TabsContent>
                                <TabsContent value="targeting" className="p-6 overflow-y-auto flex-1 space-y-6">
                                     <div className="space-y-4">
                                        <Label className="text-base font-semibold">Service</Label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {['Delivery', 'Takeaway', 'Offline Takeaway', 'Dine-in', 'Booking'].map(service => (
                                                <div key={service} className="flex items-center gap-2 rounded-md border p-3">
                                                    <Checkbox 
                                                      id={`service-${service.toLowerCase().replace(' ', '-')}`}
                                                      checked={selectedService === service}
                                                      onCheckedChange={(checked) => { if (checked) setSelectedService(service); }}
                                                    />
                                                    <Label htmlFor={`service-${service.toLowerCase().replace(' ', '-')}`} className="text-sm font-normal">{service}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-base font-semibold">Customer Segment</Label>
                                        <p className="text-sm text-muted-foreground">Choose which customers are eligible for this promotion.</p>
                                        <RadioGroup value={selectedSegment} onValueChange={setSelectedSegment} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                            <div>
                                                <RadioGroupItem value="all" id="target-all" className="peer sr-only" />
                                                <Label htmlFor="target-all" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"> All Customers</Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem value="new" id="target-new" className="peer sr-only" />
                                                <Label htmlFor="target-new" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"> New Customers</Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem value="returning" id="target-returning" className="peer sr-only" />
                                                <Label htmlFor="target-returning" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"> Returning Customers</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    
                                </TabsContent>
                                <TabsContent value="preview" className="p-6 space-y-6 overflow-y-auto flex-1">
                                    <h3 className="font-semibold text-lg">Campaign Summary</h3>
                                    <Card>
                                        <CardContent className="p-4 space-y-4">
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">Campaign Title</p>
                                                <p className="font-semibold">{campaignTitle || "Weekend Bonanza"}</p>
                                            </div>
                                            <Separator />
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">Objective</p>
                                                <p className="font-semibold">{objectiveLabels[objective]}</p>
                                            </div>
                                            <Separator />
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">Duration</p>
                                                <p className="font-semibold">
                                                    {startDate ? format(startDate, "PPP") : "Not set"} - {endDate ? format(endDate, "PPP") : "Not set"} 
                                                    {duration && <span className="text-xs text-muted-foreground"> ({duration} days)</span>}
                                                </p>
                                            </div>
                                            <Separator />
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">Offers</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedOffers.map(id => {
                                                        const offer = promotions.find(p => p.id === id);
                                                        return <Badge key={id} variant="secondary">{offer?.title}</Badge>
                                                    })}
                                                    {selectedOffers.length > 0 && (
                                                        <p className="text-xs text-muted-foreground">Service: {selectedService || 'Not set'} • Segment: {selectedSegment.toUpperCase()}</p>
                                                    )}
                                                    {selectedOffers.length === 0 && <p className="text-sm text-muted-foreground">No offers selected.</p>}
                                                </div>
                                            </div>
                                            <Separator />
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">Placements</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedPlacements.map(id => {
                                                        const placement = placementOptions.find(p => p.id === id);
                                                        return <Badge key={id} variant="outline">{placement?.label}</Badge>
                                                    })}
                                                    {selectedPlacements.length === 0 && <p className="text-sm text-muted-foreground">No placements selected.</p>}
                                                </div>
                                            </div>
                                            <Separator />
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">Total Payable</p>
                                                <p className="font-bold text-xl flex items-center text-primary"><IndianRupee className="h-5 w-5 mr-1" />{finalPayable.toFixed(2)}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </form>
                        <SheetFooter className="border-t p-4 bg-muted/50 flex-shrink-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsPromotionDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="button" 
                                disabled={createTab === 'basic' ? !(campaignTitle && shortDescription && typeof adBudget === 'number' && adBudget > 0 && selectedOffers.length > 0 && startDate && endDate && endDate > startDate) : createTab === 'targeting' ? !(selectedService && selectedSegment) : !(campaignTitle && shortDescription && typeof adBudget === 'number' && adBudget > 0 && selectedOffers.length > 0 && startDate && endDate && endDate > startDate && selectedService && selectedSegment)}
                                onClick={() => {
                                    if (createTab === 'basic') { setCreateTab('targeting'); return; }
                                    if (createTab === 'targeting') { setCreateTab('preview'); return; }
                                    if (editingPromotion) { handleUpdatePromotion(); return; }
                                    handleCreatePromotion();
                                }}
                            >
                                {createTab === 'preview' ? (editingPromotion ? 'Save Changes' : 'Create Promotion') : 'Next'}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
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
                            <AlertDialogAction onClick={confirmPayFromWallet}>Confirm &amp; Pay</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </ProFeatureWrapper>
    )
}