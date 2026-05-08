import { User, Table, MenuCategory, MenuItem, Order, Payment, Reservation, Ingredient } from '../types';

export const users: User[] = [
  { userId: 1, name: 'Abebe Girma', email: 'admin@holy.et', password: 'admin123', phone: '+251912345678', role: 'admin' },
  { userId: 2, name: 'Tigist Haile', email: 'manager@holy.et', password: 'manager123', phone: '+251923456789', role: 'manager' },
  { userId: 3, name: 'Dawit Bekele', email: 'waiter@holy.et', password: 'waiter123', phone: '+251934567890', role: 'waiter' },
  { userId: 4, name: 'Marta Alemu', email: 'chef@holy.et', password: 'chef123', phone: '+251945678901', role: 'chef' },
  { userId: 5, name: 'Solomon Tesfaye', email: 'cashier@holy.et', password: 'cashier123', phone: '+251956789012', role: 'cashier' },
  { userId: 6, name: 'Guest User', email: 'guest@holy.et', password: 'guest123', phone: '+251967890123', role: 'customer' },
];

export const tables: Table[] = [
  { tableId: 1, number: 1, capacity: 2, status: 'available' },
  { tableId: 2, number: 2, capacity: 4, status: 'occupied' },
  { tableId: 3, number: 3, capacity: 4, status: 'reserved' },
  { tableId: 4, number: 4, capacity: 6, status: 'available' },
  { tableId: 5, number: 5, capacity: 6, status: 'occupied' },
  { tableId: 6, number: 6, capacity: 8, status: 'available' },
  { tableId: 7, number: 7, capacity: 2, status: 'cleaning' },
  { tableId: 8, number: 8, capacity: 4, status: 'available' },
  { tableId: 9, number: 9, capacity: 6, status: 'reserved' },
  { tableId: 10, number: 10, capacity: 10, status: 'available' },
];

export const menuCategories: MenuCategory[] = [
  { categoryId: 1, name: 'Traditional Ethiopian', description: 'Authentic Ethiopian dishes served on injera', icon: '🍛' },
  { categoryId: 2, name: 'Firfir & Breakfast', description: 'Morning specials and firfir dishes', icon: '🌅' },
  { categoryId: 3, name: 'Grills & Tibs', description: 'Flame-grilled meats and tibs', icon: '🥩' },
  { categoryId: 4, name: 'Vegetarian & Fasting', description: 'Plant-based Ethiopian fasting dishes', icon: '🥗' },
  { categoryId: 5, name: 'Soups & Stews', description: 'Hearty soups and rich stews', icon: '🍲' },
  { categoryId: 6, name: 'Beverages', description: 'Ethiopian coffee, tea, juices and more', icon: '☕' },
  { categoryId: 7, name: 'Desserts', description: 'Sweet endings to your meal', icon: '🍮' },
];

export const menuItems: MenuItem[] = [
  // Traditional Ethiopian
  { itemId: 1, categoryId: 1, name: 'Doro Wat', description: 'Rich spiced chicken stew with boiled eggs in berbere sauce, served on injera', price: 280, availability: true, prepTime: 25, isPopular: true, isSpicy: true },
  { itemId: 2, categoryId: 1, name: 'Kitfo', description: 'Ethiopian steak tartare minced with mitmita and kibbeh (spiced butter)', price: 320, availability: true, prepTime: 15, isPopular: true, isSpicy: true },
  { itemId: 3, categoryId: 1, name: 'Beyaynetu (Combo)', description: 'Mixed vegetarian platter with various wots served on large injera', price: 260, availability: true, prepTime: 20, isPopular: true },
  { itemId: 4, categoryId: 1, name: 'Key Wat', description: 'Spiced beef stew in rich berbere sauce served on injera', price: 270, availability: true, prepTime: 20, isSpicy: true },
  { itemId: 5, categoryId: 1, name: 'Misir Wat', description: 'Red lentil stew cooked with berbere and onions', price: 180, availability: true, prepTime: 15, isSpicy: true },
  { itemId: 6, categoryId: 1, name: 'Tikel Gomen', description: 'Spiced cabbage and carrots with turmeric and ginger', price: 160, availability: true, prepTime: 15 },

  // Firfir & Breakfast
  { itemId: 7, categoryId: 2, name: 'Injera Firfir', description: 'Torn injera mixed with berbere sauce and kibbeh', price: 140, availability: true, prepTime: 10, isPopular: true },
  { itemId: 8, categoryId: 2, name: 'Kinche', description: 'Ethiopian cracked wheat porridge with kibbeh', price: 120, availability: true, prepTime: 15 },
  { itemId: 9, categoryId: 2, name: 'Ful (Fava Beans)', description: 'Mashed fava beans with spices, served with fresh bread', price: 110, availability: true, prepTime: 10 },
  { itemId: 10, categoryId: 2, name: 'Egg Firfir', description: 'Scrambled eggs mixed with injera and spiced butter', price: 150, availability: true, prepTime: 12 },

  // Grills & Tibs
  { itemId: 11, categoryId: 3, name: 'Special Tibs', description: 'Sautéed beef cubes with onions, tomatoes, jalapeño and rosemary', price: 350, availability: true, prepTime: 20, isPopular: true, isSpicy: true },
  { itemId: 12, categoryId: 3, name: 'Lamb Tibs', description: 'Tender lamb pieces pan-fried with Ethiopian spices', price: 380, availability: true, prepTime: 22 },
  { itemId: 13, categoryId: 3, name: 'Mixed Grill Platter', description: 'Assorted grilled meats including beef, lamb and chicken', price: 480, availability: true, prepTime: 30, isPopular: true },
  { itemId: 14, categoryId: 3, name: 'Gored Gored', description: 'Cubed raw beef marinated in spiced butter and mitmita', price: 340, availability: true, prepTime: 10, isSpicy: true },

  // Vegetarian & Fasting
  { itemId: 15, categoryId: 4, name: 'Shiro Wat', description: 'Creamy chickpea flour stew with Ethiopian spices', price: 150, availability: true, prepTime: 12, isPopular: true },
  { itemId: 16, categoryId: 4, name: 'Gomen Wat', description: 'Collard greens cooked with garlic, ginger and spices', price: 140, availability: true, prepTime: 15 },
  { itemId: 17, categoryId: 4, name: 'Yemisir Alicha', description: 'Mild yellow lentil stew with turmeric and onions', price: 160, availability: true, prepTime: 15 },
  { itemId: 18, categoryId: 4, name: 'Fasting Combo', description: 'Complete fasting platter with five different wots on injera', price: 240, availability: true, prepTime: 20 },

  // Soups & Stews
  { itemId: 19, categoryId: 5, name: 'Asa Wat (Fish Stew)', description: 'Fresh Nile tilapia in spiced berbere and tomato broth', price: 290, availability: true, prepTime: 25 },
  { itemId: 20, categoryId: 5, name: 'Bone Soup', description: 'Slow-cooked bone broth with Ethiopian herbs and spices', price: 200, availability: true, prepTime: 20 },
  { itemId: 21, categoryId: 5, name: 'Vegetable Soup', description: 'Seasonal vegetables in a light spiced broth', price: 140, availability: true, prepTime: 15 },

  // Beverages
  { itemId: 22, categoryId: 6, name: 'Ethiopian Coffee (Buna)', description: 'Traditional Ethiopian coffee ceremony style, served with popcorn', price: 80, availability: true, prepTime: 10, isPopular: true },
  { itemId: 23, categoryId: 6, name: 'Spris (Mixed Juice)', description: 'Layered avocado, mango and papaya juice', price: 90, availability: true, prepTime: 5, isPopular: true },
  { itemId: 24, categoryId: 6, name: 'Tej (Honey Wine)', description: 'Traditional Ethiopian fermented honey wine', price: 120, availability: true, prepTime: 3 },
  { itemId: 25, categoryId: 6, name: 'Fresh Mango Juice', description: 'Freshly squeezed mango juice', price: 70, availability: true, prepTime: 5 },
  { itemId: 26, categoryId: 6, name: 'Ambo Water (Mineral)', description: 'Ethiopian sparkling mineral water', price: 40, availability: true, prepTime: 1 },
  { itemId: 27, categoryId: 6, name: 'Soft Drinks', description: 'Coca-Cola, Pepsi, Fanta, Sprite', price: 50, availability: true, prepTime: 1 },

  // Desserts
  { itemId: 28, categoryId: 7, name: 'Baklava', description: 'Layered pastry with honey and mixed nuts', price: 110, availability: true, prepTime: 5 },
  { itemId: 29, categoryId: 7, name: 'Mango Pudding', description: 'Creamy mango pudding with a hint of cardamom', price: 100, availability: true, prepTime: 5 },
  { itemId: 30, categoryId: 7, name: 'Fruit Salad', description: 'Fresh seasonal fruits with honey drizzle', price: 90, availability: true, prepTime: 8 },
];

export const orders: Order[] = [
  {
    orderId: 1, tableId: 2, tableNumber: 2, customerName: 'Mulugeta Kebede', waiterId: 3, waiterName: 'Dawit Bekele',
    type: 'dine-in', status: 'preparing', orderDate: '2025-06-10T09:30:00',
    items: [
      { orderItemId: 1, itemId: 1, itemName: 'Doro Wat', quantity: 2, unitPrice: 280, subTotal: 560 },
      { orderItemId: 2, itemId: 22, itemName: 'Ethiopian Coffee', quantity: 2, unitPrice: 80, subTotal: 160 },
    ],
    totalAmount: 720, notes: 'Extra injera please'
  },
  {
    orderId: 2, tableId: 5, tableNumber: 5, customerName: 'Hanna Tadesse', waiterId: 3, waiterName: 'Dawit Bekele',
    type: 'dine-in', status: 'ready', orderDate: '2025-06-10T09:45:00',
    items: [
      { orderItemId: 3, itemId: 11, itemName: 'Special Tibs', quantity: 1, unitPrice: 350, subTotal: 350 },
      { orderItemId: 4, itemId: 23, itemName: 'Spris (Mixed Juice)', quantity: 2, unitPrice: 90, subTotal: 180 },
    ],
    totalAmount: 530
  },
  {
    orderId: 3, tableId: 3, tableNumber: 3, customerName: 'Yonas Tesfaye', waiterId: 3, waiterName: 'Dawit Bekele',
    type: 'dine-in', status: 'served', orderDate: '2025-06-10T08:15:00',
    items: [
      { orderItemId: 5, itemId: 3, itemName: 'Beyaynetu (Combo)', quantity: 2, unitPrice: 260, subTotal: 520 },
      { orderItemId: 6, itemId: 25, itemName: 'Fresh Mango Juice', quantity: 2, unitPrice: 70, subTotal: 140 },
    ],
    totalAmount: 660
  },
  {
    orderId: 4, customerName: 'Liya Hailu', type: 'takeaway', status: 'paid', orderDate: '2025-06-10T07:30:00',
    items: [
      { orderItemId: 7, itemId: 7, itemName: 'Injera Firfir', quantity: 1, unitPrice: 140, subTotal: 140 },
      { orderItemId: 8, itemId: 9, itemName: 'Ful (Fava Beans)', quantity: 1, unitPrice: 110, subTotal: 110 },
    ],
    totalAmount: 250
  },
  {
    orderId: 5, tableId: 4, tableNumber: 4, customerName: 'Amir Hassen', waiterId: 3, waiterName: 'Dawit Bekele',
    type: 'dine-in', status: 'pending', orderDate: '2025-06-10T10:00:00',
    items: [
      { orderItemId: 9, itemId: 13, itemName: 'Mixed Grill Platter', quantity: 1, unitPrice: 480, subTotal: 480 },
      { orderItemId: 10, itemId: 24, itemName: 'Tej (Honey Wine)', quantity: 2, unitPrice: 120, subTotal: 240 },
    ],
    totalAmount: 720, notes: 'Medium spice level'
  },
];

export const payments: Payment[] = [
  { paymentId: 1, orderId: 4, amount: 250, method: 'cash', status: 'completed', paymentDate: '2025-06-10T07:45:00', transactionId: 'TXN-001' },
  { paymentId: 2, orderId: 3, amount: 660, method: 'mobile', status: 'completed', paymentDate: '2025-06-10T09:00:00', transactionId: 'TXN-002' },
];

export const reservations: Reservation[] = [
  { reservationId: 1, customerName: 'Selamawit Girma', phone: '+251911223344', dateTime: '2025-06-10T13:00:00', guests: 4, tableId: 3, status: 'confirmed' },
  { reservationId: 2, customerName: 'Bereket Wolde', phone: '+251922334455', dateTime: '2025-06-10T18:30:00', guests: 6, tableId: 9, status: 'confirmed' },
  { reservationId: 3, customerName: 'Feven Assefa', phone: '+251933445566', dateTime: '2025-06-11T12:00:00', guests: 2, status: 'pending' },
  { reservationId: 4, customerName: 'Naod Bekele', phone: '+251944556677', dateTime: '2025-06-11T19:00:00', guests: 8, status: 'pending' },
];

export const ingredients: Ingredient[] = [
  { ingredientId: 1, name: 'Berbere Spice Mix', quantity: 5.5, unit: 'kg', threshold: 2 },
  { ingredientId: 2, name: 'Injera (pieces)', quantity: 120, unit: 'pcs', threshold: 50 },
  { ingredientId: 3, name: 'Chicken (whole)', quantity: 15, unit: 'kg', threshold: 10 },
  { ingredientId: 4, name: 'Beef (fresh)', quantity: 8, unit: 'kg', threshold: 5 },
  { ingredientId: 5, name: 'Red Lentils', quantity: 12, unit: 'kg', threshold: 4 },
  { ingredientId: 6, name: 'Shiro Flour', quantity: 3, unit: 'kg', threshold: 3 },
  { ingredientId: 7, name: 'Niter Kibbeh (spiced butter)', quantity: 4, unit: 'kg', threshold: 2 },
  { ingredientId: 8, name: 'Onions', quantity: 20, unit: 'kg', threshold: 8 },
  { ingredientId: 9, name: 'Tomatoes', quantity: 6, unit: 'kg', threshold: 4 },
  { ingredientId: 10, name: 'Coffee Beans', quantity: 2, unit: 'kg', threshold: 1 },
  { ingredientId: 11, name: 'Lamb', quantity: 4, unit: 'kg', threshold: 5 },
  { ingredientId: 12, name: 'Mango', quantity: 15, unit: 'pcs', threshold: 10 },
  { ingredientId: 13, name: 'Teff Flour', quantity: 1.5, unit: 'kg', threshold: 3 },
  { ingredientId: 14, name: 'Garlic', quantity: 3, unit: 'kg', threshold: 2 },
];

export const salesData = [
  { day: 'Mon', revenue: 8500, orders: 32 },
  { day: 'Tue', revenue: 7200, orders: 28 },
  { day: 'Wed', revenue: 9100, orders: 35 },
  { day: 'Thu', revenue: 11200, orders: 42 },
  { day: 'Fri', revenue: 14800, orders: 58 },
  { day: 'Sat', revenue: 18500, orders: 72 },
  { day: 'Sun', revenue: 16200, orders: 64 },
];

export const topItems = [
  { name: 'Doro Wat', orders: 145, revenue: 40600 },
  { name: 'Special Tibs', orders: 128, revenue: 44800 },
  { name: 'Buna (Coffee)', orders: 210, revenue: 16800 },
  { name: 'Beyaynetu', orders: 118, revenue: 30680 },
  { name: 'Spris Juice', orders: 185, revenue: 16650 },
];
