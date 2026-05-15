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
import { useLocation } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../../providers/AuthProvider.jsx';
import { useUI }   from '../../../providers/index.jsx';
import { ROLE_COLORS } from '../Sidebar/sidebarConfig.jsx';

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

export default function AppTopbar() {
  const { user }                        = useAuth();
  const { sidebarOpen, setSidebarOpen } = useUI();
  const location                        = useLocation();
  const [currentTime, setCurrentTime]   = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);

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
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl hover:bg-stone-100 transition-colors"
            style={{ color: 'var(--text-brown-deep)' }}
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#DC2626' }} />
          </button>
          {showNotifications && (
            <div
              className="absolute right-0 mt-2 w-72 rounded-2xl shadow-xl bg-white border border-gray-200 overflow-hidden z-50"
              style={{ top: '100%' }}
            >
              <div className="px-4 py-3 border-b" style={{ borderColor: '#F0E8DE' }}>
                <p className="text-sm font-semibold" style={{ color: '#2C1810' }}>Notifications</p>
                <p className="text-xs text-gray-500">{getGreeting(currentTime.getHours())}, {user.name?.split(' ')[0]}!</p>
              </div>
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-gray-500">No new notifications</p>
              </div>
              <div className="px-4 py-3 border-t" style={{ borderColor: '#F0E8DE' }}>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-full text-xs font-semibold uppercase tracking-wide rounded-xl py-2"
                  style={{ background: '#F6F0E4', color: '#8B6E52' }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-2">
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
        </div>
      </div>
    </header>
  );
}
