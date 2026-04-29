"use client";

import { useState, useMemo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAdd, useGet, useMutationRequestDynamic, usePut, useQueryHelpers } from "@/hooks/useApi";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useAppStore } from "@/context/useAppStore";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

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
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { MenuItemForm } from "@/components/menu/MenuItemForm";
import { MenuSearchAndFilter } from "@/components/menu/MenuSearchAndFilter";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { PaginationControls } from "@/components/pagination/PaginationControls";
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
    setCategories,
    subCategories,
    setSubCategories,
    addCategory,
    updateMenuItem,
    deleteMenuItem,
    branches,
    selectedBranch,
  } = useAppStore();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSubCategory, setActiveSubCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);
  const { toast } = useToast();
  const [pendingNewItem, setPendingNewItem] = useState<any | null>(null);
  const { invalidate, set } = useQueryHelpers();

  // Get the current branch's restaurantId
  const currentBranch = branches.find(branch => branch.id === selectedBranch);
  const restaurantId = (currentBranch as any)?.restaurantId;

  const { data: apiMenuData, error: apiError, isLoading } = useGet<{
    success: boolean;
    message: string;
    data: Array<{
      _id: string;
      itemId?: string;
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
      nextCursor: string | null;
      hasNextPage: boolean;
    };
  }>(
    ['menu-items', restaurantId || '', currentPage, activeCategory, activeSubCategory],
    `/api/menu/getitems/${restaurantId}`,
    { 
      cursor: cursorHistory[currentPage - 1] || undefined, 
      limit: 10,
      category: activeCategory,
      subCategory: activeSubCategory
    },
    {
      enabled: !!restaurantId,
    }
  );

  // Fetch categories and sub-categories
  const { data: categoryData } = useGet<{
    success: boolean;
    data: {
      categories: any[];
      subCategories: any[];
    }
  }>(
    ['categories-and-sub', selectedBranch || ''],
    `/api/categories/${selectedBranch}/all`,
    {},
    { enabled: !!selectedBranch }
  );


  useEffect(() => {
    if (categoryData?.success) {
      // Ensure we only store objects with a 'name' property to avoid corruption
      const cats = Array.isArray(categoryData.data.categories) 
        ? categoryData.data.categories.map((c: any) => typeof c === 'string' ? { name: c } : c)
        : [];
      const subCats = Array.isArray(categoryData.data.subCategories) 
        ? categoryData.data.subCategories.map((s: any) => typeof s === 'string' ? { name: s } : s)
        : [];
      
      setCategories([{ name: "All" }, ...cats]);
      setSubCategories([{ name: "All" }, ...subCats]);
    }
  }, [categoryData, setCategories, setSubCategories]);

  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  // Search API call (enabled only when user pauses typing)
  const { data: apiSearchData, error: searchError, isLoading: isSearchLoading } = useGet<{
    success: number;
    count: number;
    data: Array<{
      name: string;
      description: string;
      category: string;
      images: string[];
    }>;
  }>(
    ['menu-search', restaurantId || '', debouncedSearchTerm, activeCategory !== 'All' ? activeCategory : '', activeSubCategory !== 'All' ? activeSubCategory : ''],
    `/api/menu/${restaurantId}/search`,
    { 
      query: debouncedSearchTerm, 
      category: activeCategory !== 'All' ? activeCategory : '',
      subCategory: activeSubCategory !== 'All' ? activeSubCategory : ''
    },
    {
      enabled: !!restaurantId && debouncedSearchTerm.length > 0,
    }
  );

  useEffect(() => {
    if (searchError) {
      toast({
        variant: 'destructive',
        title: 'Search failed',
        description: 'Could not fetch search results. Please try again.',
      });
    }
  }, [searchError, toast]);

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

  // Transform API data (paged) to MenuItem format
  const transformedMenuItems = useMemo(() => {
    if (!apiMenuData?.data) return menuItems;
    
    return apiMenuData.data.map((item: any, index: number) => ({
      id: Date.now() + index, // Generate unique ID
      itemId: item.itemId ?? item._id,
      name: item.name,
      description: item.description,
      price: item.pricing_options?.[0]?.price || 0,
      category: item.category,
      subCategory: item.subCategory,
      image: item.images?.[0] || "https://placehold.co/300x200.png",
      images: item.images,
      aiHint: item.name.toLowerCase(),
      available: item.available,
      dietaryType: item.dietaryType || 'Veg',
      badges: item.badges || [],
      allowedAddons: item.allowedAddons || [],
      allowedToppings: item.allowedToppings || [],
      servingSize: item.servingSize,
      piecesInfo: item.piecesInfo || [],
      availableFor: item.availableFor || ["Delivery", "Takeaway", "Dine-In"],
      gstCategory: item.gstCategory || "Freshly Prepared Item",
      gstIncluded: item.gstIncluded ?? true,
      pricing_options: item.pricing_options || [],
      pricing_unit: item.pricing_unit || 'quantity',
      portionOptions: item.pricing_unit === 'size'
        ? item.pricing_options?.map((option: any) => ({
            name: option.label,
            price: option.price
          }))
        : undefined
    }));
  }, [apiMenuData, menuItems]);

  // Transform Search API data to MenuItem format
  const transformedSearchItems = useMemo(() => {
    const src = apiSearchData?.data ?? [];
    return src.map((item: any, index: number) => ({
      id: Date.now() + index,
      itemId: item.itemId ?? item._id,
      name: item.name,
      description: item.description,
      price: 0,
      category: item.category,
      subCategory: item.subCategory,
      image: item.images?.[0] || 'https://placehold.co/300x200.png',
      images: item.images,
      aiHint: item.name.toLowerCase(),
      available: item.available ?? true,
      dietaryType: item.dietaryType || 'Veg',
      badges: item.badges || [],
      allowedAddons: item.allowedAddons || [],
      allowedToppings: item.allowedToppings || [],
      servingSize: item.servingSize,
      piecesInfo: item.piecesInfo || [],
      availableFor: item.availableFor || ["Delivery", "Takeaway", "Dine-In"],
      gstCategory: item.gstCategory || "Freshly Prepared Item",
      gstIncluded: item.gstIncluded ?? true,
      pricing_unit: item.pricing_unit || 'quantity',
      portionOptions: item.pricing_unit === 'size'
        ? item.pricing_options?.map((option: any) => ({
            name: option.label,
            price: option.price
          }))
        : undefined,
    }));
  }, [apiSearchData]);

  // Use transformed data if API data is available, otherwise use store data
  const displayMenuItems = apiMenuData?.data ? transformedMenuItems : menuItems;

  // API hook for adding menu items (kept intact)
  const addMenuItemMutation = useAdd({
    onMutate: async () => {
      if (!restaurantId || !pendingNewItem) return;
      const key = ['menu-items', restaurantId, currentPage, { page: currentPage, limit: 10 }];
      const current: any = apiMenuData ?? { data: [], pagination: { currentPage, itemsPerPage: 10, totalItems: 0, totalPages: 1, hasNextPage: false, hasPreviousPage: false } };
      const optimisticServerItem = {
        _id: `temp-${Date.now()}`,
        itemId: `temp-${Date.now()}`,
        restaurantId,
        name: pendingNewItem.name,
        description: pendingNewItem.description,
        type: pendingNewItem.type || 'item',
        category: pendingNewItem.category,
        subCategory: pendingNewItem.subCategory,
        dietaryType: pendingNewItem.dietaryType,
        badges: pendingNewItem.badges || [],
        allowedAddons: pendingNewItem.allowedAddons || [],
        allowedToppings: pendingNewItem.allowedToppings || [],
        servingSize: pendingNewItem.servingSize,
        piecesInfo: pendingNewItem.piecesInfo || [],
        availableFor: pendingNewItem.availableFor || [],
        gstCategory: pendingNewItem.gstCategory || "Freshly Prepared Item",
        gstIncluded: pendingNewItem.gstIncluded ?? true,
        images: pendingNewItem.images && pendingNewItem.images.length > 0 ? pendingNewItem.images : ['https://placehold.co/300x200.png'],
        available: !!pendingNewItem.available,
        pricing_unit: pendingNewItem.pricing_unit || 'quantity',
        pricing_options: pendingNewItem.pricing_options || [],
        portions: pendingNewItem.portions || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = {
        ...current,
        data: [...(current?.data || []), optimisticServerItem],
        pagination: {
          ...current?.pagination,
          totalItems: (current?.pagination?.totalItems || 0) + 1,
          totalPages: Math.max(1, Math.ceil(((current?.pagination?.totalItems || 0) + 1) / (current?.pagination?.itemsPerPage || 10))),
        },
      };
      set(key, updated);
    },
    onSuccess: () => {
      toast({
        title: "Menu Item Added",
        description: "The menu item has been successfully added to the restaurant.",
      });
      setPendingNewItem(null);
      if (restaurantId) {
        invalidate(['menu-items', restaurantId, currentPage]);
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error Adding Menu Item",
        description: "Failed to add the menu item. Please try again.",
      });
      console.error("Error adding menu item:", error);
      if (restaurantId) {
        invalidate(['menu-items', restaurantId, currentPage]);
      }
    },
  });

  // Mutation for adding categories
  const addCategoryMutation = useMutationRequestDynamic<any, { url: string; data: any }>(
  "POST",
  (vars) => vars.url,
  (vars) => vars.data,
  {
    onSuccess: () => {
      toast({
        title: "Category Added",
        description: "New category has been added successfully.",
      });
      // ✅ FIX: Match the fetch key exactly
      invalidate(['categories-and-sub', selectedBranch || '']); 
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add category.",
      });
    },
  }
);

  // Mutation for adding sub-categories
const addSubCategoryMutation = useMutationRequestDynamic<any, { url: string; data: any }>(
  "POST",
  (vars) => vars.url,
  (vars) => vars.data,
  {
    onSuccess: () => {
      toast({
        title: "Sub-Category Added",
        description: "New sub-category has been added successfully.",
      });
      // ✅ FIX: Match the fetch key exactly
      invalidate(['categories-and-sub', selectedBranch || '']); 
    },
    // ...
  }
);

  const [activeSheet, setActiveSheet] = useState<AddSheetType>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  // Edit API coordination state
  const [editTarget, setEditTarget] = useState<{ itemId: string } | null>(null);
  const [pendingUpdatePayload, setPendingUpdatePayload] = useState<any | null>(null);

  // Build dynamic update URL based on restaurantId and edit target
  const updateUrl = restaurantId && editTarget?.itemId
    ? `/api/menu/updateitems/${restaurantId}/${editTarget.itemId}`
    : `/api/menu/updateitems/${restaurantId ?? ''}/`;

  // PUT mutation for editing menu items
  const updateMenuItemMutation = usePut<any, any>(updateUrl, {
    onSuccess: () => {
      toast({
        title: "Menu Item Updated",
        description: "The menu item has been updated successfully.",
      });
      // Ensure UI reflects latest server state
      if (restaurantId) {
        invalidate(['menu-items', restaurantId, currentPage]);
      }
      setEditTarget(null);
      setPendingUpdatePayload(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error Updating Menu Item",
        description: "Failed to update the menu item. Please try again.",
      });
      console.error("Error updating menu item:", error);
      // Re-sync with server on failure too
      if (restaurantId) {
        invalidate(['menu-items', restaurantId, currentPage]);
      }
      setEditTarget(null);
      setPendingUpdatePayload(null);
    },
  });

  // Trigger mutation after URL becomes valid and payload is ready
  useEffect(() => {
    if (restaurantId && editTarget?.itemId && pendingUpdatePayload) {
      updateMenuItemMutation.mutate(pendingUpdatePayload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId, editTarget?.itemId, pendingUpdatePayload]);

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSubCategoryDialogOpen, setIsSubCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubCategoryName, setNewSubCategoryName] = useState("");

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  const { isListening, toggleListening } = useSpeechRecognition((transcript) => {
    setSearchTerm(transcript);
  });

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

  // Toggle availability via PUT with optimistic UI
  const [toggleTarget, setToggleTarget] = useState<{ itemId: string } | null>(null);
  const [pendingTogglePayload, setPendingTogglePayload] = useState<any | null>(null);
  const [pendingToggleInfo, setPendingToggleInfo] = useState<{ itemId: string; nextAvailable: boolean } | null>(null);

  const toggleUrl = restaurantId && toggleTarget?.itemId
    ? `/api/menu/updateitems/${restaurantId}/${toggleTarget.itemId}`
    : `/api/menu/updateitems/${restaurantId ?? ''}/`;

  const toggleAvailabilityMutation = usePut<any, any>(toggleUrl, {
    onSuccess: () => {
      toast({
        title: "Availability Updated",
        description: "Menu item availability has been updated.",
      });
      if (restaurantId) {
        invalidate(['menu-items', restaurantId, currentPage]);
      }
      setToggleTarget(null);
      setPendingTogglePayload(null);
      setPendingToggleInfo(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error Updating Availability",
        description: "Failed to update availability. Restoring previous state.",
      });
      console.error('Error updating availability', error);
      if (restaurantId && pendingToggleInfo) {
        const key = ['menu-items', restaurantId, currentPage, { page: currentPage, limit: 10 }];
        const current = apiMenuData as any;
        if (current?.data) {
          const reverted = {
            ...current,
            data: current.data.map((i: any) => ((i.itemId ?? i._id) === pendingToggleInfo.itemId ? { ...i, available: !pendingToggleInfo.nextAvailable } : i)),
          };
          set(key, reverted);
        }
      }
      setToggleTarget(null);
      setPendingTogglePayload(null);
      setPendingToggleInfo(null);
      if (restaurantId) {
        invalidate(['menu-items', restaurantId, currentPage]);
      }
    },
  });

  useEffect(() => {
    if (restaurantId && toggleTarget?.itemId && pendingTogglePayload) {
      toggleAvailabilityMutation.mutate(pendingTogglePayload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId, toggleTarget?.itemId, pendingTogglePayload]);

  const handleToggleAvailability = (item: MenuItem, nextAvailable: boolean) => {
    if (!restaurantId || !item.itemId) {
      toast({
        variant: 'destructive',
        title: 'Missing Identifiers',
        description: 'Cannot update availability without restaurant and item IDs.',
      });
      return;
    }

    const key = ['menu-items', restaurantId, currentPage, { page: currentPage, limit: 10 }];
    const current = apiMenuData as any;
    if (current?.data) {
      const updated = {
        ...current,
        data: current.data.map((i: any) => ((i.itemId ?? i._id) === item.itemId ? { ...i, available: nextAvailable } : i)),
      };
      set(key, updated);
    } else {
      toggleMenuItemAvailability(item.id);
    }

    const payload = {
      name: item.name,
      description: item.description,
      available: nextAvailable,
      type: 'item',
      category: item.category,
      images: [item.image || 'https://placehold.co/300x200.png'],
      pricing_unit: 'quantity',
      pricing_options: item.portionOptions && item.portionOptions.length > 0
        ? item.portionOptions.map((p) => ({ label: p.name, price: p.price }))
        : [{ label: 'Regular', price: item.price, default: true }],
    };
    setPendingToggleInfo({ itemId: item.itemId!, nextAvailable });
    setToggleTarget({ itemId: item.itemId! });
    setPendingTogglePayload(payload);
  };

  // Pagination and category helpers
  const itemsPerPage = apiMenuData?.pagination?.itemsPerPage ?? 10;
  const isFiltering = debouncedSearchTerm.length > 0;

  let pageItems: MenuItem[] = [];
  let computedTotalItems = 0;
  let computedTotalPages = 1;
  let startIndex = 0;
  let endIndex = 0;

  if (isFiltering) {
    const searchList = transformedSearchItems;
    const totalItems = searchList.length;
    computedTotalItems = totalItems;
    computedTotalPages = Math.max(1, Math.ceil((totalItems || 0) / itemsPerPage));
    startIndex = Math.min((currentPage - 1) * itemsPerPage, Math.max(0, totalItems - 1));
    endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    pageItems = searchList.slice(startIndex, endIndex);
  } else {
    const apiTotalItems = apiMenuData?.pagination?.totalItems ?? displayMenuItems.length;
    computedTotalItems = apiTotalItems;
    computedTotalPages = Math.max(1, Math.ceil((apiTotalItems || 0) / itemsPerPage));
    startIndex = Math.min((currentPage - 1) * itemsPerPage, Math.max(0, apiTotalItems - 1));
    endIndex = Math.min(startIndex + itemsPerPage, apiTotalItems);
    pageItems = displayMenuItems;
  }

  useEffect(() => {
    setCurrentPage(1);
    setCursorHistory([]);
  }, [debouncedSearchTerm, activeCategory, activeSubCategory]);

  useEffect(() => {
    if (apiMenuData?.pagination?.nextCursor && !cursorHistory[currentPage]) {
      const newHistory = [...cursorHistory];
      newHistory[currentPage] = apiMenuData.pagination.nextCursor;
      setCursorHistory(newHistory);
    }
  }, [apiMenuData, currentPage, cursorHistory]);

  const availableCategories = useMemo(
    () => categories.filter((c) => {
      const name = typeof c === 'string' ? c : c.name;
      return name !== "All";
    }),
    [categories]
  );

  const handleAddCategory = () => {
    if (newCategoryName.trim() && restaurantId) {
      addCategoryMutation.mutate({
        url: `/api/categories/${restaurantId}/category`,
        data: { name: newCategoryName.trim() }
      });
      setNewCategoryName("");
      setIsCategoryDialogOpen(false);
    }
  };

  const handleAddSubCategory = () => {
    if (newSubCategoryName.trim() && restaurantId) {
      addSubCategoryMutation.mutate({
        url: `/api/categories/${restaurantId}/subcategory`,
        data: { 
          name: newSubCategoryName.trim()
        }
      });
      setNewSubCategoryName("");
      setIsSubCategoryDialogOpen(false);
    }
  };

  // Removed legacy save handler and pricing helpers; MenuItemForm handles form interactions

  return (
    <div className="flex flex-col gap-6">
      <MenuSearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categories={categories}
        activeSubCategory={activeSubCategory}
        onSubCategoryChange={setActiveSubCategory}
        subCategories={subCategories}
        isListening={isListening}
        onToggleListening={toggleListening}
        onOpenAdd={handleOpenAdd}
        onOpenCategoryDialog={() => setIsCategoryDialogOpen(true)}
        onOpenSubCategoryDialog={() => setIsSubCategoryDialogOpen(true)}
      />

      {/* Removed results badge to keep pagination UI simple */}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {(isFiltering ? isSearchLoading : (isLoading && restaurantId)) ? (
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
              key={(item as any).itemId ?? (item as any)._id ?? item.id}
              item={item}
              isRestaurantOnline={isRestaurantOnline}
              onToggleAvailability={(targetItem, nextAvailable) => handleToggleAvailability(targetItem, nextAvailable)}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          ))
        )}
        {!isFiltering && !isLoading && pageItems.length === 0 && (
          <div className="text-center py-16 text-muted-foreground col-span-full">
            <p>No {activeCategory.toLowerCase()} items to show.</p>
          </div>
        )}
        {isFiltering && !isSearchLoading && pageItems.length === 0 && (
          <div className="text-center py-16 text-muted-foreground col-span-full">
            <p>No results for "{debouncedSearchTerm}"{activeCategory !== 'All' ? ` in ${activeCategory}` : ''}.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {computedTotalItems > 0 && computedTotalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={computedTotalPages}
          onPageChange={setCurrentPage}
          className="mt-8"
        />
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
          className="sm:max-w-4xl mx-auto p-0 flex flex-col h-full max-h-[92vh] rounded-t-[32px] overflow-hidden border-none shadow-2xl"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Menu Item Form</SheetTitle>
            <SheetDescription>Fill in the details for the menu item.</SheetDescription>
          </SheetHeader>
          <MenuItemForm
            editingItem={editingItem}
            addSheetType={activeSheet}
            categories={availableCategories}
            subCategories={subCategories}
            onSubmit={(itemData) => {
              // If editing, update local store with full MenuItem object
              if (editingItem) {
                updateMenuItem({ ...editingItem, ...itemData });
                // Prepare and send API update if we have required identifiers
                if (!restaurantId) {
                  toast({
                    variant: "destructive",
                    title: "Restaurant ID Missing",
                    description: "Please select a valid branch with restaurant ID.",
                  });
                } else {
                  const targetId = (editingItem as any)?.itemId;
                  if (!targetId) {
                    // If editing an item without backend id, skip API call
                    toast({
                      variant: "destructive",
                      title: "Item ID Missing",
                      description: "This item lacks a backend ID; cannot update on server.",
                    });
                  } else {
                    const existingImages: string[] = Array.isArray((editingItem as any)?.images)
                      ? ((editingItem as any).images as string[])
                      : ((editingItem as any)?.image ? [ (editingItem as any).image as string ] : []);

                    const isImageDelivery = (url: string): boolean => {
                      try { return new URL(url).hostname.endsWith("imagedelivery.net"); } catch { return url.includes("imagedelivery.net"); }
                    };

                    const retained = existingImages.filter(url => !isImageDelivery(url));
                    const nextImages = itemData.images && itemData.images.length > 0 
                      ? itemData.images 
                      : retained.length > 0 ? retained : ["https://placehold.co/300x200.png"];

                    const payload = {
                      ...itemData,
                      images: nextImages
                    };
                    setPendingUpdatePayload(payload);
                    setEditTarget({ itemId: targetId });
                  }
                }
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

              const apiPayload = {
                restaurantId,
                ...itemData
              };

              setPendingNewItem(itemData);
              addMenuItemMutation.mutate(apiPayload);
              setActiveSheet(null);
              setEditingItem(null);
            }}
            onCancel={() => setActiveSheet(null)}
          />
        </SheetContent>
      </Sheet>

      <Sheet open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <SheetContent side="bottom" className="sm:max-w-md mx-auto p-0 flex flex-col h-full max-h-[70vh] rounded-t-[32px] overflow-hidden border-none shadow-2xl">
          <SheetHeader className="p-6 pb-4 border-b">
            <SheetTitle>Create New Category</SheetTitle>
            <SheetDescription>Enter a name for your new food category.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid gap-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g. Beverages"
              />
            </div>
          </div>
          <SheetFooter className="p-6 border-t flex justify-center gap-2">
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={isSubCategoryDialogOpen} onOpenChange={setIsSubCategoryDialogOpen}>
        <SheetContent side="bottom" className="sm:max-w-md mx-auto p-0 flex flex-col h-full max-h-[70vh] rounded-t-[32px] overflow-hidden border-none shadow-2xl">
          <SheetHeader className="p-6 pb-4 border-b">
            <SheetTitle>Create New Sub Category</SheetTitle>
            <SheetDescription>Enter a name for your new sub category.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid gap-2">
              <Label htmlFor="subcategory-name">Sub Category Name</Label>
              <Input
                id="subcategory-name"
                value={newSubCategoryName}
                onChange={(e) => setNewSubCategoryName(e.target.value)}
                placeholder="e.g. Cold Coffee"
              />
            </div>
          </div>
          <SheetFooter className="p-6 border-t flex justify-center gap-2">
            <Button variant="outline" onClick={() => setIsSubCategoryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSubCategory}>Add Sub Category</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Floating Add Button */}
      <div className="fixed bottom-32 lg:bottom-10 right-6 lg:right-10 z-50">
        <Button 
          onClick={() => {
            setEditingItem(null);
            setActiveSheet("Item");
          }}
          className="h-14 bg-[#2563EB] text-white rounded-2xl px-8 flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/40 active:scale-95 transition-all"
        >
          <span className="text-[16px] font-black uppercase tracking-widest">Add</span>
        </Button>
      </div>

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
