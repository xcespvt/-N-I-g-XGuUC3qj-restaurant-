
"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MessageSquare, ThumbsUp, Download, Search, Filter, ArrowUpDown, Reply, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Image from "next/image"
import { useAppContext } from "@/context/AppContext"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"

const StarRating = ({ rating, className = "" }: { rating: number, className?: string }) => (
  <div className={`flex items-center ${className}`}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ))}
  </div>
)

const ItemRating = ({ rating, className = "" }: { rating: number, className?: string }) => (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
)


export default function FeedbackPage() {
  const { feedback, addReplyToFeedback } = useAppContext();
  const { toast } = useToast();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  const [filters, setFilters] = useState({
    rating: "all",
    orderTypes: [] as string[],
  });
  
  const [tempFilters, setTempFilters] = useState(filters);
  const [sortBy, setSortBy] = useState("date");
  
  useEffect(() => {
    if (isFilterDialogOpen) {
      setTempFilters(filters);
    }
  }, [isFilterDialogOpen, filters]);

  const handleExport = () => {
    toast({
      title: "Exporting Feedback",
      description: "Your feedback report is being generated and will be downloaded shortly.",
    });
  };
  
  const displayedFeedback = useMemo(() => {
    const filtered = feedback.filter(item => {
      const ratingMatch = filters.rating === "all" || item.rating === parseInt(filters.rating, 10);
      const orderTypeMatch = filters.orderTypes.length === 0 || filters.orderTypes.includes(item.orderType);
      const tabMatch = activeTab === "all" || (activeTab === "needs-reply" && !item.replied) || (activeTab === "replied" && item.replied);
      return ratingMatch && orderTypeMatch && tabMatch;
    });

    const sorted = [...filtered];
    if (sortBy === 'rating_high') {
        sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'rating_low') {
        sorted.sort((a, b) => a.rating - b.rating);
    } else { // 'date'
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return sorted;
  }, [feedback, filters, sortBy, activeTab]);


  const handleReplySubmit = (feedbackId: string) => {
    if (replyText.trim()) {
        addReplyToFeedback(feedbackId, replyText);
        setReplyText("");
        setReplyingTo(null);
    }
  }
  
  const handleReplyClick = (feedbackId: string) => {
    setReplyingTo(feedbackId);
    setReplyText("");
  }
  
  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setIsFilterDialogOpen(false);
  };
  
  const handleClearFilters = () => {
    const defaultFilters = { rating: "all", orderTypes: [] as string[] };
    setTempFilters(defaultFilters);
    setFilters(defaultFilters);
    setIsFilterDialogOpen(false);
  };
  
  const handleOrderTypeChange = (type: string, checked: boolean) => {
    setTempFilters(prev => {
      const newOrderTypes = checked
        ? [...prev.orderTypes, type]
        : prev.orderTypes.filter(t => t !== type);
      return { ...prev, orderTypes: newOrderTypes };
    });
  };

  const renderFeedbackList = (data: typeof feedback) => {
    if (data.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>No reviews to show in this category.</p>
            </div>
        )
    }
    return (
        <div className="divide-y">
        {data.map((feedbackItem) => (
            <div key={feedbackItem.id} className="p-4 sm:p-6">
                <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={feedbackItem.customer.avatar} />
                        <AvatarFallback>{feedbackItem.customer.fallback}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3 flex-wrap">
                                <p className="font-semibold">{feedbackItem.customer.name}</p>
                                <Badge variant="outline">{feedbackItem.customer.orderCount} orders</Badge>
                                <Badge variant="secondary" className={feedbackItem.orderType === 'Delivery' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'}>{feedbackItem.orderType}</Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-1 sm:mt-0">
                                <div className="flex items-center gap-1">
                                    <StarRating rating={feedbackItem.rating} />
                                    <span className="font-bold text-sm ml-1">{feedbackItem.rating.toFixed(1)}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{feedbackItem.date}</p>
                            </div>
                        </div>
                        
                         {feedbackItem.items.length > 0 && (
                            <div className="mt-3 space-y-1.5">
                                {feedbackItem.items.map(item => (
                                    <div key={item} className="flex justify-between items-center text-sm">
                                        <p className="text-muted-foreground">{item}</p>
                                        <ItemRating rating={feedbackItem.rating} />
                                    </div>
                                ))}
                            </div>
                        )}

                        <p className="mt-3 text-sm text-foreground">{feedbackItem.comment}</p>
                       
                        {feedbackItem.photos.length > 0 && (
                            <div className="mt-3">
                                <p className="text-sm font-medium mb-2">Customer Photos</p>
                                <div className="flex gap-2">
                                    {feedbackItem.photos.map((photo, i) => (
                                        <Image key={i} src={photo.url} alt="Customer photo" data-ai-hint={photo.hint} width={80} height={80} className="rounded-lg object-cover" />
                                    ))}
                                </div>
                            </div>
                        )}
                         <div className="mt-4">
                            {feedbackItem.replied ? (
                                <div className="bg-muted p-4 rounded-lg">
                                    <p className="text-sm font-semibold">Your reply:</p>
                                    <p className="text-sm text-muted-foreground">{feedbackItem.reply}</p>
                                </div>
                            ) : (
                                replyingTo === feedbackItem.id ? (
                                    <div className="space-y-2">
                                        <Textarea 
                                            placeholder="Write your reply..." 
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                        />
                                        <div className="flex gap-2">
                                            <Button onClick={() => handleReplySubmit(feedbackItem.id)}>
                                                <Send className="mr-2 h-4 w-4"/> Submit Reply
                                            </Button>
                                            <Button variant="ghost" onClick={() => setReplyingTo(null)}>Cancel</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <Button variant="ghost" className="w-full sm:w-auto text-primary" onClick={() => handleReplyClick(feedbackItem.id)}>
                                        <Reply className="mr-2 h-4 w-4"/> Reply to Review
                                    </Button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         <Card className="bg-green-600 text-white flex flex-col">
            <CardHeader>
                <CardTitle className="text-sm font-normal text-white/80">Average Rating</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="text-4xl font-bold flex items-center gap-2">4.2 <Star className="h-6 w-6 text-white"/></div>
                <p className="text-xs text-white/80 mt-1">From 128 reviews</p>
            </CardContent>
        </Card>
         <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="text-sm font-normal text-muted-foreground flex items-center justify-between">
                  <span>5 Star Reviews</span>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-3xl font-bold">68</p>
                <Progress value={68/128 * 100} className="h-1.5 mt-1" />
            </CardContent>
        </Card>
        <Card className="flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-normal text-muted-foreground flex items-center justify-between">
                    <span>Response Rate</span>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="text-3xl font-bold">87%</div>
                <p className="text-xs text-green-500">+5% from last month</p>
            </CardContent>
        </Card>
        <Card className="flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-normal text-muted-foreground flex items-center justify-between">
                    <span>Satisfaction</span>
                    <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="text-3xl font-bold">92%</div>
                <p className="text-xs text-green-500">+3% from last month</p>
            </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by customer, comment, or dish..." className="pl-9 bg-muted border-none" />
                </div>
                <div className="flex items-center gap-2">
                    <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline"><Filter className="mr-2 h-4 w-4"/>Filter</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Filter Feedback</DialogTitle>
                                <DialogDescription>
                                Refine the feedback list based on your criteria.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-4">
                                <div className="space-y-3">
                                    <Label>Rating</Label>
                                    <RadioGroup value={tempFilters.rating} onValueChange={(value) => setTempFilters(prev => ({...prev, rating: value}))} className="flex flex-wrap gap-2">
                                        <Label htmlFor="rating-all" className="flex items-center gap-2 rounded-full border px-3 py-1 cursor-pointer hover:bg-accent has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                            <RadioGroupItem value="all" id="rating-all" /> All
                                        </Label>
                                        {[5, 4, 3, 2, 1].map(r => (
                                            <Label key={r} htmlFor={`rating-${r}`} className="flex items-center gap-2 rounded-full border px-3 py-1 cursor-pointer hover:bg-accent has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                                <RadioGroupItem value={r.toString()} id={`rating-${r}`}/> {r} <Star className="h-4 w-4 text-yellow-400 fill-yellow-400"/>
                                            </Label>
                                        ))}
                                    </RadioGroup>
                                </div>
                                <div className="space-y-3">
                                    <Label>Order Type</Label>
                                    <div className="flex gap-4">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="type-delivery" checked={tempFilters.orderTypes.includes('Delivery')} onCheckedChange={(checked) => handleOrderTypeChange('Delivery', !!checked)} />
                                            <Label htmlFor="type-delivery">Delivery</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="type-dinein" checked={tempFilters.orderTypes.includes('Dine-in')} onCheckedChange={(checked) => handleOrderTypeChange('Dine-in', !!checked)} />
                                            <Label htmlFor="type-dinein">Dine-in</Label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="ghost" onClick={handleClearFilters}>Clear Filters</Button>
                                <Button onClick={handleApplyFilters}>Apply Filters</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                     <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="date">Sort by Date</SelectItem>
                            <SelectItem value="rating_high">Highest Rating</SelectItem>
                            <SelectItem value="rating_low">Lowest Rating</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </CardHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="sm:hidden p-4 border-b">
                <Select value={activeTab} onValueChange={setActiveTab}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select view"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Reviews</SelectItem>
                        <SelectItem value="needs-reply">Needs Reply</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="hidden sm:block">
                <ScrollArea className="w-full whitespace-nowrap border-b">
                    <TabsList className="w-max justify-start rounded-none bg-transparent p-0">
                        <TabsTrigger value="all" className="bg-transparent shadow-none px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary">All Reviews</TabsTrigger>
                        <TabsTrigger value="needs-reply" className="bg-transparent shadow-none px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary">Needs Reply</TabsTrigger>
                        <TabsTrigger value="replied" className="bg-transparent shadow-none px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary">Replied</TabsTrigger>
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>

            <TabsContent value="all" className="p-0">
                {renderFeedbackList(displayedFeedback.filter(f => activeTab === 'all'))}
            </TabsContent>
            <TabsContent value="needs-reply" className="p-0">
                {renderFeedbackList(displayedFeedback.filter(f => !f.replied))}
            </TabsContent>
            <TabsContent value="replied" className="p-0">
                {renderFeedbackList(displayedFeedback.filter(f => f.replied))}
            </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

    
