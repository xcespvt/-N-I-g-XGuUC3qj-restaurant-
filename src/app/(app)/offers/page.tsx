"use client";

import { useState, useEffect } from "react";
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
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useGet, usePost, usePut, useQueryHelpers, useMutationRequestDynamic } from "@/hooks/useApi";
import { useMutation } from "@tanstack/react-query";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/pagination/PaginationControls";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProFeatureWrapper } from "@/components/pro-feature-wrapper";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppStore } from "@/context/useAppStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MenuItem } from "@/context/useAppStore";

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
  shortDescription: string;
  description: string;
  status: OfferStatus;
  type: OfferType;
  discount: string;
  minOrder: string;
  validUntil: string;
  usage: number;
  total: number;
  typeIcon: React.ReactNode;
  couponCode: string;
};

const initialOffersData: Offer[] = [
  {
    id: "offer-1",
    title: "Summer Special",
    shortDescription: "Sizzling summer savings!",
    description: "Get 20% off on all pizza orders above ₹500",
    status: "Active" as OfferStatus,
    type: "Percentage",
    discount: "20%",
    minOrder: "₹500",
    validUntil: "2024-06-30",
    usage: 145,
    total: 500,
    typeIcon: <Percent className="h-4 w-4" />,
    couponCode: "SUMMER20",
  },
  {
    id: "offer-2",
    title: "Flat ₹50 OFF",
    shortDescription: "Instant discount on your order.",
    description: "Flat ₹50 discount on orders above ₹300",
    status: "Active" as OfferStatus,
    type: "Flat",
    discount: "₹50",
    minOrder: "₹300",
    validUntil: "2024-07-15",
    usage: 89,
    total: 200,
    typeIcon: <IndianRupee className="h-4 w-4" />,
    couponCode: "FLAT50",
  },
  {
    id: "offer-3",
    title: "Buy 1 Get 1 Free Burgers",
    shortDescription: "Double the delight!",
    description: "Buy any burger and get another burger absolutely free",
    status: "Active" as OfferStatus,
    type: "BOGO",
    discount: "BOGO",
    minOrder: "N/A",
    validUntil: "2024-06-25",
    usage: 67,
    total: 100,
    typeIcon: <Gift className="h-4 w-4" />,
    couponCode: "BOGOSTAR",
  },
  {
    id: "offer-4",
    title: "Weekend Combo Deal",
    shortDescription: "The perfect weekend treat.",
    description: "Special weekend combo: Pizza + Drink + Dessert for ₹399",
    status: "Scheduled" as OfferStatus,
    type: "Free Item",
    discount: "Free Drink",
    minOrder: "N/A",
    validUntil: "2024-06-30",
    usage: 23,
    total: 150,
    typeIcon: <Ticket className="h-4 w-4" />,
    couponCode: "WKNDCOMBO",
  },
  {
    id: "offer-5",
    title: "First Order Special",
    shortDescription: "A welcome treat for new users.",
    description: "New customers get 30% off on their first order",
    status: "Active" as OfferStatus,
    type: "Percentage",
    discount: "30%",
    minOrder: "₹200",
    validUntil: "2024-12-31",
    usage: 234,
    total: 1000,
    typeIcon: <Percent className="h-4 w-4" />,
    couponCode: "NEW30",
  },
  {
    id: "offer-6",
    title: "Happy Hours",
    shortDescription: "Great deals during off-peak hours.",
    description: "15% off on all orders between 2 PM - 5 PM",
    status: "Paused" as OfferStatus,
    type: "Happy Hour",
    discount: "15%",
    minOrder: "₹250",
    validUntil: "2024-08-31",
    usage: 156,
    total: 300,
    typeIcon: <Percent className="h-4 w-4" />,
    couponCode: "HAPPY15",
  },
];

const statusStyles: Record<OfferStatus, string> = {
  Active:
    "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border-green-200",
  Scheduled:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200",
  Paused:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200",
};

const defaultFormState = {
  title: "",
  shortDescription: "",
  description: "",
  type: "Percentage" as OfferType,
  couponCode: "",
  discount: "",
  minimumOrder: "",
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
  items: MenuItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) => {
  const [open, setOpen] = useState(false);
  const groupedMenuItems = items.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const selectedItemName =
    items.find((item) => item.id.toString() === value)?.name || placeholder;

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
                      onChange(item.id.toString());
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.id.toString()
                          ? "opacity-100"
                          : "opacity-0"
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
  );
};

export default function OffersPage() {
  const { menuItems, branches, selectedBranch } = useAppStore();
  const [offers, setOffers] = useState<Offer[]>(initialOffersData);
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null);
  const [formState, setFormState] = useState(defaultFormState);

  const { toast } = useToast();

  // Resolve restaurantId from selected branch
  const restaurantId = branches.find((b) => b.id === selectedBranch)?.restaurantId;

  // Query helpers for cache control
  const { invalidate, set } = useQueryHelpers();

  // Fetch offers from backend
  type OfferApi = {
    restaurantId: string;
    offerId: string;
    offerTitle: string;
    description?: string;
    offerType:
      | "Percentage Discount"
      | "Flat Discount"
      | "Buy-One-Get-One (BOGO)"
      | "Free Item"
      | "Happy Hour";
    discountPercentage?: number;
    discountAmount?: number;
    freeItem?: string;
    bogoItems?: string;
    minimumOrder?: number;
    validUntil: string;
    isActive?: boolean;
    offerStatus?: "Active" | "Paused" | "Scheduled";
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
    couponCode?: string;
  };

  const {
    data: apiOffersData,
    error: offersError,
    isLoading: offersLoading,
  } = useGet<{ data?: OfferApi[]; [k: string]: any }>(
    ["offers", restaurantId ?? "no-rid", `${currentPage}`, `${pageSize}`],
    restaurantId
      ? `https://backend.crevings.com/api/offers/offers/${restaurantId}`
      : `https://backend.crevings.com/api/offers/offers/__restaurant__`,
    { page: currentPage, limit: pageSize },
    { enabled: !!restaurantId }
  );

  useEffect(() => {
    if (offersError) {
      toast({
        variant: "destructive",
        title: "Failed to load offers",
        description: (offersError as any)?.message || "Please try again.",
      });
    }
  }, [offersError, toast]);

  const apiOffers = (apiOffersData as any)?.data as OfferApi[] | undefined;

  const transformedOffers: Offer[] = (apiOffers ?? []).map((item) => {
    const status: OfferStatus = (item.offerStatus as OfferStatus) || (item.isActive ? "Active" : "Paused");
    const type: OfferType =
      item.offerType === "Percentage Discount" || item.offerType === "Happy Hour"
        ? "Percentage"
        : item.offerType === "Flat Discount"
        ? "Flat"
        : item.offerType === "Buy-One-Get-One (BOGO)"
        ? "BOGO"
        : item.offerType === "Free Item"
        ? "Free Item"
        : "Percentage";
    const discount =
      type === "Percentage"
        ? `${item.discountPercentage ?? 0}%`
        : type === "Flat"
        ? `₹${item.discountAmount ?? 0}`
        : type === "BOGO"
        ? "BOGO"
        : type === "Free Item"
        ? `Free ${item.freeItem ?? "Item"}`
        : `${item.discountPercentage ?? 0}%`;
    const minOrder =
      typeof item.minimumOrder === "number" ? `₹${item.minimumOrder}` : "N/A";
    const validUntil = item.validUntil;
    const typeIcon =
      type === "Percentage"
        ? <Percent className="h-4 w-4" />
        : type === "Flat"
        ? <IndianRupee className="h-4 w-4" />
        : type === "BOGO"
        ? <Gift className="h-4 w-4" />
        : <Ticket className="h-4 w-4" />;

    return {
      id: item.offerId,
      title: item.offerTitle,
      shortDescription: item.description || "",
      description: item.description || "",
      status,
      type,
      discount,
      minOrder,
      validUntil,
      usage: 0,
      total: 0,
      typeIcon,
      couponCode: item.couponCode ?? "-",
    };
  });

  // Map UI offer type to API offerType strings
  const toApiOfferType = (type: OfferType):
    | "Percentage Discount"
    | "Flat Discount"
    | "Buy-One-Get-One (BOGO)"
    | "Free Item"
    | "Happy Hour" => {
    switch (type) {
      case "Percentage":
        return "Percentage Discount";
      case "Flat":
        return "Flat Discount";
      case "BOGO":
        return "Buy-One-Get-One (BOGO)";
      case "Free Item":
        return "Free Item";
      case "Happy Hour":
        return "Happy Hour";
    }
  };

  type AddOfferPayload = {
    restaurantId: string;
    couponCode: string;
    offerTitle: string;
    description?: string;
    offerType:
      | "Percentage Discount"
      | "Flat Discount"
      | "Buy-One-Get-One (BOGO)"
      | "Free Item"
      | "Happy Hour";
    discountPercentage?: number;
    discountAmount?: number;
    freeItem?: string;
    bogoItems?: string;
    happyHourTiming?: { startTime: number; endTime: number };
    minimumOrder?: number;
    validUntil: number;
    isActive?: boolean;
  };

  // Build API payload from form state
  const buildOfferPayload = (rid: string, state: typeof defaultFormState): AddOfferPayload => {
    const offerType = toApiOfferType(state.type);
    const discountNum = state.discount ? parseFloat(state.discount) : undefined;
    const minOrderNum = state.minimumOrder ? parseFloat(state.minimumOrder.replace(/[^0-9.]/g, "")) : undefined;

    // Resolve item names from IDs for Free Item / BOGO
    const freeItemName = state.freeItem
      ? menuItems.find((m) => m.id.toString() === state.freeItem)?.name
      : undefined;
    const bogoItemName = state.bogoItem
      ? menuItems.find((m) => m.id.toString() === state.bogoItem)?.name
      : undefined;

    // validUntil as epoch ms
    const validUntilMs = state.validUntil ? new Date(state.validUntil).getTime() : Date.now();

    // Happy Hour timing: derive today’s date with provided HH:mm
    let happyHourTiming: { startTime: number; endTime: number } | undefined;
    if (state.type === "Happy Hour" && state.startTime && state.endTime) {
      const today = new Date();
      const [sh, sm] = state.startTime.split(":").map(Number);
      const [eh, em] = state.endTime.split(":").map(Number);
      const start = new Date(today);
      start.setHours(sh ?? 0, sm ?? 0, 0, 0);
      const end = new Date(today);
      end.setHours(eh ?? 0, em ?? 0, 0, 0);
      happyHourTiming = { startTime: start.getTime(), endTime: end.getTime() };
    }

    const payload: AddOfferPayload = {
      restaurantId: rid,
      couponCode: (state.couponCode || "").trim(),
      offerTitle: state.title,
      description: state.description || undefined,
      offerType,
      minimumOrder: minOrderNum,
      validUntil: validUntilMs,
      isActive: true,
    };

    // Attach type-specific fields
    if (offerType === "Percentage Discount") {
      if (typeof discountNum === "number") payload.discountPercentage = discountNum;
    } else if (offerType === "Flat Discount") {
      if (typeof discountNum === "number") payload.discountAmount = discountNum;
    } else if (offerType === "Free Item") {
      if (freeItemName) payload.freeItem = freeItemName;
    } else if (offerType === "Buy-One-Get-One (BOGO)") {
      // Prefer a friendly default string if available
      if (bogoItemName) payload.bogoItems = `Buy 1 ${bogoItemName} Get 1 Free`;
    } else if (offerType === "Happy Hour") {
      if (typeof discountNum === "number") payload.discountPercentage = discountNum;
      if (happyHourTiming) payload.happyHourTiming = happyHourTiming;
    }

    return payload;
  };

// Prune payload to only include keys relevant to the current offerType
const pruneUpdatePayload = (p: AddOfferPayload): AddOfferPayload => {
  const base: AddOfferPayload = {
    restaurantId: p.restaurantId,
    couponCode: p.couponCode,
    offerTitle: p.offerTitle,
    description: p.description,
    offerType: p.offerType,
    minimumOrder: p.minimumOrder,
    validUntil: p.validUntil,
    isActive: p.isActive,
  };
  switch (p.offerType) {
    case "Percentage Discount":
      if (p.discountPercentage !== undefined) base.discountPercentage = p.discountPercentage;
      break;
    case "Flat Discount":
      if (p.discountAmount !== undefined) base.discountAmount = p.discountAmount;
      break;
    case "Free Item":
      if (p.freeItem) base.freeItem = p.freeItem;
      break;
    case "Buy-One-Get-One (BOGO)":
      if (p.bogoItems) base.bogoItems = p.bogoItems;
      break;
    case "Happy Hour":
      if (p.discountPercentage !== undefined) base.discountPercentage = p.discountPercentage;
      if (p.happyHourTiming) base.happyHourTiming = p.happyHourTiming;
      break;
  }
  return base;
};

  // Create offer mutation
  const addOfferMutation = usePost<any, AddOfferPayload>(
    "https://backend.crevings.com/api/offers/offers/add",
    {
      onMutate: async (variables) => {
        if (!restaurantId) return;
        const keyExact = [
          "offers",
          restaurantId,
          `${currentPage}`,
          `${pageSize}`,
          { page: currentPage, limit: pageSize },
        ];
        const prevData = apiOffersData as { data?: any[] } | undefined;
        const prevList = (prevData as any)?.data as any[] | undefined;
        const optimistic: OfferApi = {
          restaurantId,
          offerId: `temp-${Date.now()}`,
          offerTitle: variables.offerTitle,
          description: variables.description,
          offerType: variables.offerType,
          discountPercentage: variables.discountPercentage,
          discountAmount: variables.discountAmount,
          freeItem: variables.freeItem,
          bogoItems: variables.bogoItems,
          minimumOrder: variables.minimumOrder,
          validUntil: typeof variables.validUntil === "number"
            ? new Date(variables.validUntil).toISOString()
            : variables.validUntil as any,
          isActive: true,
          offerStatus: "Scheduled",
          couponCode: variables.couponCode,
        };
        const updated = { ...(prevData || {}), data: [ ...(prevList ?? []), optimistic ] } as any;
        set(keyExact as unknown as any[], updated);
        return { previous: prevData, keyExact } as any;
      },
      onSuccess: (_data, variables) => {
        if (restaurantId) invalidate(["offers", restaurantId, currentPage, pageSize]);
        toast({ title: "Offer created", description: `"${variables?.offerTitle}" added.` });
        // Close the sheet after successful save
        setIsFormOpen(false);
        setEditingOffer(null);
      },
      onError: (_error, _variables, context: any) => {
        try {
          if (context?.keyExact && context?.previous) {
            set(context.keyExact as unknown as any[], context.previous);
          }
        } catch {}
        toast({
          variant: "destructive",
          title: "Couldn’t create offer",
          description: "Please try again.",
        });
      },
    }
  );

  const displayOffers = transformedOffers.length > 0 ? transformedOffers : offers;
  const filteredOffers = displayOffers.filter(
    (offer) => activeTab === "All" || offer.status === activeTab
  );

  // Generic pagination for filtered offers
  const itemsPerPage = pageSize;
  // For server-driven pagination, do not re-slice locally
  const pageOffers = filteredOffers;

  // Use API pagination metadata for UI totals and pages
  const apiPagination = (apiOffersData as any)?.pagination as {
    currentPage?: number;
    itemsPerPage?: number;
    totalItems?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  } | undefined;

  const effectiveItemsPerPage = apiPagination?.itemsPerPage ?? itemsPerPage;
  const uiTotalItems = apiPagination?.totalItems ?? filteredOffers.length;
  const uiTotalPages = apiPagination?.totalPages ?? Math.max(1, Math.ceil((uiTotalItems || 0) / effectiveItemsPerPage));
  const uiStartIndex = (currentPage - 1) * effectiveItemsPerPage + 1;
  const uiEndIndex = Math.min(currentPage * effectiveItemsPerPage, uiTotalItems);

  // Reset to first page when tab filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, setCurrentPage]);

  const handleInputChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  // Normalize various date string formats to HTML date input value (YYYY-MM-DD)
  const toDateInputValue = (value: string | number | Date | undefined | null): string => {
    if (value === undefined || value === null) return "";
    try {
      const d = new Date(value as any);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().slice(0, 10);
    } catch {
      return "";
    }
  };

  const handleCreateClick = () => {
    setEditingOffer(null);
    setFormState(defaultFormState);
    setIsFormOpen(true);
  };

  const handleEditClick = (offer: Offer) => {
    setEditingOffer(offer);
    const prefillMinOrder = typeof offer.minOrder === "string"
      ? offer.minOrder.replace(/[^0-9.]/g, "")
      : "";
    setFormState({
      ...defaultFormState,
      title: offer.title,
      shortDescription: offer.shortDescription,
      description: offer.description,
      type: offer.type,
      couponCode: offer.couponCode,
      discount: offer.discount,
      minimumOrder: prefillMinOrder,
      // Ensure date input is pre-filled correctly
      validUntil: toDateInputValue(offer.validUntil),
    });
    setIsFormOpen(true);
  };

  const handleDeleteClick = (offer: Offer) => {
    setOfferToDelete(offer);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    if (offerToDelete) {
      setOffers(offers.filter((o) => o.id !== offerToDelete.id));
      toast({
        title: "Offer Deleted",
        description: `The offer "${offerToDelete.title}" has been deleted.`,
        variant: "destructive",
      });
      setIsDeleteAlertOpen(false);
      setOfferToDelete(null);
    }
  };

  // Integrate PUT for toggling status with dynamic URL per call
  const toApiToggleStatus = (status: OfferStatus): "Activate" | "Pause" =>
    status === "Active" ? "Activate" : "Pause";

  const toggleOfferMutation = useMutationRequestDynamic<any, { offerId: string; body: { status: "Activate" | "Pause" }; title?: string }>(
    "PUT",
    (variables) => `https://backend.crevings.com/api/offers/offers/toggle/${restaurantId}/${variables.offerId}`,
    (variables) => variables.body,
    {
    onMutate: async (variables) => {
      if (!restaurantId) return;
      const keyExact = [
        "offers",
        restaurantId,
        `${currentPage}`,
        `${pageSize}`,
        { page: currentPage, limit: pageSize },
      ];
      const nextStatus = variables.body.status === "Activate" ? "Active" : "Paused";
      const prevData = apiOffersData as { data?: any[] } | undefined;
      const prevList = (prevData as any)?.data as any[] | undefined;
      const updatedList = (prevList ?? []).map((item) =>
        item.offerId === variables.offerId
          ? { ...item, offerStatus: nextStatus, isActive: nextStatus === "Active" }
          : item
      );
      const updated = { ...(prevData || {}), data: updatedList } as any;
      // Optimistically set exact cache key so UI reflects immediately
      // @ts-ignore - helper expects unknown[] key
      set(keyExact as unknown as any[], updated);
      return { previous: prevData, keyExact } as any;
    },
    onSuccess: (_data, variables) => {
      if (restaurantId) invalidate(["offers", restaurantId, currentPage, pageSize]);
    },
    onError: (error: Error, _variables, context: any) => {
      // Roll back to previous cache snapshot if available
      try {
        if (context?.keyExact && context?.previous) {
          // @ts-ignore
          useQueryHelpers().set(context.keyExact, context.previous);
        }
      } catch {}
      toast({
        variant: "destructive",
        title: "Couldn’t update offer",
        description: "Restoring previous status. Please try again.",
      });
    },
  });

  const handleToggleStatus = (offerToToggle: Offer) => {
    const newStatus: OfferStatus = offerToToggle.status === "Active" ? "Paused" : "Active";
    // Friendly immediate feedback
    toast({
      title: newStatus === "Active" ? "Offer activated" : "Offer paused",
      description: `"${offerToToggle.title}" is now ${newStatus.toLowerCase()}.`,
    });

    // Trigger backend sync
    if (!restaurantId) {
      toast({
        variant: "destructive",
        title: "Restaurant ID Missing",
        description: "Please select a valid branch with restaurant ID.",
      });
      return;
    }
    toggleOfferMutation.mutate({ offerId: offerToToggle.id, body: { status: toApiToggleStatus(newStatus) }, title: offerToToggle.title });
  };

  const updateOfferMutation = useMutationRequestDynamic<any, { offerId: string; body: AddOfferPayload; title?: string }>(
    "PUT",
    (variables) => `https://backend.crevings.com/api/offers/offers/update/${restaurantId}/${variables.offerId}`,
    (variables) => pruneUpdatePayload(variables.body),
    {
    onMutate: async (variables) => {
      if (!restaurantId) return;
      const keyExact = [
        "offers",
        restaurantId,
        `${currentPage}`,
        `${pageSize}`,
        { page: currentPage, limit: pageSize },
      ];
      const prevData = apiOffersData as { data?: any[] } | undefined;
      const prevList = (prevData as any)?.data as any[] | undefined;
      const updatedList = (prevList ?? []).map((item) =>
        item.offerId === variables.offerId
          ? {
              ...item,
              offerTitle: variables.body.offerTitle,
              description: variables.body.description,
              offerType: variables.body.offerType,
              discountPercentage: variables.body.discountPercentage,
              discountAmount: variables.body.discountAmount,
              freeItem: variables.body.freeItem,
              bogoItems: variables.body.bogoItems,
              minimumOrder: variables.body.minimumOrder,
              validUntil:
                typeof variables.body.validUntil === "number"
                  ? new Date(variables.body.validUntil).toISOString()
                  : (variables.body.validUntil as any),
              isActive:
                variables.body.isActive !== undefined
                  ? variables.body.isActive
                  : item.isActive,
              couponCode: variables.body.couponCode,
            }
          : item
      );
      const updated = { ...(prevData || {}), data: updatedList } as any;
      set(keyExact as unknown as any[], updated);
      toast({ title: "Offer updated", description: `"${variables?.title}" updated.` });
      return { previous: prevData, keyExact } as any;
    },
    onSuccess: (_data, _variables) => {
      if (restaurantId) invalidate(["offers", restaurantId, currentPage, pageSize]);
      setIsFormOpen(false);
      setEditingOffer(null);
    },
    onError: (_error, _variables, context: any) => {
      try {
        if (context?.keyExact && context?.previous) {
          set(context.keyExact as unknown as any[], context.previous);
        }
      } catch {}
      toast({
        variant: "destructive",
        title: "Couldn’t update offer",
        description: "Restoring previous data. Please try again.",
      });
    },
  });

  const handleSaveOffer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editingOffer) {
      if (!restaurantId) {
        toast({
          variant: "destructive",
          title: "Restaurant ID Missing",
          description: "Please select a valid branch with restaurant ID.",
        });
        return;
      }
      const apiPayload = buildOfferPayload(restaurantId, formState);
      updateOfferMutation.mutate({ offerId: editingOffer.id, body: apiPayload, title: formState.title });
    } else {
      if (!restaurantId) {
        toast({
          variant: "destructive",
          title: "Restaurant ID Missing",
          description: "Please select a valid branch with restaurant ID.",
        });
        return;
      }

      const apiPayload = buildOfferPayload(restaurantId, formState);
      addOfferMutation.mutate(apiPayload);
    }
  };

  const getDiscountFieldLabel = () => {
    switch (formState.type) {
      case "Percentage":
      case "Happy Hour":
        return "Discount Percentage (%)";
      case "Flat":
        return "Discount Amount (₹)";
      default:
        return "Discount Value";
    }
  };

  const getDiscountFieldPlaceholder = () => {
    switch (formState.type) {
      case "Percentage":
      case "Happy Hour":
        return "e.g. 20";
      case "Flat":
        return "e.g. 100";
      default:
        return "";
    }
  };

  const generateCouponCode = () => {
    const code = `CRV${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    handleInputChange("couponCode", code);
  };

  return (
    <ProFeatureWrapper
      featureName="Offers & Promotions"
      featureDescription="create and manage targeted offers to boost sales and customer engagement."
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold md:text-3xl">
            Offers & Promotions
          </h1>
          <Button onClick={handleCreateClick}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Offer
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat) => (
            <Card key={stat.title} className="border-t-4 border-primary">
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
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
                {pageOffers.map((offer) => (
                  <Card
                    key={offer.id}
                    className="flex flex-col shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-4 flex-grow space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg pr-4">
                          {offer.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize font-medium text-xs",
                            statusStyles[offer.status]
                          )}
                        >
                          {offer.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {offer.shortDescription}
                      </p>

                      <div className="space-y-1 text-sm pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Discount</span>
                          <span className="font-semibold text-base text-primary">{offer.discount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Min. Order</span>
                          <span className="font-semibold">{offer.minOrder}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Expires</span>
                          <span className="font-semibold">{new Date(offer.validUntil).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Coupon</span>
                          <Badge variant="secondary">{offer.couponCode}</Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/50 p-2 flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions <MoreHorizontal className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(offer)}
                          >
                            {offer.status === "Active" ? (
                              <PowerOff className="mr-2 h-4 w-4" />
                            ) : (
                              <Power className="mr-2 h-4 w-4" />
                            )}
                            {offer.status === "Active" ? "Pause" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditClick(offer)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(offer)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardFooter>
                  </Card>
                ))}
                {pageOffers.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground col-span-full">
                    <p>No {activeTab.toLowerCase()} offers to show.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Pagination Controls */}
        {uiTotalItems > 0 && uiTotalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={uiTotalPages}
            onPageChange={setCurrentPage}
            className="mt-8"
          />
        )}

        {/* Pagination Info */}
        {uiTotalItems > 0 && (
          <div className="text-center text-sm text-muted-foreground mt-4">
            Showing {uiStartIndex} to {uiEndIndex} of {uiTotalItems} offers
          </div>
        )}

        <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
          <SheetContent
            side="bottom"
            className="sm:max-w-3xl mx-auto p-0 flex flex-col h-full max-h-[90vh]"
          >
            <SheetHeader className="p-6 pb-4 border-b">
              <SheetTitle>
                {editingOffer ? "Edit Offer" : "Create New Offer"}
              </SheetTitle>
              <SheetDescription>
                {editingOffer
                  ? "Update the details for this offer."
                  : "Fill in the details to create a new promotional offer."}
              </SheetDescription>
            </SheetHeader>
            <form
              onSubmit={handleSaveOffer}
              className="flex-grow overflow-hidden flex flex-col"
            >
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Offer Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formState.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="e.g. Summer Special"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="short-description">Short Description</Label>
                    <Input
                      id="short-description"
                      name="shortDescription"
                      value={formState.shortDescription}
                      onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                      placeholder="e.g. Enjoy a refreshing discount!"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="couponCode">Coupon Code</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="couponCode"
                        name="couponCode"
                        value={formState.couponCode}
                        onChange={(e) =>
                          handleInputChange("couponCode", e.target.value.toUpperCase())
                        }
                        placeholder="e.g. SUMMER20"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateCouponCode}
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="terms">Terms and Conditions</Label>
                    <Textarea
                      id="terms"
                      name="terms"
                      value={formState.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Enter the terms and conditions for this offer."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Offer Type</Label>
                    <Select
                      value={formState.type}
                      onValueChange={(value: OfferType) =>
                        handleInputChange("type", value)
                      }
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select offer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Percentage">
                          Percentage Discount
                        </SelectItem>
                        <SelectItem value="Flat">Flat Discount</SelectItem>
                        <SelectItem value="BOGO">
                          Buy-One-Get-One (BOGO)
                        </SelectItem>
                        <SelectItem value="Free Item">Free Item</SelectItem>
                        <SelectItem value="Happy Hour">Happy Hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formState.type === "Percentage" ||
                    formState.type === "Flat" ||
                    formState.type === "Happy Hour" ? (
                    <div className="space-y-2">
                      <Label htmlFor="discount">
                        {getDiscountFieldLabel()}
                      </Label>
                      <Input
                        id="discount"
                        name="discount"
                        value={formState.discount}
                        onChange={(e) =>
                          handleInputChange("discount", e.target.value)
                        }
                        placeholder={getDiscountFieldPlaceholder()}
                        required
                      />
                    </div>
                  ) : null}

                  {formState.type === "Free Item" && (
                    <div className="space-y-2">
                      <Label htmlFor="free-item">Select Free Item</Label>
                      <ItemCombobox
                        items={menuItems}
                        value={formState.freeItem}
                        onChange={(value) =>
                          handleInputChange("freeItem", value)
                        }
                        placeholder="Choose free item"
                      />
                    </div>
                  )}

                  {formState.type === "Happy Hour" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-time">Start Time</Label>
                        <div className="relative">
                          <Input
                            id="start-time"
                            type="time"
                            value={formState.startTime}
                            onChange={(e) =>
                              handleInputChange("startTime", e.target.value)
                            }
                          />
                          <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-time">End Time</Label>
                        <div className="relative">
                          <Input
                            id="end-time"
                            type="time"
                            value={formState.endTime}
                            onChange={(e) =>
                              handleInputChange("endTime", e.target.value)
                            }
                          />
                          <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formState.type === "BOGO" ? (
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="bogoItem">Select Item</Label>
                        <ItemCombobox
                          items={menuItems}
                          value={formState.bogoItem}
                          onChange={(value) =>
                            handleInputChange("bogoItem", value)
                          }
                          placeholder="Choose BOGO item"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="minimumOrder">Minimum Order (₹)</Label>
                        <Input
                          id="minimumOrder"
                          name="minimumOrder"
                          type="number"
                          value={formState.minimumOrder}
                          onChange={(e) =>
                            handleInputChange("minimumOrder", e.target.value)
                          }
                          placeholder="e.g. 500"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="validUntil">Valid Until</Label>
                      <Input
                        id="validUntil"
                        name="validUntil"
                        type="date"
                        value={formState.validUntil}
                        onChange={(e) =>
                          handleInputChange("validUntil", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <SheetFooter className="border-t p-4 bg-muted/50 flex-shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={addOfferMutation.isPending}>
                  {addOfferMutation.isPending ? "Saving…" : "Save Offer"}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>

        {/* Delete Alert Dialog */}
        <AlertDialog
          open={isDeleteAlertOpen}
          onOpenChange={setIsDeleteAlertOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                offer "{offerToDelete?.title}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProFeatureWrapper>
  );
}
