"use client";

import {
  Bell,
  ChevronRight,
  FileText,
  HelpCircle,
  LifeBuoy,
  Lock,
  LogOut,
  Mail,
  Moon,
  Phone,
  Settings as SettingsIcon,
  Sun,
  Wand2,
  ArrowLeft,
} from "lucide-react";

import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";

import { useGet, usePost } from "@/hooks/useApi";
export default function SettingsPage() {
  const { notificationSettings, updateNotificationSetting } = useAppContext();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    setIsDarkMode(isDark);
  };

  const handlePasswordUpdate = () => {
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Link href="/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
          <ArrowLeft className="h-4 w-4"/>
          Back to Profile
        </Link>
      <h1 className="text-2xl font-semibold md:text-3xl flex items-center gap-2">
        <SettingsIcon className="h-6 w-6" /> Settings
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary"><Bell className="h-5 w-5"/></div>
                    <div>
                        <CardTitle>Notification Settings</CardTitle>
                        <CardDescription>Manage your notification preferences</CardDescription>
                    </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                    <Label htmlFor="notif-new-orders" className="flex flex-col gap-0.5">
                        <span className="font-medium">New Orders</span>
                        <span className="text-xs text-muted-foreground">When new orders arrive</span>
                    </Label>
                    <Switch id="notif-new-orders" checked={notificationSettings.newOrders} onCheckedChange={(c) => updateNotificationSetting('newOrders', c)} />
                 </div>
                 <div className="flex items-center justify-between">
                    <Label htmlFor="notif-payouts" className="flex flex-col gap-0.5">
                        <span className="font-medium">Payouts</span>
                        <span className="text-xs text-muted-foreground">About payouts and earnings</span>
                    </Label>
                    <Switch id="notif-payouts" checked={notificationSettings.payouts} onCheckedChange={(c) => updateNotificationSetting('payouts', c)} />
                 </div>
                 <div className="flex items-center justify-between">
                     <Label htmlFor="notif-promotions" className="flex flex-col gap-0.5">
                        <span className="font-medium">Promotions</span>
                        <span className="text-xs text-muted-foreground">Marketing updates</span>
                    </Label>
                    <Switch id="notif-promotions" checked={notificationSettings.promotions} onCheckedChange={(c) => updateNotificationSetting('promotions', c)} />
                 </div>
                 <Separator />
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notif-updates" className="flex flex-col gap-0.5">
                        <span className="font-medium">Order Updates</span>
                        <span className="text-xs text-muted-foreground">Status & delivery updates</span>
                    </Label>
                    <Switch id="notif-updates" checked={notificationSettings.orderUpdates} onCheckedChange={(c) => updateNotificationSetting('orderUpdates', c)} />
                 </div>
                 <div className="flex items-center justify-between">
                    <Label htmlFor="notif-reviews" className="flex flex-col gap-0.5">
                        <span className="font-medium">Customer Reviews</span>
                        <span className="text-xs text-muted-foreground">For new customer reviews</span>
                    </Label>
                    <Switch id="notif-reviews" checked={notificationSettings.customerReviews} onCheckedChange={(c) => updateNotificationSetting('customerReviews', c)} />
                 </div>
                 <div className="flex items-center justify-between">
                    <Label htmlFor="notif-system" className="flex flex-col gap-0.5">
                        <span className="font-medium">System Updates</span>
                        <span className="text-xs text-muted-foreground">App updates and maintenance</span>
                    </Label>
                    <Switch id="notif-system" checked={notificationSettings.systemUpdates} onCheckedChange={(c) => updateNotificationSetting('systemUpdates', c)} />
                 </div>
              </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary"><Lock className="h-5 w-5"/></div>
                    <div>
                        <CardTitle>Account Security</CardTitle>
                        <CardDescription>Manage your account security</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Change Password</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                <Button className="mt-4" onClick={handlePasswordUpdate}>Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
             <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary"><Wand2 className="h-5 w-5"/></div>
                    <div>
                        <CardTitle>App Theme</CardTitle>
                        <CardDescription>Customize appearance</CardDescription>
                    </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4"/>
                        <span>Light / Dark Mode</span>
                        <Moon className="h-4 w-4"/>
                    </div>
                    <Switch checked={isDarkMode} onCheckedChange={toggleTheme}/>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary"><HelpCircle className="h-5 w-5"/></div>
                    <div>
                        <CardTitle>Help & Support</CardTitle>
                        <CardDescription>Get assistance</CardDescription>
                    </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                 <Link href="/help-support" className="w-full">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                        <LifeBuoy className="h-4 w-4"/>
                        FAQs & Help
                    </Button>
                 </Link>
                 <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => toast({ title: "Contacting Support", description: "Email client opened."})}>
                    <Mail className="h-4 w-4"/>
                    Contact Support
                 </Button>
                 <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => toast({ title: "Contacting Support", description: "Calling support..."})}>
                    <Phone className="h-4 w-4"/>
                    Call Support
                 </Button>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
