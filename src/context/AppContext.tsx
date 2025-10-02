
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

const initialTables: Table[] = [
  { id: "T1", name: "T1", capacity: 4, status: "Available", type: "Normal" },
  { id: "T2", name: "T2", capacity: 4, status: "Occupied", type: "Normal" },
  { id: "T3", name: "T3", capacity: 2, status: "Available", type: "Couple" },
  { id: "T4", name: "T4", capacity: 2, status: "Available", type: "Couple" },
  { id: "T5", name: "T5", capacity: 6, status: "Available", type: "Family" },
  { id: "T6", name: "T6", capacity: 6, status: "Occupied", type: "Family" },
  { id: "T7", name: "T7", capacity: 4, status: "Available", type: "Normal" },
  { id: "T8", name: "T8", capacity: 8, status: "Available", type: "Private" },
  { id: "P1", name: "P1", capacity: 4, status: "Available", type: "Outdoor" },
  { id: "P2", name: "P2", capacity: 4, status: "Available", type: "Outdoor" },
];

const initialTableTypes = ["Normal", "Couple", "Family", "Private", "Outdoor"];


const initialBranches: Branch[] = [
  {
    id: "indiranagar",
    name: "Spice Garden - Rajkot",
    address: "123 100ft Road",
    city: "Bangalore",
    pincode: "560038",
    manager: "Rahul Sharma",
    managerPhone: "+91 98765 43210",
    hours: "10:00 AM - 10:00 PM",
    gst: "29ABCDE1234F1Z5",
    fssai: "12345678901234",
    ordersToday: 42,
    status: "Active",
    isOnline: true,
  },
  {
    id: "koramangala",
    name: "Spice Garden - Koramangala",
    address: "456 80ft Road",
    city: "Bangalore",
    pincode: "560034",
    manager: "Priya Patel",
    managerPhone: "+91 87654 32109",
    hours: "10:00 AM - 11:00 PM",
    gst: "29FGHIJ5678K1Z4",
    fssai: "56789012341234",
    ordersToday: 38,
    status: "Active",
    isOnline: true,
  },
  {
    id: "whitefield",
    name: "Spice Garden - Whitefield",
    address: "789 Main Road",
    city: "Bangalore",
    pincode: "560066",
    manager: "Amit Kumar",
    managerPhone: "+91 76543 21098",
    hours: "11:00 AM - 10:00 PM",
    gst: "29LMNOP1234Q1Z3",
    fssai: "90123456781234",
    ordersToday: 0,
    status: "Inactive",
    isOnline: false,
  },
];


const initialOrders: Order[] = [
    { 
        id: "ORD-001", 
        customer: "Alice Johnson", 
        time: "6:07 PM",
        date: "2025-07-13",
        status: "Delivered", 
        type: "Delivery", 
        items: [
            { id: 16, name: "Spicy Ramen", quantity: 1, price: 14.99, category: "Noodles" },
            { id: 17, name: "Gyoza", quantity: 1, price: 6.99, category: "Appetizers" },
        ], 
        prepTime: "15 min", 
        total: 21.98,
        customerDetails: { name: "Alice Johnson", address: "123 Blossom Lane, Garden City", phone: "+919876543210", email: "alice.j@example.com" },
        payment: { method: "Credit Card", status: "Paid" },
        offer: { code: "SUMMER20", type: "Percentage" },
        deliveryPartner: { name: "Rohan Sharma", avatar: "https://placehold.co/100x100.png", avatarFallback: "RS", rating: 4.8 },
        pickupOtp: "123456"
    },
    { 
        id: "ORD-002", 
        customer: "Bob Williams", 
        time: "2:30 PM",
        date: "2024-07-21",
        status: "Delivered", 
        type: "Takeaway", 
        items: [
            { id: 8, name: "Paneer Tikka Masala", quantity: 1, price: 25, category: "Curries" },
        ], 
        prepTime: "20 min", 
        total: 25.00,
        customerDetails: { name: "Bob Williams", address: "Takeaway Counter", phone: "+919876543211", email: "priya.patel@example.com" },
        payment: { method: "UPI", status: "Paid" },
        offer: { code: "NEWUSER10", type: "Discount" },
        pickupOtp: "334455"
    },
    { 
        id: "ORD-003", 
        customer: "Charlie Brown", 
        time: "8:00 PM",
        date: "2024-07-21",
        status: "Delivered", 
        type: "Dine-in", 
        items: [
            { id: 10, name: "Chicken Biryani", quantity: 1, price: 14, category: "Rice" },
        ], 
        prepTime: "25 min", 
        total: 14.00,
        customerDetails: { name: "Charlie Brown", address: "Dine-in Table 5", phone: "+919876543212", email: "amit.kumar@example.com" },
        payment: { method: "Cash on Delivery", status: "Pending" }
    },
    { 
        id: "ORD-005", 
        customer: "Eve Davis", 
        time: "1:45 PM",
        date: "2024-07-20",
        status: "Incoming", 
        type: "Delivery", 
        items: [
            { id: 1, name: "Margherita Pizza", quantity: 1, price: 17, category: "Pizza" },
        ], 
        prepTime: "10 min", 
        total: 17.00,
        customerDetails: { name: "Eve Davis", address: "456 Tech Park, Electronic City", phone: "+919876543213", email: "sunita.rai@example.com" },
        payment: { method: "Debit Card", status: "Paid" },
        deliveryPartner: { name: "Sunil Verma", avatar: "https://placehold.co/101x101.png", avatarFallback: "SV", rating: 4.7 },
        pickupOtp: "654321"
    },
    { 
        id: "ORD-006", 
        customer: "Frank Miller", 
        time: "1:30 PM", 
        date: "2024-07-20",
        status: "Preparing", 
        type: "Delivery", 
        items: [
            { id: 4, name: "Beef Burger", quantity: 1, price: 7, category: "Burgers" },
        ], 
        prepTime: "22 min", 
        total: 7.00,
        customerDetails: { name: "Frank Miller", address: "789 Silk Board, HSR Layout", phone: "+919876543214", email: "vikram.singh@example.com" },
        payment: { method: "UPI", status: "Paid" },
        deliveryPartner: { name: "Anjali Mehta", avatar: "https://placehold.co/102x102.png", avatarFallback: "AM", rating: 4.9 },
        pickupOtp: "987123"
    },
     { 
        id: "ORD-B-BK-001",
        customer: "Online Booking",
        time: "7:00 PM",
        date: "2025-07-21",
        status: "Preparing",
        type: "Dine-in",
        source: "Online",
        items: [{ id: 999, name: "Booking for 4 guests", quantity: 1, price: 100, category: "Booking" }],
        prepTime: "N/A",
        total: 118,
        customerDetails: { name: "Aisha Kapoor", address: "Tables: T1, T2", phone: "+919876543215", email: "N/A" },
        payment: { method: "Online", status: "Paid" }
    },
    { 
        id: "ORD-B-BK-002",
        customer: "Offline Booking",
        time: "8:30 PM",
        date: "2025-07-21",
        status: "Ready",
        type: "Dine-in",
        source: "Online",
        items: [{ id: 999, name: "Booking for 2 guests", quantity: 1, price: 100, category: "Booking" }],
        prepTime: "N/A",
        total: 118,
        customerDetails: { name: "Rohan Verma", address: "Tables: P1", phone: "+919876543216", email: "N/A" },
        payment: { method: "Online", status: "Paid" }
    },
    { 
        id: "ORD-B-BK-003",
        customer: "Online Booking",
        time: "9:00 PM",
        date: "2025-07-22",
        status: "Incoming",
        type: "Dine-in",
        source: "Online",
        items: [{ id: 999, name: "Booking for 6 guests", quantity: 1, price: 100, category: "Booking" }],
        prepTime: "N/A",
        total: 118,
        customerDetails: { name: "Priya Sharma", address: "Tables: T5", phone: "+919876543217", email: "N/A" },
        payment: { method: "Online", status: "Paid" }
    },
    { 
        id: "ORD-B-BK-004",
        customer: "Offline Booking",
        time: "6:30 PM",
        date: "2025-07-23",
        status: "Preparing",
        type: "Dine-in",
        source: "Online",
        items: [{ id: 999, name: "Booking for 8 guests", quantity: 1, price: 100, category: "Booking" }],
        prepTime: "N/A",
        total: 118,
        customerDetails: { name: "Amit Patel", address: "Tables: T8", phone: "+919876543218", email: "N/A" },
        payment: { method: "Online", status: "Paid" }
    },
    { 
        id: "ORD-B-BK-005",
        customer: "Walk-in Booking",
        time: "7:15 PM",
        date: "2025-07-24",
        status: "Ready",
        type: "Dine-in",
        source: "Online",
        items: [{ id: 999, name: "Booking for 2 guests", quantity: 1, price: 100, category: "Booking" }],
        prepTime: "N/A",
        total: 118,
        customerDetails: { name: "Sunita Rai", address: "Tables: T3", phone: "+919876543219", email: "N/A" },
        payment: { method: "Cash", status: "Paid" }
    },
    {
        id: "ORD-B-BK-006",
        customer: "Test",
        time: "7:15 PM",
        date: "2025-07-24",
        status: "Preparing",
        type: "Dine-in",
        source: "Online",
        items: [{ id: 999, name: "Booking for 2 guests", quantity: 1, price: 100, category: "Booking" }],
        prepTime: "N/A",
        total: 118,
        customerDetails: { name: "Test", address: "Tables: T3", phone: "+919876543219", email: "N/A" },
        payment: { method: "Cash", status: "Paid" }
    }
];

const initialMenuItems: MenuItem[] = [
  { id: 1, name: "Margherita Pizza", description: "Classic pizza with tomato sauce, mozzarella, and basil", price: 899, category: "Pizza", image: "https://placehold.co/300x200.png", aiHint: "margherita pizza", available: true, dietaryType: 'Veg', portionOptions: [{ name: 'Regular', price: 899 }, { name: 'Medium', price: 1099 }, { name: 'Large', price: 1299 }, { name: 'XL', price: 1499 }] },
  { id: 2, name: "Pepperoni Pizza", description: "Pizza topped with pepperoni slices and cheese", price: 1199, category: "Pizza", image: "https://placehold.co/300x200.png", aiHint: "pepperoni pizza", available: true, dietaryType: 'Non-Veg', portionOptions: [{ name: 'Regular', price: 1199 }, { name: 'Medium', price: 1399 }, { name: 'Large', price: 1599 }, { name: 'XL', price: 1799 }] },
  { id: 3, name: "Chicken Burger", description: "Grilled chicken breast with lettuce, tomato, and mayo", price: 450, category: "Burgers", image: "https://placehold.co/300x200.png", aiHint: "chicken burger", available: true, dietaryType: 'Non-Veg' },
  { id: 4, name: "Beef Burger", description: "Juicy beef patty with cheese, lettuce, and special sauce", price: 999, category: "Burgers", image: "https://placehold.co/300x200.png", aiHint: "beef burger", available: true, dietaryType: 'Non-Veg' },
  { id: 5, name: "Caesar Salad", description: "Fresh romaine lettuce with Caesar dressing and croutons", price: 500, category: "Salads", image: "https://placehold.co/300x200.png", aiHint: "caesar salad", available: true, dietaryType: 'Veg' },
  { id: 6, name: "Greek Salad", description: "Mixed greens with feta cheese, olives, and Greek dressing", price: 699, category: "Salads", image: "https://placehold.co/300x200.png", aiHint: "greek salad", available: false, dietaryType: 'Veg' },
  { id: 7, name: "Butter Chicken", description: "Creamy and rich tomato-based chicken curry.", price: 499, category: "Curries", image: "https://placehold.co/300x200.png", aiHint: "butter chicken", available: true, dietaryType: 'Non-Veg', portionOptions: [{ name: 'Full', price: 499 }, { name: 'Half', price: 299 }] },
  { id: 8, name: "Paneer Tikka Masala", description: "Marinated paneer in a spicy gravy.", price: 450, category: "Curries", image: "https://placehold.co/300x200.png", aiHint: "paneer tikka masala", available: true, dietaryType: 'Veg', portionOptions: [{ name: 'Full', price: 450 }, { name: 'Half', price: 270 }] },
  { id: 9, name: "Garlic Naan", description: "Soft flatbread with garlic.", price: 75, category: "Breads", image: "https://placehold.co/300x200.png", aiHint: "garlic naan", available: true, dietaryType: 'Veg' },
  { id: 10, name: "Chicken Biryani", description: "Aromatic rice dish with chicken.", price: 550, category: "Rice", image: "https://placehold.co/300x200.png", aiHint: "chicken biryani", available: true, dietaryType: 'Non-Veg', portionOptions: [{ name: 'Full', price: 550 }, { name: 'Half', price: 385 }] },
  { id: 11, name: "Jeera Rice", description: "Rice tempered with cumin seeds.", price: 200, category: "Rice", image: "https://placehold.co/300x200.png", aiHint: "jeera rice", available: true, dietaryType: 'Veg' },
  { id: 12, name: "Lassi", description: "Yogurt based drink.", price: 150, category: "Beverages", image: "https://placehold.co/300x200.png", aiHint: "lassi drink", available: true, dietaryType: 'Veg' },
  { id: 13, name: "Mutton Kebab", description: "Spicy minced mutton skewers.", price: 450, category: "Appetizers", image: "https://placehold.co/300x200.png", aiHint: "mutton kebab", available: true, dietaryType: 'Non-Veg' },
  { id: 14, name: "Fries", description: "Classic french fries.", price: 150, category: "Appetizers", image: "https://placehold.co/300x200.png", aiHint: "french fries", available: true, dietaryType: 'Veg' },
  { id: 15, name: "Coke", description: "Chilled Coca-Cola.", price: 80, category: "Beverages", image: "https://placehold.co/300x200.png", aiHint: "coke can", available: true, dietaryType: 'Veg' },
  { id: 16, name: "Spicy Ramen", description: "Noodles in a spicy broth.", price: 14.99, category: "Noodles", image: "https://placehold.co/300x200.png", aiHint: "spicy ramen", available: true, dietaryType: 'Non-Veg' },
  { id: 17, name: "Gyoza", description: "Pan-fried dumplings.", price: 6.99, category: "Appetizers", image: "https://placehold.co/300x200.png", aiHint: "gyoza dumplings", available: true, dietaryType: 'Non-Veg' },
];

const initialCategories = ["All", "Pizza", "Burgers", "Salads", "Curries", "Breads", "Rice", "Beverages", "Appetizers", "Desserts", "Noodles"];

const initialBookings: Booking[] = [
  { id: "BK-001", name: "Aisha Kapoor", phone: "+91 98765 43210", date: "2025-07-20", time: "7:00 PM", partySize: 4, status: "Confirmed", tables: [] },
  { id: "BK-002", name: "Rohan Verma", phone: "+91 87654 32109", date: "2025-07-21", time: "7:30 PM", partySize: 2, status: "Confirmed", tables: [] },
  { id: "BK-003", name: "Sneha Reddy", phone: "+91 76543 21098", date: "2025-07-21", time: "8:00 PM", partySize: 5, status: "Pending", tables: [] },
  { id: "BK-004", name: "Vikram Singh", phone: "+91 65432 10987", date: "2025-07-22", time: "8:15 PM", partySize: 3, status: "Completed", tables: [] },
  { id: "BK-005", name: "Nidhi Gupta", phone: "+91 54321 09876", date: "2025-07-22", time: "9:00 PM", partySize: 2, status: "Cancelled", tables: [] },
];

const initialFeedback: Feedback[] = [
  { id: "FB-001", customer: { name: "John Doe", avatar: "https://placehold.co/100x100", fallback: "JD", orderCount: 12, }, orderType: "Delivery", rating: 5, comment: "The food was amazing! The Butter Chicken was perfectly cooked and the naan was fresh and fluffy. Will definitely order again!", date: "May 15, 2023", items: ["Butter Chicken", "Garlic Naan"], photos: [ { url: "https://placehold.co/80x80.png", hint: "butter chicken" }, { url: "https://placehold.co/80x80.png", hint: "garlic naan" } ], replied: false, reply: "" },
  { id: "FB-002", customer: { name: "Sarah Smith", avatar: "https://placehold.co/101x101", fallback: "SS", orderCount: 5 }, orderType: "Delivery", rating: 4, comment: "Great food but delivery was a bit late. The Paneer Tikka was excellent though!", date: "May 14, 2023", items: ["Paneer Tikka", "Veg Biryani"], photos: [], replied: true, reply: "Thank you for your feedback, Sarah! We apologize for the late delivery and will work on improving our service." },
  { id: "FB-003", customer: { name: "Mike Johnson", avatar: "https://placehold.co/102x102", fallback: "MJ", orderCount: 8 }, orderType: "Dine-in", rating: 2, comment: "The order was very late and the food was cold. Disappointed with the experience this time.", date: "May 13, 2023", items: [], photos: [], replied: false, reply: "" },
];

const initialRefunds: RefundRequest[] = [
    {
        id: 'REF-001',
        orderId: 'ORD-003',
        customerName: 'Charlie Brown',
        customerAvatar: 'https://i.pravatar.cc/150?u=charlie',
        customerFallback: 'CB',
        amount: 14.00,
        reason: 'The order was very late and the food was cold. Disappointed with the experience.',
        status: 'Pending',
        date: '2024-07-22',
        items: [{ name: 'Chicken Biryani', image: 'https://placehold.co/300x200.png', aiHint: 'chicken biryani', price: 14.00 }],
        photos: [{ url: 'https://placehold.co/400x300.png', hint: 'cold food' }],
        orderType: 'Delivery',
        orderTime: '8:00 PM',
        costSplit: { restaurant: 7.00, crevings: 7.00 },
    },
    {
        id: 'REF-002',
        orderId: 'ORD-001',
        customerName: 'Alice Johnson',
        customerAvatar: 'https://i.pravatar.cc/150?u=alice',
        customerFallback: 'AJ',
        amount: 6.99,
        reason: 'Received wrong item. I ordered Gyoza but got something else.',
        status: 'Pending',
        date: '2024-07-21',
        items: [{ name: 'Gyoza', image: 'https://placehold.co/300x200.png', aiHint: 'gyoza dumplings', price: 6.99 }],
        orderType: 'Delivery',
        orderTime: '6:07 PM',
        costSplit: { restaurant: 3.50, crevings: 3.49 },
    },
];


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
