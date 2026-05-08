import { LayoutDashboard, UtensilsCrossed, Package, Users, CalendarDays, BarChart3, Settings, LogOut, ChefHat } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user?: { name: string; email: string };
  onLogout?: () => void;
}

export function Sidebar({ activeTab, setActiveTab, user, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: UtensilsCrossed },
    { id: 'menu', label: 'Menu', icon: Package },
    { id: 'reservations', label: 'Reservations', icon: CalendarDays },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-72 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 lg:min-h-screen flex flex-col">
      <div className="p-4 lg:p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Holy Restaurant</h2>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>

        {/* User Status */}
        {user && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-xs text-gray-600">Logged in as</p>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 p-3 lg:p-4 flex gap-2 overflow-x-auto lg:block lg:space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex shrink-0 items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 lg:w-full ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="hidden lg:block p-4 border-t border-gray-200">
        {user ? (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        ) : (
          <p className="text-sm text-gray-500 text-center">Not logged in</p>
        )}
      </div>
    </aside>
  );
}
