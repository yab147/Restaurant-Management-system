import React, { useState } from 'react';
import { Plus, Search, RotateCcw, Grid, List, SlidersHorizontal, Check, Flame, Bell, Coffee, CreditCard, RefreshCw } from 'lucide-react';
import { useOrders, useUpdateOrderStatus, useCreateOrder } from '../hooks/useOrders.js';
import { useOrderStore } from '../store/useOrderStore.js';
import { useMenuItems } from '../../menu/hooks/useMenu.js';
import { useTables } from '../../tables/hooks/useTables.js';
import { usePermission } from '../../../providers/PermissionProvider.jsx';
import { useAuth } from '../../../providers/AuthProvider.jsx';
import { useLocalStorage } from '../../../hooks/index.js';
import { PERMISSIONS } from '../../../permissions/matrix.js';
import Badge from '../../../shared/components/ui/Badge.jsx';
import Spinner from '../../../shared/components/ui/Spinner.jsx';
import Modal from '../../../shared/components/ui/Modal.jsx';
import {
  getNextStatus, isTerminalStatus, formatOrderId,
  ALL_ORDER_STATUSES, calculateOrderTotal,
} from '../utils/orderUtils.js';

const STATUS_BUTTONS = {
  confirmed: { label: 'Confirm Order', icon: Check, bg: 'linear-gradient(135deg, #059669, #047857)', text: 'white' },
  preparing: { label: 'Start Cooking', icon: Flame, bg: 'linear-gradient(135deg, #D97706, #B45309)', text: 'white' },
  ready:     { label: 'Mark Ready', icon: Bell, bg: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', text: 'white' },
  served:    { label: 'Serve Order', icon: Coffee, bg: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', text: 'white' },
  paid:      { label: 'Process Payment', icon: CreditCard, bg: 'linear-gradient(135deg, #10B981, #047857)', text: 'white' },
};

export default function OrdersListPage() {
  const { hasPermission } = usePermission();
  const { user } = useAuth();
  const { filters, setFilters, resetFilters, isCreatingOrder, setIsCreatingOrder } = useOrderStore();

  // Server state via React Query
  const { data: orders = [], isLoading, isFetching, refetch } = useOrders(filters);
  const { data: menuItems = [] } = useMenuItems();
  const { data: tables = [] } = useTables();

  const updateStatus = useUpdateOrderStatus();
  const createOrderMutation = useCreateOrder();
  const [orderViewMode, setOrderViewMode] = useLocalStorage('ordersViewMode', 'grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Local modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newForm, setNewForm] = useState({ tableId: '', type: 'dine-in', phone: '', notes: '' });
  const [orderItems, setOrderItems] = useState([]);

  // Permissions
  const canCreate = hasPermission(PERMISSIONS.ORDERS_CREATE);
  const canEdit = hasPermission(PERMISSIONS.ORDERS_EDIT);
  const canPay = hasPermission(PERMISSIONS.ORDERS_PROCESS_PAYMENT);
  const canDelete = hasPermission(PERMISSIONS.ORDERS_DELETE);

  // Client-side search filter (server handles status/date filter)
  const filtered = (orders || []).filter(o => {
    const q = filters.search?.toLowerCase() || '';
    return !q || String(o.orderId).includes(q) || o.customerName?.toLowerCase().includes(q);
  });

  const handleStatusAdvance = (orderId, nextStatus) => {
    updateStatus.mutate({ orderId, status: nextStatus });
  };

  const addItemToOrder = (itemId) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.itemId === itemId);
      if (existing) return prev.map(i => i.itemId === itemId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { itemId, qty: 1 }];
    });
  };

  const handleCreateOrder = async () => {
    if (newForm.type === 'takeaway' && !newForm.phone) {
      toast.error('Phone number is required for Takeaway');
      return;
    }
    if (orderItems.length === 0) {
      toast.error('Please select at least one item');
      return;
    }
    const table = tables.find(t => t.tableId === Number(newForm.tableId));
    const customerName = newForm.type === 'takeaway'
      ? `Takeaway - ${newForm.phone}`
      : (table ? `Table ${table.number}` : 'Guest');

    const items = orderItems.map(oi => {
      const menu = menuItems.find(m => m.itemId === oi.itemId);
      return { itemId: oi.itemId, itemName: menu?.name || 'Unknown Item', quantity: oi.qty, unitPrice: Number(menu?.price) || 0, subTotal: (Number(menu?.price) || 0) * oi.qty };
    });
    const totalAmount = calculateOrderTotal(items.map(i => ({ unitPrice: i.unitPrice, quantity: i.quantity })));
    const waiterData = user?.role === 'waiter'
      ? { waiterId: user.userId, waiterName: user.name }
      : {};
    createOrderMutation.mutate({
      customerName, tableId: table?.tableId,
     tableNumber: table?.number,
      type: newForm.type, totalAmount, notes: newForm.notes, items,
      ...waiterData,
    }, {
      onSuccess: () => {
        setIsCreatingOrder(false);
        setNewForm({ tableId: '', type: 'dine-in', phone: '', notes: '' });
        setOrderItems([]);
      },
    });
  };

  const renderOrderCard = (order) => {
    const nextStatus = getNextStatus(order.status);
    const buttonConfig = nextStatus ? STATUS_BUTTONS[nextStatus] : null;

    return (
      <div key={order.orderId}
        className="rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer bg-white border border-[#F0E8DE] flex flex-col justify-between"
        onClick={() => setSelectedOrder(order)}
      >
        <div>
          <div className="flex items-start justify-between mb-3 gap-2">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="font-black text-base" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>
                  {formatOrderId(order.orderId)}
                </span>
                <Badge status={order.status} />
                <Badge status={order.type} label={order.type} />
              </div>
              <p className="font-bold text-sm" style={{ color: '#2C1810' }}>{order.customerName}</p>
              <p className="text-xs" style={{ color: '#8B6E52' }}>
                {order.tableNumber ? `Table ${order.tableNumber}` : order.type} · {new Date(order.orderDate).toLocaleTimeString()}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-black text-lg" style={{ color: '#C8862A', fontFamily: "'Playfair Display', serif" }}>
                ETB {order.totalAmount}
              </p>
              <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: '#8B6E52' }}>{order.items?.length || 0} items</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-5 mt-2">
            {order.items?.map(item => (
              <span key={item.orderItemId} className="text-xs px-2.5 py-1 rounded-lg font-medium"
                style={{ background: '#FAF0E6', color: '#8B6E52', border: '1px solid #F5E6D3' }}>
                {item.quantity}× {item.itemName}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        {nextStatus && (
          <div className="mt-auto">
            {canPay && nextStatus === 'paid' ? (
              <button onClick={e => { e.stopPropagation(); handleStatusAdvance(order.orderId, 'paid'); }}
                className="w-full py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] shadow-sm flex items-center justify-center gap-2 text-white cursor-pointer"
                style={{ background: STATUS_BUTTONS.paid.bg }}>
                {React.createElement(STATUS_BUTTONS.paid.icon, { size: 14 })}
                <span>{STATUS_BUTTONS.paid.label}</span>
              </button>
            ) : (
              canEdit && buttonConfig && (
                <button onClick={e => { e.stopPropagation(); handleStatusAdvance(order.orderId, nextStatus); }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] shadow-sm flex items-center justify-center gap-2 text-white cursor-pointer"
                  style={{ background: buttonConfig.bg }}>
                  {React.createElement(buttonConfig.icon, { size: 14 })}
                  <span>{buttonConfig.label}</span>
                </button>
              )
            )}
          </div>
        )}
      </div>
    );
  };

  const renderOrderListRow = (order) => {
    const nextStatus = getNextStatus(order.status);
    const buttonConfig = nextStatus ? STATUS_BUTTONS[nextStatus] : null;

    return (
      <div key={order.orderId}
        className="rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer bg-white border border-[#F0E8DE]"
        onClick={() => setSelectedOrder(order)}
      >
        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr_auto] items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-black text-sm" style={{ color: '#2C1810' }}>{formatOrderId(order.orderId)}</span>
              <Badge status={order.status} />
              <Badge status={order.type} label={order.type} />
            </div>
            <p className="text-sm font-bold" style={{ color: '#2C1810' }}>{order.customerName}</p>
            <p className="text-xs" style={{ color: '#8B6E52' }}>
              {order.tableNumber ? `Table ${order.tableNumber}` : order.type} · {new Date(order.orderDate).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-1 max-h-12 overflow-hidden">
            {order.items?.map(item => (
              <span key={item.orderItemId} className="text-[10px] px-2 py-0.5 rounded bg-stone-50 border border-stone-200 text-stone-600">
                {item.quantity}× {item.itemName}
              </span>
            ))}
          </div>
          <div className="text-right md:text-left">
            <p className="font-black text-base" style={{ color: '#C8862A' }}>ETB {order.totalAmount}</p>
            <p className="text-[10px] uppercase font-bold text-[#8B6E52]">{order.items?.length || 0} items</p>
          </div>
          <div className="flex gap-2">
            {nextStatus && (
              <>
                {canPay && nextStatus === 'paid' ? (
                  <button onClick={e => { e.stopPropagation(); handleStatusAdvance(order.orderId, 'paid'); }}
                    className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-102 flex items-center gap-1.5 text-white cursor-pointer shadow-sm"
                    style={{ background: STATUS_BUTTONS.paid.bg }}>
                    {React.createElement(STATUS_BUTTONS.paid.icon, { size: 13 })}
                    <span>Pay</span>
                  </button>
                ) : (
                  canEdit && buttonConfig && (
                    <button onClick={e => { e.stopPropagation(); handleStatusAdvance(order.orderId, nextStatus); }}
                      className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-102 flex items-center gap-1.5 text-white cursor-pointer shadow-sm"
                      style={{ background: buttonConfig.bg }}>
                      {React.createElement(buttonConfig.icon, { size: 13 })}
                      <span>{buttonConfig.label.split(' ')[0]}</span>
                    </button>
                  )
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-5">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>
            Orders
          </h2>
          <p className="text-sm" style={{ color: '#8B6E52' }}>
            {filtered.filter(o => !isTerminalStatus(o.status)).length} active orders
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm border border-[#E8D5C0]"
            style={{ background: '#F0E8DE', color: '#8B3A0F' }}
          >
            <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
            Refresh
          </button>
          {canCreate && (
            <button onClick={() => setIsCreatingOrder(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 shadow-sm cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)', color: 'white' }}>
              <Plus size={16} /> New Order
            </button>
          )}
          <div className="flex items-center gap-1 p-1 bg-amber-50/50 rounded-xl border border-amber-100 shadow-inner">
            <button key="grid" onClick={() => setOrderViewMode('grid')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${orderViewMode === 'grid' ? 'bg-[#C8862A] text-white shadow-sm' : 'text-[#8B6E52] hover:bg-amber-100/50'}`}
              title="Grid View">
              <Grid size={16} />
            </button>
            <button key="list" onClick={() => setOrderViewMode('list')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${orderViewMode === 'list' ? 'bg-[#C8862A] text-white shadow-sm' : 'text-[#8B6E52] hover:bg-amber-100/50'}`}
              title="List View">
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Bar ──────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="flex items-center gap-2 flex-1">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E8D5C0] flex-1 shadow-sm focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 transition-all">
            <Search size={16} className="text-[#8B6E52] flex-shrink-0" />
            <input
              value={filters.search || ''}
              onChange={e => setFilters({ search: e.target.value })}
              placeholder="Search orders by customer or ID..."
              className="bg-transparent text-sm outline-none w-full"
              style={{ color: '#2C1810' }}
            />
          </div>
          
          <button 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border shadow-sm cursor-pointer relative ${
              showAdvancedFilters 
                ? 'bg-amber-50 border-amber-400 text-[#8B3A0F] font-bold' 
                : 'bg-white border-[#E8D5C0] text-[#8B6E52] hover:bg-stone-50'
            }`}
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">Filters</span>
            {(filters.type !== 'all' || filters.tableId || filters.startDate || filters.endDate) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-600 border-2 border-white animate-pulse" />
            )}
          </button>
        </div>

        {/* Status filters */}
        <div className="flex gap-1.5 overflow-x-auto py-1 no-scrollbar flex-wrap">
          {ALL_ORDER_STATUSES.map(s => (
            <button key={s} onClick={() => setFilters({ status: s })}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold capitalize transition-all duration-200 cursor-pointer shadow-sm"
              style={filters.status === s
                ? { background: 'linear-gradient(135deg, #C8862A, #8B3A0F)', color: 'white' }
                : { background: 'white', color: '#8B6E52', border: '1px solid #E8D5C0' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Advanced Filters Drawer ─────────────────────────── */}
      {showAdvancedFilters && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-5 rounded-2xl border border-amber-100 shadow-inner transition-all duration-300" style={{ background: '#FAF6F0' }}>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">Order Type</label>
            <select value={filters.type || 'all'} onChange={e => setFilters({ type: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-medium outline-none bg-white border border-amber-200 text-amber-900 shadow-sm cursor-pointer focus:ring-2 focus:ring-amber-500/20 capitalize">
              <option value="all">All types</option>
              <option value="dine-in">Dine in</option>
              <option value="takeaway">Takeaway</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">Table</label>
            <select value={filters.tableId || ''} onChange={e => setFilters({ tableId: e.target.value || null })}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-medium outline-none bg-white border border-amber-200 text-amber-900 shadow-sm cursor-pointer focus:ring-2 focus:ring-amber-500/20">
              <option value="">All tables</option>
              {tables.map(t => <option key={t.tableId} value={t.tableId}>Table {t.number}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">Start Date</label>
            <input type="date" value={filters.startDate || ''} onChange={e => setFilters({ startDate: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-medium outline-none bg-white border border-amber-200 text-amber-900 shadow-sm cursor-pointer focus:ring-2 focus:ring-amber-500/20" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">End Date</label>
            <input type="date" value={filters.endDate || ''} onChange={e => setFilters({ endDate: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-medium outline-none bg-white border border-amber-200 text-amber-900 shadow-sm cursor-pointer focus:ring-2 focus:ring-amber-500/20" />
          </div>

          <div className="flex items-end">
            <button type="button" onClick={resetFilters}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] bg-amber-100 hover:bg-amber-200/70 text-amber-900 border border-amber-200 cursor-pointer shadow-sm">
              <RotateCcw size={13} /> Reset
            </button>
          </div>
        </div>
      )}

      {/* ── Orders Grid/List ────────────────────────────────── */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[#8B6E52] border border-dashed border-[#E8D5C0] rounded-2xl bg-stone-50/50">
          No orders found matching the filter criteria.
        </div>
      ) : orderViewMode === 'list' ? (
        <div className="space-y-4">
          {filtered.map(renderOrderListRow)}
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {filtered.map(renderOrderCard)}
        </div>
      )}

      {/* ── Order Detail Modal ──────────────────────────────── */}
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order ${formatOrderId(selectedOrder?.orderId)}`} size="md">
        {selectedOrder && (
          <div className="space-y-4">
            <div className="space-y-2">
              {[
                { label: 'Customer', value: selectedOrder.customerName },
                { label: 'Table', value: selectedOrder.tableNumber ? `Table ${selectedOrder.tableNumber}` : 'N/A' },
                { label: 'Type', value: selectedOrder.type },
                { label: 'Status', value: <Badge status={selectedOrder.status} /> },
                { label: 'Time', value: new Date(selectedOrder.orderDate).toLocaleString() },
                { label: 'Notes', value: selectedOrder.notes || '–' },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span style={{ color: '#8B6E52' }}>{row.label}</span>
                  <span className="font-medium capitalize" style={{ color: '#2C1810' }}>{row.value}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4" style={{ borderColor: '#F0E8DE' }}>
              <h4 className="font-bold mb-3" style={{ color: '#2C1810' }}>Items</h4>
              {selectedOrder.items?.map(item => (
                <div key={item.orderItemId} className="flex justify-between text-sm mb-2">
                  <span style={{ color: '#6B4F3A' }}>{item.quantity}× {item.itemName}</span>
                  <span className="font-semibold" style={{ color: '#C8862A' }}>ETB {item.subTotal}</span>
                </div>
              ))}
              <div className="flex justify-between font-black text-lg pt-3 border-t" style={{ borderColor: '#F0E8DE', color: '#2C1810' }}>
                <span>Total</span>
                <span style={{ color: '#C8862A' }}>ETB {selectedOrder.totalAmount}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── New Order Modal ─────────────────────────────────── */}
      <Modal isOpen={isCreatingOrder} onClose={() => setIsCreatingOrder(false)} title="New Order" size="lg"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setIsCreatingOrder(false)} className="flex-1 py-3 rounded-xl text-sm font-medium cursor-pointer"
              style={{ background: '#F0E8DE', color: '#6B4F3A' }}>Cancel</button>
            <button onClick={handleCreateOrder} disabled={createOrderMutation.isPending}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)' }}>
              {createOrderMutation.isPending ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        }
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold" style={{ color: '#2C1810' }}>Order Details</h4>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Order Type</label>
              <select value={newForm.type} onChange={e => setNewForm(p => ({ ...p, type: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ border: '2px solid #E8D5C0', color: '#2C1810', background: 'white' }}>
                <option value="dine-in">Dine In</option>
                <option value="takeaway">Takeaway</option>
              </select>
            </div>
            {newForm.type === 'takeaway' && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Phone Number *</label>
                <input value={newForm.phone || ''} onChange={e => setNewForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="Enter phone number" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ border: '2px solid #E8D5C0', color: '#2C1810' }} required />
              </div>
            )}
            {newForm.type === 'dine-in' && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Table</label>
                <select value={newForm.tableId} onChange={e => setNewForm(p => ({ ...p, tableId: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ border: '2px solid #E8D5C0', color: '#2C1810', background: 'white' }}>
                  <option value="">Select table</option>
                  {tables.filter(t => t.status === 'available').map(t => (
                    <option key={t.tableId} value={t.tableId}>Table {t.number} ({t.capacity} seats)</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Selected Items</label>
              {orderItems.length === 0 ? (
                <p className="text-xs" style={{ color: '#8B6E52' }}>No items selected</p>
              ) : (
                <div className="space-y-2">
                  {orderItems.map(oi => {
                    const menu = menuItems.find(m => m.itemId === oi.itemId);
                    return (
                      <div key={oi.itemId} className="flex items-center justify-between text-sm p-2 rounded-lg" style={{ background: '#FDF6EE' }}>
                        <span style={{ color: '#2C1810' }}>{menu?.name}</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setOrderItems(p => p.map(i => i.itemId === oi.itemId ? { ...i, qty: Math.max(0, i.qty - 1) } : i).filter(i => i.qty > 0))}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
                            style={{ background: '#F0E8DE', color: '#8B6E52' }}>−</button>
                          <span className="font-bold" style={{ color: '#C8862A' }}>{oi.qty}</span>
                          <button onClick={() => addItemToOrder(oi.itemId)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
                            style={{ background: '#C8862A', color: 'white' }}>+</button>
                          <span className="text-xs" style={{ color: '#C8862A' }}>ETB {(menu?.price || 0) * oi.qty}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3" style={{ color: '#2C1810' }}>Select Items</h4>
            <div className="space-y-2 max-h-80 overflow-y-auto animate-fadeIn">
              {menuItems.filter(m => m.availability).map(item => (
                <button key={item.itemId} onClick={() => addItemToOrder(item.itemId)}
                  className="w-full flex items-center justify-between p-3 rounded-xl text-left transition-all hover:scale-[1.01] cursor-pointer"
                  style={{ background: '#FDF6EE', border: '1px solid #F0E8DE' }}>
                  <div>
                    <p className="font-medium text-sm" style={{ color: '#2C1810' }}>{item.name}</p>
                    <p className="text-xs" style={{ color: '#8B6E52' }}>ETB {item.price}</p>
                  </div>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: '#C8862A', color: 'white' }}>+</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
