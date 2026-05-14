import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../../context/AppContext';

const sectionTitles = {
  dashboard: 'Dashboard',
  manager: 'Manager Dashboard',
  cashier: 'Cashier Dashboard',
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
  customer: 'var(--primary-gold)'
};

const Topbar = () => {
  const { currentUser, sidebarOpen, setSidebarOpen } = useAuth();
  const { orders, payments } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const path = location.pathname.split('/').pop() || 'dashboard';
  const activeTitle = sectionTitles[path] || path;
  const roleColor = roleColors[currentUser.role] || 'var(--primary-gold)';
  const unpaidOrders = orders.filter(o => o.status === 'served').length;
  const activeOrders = orders.filter(o => !['paid', 'cancelled'].includes(o.status)).length;
  const pendingOrders = orders.filter(o => !['paid', 'cancelled'].includes(o.status)).length;
  const todayPayments = payments.filter(p => new Date(p.paymentDate).toDateString() === new Date().toDateString()).length;
  const totalTransactions = payments.filter(p => p.status === 'completed').length;

  const notifications = currentUser.role === 'cashier' ? [
    {
      title: `${unpaidOrders} orders awaiting payment`,
      description: 'Orders ready for cashier checkout',
      action: { label: 'Process payments', path: '/cashier/payments' }
    },
    {
      title: `${pendingOrders} open orders`,
      description: 'Orders still in progress',
      action: { label: 'Review orders', path: '/cashier' }
    },
    {
      title: `${todayPayments} transactions today`,
      description: 'Payments completed by your team',
      action: { label: 'View receipts', path: '/cashier/payments' }
    }
  ] : [
    {
      title: 'Welcome back!',
      description: 'No new notifications at the moment',
      action: { label: 'Refresh', path: location.pathname }
    }
  ];

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b sticky top-0 z-20" style={{
      background: 'var(--bg-light-cream)',
      borderColor: 'var(--bg-light-nude)'
    }}>
      <div className="flex items-center gap-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-stone-100 transition-colors" style={{ color: 'var(--text-brown-deep)' }}>
          <Menu size={20} />
        </button>
        <div>
          <h2 className="font-bold text-lg capitalize" style={{
            color: 'var(--bg-dark-accent)',
            fontFamily: "'Playfair Display', serif"
          }}>
            {activeTitle}
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-brown-muted)' }}>Holy Restaurant · Dire Dawa, Ethiopia</p>
        </div>
      </div>

      <div className="flex items-center gap-3 relative">
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl" style={{
          background: '#F0E8DE',
          border: '1px solid var(--bg-light-nude)'
        }}>
          <Search size={14} style={{ color: 'var(--text-brown-muted)' }} />
          <input placeholder="Search..." className="bg-transparent text-sm outline-none w-40" style={{ color: 'var(--bg-dark-accent)' }} />
        </div>

        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-xl hover:bg-stone-100 transition-colors" style={{ color: 'var(--text-brown-deep)' }}>
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#DC2626' }} />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl shadow-xl bg-white border border-gray-200 text-left overflow-hidden z-50" style={{ minWidth: '18rem' }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: '#F0E8DE' }}>
                <p className="text-sm font-semibold" style={{ color: '#2C1810' }}>Notifications</p>
                <p className="text-xs text-gray-500">Quick actions for your cashier workflow</p>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((note, index) => (
                  <div key={index} className="px-4 py-3 hover:bg-gray-50 cursor-pointer" onClick={() => {
                    setShowNotifications(false);
                    navigate(note.action.path);
                  }}>
                    <p className="font-semibold text-sm" style={{ color: '#2C1810' }}>{note.title}</p>
                    <p className="text-xs text-gray-500 mb-2">{note.description}</p>
                    <button className="text-xs font-semibold text-amber-700" style={{ color: '#C8862A' }}>{note.action.label}</button>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t" style={{ borderColor: '#F0E8DE' }}>
                <button onClick={() => setShowNotifications(false)} className="w-full text-xs font-semibold uppercase tracking-wide rounded-xl py-2" style={{ background: '#F6F0E4', color: '#8B6E52' }}>
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setShowProfileModal(true)} className="flex items-center gap-2 focus:outline-none hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs shadow" style={{
              background: `linear-gradient(135deg, ${roleColor}, ${roleColor}88)`
            }}>
              {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold" style={{ color: 'var(--bg-dark-accent)' }}>{currentUser.name}</p>
              <p className="text-xs capitalize" style={{ color: roleColor }}>{currentUser.role}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Profile Modal for Cashiers */}
      {showProfileModal && currentUser.role === 'cashier' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl" style={{ background: 'white' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6" style={{ background: 'linear-gradient(135deg, #1A1008, #2C1810)' }}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg" style={{ background: 'var(--primary-gradient)' }}>✦</div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] font-semibold" style={{ color: '#C8862A' }}>Cashier Profile</p>
                  <h3 className="text-2xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{currentUser.name}</h3>
                  <p className="text-sm" style={{ color: '#8B6E52' }}>Employee ID: {currentUser.userId ?? 'EMP-000'}</p>
                </div>
              </div>
              <button onClick={() => setShowProfileModal(false)} className="text-white hover:opacity-70 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                {/* Left Column - Details */}
                <div className="space-y-6">
                  {/* Employee Information */}
                  <div className="rounded-3xl p-6 border-2" style={{ borderColor: '#F0E0C9', background: '#FEFAF5' }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#C8862A' }}>
                        <span className="text-white text-sm">👤</span>
                      </div>
                      <h4 className="text-lg font-bold" style={{ color: '#2C1810' }}>Employee Information</h4>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-600">Full Name</span>
                          <span className="text-sm font-semibold" style={{ color: '#2C1810' }}>{currentUser.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-600">Role</span>
                          <span className="text-sm font-semibold capitalize" style={{ color: '#DC2626' }}>{currentUser.role}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-600">Employee ID</span>
                          <span className="text-sm font-semibold" style={{ color: '#2C1810' }}>{currentUser.userId ?? 'EMP-000'}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-600">Email</span>
                          <span className="text-sm font-semibold" style={{ color: '#2C1810' }}>{currentUser.email ?? 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-600">Phone</span>
                          <span className="text-sm font-semibold" style={{ color: '#2C1810' }}>{currentUser.phone ?? 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-600">Status</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold" style={{ background: '#DCFCE7', color: '#166534' }}>Active</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="rounded-3xl p-6 border-2" style={{ borderColor: '#F0E0C9', background: '#FEFAF5' }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#059669' }}>
                        <span className="text-white text-sm">📊</span>
                      </div>
                      <h4 className="text-lg font-bold" style={{ color: '#2C1810' }}>Performance Metrics</h4>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="bg-white rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Active Orders</p>
                            <p className="text-2xl font-black" style={{ color: '#2C1810' }}>{activeOrders}</p>
                          </div>
                          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#FEF3C7' }}>
                            <span className="text-lg">📋</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Pending Payments</p>
                            <p className="text-2xl font-black" style={{ color: '#C8862A' }}>{unpaidOrders}</p>
                          </div>
                          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#FED7D7' }}>
                            <span className="text-lg">💳</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Today's Transactions</p>
                            <p className="text-2xl font-black" style={{ color: '#059669' }}>{todayPayments}</p>
                          </div>
                          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#CFFAFE' }}>
                            <span className="text-lg">📈</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Total Transactions</p>
                            <p className="text-2xl font-black" style={{ color: '#7C3AED' }}>{totalTransactions}</p>
                          </div>
                          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#E9D5FF' }}>
                            <span className="text-lg">🏆</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Actions */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="rounded-3xl p-6 border-2" style={{ borderColor: '#F0E0C9', background: '#FFF8ED' }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#DC2626' }}>
                        <span className="text-white text-sm">⚡</span>
                      </div>
                      <h4 className="text-lg font-bold" style={{ color: '#2C1810' }}>Quick Actions</h4>
                    </div>
                    <div className="space-y-3">
                      <button onClick={() => { setShowProfileModal(false); navigate('/cashier/payments'); }} className="w-full rounded-2xl py-4 font-semibold text-sm transition-all hover:scale-105 flex items-center justify-center gap-2" style={{ background: '#DC2626', color: 'white' }}>
                        <span>💳</span> Process Payments
                      </button>
                      <button onClick={() => { setShowProfileModal(false); navigate('/cashier'); }} className="w-full rounded-2xl py-4 font-semibold text-sm transition-all hover:scale-105 flex items-center justify-center gap-2" style={{ background: '#F0E8DE', color: '#2C1810' }}>
                        <span>📋</span> Review Orders
                      </button>
                      <button onClick={() => { setShowProfileModal(false); window.location.reload(); }} className="w-full rounded-2xl py-4 font-semibold text-sm transition-all hover:scale-105 flex items-center justify-center gap-2" style={{ background: '#FEE2E2', color: '#B91C1C' }}>
                        <span>🔒</span> Secure Logout
                      </button>
                    </div>
                  </div>

                  {/* Shift Information */}
                  <div className="rounded-3xl p-6 border-2" style={{ borderColor: '#F0E0C9', background: '#FEFAF5' }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#0369A1' }}>
                        <span className="text-white text-sm">🕒</span>
                      </div>
                      <h4 className="text-lg font-bold" style={{ color: '#2C1810' }}>Shift Information</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">Current Shift</span>
                        <span className="text-sm font-semibold" style={{ color: '#2C1810' }}>Morning (8AM - 4PM)</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">Station</span>
                        <span className="text-sm font-semibold" style={{ color: '#2C1810' }}>Cashier #1</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">Login Time</span>
                        <span className="text-sm font-semibold" style={{ color: '#2C1810' }}>{new Date().toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <div className="mt-4 p-4 rounded-2xl bg-white border border-gray-200">
                      <p className="text-xs text-gray-600 uppercase tracking-[0.15em] mb-2">Shift Goals</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Process all pending payments</li>
                        <li>• Maintain transaction accuracy</li>
                        <li>• Assist with customer inquiries</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Topbar;
