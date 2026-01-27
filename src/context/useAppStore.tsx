'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Import types from AppContext
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
  // Optional server identifier for API operations
  itemId?: string;
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

// Store interface
interface AppStore {
  // State
  branches: Branch[];
  selectedBranch: string;
  orders: Order[];
  menuItems: MenuItem[];
  categories: string[];
  tables: Table[];
  tableTypes: string[];
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
  walletBalance: number;
  subscriptionPlan: SubscriptionPlan;
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

  addTable: (name: string, capacity: number, type: string) => void;
  updateTable: (table: Table) => void;
  deleteTable: (tableId: string) => void;
  setTables: (tables: Table[]) => void;

  addTableType: (name: string) => void;
  deleteTableType: (name: string) => void;

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

  addToTakeawayCart: (item: MenuItem, quantity: number, portion: string, price: number) => void;
  removeFromTakeawayCart: (cartItemId: string) => void;
  incrementTakeawayCartItem: (cartItemId: string) => void;
  decrementTakeawayCartItem: (cartItemId: string) => void;
  clearTakeawayCart: () => void;
  clearPortionsFromCart: (itemId: number, portionName: string) => void;

  setRestaurantOnline: (isOnline: boolean) => void;
  setBusy: (isBusy: boolean) => void;

  initiateWithdrawal: (amount: number) => void;
  setSubscriptionPlan: (plan: SubscriptionPlan) => void;

  // Toast function for notifications
  showToast: (title: string, description?: string, variant?: 'default' | 'destructive') => void;
}

// Create the store
export const useAppStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      branches: [
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
          restaurantId: "b1a2c3d4-e5f6-7890-1234-56789abcdef9",
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
          fssai: "78901234561234",
          ordersToday: 25,
          status: "Active",
          isOnline: false,
        },
      ],
      selectedBranch: "indiranagar",
      orders: [
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
          customerDetails: { name: "Priya Sharma", address: "Tables: T5, T6", phone: "+919876543217", email: "N/A" },
          payment: { method: "Online", status: "Paid" }
        },
        {
          id: "ORD-B-BK-004",
          customer: "Test",
          time: "6:45 PM",
          date: "2025-07-23",
          status: "Cooking",
          type: "Dine-in",
          source: "Online",
          items: [{ id: 999, name: "Booking for 8 guests", quantity: 1, price: 100, category: "Booking" }],
          prepTime: "N/A",
          total: 118,
          customerDetails: { name: "Test", address: "Tables: T8", phone: "+919876543218", email: "N/A" },
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
      ],
      menuItems: [
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
      ],
      categories: ["All", "Pizza", "Burgers", "Salads", "Curries", "Breads", "Rice", "Beverages", "Appetizers", "Desserts", "Noodles"],
      tables: [
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
      ],
      tableTypes: ["Normal", "Couple", "Family", "Private", "Outdoor"],
      bookings: [
        { id: "BK-001", name: "Aisha Kapoor", phone: "+91 98765 43210", date: "2025-07-20", time: "7:00 PM", partySize: 4, status: "Confirmed", tables: [] },
        { id: "BK-002", name: "Rohan Verma", phone: "+91 87654 32109", date: "2025-07-21", time: "7:30 PM", partySize: 2, status: "Confirmed", tables: [] },
        { id: "BK-003", name: "Sneha Reddy", phone: "+91 76543 21098", date: "2025-07-21", time: "8:00 PM", partySize: 5, status: "Pending", tables: [] },
        { id: "BK-004", name: "Vikram Singh", phone: "+91 65432 10987", date: "2025-07-22", time: "8:15 PM", partySize: 3, status: "Completed", tables: [] },
        { id: "BK-005", name: "Nidhi Gupta", phone: "+91 54321 09876", date: "2025-07-22", time: "9:00 PM", partySize: 2, status: "Cancelled", tables: [] },
      ],
      pendingBooking: null,
      feedback: [
        { id: "FB-001", customer: { name: "John Doe", avatar: "https://placehold.co/100x100", fallback: "JD", orderCount: 12, }, orderType: "Delivery", rating: 5, comment: "The food was amazing! The Butter Chicken was perfectly cooked and the naan was fresh and fluffy. Will definitely order again!", date: "May 15, 2023", items: ["Butter Chicken", "Garlic Naan"], photos: [{ url: "https://placehold.co/80x80.png", hint: "butter chicken" }, { url: "https://placehold.co/80x80.png", hint: "garlic naan" }], replied: false, reply: "" },
        { id: "FB-002", customer: { name: "Sarah Smith", avatar: "https://placehold.co/101x101", fallback: "SS", orderCount: 5 }, orderType: "Delivery", rating: 4, comment: "Great food but delivery was a bit late. The Paneer Tikka was excellent though!", date: "May 14, 2023", items: ["Paneer Tikka", "Veg Biryani"], photos: [], replied: true, reply: "Thank you for your feedback, Sarah! We apologize for the late delivery and will work on improving our service." },
        { id: "FB-003", customer: { name: "Mike Johnson", avatar: "https://placehold.co/102x102", fallback: "MJ", orderCount: 8 }, orderType: "Dine-in", rating: 2, comment: "The order was very late and the food was cold. Disappointed with the experience this time.", date: "May 13, 2023", items: [], photos: [], replied: false, reply: "" },
      ],
      refunds: [
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
      ],
      notificationSettings: {
        newOrders: true,
        payouts: true,
        promotions: false,
        orderUpdates: true,
        customerReviews: true,
        systemUpdates: true,
      },
      facilities: ['ac', 'washroom', 'parking', 'familyFriendly', 'wheelchair-seating', 'kerbside-pickup'],
      serviceSettings: {
        delivery: true,
        takeaway: true,
        dineIn: true,
        booking: true,
      },
      ownerInfo: {
        name: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        phone: "+91 98765 43210",
        whatsapp: "+91 98765 43210",
      },
      isRestaurantOnline: true,
      isBusy: false,
      walletBalance: 2458,
      subscriptionPlan: 'Pro',
      takeawayCart: [],

      // Toast function placeholder - will be set by components that use toast
      showToast: (title: string, description?: string, variant?: 'default' | 'destructive') => {
        console.log('Toast:', title, description, variant);
      },

      // Actions
      setBranches: (newBranches: Branch[]) => {
        const currentSelected = get().selectedBranch;
        const exists = newBranches.some(b => b.id === currentSelected);
        set({
          branches: newBranches,
          selectedBranch: exists ? currentSelected : (newBranches[0]?.id ?? currentSelected),
        });
      },
      setSelectedBranch: (branchId: string) => {
        set({ selectedBranch: branchId });
      },

      setTables: (newTables: Table[]) => {
        set({ tables: newTables });
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

      addOrder: (cart: TakeawayCartItem[], customerName: string, customerPhone: string) => {
        const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        const newOrder: Order = {
          id: `ORD-${(get().orders.length + 1).toString().padStart(3, '0')}`,
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
        set((state) => ({
          orders: [newOrder, ...state.orders]
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
        if (name && !currentCategories.find(c => c.toLowerCase() === name.toLowerCase())) {
          const newCategories = [...currentCategories];
          const allIndex = newCategories.indexOf("All");
          if (allIndex !== -1) {
            newCategories.splice(allIndex, 0, name);
          } else {
            newCategories.push(name);
          }
          set({ categories: newCategories });
          get().showToast("Category Added", `"${name}" has been added.`);
        } else {
          get().showToast("Category Exists", "This category already exists.", 'destructive');
        }
      },

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
        const currentTypes = get().tableTypes;
        if (name && !currentTypes.find(t => t.toLowerCase() === name.toLowerCase())) {
          set((state) => ({
            tableTypes: [...state.tableTypes, name]
          }));
          get().showToast("Table Type Added", `"${name}" has been added.`);
        } else {
          get().showToast("Type Exists", "This table type already exists.", 'destructive');
        }
      },

      deleteTableType: (name: string) => {
        set((state) => ({
          tableTypes: state.tableTypes.filter(t => t !== name)
        }));
        get().showToast("Table Type Removed", `"${name}" has been removed.`, 'destructive');
      },

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

      addToTakeawayCart: (item: MenuItem, quantity: number, portion: string, price: number) => {
        const cartItemId = `${item.id}-${portion}`;
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
            takeawayCart: [...state.takeawayCart, { ...restOfItem, price, quantity, cartItemId, portion }]
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

      initiateWithdrawal: (amount: number) => {
        set((state) => ({
          walletBalance: state.walletBalance - amount
        }));
      },

      setSubscriptionPlan: (plan: SubscriptionPlan) => {
        set({ subscriptionPlan: plan });
      },
    }),
    {
      name: 'app-store',
    }
  )
);