"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Image from "next/image";
import {
  IndianRupee,
  Plus,
  Search,
  Minus,
  ShoppingCart,
  ArrowRight,
  ArrowLeft,
  Clock,
  ChevronsUpDown,
  Check,
  User,
  Phone,
  Utensils,
  ShoppingBag
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/context/useAppStore";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import type { MenuItem, Table as TableType } from "@/context/useAppStore";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

// --- Components ---

const MultiTableSelect = ({
  tables,
  selectedTableIds,
  onSelectionChange,
}: {
  tables: TableType[];
  selectedTableIds: string[];
  onSelectionChange: (tableIds: string[]) => void;
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (tableId: string) => {
    const newSelection = selectedTableIds.includes(tableId)
      ? selectedTableIds.filter((id) => id !== tableId)
      : [...selectedTableIds, tableId];
    onSelectionChange(newSelection);
  };
  
  const selectedTables = tables.filter(t => selectedTableIds.includes(t.id));
  const selectedTablesText =
    selectedTables.length > 0
      ? selectedTables.map(t => t.name).join(', ')
      : "Select tables...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal bg-gray-50 border-gray-200"
        >
          <span className="truncate">{selectedTablesText}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search tables..." />
          <CommandList>
            <CommandEmpty>No tables found.</CommandEmpty>
            <CommandGroup>
              {tables.map((table) => (
                <CommandItem
                  key={table.id}
                  value={table.name}
                  onSelect={() => handleSelect(table.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedTableIds.includes(table.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {table.name} ({table.capacity})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const MenuItemCard = ({ item }: { item: MenuItem }) => {
  const { takeawayCart, addToTakeawayCart } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const quantityInCart = useMemo(() => {
    return takeawayCart
      .filter((cartItem) => cartItem.id === item.id)
      .reduce((total, i) => total + i.quantity, 0);
  }, [takeawayCart, item.id]);

  const handleButtonClick = () => {
    if (!item.portionOptions || item.portionOptions.length === 0) {
      addToTakeawayCart(item, 1, "Full", item.price);
    } else {
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
         {/* Dietary Indicator */}
         <div className="flex justify-between items-start mb-2">
            <div
                className={cn(
                  "inline-flex items-center justify-center w-5 h-5 rounded-sm border",
                  item.dietaryType === "Veg"
                    ? "border-green-600"
                    : "border-red-600"
                )}
              >
                <div
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    item.dietaryType === "Veg"
                      ? "bg-green-600"
                      : "bg-red-600"
                  )}
                ></div>
            </div>
         </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-sm md:text-base line-clamp-2">{item.name}</h3>
            <p className="font-bold text-sm flex items-center mt-1 text-gray-900">
              <IndianRupee className="h-3.5 w-3.5" />
              {item.price.toFixed(0)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
            {quantityInCart > 0 ? (
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-md hover:bg-white hover:shadow-sm"
                        onClick={handleButtonClick} // Simplification: Opens dialog for more options usually
                     >
                        <span className="text-xs font-bold">{quantityInCart}</span>
                     </Button>
                </div>
            ) : (
                <Button 
                    variant="ghost" 
                    className="h-8 bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700 w-full text-xs font-semibold" 
                    onClick={handleButtonClick}
                >
                    ADD
                </Button>
            )}
        </div>
      </div>
      <ItemSelectionDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={item}
      />
    </>
  );
};

// ... (ItemSelectionDialog remains strictly the same as your provided code, omitted for brevity but assume it is here) ...
// For the sake of the copy-paste, I will include a minimal placeholder or re-include it if you need the full file.
// I will include it to ensure the file is complete.

const ItemSelectionDialog = ({
  isOpen,
  onOpenChange,
  item,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItem;
}) => {
  const { takeawayCart, addToTakeawayCart, clearPortionsFromCart } = useAppStore();
  const [selectedPortionName, setSelectedPortionName] = useState(item.portionOptions?.[0]?.name || "Full");
  const [quantity, setQuantity] = useState(1);

  // ... (Logic from your code)
  const portionInCart = useMemo(() => {
    return takeawayCart.find(
      (cartItem) => cartItem.id === item.id && cartItem.portion === selectedPortionName
    );
  }, [takeawayCart, item.id, selectedPortionName]);

  const selectedPortion = useMemo(() => {
    return (
      item.portionOptions?.find((p) => p.name === selectedPortionName) || { name: "Full", price: item.price }
    );
  }, [item, selectedPortionName]);

  const handleAddToCart = () => {
     if (portionInCart) clearPortionsFromCart(item.id, selectedPortionName);
     addToTakeawayCart(item, quantity, selectedPortionName, selectedPortion.price);
     onOpenChange(false);
  };
    
  const handleRemoveFromCart = () => {
     if (portionInCart) clearPortionsFromCart(item.id, selectedPortionName);
     onOpenChange(false);
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="sm:max-w-md mx-auto">
        <SheetHeader className="p-4">
          <SheetTitle>{item.name}</SheetTitle>
          <SheetDescription>Customize your order</SheetDescription>
        </SheetHeader>
        <div className="p-4 space-y-4">
            {/* Size Options */}
             <div className="flex flex-wrap gap-2">
                {item.portionOptions?.map((portion) => (
                    <Button
                    key={portion.name}
                    variant={selectedPortionName === portion.name ? "default" : "outline"}
                    onClick={() => setSelectedPortionName(portion.name)}
                    >
                    {portion.name} - {portion.price}
                    </Button>
                ))}
             </div>
             {/* Quantity */}
             <div className="flex items-center gap-4">
                 <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
                 <span>{quantity}</span>
                 <Button variant="outline" size="icon" onClick={() => setQuantity(q => q + 1)}><Plus className="h-4 w-4" /></Button>
             </div>
             <Button className="w-full mt-4" onClick={handleAddToCart}>
                {portionInCart ? "Update" : "Add"} - {(selectedPortion.price * quantity).toFixed(2)}
             </Button>
             {portionInCart && <Button variant="ghost" className="w-full text-red-500" onClick={handleRemoveFromCart}>Remove</Button>}
        </div>
      </SheetContent>
    </Sheet>
  );
};


function TakeawayPageContent() {
  const {
    menuItems,
    takeawayCart,
    clearTakeawayCart,
    incrementTakeawayCartItem,
    decrementTakeawayCartItem,
    tables,
  } = useAppStore();
  
  // State for the Modal
  const [isModalOpen, setIsModalOpen] = useState(true);

  // Order State
  const [orderType, setOrderType] = useState<'takeaway' | 'dine-in'>('takeaway');
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dine In Specifics
  const [selectedTableIds, setSelectedTableIds] = useState<string[]>([]);
  const [guestCount, setGuestCount] = useState<number | string>(1);
  
  // Customer Details
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");


  const categories = useMemo(() => {
    const allCategories = new Set(menuItems.map((item) => item.category));
    return ["All", ...Array.from(allCategories)];
  }, [menuItems]);

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (!item.available) return false;
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeCategory, searchTerm]);
  
  const availableTables = useMemo(() => tables.filter(t => t.status === 'Available'), [tables]);
  
  const cartTotal = useMemo(() => {
    return takeawayCart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [takeawayCart]);

  const handlePlaceOrder = () => {
    // Implement order placement logic here
    console.log({
        orderType,
        customerName,
        mobileNumber,
        tables: selectedTableIds,
        cart: takeawayCart,
        total: cartTotal * 1.18 // Assuming tax
    });
    // Add toast or navigation logic
  };

  return (
    <div className="p-4 flex justify-center items-center min-h-screen bg-gray-50">
        
      {/* Trigger Button (Optional if you want it always open, but good for UX) */}
      <Button onClick={() => setIsModalOpen(true)} className="bg-green-600 hover:bg-green-700">
        Open POS System
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 gap-0 bg-[#F8F9FB] overflow-hidden flex flex-col md:flex-row rounded-xl border-none shadow-2xl">
            
            {/* LEFT COLUMN: Menu Selection */}
            <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-gray-200 bg-white md:bg-[#F8F9FB]">
                
                {/* Header Section */}
                <div className="p-6 bg-white pb-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Button asChild variant="ghost" size="icon" className="h-9 w-9">
                            <Link href="/dashboard" aria-label="Back to Dashboard"><ArrowLeft /></Link>
                        </Button>
                      
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">New Order</h2>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setOrderType('takeaway')}
                                className={cn(
                                    "rounded-md text-sm font-medium transition-all px-6",
                                    orderType === 'takeaway' 
                                        ? "bg-white text-green-600 shadow-sm" 
                                        : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                Takeaway
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setOrderType('dine-in')}
                                className={cn(
                                    "rounded-md text-sm font-medium transition-all px-6",
                                    orderType === 'dine-in' 
                                        ? "bg-white text-green-600 shadow-sm" 
                                        : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                Dine-in
                            </Button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search menu items..."
                            className="pl-11 h-12 bg-gray-50 border-gray-200 rounded-xl focus-visible:ring-green-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Categories */}
                    <ScrollArea className="w-full whitespace-nowrap">
                        <div className="flex items-center gap-3 pb-2">
                        {categories.map((category) => (
                            <Button
                            key={category}
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "rounded-full px-5 h-9 text-sm border font-medium",
                                activeCategory === category 
                                    ? "bg-gray-900 text-white border-gray-900 hover:bg-gray-800 hover:text-white" 
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            )}
                            onClick={() => setActiveCategory(category)}
                            >
                            {category}
                            </Button>
                        ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>

                {/* Menu Grid */}
                <ScrollArea className="flex-1 bg-[#F8F9FB] px-6 py-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
                        {filteredMenuItems.map((item) => (
                            <MenuItemCard key={item.id} item={item} />
                        ))}
                         {filteredMenuItems.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                                <Search className="h-10 w-10 mb-2 opacity-20" />
                                <p>No items found</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* RIGHT COLUMN: Current Order (Cart) */}
            <div className="w-full md:w-[400px] flex flex-col h-full bg-white border-l border-gray-200 shadow-xl z-20">
                
                {/* Cart Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">
                        <ShoppingBag className="h-5 w-5" />
                        Current Order
                    </div>
                    {/* Close button handled by Dialog primitive usually, but can be added here if needed */}
                </div>

                {/* Cart Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <ScrollArea className="flex-1 px-6 py-4">
                        
                        {/* Customer Details Inputs */}
                        <div className="space-y-4 mb-6">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input 
                                    placeholder="Customer Name (Optional)" 
                                    className="pl-9 bg-gray-50 border-gray-200"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input 
                                    placeholder="+91 Mobile Number (Optional)" 
                                    className="pl-9 bg-gray-50 border-gray-200"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Dine In Specifics */}
                        {orderType === 'dine-in' && (
                            <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mb-6 space-y-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-orange-800 uppercase font-bold tracking-wide">Table Selection</Label>
                                    <MultiTableSelect
                                        tables={availableTables}
                                        selectedTableIds={selectedTableIds}
                                        onSelectionChange={setSelectedTableIds}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-orange-800 uppercase font-bold tracking-wide">Guest Count</Label>
                                    <Input 
                                        type="number" 
                                        min="1"
                                        value={guestCount} 
                                        onChange={(e) => setGuestCount(e.target.value)}
                                        className="bg-white border-orange-200 h-9"
                                    />
                                </div>
                            </div>
                        )}

                        <Separator className="mb-4" />

                        {/* Cart Items List */}
                        {takeawayCart.length > 0 ? (
                            <div className="space-y-4">
                                {takeawayCart.map((item) => (
                                    <div key={item.cartItemId} className="flex items-start justify-between group">
                                        <div className="flex-1 pr-2">
                                            <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {item.portion !== "Full" && <span className="mr-1 bg-gray-100 px-1 rounded">{item.portion}</span>}
                                                <IndianRupee className="inline h-2.5 w-2.5" />{item.price.toFixed(0)} x {item.quantity}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-100">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-gray-500 hover:text-red-500 hover:bg-white"
                                                onClick={() => decrementTakeawayCartItem(item.cartItemId)}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-gray-500 hover:text-green-500 hover:bg-white"
                                                onClick={() => incrementTakeawayCartItem(item.cartItemId)}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 opacity-50">
                                <Utensils className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">Cart is empty</p>
                            </div>
                        )}
                    </ScrollArea>

                    {/* Footer / Payment Section */}
                    <div className="p-6 bg-white border-t border-gray-100 mt-auto">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500 text-sm">Subtotal</span>
                            <span className="font-semibold flex items-center"><IndianRupee className="h-3.5 w-3.5" />{cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-500 text-sm">Total Payable</span>
                            <span className="font-bold text-xl flex items-center text-gray-900"><IndianRupee className="h-5 w-5" />{(cartTotal * 1.18).toFixed(2)}</span>
                        </div>

                        <Button 
                            className="w-full bg-[#10B981] hover:bg-[#059669] text-white h-12 text-base font-semibold shadow-lg shadow-green-100"
                            onClick={handlePlaceOrder}
                            disabled={takeawayCart.length === 0}
                        >
                            Place Order <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function TakeawayPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TakeawayPageContent />
        </Suspense>
    )
}
