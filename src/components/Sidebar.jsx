import React from 'react';
import { LayoutDashboard, Users, UtensilsCrossed, ClipboardList, Table2, Calendar, Package, CreditCard, BarChart3, Settings, LogOut, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
const navItems = [{
  section: 'dashboard',
  label: 'Dashboard',
  icon: <LayoutDashboard size={18} />,
  roles: ['admin', 'manager', 'waiter', 'chef', 'cashier', 'customer']
}, {
  section: 'menu',
  label: 'Menu',
  icon: <UtensilsCrossed size={18} />,
  roles: ['admin', 'manager', 'waiter', 'chef', 'customer']
}, {
  section: 'orders',
  label: 'Orders',
  icon: <ClipboardList size={18} />,
  roles: ['admin', 'manager', 'waiter', 'chef', 'cashier']
}, {
  section: 'tables',
  label: 'Tables',
  icon: <Table2 size={18} />,
  roles: ['admin', 'manager', 'waiter']
}, {
  section: 'reservations',
  label: 'Reservations',
  icon: <Calendar size={18} />,
  roles: ['admin', 'manager', 'waiter', 'customer']
}, {
  section: 'inventory',
  label: 'Inventory',
  icon: <Package size={18} />,
  roles: ['admin', 'manager', 'chef']
}, {
  section: 'payments',
  label: 'Payments',
  icon: <CreditCard size={18} />,
  roles: ['admin', 'manager', 'cashier']
}, {
  section: 'reports',
  label: 'Reports',
  icon: <BarChart3 size={18} />,
  roles: ['admin', 'manager']
}, {
  section: 'users',
  label: 'Users',
  icon: <Users size={18} />,
  roles: ['admin']
}, {
  section: 'settings',
  label: 'Settings',
  icon: <Settings size={18} />,
  roles: ['admin', 'manager']
}];
const roleColors = {
  admin: '#7C3AED',
  manager: '#0369A1',
  waiter: '#059669',
  chef: '#D97706',
  cashier: '#DC2626',
  customer: '#C8862A'
};
const Sidebar = ({
  activeSection,
  onNavigate
}) => {
  const {
    currentUser,
    logout,
    sidebarOpen,
    setSidebarOpen
  } = useApp();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!currentUser) return null;
  const visibleNav = navItems.filter(item => item.roles.includes(currentUser.role));
  const roleColor = roleColors[currentUser.role];
  return <>
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 lg:hidden" style={{
      background: 'rgba(0,0,0,0.5)'
    }} onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300
        ${sidebarOpen ? 'w-64' : 'w-0 lg:w-16'} overflow-hidden`} style={{
      background: '#1A1008',
      boxShadow: '4px 0 24px rgba(0,0,0,0.3)'
    }}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b" style={{
        borderColor: 'rgba(200,134,42,0.15)'
      }}>
          {sidebarOpen && <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-base shadow-lg" style={{
            background: 'linear-gradient(135deg, #C8862A, #8B3A0F)'
          }}>✦</div>
              <div>
                <h1 className="text-white font-black text-base tracking-widest leading-none" style={{
              fontFamily: "'Playfair Display', serif"
            }}>HOLY</h1>
                <p className="text-xs" style={{
              color: '#C8862A'
            }}>RESTAURANT</p>
              </div>
            </div>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white hover:opacity-70 transition-opacity ml-auto">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* User Info */}
        {sidebarOpen && <div className="px-4 py-4 border-b" style={{
        borderColor: 'rgba(200,134,42,0.15)'
      }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg" style={{
            background: `linear-gradient(135deg, ${roleColor}, ${roleColor}88)`
          }}>
                {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{currentUser.name}</p>
                <span className="text-xs px-2 py-0.5 rounded-full capitalize font-medium" style={{
              background: `${roleColor}20`,
              color: roleColor
            }}>
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>}

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="space-y-1 px-2">
            {visibleNav.map(item => <button key={item.section} onClick={() => {
            onNavigate(item.section);
            if (window.innerWidth < 1024) setSidebarOpen(false);
          }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${activeSection === item.section ? 'text-white' : 'hover:opacity-100 opacity-60 hover:bg-white/5 text-white'}`} style={activeSection === item.section ? {
            background: `linear-gradient(135deg, ${roleColor}40, ${roleColor}20)`,
            borderLeft: `3px solid ${roleColor}`
          } : {}}>
                <span style={{
              color: activeSection === item.section ? roleColor : 'inherit'
            }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>)}
          </div>
        </nav>

        {/* Logout */}
        <div className="px-2 py-4 border-t" style={{
        borderColor: 'rgba(200,134,42,0.15)'
      }}>
          <button onClick={() => setShowLogoutConfirm(true)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all opacity-70 hover:opacity-100">
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl" style={{ background: 'white' }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>
              Confirm Logout
            </h3>
            <p className="text-sm mb-6" style={{ color: '#8B6E52' }}>
              Are you sure you want to log out of your session?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-gray-50"
                style={{ border: '1px solid #E8D5C0', color: '#6B4F3A' }}>
                Cancel
              </button>
              <button onClick={() => { setShowLogoutConfirm(false); logout(); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 text-white"
                style={{ background: '#DC2626' }}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>;
};
export default Sidebar;