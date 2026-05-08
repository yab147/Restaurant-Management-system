// Enums
export enum Role {
  Admin = "Admin",
  Manager = "Manager",
  Waiter = "Waiter",
  Chef = "Chef",
  Cashier = "Cashier",
  Customer = "Customer"
}

export enum OrderStatus {
  Pending = "Pending",
  Preparing = "Preparing",
  Ready = "Ready",
  Served = "Served",
  Paid = "Paid",
  Cancelled = "Cancelled"
}

export enum TableStatus {
  Available = "Available",
  Reserved = "Reserved",
  Occupied = "Occupied"
}

export enum ReservationStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Cancelled = "Cancelled",
  Completed = "Completed"
}

export enum PaymentMethod {
  Cash = "Cash",
  Card = "Card",
  Mobile = "Mobile"
}

export enum PaymentStatus {
  Pending = "Pending",
  Successful = "Successful",
  Failed = "Failed"
}

// User Models
export interface User {
  userId: number;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: Role;
}

// Menu Models
export interface MenuCategory {
  categoryId: number;
  name: string;
  description: string;
}

export interface MenuItem {
  itemId: number;
  categoryId: number; // reference to MenuCategory
  name: string;
  description: string;
  price: number;
  availability: boolean;
}

// Table & Reservation Models
export interface Table {
  tableId: number;
  number: string;
  capacity: number;
  status: TableStatus;
}

export interface Reservation {
  reservationId: number;
  tableId: number;
  customerName: string;
  phone: string;
  dateTime: Date | string;
  guests: number;
  status: ReservationStatus;
}

// Order & Payment Models
export interface OrderItem {
  orderItemId: number;
  itemId: number; // reference to MenuItem
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export interface Order {
  orderId: number;
  tableId?: number; // optional, can be takeaway or attached to reservation
  reservationId?: number;
  type: "Dine-in" | "Takeaway" | "Delivery";
  status: OrderStatus;
  orderDate: Date | string;
  totalAmount: number;
  items: OrderItem[];
}

export interface Payment {
  paymentId: number;
  orderId: number; // one-to-one with Order
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paymentDate: Date | string;
  transactionId: string;
}

// Inventory Models
export interface Ingredient {
  ingredientId: number;
  name: string;
  quantity: number;
  unit: string;
  threshold: number;
}

export interface Inventory {
  inventoryId: number;
  lastUpdated: Date | string;
  ingredients: Ingredient[];
}

// Report Model
export interface Report {
  reportId: number;
  type: string;
  generatedOn: Date | string;
  data: string; // Could be JSON string or other format
}
