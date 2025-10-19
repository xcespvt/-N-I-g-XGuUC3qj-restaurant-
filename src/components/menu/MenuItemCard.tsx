import Image from "next/image";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/context/useAppStore";

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
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
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
              item.available
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            )}
          >
            {item.available ? "Available" : "Unavailable"}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full bg-background/70 backdrop-blur-sm"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(item)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {item.category}
          </Badge>
          <Badge
            variant={item.dietaryType === "Veg" ? "default" : "destructive"}
            className="text-xs"
          >
            {item.dietaryType}
          </Badge>
        </div>
        <CardTitle className="text-lg font-semibold mb-2 line-clamp-1">
          {item.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {item.description}
        </p>
        <div className="text-lg font-bold text-green-600">
          {formatPrice(item.price)}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-medium">Available</span>
          <Switch
            checked={item.available}
            onCheckedChange={(checked) => onToggleAvailability(item, checked)}
            disabled={!isRestaurantOnline}
          />
        </div>
      </CardFooter>
    </Card>
  );
}