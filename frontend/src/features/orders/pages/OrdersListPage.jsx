/**
 * OrdersListPage — The single Orders page for ALL roles
 *
 * HOW PERMISSIONS SHAPE THIS PAGE:
 *  - ORDERS_VIEW          → see the list (all roles that can access this route)
 *  - ORDERS_CREATE        → see "New Order" button
 *  - ORDERS_EDIT          → see status advancement buttons
 *  - ORDERS_PROCESS_PAYMENT → see "Process Payment" button (cashier)
 *  - ORDERS_DELETE        → see delete button (admin only)
 *
 * A waiter sees this page with Create + Edit.
 * A chef sees this page with only Edit (mark as ready).
 * A cashier sees this page with Process Payment.
 * Admin sees everything.
 *
 * ONE PAGE. MANY VIEWS. No duplication.
 */

import React, { useState } from 'react';
import { Plus, Search, RotateCcw } from 'lucide-react';
import { useOrders, useUpdateOrderStatus, useCreateOrder } from '../hooks/useOrders.js';
import { useOrderStore }   from '../store/useOrderStore.js';
import { useMenuItems }    from '../../menu/hooks/useMenu.js';
import { useTables }       from '../../tables/hooks/useTables.js';
import { usePermission }   from '../../../providers/PermissionProvider.jsx';
import { useAuth }         from '../../../providers/AuthProvider.jsx';
import { PERMISSIONS }     from '../../../permissions/matrix.js';
import Badge               from '../../../shared/components/ui/Badge.jsx';
import Spinner             from '../../../shared/components/ui/Spinner.jsx';
import Modal               from '../../../shared/components/ui/Modal.jsx';
import {
  getNextStatus, isTerminalStatus, formatOrderId,
  ALL_ORDER_STATUSES, calculateOrderTotal,
} from '../utils/orderUtils.js';

export default function OrdersListPage() {
  const { hasPermission } = usePermission();
  const { user } = useAuth();
  const { filters, setFilters, resetFilters, isCreatingOrder, setIsCreatingOrder } = useOrderStore();

  // Server state via React Query
  const { data: orders = [], isLoading } = useOrders(filters);
  const { data: menuItems = [] }         = useMenuItems();
  const { data: tables = [] }            = useTables();

  const updateStatus  = useUpdateOrderStatus();
  const createOrderMutation = useCreateOrder();

  // Local modal state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newForm, setNewForm] = useState({ customerName: '', tableId: '', type: 'dine-in', notes: '' });
  const [orderItems, setOrderItems] = useState([]);

  // Permissions
  const canCreate  = hasPermission(PERMISSIONS.ORDERS_CREATE);
  const canEdit    = hasPermission(PERMISSIONS.ORDERS_EDIT);
  const canPay     = hasPermission(PERMISSIONS.ORDERS_PROCESS_PAYMENT);
  const canDelete  = hasPermission(PERMISSIONS.ORDERS_DELETE);

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
    if (!newForm.customerName || orderItems.length === 0) return;
    const table = tables.find(t => t.tableId === Number(newForm.tableId));
    const items = orderItems.map(oi => {
      const menu = menuItems.find(m => m.itemId === oi.itemId);
      return { itemId: oi.itemId, itemName: menu?.name, quantity: oi.qty, unitPrice: menu?.price, subTotal: (menu?.price || 0) * oi.qty };
    });
    const totalAmount = calculateOrderTotal(items.map(i => ({ unitPrice: i.unitPrice, quantity: i.quantity })));
    const waiterData = user?.role === 'waiter'
      ? { waiterId: user.userId, waiterName: user.name }
      : {};
    createOrderMutation.mutate({
      customerName: newForm.customerName, tableId: table?.tableId, tableNumber: table?.number,
      type: newForm.type, totalAmount, notes: newForm.notes, items,
      ...waiterData,
    }, {
      onSuccess: () => {
        setIsCreatingOrder(false);
        setNewForm({ customerName: '', tableId: '', type: 'dine-in', notes: '' });
        setOrderItems([]);
      },
    });
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
        {canCreate && (
          <button onClick={() => setIsCreatingOrder(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)', color: 'white' }}>
            <Plus size={16} /> New Order
          </button>
        )}
      </div>

      {/* ── Filters ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1"
          style={{ background: 'white', border: '1px solid #E8D5C0' }}>
          <Search size={15} style={{ color: '#8B6E52' }} />
          <input
            value={filters.search || ''}
            onChange={e => setFilters({ search: e.target.value })}
            placeholder="Search orders..."
            className="bg-transparent text-sm outline-none flex-1"
            style={{ color: '#2C1810' }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {ALL_ORDER_STATUSES.map(s => (
            <button key={s} onClick={() => setFilters({ status: s })}
              className="px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all"
              style={filters.status === s
                ? { background: '#C8862A', color: 'white' }
                : { background: 'white', color: '#8B6E52', border: '1px solid #E8D5C0' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <select value={filters.type || 'all'} onChange={e => setFilters({ type: e.target.value })}
          className="px-3 py-2 rounded-xl text-xs font-medium outline-none capitalize"
          style={{ background: 'white', color: '#6B4F3A', border: '1px solid #E8D5C0' }}>
          <option value="all">All types</option>
          <option value="dine-in">Dine in</option>
          <option value="takeaway">Takeaway</option>
          <option value="delivery">Delivery</option>
        </select>
        <select value={filters.tableId || ''} onChange={e => setFilters({ tableId: e.target.value || null })}
          className="px-3 py-2 rounded-xl text-xs font-medium outline-none"
          style={{ background: 'white', color: '#6B4F3A', border: '1px solid #E8D5C0' }}>
          <option value="">All tables</option>
          {tables.map(t => <option key={t.tableId} value={t.tableId}>Table {t.number}</option>)}
        </select>
        <input type="date" value={filters.startDate || ''} onChange={e => setFilters({ startDate: e.target.value })}
          className="px-3 py-2 rounded-xl text-xs font-medium outline-none"
          style={{ background: 'white', color: '#6B4F3A', border: '1px solid #E8D5C0' }} />
        <input type="date" value={filters.endDate || ''} onChange={e => setFilters({ endDate: e.target.value })}
          className="px-3 py-2 rounded-xl text-xs font-medium outline-none"
          style={{ background: 'white', color: '#6B4F3A', border: '1px solid #E8D5C0' }} />
        <button type="button" onClick={resetFilters}
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-stone-100"
          style={{ background: 'white', color: '#8B6E52', border: '1px solid #E8D5C0' }}>
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* ── Orders Grid ────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-2 text-center py-16" style={{ color: '#8B6E52' }}>
              No orders found.
            </div>
          ) : filtered.map(order => {
            const nextStatus = getNextStatus(order.status);
            return (
              <div key={order.orderId}
                className="rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
                style={{ background: 'white', border: '1px solid #F0E8DE' }}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-base" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>
                        {formatOrderId(order.orderId)}
                      </span>
                      <Badge status={order.status} />
                      <Badge status={order.type} label={order.type} />
                    </div>
                    <p className="font-semibold text-sm" style={{ color: '#2C1810' }}>{order.customerName}</p>
                    <p className="text-xs" style={{ color: '#8B6E52' }}>
                      {order.tableNumber ? `Table ${order.tableNumber}` : order.type} · {new Date(order.orderDate).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-lg" style={{ color: '#C8862A', fontFamily: "'Playfair Display', serif" }}>
                      ETB {order.totalAmount}
                    </p>
                    <p className="text-xs" style={{ color: '#8B6E52' }}>{order.items?.length} items</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {order.items?.map(item => (
                    <span key={item.orderItemId} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: '#F5E6D3', color: '#8B6E52' }}>
                      {item.quantity}× {item.itemName}
                    </span>
                  ))}
                </div>

                {canEdit && nextStatus && order.status !== 'served' && (
                  <button onClick={e => { e.stopPropagation(); handleStatusAdvance(order.orderId, nextStatus); }}
                    className="w-full py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                    style={{ background: '#F0E8DE', color: '#8B3A0F' }}>
                    → Mark as {nextStatus}
                  </button>
                )}
                {canPay && order.status === 'served' && (
                  <button onClick={e => { e.stopPropagation(); handleStatusAdvance(order.orderId, 'paid'); }}
                    className="w-full py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 text-white"
                    style={{ background: 'linear-gradient(135deg, #059669, #065F46)' }}>
                    ✓ Process Payment
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Order Detail Modal ──────────────────────────────── */}
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order ${formatOrderId(selectedOrder?.orderId)}`} size="md">
        {selectedOrder && (
          <div className="space-y-4">
            <div className="space-y-2">
              {[
                { label: 'Customer', value: selectedOrder.customerName },
                { label: 'Table',    value: selectedOrder.tableNumber ? `Table ${selectedOrder.tableNumber}` : 'N/A' },
                { label: 'Type',     value: selectedOrder.type },
                { label: 'Status',   value: <Badge status={selectedOrder.status} /> },
                { label: 'Time',     value: new Date(selectedOrder.orderDate).toLocaleString() },
                { label: 'Notes',    value: selectedOrder.notes || '–' },
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
            <button onClick={() => setIsCreatingOrder(false)} className="flex-1 py-3 rounded-xl text-sm font-medium"
              style={{ background: '#F0E8DE', color: '#6B4F3A' }}>Cancel</button>
            <button onClick={handleCreateOrder} disabled={createOrderMutation.isPending}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)' }}>
              {createOrderMutation.isPending ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        }
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold" style={{ color: '#2C1810' }}>Order Details</h4>
            {[{ label: 'Customer Name', key: 'customerName', placeholder: 'Enter name' }].map(f => (
              <div key={f.key}>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>{f.label}</label>
                <input value={newForm[f.key]} onChange={e => setNewForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ border: '2px solid #E8D5C0', color: '#2C1810' }} />
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Order Type</label>
              <select value={newForm.type} onChange={e => setNewForm(p => ({ ...p, type: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ border: '2px solid #E8D5C0', color: '#2C1810', background: 'white' }}>
                <option value="dine-in">Dine In</option>
                <option value="takeaway">Takeaway</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
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
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ background: '#F0E8DE', color: '#8B6E52' }}>−</button>
                          <span className="font-bold" style={{ color: '#C8862A' }}>{oi.qty}</span>
                          <button onClick={() => addItemToOrder(oi.itemId)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
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
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {menuItems.filter(m => m.availability).map(item => (
                <button key={item.itemId} onClick={() => addItemToOrder(item.itemId)}
                  className="w-full flex items-center justify-between p-3 rounded-xl text-left transition-all hover:scale-[1.01]"
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
