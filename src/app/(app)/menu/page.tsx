"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
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
import { useAppStore } from "@/context/useAppStore";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { MenuSearchAndFilter } from "@/components/menu/MenuSearchAndFilter";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { MenuItemForm } from "@/components/menu/MenuItemForm";

type AddSheetType = "Item" | "Beverage" | "Combo" | "Sauce" | null;

export default function MenuPage() {
  const { 
    menuItems, 
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem,
    toggleMenuItemAvailability,
    categories,
    addCategory
  } = useAppStore();
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Sheet and dialog state
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [addSheetType, setAddSheetType] = useState<AddSheetType>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  // Speech recognition hook
  const { isListening, toggleListening } = useSpeechRecognition(setSearchTerm);

  // Derived data
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Handlers
  const openAddSheet = (type: AddSheetType) => {
    setAddSheetType(type);
    setEditingItem(null);
    setAddSheetOpen(true);
  };

  const openEditSheet = (item: any) => {
    setEditingItem(item);
    setAddSheetOpen(true);
  };

  const handleFormSubmit = (itemData: any) => {
    if (editingItem) {
      updateMenuItem({ ...editingItem, ...itemData });
    } else {
      addMenuItem(itemData);
    }
    setAddSheetOpen(false);
    setEditingItem(null);
  };

  const openDeleteDialog = (item: any) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (itemToDelete) {
      deleteMenuItem(itemToDelete.id);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName("");
      setCategoryDialogOpen(false);
    }
  };

  const handleAvailabilityToggle = (itemId: number) => {
    toggleMenuItemAvailability(itemId);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Menu Management</h1>
      </div> */}

      <MenuSearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categories={categories}
        isListening={isListening}
        onToggleListening={toggleListening}
        onOpenAdd={openAddSheet}
        onOpenCategoryDialog={() => setCategoryDialogOpen(true)}
      />

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            isRestaurantOnline={true}
            onEdit={() => openEditSheet(item)}
            onDelete={() => openDeleteDialog(item)}
            onToggleAvailability={handleAvailabilityToggle}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No menu items found.</p>
        </div>
      )}

      {/* Add/Edit Sheet */}
      <Sheet open={addSheetOpen} onOpenChange={setAddSheetOpen}>
        <SheetContent side="bottom" className="sm:max-w-md mx-auto p-0 flex flex-col h-full max-h-[90vh]">
          <MenuItemForm
            editingItem={editingItem}
            addSheetType={addSheetType}
            categories={categories.filter(c => c !== "All")}
            onSubmit={handleFormSubmit}
            onCancel={() => setAddSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Create Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Enter a name for the new menu category.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category-name" className="text-right">
                Name
              </Label>
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="col-span-3"
                placeholder="Enter category name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateCategory}>Create Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the menu item
              "{itemToDelete?.name}" from your menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
