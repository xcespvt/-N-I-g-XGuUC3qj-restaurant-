import React, { useState, useMemo } from 'react';
import { X, Plus, Minus, Trash2, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CustomizationItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isVeg: boolean;
  inStock: boolean;
}

export interface CustomizationSection {
  id: string;
  title: string;
  subtitle: string;
  type: 'addon' | 'beverage';
  selectionLimit?: number;
  items: CustomizationItem[];
}

export interface ItemVariant {
  id: string;
  name: string;
  price: number;
}

interface CustomizationBottomSheetProps {
  item: {
    id: string;
    name: string;
    price: number;
    image: string;
    isVeg: boolean;
    bestseller?: boolean;
    pricing_options?: Array<{ label: string, price: number, default?: boolean }>;
    allowedAddons?: string[];
    allowedToppings?: string[];
    portionOptions?: Array<{ name: string, price: number }>;
  };
  onClose: () => void;
  onAddToCart: (cartItem: any) => void;
}

// Helper to generate dynamic variants based on item name
const getVariantsForItem = (item: any): ItemVariant[] => {
  if (item.pricing_options && item.pricing_options.length > 0) {
    return item.pricing_options.map((opt: any, index: number) => ({
      id: `v${index + 1}`,
      name: opt.label,
      price: opt.price,
    }));
  }
  if (item.portionOptions && item.portionOptions.length > 0) {
    return item.portionOptions.map((opt: any, index: number) => ({
      id: `v${index + 1}`,
      name: opt.name,
      price: opt.price,
    }));
  }
  
  // Default variant if no pricing options provided
  return [
    { id: 'v1', name: 'Regular', price: item.price }
  ];
};

// Helper to generate dynamic addons based on item name
const getAddonsForItem = (item: any): CustomizationSection[] => {
  const sections: CustomizationSection[] = [];

  if (item.allowedToppings && item.allowedToppings.length > 0) {
    sections.push({
      id: 's-toppings',
      title: 'Extra Toppings',
      subtitle: 'Add multiple • Optional',
      type: 'addon',
      items: item.allowedToppings.map((topping: string, index: number) => ({
        id: `t${index}`,
        name: topping,
        price: 0, // Backend array contains strings only, no price info attached
        isVeg: item.isVeg !== undefined ? item.isVeg : true,
        inStock: true
      }))
    });
  }

  if (item.allowedAddons && item.allowedAddons.length > 0) {
    sections.push({
      id: 's-addons',
      title: 'Addons',
      subtitle: 'Add multiple • Optional',
      type: 'addon',
      items: item.allowedAddons.map((addon: string, index: number) => ({
        id: `a${index}`,
        name: addon,
        price: 0, // Default to 0 as strings don't have price
        isVeg: item.isVeg !== undefined ? item.isVeg : true,
        inStock: true
      }))
    });
  }

  return sections;
};

export const CustomizationBottomSheet: React.FC<CustomizationBottomSheetProps> = ({ item, onClose, onAddToCart }) => {
  const variants = useMemo(() => getVariantsForItem(item), [item]);
  const sections = useMemo(() => getAddonsForItem(item), [item]);
  
  const [selectedVariant, setSelectedVariant] = useState<ItemVariant>(variants[0]);
  const [mainQuantity, setMainQuantity] = useState(1);
  const [addonQuantities, setAddonQuantities] = useState<Record<string, number>>({});
  const [selectedBeverages, setSelectedBeverages] = useState<Record<string, boolean>>({});

  const handleAddonIncrement = (id: string) => {
    setAddonQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleAddonDecrement = (id: string) => {
    setAddonQuantities(prev => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  const toggleBeverage = (id: string, limit?: number) => {
    setSelectedBeverages(prev => {
      const isSelected = prev[id];
      if (isSelected) {
        const next = { ...prev };
        delete next[id];
        return next;
      } else {
        if (limit) {
          const currentCount = Object.keys(prev).length;
          if (currentCount >= limit) return prev;
        }
        return { ...prev, [id]: true };
      }
    });
  };

  const calculateTotalPrice = () => {
    let total = selectedVariant.price * mainQuantity;
    
    sections.forEach(section => {
      section.items.forEach(addon => {
        if (section.type === 'beverage') {
          const qty = addonQuantities[addon.id] || 0;
          total += addon.price * qty;
        } else if (section.type === 'addon') {
          if (selectedBeverages[addon.id]) {
            total += addon.price;
          }
        }
      });
    });
    
    return total;
  };

  const handleAddToCart = () => {
    const selectedAddonsList = sections
      .filter(s => s.type === 'addon')
      .flatMap(s => s.items)
      .filter(item => selectedBeverages[item.id])
      .map(item => ({ id: item.id, name: item.name, price: item.price, quantity: 1 }));

    const selectedBeveragesList = sections
      .filter(s => s.type === 'beverage')
      .flatMap(s => s.items)
      .filter(item => addonQuantities[item.id] > 0)
      .map(item => ({ id: item.id, name: item.name, price: item.price, quantity: addonQuantities[item.id] }));

    onAddToCart({
      item,
      variant: selectedVariant,
      mainQuantity,
      selectedAddons: selectedAddonsList,
      selectedSides: selectedBeveragesList,
      totalPrice: calculateTotalPrice()
    });
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[24px] z-[160] flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Top Section (Item Header) */}
        <div className="p-4 border-b border-gray-100 shrink-0 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 active:scale-95 transition-transform"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex gap-4 pr-10">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-[20px] font-bold text-gray-900 leading-tight mb-1">{item.name}</h2>
              <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium">
                <span>Serves 1</span>
                {item.bestseller && (
                  <>
                    <span>•</span>
                    <span className="text-[#1E90FF] font-bold">Bestseller</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 pb-32">
          {/* Variants Section (Size/Quantity/Weight) */}
          {variants.length > 1 && (
            <div className="border-b border-gray-100">
              <div className="px-4 py-4 bg-gray-50/50">
                <h3 className="text-[18px] font-bold text-gray-900">Choose Size / Quantity</h3>
                <p className="text-[13px] text-gray-500 font-medium mt-0.5">Select one option • Required</p>
              </div>
              <div className="px-4 py-3 grid grid-cols-3 gap-3">
                {variants.map((variant) => (
                  <div 
                    key={variant.id} 
                    onClick={() => setSelectedVariant(variant)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedVariant.id === variant.id 
                        ? 'border-[#1E90FF] bg-[#eff6ff] shadow-[0_2px_10px_rgba(30,144,255,0.1)]' 
                        : 'border-gray-200 bg-white shadow-sm hover:border-gray-300'
                    }`}
                  >
                    <span className={`text-[14px] font-bold mb-1 ${selectedVariant.id === variant.id ? 'text-[#1E90FF]' : 'text-gray-700'}`}>
                      {variant.name}
                    </span>
                    <span className="text-[13px] font-black text-gray-900">₹{variant.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add-on Sections */}
          {sections.map((section, index) => (
            <div key={section.id} className="border-b border-gray-100 last:border-0">
              <div className="px-4 py-4 bg-gray-50/50">
                <h3 className="text-[18px] font-bold text-gray-900">{section.title}</h3>
                <p className="text-[13px] text-gray-500 font-medium mt-0.5">{section.subtitle}</p>
              </div>
              
              <div className="px-4 py-3 grid grid-cols-2 gap-3">
                {section.items.map((addon) => {
                  const isAddonSelected = addonQuantities[addon.id] > 0;
                  const isBeverageSelected = selectedBeverages[addon.id];
                  const isSelected = isAddonSelected || isBeverageSelected;
                  
                  return (
                    <div 
                      key={addon.id} 
                      onClick={() => {
                        if (!addon.inStock) return;
                        if (section.type === 'addon') {
                          toggleBeverage(addon.id, section.selectionLimit);
                        } else if (section.type === 'beverage' && !addonQuantities[addon.id]) {
                          handleAddonIncrement(addon.id);
                        }
                      }}
                      className={`relative flex flex-col p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-[#1E90FF] bg-[#eff6ff] shadow-[0_2px_10px_rgba(30,144,255,0.1)]' 
                          : 'border-gray-200 bg-white shadow-sm'
                      } ${!addon.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {/* Top: Veg/Non-veg & Name */}
                      <div className="flex items-start gap-2 mb-1">
                        <div className={`mt-0.5 w-3.5 h-3.5 border flex items-center justify-center rounded-sm shrink-0 ${addon.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                          {addon.isVeg ? (
                            <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                          ) : (
                            <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[4px] border-b-red-600" />
                          )}
                        </div>
                        <h4 className="text-[13px] font-bold text-gray-900 leading-tight">{addon.name}</h4>
                      </div>

                      {/* Middle: Description */}
                      <div className="flex-1 mb-3 pl-[22px]">
                        {addon.description && (
                          <p className="text-[11px] text-gray-500 line-clamp-2 leading-snug">{addon.description}</p>
                        )}
                        {!addon.inStock && (
                          <span className="inline-block mt-1 text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md uppercase tracking-wide">Out of Stock</span>
                        )}
                      </div>

                      {/* Bottom: Price & Action */}
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                        <span className="text-[14px] font-black text-gray-900">₹{addon.price}</span>
                        
                        {section.type === 'beverage' ? (
                          addon.inStock ? (
                            addonQuantities[addon.id] ? (
                              <div className="flex items-center justify-between bg-[#1E90FF] rounded-lg h-7 px-1 min-w-[64px] shadow-sm">
                                <button onClick={(e) => { e.stopPropagation(); handleAddonDecrement(addon.id); }} className="w-6 h-full flex items-center justify-center text-white active:scale-95">
                                  <Minus className="w-3.5 h-3.5 stroke-[3]" />
                                </button>
                                <span className="text-[12px] font-bold text-white">{addonQuantities[addon.id]}</span>
                                <button onClick={(e) => { e.stopPropagation(); handleAddonIncrement(addon.id); }} className="w-6 h-full flex items-center justify-center text-white active:scale-95">
                                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleAddonIncrement(addon.id); }}
                                className="bg-white text-[#1E90FF] border border-[#1E90FF]/30 px-3 py-1 rounded-lg font-bold text-[12px] flex items-center gap-1 active:scale-95 transition-transform shadow-sm hover:bg-[#eff6ff]"
                              >
                                ADD
                              </button>
                            )
                          ) : (
                            <button disabled className="bg-gray-50 text-gray-400 border border-gray-200 px-3 py-1 rounded-lg font-bold text-[12px]">
                              ADD
                            </button>
                          )
                        ) : (
                          // Addon selection (Checkbox)
                          <button 
                            disabled={!addon.inStock}
                            onClick={(e) => { e.stopPropagation(); toggleBeverage(addon.id, section.selectionLimit); }}
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                              isSelected ? 'border-[#1E90FF] bg-[#1E90FF]' : 'border-gray-300 bg-white'
                            }`}
                          >
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl h-14 px-3 min-w-[110px]">
              <button 
                onClick={() => setMainQuantity(Math.max(1, mainQuantity - 1))}
                className="w-8 h-full flex items-center justify-center text-gray-600"
              >
                {mainQuantity === 1 ? <Trash2 className="w-4 h-4 text-red-500" /> : <Minus className="w-4 h-4 stroke-[3]" />}
              </button>
              <span className="text-[16px] font-bold text-gray-900">{mainQuantity}</span>
              <button 
                onClick={() => setMainQuantity(mainQuantity + 1)}
                className="w-8 h-full flex items-center justify-center text-[#1E90FF]"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
            
            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-[#1E90FF] text-white h-14 rounded-xl font-bold text-[16px] flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm"
            >
              Add to Cart • ₹{calculateTotalPrice()}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};
