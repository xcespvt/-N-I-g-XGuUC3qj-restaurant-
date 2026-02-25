"use client"

import { useState, useEffect } from "react"
import { Bell, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const initialNotifications = [
  {
    id: 1,
    title: "New Order",
    description: "Order #1234 has been placed",
    time: "2 min ago",
  },
  {
    id: 2,
    title: "Low Stock Alert",
    description: "Tomatoes are running low",
    time: "5 min ago",
  },
  {
    id: 3,
    title: "Staff Update",
    description: "John marked as present",
    time: "10 min ago",
  },
];


export function NotificationBell() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications([]);
  };

  const handleDismiss = (id: number) => {
    setNotifications(current => current.filter(n => n.id !== id));
  };

  // Fallback for SSR to prevent hydration mismatch on dynamic Radix IDs
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="relative h-9 w-9">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notifications</span>
      </Button>
    );
  }


  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ring-2 ring-background">
              {notifications.length}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Notifications</h4>
            <Button
              variant="link"
              size="sm"
              className="text-primary h-auto p-0 text-sm"
              onClick={handleMarkAllRead}
              disabled={notifications.length === 0}
            >
              <Check className="mr-1.5 h-4 w-4" />
              Mark all read
            </Button>
          </div>
          <div className="space-y-3">
            {notifications.length > 0 ? notifications.map((notification) => (
              <div key={notification.id} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div>
                  <p className="font-semibold text-sm">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0 -mt-1 -mr-1" onClick={() => handleDismiss(notification.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )) : (
              <div className="text-center text-sm text-muted-foreground py-8">
                You have no new notifications.
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
