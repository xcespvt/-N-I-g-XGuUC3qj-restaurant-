
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
  Shield,
  User,
  MessageSquare,
  MapPin,
  Image as ImageIcon,
  Mic,
} from "lucide-react";

import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useAppStore } from "@/context/useAppStore";

// import { useGet, usePost } from "@/hooks/useApi";

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


export default function SettingsPage() {
  const { notificationSettings, updateNotificationSetting } = useAppStore();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();
  
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  
  const [email, setEmail] = useState("owner@example.com");
  const [phone, setPhone] = useState("9876543210");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isChangingPhone, setIsChangingPhone] = useState(false);

  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");

  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
  const [isPhoneOtpSent, setIsPhoneOtpSent] = useState(false);

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    setIsDarkMode(isDark);
  };
  
  const handleForgotPassword = () => {
      setIsForgotPassword(true);
      setShowOtpInput(true);
      setIsOtpVerified(false);
      setOtp("");
      toast({
          title: "OTP Sent",
          description: "An OTP has been sent to your registered email address."
      })
  }
  
  const handleVerifyOtp = () => {
      if (otp === '123456') {
          setIsOtpVerified(true);
          toast({
              title: "OTP Verified",
              description: "You can now set your new password.",
          })
      } else {
          toast({
              title: "Invalid OTP",
              description: "The OTP you entered is incorrect.",
              variant: "destructive"
          })
      }
  }

  const handlePasswordUpdate = () => {
    if (isForgotPassword && !isOtpVerified) {
        toast({
            title: "Verification Needed",
            description: "Please verify the OTP before updating your password.",
            variant: "destructive",
        });
        return;
    }
    
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });

    setIsForgotPassword(false);
    setShowOtpInput(false);
    setIsOtpVerified(false);
    setOtp("");
  };

  const handleAccountInfoUpdate = () => {
      let updated = false;
      if (isChangingEmail && isEmailVerified && newEmail) {
          setEmail(newEmail);
          updated = true;
      }
      if (isChangingPhone && isPhoneVerified && newPhone) {
          setPhone(newPhone);
          updated = true;
      }

      if (updated) {
        toast({
            title: "Account Information Updated",
            description: "Your details have been successfully updated."
        })
      }

      // Reset all change states
      setIsChangingEmail(false);
      setIsChangingPhone(false);
      setIsEmailOtpSent(false);
      setIsPhoneOtpSent(false);
      setIsEmailVerified(false);
      setIsPhoneVerified(false);
      setNewEmail("");
      setNewPhone("");
      setEmailOtp("");
      setPhoneOtp("");
  }

  const sendEmailOtp = () => {
    if (newEmail) {
        setIsEmailOtpSent(true);
        toast({ title: "OTP Sent", description: `An OTP has been sent to ${newEmail}.` });
    }
  }

  const verifyEmailOtp = () => {
    if (emailOtp === '123456') {
        setIsEmailVerified(true);
        toast({ title: "Email Verified", description: "Your new email address has been verified." });
    } else {
        toast({ title: "Invalid OTP", variant: "destructive" });
    }
  }
  
  const sendPhoneOtp = () => {
    if (newPhone.length === 10) {
        setIsPhoneOtpSent(true);
        toast({ title: "OTP Sent", description: `An OTP has been sent to ${newPhone}.` });
    }
  }

  const verifyPhoneOtp = () => {
      if (phoneOtp === '123456') {
        setIsPhoneVerified(true);
        toast({ title: "Phone Verified", description: "Your new phone number has been verified." });
    } else {
        toast({ title: "Invalid OTP", variant: "destructive" });
    }
  }


  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/profile"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
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
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Manage your notification preferences
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="notif-new-orders"
                  className="flex flex-col gap-0.5"
                >
                  <span className="font-medium">New Orders</span>
                  <span className="text-xs text-muted-foreground">
                    When new orders arrive
                  </span>
                </Label>
                <Switch
                  id="notif-new-orders"
                  checked={notificationSettings.newOrders}
                  onCheckedChange={(c) =>
                    updateNotificationSetting("newOrders", c)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="notif-payouts"
                  className="flex flex-col gap-0.5"
                >
                  <span className="font-medium">Payouts</span>
                  <span className="text-xs text-muted-foreground">
                    About payouts and earnings
                  </span>
                </Label>
                <Switch
                  id="notif-payouts"
                  checked={notificationSettings.payouts}
                  onCheckedChange={(c) =>
                    updateNotificationSetting("payouts", c)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="notif-promotions"
                  className="flex flex-col gap-0.5"
                >
                  <span className="font-medium">Promotions</span>
                  <span className="text-xs text-muted-foreground">
                    Marketing updates
                  </span>
                </Label>
                <Switch
                  id="notif-promotions"
                  checked={notificationSettings.promotions}
                  onCheckedChange={(c) =>
                    updateNotificationSetting("promotions", c)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="notif-updates"
                  className="flex flex-col gap-0.5"
                >
                  <span className="font-medium">Order Updates</span>
                  <span className="text-xs text-muted-foreground">
                    Status & delivery updates
                  </span>
                </Label>
                <Switch
                  id="notif-updates"
                  checked={notificationSettings.orderUpdates}
                  onCheckedChange={(c) =>
                    updateNotificationSetting("orderUpdates", c)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="notif-reviews"
                  className="flex flex-col gap-0.5"
                >
                  <span className="font-medium">Customer Reviews</span>
                  <span className="text-xs text-muted-foreground">
                    For new customer reviews
                  </span>
                </Label>
                <Switch
                  id="notif-reviews"
                  checked={notificationSettings.customerReviews}
                  onCheckedChange={(c) =>
                    updateNotificationSetting("customerReviews", c)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notif-system" className="flex flex-col gap-0.5">
                  <span className="font-medium">System Updates</span>
                  <span className="text-xs text-muted-foreground">
                    App updates and maintenance
                  </span>
                </Label>
                <Switch
                  id="notif-system"
                  checked={notificationSettings.systemUpdates}
                  onCheckedChange={(c) =>
                    updateNotificationSetting("systemUpdates", c)
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>App Permissions</CardTitle>
                  <CardDescription>
                    Manage permissions for the Crevings app.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="perm-sms" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground"/> SMS
                </Label>
                <Switch id="perm-sms" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="perm-rcs" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground"/> RCS
                </Label>
                <Switch id="perm-rcs" />
              </div>
               <div className="flex items-center justify-between">
                <Label htmlFor="perm-whatsapp" className="flex items-center gap-2">
                  <WhatsappIcon className="h-4 w-4 text-muted-foreground"/> WhatsApp
                </Label>
                <Switch id="perm-whatsapp" defaultChecked/>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="perm-email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground"/> Email
                </Label>
                <Switch id="perm-email" defaultChecked/>
              </div>
               <div className="flex items-center justify-between">
                <Label htmlFor="perm-call" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground"/> Call
                </Label>
                <Switch id="perm-call" />
              </div>
               <div className="flex items-center justify-between">
                <Label htmlFor="perm-location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground"/> Location
                </Label>
                <Switch id="perm-location" defaultChecked/>
              </div>
               <div className="flex items-center justify-between">
                <Label htmlFor="perm-gallery" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-muted-foreground"/> Gallery
                </Label>
                <Switch id="perm-gallery" />
              </div>
               <div className="flex items-center justify-between">
                <Label htmlFor="perm-mic" className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-muted-foreground"/> Mic
                </Label>
                <Switch id="perm-mic" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    For your security, we recommend using a strong password.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isForgotPassword ? (
                <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                     <Button variant="link" size="sm" className="p-0 h-auto text-xs" onClick={handleForgotPassword}>
                        Forgot Password?
                    </Button>
                </div>
              ) : null}
              {showOtpInput && (
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <div className="flex items-center gap-2">
                    <Input id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" disabled={isOtpVerified}/>
                    <Button variant="outline" onClick={handleVerifyOtp} disabled={isOtpVerified}>
                      {isOtpVerified ? "Verified" : "Verify"}
                    </Button>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" disabled={isForgotPassword && !isOtpVerified} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" disabled={isForgotPassword && !isOtpVerified} />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button onClick={handlePasswordUpdate} disabled={isForgotPassword && !isOtpVerified}>Update Password</Button>
               {isForgotPassword && (
                  <Button variant="ghost" onClick={() => { setIsForgotPassword(false); setShowOtpInput(false); }} className="ml-2">
                    Cancel
                  </Button>
                )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Update your registered phone number and email address.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Email Address</Label>
                    {!isChangingEmail ? (
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-muted-foreground">{email}</p>
                            <Button variant="link" onClick={() => setIsChangingEmail(true)}>Change</Button>
                        </div>
                    ) : (
                        <div className="p-4 border rounded-lg space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="new-email">New Email Address</Label>
                                <div className="flex items-center gap-2">
                                    <Input id="new-email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Enter new email" disabled={isEmailOtpSent} />
                                    <Button variant="outline" onClick={sendEmailOtp} disabled={!newEmail || isEmailOtpSent}>Send OTP</Button>
                                </div>
                            </div>
                            {isEmailOtpSent && (
                                <div className="space-y-2">
                                    <Label htmlFor="email-otp">Enter OTP</Label>
                                    <div className="flex items-center gap-2">
                                        <Input id="email-otp" type="text" value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)} placeholder="6-digit OTP" disabled={isEmailVerified} />
                                        <Button variant="outline" onClick={verifyEmailOtp} disabled={!emailOtp || isEmailVerified}>
                                            {isEmailVerified ? 'Verified' : 'Verify'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => setIsChangingEmail(false)}>Cancel</Button>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Phone Number</Label>
                     {!isChangingPhone ? (
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-muted-foreground">{phone}</p>
                            <Button variant="link" onClick={() => setIsChangingPhone(true)}>Change</Button>
                        </div>
                    ) : (
                        <div className="p-4 border rounded-lg space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="new-phone">New Phone Number</Label>
                                <div className="flex items-center gap-2">
                                    <Input id="new-phone" type="tel" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="Enter new phone number" disabled={isPhoneOtpSent} />
                                    <Button variant="outline" onClick={sendPhoneOtp} disabled={!newPhone || isPhoneOtpSent}>Send OTP</Button>
                                </div>
                            </div>
                            {isPhoneOtpSent && (
                                <div className="space-y-2">
                                    <Label htmlFor="phone-otp">Enter OTP</Label>
                                    <div className="flex items-center gap-2">
                                        <Input id="phone-otp" type="text" value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} placeholder="6-digit OTP" disabled={isPhoneVerified} />
                                        <Button variant="outline" onClick={verifyPhoneOtp} disabled={!phoneOtp || isPhoneVerified}>
                                            {isPhoneVerified ? 'Verified' : 'Verify'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => setIsChangingPhone(false)}>Cancel</Button>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button onClick={handleAccountInfoUpdate} disabled={!isChangingEmail && !isChangingPhone}>Update Account Info</Button>
            </CardFooter>
          </Card>

        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Wand2 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>App Theme</CardTitle>
                  <CardDescription>Customize appearance</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  <span>Light / Dark Mode</span>
                  <Moon className="h-4 w-4" />
                </div>
                <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Policies</CardTitle>
                  <CardDescription>Legal & company policies</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" /> Terms & Conditions
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" /> Refund Policy
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" /> Payout Policy
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" /> Privacy Policy
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" /> Food Partner Agreement
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
