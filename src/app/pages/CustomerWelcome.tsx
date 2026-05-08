import { ChefHat, Star, MapPin, Clock } from "lucide-react";

interface CustomerWelcomeProps {
  onCustomerLogin: () => void;
  onCustomerRegister: () => void;
  onStaffLogin: () => void;
}

export function CustomerWelcome({ onCustomerLogin, onCustomerRegister, onStaffLogin }: CustomerWelcomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-orange-600" />
            <h1 className="text-2xl font-bold text-gray-900">Holy Restaurant</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onStaffLogin}
              className="px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium text-sm"
            >
              Staff Login
            </button>
            <button
              onClick={onCustomerLogin}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Order Your Favorite <span className="text-orange-600">Meals</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover authentic cuisine, reserve your table, and enjoy a seamless dining experience.
          </p>
          <button
            onClick={onCustomerLogin}
            className="px-8 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold text-lg inline-block"
          >
            Browse Menu & Order Now
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: Star, label: "4.8 Rating", value: "500+ Reviews" },
            { icon: Clock, label: "Fast Delivery", value: "30 mins avg" },
            { icon: MapPin, label: "Easy Reservations", value: "Book instantly" },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                <Icon className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
                <p className="font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-12">Our Specialties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Kitfo", price: "450 ETB", rating: "4.9", img: "🍖" },
              { name: "Doro Wat", price: "380 ETB", rating: "4.8", img: "🍲" },
              { name: "Injera", price: "250 ETB", rating: "4.7", img: "🥘" },
              { name: "Shiro", price: "200 ETB", rating: "4.6", img: "🍯" },
            ].map((dish, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-6xl">
                  {dish.img}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{dish.name}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-600 font-bold">{dish.price}</span>
                    <span className="text-sm text-gray-500">⭐ {dish.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={onCustomerLogin}
              className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              View Full Menu
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Don't have an account?
          </h3>
          <p className="text-orange-100 text-lg mb-8">
            Create one in seconds and start ordering your favorite meals!
          </p>
          <button
            onClick={onCustomerRegister}
            className="px-8 py-3 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-semibold text-lg"
          >
            Create Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 Holy Restaurant. Bringing great food to your table.</p>
        </div>
      </footer>
    </div>
  );
}
