import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/context/useAppStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MenuItemCardProps {
  item: MenuItem;
  isRestaurantOnline: boolean;
  onToggleAvailability: (item: MenuItem, nextAvailable: boolean) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
}

export function MenuItemCard({
  item,
  isRestaurantOnline,
  onToggleAvailability,
  onEdit,
  onDelete,
}: MenuItemCardProps) {
  const isVeg = item.dietaryType === "Veg";

  return (
    <div className={cn(
        "rounded-[16px] p-2 border border-[#E5E7EB] flex flex-col gap-2 transition-all duration-300 shadow-sm hover:shadow-md hover:border-blue-100",
        item.available ? "bg-white" : "bg-slate-50 opacity-80 grayscale-[0.2]"
    )}>
      {/* Image Section */}
      <div className="relative w-full h-[120px] rounded-[12px] overflow-hidden bg-slate-100 shrink-0">
        <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        
        {/* Veg/Non-Veg Icon */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm p-1 rounded-lg shadow-sm">
          <div className={cn("w-3 h-3 rounded-sm border flex items-center justify-center", isVeg ? "border-green-500" : "border-red-500")}>
            <div className={cn("w-1.5 h-1.5 rounded-full", isVeg ? "bg-green-500" : "bg-red-500")} />
          </div>
        </div>

        {/* Status Badge */}
        {!item.available && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-[11px] font-bold uppercase tracking-wider bg-black/60 px-2 py-1 rounded-md">Unavailable</span>
            </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 px-1 py-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-[15px] font-bold text-[#111827] leading-snug flex-1 line-clamp-1">{item.name}</h3>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-7 h-7 -mr-1 -mt-1 rounded-full hover:bg-slate-100 flex items-center justify-center text-[#6B7280] transition-colors">
                <MoreVertical size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 rounded-xl shadow-xl border-slate-100 p-1">
              <DropdownMenuItem onClick={() => onEdit(item)} className="rounded-lg gap-2 cursor-pointer font-medium p-2 text-[13px]">
                <Pencil size={14} className="text-blue-500" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(item)} className="rounded-lg gap-2 cursor-pointer font-medium p-2 text-[13px] text-rose-500">
                <Trash2 size={14} /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-[12px] text-[#6B7280] line-clamp-1 mb-2 font-medium">{item.description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[16px] font-extrabold text-[#111827]">₹{item.price}</span>
          
          <div className="flex items-center gap-2">
            <span className={cn("text-[9px] font-bold uppercase tracking-wide", item.available ? "text-green-600" : "text-slate-400")}>
                {item.available ? "Live" : "Off"}
            </span>
            <button 
              onClick={() => isRestaurantOnline && onToggleAvailability(item, !item.available)}
              disabled={!isRestaurantOnline}
              className={cn(
                "w-[34px] h-[18px] rounded-full p-[2px] transition-all duration-300 relative shrink-0",
                item.available ? "bg-[#1E90FF]" : "bg-slate-300",
                !isRestaurantOnline && "opacity-50 grayscale"
              )}
            >
              <div className={cn(
                "w-[14px] h-[14px] bg-white rounded-full transition-all duration-300 shadow-sm",
                item.available ? "translate-x-[16px]" : "translate-x-0"
              )} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
