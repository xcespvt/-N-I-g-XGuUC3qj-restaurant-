type AddSheetType = "Item" | "Beverage" | "Combo" | "Sauce" | null;

interface NewItemFormData {
  name: string;
  description: string;
  available: boolean;
  category: string;
  image?: string;
  price: number;
}

export function buildMenuItemApiPayload(
  restaurantId: string,
  itemData: NewItemFormData,
  addSheetType: AddSheetType
) {
  return {
    restaurantId,
    name: itemData.name,
    description: itemData.description,
    type: addSheetType?.toLowerCase() || "item",
    available: itemData.available,
    category: itemData.category,
    images: [itemData.image || "https://placehold.co/300x200.png"],
    pricing_unit: "quantity",
    pricing_options: [{ label: "Regular", price: itemData.price }],
    portions: ["Regular"],
  };
}