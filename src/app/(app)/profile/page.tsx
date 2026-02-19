
"use client"

import {
  Bell,
  ChevronRight,
  FileText,
  HelpCircle,
  Banknote,
  Building2,
  Star,
  Clock,
  CheckCircle,
  Pencil,
  User,
  Sparkles,
  Wrench,
  Mail,
  Phone,
  Share2,
  Store,
  Upload,
  Verified,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { useState, useEffect, useRef, ChangeEvent } from "react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const SettingsCard = ({
  icon,
  label,
  subLabel,
  href,
  triggerDialog,
  className,
  verified,
  iconBgColor = "bg-blue-50",
  iconTextColor = "text-blue-600",
  showArrow
}: {
  icon: React.ElementType
  label: string
  subLabel?: string
  href?: string
  triggerDialog?: boolean
  className?: string
  verified?: boolean
  iconBgColor?: string
  iconTextColor?: string
  showArrow?: boolean
}) => {
  const Icon = icon

  const content = (
    <div className={cn(
      "flex flex-col gap-4 p-5 md:p-7 rounded-[2rem] md:rounded-[2.5rem] border bg-card hover:bg-accent/50 transition-all cursor-pointer h-full relative group",
      className
    )}>
      <div className="flex justify-between items-start">
        <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", iconBgColor, iconTextColor)}>
          <Icon className="h-6 w-6" />
        </div>
        {verified && (
          <div className="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-100">
            Verified
          </div>
        )}
      </div>
      <div>
        <h4 className="font-bold text-lg leading-tight text-foreground">{label}</h4>
        {subLabel && (
          <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest opacity-80 leading-relaxed">
            {subLabel}
          </p>
        )}
      </div>
      {showArrow && <ChevronRight className="absolute bottom-8 right-8 h-4 w-4 text-primary/60 rotate-[-45deg] scale-125 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
    </div>
  )

  if (triggerDialog) {
    return <DialogTrigger asChild>{content}</DialogTrigger>
  }

  if (href) {
    return (
      <Link href={href} className="h-full">
        {content}
      </Link>
    )
  }

  return content
}

const ListItem = ({
  icon,
  label,
  href,
  hasSwitch,
  triggerDialog,
}: {
  icon: React.ElementType
  label: string
  href?: string
  hasSwitch?: boolean
  triggerDialog?: boolean
}) => {
  const Icon = icon
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setIsDarkMode(isDark);
  };

  const content = (
    <div className="flex items-center justify-between w-full p-4 hover:bg-accent rounded-lg transition-colors">
      <div className="flex items-center gap-4">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium">{label}</span>
      </div>
      {hasSwitch ? (
        <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
      ) : (
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      )}
    </div>
  )

  if (triggerDialog) {
    return <DialogTrigger asChild><div className="cursor-pointer">{content}</div></DialogTrigger>;
  }

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    )
  }

  return <div className="cursor-pointer">{content}</div>
}

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


export default function ProfilePage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMediaUploadOpen, setIsMediaUploadOpen] = useState(false);
  const [bannerMedia, setBannerMedia] = useState([
    { type: 'video', src: 'https://cdn.pixabay.com/video/2022/11/07/137593-769730287_large.mp4' }
  ]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    if (bannerMedia.length > 1) {
      const timer = setInterval(() => {
        setCurrentBannerIndex(prev => (prev + 1) % bannerMedia.length);
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(timer);
    }
  }, [bannerMedia]);

  const handleBannerUpload = () => {
    setIsMediaUploadOpen(true);
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newMedia = Array.from(files).map(file => ({
        type: file.type.startsWith('video') ? 'video' : 'image',
        src: URL.createObjectURL(file)
      }));
      setBannerMedia(prev => [...prev, ...newMedia]);
      toast({
        title: "Media Added",
        description: `${files.length} file(s) have been added to your banner.`,
      });
      setIsMediaUploadOpen(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Restaurant</h1>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
      </div>

      <Card className="overflow-hidden  ">
        <CardHeader className="p-0 relative h-[400px]">
          <video
            src="https://www.pexels.com/download/video/5780175/"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover rounded-b-[2rem] bg-card"
          />
          <div className="absolute inset-0" />
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-3 right-3 z-10 rounded-full"
            onClick={handleBannerUpload}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="pt-6 flex flex-col items-center text-center relative -mt-16">
          <div className="relative mb-3">
            <div className="h-28 w-28 rounded-[2rem] border-4 border-background shadow-lg ring-2 ring-background overflow-hidden bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <Store className="h-12 w-12 text-white" />
            </div>
            <div
              style={{ background: "#06bb94ff" }}
              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl flex items-center justify-center border-[6px] border-white text-white shadow-lg"
            >
              <Verified size={18} strokeWidth={3} />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-1">Gourmet Kitchen</h2>

          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Global Outlet Verified
            </span>
          </div>

          <p className="text-sm font-medium text-muted-foreground">ID: GK-992100</p>

          <Separator className="my-4" />

          <div className="grid grid-cols-3 gap-4 w-full">
            <div>
              <p className="font-bold text-lg">1.2k</p>
              <p className="text-xs text-muted-foreground">Orders</p>
            </div>
            <div>
              <p className="font-bold text-lg">98%</p>
              <p className="text-xs text-muted-foreground">Acceptance</p>
            </div>
            <div>
              <p className="font-bold text-lg">6</p>
              <p className="text-xs text-muted-foreground">Months</p>
            </div>
          </div>

          <Button className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white">
            <Pencil className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Performance</h3>
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">Excellent</Badge>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <Card className="p-3 bg-muted/50">
              <Star className="h-6 w-6 text-yellow-400 fill-yellow-400 mx-auto mb-1" />
              <p className="font-bold text-lg">4.8</p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </Card>
            <Card className="p-3 bg-muted/50">
              <Clock className="h-6 w-6 text-blue-500 mx-auto mb-1" />
              <p className="font-bold text-lg">99%</p>
              <p className="text-xs text-muted-foreground">Order Accuracy</p>
            </Card>
            <Card className="p-3 bg-muted/50">
              <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-1" />
              <p className="font-bold text-lg">92%</p>
              <p className="text-xs text-muted-foreground">Acceptance</p>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Dialog>
          <div>
            <h3 className="text-lg font-bold px-1 mb-4 text-green-600">Account Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SettingsCard
                icon={Building2}
                label="Restaurant Information"
                subLabel="OUTLET META & DETAILS"
                href="/profile/restaurant-information"
                className="col-span-1 md:col-span-2"
                verified
                iconBgColor="bg-blue-50 dark:bg-blue-900/20"
                iconTextColor="text-blue-600 dark:text-blue-400"
              />
              <SettingsCard
                icon={User}
                label="Owner Information"
                subLabel="IDENTITY & VERIFICATION"
                href="/profile/owner-information"
                iconBgColor="bg-purple-50 dark:bg-purple-900/20"
                iconTextColor="text-purple-600 dark:text-purple-400"
              />
              <SettingsCard
                icon={Clock}
                label="Operating Hours"
                subLabel="SCHEDULE & TIMINGS"
                href="/profile/operating-hours"
                iconBgColor="bg-orange-50 dark:bg-orange-900/20"
                iconTextColor="text-orange-600 dark:text-orange-400"
              />
              <SettingsCard
                icon={FileText}
                label="Documents"
                subLabel="COMPLIANCE & LEGAL"
                href="/profile/documents"
                iconBgColor="bg-blue-50 dark:bg-blue-900/20"
                iconTextColor="text-blue-600 dark:text-blue-400"
              />
              <SettingsCard
                icon={Banknote}
                label="Bank Account"
                subLabel="PAYMENTS & SETTLEMENTS"
                href="/profile/bank-account"
                showArrow
                iconBgColor="bg-green-50 dark:bg-green-900/20"
                iconTextColor="text-green-600 dark:text-green-400"
              />
              <SettingsCard
                icon={Sparkles}
                label="Facilities"
                subLabel="AMENITIES & INFRASTRUCTURE"
                href="/profile/facilities"
                className="col-span-1 md:col-span-2"
                iconBgColor="bg-blue-50 dark:bg-blue-900/20"
                iconTextColor="text-blue-600 dark:text-blue-400"
              />
              <SettingsCard
                icon={Wrench}
                label="Services"
                subLabel="MAINTENANCE & SUPPORT"
                href="/profile/services"
                iconBgColor="bg-gray-100 dark:bg-gray-800"
                iconTextColor="text-gray-900 dark:text-gray-100"
              />
              <SettingsCard
                icon={Share2}
                label="Relationship Manager"
                subLabel="PARTNER SUCCESS"
                triggerDialog
                iconBgColor="bg-indigo-50 dark:bg-indigo-900/20"
                iconTextColor="text-indigo-600 dark:text-indigo-400"
              />
            </div>
          </div>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Your Relationship Manager</DialogTitle>
              <DialogDescription>Get in touch for any assistance or queries.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="portrait professional" />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-lg">Anjali Mehta</p>
                  <p className="text-sm text-muted-foreground">Senior Partner Success Manager</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <a href="tel:+911234567890">
                  <Button variant="outline" className="w-full">
                    <Phone className="mr-2 h-4 w-4" /> Call
                  </Button>
                </a>
                <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    <WhatsappIcon className="mr-2 h-4 w-4" /> WhatsApp
                  </Button>
                </a>
                <a href="mailto:anjali.mehta@xces.com">
                  <Button variant="outline" className="w-full">
                    <Mail className="mr-2 h-4 w-4" /> Email
                  </Button>
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Card>
          <CardContent className="p-2">
            <ListItem icon={HelpCircle} label="Help & Support" href="/help-support" />
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground mt-1">Version 1.0.0</p>
      </div>
      <Dialog open={isMediaUploadOpen} onOpenChange={setIsMediaUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Banner Media</DialogTitle>
            <DialogDescription>Upload images or videos to display in your profile banner slideshow.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Button onClick={handleUploadClick} className="w-full">
              <Upload className="mr-2 h-4 w-4" /> Choose Files
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
