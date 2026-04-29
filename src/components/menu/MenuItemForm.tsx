"use client";

import { useState, useRef, useEffect } from "react";
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
  ArrowLeft,
  ImageIcon,
  Plus,
  Trash2,
  AlertCircle,
  Loader2
} from "lucide-react";
import imageCompression from "browser-image-compression";
import { useToast } from "@/hooks/use-toast";
import { usePostForm, useDeleteJson, useQueryHelpers } from "@/hooks/useApi";
import { useAppStore } from "@/context/useAppStore";

type AddSheetType = "Item" | "Beverage" | "Combo" | "Sauce" | null;

interface MenuItemFormProps {
  editingItem: any;
  addSheetType: AddSheetType;
  categories: any[];
  subCategories: any[];
  onSubmit: (itemData: any) => void;
  onCancel: () => void;
}

export function MenuItemForm({
  editingItem,
  addSheetType,
  categories,
  subCategories,
  onSubmit,
  onCancel,
}: MenuItemFormProps) {
  // --- Existing Logic Start ---
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    editingItem?.images?.[0] || editingItem?.image || null
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImageMutation = usePostForm<any>("/api/menu/upload-image", undefined, {
    headers: {},
  });
  const deleteImageMutation = useDeleteJson<any>("/api/menu/delete-image");

  const { branches, selectedBranch, categories: storeCategories, subCategories: storeSubCategories } = useAppStore();
  const currentBranch = branches.find(b => b.id === selectedBranch);
  const restaurantId = (currentBranch as any)?.restaurantId;
  const { invalidate } = useQueryHelpers();

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
      await deleteImageMutation.mutateAsync({ imageUrl });
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
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    if (uploadedImageUrl && isImageDeliveryUrl(uploadedImageUrl)) {
      const deleteSuccess = await deleteImage(uploadedImageUrl);
      if (!deleteSuccess) return;
      setUploadedImageUrl(null);
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
      const json = await uploadImageMutation.mutateAsync(fd);
      const url: string | undefined = Array.isArray(json?.variants)
        ? json.variants[0]
        : undefined;
      if (!url) throw new Error("No image URL returned");
      setUploadedImageUrl(url);
      toast({ title: "Image uploaded", description: "Image ready to attach to item." });
    } catch (e: any) {
      console.error("Image upload error", e);
      setUploadError(e?.message || "Failed to upload image");
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: e?.message || "Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };
  // --- Existing Logic End ---

  // --- New State from CreateItemView ---
  const [name, setName] = useState(editingItem?.name || "");
  const [description, setDescription] = useState(editingItem?.description || "");
  const [isSpicy, setIsSpicy] = useState(editingItem?.isSpicy || false);
  const [isBestseller, setIsBestseller] = useState(editingItem?.isBestseller || false);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubCategoryName, setNewSubCategoryName] = useState("");
  const [dietaryType, setDietaryType] = useState<"Veg" | "Non-Veg" | "Egg">(
    editingItem?.dietaryType || "Veg"
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(editingItem?.badges || []);
  const [pricingType, setPricingType] = useState<"simple" | "variety">(
    editingItem?.pricing_unit === "size" ? "variety" : "simple"
  );
  const [price, setPrice] = useState(
    editingItem?.pricing_unit !== "size"
      ? editingItem?.pricing_options?.[0]?.price?.toString() || editingItem?.price?.toString() || ""
      : ""
  );
  const [variants, setVariants] = useState<any[]>(
    editingItem?.pricing_unit === "size"
      ? editingItem?.pricing_options?.map((v: any, i: number) => ({
          id: i.toString(),
          name: v.label,
          price: v.price?.toString(),
        })) || []
      : []
  );
  const [isAvailable, setIsAvailable] = useState(editingItem?.available ?? true);
  const [gstCategory, setGstCategory] = useState<"Freshly Prepared Item" | "MRP Based Item">(
    "Freshly Prepared Item"
  );
  const [gstIncluded, setGstIncluded] = useState(true);
  const [foodCategory, setFoodCategory] = useState(
    editingItem?.category || ""
  );
  const [subCategory, setSubCategory] = useState(
    editingItem?.subCategory || "All"
  );
  const [enableAddons, setEnableAddons] = useState(
    editingItem?.allowedAddons && editingItem.allowedAddons.length > 0 ? true : false
  );
  const [selectedAddons, setSelectedAddons] = useState<string[]>(
    editingItem?.allowedAddons || []
  );
  const [enableToppings, setEnableToppings] = useState(
    editingItem?.allowedToppings && editingItem.allowedToppings.length > 0 ? true : false
  );
  const [selectedToppings, setSelectedToppings] = useState<string[]>(
    editingItem?.allowedToppings || []
  );
  const [enableServeInfo, setEnableServeInfo] = useState(
    editingItem?.piecesInfo && editingItem.piecesInfo.length > 0 ? true : false
  );
  const [servingSize, setServingSize] = useState(editingItem?.servingSize || "1-2");
  const [piecesInfo, setPiecesInfo] = useState<{ name: string; count: string }[]>(
    editingItem?.piecesInfo || []
  );
  const [availableFor, setAvailableFor] = useState<string[]>(
    editingItem?.availableFor && editingItem.availableFor.length > 0
      ? editingItem.availableFor
      : ["Delivery", "Takeaway", "Dine-In"]
  );

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name || "");
      setDescription(editingItem.description || "");
      setIsSpicy(editingItem.isSpicy || false);
      setIsBestseller(editingItem.isBestseller || false);
      setDietaryType(editingItem.dietaryType || "Veg");
      setSelectedTags(editingItem.badges || []);
      
      const pType = editingItem.pricing_unit === "size" ? "variety" : "simple";
      setPricingType(pType);
      
      if (pType === "simple") {
        setPrice(editingItem.pricing_options?.[0]?.price?.toString() || editingItem.price?.toString() || "");
        setVariants([]);
      } else {
        setVariants(editingItem.pricing_options?.map((v: any, i: number) => ({
          id: i.toString(),
          name: v.label,
          price: v.price?.toString(),
        })) || []);
        setPrice("");
      }

      setIsAvailable(editingItem.available ?? true);
      setFoodCategory(editingItem.category || "");
      setSubCategory(editingItem.subCategory || "All");
      setEnableAddons(editingItem.allowedAddons && editingItem.allowedAddons.length > 0 ? true : false);
      setSelectedAddons(editingItem.allowedAddons || []);
      setEnableToppings(editingItem.allowedToppings && editingItem.allowedToppings.length > 0 ? true : false);
      setSelectedToppings(editingItem.allowedToppings || []);
      setEnableServeInfo(editingItem.piecesInfo && editingItem.piecesInfo.length > 0 ? true : false);
      setServingSize(editingItem.servingSize || "1-2");
      setPiecesInfo(editingItem.piecesInfo || []);
      setAvailableFor(editingItem.availableFor && editingItem.availableFor.length > 0 ? editingItem.availableFor : ["Delivery", "Takeaway", "Dine-In"]);
      setUploadedImageUrl(editingItem.images?.[0] || editingItem.image || null);
      setGstCategory(editingItem.gstCategory || "Freshly Prepared Item");
      setGstIncluded(editingItem.gstIncluded ?? true);
    } else {
      // Reset form
      setName("");
      setDescription("");
      setDietaryType("Veg");
      setSelectedTags([]);
      setPricingType("simple");
      setPrice("");
      setVariants([]);
      setIsAvailable(true);
      setFoodCategory("");
      setSubCategory("All");
      setEnableAddons(false);
      setSelectedAddons([]);
      setEnableToppings(false);
      setSelectedToppings([]);
      setEnableServeInfo(false);
      setServingSize("1-2");
      setPiecesInfo([]);
      setAvailableFor(["Delivery", "Takeaway", "Dine-In"]);
      setUploadedImageUrl(null);
      setGstCategory("Freshly Prepared Item");
      setGstIncluded(true);
    }
  }, [editingItem]);
  const [customTagInput, setCustomTagInput] = useState("");

  const availableToppings = [
    "Extra Cheese", "Jalapenos", "Black Olives", "Mushroom", "Onion", "Capsicum", "Paneer", "Pepperoni", "Chicken Tikka"
  ];
  
  const servingSizeOptions = [
    "0-1",
    "1-2",
    "2-3",
    "3-4",
    "4-5",
    "5-6",
    "6-7",
    "7-8",
    "8-9",
    "9-10",
  ];
  const tagsList = [
    "Best Seller",
    "Spicy",
    "Sugar Free",
    "Chef Special",
    "New",
    "Recommended",
    "Healthy",
    "Popular",
    "Kids Favourite",
    "Limited Offer",
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addVariant = () => {
    setVariants([...variants, { id: Date.now().toString(), name: "", price: "" }]);
  };

  const updateVariant = (id: string, field: "name" | "price", value: string) => {
    setVariants(variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleAddCustomTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && customTagInput.trim()) {
      e.preventDefault();
      if (!selectedTags.includes(customTagInput.trim())) {
        setSelectedTags([...selectedTags, customTagInput.trim()]);
      }
      setCustomTagInput("");
    }
  };

  const calculateFinalPrice = (basePrice: string) => {
    if (!basePrice) return 0;
    const numPrice = parseFloat(basePrice);
    if (isNaN(numPrice)) return 0;
    return gstIncluded ? numPrice : numPrice + numPrice * 0.05;
  };

  const toggleAvailableFor = (option: string) => {
    setAvailableFor((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const toggleAddon = (addon: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]
    );
  };

  const toggleTopping = (topping: string) => {
    setSelectedToppings((prev) =>
      prev.includes(topping) ? prev.filter((t) => t !== topping) : [...prev, topping]
    );
  };

  const addPieceInfo = () => {
    setPiecesInfo([...piecesInfo, { name: "", count: "" }]);
  };

  const updatePieceInfo = (index: number, field: "name" | "count", value: string) => {
    const newPieces = [...piecesInfo];
    (newPieces[index] as any)[field] = value;
    setPiecesInfo(newPieces);
  };

  const removePieceInfo = (index: number) => {
    setPiecesInfo(piecesInfo.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!name || !foodCategory || (pricingType === "simple" && !price)) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const itemData = {
      name,
      description,
      category: foodCategory,
      subCategory: subCategory,
      type: addSheetType?.toLowerCase() || "item",
      available: isAvailable,
      images: uploadedImageUrl ? [uploadedImageUrl] : [],
      pricing_unit: pricingType === "variety" ? "size" : "quantity",
      pricing_options:
        pricingType === "simple"
          ? [{ label: "Regular", price: parseFloat(price), default: true }]
          : variants.map((v, i) => ({
              label: v.name,
              price: parseFloat(v.price),
              default: i === 0, // Make the first variant default
            })),
      portions:
        pricingType === "simple"
          ? ["Regular"]
          : variants.map((v) => v.name),
      // Optional fields if the backend supports them later
      dietaryType,
      badges: selectedTags,
      allowedAddons: enableAddons ? selectedAddons : [],
      allowedToppings: enableToppings ? selectedToppings : [],
      servingSize: enableServeInfo ? servingSize : null,
      piecesInfo: enableServeInfo ? piecesInfo : [],
      availableFor,
      gstCategory,
      gstIncluded,
    };

    onSubmit(itemData);
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-3 bg-white border-b border-slate-100 sticky top-0 z-40">
        <button
          onClick={onCancel}
          className="w-10 h-10 flex items-center justify-center text-slate-700 active:bg-slate-50 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-[20px] font-[600] text-slate-900">
          {editingItem ? "Edit" : "Add"} {addSheetType || "Food Item"}
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        {uploadError && (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm font-medium flex items-center gap-2">
            <AlertCircle size={16} /> {uploadError}
          </div>
        )}

        {/* Image Upload Section */}
        <div
          onClick={handleImageUploadClick}
          className="h-[180px] rounded-[16px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] flex flex-col items-center justify-center gap-3 relative overflow-hidden active:bg-slate-50 transition-colors cursor-pointer"
        >
          {uploadedImageUrl ? (
            <img
              src={uploadedImageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400">
                {isUploading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <ImageIcon size={24} />
                )}
              </div>
              <span className="text-sm font-medium text-slate-600">
                {isUploading ? "Uploading..." : "Upload Food Image"}
              </span>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Food Item Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            {foodCategory === "Toppings" ? "Topping Name" : "Food Name"}
          </label>
          <Input
            placeholder={
              foodCategory === "Toppings" ? "Enter topping name" : "Enter food item name"
            }
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-[44px] rounded-[10px] border-[#E5E7EB]"
          />
        </div>

        {/* Description */}
        {foodCategory !== "Toppings" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <Textarea
              placeholder="Write a short description about the dish"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-[90px] rounded-[10px] border-[#E5E7EB] resize-none"
            />
          </div>
        )}

        {/* Main Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Category</label>
          <Select value={foodCategory} onValueChange={setFoodCategory}>
            <SelectTrigger className="w-full h-[44px] rounded-[10px] border-[#E5E7EB]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent position="popper" className="z-[150] bg-white border border-slate-200 shadow-xl rounded-xl">
              {storeCategories.map((cat) => {
                const name = typeof cat === 'string' ? cat : cat.name;
                if (name === 'All') return null;
                return (
                  <SelectItem key={name} value={name} className="py-3 px-4 hover:bg-slate-50 cursor-pointer">
                    {name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Sub Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Sub Category</label>
          <Select value={subCategory} onValueChange={setSubCategory}>
            <SelectTrigger className="w-full h-[44px] rounded-[10px] border-[#E5E7EB]">
              <SelectValue placeholder="Select sub category" />
            </SelectTrigger>
            <SelectContent position="popper" className="z-[150] bg-white border border-slate-200 shadow-xl rounded-xl">
              <SelectItem value="All" className="py-3 px-4 hover:bg-slate-50 cursor-pointer">All</SelectItem>
              {storeSubCategories.map((sub) => {
                const name = typeof sub === 'string' ? sub : sub.name;
                if (name === 'All') return null;
                return (
                  <SelectItem key={name} value={name} className="py-3 px-4 hover:bg-slate-50 cursor-pointer">
                    {name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* GST Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">GST Category</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input 
                type="radio" 
                checked={gstCategory === 'Freshly Prepared Item'} 
                onChange={() => setGstCategory('Freshly Prepared Item')}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              Freshly Prepared Item
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input 
                type="radio" 
                checked={gstCategory === 'MRP Based Item'} 
                onChange={() => setGstCategory('MRP Based Item')}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              MRP Based Item
            </label>
          </div>
        </div>

        {/* Food Type Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Food Types</label>
          <div className="flex gap-3">
            <button
              onClick={() => setDietaryType("Veg")}
              className={`flex-1 h-[44px] rounded-[10px] border flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                dietaryType === "Veg"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-[#E5E7EB] text-slate-600"
              }`}
            >
              <div className="w-3 h-3 rounded-sm border border-green-600 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
              </div>
              Veg
            </button>
            <button
              onClick={() => setDietaryType("Non-Veg")}
              className={`flex-1 h-[44px] rounded-[10px] border flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                dietaryType === "Non-Veg"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-[#E5E7EB] text-slate-600"
              }`}
            >
              <div className="w-3 h-3 rounded-sm border border-red-600 flex items-center justify-center">
                <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-b-[5px] border-l-transparent border-r-transparent border-b-red-600" />
              </div>
              Non-Veg
            </button>
            <button
              onClick={() => setDietaryType("Egg")}
              className={`flex-1 h-[44px] rounded-[10px] border flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                dietaryType === "Egg"
                  ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                  : "border-[#E5E7EB] text-slate-600"
              }`}
            >
              <div className="w-3 h-3 rounded-sm border border-yellow-500 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              </div>
              Egg
            </button>
          </div>
        </div>

        {/* Food Tags */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Food Tags</label>
          <Input
            placeholder="Type a tag and press Enter"
            value={customTagInput}
            onChange={(e) => setCustomTagInput(e.target.value)}
            onKeyDown={handleAddCustomTag}
            className="h-[44px] rounded-[10px] border-[#E5E7EB] mb-2"
          />
          <div className="flex flex-wrap gap-2">
            {[...new Set([...tagsList, ...selectedTags])].map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`h-[32px] px-4 rounded-[16px] border text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? "bg-[#2563EB] border-[#2563EB] text-white"
                    : "bg-white border-[#E5E7EB] text-slate-600"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-slate-900">Pricing</h3>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input
                type="radio"
                checked={pricingType === "simple"}
                onChange={() => setPricingType("simple")}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              Simple Price
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input
                type="radio"
                checked={pricingType === "variety"}
                onChange={() => setPricingType("variety")}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              Price by Variety
            </label>
          </div>

          {pricingType === "simple" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  ₹
                </span>
                <Input
                  type="number"
                  placeholder="250"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-8 h-[44px] rounded-[10px] border-[#E5E7EB]"
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Switch
                  checked={gstIncluded}
                  onCheckedChange={setGstIncluded}
                  id="gst-included"
                />
                <Label htmlFor="gst-included" className="text-sm text-slate-600">
                  GST Included
                </Label>
              </div>
              {price && (
                <p className="text-sm text-slate-500 mt-1">
                  Final Price: ₹{calculateFinalPrice(price).toFixed(2)} (incl. GST)
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex text-sm font-medium text-slate-500 px-1">
                <div className="flex-1">Variant Name</div>
                <div className="w-24">Price</div>
                <div className="w-8"></div>
              </div>

              {variants.map((variant) => (
                <div key={variant.id} className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="e.g. Small"
                      value={variant.name}
                      onChange={(e) => updateVariant(variant.id, "name", e.target.value)}
                      className="flex-1 h-[44px] rounded-[10px] border-[#E5E7EB]"
                    />
                    <div className="relative w-24">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        ₹
                      </span>
                      <Input
                        type="number"
                        placeholder="0"
                        value={variant.price}
                        onChange={(e) => updateVariant(variant.id, "price", e.target.value)}
                        className="pl-7 h-[44px] rounded-[10px] border-[#E5E7EB]"
                      />
                    </div>
                    <button
                      onClick={() => removeVariant(variant.id)}
                      className="w-8 h-[44px] flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  {variant.price && (
                    <p className="text-xs text-slate-500 ml-1">
                      Final Price: ₹{calculateFinalPrice(variant.price).toFixed(2)} (incl.
                      GST)
                    </p>
                  )}
                </div>
              ))}

              <button
                onClick={addVariant}
                className="text-sm font-medium text-blue-600 flex items-center gap-1 py-2"
              >
                <Plus size={16} /> Add Variant
              </button>
            </div>
          )}
        </div>

{/* Add-ons Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-t border-slate-100">
            <label className="text-sm font-medium text-slate-700">Enable Add-ons</label>
            <Switch checked={enableAddons} onCheckedChange={setEnableAddons} />
          </div>

          {enableAddons && (
            <div className="space-y-2 p-4 bg-slate-50 rounded-[12px] border border-slate-100">
              <label className="text-sm font-medium text-slate-700">Select Add-ons</label>
              <div className="flex flex-wrap gap-2">
                {["Extra Cheese", "Cold Drink", "Brownie", "Dip"].map((addon) => (
                  <button
                    key={addon}
                    onClick={() => toggleAddon(addon)}
                    className={`h-[32px] px-4 rounded-[16px] border text-sm transition-colors ${
                      selectedAddons.includes(addon)
                        ? "bg-[#2563EB] border-[#2563EB] text-white"
                        : "bg-white border-[#E5E7EB] text-slate-600"
                    }`}
                  >
                    {addon}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Toppings Section */}
        {foodCategory !== 'Toppings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-t border-slate-100">
              <label className="text-sm font-medium text-slate-700">Enable Toppings</label>
              <button 
                onClick={() => setEnableToppings(!enableToppings)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enableToppings ? 'bg-[#2563EB]' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enableToppings ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {enableToppings && (
              <div className="space-y-2 p-4 bg-slate-50 rounded-[12px] border border-slate-100">
                <label className="text-sm font-medium text-slate-700">Select Toppings</label>
                <div className="flex flex-wrap gap-2">
                  {availableToppings.length > 0 ? availableToppings.map(topping => (
                    <button
                      key={topping}
                      onClick={() => toggleTopping(topping)}
                      className={`h-[32px] px-4 rounded-[16px] border text-sm transition-colors ${
                        selectedToppings.includes(topping) 
                          ? 'bg-[#2563EB] border-[#2563EB] text-white' 
                          : 'bg-white border-[#E5E7EB] text-slate-600'
                      }`}
                    >
                      {topping}
                    </button>
                  )) : (
                    <p className="text-sm text-slate-500">No toppings available in menu.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Serve Info Section */}
        {foodCategory !== 'Toppings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-t border-slate-100">
              <label className="text-sm font-medium text-slate-700">Enable Serve Info</label>
              <button 
                onClick={() => setEnableServeInfo(!enableServeInfo)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enableServeInfo ? 'bg-[#2563EB]' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enableServeInfo ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {enableServeInfo && (
              <div className="space-y-4 p-4 bg-slate-50 rounded-[12px] border border-slate-100">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Serving Size</label>
                  <select
                    value={servingSize}
                    onChange={(e) => setServingSize(e.target.value)}
                    className="w-full h-[44px] rounded-[10px] border border-[#E5E7EB] px-[12px] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
                  >
                    {servingSizeOptions.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">Pieces Info</label>
                  {piecesInfo.map((piece, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input 
                        type="text" 
                        placeholder="Item Name (e.g. Chicken)" 
                        value={piece.name}
                        onChange={(e) => updatePieceInfo(index, 'name', e.target.value)}
                        className="flex-1 h-[44px] rounded-[10px] border border-[#E5E7EB] px-[12px] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
                      />
                      <input 
                        type="number" 
                        placeholder="Count" 
                        value={piece.count}
                        onChange={(e) => updatePieceInfo(index, 'count', e.target.value)}
                        className="w-24 h-[44px] rounded-[10px] border border-[#E5E7EB] px-[12px] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
                      />
                      <button onClick={() => removePieceInfo(index)} className="w-8 h-[44px] flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  
                  <button 
                    onClick={addPieceInfo}
                    className="text-sm font-medium text-blue-600 flex items-center gap-1 py-1"
                  >
                    <Plus size={16} /> Add More
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Item Availability */}
        {foodCategory !== 'Toppings' && (
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <label className="text-sm font-medium text-slate-700">Available For</label>
            <div className="flex flex-wrap gap-2">
              {['Delivery', 'Takeaway', 'Dine-In'].map(option => (
                <button
                  key={option}
                  onClick={() => toggleAvailableFor(option)}
                  className={`h-[32px] px-4 rounded-[16px] border text-sm transition-colors ${
                    availableFor.includes(option) 
                      ? 'bg-[#2563EB] border-[#2563EB] text-white' 
                      : 'bg-white border-[#E5E7EB] text-slate-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        

        {/* Availability Toggle */}
        <div className="flex items-center justify-between py-2 border-t border-slate-100">
          <label className="text-sm font-medium text-slate-700">Active Status</label>
          <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-white border-t border-slate-100 flex gap-3 sticky bottom-0">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1 h-[52px] rounded-[16px] font-semibold text-[16px]"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isUploading || isDeleting || !name || !foodCategory || (pricingType === 'simple' && !price)}
          className="flex-1 h-[52px] bg-[#2563EB] text-[#FFFFFF] rounded-[16px] font-semibold text-[16px] hover:bg-blue-700"
        >
          {isUploading ? (
            <Loader2 className="animate-spin" />
          ) : editingItem ? (
            "Update Item"
          ) : (
            "Save Food Item"
          )}
        </Button>
      </div>
    </div>
  );
}

