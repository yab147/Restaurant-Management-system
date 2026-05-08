import { ChefHat, TrendingUp, Clock, Users, BarChart3, Zap } from "lucide-react";

interface WelcomeProps {
  onLogin: () => void;
}

export function Welcome({ onLogin }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Holy Restaurant</h1>
          </div>
          <button
            onClick={onLogin}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Staff Access
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Content */}
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Restaurant Management <span className="text-indigo-600">Simplified</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Complete solution for restaurant operations, customer ordering, and business intelligence. Manage everything from one unified platform.
            </p>
            <p className="text-lg text-gray-500 mb-8">
              Choose your role to get started:
            </p>
          </div>

          {/* Right Side - Role Selection */}
          <div className="grid grid-cols-1 gap-6">
            {/* Customer Card */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <ChefHat className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold bg-white bg-opacity-20 px-3 py-1 rounded-full">Popular</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Customer</h3>
              <p className="text-orange-100 mb-6">Browse menu, order food, and make reservations with ease</p>
              <button className="w-full py-3 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-semibold group-hover:shadow-lg">
                Order Now
              </button>
            </div>

            {/* Staff Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Staff/Manager</h3>
              <p className="text-indigo-100 mb-6">Access dashboard, manage operations, and view analytics</p>
              <button 
                onClick={onLogin}
                className="w-full py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-semibold group-hover:shadow-lg">
                Staff Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Powerful Features for Everyone
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "For Customers",
                description: "Easy ordering, menu browsing, reservation booking, and order tracking in one place.",
              },
              {
                icon: BarChart3,
                title: "For Staff",
                description: "Manage orders, staff, reservations, menu items, and get real-time analytics.",
              },
              {
                icon: Zap,
                title: "For Everyone",
                description: "Fast performance, secure transactions, 24/7 support, and seamless experience.",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="p-6 border border-gray-200 rounded-xl hover:border-indigo-300 transition-colors">
                  <Icon className="w-8 h-8 text-indigo-600 mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Restaurant?
          </h3>
          <p className="text-indigo-100 text-lg mb-8">
            Join hundreds of restaurants using Holy Restaurant today.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 Holy Restaurant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
