export type UserRole = 'admin' | 'manager' | 'waiter' | 'chef' | 'cashier' | 'customer';

export interface User {
  userId: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  avatar?: string;
}

export interface Table {
  tableId: number;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
}

export interface MenuCategory {
  categoryId: number;
  name: string;
  description: string;
  icon: string;
}

export interface MenuItem {
  itemId: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  availability: boolean;
  image?: string;
  prepTime?: number;
  isPopular?: boolean;
  isSpicy?: boolean;
}

export interface OrderItem {
  orderItemId: number;
  itemId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  notes?: string;
}

export interface Order {
  orderId: number;
  tableId?: number;
  tableNumber?: number;
  customerId?: number;
  customerName: string;
  waiterId?: number;
  waiterName?: string;
  type: 'dine-in' | 'takeaway' | 'delivery';
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled';
  orderDate: string;
  items: OrderItem[];
  totalAmount: number;
  notes?: string;
}

export interface Payment {
  paymentId: number;
  orderId: number;
  amount: number;
  method: 'cash' | 'card' | 'mobile';
  status: 'pending' | 'completed' | 'refunded';
  paymentDate: string;
  transactionId?: string;
}

export interface Reservation {
  reservationId: number;
  customerName: string;
  phone: string;
  dateTime: string;
  guests: number;
  tableId?: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export interface Ingredient {
  ingredientId: number;
  name: string;
  quantity: number;
  unit: string;
  threshold: number;
}

export interface Report {
  reportId: number;
  type: string;
  generatedOn: string;
  data: string;
}
