import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, UtensilsCrossed, Table2, CreditCard, Package, Calendar, BarChart3, ChefHat, RefreshCw, ShieldCheck, Users, Activity, HardDrive, Server, AlertTriangle } from 'lucide-react';
import { useAuth }       from '../../../providers/AuthProvider.jsx';
import { usePermission } from '../../../providers/PermissionProvider.jsx';
import { PERMISSIONS }   from '../../../permissions/matrix.js';
import { useOrders, useOrderStats } from '../../orders/hooks/useOrders.js';
import { useTables }     from '../../tables/hooks/useTables.js';
import { usePaymentStats } from '../../payments/hooks/usePayments.js';
import { useUsers }      from '../../users/hooks/useUsers.js';
import { useQueryClient } from '@tanstack/react-query';
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

  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();
  const { data: users = [], isLoading: loadingUsersList, refetch: refetchUsersList, isFetching: fetchingUsersList } = useUsers({ enabled: isAdmin });

  const [isSimulatingCrash, setIsSimulatingCrash] = React.useState(localStorage.getItem('simulate_crash') === 'true');

  const toggleCrashSimulation = () => {
    const nextState = !isSimulatingCrash;
    setIsSimulatingCrash(nextState);
    if (nextState) {
      localStorage.setItem('simulate_crash', 'true');
    } else {
      localStorage.removeItem('simulate_crash');
    }
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const isChef = user?.role === 'chef';
  const { data: orders = [],  isLoading: loadingOrders, isFetching: fetchingOrders, refetch: refetchOrders }  = useOrders();
  const { data: tables = [],  isLoading: loadingTables, isFetching: fetchingTables, refetch: refetchTables }  = useTables({ enabled: hasPermission(PERMISSIONS.TABLES_VIEW) });
  const { data: orderStats, isFetching: fetchingOrderStats, refetch: refetchOrderStats }                              = useOrderStats();
  const { data: payStats, isFetching: fetchingPayStats, refetch: refetchPayStats }                                = usePaymentStats({ enabled: hasPermission(PERMISSIONS.PAYMENTS_VIEW) });

  const isFetching = isAdmin 
    ? fetchingUsersList 
    : (fetchingOrders || fetchingTables || fetchingOrderStats || fetchingPayStats);

  const handleRefresh = () => {
    if (isAdmin) {
      refetchUsersList();
    } else {
      refetchOrders();
      if (hasPermission(PERMISSIONS.TABLES_VIEW)) refetchTables();
      refetchOrderStats();
      if (hasPermission(PERMISSIONS.PAYMENTS_VIEW)) refetchPayStats();
    }
  };

  const roleColor = ROLE_COLORS[user?.role] || '#C8862A';
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const adminCount = users.filter(u => u.role === 'admin').length;
  const managerCount = users.filter(u => u.role === 'manager').length;
  const chefCount = users.filter(u => u.role === 'chef').length;
  const waiterCount = users.filter(u => u.role === 'waiter').length;
  const cashierCount = users.filter(u => u.role === 'cashier').length;
  const customerCount = users.filter(u => u.role === 'customer').length;

  if (isAdmin) {
    return (
      <div className="p-6 space-y-6">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>Admin Center</h2>
            <p className="text-sm" style={{ color: '#8B6E52' }}>System status & administrative telemetry</p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 disabled:opacity-50 cursor-pointer shadow-sm border border-[#E8D5C0]"
            style={{ background: '#FDF6EE', color: '#8B3A0F' }}
          >
            <RefreshCw size={15} className={isFetching ? 'animate-spin' : ''} />
            Refresh Telemetry
          </button>
        </div>

        {/* Greeting Banner */}
        <div className="rounded-3xl p-6" style={{ background: `linear-gradient(135deg, #1A1008, #2C1810)` }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-widest mb-1" style={{ color: '#C8862A' }}>Holy Restaurant ERP · System Root</p>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                {greeting}, Root {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-sm mt-1" style={{ color: '#8B6E52' }}>
                {new Date().toLocaleDateString('en-ET', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1">
              <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg"
                style={{ background: `linear-gradient(135deg, #7C3AED, #7C3AED88)` }}>
                AD
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: `#7C3AED20`, color: '#7C3AED' }}>
                System Admin
              </span>
            </div>
          </div>
        </div>

        {/* Telemetry Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl p-5 shadow-sm" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#8B6E52' }}>System Status</p>
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-emerald-50 text-emerald-600">
                <Activity size={18} />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-600" style={{ fontFamily: "'Playfair Display', serif" }}>Healthy</p>
            <p className="text-[11px] mt-1 text-gray-500">Uptime: 99.98% · 0 warnings</p>
          </div>

          <div className="rounded-2xl p-5 shadow-sm" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#8B6E52' }}>Staff Accounts</p>
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#C8862A]20 text-[#C8862A]">
                <Users size={18} />
              </div>
            </div>
            <p className="text-2xl font-black" style={{ color: '#C8862A', fontFamily: "'Playfair Display', serif" }}>
              {loadingUsersList ? '…' : users.filter(u => u.role !== 'customer').length}
            </p>
            <p className="text-[11px] mt-1 text-gray-500">Total accounts: {users.length}</p>
          </div>

          <div className="rounded-2xl p-5 shadow-sm" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#8B6E52' }}>Core Database</p>
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-emerald-50 text-emerald-600">
                <HardDrive size={18} />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-600" style={{ fontFamily: "'Playfair Display', serif" }}>Connected</p>
            <p className="text-[11px] mt-1 text-gray-500">Latency: 0.7ms · Pool size: 10</p>
          </div>

          <div className="rounded-2xl p-5 shadow-sm" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#8B6E52' }}>Server Memory</p>
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-sky-50 text-sky-600">
                <Server size={18} />
              </div>
            </div>
            <p className="text-2xl font-black text-sky-600" style={{ fontFamily: "'Playfair Display', serif" }}>Optimal</p>
            <p className="text-[11px] mt-1 text-gray-500">Usage: 23% (240MB / 1GB)</p>
          </div>
        </div>

        {/* Staff breakdown & Simulation Row */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Staff Breakdown */}
          <div className="md:col-span-2 rounded-2xl p-6 shadow-sm space-y-4" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
            <h3 className="font-bold text-base" style={{ color: '#2C1810' }}>Staff Distribution by Role</h3>
            <p className="text-xs text-gray-500 -mt-2">Real-time breakdown of authorized administrative and service accounts</p>
            
            <div className="space-y-3 pt-2">
              {[
                { role: 'admin', label: 'System Admin', count: adminCount, color: '#7C3AED' },
                { role: 'manager', label: 'Operations Manager', count: managerCount, color: '#0369A1' },
                { role: 'chef', label: 'Culinary Chef', count: chefCount, color: '#D97706' },
                { role: 'waiter', label: 'Dining Waiter', count: waiterCount, color: '#059669' },
                { role: 'cashier', label: 'Cashier/Billing', count: cashierCount, color: '#DC2626' },
              ].map(r => {
                const totalStaff = users.filter(u => u.role !== 'customer').length || 1;
                const percentage = Math.min(100, Math.round((r.count / totalStaff) * 100));
                return (
                  <div key={r.role} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span style={{ color: '#2C1810' }}>{r.label}</span>
                      <span style={{ color: r.color }}>{r.count} accounts ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ background: r.color, width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Control & Simulation Panel */}
          <div className="rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
            <div>
              <h3 className="font-bold text-base mb-1" style={{ color: '#2C1810' }}>System Simulation</h3>
              <p className="text-xs text-gray-500">Test how the security and notifications act under load or crash events.</p>
            </div>

            <div className="rounded-xl p-4 space-y-3" style={{ background: isSimulatingCrash ? '#FEF2F2' : '#FDF6EE', border: `1px solid ${isSimulatingCrash ? '#FCA5A5' : '#F0E8DE'}` }}>
              <div className="flex items-start gap-3">
                <AlertTriangle className={`mt-0.5 flex-shrink-0 ${isSimulatingCrash ? 'text-red-600 animate-pulse' : 'text-[#C8862A]'}`} size={18} />
                <div>
                  <h4 className={`text-xs font-bold ${isSimulatingCrash ? 'text-red-700' : 'text-amber-800'}`}>
                    {isSimulatingCrash ? 'SYSTEM CRASH SIMULATION ACTIVE' : 'System Uptime Active'}
                  </h4>
                  <p className="text-[10px] mt-0.5 leading-relaxed text-gray-600">
                    {isSimulatingCrash 
                      ? 'Admin notification center is now active and displaying critical hardware/software crash reports.'
                      : 'The notification center is quiet. Admin alerts are suppressed unless a system crash is detected.'
                    }
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleCrashSimulation}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-95 shadow-sm cursor-pointer mt-2"
                style={{
                  background: isSimulatingCrash ? '#DC2626' : '#2C1810',
                  color: 'white'
                }}
              >
                {isSimulatingCrash ? 'Disable Crash Simulation' : 'Simulate Critical Crash'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate(ROUTES.USERS)}
                className="text-xs font-semibold hover:opacity-85 transition-all"
                style={{ color: '#C8862A' }}
              >
                Go to User Accounts Manager →
              </button>
            </div>
          </div>
        </div>

        {/* Audit Log / Event Feed */}
        <div className="rounded-2xl p-6 shadow-sm space-y-4" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
          <h3 className="font-bold text-base" style={{ color: '#2C1810' }}>Core Operations Audit Log</h3>
          <div className="rounded-xl overflow-hidden border border-[#F0E8DE] bg-stone-900 p-4 font-mono text-xs text-stone-300 space-y-2 max-h-48 overflow-y-auto">
            <p className="text-emerald-400">[00:50:12] [SYSTEM] Telemetry initialized successfully.</p>
            <p className="text-[#C8862A]">[00:48:32] [SECURITY] Admin token refreshed for root user.</p>
            <p className="text-stone-400">[00:45:01] [DATABASE] Automated backup migration pool synchronized (0.8ms).</p>
            <p className={`transition-all duration-300 ${isSimulatingCrash ? 'text-red-500 font-bold' : 'text-stone-500'}`}>
              {isSimulatingCrash 
                ? '[00:50:45] [CRITICAL] [CRASH] Microservice socket timeout on Worker Node-03!'
                : '[00:30:15] [DIAGNOSTICS] Health score: 100/100. 0 logs flagged.'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }


  const activeOrders  = (orders || []).filter(o => o && !['paid', 'cancelled'].includes(o.status)).length;
  const pendingOrders = (orders || []).filter(o => o && o.status === 'pending').length;
  const servedOrders  = (orders || []).filter(o => o && o.status === 'served').length;
  const availableTbls = (tables || []).filter(t => t && t.status === 'available').length;

  const widgets = [
    hasPermission(PERMISSIONS.ORDERS_QUEUE_MANAGE) && {
      label: 'In Kitchen', value: loadingOrders ? '…' : activeOrders,
      icon: <ChefHat size={18} />, color: '#D97706', path: ROUTES.KITCHEN,
    },
    hasPermission(PERMISSIONS.ORDERS_VIEW) && !isChef && {
      label: 'Active Orders', value: loadingOrders ? '…' : activeOrders,
      icon: <ClipboardList size={18} />, color: '#C8862A', path: ROUTES.ORDERS,
    },
    hasPermission(PERMISSIONS.ORDERS_VIEW) && hasPermission(PERMISSIONS.PAYMENTS_VIEW) && {
      label: 'Awaiting Payment', value: loadingOrders ? '…' : servedOrders,
      icon: <CreditCard size={18} />, color: '#DC2626', path: ROUTES.PAYMENTS,
    },
    hasPermission(PERMISSIONS.TABLES_VIEW) && {
      label: 'Available Tables', value: loadingTables ? '…' : availableTbls,
      icon: <Table2 size={18} />, color: '#059669', path: ROUTES.TABLES,
    },
    hasPermission(PERMISSIONS.ORDERS_VIEW) && !isChef && {
      label: 'Pending Orders', value: loadingOrders ? '…' : pendingOrders,
      icon: <UtensilsCrossed size={18} />, color: '#D97706', path: ROUTES.ORDERS,
    },
  ].filter(Boolean);

  const quickLinks = [
    hasPermission(PERMISSIONS.ORDERS_QUEUE_MANAGE) && { label: 'Kitchen Queue',   icon: <ChefHat size={16} />, path: ROUTES.KITCHEN },
    hasPermission(PERMISSIONS.ORDERS_VIEW)       && { label: 'View Orders',       icon: <ClipboardList size={16} />, path: ROUTES.ORDERS },
    hasPermission(PERMISSIONS.MENU_VIEW)         && {
      label: hasPermission(PERMISSIONS.MENU_EDIT) ? 'Manage Menu' : 'View Menu',
      icon: <UtensilsCrossed size={16} />,
      path: ROUTES.MENU,
    },
    hasPermission(PERMISSIONS.INVENTORY_VIEW)    && { label: 'Check Inventory',    icon: <Package size={16} />, path: ROUTES.INVENTORY },
    hasPermission(PERMISSIONS.RESERVATIONS_VIEW) && { label: 'Reservations',       icon: <Calendar size={16} />, path: ROUTES.RESERVATIONS },
    hasPermission(PERMISSIONS.REPORTS_VIEW)      && { label: 'Analytics',           icon: <BarChart3 size={16} />, path: ROUTES.REPORTS },
  ].filter(Boolean);

  return (
    <div className="p-6 space-y-6">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>Dashboard</h2>
          <p className="text-sm" style={{ color: '#8B6E52' }}>Real-time operations & metrics overview</p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 disabled:opacity-50 cursor-pointer shadow-sm border border-[#E8D5C0]"
          style={{ background: '#FDF6EE', color: '#8B3A0F' }}
        >
          <RefreshCw size={15} className={isFetching ? 'animate-spin' : ''} />
          Refresh Data
        </button>
      </div>

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
            <button onClick={() => navigate(isChef ? ROUTES.KITCHEN : ROUTES.ORDERS)} className="text-xs font-semibold" style={{ color: '#C8862A' }}>View All →</button>
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
