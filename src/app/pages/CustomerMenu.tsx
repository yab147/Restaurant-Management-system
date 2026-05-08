import { useState } from "react";
import { ShoppingCart, Heart, MapPin, Phone, LogOut, ChefHat, Minus, Plus } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CustomerMenuProps {
  user?: { name: string; email: string; phone: string };
  onLogout?: () => void;
}

export function CustomerMenu({ user, onLogout }: CustomerMenuProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const menuItems = [
    { id: "1", name: "Kitfo", price: 450, category: "main", rating: 4.9, orders: 240 },
    { id: "2", name: "Doro Wat", price: 380, category: "main", rating: 4.8, orders: 180 },
    { id: "3", name: "Tibs", price: 520, category: "main", rating: 4.7, orders: 160 },
    { id: "4", name: "Shiro", price: 200, category: "main", rating: 4.6, orders: 150 },
    { id: "5", name: "Misir Wat", price: 180, category: "main", rating: 4.5, orders: 140 },
    { id: "6", name: "Injera (1 pc)", price: 50, category: "bread", rating: 4.8, orders: 300 },
    { id: "7", name: "Kocho", price: 60, category: "bread", rating: 4.4, orders: 80 },
    { id: "8", name: "Coffee", price: 40, category: "drinks", rating: 4.9, orders: 500 },
    { id: "9", name: "Tej", price: 120, category: "drinks", rating: 4.6, orders: 120 },
    { id: "10", name: "Fresh Juice", price: 80, category: "drinks", rating: 4.7, orders: 200 },
    { id: "11", name: "Tiramisu", price: 150, category: "desserts", rating: 4.8, orders: 90 },
    { id: "12", name: "Chocolate Cake", price: 120, category: "desserts", rating: 4.7, orders: 110 },
  ];

  const categories = [
    { id: "all", label: "All Items" },
    { id: "main", label: "Main Dishes" },
    { id: "bread", label: "Bread & Sides" },
    { id: "drinks", label: "Drinks" },
    { id: "desserts", label: "Desserts" },
  ];

  const filteredItems = selectedCategory === "all"
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item: typeof menuItems[0]) => {
    const existingItem = cart.find(c => c.id === item.id);
    if (existingItem) {
      setCart(cart.map(c =>
        c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
      ));
    } else {
      setCart([...cart, { id: item.id, name: item.name, price: item.price, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(c => c.id !== id));
    } else {
      setCart(cart.map(c => c.id === id ? { ...c, quantity } : c));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ChefHat className="w-8 h-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-900">Holy Restaurant</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
              <div className="hidden sm:block text-right">
                <p className="text-sm text-gray-500">Welcome!</p>
                <p className="font-semibold text-gray-900">{user?.name}</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === cat.id
                        ? "bg-orange-100 text-orange-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Menu Grid */}
          <div className={showCart ? "lg:col-span-2" : "lg:col-span-3"}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="h-44 bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center text-6xl">
                    <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center text-4xl shadow-inner">
                      {item.category === "main" && "🍖"}
                      {item.category === "bread" && "🥘"}
                      {item.category === "drinks" && "☕"}
                      {item.category === "desserts" && "🍰"}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">Classic {item.category} — tasty and popular.</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500">{item.orders} orders</span>
                        <button className="mt-2 text-gray-400 hover:text-red-500 transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-orange-600">{item.price} ETB</span>
                      <span className="text-sm text-gray-500">⭐ {item.rating}</span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => addToCart(item)}
                        className="flex-1 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm"
                      >
                        Add to Cart
                      </button>
                      <button className="px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                        Quick View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          {showCart && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4">Shopping Cart</h3>
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-sm">Your cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.price} ETB</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 pt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-semibold">{cartTotal} ETB</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Delivery:</span>
                        <span className="font-semibold text-green-600">Free</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold pt-3 border-t">
                        <span>Total:</span>
                        <span className="text-orange-600">{cartTotal} ETB</span>
                      </div>
                      <button className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold">
                        Proceed to Checkout
                      </button>
                      {user?.phone && (
                        <div className="text-xs text-gray-500 flex items-center gap-1 pt-2">
                          <Phone className="w-3 h-3" />
                          We'll call {user.phone}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
