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
import { Upload, CheckCircle, XCircle } from "lucide-react";
import imageCompression from "browser-image-compression";
import { useToast } from "@/hooks/use-toast";

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
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(editingItem?.images?.[0] || editingItem?.image || null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isImageDeliveryUrl = (url: string): boolean => {
    try {
      const u = new URL(url);
      return u.hostname.endsWith("imagedelivery.net");
    } catch {
      return url.includes("imagedelivery.net");
    }
  };

  const deleteImage = async (imageUrl: string): Promise<boolean> => {
    try {
      setIsDeleting(true);
      const response = await fetch("https://backend.crevings.com/api/menu/delete-image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to delete image");
      }

      return true;
    } catch (error: any) {
      console.error("Delete image error:", error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error?.message || "Failed to delete existing image",
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImageUploadClick = () => {
    // Open the file picker immediately under user gesture
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Only delete existing image if it's hosted on imagedelivery.net
    if (uploadedImageUrl && isImageDeliveryUrl(uploadedImageUrl)) {
      const deleteSuccess = await deleteImage(uploadedImageUrl);
      if (!deleteSuccess) {
        // Abort if deletion fails
        return;
      }
      // Clear current image state after successful deletion
      setUploadedImageUrl(null);
      setUploadError(null);
    }

    setIsUploading(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
      });
      const fd = new FormData();
      const fileName = file.name.replace(/\s+/g, "_");
      fd.append("image", compressed, fileName);
      const res = await fetch("https://backend.crevings.com/api/menu/upload-image", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Upload failed");
      }
      const json = await res.json();
      const url: string | undefined = Array.isArray(json?.variants) ? json.variants[0] : undefined;
      if (!url) throw new Error("No image URL returned");
      setUploadedImageUrl(url);
      toast({ title: "Image uploaded", description: "Image ready to attach to item." });
    } catch (e: any) {
      console.error("Image upload error", e);
      setUploadError(e?.message || "Failed to upload image");
      toast({ variant: "destructive", title: "Upload failed", description: e?.message || "Please try again." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.price || !uploadedImageUrl || isUploading) {
      return;
    }

    const itemData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      available: formData.available,
      dietaryType: "Veg" as const,
      image: uploadedImageUrl,
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
           {uploadedImageUrl && (
            <div className="mt-2">
              <div className="w-full max-w-[240px] border rounded overflow-hidden">
                <img
                  src={uploadedImageUrl}
                  alt="Uploaded preview"
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Success indicator */}
              
            </div>
          )}
         
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleImageUploadClick}
              className="flex-1"
              disabled={isUploading || isDeleting}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isDeleting ? "Deleting..." : isUploading ? "Uploading..." : (uploadedImageUrl ? "Replace Image" : "Upload Image")}
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
        <Button onClick={handleSubmit} disabled={isUploading || isDeleting || !formData.name || !formData.category || !formData.price || !uploadedImageUrl}>
           {editingItem ? "Update" : "Add"} {addSheetType}
         </Button>
       </SheetFooter>
     </>
   );
}