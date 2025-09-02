
"use client"

import { useState } from "react"
import {
  BarChart2,
  Gift,
  IndianRupee,
  Pencil,
  PlusCircle,
  Power,
  PowerOff,
  Trash2,
  Users,
  Edit,
  MoreHorizontal,
  Calendar,
  Ticket,
  Percent,
  Check,
  ChevronsUpDown,
  Clock,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProFeatureWrapper } from "@/components/pro-feature-wrapper"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAppContext } from "@/context/AppContext"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { MenuItem } from "@/context/AppContext"


const statsData = [
  { title: "Active Offers", value: "4" },
  { title: "Scheduled Offers", value: "1" },
  { title: "Total Usage", value: "714" },
  { title: "Revenue Impact", value: "₹12.5K" },
];

type OfferStatus = "Active" | "Scheduled" | "Paused";
type OfferType = "Percentage" | "Flat" | "BOGO" | "Free Item" | "Happy Hour";


type Offer = {
    id: string;
    title: string;
    description: string;
    status: OfferStatus;
    type: OfferType;
    discount: string;
    minOrder: string;
    validUntil: string;
    usage: number;
    total: number;
    typeIcon: React.ReactNode;
};

const initialOffersData: Offer[] = [
    {
        id: "offer-1",
        title: "Summer Special",
        description: "Get 20% off on all pizza orders above ₹500",
        status: "Active" as OfferStatus,
        type: "Percentage",
        discount: "20%",
        minOrder: "₹500",
        validUntil: "2024-06-30",
        usage: 145,
        total: 500,
        typeIcon: <Percent className="h-4 w-4" />,
    },
    {
        id: "offer-2",
        title: "Flat ₹50 OFF",
        description: "Flat ₹50 discount on orders above ₹300",
        status: "Active" as OfferStatus,
        type: "Flat",
        discount: "₹50",
        minOrder: "₹300",
        validUntil: "2024-07-15",
        usage: 89,
        total: 200,
        typeIcon: <IndianRupee className="h-4 w-4" />,
    },
    {
        id: "offer-3",
        title: "Buy 1 Get 1 Free Burgers",
        description: "Buy any burger and get another burger absolutely free",
        status: "Active" as OfferStatus,
        type: "BOGO",
        discount: "BOGO",
        minOrder: "N/A",
        validUntil: "2024-06-25",
        usage: 67,
        total: 100,
        typeIcon: <Gift className="h-4 w-4" />,
    },
    {
        id: "offer-4",
        title: "Weekend Combo Deal",
        description: "Special weekend combo: Pizza + Drink + Dessert for ₹399",
        status: "Scheduled" as OfferStatus,
        type: "Free Item",
        discount: "Free Drink",
        minOrder: "N/A",
        validUntil: "2024-06-30",
        usage: 23,
        total: 150,
        typeIcon: <Ticket className="h-4 w-4" />,
    },
    {
        id: "offer-5",
        title: "First Order Special",
        description: "New customers get 30% off on their first order",
        status: "Active" as OfferStatus,
        type: "Percentage",
        discount: "30%",
        minOrder: "₹200",
        validUntil: "2024-12-31",
        usage: 234,
        total: 1000,
        typeIcon: <Percent className="h-4 w-4" />,
    },
    {
        id: "offer-6",
        title: "Happy Hours",
        description: "15% off on all orders between 2 PM - 5 PM",
        status: "Paused" as OfferStatus,
        type: "Happy Hour",
        discount: "15%",
        minOrder: "₹250",
        validUntil: "2024-08-31",
        usage: 156,
        total: 300,
        typeIcon: <Percent className="h-4 w-4" />,
    },
];

const statusStyles: Record<OfferStatus, string> = {
  Active: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border-green-200",
  Scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200",
  Paused: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200",
};

const defaultFormState = {
  title: "",
  description: "",
  type: "Percentage" as OfferType,
  discount: "",
  minOrder: "",
  validUntil: "",
  bogoItem: "",
  freeItem: "",
  startTime: "",
  endTime: "",
};


const ItemCombobox = ({
  items,
  value,
  onChange,
  placeholder,
}: {
  items: MenuItem[]
  value: string
  onChange: (value: string) => void
  placeholder: string
}) => {
  const [open, setOpen] = useState(false)
  const groupedMenuItems = items.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item)
    return acc
  }, {} as Record<string, typeof items>)

  const selectedItemName = items.find((item) => item.id.toString() === value)?.name || placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">{selectedItemName}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search for an item..." />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            {Object.entries(groupedMenuItems).map(([category, items]) => (
              <CommandGroup key={category} heading={category}>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    onSelect={() => {
                      onChange(item.id.toString())
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.id.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default function OffersPage() {
  const { menuItems } = useAppContext();
  const [offers, setOffers] = useState<Offer[]>(initialOffersData);
  const [activeTab, setActiveTab] = useState("All");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null);
  const [formState, setFormState] = useState(defaultFormState);
  
  const { toast } = useToast();

  const filteredOffers = offers.filter(offer => activeTab === 'All' || offer.status === activeTab);
  
  const handleInputChange = (field: keyof typeof formState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };
  
  const handleCreateClick = () => {
    setEditingOffer(null);
    setFormState(defaultFormState);
    setIsFormOpen(true);
  };

  const handleEditClick = (offer: Offer) => {
    setEditingOffer(offer);
    setFormState({
        ...defaultFormState,
        title: offer.title,
        description: offer.description,
        type: offer.type,
        discount: offer.discount,
        minOrder: offer.minOrder,
        validUntil: offer.validUntil,
    });
    setIsFormOpen(true);
  };
  
  const handleDeleteClick = (offer: Offer) => {
    setOfferToDelete(offer);
    setIsDeleteAlertOpen(true);
  };
  
  const confirmDelete = () => {
    if (offerToDelete) {
        setOffers(offers.filter(o => o.id !== offerToDelete.id));
        toast({
            title: "Offer Deleted",
            description: `The offer "${offerToDelete.title}" has been deleted.`,
            variant: "destructive",
        });
        setIsDeleteAlertOpen(false);
        setOfferToDelete(null);
    }
  };
  
  const handleToggleStatus = (offerToToggle: Offer) => {
    const newStatus = offerToToggle.status === 'Active' ? 'Paused' : 'Active';
    setOffers(offers.map(o => o.id === offerToToggle.id ? { ...o, status: newStatus } : o));
     toast({
      title: "Offer Status Updated",
      description: `The offer "${offerToToggle.title}" is now ${newStatus.toLowerCase()}.`,
    });
  };

  const handleSaveOffer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (editingOffer) {
      setOffers(offers.map(o => o.id === editingOffer.id ? { ...o, ...formState, type: formState.type } as Offer : o));
      toast({ title: "Offer Updated", description: `"${formState.title}" has been updated.` });
    } else {
      const newOffer: Offer = {
        id: `offer-${Date.now()}`,
        title: formState.title,
        description: formState.description,
        type: formState.type,
        discount: formState.discount,
        minOrder: formState.minOrder,
        validUntil: formState.validUntil,
        status: 'Scheduled',
        usage: 0,
        total: 500, // Default value
        typeIcon: formState.discount.includes('%') ? '%' : '₹',
      };
      setOffers([newOffer, ...offers]);
      toast({ title: "Offer Created", description: `"${formState.title}" has been created.` });
    }
    
    setIsFormOpen(false);
    setEditingOffer(null);
  };

  const getDiscountFieldLabel = () => {
    switch (formState.type) {
      case 'Percentage':
      case 'Happy Hour':
        return 'Discount Percentage (%)';
      case 'Flat': return 'Discount Amount (₹)';
      default: return 'Discount Value';
    }
  };

  const getDiscountFieldPlaceholder = () => {
    switch (formState.type) {
      case 'Percentage':
      case 'Happy Hour':
        return 'e.g. 20';
      case 'Flat': return 'e.g. 100';
      default: return '';
    }
  }

  return (
    <ProFeatureWrapper
        featureName="Offers & Promotions"
        featureDescription="create and manage targeted offers to boost sales and customer engagement."
    >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-semibold md:text-3xl">Offers & Promotions</h1>
            <Button onClick={handleCreateClick}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Offer
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statsData.map((stat) => (
              <Card key={stat.title} className="border-t-4 border-primary">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-3xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="sm:hidden mb-4">
                <Select value={activeTab} onValueChange={setActiveTab}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="Paused">Paused</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <TabsList className="hidden sm:grid bg-muted p-1 rounded-lg w-full sm:w-auto grid-cols-4">
              <TabsTrigger value="All">All</TabsTrigger>
              <TabsTrigger value="Active">Active</TabsTrigger>
              <TabsTrigger value="Scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="Paused">Paused</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab}>
                <ScrollArea className="h-[60vh]">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 pr-4">
                        {filteredOffers.map((offer) => (
                             <Card key={offer.id} className="flex flex-col shadow-sm hover:shadow-lg transition-shadow">
                                <CardContent className="p-4 flex-grow space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg pr-4">{offer.title}</h3>
                                        <Badge variant="outline" className={cn("capitalize font-medium text-xs", statusStyles[offer.status])}>{offer.status}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground h-10 line-clamp-2">{offer.description}</p>
                                    
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm pt-2">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Discount</p>
                                            <p className="font-semibold text-base text-primary">{offer.discount}</p>
                                        </div>
                                         <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Type</p>
                                            <p className="font-semibold">{offer.type}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Min Order</p>
                                            <p className="font-semibold">{offer.minOrder}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Valid Until</p>
                                            <p className="font-semibold">{new Date(offer.validUntil).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex justify-between items-center mb-1 text-xs">
                                            <span className="text-muted-foreground">Usage</span>
                                            <span>{offer.usage} / {offer.total} used</span>
                                        </div>
                                        <Progress value={(offer.usage / offer.total) * 100} className="h-1.5" />
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-muted/50 p-2 flex justify-end">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">Actions <MoreHorizontal className="ml-2 h-4 w-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleToggleStatus(offer)}>
                                                {offer.status === 'Active' ? <PowerOff className="mr-2 h-4 w-4" /> : <Power className="mr-2 h-4 w-4" />}
                                                {offer.status === 'Active' ? 'Pause' : 'Activate'}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleEditClick(offer)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDeleteClick(offer)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardFooter>
                            </Card>
                        ))}
                        {filteredOffers.length === 0 && (
                            <div className="text-center py-16 text-muted-foreground col-span-full">
                                <p>No {activeTab.toLowerCase()} offers to show.</p>
                            </div>
                        )}
                </div>
                </ScrollArea>
            </TabsContent>
          </Tabs>
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-lg p-0 flex flex-col h-full max-h-[90vh]">
              <DialogHeader className="p-6 pb-4 flex-shrink-0">
                <DialogTitle>{editingOffer ? 'Edit Offer' : 'Create New Offer'}</DialogTitle>
                <DialogDescription>
                  {editingOffer ? 'Update the details for this offer.' : 'Fill in the details to create a new promotional offer.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveOffer} className="flex-grow overflow-hidden flex flex-col">
                  <div className="flex-grow overflow-y-auto px-6 py-4">
                      <div className="grid gap-6">
                          <div className="space-y-2">
                              <Label htmlFor="title">Offer Title</Label>
                              <Input id="title" name="title" value={formState.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="e.g. Summer Special" required />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea id="description" name="description" value={formState.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="A short description of the offer." required />
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="type">Offer Type</Label>
                              <Select value={formState.type} onValueChange={(value: OfferType) => handleInputChange('type', value)}>
                                  <SelectTrigger id="type">
                                      <SelectValue placeholder="Select offer type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="Percentage">Percentage Discount</SelectItem>
                                      <SelectItem value="Flat">Flat Discount</SelectItem>
                                      <SelectItem value="BOGO">Buy-One-Get-One (BOGO)</SelectItem>
                                      <SelectItem value="Free Item">Free Item</SelectItem>
                                      <SelectItem value="Happy Hour">Happy Hour</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>
                          
                          {formState.type === 'Percentage' || formState.type === 'Flat' || formState.type === 'Happy Hour' ? (
                            <div className="space-y-2">
                                <Label htmlFor="discount">{getDiscountFieldLabel()}</Label>
                                <Input id="discount" name="discount" value={formState.discount} onChange={(e) => handleInputChange('discount', e.target.value)} placeholder={getDiscountFieldPlaceholder()} required />
                            </div>
                          ) : null}

                           {formState.type === 'Free Item' && (
                                <div className="space-y-2">
                                    <Label htmlFor="free-item">Select Free Item</Label>
                                     <ItemCombobox
                                        items={menuItems}
                                        value={formState.freeItem}
                                        onChange={(value) => handleInputChange("freeItem", value)}
                                        placeholder="Choose free item"
                                    />
                                </div>
                            )}
                            
                           {formState.type === 'Happy Hour' && (
                                <div className="grid grid-cols-2 gap-4">
                                     <div className="space-y-2">
                                        <Label htmlFor="start-time">Start Time</Label>
                                        <div className="relative">
                                            <Input id="start-time" type="time" value={formState.startTime} onChange={(e) => handleInputChange('startTime', e.target.value)} />
                                            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="end-time">End Time</Label>
                                         <div className="relative">
                                            <Input id="end-time" type="time" value={formState.endTime} onChange={(e) => handleInputChange('endTime', e.target.value)} />
                                            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                </div>
                            )}


                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {formState.type === 'BOGO' ? (
                              <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="bogoItem">Select Item</Label>
                                <ItemCombobox
                                    items={menuItems}
                                    value={formState.bogoItem}
                                    onChange={(value) => handleInputChange("bogoItem", value)}
                                    placeholder="Choose BOGO item"
                                />
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <Label htmlFor="minOrder">Minimum Order (₹)</Label>
                                <Input id="minOrder" name="minOrder" type="number" value={formState.minOrder} onChange={(e) => handleInputChange('minOrder', e.target.value)} placeholder="e.g. 500" />
                              </div>
                            )}
                          <div className="space-y-2">
                              <Label htmlFor="validUntil">Valid Until</Label>
                              <Input id="validUntil" name="validUntil" type="date" value={formState.validUntil} onChange={(e) => handleInputChange('validUntil', e.target.value)} required />
                          </div>
                          </div>
                      </div>
                  </div>
                <DialogFooter className="border-t p-6 bg-muted/50 flex-shrink-0">
                  <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save Offer</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          {/* Delete Alert Dialog */}
          <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
              <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the offer
                          "{offerToDelete?.title}".
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
        </div>
    </ProFeatureWrapper>
  )
}
