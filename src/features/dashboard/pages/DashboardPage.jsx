import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, UtensilsCrossed, Table2, CreditCard, Package, Calendar, BarChart3 } from 'lucide-react';
import { useAuth }       from '../../../providers/AuthProvider.jsx';
import { usePermission } from '../../../providers/PermissionProvider.jsx';
import { PERMISSIONS }   from '../../../permissions/matrix.js';
import { useOrders, useOrderStats } from '../../orders/hooks/useOrders.js';
import { useTables }     from '../../tables/hooks/useTables.js';
import { usePaymentStats } from '../../payments/hooks/usePayments.js';
import { ROLE_COLORS }   from '../../../shared/components/Sidebar/sidebarConfig.jsx';
import { ROUTES }        from '../../../constants/routes.js';
import Spinner           from '../../../shared/components/ui/Spinner.jsx';

function StatCard({ label, value, icon, color, onClick }) {
  return (
    <div onClick={onClick}
      className={`rounded-2xl p-5 shadow-sm transition-all ${onClick ? 'cursor-pointer hover:shadow-md hover:scale-[1.02]' : ''}`}
      style={{ background: 'white', border: '1px solid #F0E8DE' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#8B6E52' }}>{label}</p>
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${color}20` }}>
          <span style={{ color }}>{icon}</span>
        </div>
      </div>
      <p className="text-3xl font-black" style={{ color, fontFamily: "'Playfair Display', serif" }}>{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user }           = useAuth();
  const { hasPermission }  = usePermission();
  const navigate           = useNavigate();

  const { data: orders = [],  isLoading: loadingOrders }  = useOrders();
  const { data: tables = [],  isLoading: loadingTables }  = useTables();
  const { data: orderStats }                              = useOrderStats();
  const { data: payStats }                                = usePaymentStats();

  const roleColor = ROLE_COLORS[user?.role] || '#C8862A';
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const activeOrders  = (orders || []).filter(o => o && !['paid', 'cancelled'].includes(o.status)).length;
  const pendingOrders = (orders || []).filter(o => o && o.status === 'pending').length;
  const servedOrders  = (orders || []).filter(o => o && o.status === 'served').length;
  const availableTbls = (tables || []).filter(t => t && t.status === 'available').length;

  const widgets = [
    hasPermission(PERMISSIONS.ORDERS_VIEW) && {
      label: 'Active Orders', value: loadingOrders ? '…' : activeOrders,
      icon: <ClipboardList size={18} />, color: '#C8862A', path: ROUTES.ORDERS,
    },
    hasPermission(PERMISSIONS.ORDERS_VIEW) && {
      label: 'Awaiting Payment', value: loadingOrders ? '…' : servedOrders,
      icon: <CreditCard size={18} />, color: '#DC2626', path: ROUTES.PAYMENTS,
    },
    hasPermission(PERMISSIONS.TABLES_VIEW) && {
      label: 'Available Tables', value: loadingTables ? '…' : availableTbls,
      icon: <Table2 size={18} />, color: '#059669', path: ROUTES.TABLES,
    },
    hasPermission(PERMISSIONS.ORDERS_VIEW) && {
      label: 'Pending Orders', value: loadingOrders ? '…' : pendingOrders,
      icon: <UtensilsCrossed size={18} />, color: '#D97706', path: ROUTES.ORDERS,
    },
  ].filter(Boolean);

  const quickLinks = [
    hasPermission(PERMISSIONS.ORDERS_VIEW)       && { label: 'View Orders',       icon: <ClipboardList size={16} />, path: ROUTES.ORDERS },
    hasPermission(PERMISSIONS.MENU_VIEW)         && { label: 'Manage Menu',        icon: <UtensilsCrossed size={16} />, path: ROUTES.MENU },
    hasPermission(PERMISSIONS.INVENTORY_VIEW)    && { label: 'Check Inventory',    icon: <Package size={16} />, path: ROUTES.INVENTORY },
    hasPermission(PERMISSIONS.RESERVATIONS_VIEW) && { label: 'Reservations',       icon: <Calendar size={16} />, path: ROUTES.RESERVATIONS },
    hasPermission(PERMISSIONS.REPORTS_VIEW)      && { label: 'Analytics',           icon: <BarChart3 size={16} />, path: ROUTES.REPORTS },
  ].filter(Boolean);

  return (
    <div className="p-6 space-y-6">
      {/* Greeting */}
      <div className="rounded-3xl p-6" style={{ background: `linear-gradient(135deg, #1A1008, #2C1810)` }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest mb-1" style={{ color: '#C8862A' }}>Holy Restaurant ERP</p>
            <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              {greeting}, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-sm mt-1" style={{ color: '#8B6E52' }}>
              {new Date().toLocaleDateString('en-ET', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1">
            <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg"
              style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}88)` }}>
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: `${roleColor}20`, color: roleColor }}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Stat widgets */}
      {widgets.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {widgets.map(w => (
            <StatCard key={w.label} {...w} onClick={() => navigate(w.path)} />
          ))}
        </div>
      )}

      {/* Quick links */}
      {quickLinks.length > 0 && (
        <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
          <h3 className="font-bold mb-4" style={{ color: '#2C1810' }}>Quick Actions</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickLinks.map(link => (
              <button key={link.label} onClick={() => navigate(link.path)}
                className="flex items-center gap-3 p-4 rounded-xl text-left transition-all hover:scale-[1.02] hover:shadow-sm"
                style={{ background: '#FDF6EE', border: '1px solid #F0E8DE' }}>
                <span style={{ color: '#C8862A' }}>{link.icon}</span>
                <span className="text-sm font-semibold" style={{ color: '#2C1810' }}>{link.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      {hasPermission(PERMISSIONS.ORDERS_VIEW) && (
        <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold" style={{ color: '#2C1810' }}>Recent Orders</h3>
            <button onClick={() => navigate(ROUTES.ORDERS)} className="text-xs font-semibold" style={{ color: '#C8862A' }}>View All →</button>
          </div>
          {loadingOrders ? (
            <div className="flex justify-center py-6"><Spinner /></div>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 5).map(o => (
                <div key={o.orderId} className="flex items-center justify-between py-2 border-b" style={{ borderColor: '#F0E8DE' }}>
                  <div>
                    <span className="font-bold text-sm" style={{ color: '#2C1810' }}>#{o.orderId}</span>
                    <span className="text-sm ml-2" style={{ color: '#8B6E52' }}>{o.customerName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                      style={{ background: '#F5E6D3', color: '#8B3A0F' }}>{o.status}</span>
                    <span className="font-bold text-sm" style={{ color: '#C8862A' }}>ETB {o.totalAmount}</span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-center py-4 text-sm" style={{ color: '#8B6E52' }}>No recent orders</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
