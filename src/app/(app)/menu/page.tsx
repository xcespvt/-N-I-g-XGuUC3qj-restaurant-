

"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import Image from "next/image"
import { Plus, Search, Pencil, Trash2, Upload, MoreVertical, Mic, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useAppContext } from "@/context/AppContext"
import { cn } from "@/lib/utils"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import type { MenuItem } from "@/context/AppContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const initialFormState = {
    name: "",
    category: "Pizza",
    price: "",
    description: "",
    available: true,
    pricedBy: "quantity" as "quantity" | "size" | "weight" | "ml",
    portionOptions: [] as { name: string; price: string }[],
};

// SpeechRecognition type might not be available on the window object by default
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type AddSheetType = 'Item' | 'Beverage' | 'Combo' | 'Sauce' | null;


export default function MenuPage() {
  const { menuItems, toggleMenuItemAvailability, isRestaurantOnline, addMenuItem, categories, addCategory, updateMenuItem, deleteMenuItem } = useAppContext();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [activeSheet, setActiveSheet] = useState<AddSheetType>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState(initialFormState);

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "Image Selected",
        description: `${file.name} is ready to be uploaded.`,
      });
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setSearchTerm(finalTranscript + interimTranscript);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      }

      recognitionRef.current = recognition;
    } else {
      console.warn('Speech Recognition not supported');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
        toast({
            variant: 'destructive',
            title: 'Voice Search Not Supported',
            description: 'Your browser does not support voice search.',
        });
        return;
    };
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };


  useEffect(() => {
    if (activeSheet && editingItem) {
      let pricedBy: "quantity" | "size" | "weight" | "ml" = "quantity";
      if(editingItem.portionOptions && editingItem.portionOptions.length > 0) {
        // This is a simplification. We'd need to store the original pricedBy type
        // For now, we'll default to 'size' if portions exist.
        pricedBy = "size";
      }
      setFormData({
        name: editingItem.name,
        category: editingItem.category,
        price: editingItem.price.toString(),
        description: editingItem.description,
        available: editingItem.available,
        pricedBy: pricedBy,
        portionOptions: editingItem.portionOptions?.map(p => ({ ...p, price: p.price.toString() })) || [],
      });
    } else {
      setFormData(initialFormState);
    }
  }, [activeSheet, editingItem]);

  const handleInputChange = (field: keyof typeof formData, value: string | boolean | typeof formData.portionOptions) => {
    setFormData(prev => ({...prev, [field]: value}));
  }
  
  const handlePricedByChange = (value: "quantity" | "size" | "weight" | "ml") => {
    setFormData(prev => {
      const newState = { ...prev, pricedBy: value };
      if (['size', 'weight', 'quantity', 'ml'].includes(value) && newState.portionOptions.length === 0) {
        newState.portionOptions = [{ name: '', price: '' }];
      }
      return newState;
    });
  }

  const handlePortionChange = (index: number, field: 'name' | 'price', value: string) => {
    const newPortions = [...formData.portionOptions];
    newPortions[index][field] = value;
    handleInputChange('portionOptions', newPortions);
  }

  const addPortion = () => {
    handleInputChange('portionOptions', [...formData.portionOptions, { name: '', price: '' }]);
  }

  const removePortion = (index: number) => {
    const newPortions = formData.portionOptions.filter((_, i) => i !== index);
    handleInputChange('portionOptions', newPortions);
  }

  const filteredMenu = menuItems.filter(item => 
    (activeCategory === "All" || item.category === activeCategory) &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleOpenAdd = (type: AddSheetType) => {
    setEditingItem(null);
    setActiveSheet(type);
  }

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setActiveSheet('Item');
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

  const handleSaveItem = () => {
    const isPortionBased = ['size', 'weight', 'quantity', 'ml'].includes(formData.pricedBy);
    
    if (!formData.name || !formData.description || (isPortionBased ? !formData.portionOptions[0]?.price : !formData.price)) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please fill in all required fields, including a price.",
        });
        return;
    }

    const finalPrice = isPortionBased ? parseFloat(formData.portionOptions[0].price) : parseFloat(formData.price);
    if (isNaN(finalPrice) || finalPrice <= 0) {
       toast({
            variant: "destructive",
            title: "Invalid Price",
            description: "Please enter a valid price.",
        });
        return;
    }
    
    const finalPortionOptions = formData.portionOptions
        .filter(p => p.name && p.price) // Ensure portions are not empty
        .map(p => ({ name: p.name, price: parseFloat(p.price) }))
        .filter(p => !isNaN(p.price)); // Ensure price is a number

    const itemPayload = {
        name: formData.name,
        description: formData.description,
        price: finalPrice,
        category: formData.category,
        available: formData.available,
        dietaryType: 'Veg', // Mock default
        portionOptions: isPortionBased ? finalPortionOptions : [],
    };
    
    if (editingItem) {
        updateMenuItem({ ...editingItem, ...itemPayload });
    } else {
        addMenuItem(itemPayload as any);
    }

    setActiveSheet(null);
    setEditingItem(null);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
        addCategory(newCategoryName.trim());
        setNewCategoryName("");
        setIsCategoryDialogOpen(false);
    }
  }

  const availableCategories = useMemo(() => categories.filter(c => c !== "All"), [categories]);
  
  const showDetailedPricing = activeSheet === 'Item' || activeSheet === 'Beverage';

  const getPortionLabel = (pricedBy: string) => {
    switch(pricedBy) {
      case 'quantity': return { name: 'Quantity Name', price: 'Price (₹)', placeholder: 'e.g. 6 pcs' };
      case 'size': return { name: 'Size Name', price: 'Price (₹)', placeholder: 'e.g. Half, Large' };
      case 'weight': return { name: 'Weight Name', price: 'Price (₹)', placeholder: 'e.g. 250g, 1kg' };
      case 'ml': return { name: 'Volume Name', price: 'Price (₹)', placeholder: 'e.g. 250ml' };
      default: return { name: 'Portion Name', price: 'Price (₹)', placeholder: 'e.g. Half, Large' };
    }
  }

  const portionLabels = getPortionLabel(formData.pricedBy);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search menu items or use the mic..." 
            className="pl-9 pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-green-600",
              isListening && "animate-pulse"
            )}
            onClick={toggleListening}
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex-1">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleOpenAdd('Item')}>Add Item</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleOpenAdd('Beverage')}>Add Beverage</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleOpenAdd('Combo')}>Add Combo</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleOpenAdd('Sauce')}>Add Sauce</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      <div className="flex gap-2">
          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {availableCategories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)}>
            <Plus className="mr-1.5 h-3 w-3" /> Create Category
          </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMenu.map((item) => (
          <Card key={item.id} className="flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="p-0 relative">
               <div className="aspect-[3/2] w-full bg-muted flex items-center justify-center">
                    <Image
                        alt={item.name}
                        className="aspect-[3/2] w-full object-cover"
                        height="200"
                        src={item.image}
                        width="300"
                        data-ai-hint={item.aiHint}
                    />
                </div>
              <div className="absolute top-2 right-2 flex items-center gap-2">
                <Badge 
                  className={cn(
                    "z-10 text-xs font-semibold",
                    item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  )}
                >
                  {item.available ? "Available" : "Unavailable"}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-background/70 backdrop-blur-sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleOpenEdit(item)}><Pencil className="mr-2 h-4 w-4" />Edit Item</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOpenDelete(item)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete Item</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow space-y-3">
              <Badge variant="outline">{item.category}</Badge>
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg font-bold leading-tight">{item.name}</CardTitle>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-primary">
                    ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
            </CardContent>
            <CardFooter className="p-4 flex justify-between items-center border-t bg-muted/50">
              <p className="text-xs text-muted-foreground">
                Portions: {item.portionOptions && item.portionOptions.length > 0 ? item.portionOptions.map(p => p.name).join('/') : 'Standard'}
              </p>
              <div className="flex items-center gap-2">
                <Switch 
                    id={`available-${item.id}`} 
                    checked={item.available}
                    onCheckedChange={() => toggleMenuItemAvailability(item.id)}
                    disabled={!isRestaurantOnline}
                />
                <label htmlFor={`available-${item.id}`} className="text-sm font-medium">Available</label>
              </div>
            </CardFooter>
          </Card>
        ))}
         {filteredMenu.length === 0 && (
            <div className="text-center py-16 text-muted-foreground col-span-full">
                <p>No {activeCategory.toLowerCase()} items to show.</p>
            </div>
         )}
      </div>

       {/* Add/Edit Sheet */}
      <Sheet open={!!activeSheet} onOpenChange={(isOpen) => !isOpen && setActiveSheet(null)}>
          <SheetContent side="bottom" className="sm:max-w-3xl mx-auto p-0 flex flex-col h-full max-h-[90vh]">
             <SheetHeader className="p-6 pb-4 border-b flex-shrink-0">
                <SheetTitle className="text-xl">{editingItem ? `Edit ${activeSheet}` : `Add New ${activeSheet}`}</SheetTitle>
                <SheetDescription>
                    {editingItem ? `Update the details for this ${activeSheet?.toLowerCase()}.` : `Fill in the details to add a new ${activeSheet?.toLowerCase()} to your menu.`}
                </SheetDescription>
            </SheetHeader>
            <div className="flex-grow overflow-y-auto">
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Enter item name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableCategories.map(c => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Available</Label>
                        <div className="flex items-center pt-2">
                           <Switch checked={formData.available} onCheckedChange={(checked) => handleInputChange('available', checked)}/>
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Describe your menu item" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)}/>
                </div>
                 <div className="space-y-2">
                    <Label>Image</Label>
                    <div>
                        <Button type="button" variant="outline" onClick={handleImageUploadClick}>
                            <Upload className="mr-2 h-4 w-4"/> Upload Image
                        </Button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*"
                        />
                    </div>
                </div>
                <Separator />
                
                 {showDetailedPricing ? (
                    <>
                        <div className="space-y-3">
                            <Label className="font-semibold">Priced By</Label>
                            <RadioGroup
                                value={formData.pricedBy}
                                onValueChange={handlePricedByChange}
                                className="flex flex-wrap gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="quantity" id="priced-by-quantity" />
                                    <Label htmlFor="priced-by-quantity" className="font-normal">Quantity</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="size" id="priced-by-size" />
                                    <Label htmlFor="priced-by-size" className="font-normal">Size</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="weight" id="priced-by-weight" />
                                    <Label htmlFor="priced-by-weight" className="font-normal">Weight</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="ml" id="priced-by-ml" />
                                    <Label htmlFor="priced-by-ml" className="font-normal">Volume (ml)</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Pricing Options</h3>
                            </div>
                            {formData.portionOptions.map((portion, index) => (
                                <div key={index} className="flex items-end gap-2">
                                <div className="grid grid-cols-2 gap-2 flex-grow">
                                    <div className="space-y-1.5">
                                    <Label htmlFor={`portion-name-${index}`}>{portionLabels.name}</Label>
                                    <Input id={`portion-name-${index}`} placeholder={portionLabels.placeholder} value={portion.name} onChange={(e) => handlePortionChange(index, 'name', e.target.value)} />
                                    </div>
                                    <div className="space-y-1.5">
                                    <Label htmlFor={`portion-price-${index}`}>{portionLabels.price}</Label>
                                    <Input id={`portion-price-${index}`} type="number" placeholder="e.g. 299" value={portion.price} onChange={(e) => handlePortionChange(index, 'price', e.target.value)} />
                                    </div>
                                </div>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removePortion(index)} className="text-destructive">
                                    <X className="h-4 w-4" />
                                </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={addPortion}>
                                <Plus className="mr-2 h-4 w-4" /> Add Option
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="space-y-2">
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input id="price" type="number" placeholder="Enter price" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)}/>
                    </div>
                )}
              </div>
            </div>
             <SheetFooter className="bg-muted/50 p-6 border-t mt-auto flex-shrink-0">
                <Button variant="outline" onClick={() => setActiveSheet(null)}>Cancel</Button>
                <Button onClick={handleSaveItem}>{editingItem ? "Save Changes" : `Add ${activeSheet}`}</Button>
            </SheetFooter>
          </SheetContent>
      </Sheet>
      
      {/* Add Category Dialog */}
      <AlertDialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Create New Category</AlertDialogTitle>
                  <AlertDialogDescription>Enter a name for your new food category.</AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input id="category-name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="e.g. Beverages"/>
              </div>
              <AlertDialogFooter>
                  <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
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
                      This action cannot be undone. This will permanently delete the menu item
                      "{itemToDelete?.name}".
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}
