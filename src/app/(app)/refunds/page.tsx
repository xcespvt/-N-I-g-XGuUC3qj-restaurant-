
"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IndianRupee, Receipt, ThumbsUp, ThumbsDown, Info, ShoppingBag, Clock, FileText, User, Camera, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useAppStore } from "@/context/useAppStore"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogClose } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"


export default function RefundsPage() {
  const { refunds, handleRefundRequest } = useAppStore();
  const [filter, setFilter] = useState<"Pending" | "All">("Pending");
  
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedRequestPhotos, setSelectedRequestPhotos] = useState<string[]>([]);

  const filteredRefunds = refunds.filter(r => filter === "All" || r.status === "Pending");
  
  const openImageViewer = (photos: {url: string, hint: string}[], index: number) => {
    setSelectedRequestPhotos(photos.map(p => p.url));
    setSelectedImageIndex(index);
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsViewerOpen(false);
    setSelectedRequestPhotos([]);
  };

  const nextImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % selectedRequestPhotos.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex - 1 + selectedRequestPhotos.length) % selectedRequestPhotos.length);
  };
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl flex items-center gap-2">
            <Receipt className="h-6 w-6"/> Refund Requests
        </h1>
      </div>
      
       <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <Info className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary font-semibold">Refund Policy</AlertTitle>
        <AlertDescription className="text-primary/80">
          Please note that refunds are only applicable for delivery and advance booking orders.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {filteredRefunds.map(request => (
          <Card key={request.id}>
            <CardHeader className="flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                     <Avatar className="w-10 h-10">
                        <AvatarImage src={request.customerAvatar}/>
                        <AvatarFallback>{request.customerFallback}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>{request.orderId}</CardTitle>
                        <p className="text-sm text-muted-foreground">{request.customerName}</p>
                    </div>
                </div>
                 <Badge variant={request.status === 'Pending' ? 'destructive' : 'secondary'} className={cn(
                    request.status === 'Approved' && 'bg-green-100 text-green-700',
                    request.status === 'Rejected' && 'bg-red-100 text-red-700',
                 )}>
                    {request.status}
                </Badge>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="font-semibold">Reason for Refund</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                             <div className="p-4 rounded-lg bg-muted/50">
                                <p className="text-muted-foreground text-sm">{request.reason}</p>
                            </div>
                             {request.photos && request.photos.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="font-semibold text-sm flex items-center gap-2"><Camera className="h-4 w-4"/> Customer Photos</h4>
                                <div className="flex gap-2">
                                  {request.photos.map((photo, index) => (
                                    <button key={index} onClick={() => openImageViewer(request.photos || [], index)} className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg">
                                      <Image src={photo.url} alt={photo.hint} data-ai-hint={photo.hint} width={80} height={80} className="rounded-lg object-cover" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                         <AccordionTrigger className="font-semibold">Order & Refund Details</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                            <div className="space-y-3">
                                <h4 className="font-semibold text-sm flex items-center gap-2"><ShoppingBag className="h-4 w-4"/> Refund Items</h4>
                                {request.items.map((item, index) => (
                                     <div key={index} className="flex items-center justify-between gap-4 text-sm">
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                        </div>
                                         <p className="font-semibold flex items-center"><IndianRupee className="h-3.5 w-3.5"/>{item.price.toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-semibold text-sm">Cost Breakdown</h4>
                                 <div className="space-y-2 text-sm p-4 bg-muted/50 rounded-lg">
                                    <div className="flex justify-between">
                                        <p className="text-muted-foreground">Total Refund Amount</p>
                                        <p className="font-bold text-lg flex items-center text-destructive"><IndianRupee className="h-5 w-5"/>{request.amount.toFixed(2)}</p>
                                    </div>
                                    <Separator className="my-2"/>
                                     <div className="flex justify-between">
                                        <p className="text-muted-foreground flex items-center gap-2"><User className="h-4 w-4"/> Restaurant Covers</p>
                                        <p className="font-medium flex items-center"><IndianRupee className="h-3.5 w-3.5"/>{request.costSplit.restaurant.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-muted-foreground flex items-center gap-2"><Info className="h-4 w-4"/> Crevings Covers</p>
                                        <p className="font-medium flex items-center"><IndianRupee className="h-3.5 w-3.5"/>{request.costSplit.crevings.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                             <div className="space-y-3">
                                <h4 className="font-semibold text-sm flex items-center gap-2"><FileText className="h-4 w-4"/> Original Order</h4>
                                <div className="grid grid-cols-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{request.orderType}</Badge>
                                        <Badge variant="outline" className="flex items-center gap-1.5 px-2 py-0.5 text-xs"><Clock className="h-3 w-3"/>{request.orderTime}</Badge>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
            {request.status === 'Pending' && (
                <CardFooter className="flex justify-end gap-2 border-t pt-4">
                    <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleRefundRequest(request.id, 'Rejected')}>
                        <ThumbsDown className="mr-2 h-4 w-4"/> Reject
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleRefundRequest(request.id, 'Approved')}>
                        <ThumbsUp className="mr-2 h-4 w-4"/> Approve
                    </Button>
                </CardFooter>
            )}
          </Card>
        ))}
         {filteredRefunds.length === 0 && (
            <div className="text-center py-16 text-muted-foreground col-span-full">
                <Receipt className="h-12 w-12 mx-auto mb-2"/>
                <p>No pending refund requests.</p>
            </div>
        )}
      </div>

        {isViewerOpen && selectedRequestPhotos.length > 0 && (
            <Dialog open={isViewerOpen} onOpenChange={closeImageViewer}>
                <DialogPortal>
                    <DialogOverlay />
                    <DialogContent className="p-0 bg-transparent border-0 max-w-4xl w-full h-full">
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                                src={selectedRequestPhotos[selectedImageIndex]}
                                alt="Customer photo"
                                fill
                                className="object-contain"
                            />
                            
                            {selectedRequestPhotos.length > 1 && (
                                <>
                                    <Button variant="ghost" size="icon" className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70" onClick={prevImage}>
                                        <ChevronLeft className="h-8 w-8" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70" onClick={nextImage}>
                                        <ChevronRight className="h-8 w-8" />
                                    </Button>
                                </>
                            )}
                             <DialogClose className="absolute top-2 sm:top-4 right-2 sm:right-4 rounded-full p-2 bg-black/50 text-white hover:bg-black/70 transition-opacity">
                                <X className="h-6 w-6" />
                            </DialogClose>
                        </div>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
        )}
    </div>
  )
}
