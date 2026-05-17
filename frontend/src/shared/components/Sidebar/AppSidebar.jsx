/**
 * AppSidebar — Universal Permission-Driven Sidebar
 *
 * WHY THIS REPLACES ALL ROLE-SPECIFIC SIDEBARS:
 * Instead of AdminSidebar, ManagerSidebar, CashierSidebar... this single
 * component reads the user's permissions at runtime and renders only the
 * nav items the user is allowed to see. Zero role checks. Zero duplication.
 *
 * HOW IT WORKS:
 *  1. usePermission() gives us the user's full permission set
 *  2. SIDEBAR_NAV items are filtered: if user has any of item.permissions → show it
 *  3. Items are grouped visually by their `group` property
 *  4. useUI() provides sidebarOpen state (not tied to auth)
 *
 * ADDING A NEW NAV ITEM:
 *  Edit sidebarConfig.js ONLY. This component auto-adapts.
 */

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth }       from '../../../providers/AuthProvider.jsx';
import { useUI }         from '../../../providers/index.jsx';
import { usePermission } from '../../../providers/PermissionProvider.jsx';
import { SIDEBAR_NAV, GROUP_LABELS, ROLE_COLORS } from './sidebarConfig.jsx';

export default function AppSidebar() {
  const { user, logout }          = useAuth();
  const { sidebarOpen, setSidebarOpen } = useUI();
  const { hasAnyPermission }      = usePermission();
  const navigate                  = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!user) return null;

  const roleColor = ROLE_COLORS[user.role] || '#C8862A';

  // Filter nav items the user has permission to see
  const visibleNav = SIDEBAR_NAV.filter(item => {
    const permissionAccess = hasAnyPermission(item.permissions);
    const roleAccess = item.roles ? item.roles.includes(user.role) : true;
    return permissionAccess && roleAccess;
  });

  // Group items by their group key
  const grouped = visibleNav.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300
          ${sidebarOpen ? 'w-64' : 'w-0 lg:w-16'} overflow-hidden`}
        style={{ background: 'var(--bg-dark)', boxShadow: '4px 0 24px rgba(0,0,0,0.3)' }}
      >
        {/* ── Brand Header ─────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-5 border-b"
          style={{ borderColor: 'rgba(200,134,42,0.15)' }}>
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-base shadow-lg"
                style={{ background: 'var(--primary-gradient)' }}>✦</div>
              <div>
                <h1 className="text-white font-black text-base tracking-widest leading-none"
                  style={{ fontFamily: "'Playfair Display', serif" }}>HOLY</h1>
                <p className="text-xs" style={{ color: 'var(--primary-gold)' }}>RESTAURANT</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:opacity-70 transition-opacity ml-auto"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* ── User Info ────────────────────────────────────── */}
        {sidebarOpen && (
          <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(200,134,42,0.15)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg"
                style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}88)` }}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                <span className="text-xs px-2 py-0.5 rounded-full capitalize font-medium"
                  style={{ background: `${roleColor}20`, color: roleColor }}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation ───────────────────────────────────── */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} className="mb-2">
              {/* Section label (only shown when sidebar is open) */}
              {sidebarOpen && GROUP_LABELS[group] && (
                <p className="px-4 pb-1 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: 'rgba(200,134,42,0.5)' }}>
                  {GROUP_LABELS[group]}
                </p>
              )}
              <div className="space-y-0.5 px-2">
                {items.map(item => (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${isActive
                        ? 'text-white'
                        : 'text-white opacity-60 hover:opacity-100 hover:bg-white/5'
                      }`
                    }
                    style={({ isActive }) => isActive ? {
                      background: `linear-gradient(135deg, ${roleColor}40, ${roleColor}20)`,
                      borderLeft: `3px solid ${roleColor}`,
                    } : {}}
                  >
                    {({ isActive }) => (
                      <>
                        <span style={{ color: isActive ? roleColor : 'inherit', flexShrink: 0 }}>
                          {item.icon}
                        </span>
                        {sidebarOpen && <span>{item.label}</span>}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Logout ───────────────────────────────────────── */}
        <div className="px-2 py-4 border-t" style={{ borderColor: 'rgba(200,134,42,0.15)' }}>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              text-red-400 hover:bg-red-500/10 transition-all opacity-70 hover:opacity-100"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Logout Confirm Modal ─────────────────────────── */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl" style={{ background: 'white' }}>
            <h3 className="text-xl font-bold mb-2"
              style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>
              Confirm Logout
            </h3>
            <p className="text-sm mb-6" style={{ color: '#8B6E52' }}>
              Are you sure you want to log out of your session?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all"
                style={{ border: '1px solid #E8D5C0', color: '#2C1810' }}
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowLogoutConfirm(false); handleLogout(); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all"
                style={{ background: '#DC2626' }}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
