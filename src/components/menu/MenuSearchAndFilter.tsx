import { 
  Plus, 
  Search, 
  Mic, 
  Trophy, 
  Star, 
  Flame, 
  Droplets, 
  Sparkles, 
  UtensilsCrossed, 
  ThumbsUp, 
  Zap, 
  Leaf, 
  Heart,
  LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'pizza': return '🍕';
    case 'sides': return '🍟';
    case 'beverages': case 'drinks': return '🥤';
    case 'combos': return '🍱';
    case 'desserts': return '🍰';
    case 'lunch': return '🍛';
    case 'dinner': return '🍽️';
    default: return null;
  }
};

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
  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. Action HUD & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-grow max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" size={20} />
          <input 
            type="text" 
            placeholder="Search for dishes..." 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-[52px] bg-white border border-[#E5E7EB] text-[#111827] py-4 pl-12 pr-12 rounded-[16px] focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 text-[15px] font-medium transition-all shadow-sm"
          />
          <button 
            onClick={onToggleListening}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all",
              isListening ? "text-red-500 animate-pulse bg-red-50" : "text-[#2563EB] hover:bg-blue-50"
            )}
          >
            <Mic size={20} />
          </button>
        </div>

        {/* Add Actions */}
        <div className="flex gap-2 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-[#2563EB] text-white px-6 h-[52px] rounded-[14px] active:scale-[0.98] transition-all font-semibold shadow-lg shadow-blue-100">
                <Plus size={20} /> <span>Add New</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-xl border-slate-100">
              <DropdownMenuItem onClick={() => onOpenAdd("Item")} className="rounded-lg p-2.5 font-medium cursor-pointer"><Plus className="mr-2 h-4 w-4 text-blue-500" /> Add Item</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onOpenAdd("Beverage")} className="rounded-lg p-2.5 font-medium cursor-pointer"><Plus className="mr-2 h-4 w-4 text-purple-500" /> Add Beverage</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onOpenAdd("Combo")} className="rounded-lg p-2.5 font-medium cursor-pointer"><Plus className="mr-2 h-4 w-4 text-orange-500" /> Add Combo</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onOpenAdd("Sauce")} className="rounded-lg p-2.5 font-medium cursor-pointer"><Plus className="mr-2 h-4 w-4 text-rose-500" /> Add Sauce</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 2. Category Filter Chips */}
      <div className="flex gap-[10px] overflow-x-auto no-scrollbar pb-2 -mx-6 px-6 lg:mx-0 lg:px-0 lg:flex-wrap">
        <button 
          onClick={onOpenCategoryDialog}
          className="h-[38px] px-4 rounded-[19px] text-[14px] font-bold whitespace-nowrap transition-all duration-300 flex-shrink-0 bg-[#EFF6FF] text-[#2563EB] flex items-center gap-1.5 hover:bg-blue-100 border border-transparent shadow-sm"
        >
          <Plus size={18} />
          <span>Add Category</span>
        </button>

        {/* 'All' Chip */}
        <button 
          onClick={() => onCategoryChange("All")}
          className={cn(
            "h-[38px] px-5 rounded-[19px] text-[14px] font-bold whitespace-nowrap transition-all duration-300 flex-shrink-0 flex items-center gap-1.5 border shadow-sm",
            activeCategory === "All" 
              ? "bg-[#EFF6FF] text-[#2563EB] border-blue-200" 
              : "bg-white border-[#E5E7EB] text-[#374151] hover:border-slate-300"
          )}
        >
          <LayoutGrid size={16} />
          <span>All Items</span>
        </button>

        {categories.filter(c => c !== 'All').map(cat => {
          const icon = getCategoryIcon(cat);
          return (
            <button 
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={cn(
                "h-[38px] px-5 rounded-[19px] text-[14px] font-bold whitespace-nowrap transition-all duration-300 flex-shrink-0 flex items-center gap-1.5 border shadow-sm",
                activeCategory === cat 
                  ? "bg-[#EFF6FF] text-[#2563EB] border-blue-200" 
                  : "bg-white border-[#E5E7EB] text-[#374151] hover:border-slate-300"
              )}
            >
              {icon && <span className="text-[16px] leading-none">{icon}</span>}
              <span>{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}