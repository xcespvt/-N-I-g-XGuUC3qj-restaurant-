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
  categories: any[];
  activeSubCategory: string;
  onSubCategoryChange: (value: string) => void;
  subCategories: any[];
  isListening: boolean;
  onToggleListening: () => void;
  onOpenAdd: (type: AddSheetType) => void;
  onOpenCategoryDialog: () => void;
  onOpenSubCategoryDialog: () => void;
}

export function MenuSearchAndFilter({
  searchTerm,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  categories,
  activeSubCategory,
  onSubCategoryChange,
  subCategories,
  isListening,
  onToggleListening,
  onOpenAdd,
  onOpenCategoryDialog,
  onOpenSubCategoryDialog,
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
              isListening ? "text-red-500 animate-pulse bg-red-50" : "text-[#1E90FF] hover:bg-blue-50"
            )}
          >
            <Mic size={20} />
          </button>
        </div>

      </div>

      <div className="space-y-4">
        {/* 2. Category Filter Chips */}
        <div className="flex gap-[10px] overflow-x-auto no-scrollbar pb-1 -mx-6 px-6 lg:mx-0 lg:px-0 lg:flex-wrap">
          <button 
            onClick={onOpenCategoryDialog}
            className="h-[38px] px-4 rounded-[19px] text-[14px] font-bold whitespace-nowrap transition-all duration-300 flex-shrink-0 bg-[#E6F4FF] text-[#1E90FF] flex items-center gap-1.5 hover:bg-blue-100 border border-transparent shadow-sm"
          >
            <Plus size={18} />
            <span>Add Category</span>
          </button>
          
          {categories.map(catObj => {
            const cat = catObj.name;
            return (
              <button 
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={cn(
                  "h-[38px] px-5 rounded-[19px] text-[14px] font-bold whitespace-nowrap transition-all duration-300 flex-shrink-0 flex items-center gap-1.5 border shadow-sm",
                  activeCategory === cat 
                    ? "bg-[#E6F4FF] text-[#1E90FF] border-blue-200" 
                    : "bg-white border-[#E5E7EB] text-[#374151] hover:border-slate-300"
                )}
              >
                {cat === 'All' && <LayoutGrid size={16} />}
                <span>{cat === 'All' ? 'All Categories' : cat}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Sub Category Filter Chips */}
        <div className="flex gap-[10px] overflow-x-auto no-scrollbar pb-1 -mx-6 px-6 lg:mx-0 lg:px-0 lg:flex-wrap">
          <button 
            onClick={onOpenSubCategoryDialog}
            className="h-[38px] px-4 rounded-[19px] text-[14px] font-bold whitespace-nowrap transition-all duration-300 flex-shrink-0 bg-[#E6F4FF] text-[#1E90FF] flex items-center gap-1.5 hover:bg-blue-100 border border-transparent shadow-sm"
          >
            <Plus size={18} />
            <span>Add Sub Category</span>
          </button>

          {subCategories.map(subObj => {
            const sub = subObj.name;
            return (
              <button 
                key={sub}
                onClick={() => onSubCategoryChange(sub)}
                className={cn(
                  "h-[38px] px-5 rounded-[19px] text-[14px] font-bold whitespace-nowrap transition-all duration-300 flex-shrink-0 flex items-center gap-1.5 border shadow-sm",
                  activeSubCategory === sub 
                    ? "bg-[#E6F4FF] text-[#1E90FF] border-blue-200" 
                    : "bg-white border-[#E5E7EB] text-[#374151] hover:border-slate-300"
                )}
              >
                {sub === 'All' && <LayoutGrid size={16} />}
                <span>{sub === 'All' ? 'All Sub Categories' : sub}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
