/**
 * AppTopbar — Universal Top Navigation Bar
 *
 * Refactored from shared/components/Topbar.jsx
 * Old version imported from TWO contexts (AuthContext + AppContext) creating
 * a hard dependency on the god context. This version imports only what it needs.
 *
 * Data sourced from:
 *  - useAuth()       → user identity
 *  - useUI()         → sidebar toggle
 *  - useLocation()   → current page title
 */

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, Mail, Phone, Shield, UserRound, ClipboardList, Package, CalendarClock, Check } from 'lucide-react';
import { useAuth } from '../../../providers/AuthProvider.jsx';
import { useUI }   from '../../../providers/index.jsx';
import { ROLE_COLORS } from '../Sidebar/sidebarConfig.jsx';
import { useOrders } from '../../../features/orders/hooks/useOrders.js';
import { useLowStockAlerts } from '../../../features/inventory/hooks/useInventory.js';
import { useReservations } from '../../../features/reservations/hooks/useReservations.js';
import { ROUTES } from '../../../constants/routes.js';

const PAGE_TITLES = {
  '/dashboard':    'Dashboard',
  '/orders':       'Orders',
  '/menu':         'Menu Management',
  '/tables':       'Table Management',
  '/reservations': 'Reservations',
  '/inventory':    'Inventory',
  '/payments':     'Payments & Billing',
  '/reports':      'Reports & Analytics',
  '/users':        'User Management',
  '/settings':     'Settings',
};

const getGreeting = h => {
  if (h < 12) return 'Good Morning';
  if (h < 18) return 'Good Afternoon';
  return 'Good Evening';
};

const toLocalDateInput = (date) => {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
};

export default function AppTopbar() {
  const { user }                        = useAuth();
  const { sidebarOpen, setSidebarOpen } = useUI();
  const location                        = useLocation();
  const navigate                        = useNavigate();
  const [currentTime, setCurrentTime]   = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [dismissedNotifications, setDismissedNotifications] = useState([]);

  const today = toLocalDateInput(currentTime);
  const { data: pendingOrders = [] } = useOrders({ status: 'pending' }, { enabled: !!user, refetchInterval: 15000 });
  const { data: lowStockItems = [] } = useLowStockAlerts({ enabled: !!user });
  const { data: todayReservations = [] } = useReservations({ date: today, status: 'pending' }, { enabled: !!user, refetchInterval: 30000 });

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!user) return null;

  const roleColor  = ROLE_COLORS[user.role] || '#C8862A';
  const pageTitle  = PAGE_TITLES[location.pathname] || 'Dashboard';
  const initials   = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';
  const roleTitle = {
    admin: 'Full system access',
    manager: 'Operations and reporting',
    chef: 'Kitchen queue and inventory',
    waiter: 'Orders and table service',
    cashier: 'Payments and billing',
    customer: 'Guest account',
  }[user.role] || 'Restaurant team';
  const notificationItems = [
    ...pendingOrders.slice(0, 5).map(order => ({
      id: `order-${order.orderId}`,
      icon: <ClipboardList size={15} />,
      title: `Pending order #${order.orderId}`,
      detail: `${order.customerName || 'Guest'} · ETB ${order.totalAmount || 0}`,
      color: '#D97706',
      path: ROUTES.ORDERS,
    })),
    ...lowStockItems.slice(0, 5).map(item => ({
      id: `stock-${item.ingredientId}`,
      icon: <Package size={15} />,
      title: `${item.name} is low`,
      detail: `${item.quantity} ${item.unit} left · reorder at ${item.reorderLevel}`,
      color: '#DC2626',
      path: ROUTES.INVENTORY,
    })),
    ...todayReservations.slice(0, 5).map(reservation => ({
      id: `reservation-${reservation.reservationId}`,
      icon: <CalendarClock size={15} />,
      title: `Reservation waiting`,
      detail: `${reservation.customerName} · ${reservation.partySize} guests`,
      color: '#0369A1',
      path: ROUTES.RESERVATIONS,
    })),
  ].filter(n => !dismissedNotifications.includes(n.id)).slice(0, 8);
  const unreadCount = notificationItems.length;

  const dismissNotification = (id) => {
    setDismissedNotifications(prev => [...new Set([...prev, id])]);
  };

  const openPath = (path) => {
    setShowNotifications(false);
    setShowProfile(false);
    navigate(path);
  };

  return (
    <header
      className="h-16 flex items-center justify-between px-6 border-b sticky top-0 z-20"
      style={{ background: 'var(--bg-light-cream)', borderColor: 'var(--bg-light-nude)' }}
    >
      {/* Left — toggle + page title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
          style={{ color: 'var(--text-brown-deep)' }}
        >
          <Menu size={20} />
        </button>
        <div>
          <h2
            className="font-bold text-lg capitalize"
            style={{ color: 'var(--bg-dark-accent)', fontFamily: "'Playfair Display', serif" }}
          >
            {pageTitle}
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-brown-muted)' }}>
            Holy Restaurant · Dire Dawa, Ethiopia
          </p>
        </div>
      </div>

      {/* Right — notifications + user */}
      <div className="flex items-center gap-3">
        {/* Clock */}
        <span className="hidden md:block text-xs font-mono" style={{ color: 'var(--text-brown-muted)' }}>
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>

        {/* Notifications bell */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative p-2 rounded-xl hover:bg-stone-100 transition-colors"
            style={{ color: 'var(--text-brown-deep)' }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center" style={{ background: '#DC2626' }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div
              className="absolute right-0 mt-2 w-80 rounded-2xl shadow-xl bg-white border border-gray-200 overflow-hidden z-50"
              style={{ top: '100%' }}
            >
              <div className="px-4 py-3 border-b" style={{ borderColor: '#F0E8DE' }}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold" style={{ color: '#2C1810' }}>Notifications</p>
                  <span className="text-[11px] font-semibold" style={{ color: '#8B6E52' }}>Live refresh</span>
                </div>
                <p className="text-xs text-gray-500">{getGreeting(currentTime.getHours())}, {user.name?.split(' ')[0]}!</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notificationItems.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-gray-500">No new notifications</p>
                  </div>
                ) : notificationItems.map(item => (
                  <div key={item.id} className="flex gap-3 px-4 py-3 border-b last:border-b-0" style={{ borderColor: '#F0E8DE' }}>
                    <button
                      type="button"
                      onClick={() => openPath(item.path)}
                      className="flex flex-1 gap-3 text-left min-w-0"
                    >
                      <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}18`, color: item.color }}>
                        {item.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold truncate" style={{ color: '#2C1810' }}>{item.title}</span>
                        <span className="block text-xs truncate" style={{ color: '#8B6E52' }}>{item.detail}</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => dismissNotification(item.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-stone-100"
                      style={{ color: '#8B6E52' }}
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t" style={{ borderColor: '#F0E8DE' }}>
                <button
                  onClick={() => setDismissedNotifications(prev => [...new Set([...prev, ...notificationItems.map(n => n.id)])])}
                  className="w-full text-xs font-semibold uppercase tracking-wide rounded-xl py-2"
                  style={{ background: '#F6F0E4', color: '#8B6E52' }}
                >
                  Mark All Read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="relative">
          <button
            type="button"
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2 rounded-xl px-1.5 py-1 hover:bg-stone-100 transition-colors"
          >
            <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs shadow"
            style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}88)` }}
            >
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold" style={{ color: 'var(--bg-dark-accent)' }}>{user.name}</p>
              <p className="text-xs capitalize" style={{ color: roleColor }}>{user.role}</p>
            </div>
          </button>
          {showProfile && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl shadow-xl bg-white border border-gray-200 overflow-hidden z-50" style={{ top: '100%' }}>
              <div className="p-4" style={{ background: '#FFFBF3' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white" style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}88)` }}>
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold truncate" style={{ color: '#2C1810' }}>{user.name}</p>
                    <p className="text-xs capitalize font-semibold" style={{ color: roleColor }}>{user.role} · {roleTitle}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { icon: <UserRound size={15} />, label: 'User ID', value: user.userId || user.id || 'N/A' },
                  { icon: <Mail size={15} />, label: 'Email', value: user.email || 'N/A' },
                  { icon: <Phone size={15} />, label: 'Phone', value: user.phone || 'N/A' },
                  { icon: <Shield size={15} />, label: 'Access', value: roleTitle },
                ].map(row => (
                  <div key={row.label} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5" style={{ color: roleColor }}>{row.icon}</span>
                    <span className="min-w-0">
                      <span className="block text-[11px] uppercase font-semibold" style={{ color: '#8B6E52' }}>{row.label}</span>
                      <span className="block truncate" style={{ color: '#2C1810' }}>{row.value}</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t" style={{ borderColor: '#F0E8DE' }}>
                <button
                  type="button"
                  onClick={() => openPath(ROUTES.DASHBOARD)}
                  className="w-full text-xs font-semibold uppercase tracking-wide rounded-xl py-2"
                  style={{ background: `${roleColor}18`, color: roleColor }}
                >
                  Open Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
