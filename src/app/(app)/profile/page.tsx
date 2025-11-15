
"use client"

import {
  Bell,
  ChevronRight,
  FileText,
  HelpCircle,
  LogOut,
  MessageSquare,
  Banknote,
  Building2,
  Settings,
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
  Camera,
  PlusCircle,
  Upload,
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
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Input } from "@/components/ui/input"

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
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMediaUploadOpen, setIsMediaUploadOpen] = useState(false);
  const [bannerMedia, setBannerMedia] = useState([
    { type: 'image', src: 'https://picsum.photos/seed/restaurant-banner/800/300' }
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

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push("/");
  };
  
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

      <Card className="overflow-hidden">
        <CardHeader className="p-0 relative h-48 bg-muted">
            {bannerMedia.map((media, index) => (
                <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBannerIndex ? 'opacity-100' : 'opacity-0'}`}>
                    {media.type === 'image' ? (
                         <Image 
                            src={media.src}
                            alt="Restaurant banner"
                            fill
                            className="object-cover"
                            data-ai-hint="restaurant interior"
                        />
                    ) : (
                        <video
                            src={media.src}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
            ))}
             <div className="absolute inset-0 bg-black/20"/>
            <Button variant="secondary" size="sm" className="absolute bottom-3 right-3 z-10" onClick={handleBannerUpload}>
                <PlusCircle className="h-4 w-4 mr-2"/>
                Add Media
            </Button>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col items-center text-center relative -mt-12">
          <Avatar className="h-24 w-24 mb-4 border-4 border-background shadow-md">
            <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="logo abstract" />
            <AvatarFallback>GK</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">The Gourmet Kitchen</h2>
          <p className="text-sm text-muted-foreground">contact@gourmetkitchen.com</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold">4.8</span>
          </div>
          
          <Separator className="my-4"/>

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
                    <Star className="h-6 w-6 text-yellow-400 fill-yellow-400 mx-auto mb-1"/>
                    <p className="font-bold text-lg">4.8</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                </Card>
                 <Card className="p-3 bg-muted/50">
                    <Clock className="h-6 w-6 text-blue-500 mx-auto mb-1"/>
                    <p className="font-bold text-lg">99%</p>
                    <p className="text-xs text-muted-foreground">Order Accuracy</p>
                </Card>
                 <Card className="p-3 bg-muted/50">
                    <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-1"/>
                    <p className="font-bold text-lg">92%</p>
                    <p className="text-xs text-muted-foreground">Acceptance</p>
                </Card>
            </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <Dialog>
            <Card>
                <CardContent className="p-2 space-y-1">
                    <p className="text-sm font-semibold px-4 pt-2 text-green-600">Account Settings</p>
                    <ListItem icon={Building2} label="Restaurant Information" href="/profile/restaurant-information" />
                    <ListItem icon={User} label="Owner Information" href="/profile/owner-information" />
                    <ListItem icon={Clock} label="Operating Hours" href="/profile/operating-hours" />
                    <ListItem icon={FileText} label="Documents" href="/profile/documents" />
                    <ListItem icon={Banknote} label="Bank Account" href="/profile/bank-account" />
                    <ListItem icon={Sparkles} label="Facilities" href="/profile/facilities" />
                    <ListItem icon={Wrench} label="Services" href="/profile/services" />
                    <ListItem icon={Share2} label="Relationship Manager" triggerDialog />
                </CardContent>
            </Card>
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
        <Button variant="ghost" className="text-destructive" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
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
