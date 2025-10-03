"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Upload } from "lucide-react";

type AddSheetType = "Item" | "Beverage" | "Combo" | "Sauce" | null;

interface MenuItemFormProps {
  editingItem: any;
  addSheetType: AddSheetType;
  categories: string[];
  onSubmit: (itemData: any) => void;
  onCancel: () => void;
}

export function MenuItemForm({
  editingItem,
  addSheetType,
  categories,
  onSubmit,
  onCancel,
}: MenuItemFormProps) {
  const [formData, setFormData] = useState({
    name: editingItem?.name || "",
    description: editingItem?.description || "",
    price: editingItem?.price?.toString() || "",
    category: editingItem?.category || "",
    available: editingItem?.available ?? true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      console.log("File selected:", file.name);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.price) {
      return;
    }

    const itemData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      available: formData.available,
      dietaryType: "Veg" as const,
      image: "https://placehold.co/300x200.png",
      aiHint: formData.name.toLowerCase(),
    };

    onSubmit(itemData);
  };

  return (
    <>
      <SheetHeader className="p-6 pb-4 border-b">
        <SheetTitle>
          {editingItem ? "Edit" : "Add"} {addSheetType}
        </SheetTitle>
        <SheetDescription>
          {editingItem
            ? `Update the details for this ${addSheetType?.toLowerCase()}.`
            : `Fill in the details to add a new ${addSheetType?.toLowerCase()} to your menu.`}
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder={`Enter ${addSheetType?.toLowerCase()} name`}
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder={`Describe your ${addSheetType?.toLowerCase()}`}
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleInputChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            type="number"
            placeholder="0"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
          />
        </div>

        <div className="grid gap-4">
          <Label className="text-base font-semibold">Image Upload</Label>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleImageUploadClick}
              className="flex-1"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="available" className="text-sm font-medium">
            Available
          </Label>
          <Switch
            id="available"
            checked={formData.available}
            onCheckedChange={(checked) => handleInputChange("available", checked)}
          />
        </div>
       </div>
       </div>

       <SheetFooter className="p-6 border-t flex justify-center gap-2">
         <Button variant="outline" onClick={onCancel}>
           Cancel
         </Button>
         <Button onClick={handleSubmit}>
           {editingItem ? "Update" : "Add"} {addSheetType}
         </Button>
       </SheetFooter>
     </>
   );
}