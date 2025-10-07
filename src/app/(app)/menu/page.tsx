"use client";

import { useState, useMemo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAdd, useGet } from "@/hooks/useApi";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch"; // unused here
import { useAppStore } from "@/context/useAppStore";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // unused
// import { Textarea } from "@/components/ui/textarea"; // unused
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
import type { MenuItem } from "@/context/useAppStore";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"; // unused
// import { Separator } from "@/components/ui/separator"; // unused
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // unused
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { MenuItemForm } from "@/components/menu/MenuItemForm";
import { MenuSearchAndFilter } from "@/components/menu/MenuSearchAndFilter";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useFilteredPagination } from "@/hooks/useFilteredPagination";
import { buildMenuItemApiPayload } from "@/lib/menuUtils";

// Removed legacy local form state; MenuItemForm manages its own form values

// Speech recognition types are provided by the browser; avoid declaring globals to prevent conflicts

type AddSheetType = "Item" | "Beverage" | "Combo" | "Sauce" | null;

export default function MenuPage() {
  const {
    menuItems,
    toggleMenuItemAvailability,
    isRestaurantOnline,
    addMenuItem,
    categories,
    addCategory,
    updateMenuItem,
    deleteMenuItem,
    branches,
    selectedBranch,
  } = useAppStore();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const [pendingNewItem, setPendingNewItem] = useState<any | null>(null);

  // Get the current branch's restaurantId
  const currentBranch = branches.find(branch => branch.id === selectedBranch);
  const restaurantId = (currentBranch as any)?.restaurantId;

  // API call to fetch menu items from database
  const { data: apiMenuData, error: apiError, isLoading } = useGet<{
    success: boolean;
    message: string;
    data: Array<{
      _id: string;
      restaurantId: string;
      name: string;
      description: string;
      type: string;
      category: string;
      images: string[];
      available: boolean;
      pricing_unit: string;
      pricing_options: Array<{
        label: string;
        price: number;
        default?: boolean;
      }>;
      portions: string[];
      createdAt: string;
      updatedAt: string;
    }>;
    pagination: {
      currentPage: number;
      itemsPerPage: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }>(
    ['menu-items', restaurantId || '', currentPage],
    `/api/menu/getitems/${restaurantId}`,
      // `https://backend.crevings.com/api/menu/getitems/${restaurantId}`,
    { page: currentPage, limit: 10 },
    {
      enabled: !!restaurantId,
    }
  );

  // Show a toast when the menu fetch encounters an error
  useEffect(() => {
    if (apiError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Some error occurred while fetching data",
      });
    }
  }, [apiError, toast]);

  // Transform API data to MenuItem format
  const transformedMenuItems = useMemo(() => {
    if (!apiMenuData?.data) return menuItems;
    
    return apiMenuData.data.map((item, index) => ({
      id: Date.now() + index, // Generate unique ID
      name: item.name,
      description: item.description,
      price: item.pricing_options[0]?.price || 0,
      category: item.category,
      image: item.images[0] || "https://placehold.co/300x200.png",
      aiHint: item.name.toLowerCase(),
      available: item.available,
      dietaryType: 'Veg' as const, // Default to Veg, could be enhanced based on API data
      portionOptions: item.pricing_options.length > 1 
        ? item.pricing_options.map(option => ({
            name: option.label,
            price: option.price
          }))
        : undefined
    }));
  }, [apiMenuData, menuItems]);

  // Use transformed data if API data is available, otherwise use store data
  const displayMenuItems = apiMenuData?.data ? transformedMenuItems : menuItems;

  // API hook for adding menu items
  const addMenuItemMutation = useAdd({
    onSuccess: (data) => {
      toast({
        title: "Menu Item Added",
        description: "The menu item has been successfully added to the restaurant.",
      });
      // Also add to local store for immediate UI update using the last submitted item
      if (pendingNewItem) {
        const localItem = {
          id: Date.now(),
          name: pendingNewItem.name,
          description: pendingNewItem.description,
          price: pendingNewItem.price,
          category: pendingNewItem.category,
          available: pendingNewItem.available,
          image: pendingNewItem.image || "https://placehold.co/300x200.png",
          aiHint: pendingNewItem.aiHint || pendingNewItem.name.toLowerCase(),
          dietaryType: (pendingNewItem?.dietaryType === 'Non-Veg' ? 'Non-Veg' : 'Veg') as MenuItem['dietaryType'],
        };
        addMenuItem(localItem as any);
        setPendingNewItem(null);
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error Adding Menu Item",
        description: "Failed to add the menu item. Please try again.",
      });
      console.error("Error adding menu item:", error);
    },
  });

  const [activeSheet, setActiveSheet] = useState<AddSheetType>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  const { isListening, toggleListening } = useSpeechRecognition((transcript) => {
    setSearchTerm(transcript);
  });

  // Voice recognition is handled by useSpeechRecognition hook

  // Removed legacy local form handlers; MenuItemForm manages these internally

  // Pagination logic that respects search and category filters
  const itemsPerPage = apiMenuData?.pagination?.itemsPerPage ?? 10;
  const {
    pageItems,
    totalItems: computedTotalItems,
    totalPages: computedTotalPages,
    startIndex,
    endIndex,
  } = useFilteredPagination(
    displayMenuItems,
    activeCategory,
    searchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    apiMenuData?.pagination?.totalItems
  );

  const handleOpenAdd = (type: AddSheetType) => {
    setEditingItem(null);
    setActiveSheet(type);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setActiveSheet("Item");
  };

  const handleOpenDelete = (item: MenuItem) => {
    setItemToDelete(item);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteMenuItem(itemToDelete.id);
      setIsDeleteAlertOpen(false);
      setItemToDelete(null);
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName("");
      setIsCategoryDialogOpen(false);
    }
  };

  const availableCategories = useMemo(
    () => categories.filter((c) => c !== "All"),
    [categories]
  );

  // Whether the list is currently filtered by search or category
  const isFilteredMode = searchTerm.trim() !== "" || activeCategory !== "All";

  // Removed legacy save handler and pricing helpers; MenuItemForm handles form interactions

  return (
    <div className="flex flex-col gap-6">
      <MenuSearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categories={categories}
        isListening={isListening}
        onToggleListening={toggleListening}
        onOpenAdd={handleOpenAdd}
        onOpenCategoryDialog={() => setIsCategoryDialogOpen(true)}
      />

      {/* Results mode badge */}
      <div className="flex justify-end">
        <Badge variant={isFilteredMode ? "secondary" : "outline"}>
          {isFilteredMode
            ? `Filtered results: ${computedTotalItems}`
            : `All results: ${computedTotalItems}`}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading && restaurantId ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={`loading-${index}`} className="flex flex-col overflow-hidden shadow-sm">
              <div className="aspect-[3/2] w-full bg-muted animate-pulse" />
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-muted animate-pulse rounded w-20" />
                <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
                <div className="h-4 bg-muted animate-pulse rounded w-full" />
                <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
              </CardContent>
            </Card>
          ))
        ) : (
          pageItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              isRestaurantOnline={isRestaurantOnline}
              onToggleAvailability={toggleMenuItemAvailability}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          ))
        )}
        {!isLoading && pageItems.length === 0 && (
          <div className="text-center py-16 text-muted-foreground col-span-full">
            <p>No {activeCategory.toLowerCase()} items to show.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {computedTotalItems > 0 && computedTotalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: computedTotalPages }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                className="w-10 h-10"
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(computedTotalPages, prev + 1))}
            disabled={currentPage === computedTotalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Pagination Info */}
      {computedTotalItems > 0 && (
        <div className="text-center text-sm text-muted-foreground mt-4">
          Showing {startIndex + 1} to {endIndex} of {computedTotalItems} items
        </div>
      )}

      {/* Add/Edit Sheet */}
      <Sheet
        open={!!activeSheet}
        onOpenChange={(isOpen) => !isOpen && setActiveSheet(null)}
      >
        <SheetContent
          side="bottom"
          className="sm:max-w-3xl mx-auto p-0 flex flex-col h-full max-h-[90vh]"
        >
          <MenuItemForm
            editingItem={editingItem}
            addSheetType={activeSheet}
            categories={availableCategories}
            onSubmit={(itemData) => {
              // If editing, update local store with full MenuItem object
              if (editingItem) {
                updateMenuItem({ ...editingItem, ...itemData });
                setActiveSheet(null);
                setEditingItem(null);
                return;
              }

              // Adding new item via API
              if (!restaurantId) {
                toast({
                  variant: "destructive",
                  title: "Restaurant ID Missing",
                  description: "Please select a valid branch with restaurant ID.",
                });
                return;
              }

              const apiPayload = buildMenuItemApiPayload(
                restaurantId,
                itemData,
                activeSheet
              );

              setPendingNewItem(itemData);
              addMenuItemMutation.mutate(apiPayload);
              setActiveSheet(null);
              setEditingItem(null);
            }}
            onCancel={() => setActiveSheet(null)}
          />
        </SheetContent>
      </Sheet>

      {/* Add Category Dialog */}
      <AlertDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Category</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a name for your new food category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4  flex flex-col gap-2">
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g. Beverages"
            />
          </div>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              menu item "{itemToDelete?.name}".
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
  );
}
