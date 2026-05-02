
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
  Home,
  ShoppingBag,
  RotateCcw,
  UserCircle,
  PieChart,
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
import { useAppStore } from "@/context/useAppStore";
import { NotificationBell } from "@/components/notification-bell";
import { BottomNav } from "@/components/bottom-nav";
import { Header } from "@/components/Header";
import { ProfileView } from "@/components/ProfileView";
import dynamic from 'next/dynamic';
import { useGet } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const AnalyticsPage = dynamic(() => import('./analytics/page'));
const BookingsPage = dynamic(() => import('./bookings/page'));

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

const OrderHistoryPage = dynamic(() => import('./order-history/page'));
const OrdersPage = dynamic(() => import('./orders/page'));
const ProfilePage = dynamic(() => import('./profile/page'));
const BankAccountPage = dynamic(() => import('./profile/bank-account/page'));
const DocumentsPage = dynamic(() => import('./profile/banners/page'));
const RestaurantInformationPage = dynamic(() => import('./profile/restaurant-information/page'));


const RefundsPage = dynamic(() => import('./refunds/page'));
const SettingsPage = dynamic(() => import('./settings/page'));

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
  const { orders, setBranches, branches } = useAppStore();
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(true);

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
    isOnline?: boolean;
    isRushHour?: boolean;
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
        isOnline: b.isOnline ?? !!b.isActive,
        isRushHour: b.isRushHour ?? false,
        restaurantId: b.branchId || b._id,
        floors: (b as any).floors ?? [],
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

  const navSections = [
    {
      title: "",
      items: [
        { href: "/dashboard", label: "Home", icon: Home },
        {
          href: "/orders",
          label: "Orders",
          icon: ShoppingBag,
          badge: newOrdersCount > 0 ? newOrdersCount.toString() : undefined
        },
        { href: "/refunds", label: "Refunds", icon: RotateCcw },
        { href: "/bookings", label: "Tables", icon: LayoutGrid },
        { href: "/menu", label: "Menu", icon: UtensilsCrossed },
      ]
    },
    {
      title: "Business & Growth",
      items: [
        { href: "/earnings", label: "Payout", icon: Wallet },
      ]
    },
    {
      title: "Management",
      items: [
        { href: "/profile", label: "Customer Info", icon: UserCircle },
        { href: "/analytics", label: "Analytics", icon: PieChart },
      ]
    }
  ];

  const bottomNav = [
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/help-support", label: "Help & Support", icon: HelpCircle },
  ];

  const renderNavItems = (items: (typeof bottomNav[0])[]) => items.map((item) => (
    <SidebarMenuItem key={item.href}>
      <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={item.label}>
        <Link href={item.href}>
          <item.icon className={pathname.startsWith(item.href) ? "text-primary" : "text-muted-foreground"} />
          <span className={pathname.startsWith(item.href) ? "font-semibold text-primary" : ""}>{item.label}</span>

          {(item as any).badge && <span className="ml-auto bg-primary text-white text-xs font-semibold rounded-full px-2 py-0.5">{(item as any).badge}</span>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ));


  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <SidebarHeader className="pt-[env(safe-area-inset-top)] bg-sidebar border-b border-sidebar-border/50">
          <div className="flex items-center gap-3 px-4 py-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Store size={22} className="text-white" />
            </div>
            <span className="text-[20px] font-black text-slate-900 tracking-tight">Crevings</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <div className="flex-1 overflow-y-auto no-scrollbar px-2 py-4">
            {navSections.map((section, index) => (
              <div key={index} className="mb-6">
                {section.title && (
                  <h3 className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {section.title}
                  </h3>
                )}
                <SidebarMenu>
                  {renderNavItems(section.items)}
                </SidebarMenu>
              </div>
            ))}
          </div>
        </SidebarContent>
        <SidebarFooter className="pb-[env(safe-area-inset-bottom)] bg-sidebar p-4 border-t border-sidebar-border/50">
          <SidebarMenu className="mb-2">
            {renderNavItems(bottomNav)}
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip={"Logout"} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50/50">
                <LogOut className="text-rose-500" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <button
            onClick={() => router.push("/profile")}
            className="w-full flex items-center gap-3 px-3 py-3 bg-white rounded-xl hover:bg-white border border-slate-100 transition-all active:scale-[0.98] group mt-2"
          >
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:bg-primary/20 transition-colors text-sm">
              GK
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-bold text-slate-900 truncate">Gourmet Kitchen</p>
              <p className="text-[11px] text-slate-500 font-medium truncate">View Profile</p>
            </div>
          </button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="h-screen flex flex-col overflow-hidden w-full">
        <Header
          title={
            navSections.flatMap(s => s.items).concat(bottomNav).find(item => pathname.startsWith(item.href))?.label || 'Dashboard'
          }
          isOnline={isOnline}
          onToggleOnline={() => setIsOnline(!isOnline)}
          onProfileClick={() => setIsProfileModalOpen(true)}
          onNotificationClick={() => { }}
          hideProfileAndNotificationOnMobile={pathname.startsWith('/profile/') && pathname !== '/profile'}
        />

        <ProfileView
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 no-scrollbar">
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
