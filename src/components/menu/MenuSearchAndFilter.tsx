import { Plus, Search, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type AddSheetType = "Item" | "Beverage" | "Combo" | "Sauce" | null;

interface MenuSearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeCategory: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  isListening: boolean;
  onToggleListening: () => void;
  onOpenAdd: (type: AddSheetType) => void;
  onOpenCategoryDialog: () => void;
}

export function MenuSearchAndFilter({
  searchTerm,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  categories,
  isListening,
  onToggleListening,
  onOpenAdd,
  onOpenCategoryDialog,
}: MenuSearchAndFilterProps) {
  const availableCategories = categories.filter((c) => c !== "All");

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Add Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items or use the mic..."
            className="pl-9 pr-10"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-green-600",
              isListening && "animate-pulse"
            )}
            onClick={onToggleListening}
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
              <DropdownMenuItem onClick={() => onOpenAdd("Item")}>
                Add Item
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onOpenAdd("Beverage")}>
                Add Beverage
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onOpenAdd("Combo")}>
                Add Combo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onOpenAdd("Sauce")}>
                Add Sauce
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Category Filter Section */}
      <div className="flex gap-2">
        <Select value={activeCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {availableCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={onOpenCategoryDialog}>
          <Plus className="mr-1.5 h-3 w-3" /> Create Category
        </Button>
      </div>
    </div>
  );
}