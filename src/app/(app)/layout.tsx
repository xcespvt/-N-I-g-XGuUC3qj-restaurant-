
"use client";

import * as React from "react"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { AppProvider, useAppContext } from "@/context/AppContext";
import { NotificationBell } from "@/components/notification-bell";
import { BottomNav } from "@/components/bottom-nav";
import dynamic from 'next/dynamic';

const AnalyticsPage = dynamic(() => import('./analytics/page'));
const BookingsPage = dynamic(() => import('./bookings/page'));
const BranchesPage = dynamic(() => import('./branches/page'));
const DashboardPage = dynamic(() => import('./dashboard/page'));
const DineInTakeawayPage = dynamic(() => import('./dine-in-takeaway/page'));
const EarningsPage = dynamic(() => import('./earnings/page'));
const FeedbackPage = dynamic(() => import('./feedback/page'));
const HelpSupportPage = dynamic(() => import('./help-support/page'));
const CommunityForumPage = dynamic(() => import('./help-support/community-forum/page'));
const KnowledgeBasePage = dynamic(() => import('./help-support/knowledge-base/page'));
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
  const { subscriptionPlan, orders } = useAppContext();

  const newOrdersCount = orders.filter(o => o.status === "New").length;

  // const navGroups = [
  //   [
  //     { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  //     { href: "/orders", label: "Orders", icon: Package, badge: newOrdersCount > 0 ? newOrdersCount.toString() : undefined },
  //     { href: "/order-history", label: "Order History", icon: History },
  //     { href: "/earnings", label: "Earnings", icon: Wallet },
  //     { href: "/refunds", label: "Refunds", icon: Receipt },
  //     { href: "/menu", label: "Menu", icon: BookOpen },
  //   ],
  //   [
  //     { href: "/profile", label: "Profile", icon: User },
  //     { href: "/promotions", label: "Marketing", icon: Percent, pro: true },
  //     { href: "/offers", label: "Offers", icon: Gift, pro: true },
  //     { href: "/analytics", label: "Analytics", icon: BarChart3, pro: true },
  //   ],
  //   [
  //     { href: "/bookings", label: "Table Management", icon: CalendarDays },
  //     { href: "/staff", label: "Staff", icon: Users },
  //     { href: "/feedback", label: "Feedback", icon: MessageSquare },
  //   ],
  //   [
  //     { href: "/store", label: "Store", icon: ShoppingCart },
  //     { href: "/order-tracking", label: "Track Order", icon: Truck },
  //   ],
  //   [
  //     { href: "/subscription", label: "Subscription", icon: Star },
  //     { href: "/branches", label: "Branches", icon: GitFork, pro: true },
  //   ],
  // ];
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
      { href: "/track-order", label: "Track Order", icon: PackageSearch },
      { href: "/refunds", label: "Refunds", icon: RefreshCw }
    ],

    // 💰 Finance
    [
      { href: "/earnings", label: "Earnings", icon: Wallet },
      { href: "/subscription", label: "Subscription", icon: CreditCard }
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
      { href: "/staff", label: "Staff", icon: Users },
      { href: "/feedback", label: "Feedback", icon: MessageSquare }
    ],

    // 🏪 Store
    [
      { href: "/branches", label: "Branches", icon: Store }
    ],

    // 👤 Profile
    [
      { href: "/profile", label: "My Profile", icon: User },
      { href: "/settings", label: "Settings", icon: Settings }
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
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <span className="truncate text-lg font-semibold">Crevings</span>
            {subscriptionPlan === 'Pro' && (
              <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-400 to-rose-400 px-2.5 py-1 text-xs font-semibold text-white shadow-md">
                <Flame className="h-3 w-3" />
                <span>Pro</span>
              </div>
            )}
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
        <SidebarFooter>
          <SidebarSeparator />
          <SidebarMenu>
            {renderNavItems(bottomNav)}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="hidden md:block">
            <BranchSwitcher />
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <NotificationBell />
          </div>
        </header>
        <main className="flex-1 p-4 sm:px-6 pb-20 md:pb-6">
          <div className="md:hidden mb-4">
            {pathname === '/dashboard' && <BranchSwitcher />}
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
  return (
    <AppProvider>
      <AppLayoutClient>{children}</AppLayoutClient>
    </AppProvider>
  )
}
