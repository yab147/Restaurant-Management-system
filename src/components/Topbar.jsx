import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
const sectionTitles = {
  dashboard: 'Dashboard',
  menu: 'Menu Management',
  orders: 'Orders',
  tables: 'Table Management',
  reservations: 'Reservations',
  inventory: 'Inventory',
  payments: 'Payments & Billing',
  reports: 'Reports & Analytics',
  users: 'User Management',
  settings: 'Settings'
};
const roleColors = {
  admin: '#7C3AED',
  manager: '#0369A1',
  waiter: '#059669',
  chef: '#D97706',
  cashier: '#DC2626',
  customer: '#C8862A'
};
const Topbar = ({
  activeSection
}) => {
  const {
    currentUser,
    sidebarOpen,
    setSidebarOpen
  } = useApp();
  if (!currentUser) return null;
  const roleColor = roleColors[currentUser.role];
  return <header className="h-16 flex items-center justify-between px-6 border-b sticky top-0 z-20" style={{
    background: '#FDF6EE',
    borderColor: '#E8D5C0'
  }}>
      <div className="flex items-center gap-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-stone-100 transition-colors" style={{
        color: '#6B4F3A'
      }}>
          <Menu size={20} />
        </button>
        <div>
          <h2 className="font-bold text-lg" style={{
          color: '#2C1810',
          fontFamily: "'Playfair Display', serif"
        }}>
            {sectionTitles[activeSection] || activeSection}
          </h2>
          <p className="text-xs" style={{
          color: '#8B6E52'
        }}>Holy Restaurant · Dire Dawa, Ethiopia</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl" style={{
        background: '#F0E8DE',
        border: '1px solid #E8D5C0'
      }}>
          <Search size={14} style={{
          color: '#8B6E52'
        }} />
          <input placeholder="Search..." className="bg-transparent text-sm outline-none w-40" style={{
          color: '#2C1810'
        }} />
        </div>

        <button className="relative p-2 rounded-xl hover:bg-stone-100 transition-colors" style={{
        color: '#6B4F3A'
      }}>
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{
          background: '#DC2626'
        }} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs shadow" style={{
          background: `linear-gradient(135deg, ${roleColor}, ${roleColor}88)`
        }}>
            {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold" style={{
            color: '#2C1810'
          }}>{currentUser.name}</p>
            <p className="text-xs capitalize" style={{
            color: roleColor
          }}>{currentUser.role}</p>
          </div>
        </div>
      </div>
    </header>;
};
export default Topbar;