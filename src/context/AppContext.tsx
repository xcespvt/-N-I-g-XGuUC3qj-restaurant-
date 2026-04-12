
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast"

// --- TYPE DEFINITIONS ---

export interface Table {
  id: string;
  name: string;
  capacity: number;
  status: 'Available' | 'Occupied';
  type: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  pincode: string;
  manager: string;
  managerPhone: string;
  hours: string;
  gst?: string;
  fssai?: string;
  ordersToday: number;
  status: "Active" | "Inactive";
  isOnline: boolean;
  isRushHour?: boolean;
  // Optional backend identifier for API integrations
  restaurantId?: string;
}

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  category: string;
}

export type OrderStatus = "Incoming" | "New" | "Preparing" | "Cooking" | "Ready" | "Delivered" | "Cancelled" | "Rejected";

export interface Order {
  id: string;
  customer: string;
  time: string;
  date: string;
  status: OrderStatus;
  type: "Dine-in" | "Takeaway" | "Delivery";
  items: OrderItem[];
  prepTime: string;
  total: number;
  source?: 'Offline' | 'Online';
  customerDetails: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  payment: {
    method: string;
    status: 'Paid' | 'Pending';
  };
  offer?: {
    code: string;
    type: string;
  };
  deliveryPartner?: {
    name: string;
    avatar: string;
    avatarFallback: string;
    rating: number;
  };
  pickupOtp?: string;
}

export type BookingStatus = "Confirmed" | "Pending" | "Completed" | "Cancelled";

export interface Booking {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  partySize: number;
  status: BookingStatus;
  tables: Table[];
}

export type PendingBooking = Omit<Booking, "id" | "status">;

export interface Feedback {
    id: string;
    customer: {
      name: string;
      avatar: string;
      fallback: string;
      orderCount: number;
    };
    orderType: string;
    rating: number;
    comment: string;
    date: string;
    items: string[];
    photos: { url: string; hint: string }[];
    replied: boolean;
    reply: string;
}

export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    aiHint: string;
    available: boolean;
    dietaryType: 'Veg' | 'Non-Veg';
    portionOptions?: { name: string; price: number }[];
}

export type TakeawayCartItem = Omit<MenuItem, 'price'> & { 
    quantity: number; 
    cartItemId: string; 
    portion: string;
    price: number; 
};

export type NewMenuItem = Omit<MenuItem, 'id' | 'image' | 'aiHint'>;

export interface NotificationSettings {
    newOrders: boolean;
    payouts: boolean;
    promotions: boolean;
    orderUpdates: boolean;
    customerReviews: boolean;
    systemUpdates: boolean;
}

export interface OwnerInfo {
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
}

export interface ServiceSettings {
    delivery: boolean;
    takeaway: boolean;
    dineIn: boolean;
    booking: boolean;
}

export type RefundStatus = "Pending" | "Approved" | "Rejected";

export interface RefundRequest {
  id: string;
  orderId: string;
  customerName: string;
  customerAvatar: string;
  customerFallback: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  date: string;
  items: { name: string; image: string; aiHint: string; price: number }[];
  photos?: { url: string; hint: string }[];
  orderType: "Delivery" | "Booking";
  orderTime: string;
  costSplit: {
    restaurant: number;
    crevings: number;
  };
}


type SubscriptionPlan = "Starter Plan" | "Growth Plan" | "Pro" | "Free";

interface AppContextType {
  branches: Branch[];
  selectedBranch: string;
  setSelectedBranch: (branchId: string) => void;
  addBranch: (branchData: Omit<Branch, 'id' | 'ordersToday' | 'isOnline'>) => void;
  updateBranch: (branch: Branch) => void;
  deleteBranch: (branchId: string) => void;
  toggleBranchOnlineStatus: (branchId: string) => void;

  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderPrepTime: (orderId: string, extraMinutes: number) => void;
  addOrder: (cart: TakeawayCartItem[], customerName: string, customerPhone: string) => void;
  acceptNewOrder: (order: Order, prepTime: string) => void;
  
  menuItems: MenuItem[];
  addMenuItem: (item: NewMenuItem) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (itemId: number) => void;
  toggleMenuItemAvailability: (itemId: number) => void;

  categories: string[];
  addCategory: (name: string) => void;
  
  tables: Table[];
  addTable: (name: string, capacity: number, type: string) => void;
  updateTable: (table: Table) => void;
  deleteTable: (tableId: string) => void;
  
  tableTypes: string[];
  addTableType: (name: string) => void;
  deleteTableType: (name: string) => void;

  facilities: string[];
  updateFacilities: (facilities: string[]) => void;

  serviceSettings: ServiceSettings;
  updateServiceSetting: (setting: keyof ServiceSettings, value: boolean) => void;

  ownerInfo: OwnerInfo;
  updateOwnerInfo: (info: OwnerInfo) => void;

  bookings: Booking[];
  addBooking: (bookingData: PendingBooking, fee: number) => void;
  updateBookingStatus: (bookingId: string, status: "Confirmed" | "Cancelled") => void;

  pendingBooking: PendingBooking | null;
  setPendingBooking: (booking: PendingBooking | null) => void;
  resetPendingBooking: () => void;

  feedback: Feedback[];
  addReplyToFeedback: (feedbackId: string, reply: string) => void;
  
  refunds: RefundRequest[];
  handleRefundRequest: (refundId: string, status: "Approved" | "Rejected") => void;

  notificationSettings: NotificationSettings;
  updateNotificationSetting: (setting: keyof NotificationSettings, value: boolean) => void;

  takeawayCart: TakeawayCartItem[];
  addToTakeawayCart: (item: MenuItem, quantity: number, portion: string, price: number) => void;
  removeFromTakeawayCart: (cartItemId: string) => void;
  incrementTakeawayCartItem: (cartItemId: string) => void;
  decrementTakeawayCartItem: (cartItemId: string) => void;
  clearTakeawayCart: () => void;
  clearPortionsFromCart: (itemId: number, portionName: string) => void;

  isRestaurantOnline: boolean;
  setRestaurantOnline: (isOnline: boolean) => void;
  isBusy: boolean;
  setBusy: (isBusy: boolean) => void;

  walletBalance: number;
  initiateWithdrawal: (amount: number) => void;
  subscriptionPlan: SubscriptionPlan;
  setSubscriptionPlan: (plan: SubscriptionPlan) => void;
}

// --- MOCK DATA ---

const initialTables: Table[] = [];

const initialTableTypes = ["Normal", "Couple", "Family", "Private", "Outdoor"];


const initialBranches: Branch[] = [];


const initialOrders: Order[] = [];

const initialMenuItems: MenuItem[] = [];

const initialCategories = ["All"];

const initialBookings: Booking[] = [];

const initialFeedback: Feedback[] = [];

const initialRefunds: RefundRequest[] = [];


const initialNotificationSettings: NotificationSettings = {
    newOrders: true,
    payouts: true,
    promotions: false,
    orderUpdates: true,
    customerReviews: true,
    systemUpdates: true,
}

const initialServiceSettings: ServiceSettings = {
    delivery: true,
    takeaway: true,
    dineIn: true,
    booking: true,
}

const initialFacilities = ['ac', 'washroom', 'parking', 'familyFriendly', 'wheelchair-seating', 'kerbside-pickup'];

const initialOwnerInfo: OwnerInfo = {
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
};

// --- CONTEXT & PROVIDER ---

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();

  // STATE
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [selectedBranch, setSelectedBranch] = useState<string>(initialBranches[0].id);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [tableTypes, setTableTypes] = useState<string[]>(initialTableTypes);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [pendingBooking, setPendingBooking] = useState<PendingBooking | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>(initialFeedback);
  const [refunds, setRefunds] = useState<RefundRequest[]>(initialRefunds);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(initialNotificationSettings);
  const [facilities, setFacilities] = useState<string[]>(initialFacilities);
  const [serviceSettings, setServiceSettings] = useState<ServiceSettings>(initialServiceSettings);
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo>(initialOwnerInfo);
  const [isRestaurantOnline, setRestaurantOnline] = useState<boolean>(true);
  const [isBusy, setBusy] = useState<boolean>(false);
  const [walletBalance, setWalletBalance] = useState<number>(2458);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>('Pro');
  const [takeawayCart, setTakeawayCart] = useState<TakeawayCartItem[]>([]);

  // HANDLERS
  const addBranch = useCallback((branchData: Omit<Branch, 'id' | 'ordersToday' | 'isOnline'>) => {
    const newBranch: Branch = {
      id: branchData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + `-${Math.random().toString(36).substr(2, 5)}`,
      ...branchData,
      ordersToday: 0,
      isOnline: branchData.status === 'Active',
    };
    setBranches(prev => [...prev, newBranch]);
    toast({ title: "Branch Added", description: `${newBranch.name} has been created.` });
  }, [toast]);

  const updateBranch = useCallback((updatedBranch: Branch) => {
    setBranches(prev => prev.map(b => b.id === updatedBranch.id ? { ...updatedBranch, isOnline: updatedBranch.status === 'Active' ? updatedBranch.isOnline : false } : b));
    toast({ title: "Branch Updated", description: `${updatedBranch.name} has been updated.`});
  }, [toast]);

  const deleteBranch = useCallback((branchId: string) => {
    setBranches(prev => {
        const branchToDelete = prev.find(b => b.id === branchId);
        if (branchToDelete) {
             toast({
                title: "Branch Deleted",
                description: `The branch "${branchToDelete.name}" has been permanently deleted.`,
                variant: "destructive",
            });
        }
        return prev.filter(b => b.id !== branchId)
    });
  }, [toast]);

  const toggleBranchOnlineStatus = useCallback((branchId: string) => {
    setBranches(prev => prev.map(b => {
        if (b.id === branchId) {
            toast({
                title: `${b.name} is now ${b.isOnline ? 'Offline' : 'Online'}`
            });
            return { ...b, isOnline: !b.isOnline };
        }
        return b;
    }));
  }, [toast]);
  
  const updateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        let updatedOrder = { ...o, status: newStatus };
        if (newStatus === 'Preparing' && o.type === 'Takeaway' && !o.pickupOtp) {
          updatedOrder.pickupOtp = Math.floor(100000 + Math.random() * 900000).toString();
        }
        return updatedOrder;
      }
      return o;
    }));
    toast({ title: "Order Updated", description: `Order ${orderId} is now "${newStatus}".` });
  }, [toast]);

  const updateOrderPrepTime = useCallback((orderId: string, extraMinutes: number) => {
    setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
            const currentPrepTime = parseInt(o.prepTime.split(' ')[0], 10) || 0;
            const newPrepTime = currentPrepTime + extraMinutes;
            toast({ title: "Time Added", description: `${extraMinutes} minutes added to order ${orderId}.` });
            return { ...o, prepTime: `${newPrepTime} min` };
        }
        return o;
    }));
  }, [toast]);


  const acceptNewOrder = useCallback((order: Order, prepTime: string) => {
    const newOrder = {
      ...order,
      status: 'Preparing' as OrderStatus,
      prepTime,
      id: `ORD-${(orders.length + 1).toString().padStart(3, '0')}` // Ensure unique ID
    };
    setOrders(prev => [newOrder, ...prev]);
  }, [orders]);

  const addOrder = useCallback((cart: TakeawayCartItem[], customerName: string, customerPhone: string) => {
    setOrders(prevOrders => {
      const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
      const newOrder: Order = {
        id: `ORD-${(prevOrders.length + 1).toString().padStart(3, '0')}`,
        customer: customerName || 'Walk-in Customer',
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        date: new Date().toISOString().split('T')[0],
        status: 'Preparing',
        type: 'Takeaway',
        source: 'Offline',
        items: cart.map(cartItem => ({
            id: cartItem.id,
            name: `${cartItem.name}${cartItem.portion !== 'Full' ? ` (${cartItem.portion})` : ''}`,
            quantity: cartItem.quantity,
            price: cartItem.price,
            category: cartItem.category,
        })),
        prepTime: '15 min',
        total: subtotal * 1.18,
        customerDetails: {
            name: customerName || 'Walk-in Customer',
            address: 'Takeaway Counter',
            phone: customerPhone || 'N/A',
            email: 'N/A'
        },
        payment: {
            method: 'Offline',
            status: 'Paid'
        },
        pickupOtp: Math.floor(100000 + Math.random() * 900000).toString(),
      };
      return [newOrder, ...prevOrders];
    });
  }, []);

  const addMenuItem = useCallback((itemData: NewMenuItem) => {
    setMenuItems(prev => {
        const newItem: MenuItem = {
            id: prev.length > 0 ? Math.max(...prev.map(i => i.id)) + 1 : 1,
            ...itemData,
            image: "https://placehold.co/300x200.png",
            aiHint: itemData.name.toLowerCase().split(" ").slice(0, 2).join(" "),
        };
        toast({ title: "Menu Item Added", description: `${newItem.name} has been added.` });
        return [newItem, ...prev];
    });
  }, [toast]);

  const updateMenuItem = useCallback((itemData: MenuItem) => {
    setMenuItems(prev => prev.map(item => item.id === itemData.id ? itemData : item));
    toast({ title: "Menu Item Updated", description: `${itemData.name} has been updated.` });
  }, [toast]);

  const deleteMenuItem = useCallback((itemId: number) => {
    setMenuItems(prev => {
        const itemName = prev.find(item => item.id === itemId)?.name || "The item";
        toast({
            variant: "destructive",
            title: "Menu Item Deleted",
            description: `${itemName} has been removed from the menu.`,
        });
        return prev.filter(item => item.id !== itemId);
    });
  }, [toast]);

  const toggleMenuItemAvailability = useCallback((itemId: number) => {
    setMenuItems(prev => prev.map(item => item.id === itemId ? { ...item, available: !item.available } : item));
  }, []);

  const addCategory = useCallback((name: string) => {
    setCategories(prev => {
        const newCategories = [...prev];
        if (name && !newCategories.find(c => c.toLowerCase() === name.toLowerCase())) {
            // Add to the end, but before "All" if it exists.
            const allIndex = newCategories.indexOf("All");
            if(allIndex !== -1) {
                newCategories.splice(allIndex, 0, name);
            } else {
                 newCategories.push(name);
            }
            toast({ title: "Category Added", description: `"${name}" has been added.` });
            return newCategories;
        } else {
            toast({ variant: "destructive", title: "Category Exists", description: "This category already exists." });
            return prev;
        }
    });
  }, [toast]);
  
  const addTable = useCallback((name: string, capacity: number, type: string) => {
    setTables(prev => {
      const newTable: Table = {
        id: name.toUpperCase() + `-${Date.now()}`,
        name,
        capacity,
        status: 'Available',
        type,
      };
      toast({ title: "Table Added", description: `Table ${name} has been added.` });
      return [...prev, newTable];
    });
  }, [toast]);

  const updateTable = useCallback((updatedTable: Table) => {
    setTables(prev =>
      prev.map(t => (t.id === updatedTable.id ? updatedTable : t))
    );
    toast({ title: "Table Updated", description: `Table ${updatedTable.name} has been updated.` });
  }, [toast]);

  const deleteTable = useCallback((tableId: string) => {
    setTables(prev => {
      const tableToDelete = prev.find(t => t.id === tableId);
      if (tableToDelete) {
        toast({
          title: "Table Deleted",
          description: `Table "${tableToDelete.name}" has been removed.`,
          variant: "destructive",
        });
      }
      return prev.filter(t => t.id !== tableId);
    });
  }, [toast]);
  
  const addTableType = useCallback((name: string) => {
    setTableTypes(prev => {
        if (name && !prev.find(t => t.toLowerCase() === name.toLowerCase())) {
            toast({ title: "Table Type Added", description: `"${name}" has been added.` });
            return [...prev, name];
        } else {
            toast({ variant: "destructive", title: "Type Exists", description: "This table type already exists." });
            return prev;
        }
    });
  }, [toast]);

  const deleteTableType = useCallback((name: string) => {
    setTableTypes(prev => {
        toast({ title: "Table Type Removed", description: `"${name}" has been removed.`, variant: "destructive" });
        return prev.filter(t => t !== name);
    });
  }, [toast]);


  const updateFacilities = useCallback((newFacilities: string[]) => {
    setFacilities(newFacilities);
  }, []);

  const updateServiceSetting = useCallback((setting: keyof ServiceSettings, value: boolean) => {
    setServiceSettings(prev => ({ ...prev, [setting]: value }));
  }, []);

  const updateOwnerInfo = useCallback((info: OwnerInfo) => {
    setOwnerInfo(info);
  }, []);


  const addBooking = useCallback((bookingData: PendingBooking, fee: number) => {
    const newBookingId = `BK-${(bookings.length + 1).toString().padStart(3, '0')}`;
    
    // 1. Add to bookings list
    setBookings(prev => {
        const newBooking: Booking = {
            id: newBookingId,
            ...bookingData,
            status: "Confirmed",
        };
        return [newBooking, ...prev];
    });
    
    // 2. Add to orders list
    setOrders(prev => {
        const newOrder: Order = {
            id: `ORD-B-${newBookingId}`,
            customer: bookingData.name,
            time: bookingData.time,
            date: bookingData.date,
            status: 'Preparing', // or 'Incoming'
            type: 'Dine-in',
            source: 'Online',
            items: [{
                id: 999, // Special ID for booking fee
                name: `Booking for ${bookingData.partySize} guests`,
                quantity: 1,
                price: fee,
                category: 'Booking',
            }],
            prepTime: 'N/A',
            total: fee * 1.18, // Fee with tax
            customerDetails: {
                name: bookingData.name,
                address: `Tables: ${bookingData.tables.map(t => t.name).join(', ')}`,
                phone: bookingData.phone,
                email: 'N/A',
            },
            payment: {
                method: 'Online',
                status: 'Paid',
            }
        };
        return [newOrder, ...prev];
    });

    // 3. Update table status
    setTables(prevTables => 
        prevTables.map(table => 
            bookingData.tables.some(selected => selected.id === table.id)
                ? { ...table, status: 'Occupied' }
                : table
        )
    );
  }, [bookings.length]);

  const updateBookingStatus = useCallback((bookingId: string, status: "Confirmed" | "Cancelled") => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    toast({ title: "Booking Updated", description: `Booking ${bookingId} has been ${status}.` });
  }, [toast]);

  const resetPendingBooking = useCallback(() => {
    setPendingBooking(null);
  }, []);

  const addReplyToFeedback = useCallback((feedbackId: string, reply: string) => {
    setFeedback(prev => prev.map(f => f.id === feedbackId ? { ...f, reply, replied: true } : f));
    toast({ title: "Reply Sent", description: "Your reply has been posted." });
  }, [toast]);
  
  const handleRefundRequest = useCallback((refundId: string, status: "Approved" | "Rejected") => {
      setRefunds(prev => prev.map(r => r.id === refundId ? { ...r, status } : r));
      toast({
          title: `Refund ${status}`,
          description: `The refund request ${refundId} has been ${status.toLowerCase()}.`
      });
  }, [toast]);

  const updateNotificationSetting = useCallback((setting: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({...prev, [setting]: value}));
  }, []);

  const addToTakeawayCart = useCallback((item: MenuItem, quantity: number, portion: string, price: number) => {
    setTakeawayCart(prevCart => {
        const cartItemId = `${item.id}-${portion}`;
        const existingItem = prevCart.find(cartItem => cartItem.cartItemId === cartItemId);
        if (existingItem) {
            return prevCart.map(cartItem => 
                cartItem.cartItemId === cartItemId 
                    ? { ...cartItem, quantity: cartItem.quantity + quantity } 
                    : cartItem
            );
        }
        const { price: basePrice, ...restOfItem } = item;
        return [...prevCart, { ...restOfItem, price, quantity, cartItemId, portion }];
    });
  }, []);

  const removeFromTakeawayCart = useCallback((cartItemId: string) => {
      setTakeawayCart(prevCart => {
          const existingItem = prevCart.find(cartItem => cartItem.cartItemId === cartItemId);
          if (existingItem && existingItem.quantity > 1) {
              return prevCart.map(cartItem => 
                  cartItem.cartItemId === cartItemId 
                      ? { ...cartItem, quantity: cartItem.quantity - 1 } 
                      : cartItem
              );
          }
          return prevCart.filter(cartItem => cartItem.cartItemId !== cartItemId);
      });
  }, []);

  const incrementTakeawayCartItem = useCallback((cartItemId: string) => {
    setTakeawayCart(prevCart =>
      prevCart.map(item =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }, []);

  const decrementTakeawayCartItem = useCallback((cartItemId: string) => {
    setTakeawayCart(prevCart => {
      const itemToUpdate = prevCart.find(item => item.cartItemId === cartItemId);
      if (itemToUpdate && itemToUpdate.quantity > 1) {
        return prevCart.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      // If quantity is 1, remove the item
      return prevCart.filter(item => item.cartItemId !== cartItemId);
    });
  }, []);

  const clearPortionsFromCart = useCallback((itemId: number, portionName: string) => {
      setTakeawayCart(prev => prev.filter(item => !(item.id === itemId && item.portion === portionName)));
  }, []);

  const clearTakeawayCart = useCallback(() => {
      setTakeawayCart([]);
      toast({ title: "Order Cleared", description: "The current takeaway order has been cleared." });
  }, [toast]);

  const initiateWithdrawal = useCallback((amount: number) => {
    setWalletBalance(prev => prev - amount);
  }, []);

  const value = useMemo(() => ({
    branches,
    selectedBranch,
    setSelectedBranch,
    addBranch,
    updateBranch,
    deleteBranch,
    toggleBranchOnlineStatus,
    orders,
    updateOrderStatus,
    updateOrderPrepTime,
    addOrder,
    acceptNewOrder,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemAvailability,
    categories,
    addCategory,
    tables,
    addTable,
    updateTable,
    deleteTable,
    tableTypes,
    addTableType,
    deleteTableType,
    facilities,
    updateFacilities,
    serviceSettings,
    updateServiceSetting,
    ownerInfo,
    updateOwnerInfo,
    bookings,
    addBooking,
    updateBookingStatus,
    pendingBooking,
    setPendingBooking,
    resetPendingBooking,
    feedback,
    addReplyToFeedback,
    refunds,
    handleRefundRequest,
    notificationSettings,
    updateNotificationSetting,
    takeawayCart,
    addToTakeawayCart,
    removeFromTakeawayCart,
    incrementTakeawayCartItem,
    decrementTakeawayCartItem,
    clearTakeawayCart,
    clearPortionsFromCart,
    isRestaurantOnline,
    setRestaurantOnline,
    isBusy,
    setBusy,
    walletBalance,
    initiateWithdrawal,
    subscriptionPlan,
    setSubscriptionPlan,
  }), [
    branches, selectedBranch, addBranch, updateBranch, deleteBranch, toggleBranchOnlineStatus,
    orders, updateOrderStatus, updateOrderPrepTime, addOrder, acceptNewOrder, menuItems, addMenuItem, updateMenuItem, deleteMenuItem,
    toggleMenuItemAvailability, categories, addCategory, tables, addTable, updateTable, deleteTable,
    tableTypes, addTableType, deleteTableType, facilities, updateFacilities, serviceSettings, updateServiceSetting, ownerInfo, updateOwnerInfo,
    bookings, addBooking,
    updateBookingStatus, pendingBooking, setPendingBooking, resetPendingBooking,
    feedback, addReplyToFeedback, refunds, handleRefundRequest, notificationSettings,
    updateNotificationSetting, takeawayCart, addToTakeawayCart, removeFromTakeawayCart,
    incrementTakeawayCartItem, decrementTakeawayCartItem,
    clearPortionsFromCart, isRestaurantOnline, isBusy, walletBalance, initiateWithdrawal, subscriptionPlan, clearTakeawayCart
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
