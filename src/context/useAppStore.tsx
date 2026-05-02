'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Import types from AppContext
export interface Table {
  id: string;
  name: string;
  capacity: number;
  status: 'Available' | 'Occupied';
  type: string;
  tableTypeId?: string;
  section?: string;
  floor?: string;
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
  restaurantId?: string;
  floors?: { floorId: string; name: string }[];
}

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  category: string;
  addons?: { name: string; price: number; quantity: number }[];
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
    status: 'Paid' | 'On Hold';
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
  gstIncluded: boolean;
  // Optional server identifier for API operations
  itemId?: string;
}

export interface CartAddon {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
}

export type TakeawayCartItem = Omit<MenuItem, 'price'> & {
  quantity: number;
  cartItemId: string;
  portion: string;
  price: number;
  addons?: CartAddon[];
};

export type NewMenuItem = Omit<MenuItem, 'id' | 'image' | 'aiHint'>;

export interface NotificationSettings {
  newOrders: boolean;
  payouts: boolean;
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

type SubscriptionPlan = "Free";

// Store interface
interface AppStore {
  // State
  branches: Branch[];
  selectedBranch: string;
  orders: Order[];
  menuItems: MenuItem[];
  categories: any[];
  subCategories: any[];
  tables: Table[];
  tableTypes: { name: string; id: string }[];
  bookings: Booking[];
  pendingBooking: PendingBooking | null;
  feedback: Feedback[];
  refunds: RefundRequest[];
  notificationSettings: NotificationSettings;
  facilities: string[];
  serviceSettings: ServiceSettings;
  ownerInfo: OwnerInfo;
  isRestaurantOnline: boolean;
  isBusy: boolean;
  takeawayCart: TakeawayCartItem[];

  // Actions
  setBranches: (branches: Branch[]) => void;
  setSelectedBranch: (branchId: string) => void;
  addBranch: (branchData: Omit<Branch, 'id' | 'ordersToday' | 'isOnline'>) => void;
  updateBranch: (branch: Branch) => void;
  deleteBranch: (branchId: string) => void;
  toggleBranchOnlineStatus: (branchId: string) => void;

  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderPrepTime: (orderId: string, extraMinutes: number) => void;
  addOrder: (cart: TakeawayCartItem[], customerName: string, customerPhone: string, orderType: 'takeaway' | 'dine-in', table: string | undefined, prepTime: string, paymentStatus: 'Paid' | 'On Hold', paymentMethod: string) => void;
  acceptNewOrder: (order: Order, prepTime: string) => void;

  addMenuItem: (item: NewMenuItem) => void;
  updateMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (itemId: number) => void;
  toggleMenuItemAvailability: (itemId: number) => void;

  addCategory: (name: string) => void;
  addSubCategory: (categoryId: string, name: string) => void;
  setCategories: (categories: any[]) => void;
  setSubCategories: (subCategories: any[]) => void;

  addTable: (name: string, capacity: number, type: string) => void;
  updateTable: (table: Table) => void;
  deleteTable: (tableId: string) => void;
  setTables: (tables: Table[]) => void;

  addTableType: (name: string) => void;
  deleteTableType: (id: string) => void;
  setTableTypes: (types: { name: string; id: string }[]) => void;

  updateFacilities: (facilities: string[]) => void;

  updateServiceSetting: (setting: keyof ServiceSettings, value: boolean) => void;

  updateOwnerInfo: (info: OwnerInfo) => void;

  addBooking: (bookingData: PendingBooking, fee: number) => void;
  updateBookingStatus: (bookingId: string, status: "Confirmed" | "Cancelled") => void;

  setPendingBooking: (booking: PendingBooking | null) => void;
  resetPendingBooking: () => void;

  addReplyToFeedback: (feedbackId: string, reply: string) => void;

  handleRefundRequest: (refundId: string, status: "Approved" | "Rejected") => void;

  updateNotificationSetting: (setting: keyof NotificationSettings, value: boolean) => void;

  addToTakeawayCart: (item: MenuItem, quantity: number, portion: string, price: number, addons?: CartAddon[]) => void;
  removeFromTakeawayCart: (cartItemId: string) => void;
  incrementTakeawayCartItem: (cartItemId: string) => void;
  decrementTakeawayCartItem: (cartItemId: string) => void;
  clearTakeawayCart: () => void;
  clearPortionsFromCart: (itemId: number, portionName: string) => void;

  setRestaurantOnline: (isOnline: boolean) => void;
  setBusy: (isBusy: boolean) => void;

  setBookings: (bookings: Booking[]) => void;
  updateBranchFloors: (branchId: string, floors: { floorId: string; name: string }[]) => void;
  // Toast function for notifications
  showToast: (title: string, description?: string, variant?: 'default' | 'destructive') => void;
}

// Create the store
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        branches: [],
        selectedBranch: "",
        orders: [],
        menuItems: [],
        categories: [{ name: "All" }, { name: "Pizza" }, { name: "Sides" }, { name: "Beverages" }, { name: "Combos" }],
        subCategories: [{ name: "All" }, { name: "Pizza" }, { name: "Sides" }, { name: "Beverages" }, { name: "Combos" }],
        tables: [],
        tableTypes: [],
        bookings: [],
        pendingBooking: null,
        feedback: [],
        refunds: [],
        notificationSettings: {
          newOrders: true,
          payouts: true,
          orderUpdates: true,
          customerReviews: true,
          systemUpdates: true,
        },
        facilities: [],
        serviceSettings: {
          delivery: false,
          takeaway: false,
          dineIn: false,
          booking: false,
        },
        ownerInfo: {
          name: "",
          email: "",
          phone: "",
          whatsapp: "",
        },
        isRestaurantOnline: true,
        isBusy: false,
        takeawayCart: [],

        // Toast function placeholder - will be set by components that use toast
        showToast: (title: string, description?: string, variant?: 'default' | 'destructive') => {
          console.log('Toast:', title, description, variant);
        },

        // Actions
        setBranches: (newBranches: Branch[]) => {
          const currentSelected = get().selectedBranch;
          const exists = newBranches.some(b => b.id === currentSelected);
          const nextSelected = exists ? currentSelected : (newBranches[0]?.id ?? currentSelected);
          const selectedBranchObj = newBranches.find(b => b.id === nextSelected);
          
          set({
            branches: newBranches,
            selectedBranch: nextSelected,
            isRestaurantOnline: selectedBranchObj?.isOnline ?? true,
            isBusy: selectedBranchObj?.isRushHour ?? false,
          });
        },
        setSelectedBranch: (branchId: string) => {
          const branch = get().branches.find(b => b.id === branchId);
          set({ 
            selectedBranch: branchId,
            isRestaurantOnline: branch?.isOnline ?? true,
            isBusy: branch?.isRushHour ?? false,
          });
        },

        setTables: (newTables: Table[]) => {
          set({ tables: newTables });
        },

        setBookings: (newBookings: Booking[]) => {
          set({ bookings: newBookings });
        },

        addBranch: (branchData: Omit<Branch, 'id' | 'ordersToday' | 'isOnline'>) => {
          const newBranch: Branch = {
            id: branchData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + `-${Math.random().toString(36).substr(2, 5)}`,
            ...branchData,
            ordersToday: 0,
            isOnline: branchData.status === 'Active',
          };
          set((state) => ({
            branches: [...state.branches, newBranch]
          }));
          get().showToast("Branch Added", `${newBranch.name} has been created.`);
        },

        updateBranch: (updatedBranch: Branch) => {
          set((state) => ({
            branches: state.branches.map(b =>
              b.id === updatedBranch.id
                ? { ...updatedBranch, isOnline: updatedBranch.status === 'Active' ? updatedBranch.isOnline : false }
                : b
            )
          }));
          get().showToast("Branch Updated", `${updatedBranch.name} has been updated.`);
        },

        deleteBranch: (branchId: string) => {
          const branchToDelete = get().branches.find(b => b.id === branchId);
          set((state) => ({
            branches: state.branches.filter(b => b.id !== branchId)
          }));
          if (branchToDelete) {
            get().showToast("Branch Deleted", `The branch "${branchToDelete.name}" has been permanently deleted.`, 'destructive');
          }
        },

        toggleBranchOnlineStatus: (branchId: string) => {
          set((state) => ({
            branches: state.branches.map(b => {
              if (b.id === branchId) {
                get().showToast(`${b.name} is now ${b.isOnline ? 'Offline' : 'Online'}`);
                return { ...b, isOnline: !b.isOnline };
              }
              return b;
            })
          }));
        },

        updateOrderStatus: (orderId: string, newStatus: OrderStatus) => {
          set((state) => ({
            orders: state.orders.map(o => {
              if (o.id === orderId) {
                let updatedOrder = { ...o, status: newStatus };
                if (newStatus === 'Preparing' && o.type === 'Takeaway' && !o.pickupOtp) {
                  updatedOrder.pickupOtp = Math.floor(100000 + Math.random() * 900000).toString();
                }
                return updatedOrder;
              }
              return o;
            })
          }));
          get().showToast("Order Updated", `Order ${orderId} is now "${newStatus}".`);
        },

        updateOrderPrepTime: (orderId: string, extraMinutes: number) => {
          set((state) => ({
            orders: state.orders.map(o => {
              if (o.id === orderId) {
                const currentPrepTime = parseInt(o.prepTime.split(' ')[0], 10) || 0;
                const newPrepTime = currentPrepTime + extraMinutes;
                return { ...o, prepTime: `${newPrepTime} min` };
              }
              return o;
            })
          }));
          get().showToast("Time Added", `${extraMinutes} minutes added to order ${orderId}.`);
        },

        acceptNewOrder: (order: Order, prepTime: string) => {
          const newOrder = {
            ...order,
            status: 'Preparing' as OrderStatus,
            prepTime,
            id: `ORD-${(get().orders.length + 1).toString().padStart(3, '0')}`
          };
          set((state) => ({
            orders: [newOrder, ...state.orders]
          }));
        },

        addOrder: (cart: TakeawayCartItem[], customerName: string, customerPhone: string, orderType: 'takeaway' | 'dine-in', table: string | undefined, prepTime: string, paymentStatus: 'Paid' | 'On Hold', paymentMethod: string) => {
          const subtotal = cart.reduce((total, item) => {
            const itemBasePrice = item.price * item.quantity;
            const addonsPrice = (item.addons || []).reduce((aTotal, addon) => aTotal + (addon.price * addon.quantity), 0) * item.quantity;
            return total + itemBasePrice + addonsPrice;
          }, 0);
          const newOrder: Order = {
            id: `ORD-${(get().orders.length + 1).toString().padStart(3, '0')}`,
            customer: customerName || 'Walk-in Customer',
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            date: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD in local time
            status: 'Preparing',
            type: orderType === 'takeaway' ? 'Takeaway' : 'Dine-in',
            source: 'Offline',
            items: cart.map(cartItem => ({
              id: cartItem.id,
              name: `${cartItem.name}${cartItem.portion !== 'Full' ? ` (${cartItem.portion})` : ''}`,
              quantity: cartItem.quantity,
              price: cartItem.price,
              category: cartItem.category,
              addons: cartItem.addons?.map(a => ({
                name: a.name,
                price: a.price,
                quantity: a.quantity
              }))
            })),
            prepTime: prepTime || '15 min',
            total: subtotal * 1.18,
            customerDetails: {
              name: customerName || 'Walk-in Customer',
              address: orderType === 'takeaway' ? 'Takeaway Counter' : `Table: ${table || 'N/A'}`,
              phone: customerPhone || 'N/A',
              email: 'N/A'
            },
            payment: {
              method: paymentMethod || 'Offline',
              status: paymentStatus || 'Paid'
            },
            pickupOtp: orderType === 'takeaway' ? Math.floor(100000 + Math.random() * 900000).toString() : undefined,
          };
          set((state) => ({
            orders: [newOrder, ...state.orders],
            takeawayCart: [] // Clear cart after order
          }));
        },

        updateBranchFloors: (branchId: string, floors: { floorId: string; name: string }[]) => {
          set((state) => ({
            branches: state.branches.map(b => b.id === branchId ? { ...b, floors } : b)
          }));
        },

        addMenuItem: (itemData: NewMenuItem) => {
          const currentItems = get().menuItems;
          const newItem: MenuItem = {
            id: currentItems.length > 0 ? Math.max(...currentItems.map(i => i.id)) + 1 : 1,
            ...itemData,
            image: "https://placehold.co/300x200.png",
            aiHint: itemData.name.toLowerCase().split(" ").slice(0, 2).join(" "),
          };
          set((state) => ({
            menuItems: [newItem, ...state.menuItems]
          }));
          get().showToast("Menu Item Added", `${newItem.name} has been added.`);
        },

        updateMenuItem: (itemData: MenuItem) => {
          set((state) => ({
            menuItems: state.menuItems.map(item => item.id === itemData.id ? itemData : item)
          }));
          get().showToast("Menu Item Updated", `${itemData.name} has been updated.`);
        },

        deleteMenuItem: (itemId: number) => {
          const itemName = get().menuItems.find(item => item.id === itemId)?.name || "The item";
          set((state) => ({
            menuItems: state.menuItems.filter(item => item.id !== itemId)
          }));
          get().showToast("Menu Item Deleted", `${itemName} has been removed from the menu.`, 'destructive');
        },

        toggleMenuItemAvailability: (itemId: number) => {
          set((state) => ({
            menuItems: state.menuItems.map(item =>
              item.id === itemId ? { ...item, available: !item.available } : item
            )
          }));
        },

        addCategory: (name: string) => {
          const currentCategories = get().categories;
          if (name && !currentCategories.find(c => c.name.toLowerCase() === name.toLowerCase())) {
            set({ categories: [...currentCategories, { name }] });
            get().showToast("Category Added", `"${name}" has been added.`);
          } else {
            get().showToast("Category Exists", "This category already exists.", 'destructive');
          }
        },

        addSubCategory: (categoryId: string, name: string) => {
          const currentSubCategories = get().subCategories;
          if (name && !currentSubCategories.find(c => c.name.toLowerCase() === name.toLowerCase())) {
            set({ subCategories: [...currentSubCategories, { name, categoryId }] });
            get().showToast("Sub Category Added", `"${name}" has been added.`);
          } else {
            get().showToast("Sub Category Exists", "This sub category already exists.", 'destructive');
          }
        },

        setCategories: (categories: any[]) => set({ categories }),
        setSubCategories: (subCategories: any[]) => set({ subCategories }),

        addTable: (name: string, capacity: number, type: string) => {
          const newTable: Table = {
            id: name.toUpperCase() + `-${Date.now()}`,
            name,
            capacity,
            status: 'Available',
            type,
          };
          set((state) => ({
            tables: [...state.tables, newTable]
          }));
          get().showToast("Table Added", `Table ${name} has been added.`);
        },

        updateTable: (updatedTable: Table) => {
          set((state) => ({
            tables: state.tables.map(t => (t.id === updatedTable.id ? updatedTable : t))
          }));
          get().showToast("Table Updated", `Table ${updatedTable.name} has been updated.`);
        },

        deleteTable: (tableId: string) => {
          const tableToDelete = get().tables.find(t => t.id === tableId);
          set((state) => ({
            tables: state.tables.filter(t => t.id !== tableId)
          }));
          if (tableToDelete) {
            get().showToast("Table Deleted", `Table "${tableToDelete.name}" has been removed.`, 'destructive');
          }
        },

        addTableType: (name: string) => {
          const { v7: uuidv7 } = require('uuid');
          set((state) => ({ tableTypes: [...state.tableTypes, { name, id: uuidv7() }] }));
        },

        deleteTableType: (id: string) => {
          set((state) => ({ tableTypes: state.tableTypes.filter(t => t.id !== id) }));
        },

        setTableTypes: (types: { name: string; id: string }[]) => set({ tableTypes: types }),

        updateFacilities: (newFacilities: string[]) => {
          set({ facilities: newFacilities });
        },

        updateServiceSetting: (setting: keyof ServiceSettings, value: boolean) => {
          set((state) => ({
            serviceSettings: { ...state.serviceSettings, [setting]: value }
          }));
        },

        updateOwnerInfo: (info: OwnerInfo) => {
          set({ ownerInfo: info });
        },

        addBooking: (bookingData: PendingBooking, fee: number) => {
          const currentBookings = get().bookings;
          const newBookingId = `BK-${(currentBookings.length + 1).toString().padStart(3, '0')}`;

          // Add to bookings list
          const newBooking: Booking = {
            id: newBookingId,
            ...bookingData,
            status: "Confirmed",
          };
          set((state) => ({
            bookings: [newBooking, ...state.bookings]
          }));

          // Add to orders list
          const newOrder: Order = {
            id: `ORD-B-${newBookingId}`,
            customer: bookingData.name,
            time: bookingData.time,
            date: bookingData.date,
            status: 'Preparing',
            type: 'Dine-in',
            source: 'Online',
            items: [{
              id: 999,
              name: `Booking for ${bookingData.partySize} guests`,
              quantity: 1,
              price: fee,
              category: 'Booking',
            }],
            prepTime: 'N/A',
            total: fee * 1.18,
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
          set((state) => ({
            orders: [newOrder, ...state.orders]
          }));

          // Update table status
          set((state) => ({
            tables: state.tables.map(table =>
              bookingData.tables.some(selected => selected.id === table.id)
                ? { ...table, status: 'Occupied' }
                : table
            )
          }));
        },

        updateBookingStatus: (bookingId: string, status: "Confirmed" | "Cancelled") => {
          set((state) => ({
            bookings: state.bookings.map(b => b.id === bookingId ? { ...b, status } : b)
          }));
          get().showToast("Booking Updated", `Booking ${bookingId} has been ${status}.`);
        },

        setPendingBooking: (booking: PendingBooking | null) => {
          set({ pendingBooking: booking });
        },

        resetPendingBooking: () => {
          set({ pendingBooking: null });
        },

        addReplyToFeedback: (feedbackId: string, reply: string) => {
          set((state) => ({
            feedback: state.feedback.map(f => f.id === feedbackId ? { ...f, reply, replied: true } : f)
          }));
          get().showToast("Reply Sent", "Your reply has been posted.");
        },

        handleRefundRequest: (refundId: string, status: "Approved" | "Rejected") => {
          set((state) => ({
            refunds: state.refunds.map(r => r.id === refundId ? { ...r, status } : r)
          }));
          get().showToast(`Refund ${status}`, `The refund request ${refundId} has been ${status.toLowerCase()}.`);
        },

        updateNotificationSetting: (setting: keyof NotificationSettings, value: boolean) => {
          set((state) => ({
            notificationSettings: { ...state.notificationSettings, [setting]: value }
          }));
        },

        addToTakeawayCart: (item: MenuItem, quantity: number, portion: string, price: number, addons?: CartAddon[]) => {
          const addonsKey = addons?.length 
            ? addons.map(a => `${a.name}-${a.quantity}`).sort().join(',') 
            : 'none';
          const cartItemId = `${item.id}-${portion}-${addonsKey}`;
          
          set((state) => {
            const existingItem = state.takeawayCart.find(cartItem => cartItem.cartItemId === cartItemId);
            if (existingItem) {
              return {
                takeawayCart: state.takeawayCart.map(cartItem =>
                  cartItem.cartItemId === cartItemId
                    ? { ...cartItem, quantity: cartItem.quantity + quantity }
                    : cartItem
                )
              };
            }
            const { price: basePrice, ...restOfItem } = item;
            return {
              takeawayCart: [...state.takeawayCart, { ...restOfItem, price, quantity, cartItemId, portion, addons }]
            };
          });
        },

        removeFromTakeawayCart: (cartItemId: string) => {
          set((state) => {
            const existingItem = state.takeawayCart.find(cartItem => cartItem.cartItemId === cartItemId);
            if (existingItem && existingItem.quantity > 1) {
              return {
                takeawayCart: state.takeawayCart.map(cartItem =>
                  cartItem.cartItemId === cartItemId
                    ? { ...cartItem, quantity: cartItem.quantity - 1 }
                    : cartItem
                )
              };
            }
            return {
              takeawayCart: state.takeawayCart.filter(cartItem => cartItem.cartItemId !== cartItemId)
            };
          });
        },

        incrementTakeawayCartItem: (cartItemId: string) => {
          set((state) => ({
            takeawayCart: state.takeawayCart.map(item =>
              item.cartItemId === cartItemId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          }));
        },

        decrementTakeawayCartItem: (cartItemId: string) => {
          set((state) => {
            const itemToUpdate = state.takeawayCart.find(item => item.cartItemId === cartItemId);
            if (itemToUpdate && itemToUpdate.quantity > 1) {
              return {
                takeawayCart: state.takeawayCart.map(item =>
                  item.cartItemId === cartItemId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
                )
              };
            }
            return {
              takeawayCart: state.takeawayCart.filter(item => item.cartItemId !== cartItemId)
            };
          });
        },

        clearPortionsFromCart: (itemId: number, portionName: string) => {
          set((state) => ({
            takeawayCart: state.takeawayCart.filter(item => !(item.id === itemId && item.portion === portionName))
          }));
        },

        clearTakeawayCart: () => {
          set({ takeawayCart: [] });
          get().showToast("Order Cleared", "The current takeaway order has been cleared.");
        },

        setRestaurantOnline: (isOnline: boolean) => {
          set({ isRestaurantOnline: isOnline });
        },

        setBusy: (isBusy: boolean) => {
          set({ isBusy });
        },
      }),
      {
        name: 'app-store',
      }
    )
  )
);
