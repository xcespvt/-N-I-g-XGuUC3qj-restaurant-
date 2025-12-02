
"use client";

import * as React from "react"
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Coffee,
  Flame,
  GitFork,
  Gift,
  HelpCircle,
  History,
  LayoutGrid,
  Lock,
  MapPin,
  MessageSquare,
  Package,
  PackageSearch,
  RefreshCw,
  CreditCard,
  Utensils,
  Tag,
  Megaphone,
  BarChart2,
  Table,
  Users,
  Store,
  Percent,
  Receipt,
  Settings,
  LogOut,
  ShoppingCart,
  Star,
  Truck,
  User,
  UtensilsCrossed,
  Wallet,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { ThemeToggle } from "@/components/theme-toggle";
import { BranchSwitcher } from "@/components/branch-switcher";
import { useAppStore } from "@/context/useAppStore";
import { NotificationBell } from "@/components/notification-bell";
import { BottomNav } from "@/components/bottom-nav";
import dynamic from 'next/dynamic';
import { useGet } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const AnalyticsPage = dynamic(() => import('./analytics/page'));
const BookingsPage = dynamic(() => import('./bookings/page'));
const BranchesPage = dynamic(() => import('./branches/page'));
const DashboardPage = dynamic(() => import('./dashboard/page'));
const DineInTakeawayPage = dynamic(() => import('./dine-in-takeaway/page'));
const EarningsPage = dynamic(() => import('./earnings/page'));
const WithdrawPage = dynamic(() => import('./earnings/withdraw/page'));
const FeedbackPage = dynamic(() => import('./feedback/page'));
const HelpSupportPage = dynamic(() => import('./help-support/page'));
const CommunityForumPage = dynamic(() => import('./help-support/community-forum/page'));
const KnowledgeBasePage = dynamic(() => import('./help-support/knowledge-base/page'));
const ChatPage = dynamic(() => import('./help-support/chat/page'));
const MenuPage = dynamic(() => import('./menu/page'));
const OffersPage = dynamic(() => import('./offers/page'));
const OrderHistoryPage = dynamic(() => import('./order-history/page'));
const OrdersPage = dynamic(() => import('./orders/page'));
const ProfilePage = dynamic(() => import('./profile/page'));
const BankAccountPage = dynamic(() => import('./profile/bank-account/page'));
const DocumentsPage = dynamic(() => import('./profile/documents/page'));
const RestaurantInformationPage = dynamic(() => import('./profile/restaurant-information/page'));
const FacilitiesPage = dynamic(() => import('./profile/facilities/page'));
const PromotionsPage = dynamic(() => import('./promotions/page'));
const RefundsPage = dynamic(() => import('./refunds/page'));
const SettingsPage = dynamic(() => import('./settings/page'));
const StaffPage = dynamic(() => import('./staff/page'));
const SubscriptionPage = dynamic(() => import('./subscription/page'));
const CheckoutPage = dynamic(() => import('./subscription/checkout/page'));
const TakeawayPage = dynamic(() => import('./takeaway/page'));
const StorePage = dynamic(() => import('./store/page'));
const OrderTrackingPage = dynamic(() => import('./order-tracking/page'));
const ServicesPage = dynamic(() => import('./profile/services/page'));
const OwnerInformationPage = dynamic(() => import('./profile/owner-information/page'));


function AppLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const { toast } = useToast();
  const router = useRouter();
  const { subscriptionPlan, orders, setBranches } = useAppStore();

  type ApiBranch = {
    _id: string;
    branchId?: string;
    name: string;
    cuisineType?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
      coordinates?: number[];
    };
    contact?: {
      phone?: string;
      email?: string;
      website?: string;
    };
    operatingHours?: Record<string, { open?: string; close?: string }>;
    isActive?: boolean;
  };

  const { data: apiBranchesData } = useGet<{
    success: boolean;
    message: string;
    data: ApiBranch[];
  }>(
    ["branches", "main"],
    "/api/branches/mainbranch",
    undefined,
    { enabled: true }
  );

  React.useEffect(() => {
    if (apiBranchesData?.success && Array.isArray(apiBranchesData.data)) {
      const mapped = apiBranchesData.data.map((b) => ({
        id: b.branchId || b._id,
        name: b.name,
        address: b.address?.street ?? "",
        city: b.address?.city ?? "",
        pincode: b.address?.postalCode ?? "",
        manager: "Branch Manager",
        managerPhone: b.contact?.phone ?? "",
        hours: "See schedule",
        ordersToday: 0,
        status: b.isActive ? ("Active" as const) : ("Inactive" as const),
        isOnline: !!b.isActive,
        restaurantId: b.branchId || b._id,
      }));
      setBranches(mapped);
    }
  }, [apiBranchesData, setBranches]);

  const newOrdersCount = orders.filter(o => o.status === "New").length;

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  const handleLogout = React.useCallback(async () => {
    try {
      // Ask backend to clear the auth cookie
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch { }
    finally {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.replace("/");
    }
  }, [router, toast]);

  const navGroups = [
    // 📊 Dashboard
    [
      { href: "/dashboard", label: "Overview", icon: LayoutGrid }
    ],

    // 📦 Orders
    [
      {
        href: "/orders",
        label: "Active Orders",
        icon: Package,
        badge: newOrdersCount > 0 ? newOrdersCount.toString() : undefined
      },
      { href: "/order-history", label: "Order History", icon: History },
      // { href: "/order-tracking", label: "Track Order", icon: PackageSearch },
      { href: "/refunds", label: "Refunds", icon: RefreshCw }
    ],

    // 💰 Finance
    [
      { href: "/earnings", label: "Earnings", icon: Wallet },
      // { href: "/subscription", label: "Subscription", icon: CreditCard }
    ],

    // 🍽️ Menu Management
    [
      { href: "/menu", label: "Menu", icon: Utensils },
      { href: "/offers", label: "Offers", icon: Tag },
      { href: "/promotions", label: "Marketing", icon: Megaphone }
    ],

    // 📈 Analytics
    [
      { href: "/analytics", label: "Analytics", icon: BarChart3, pro: true },
    ],

    // 🛠️ Operations
    [
      { href: "/bookings", label: "Table Management", icon: Table },
      // { href: "/staff", label: "Staff", icon: Users },
      { href: "/feedback", label: "Feedback", icon: MessageSquare }
    ],

    // 🏪 Store
    [
      { href: "/branches", label: "Branches", icon: Store }
    ],

    // 👤 Profile
    [
      { href: "/profile", label: "My Profile", icon: User },
      // { href: "/settings", label: "Settings", icon: Settings }
    ]
  ];
  const bottomNav = [
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/help-support", label: "Help & Support", icon: HelpCircle },
  ];

  const renderNavItems = (items: (typeof bottomNav[0])[]) => items.map((item) => (
    <SidebarMenuItem key={item.href}>
      <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={item.label}>
        <Link href={item.href}>
          <item.icon />
          <span>{item.label}</span>
          {subscriptionPlan === 'Free' && (item as any).pro && <Lock className="ml-auto h-3.5 w-3.5 text-muted-foreground" />}
          {(item as any).badge && <span className="ml-auto bg-primary text-white text-xs font-semibold rounded-full px-2 py-0.5">{(item as any).badge}</span>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ));


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="pt-[env(safe-area-inset-top)] bg-sidebar">
          <div className="flex items-center gap-2 p-2">
            <img src="/Image/CREVINGS FULL LOGO.Svg" alt="Crevings" className="h-32 w-auto mx-auto" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navGroups.map((group, index) => (
              <React.Fragment key={index}>
                {renderNavItems(group)}
                {index < navGroups.length - 1 && <SidebarSeparator />}
              </React.Fragment>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="pb-[env(safe-area-inset-bottom)] bg-sidebar">
          <SidebarSeparator />
          <SidebarMenu>
            {renderNavItems(bottomNav)}
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip={"Logout"}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {/* 3. FIXED: The Main Header fix from the previous step */}
        <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-sm pt-[env(safe-area-inset-top)]">
          <div className="flex h-16 items-center gap-2 px-4 sm:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="hidden md:block">
              <BranchSwitcher />
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-1 sm:gap-2">
              <ThemeToggle />
              <NotificationBell />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:px-6 pb-20 md:pb-6">
          <div className="md:hidden mb-4">
            <BranchSwitcher />
          </div>
          {children}
        </main>
      </SidebarInset>
      <BottomNav />
    </SidebarProvider>
  )
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AppLayoutClient>{children}</AppLayoutClient>

      {/* ✅ Optional Devtools for debugging */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
