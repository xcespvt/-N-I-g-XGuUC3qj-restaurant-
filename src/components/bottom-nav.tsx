
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Package, TrendingUp, BookOpen, User, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/context/useAppStore';

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutGrid },
  { href: "/orders", label: "Orders", icon: Package },
  { href: "/earnings", label: "Earnings", icon: TrendingUp },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { orders } = useAppStore();
  const newOrdersCount = orders.filter(o => o.status === "New").length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-background border-t z-40">
      <div className="flex justify-around items-stretch h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/");
          return (
            <Link key={item.href} href={item.href} className={cn(
                "flex flex-col items-center justify-center text-xs flex-1 h-full pt-2 pb-1 gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}>
              <div className="relative">
                <item.icon className="h-6 w-6" />
                {item.label === "Orders" && newOrdersCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {newOrdersCount}
                  </span>
                )}
              </div>
              <span className="font-medium text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
