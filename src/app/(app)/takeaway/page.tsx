"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  IndianRupee,
  Plus,
  Search,
  X,
  Minus,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/context/useAppStore";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import type { MenuItem, TakeawayCartItem } from "@/context/useAppStore";
import { cn } from "@/lib/utils";

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
      <div className="flex gap-4 border-b pb-6">
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div
              className={cn(
                "inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-sm text-xs font-semibold",
                item.dietaryType === "Veg"
                  ? "border border-green-600 text-green-600"
                  : "border border-red-600 text-red-600"
              )}
            >
              <div
                className={cn(
                  "h-2 w-2 rounded-full border",
                  item.dietaryType === "Veg"
                    ? "bg-green-600 border-green-700"
                    : "bg-red-600 border-red-700"
                )}
              ></div>
              {item.dietaryType}
            </div>
            <h3 className="font-bold text-base mt-2">{item.name}</h3>
            <p className="font-semibold text-sm flex items-center mt-1">
              <IndianRupee className="h-3.5 w-3.5" />
              {item.price.toFixed(0)}
            </p>
          </div>
          <div className="mt-4">
            {quantityInCart > 0 ? (
              <Button
                variant="outline"
                className="h-9 w-32"
                onClick={handleButtonClick}
              >
                <span className="w-full text-center">
                  {quantityInCart} in cart
                </span>
              </Button>
            ) : (
              <Button className="h-9 w-32" onClick={handleButtonClick}>
                Add
              </Button>
            )}
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square w-[120px] bg-muted rounded-md overflow-hidden">
            <Image
              alt={item.name}
              className="w-full h-full object-cover"
              height={120}
              src={item.image}
              width={120}
              data-ai-hint={item.aiHint}
            />
          </div>
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

const ItemSelectionDialog = ({
  isOpen,
  onOpenChange,
  item,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItem;
}) => {
  const { takeawayCart, addToTakeawayCart, clearPortionsFromCart } =
    useAppStore();

  const [selectedPortionName, setSelectedPortionName] = useState(
    item.portionOptions?.[0]?.name || "Full"
  );
  const [quantity, setQuantity] = useState(1);

  const portionInCart = useMemo(() => {
    return takeawayCart.find(
      (cartItem) =>
        cartItem.id === item.id && cartItem.portion === selectedPortionName
    );
  }, [takeawayCart, item.id, selectedPortionName]);

  useEffect(() => {
    if (isOpen) {
      const firstPortionName = item.portionOptions?.[0]?.name || "Full";
      setSelectedPortionName(firstPortionName);
      const cartItem = takeawayCart.find(
        (ci) => ci.id === item.id && ci.portion === firstPortionName
      );
      setQuantity(cartItem?.quantity || 1);
    }
  }, [isOpen, item, takeawayCart]);

  useEffect(() => {
    const cartItem = takeawayCart.find(
      (ci) => ci.id === item.id && ci.portion === selectedPortionName
    );
    setQuantity(cartItem?.quantity || 1);
  }, [selectedPortionName, item.id, takeawayCart]);

  const selectedPortion = useMemo(() => {
    return (
      item.portionOptions?.find((p) => p.name === selectedPortionName) || {
        name: "Full",
        price: item.price,
      }
    );
  }, [item, selectedPortionName]);

  const handleAddToCart = () => {
    if (portionInCart && quantity === portionInCart.quantity) {
      onOpenChange(false);
      return;
    }

    if (portionInCart) {
      clearPortionsFromCart(item.id, selectedPortionName);
    }

    addToTakeawayCart(
      item,
      quantity,
      selectedPortionName,
      selectedPortion.price
    );
    onOpenChange(false);
  };

  const handleRemoveFromCart = () => {
    if (portionInCart) {
      clearPortionsFromCart(item.id, selectedPortionName);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0">
        <DialogHeader className="p-6">
          <DialogTitle>{item.name}</DialogTitle>
          <DialogDescription>Select size and quantity.</DialogDescription>
        </DialogHeader>

        <div className="px-6 space-y-6">
          {item.portionOptions && item.portionOptions.length > 0 && (
            <div className="space-y-3">
              <p className="font-medium">Size</p>
              <div className="flex flex-wrap gap-2">
                {item.portionOptions.map((portion) => (
                  <Button
                    key={portion.name}
                    variant={
                      selectedPortionName === portion.name
                        ? "default"
                        : "outline"
                    }
                    onClick={() => setSelectedPortionName(portion.name)}
                    className="flex-grow sm:flex-grow-0"
                  >
                    {portion.name} -{" "}
                    <IndianRupee className="h-3.5 w-3.5 mx-1" />
                    {portion.price}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="font-medium">Quantity</p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={!portionInCart && quantity === 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold text-lg w-10 text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-muted p-4 mt-6 flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4 border-t">
          <p className="font-bold text-xl flex items-center">
            Total: <IndianRupee className="h-5 w-5 mx-1" />
            {(selectedPortion.price * quantity).toFixed(2)}
          </p>
          <div className="flex gap-2 w-full sm:w-auto">
            {portionInCart ? (
              <Button
                variant="ghost"
                className="text-destructive flex-1 sm:flex-initial"
                onClick={handleRemoveFromCart}
              >
                Remove
              </Button>
            ) : (
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            )}
            <Button
              onClick={handleAddToCart}
              className="flex-1 sm:flex-initial"
            >
              {portionInCart ? "Update Cart" : "Add to Cart"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function TakeawayPage() {
  const {
    menuItems,
    takeawayCart,
    clearTakeawayCart,
    incrementTakeawayCartItem,
    decrementTakeawayCartItem,
  } = useAppStore();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

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

  const cartTotal = useMemo(() => {
    return takeawayCart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [takeawayCart]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold md:text-3xl">Takeaway Orders</h1>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search food items..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex items-center gap-2 pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  className="capitalize rounded-full flex-shrink-0"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <div className="space-y-6">
          {filteredMenuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
          {filteredMenuItems.length === 0 && (
            <div className="text-center py-16 text-muted-foreground col-span-full">
              <p>No items match your search.</p>
            </div>
          )}
        </div>
      </div>

      <Card className="lg:sticky lg:top-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Current Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          {takeawayCart.length > 0 ? (
            <div className="space-y-4">
              <div className="max-h-64 overflow-y-auto pr-2 space-y-4">
                {takeawayCart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-start justify-between gap-2"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm leading-tight">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.portion !== "Full" && `(${item.portion})`}{" "}
                        <span className="flex items-center">
                          <IndianRupee className="h-3 w-3" />
                          {item.price.toFixed(2)}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          decrementTakeawayCartItem(item.cartItemId)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-bold text-sm w-6 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          incrementTakeawayCartItem(item.cartItemId)
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="font-semibold text-sm w-16 text-right flex items-center justify-end">
                      <IndianRupee className="h-3.5 w-3.5" />
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Subtotal</p>
                  <p className="font-medium flex items-center">
                    <IndianRupee className="h-3.5 w-3.5" />
                    {cartTotal.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Taxes (18% GST)</p>
                  <p className="font-medium flex items-center">
                    <IndianRupee className="h-3.5 w-3.5" />
                    {(cartTotal * 0.18).toFixed(2)}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <p>Total</p>
                <p className="flex items-center">
                  <IndianRupee className="h-5 w-5" />
                  {(cartTotal * 1.18).toFixed(2)}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-16">
              <ShoppingCart className="h-12 w-12 mx-auto mb-2" />
              <p>Your order is empty.</p>
              <p className="text-xs">Add items from the menu to get started.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2 border-t pt-4">
          <Link href="/takeaway/checkout" className="w-full">
            <Button className="w-full" disabled={takeawayCart.length === 0}>
              Proceed to Pay <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full text-destructive"
            onClick={clearTakeawayCart}
            disabled={takeawayCart.length === 0}
          >
            Clear Order
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
